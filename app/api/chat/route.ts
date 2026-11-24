import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limit';
import { systemPrompt } from '@/lib/chat/system-prompt';
import { newToolContext, type ChatPropertyCard } from '@/lib/chat/tools';
import {
  chatWithGemini,
  chatWithGrok,
  grokAvailable,
  ProviderError,
  transcribeWithGemini,
  type ChatTurn,
} from '@/lib/chat/providers';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// ~90 s of compressed speech; base64 is 4/3 the size of the audio.
const MAX_AUDIO_B64 = 3_000_000;
const AUDIO_TYPES: Record<string, string> = {
  'audio/webm': 'audio/webm',
  'audio/ogg': 'audio/ogg',
  'audio/mp4': 'audio/m4a',
  'audio/m4a': 'audio/m4a',
  'audio/x-m4a': 'audio/m4a',
  'audio/aac': 'audio/aac',
  'audio/mpeg': 'audio/mpeg',
  'audio/wav': 'audio/wav',
};

const Body = z.object({
  messages: z
    .array(z.object({ role: z.enum(['user', 'assistant']), text: z.string().trim().min(1).max(4000) }))
    .max(40),
  audio: z.object({ mimeType: z.string().max(80), data: z.string().max(MAX_AUDIO_B64) }).optional(),
  page: z.string().max(200).optional(),
});

const json = (data: unknown, status = 200) =>
  Response.json(data, { status, headers: { 'cache-control': 'no-store' } });

function clientIp(req: Request) {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
}

/** Shows cards for listings the reply actually talks about (by link or by name), at most three. */
function cardsFor(reply: string, seen: Map<string, ChatPropertyCard>): ChatPropertyCard[] {
  const lower = reply.toLowerCase();
  return [...seen.values()]
    .filter((c) => reply.includes(c.url) || lower.includes(c.title.toLowerCase()))
    .slice(0, 3);
}

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY && !grokAvailable()) {
    return json({ error: 'The assistant isn’t set up yet. Message us on WhatsApp instead.' }, 503);
  }

  const ip = clientIp(req);
  if (!rateLimit(`chat:${ip}`, 10, 60_000).allowed) {
    return json({ error: 'You’re sending messages quickly. Wait a minute and try again.' }, 429);
  }

  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch {
    return json({ error: 'That message couldn’t be read. Refresh the page and try again.' }, 400);
  }

  // Only the most recent turns are sent, and the conversation must end on the visitor.
  const history: ChatTurn[] = body.messages.slice(-20);
  let transcript: string | undefined;

  if (body.audio) {
    const mime = AUDIO_TYPES[body.audio.mimeType.split(';')[0].trim().toLowerCase()];
    if (!mime) return json({ error: 'That recording format isn’t supported. Type your message instead.' }, 400);
    if (!process.env.GEMINI_API_KEY) return json({ error: 'Voice messages aren’t available right now. Type your message instead.' }, 503);
    try {
      transcript = (await transcribeWithGemini(mime, body.audio.data)).slice(0, 4000);
    } catch (err) {
      console.error('chat transcribe', err);
      const busy = err instanceof ProviderError && err.status === 429;
      return json({ error: busy ? 'The assistant is busy. Try again in a minute.' : 'We couldn’t hear that. Try again or type your message.' }, busy ? 429 : 502);
    }
    if (!transcript) return json({ error: 'We couldn’t hear any speech. Try again closer to the mic, or type.' }, 422);
    history.push({ role: 'user', text: transcript });
  }

  if (!history.length || history[history.length - 1].role !== 'user') {
    return json({ error: 'Type a message to start.' }, 400);
  }

  const system = systemPrompt();
  const ctx = newToolContext(body.page);
  const encoder = new TextEncoder();

  /*
   * Newline-delimited JSON events, so the reply shows up while it is being written:
   *   {type:"transcript",text} · {type:"delta",text} · {type:"cards",properties} · {type:"error",error} · {type:"done"}
   */
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: Record<string, unknown>) => controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      if (transcript) send({ type: 'transcript', text: transcript });

      let streamed = '';
      const onText = (delta: string) => {
        streamed += delta;
        send({ type: 'delta', text: delta });
      };
      let reply: string | undefined;

      if (process.env.GEMINI_API_KEY) {
        try {
          reply = await chatWithGemini(system, history, ctx, onText);
        } catch (err) {
          console.error('chat gemini', err);
        }
      }
      // Fall back to Grok only if nothing has been shown yet; otherwise the two answers would run together.
      if (!reply && !streamed && grokAvailable()) {
        try {
          reply = await chatWithGrok(system, history, ctx, onText);
        } catch (err) {
          console.error('chat grok', err);
        }
      }

      if (reply) {
        send({ type: 'cards', properties: cardsFor(reply, ctx.seen) });
      } else {
        send({
          type: 'error',
          error: streamed
            ? 'The answer was cut off. Ask again to get the rest.'
            : 'The assistant can’t answer right now. Try again shortly, or message us on WhatsApp.',
        });
      }
      send({ type: 'done' });
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'content-type': 'application/x-ndjson; charset=utf-8',
      'cache-control': 'no-store',
      'x-accel-buffering': 'no',
    },
  });
}
