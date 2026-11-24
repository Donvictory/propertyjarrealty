import 'server-only';
import { TOOLS, runTool, newToolContext } from './tools';

export type ChatTurn = { role: 'user' | 'assistant'; text: string };
/** Receives reply text as it is generated. */
export type OnText = (delta: string) => void;

export class ProviderError extends Error {
  constructor(
    public provider: string,
    public status: number,
    message: string,
  ) {
    super(`${provider} ${status}: ${message}`);
  }
}

const MAX_STEPS = 6;
const TIMEOUT_MS = 45_000;

type Ctx = ReturnType<typeof newToolContext>;

/* ---------------- Gemini (primary, free tier) ---------------- */

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const geminiModel = () => process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';

type GeminiPart = {
  text?: string;
  thought?: boolean;
  functionCall?: { name: string; args?: Record<string, unknown>; id?: string };
  [k: string]: unknown;
};
type GeminiContent = { role: 'user' | 'model'; parts: GeminiPart[] };

function geminiKey() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new ProviderError('gemini', 0, 'GEMINI_API_KEY is not set');
  return key;
}

async function geminiCall(body: unknown): Promise<{ content?: GeminiContent; finishReason?: string }> {
  const res = await fetch(`${GEMINI_BASE}/models/${geminiModel()}:generateContent`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-goog-api-key': geminiKey() },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
    cache: 'no-store',
  });
  if (!res.ok) throw new ProviderError('gemini', res.status, (await res.text()).slice(0, 500));
  const data = await res.json();
  const cand = data?.candidates?.[0];
  return { content: cand?.content, finishReason: cand?.finishReason };
}

/** Streams one generateContent turn (server-sent events), yielding each chunk's parts as they arrive. */
async function* geminiStream(body: unknown): AsyncGenerator<GeminiPart[]> {
  const res = await fetch(`${GEMINI_BASE}/models/${geminiModel()}:streamGenerateContent?alt=sse`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-goog-api-key': geminiKey() },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
    cache: 'no-store',
  });
  if (!res.ok || !res.body) throw new ProviderError('gemini', res.status, (await res.text()).slice(0, 500));

  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = '';
  for (;;) {
    const { value, done } = await reader.read();
    if (value) buffer += value;
    const lines = buffer.split(/\r?\n/);
    buffer = done ? '' : (lines.pop() ?? '');
    for (const line of lines) {
      if (!line.startsWith('data:')) continue;
      const payload = line.slice(5).trim();
      if (!payload) continue;
      let data;
      try {
        data = JSON.parse(payload);
      } catch {
        continue;
      }
      if (data?.error) throw new ProviderError('gemini', data.error.code ?? 500, String(data.error.message ?? 'stream error'));
      const parts: GeminiPart[] | undefined = data?.candidates?.[0]?.content?.parts;
      if (parts?.length) yield parts;
    }
    if (done) return;
  }
}

const geminiText = (parts: GeminiPart[] = []) =>
  parts
    .filter((p) => typeof p.text === 'string' && !p.thought)
    .map((p) => p.text)
    .join('')
    .trim();

function geminiTools() {
  // Gemini rejects an object schema with no properties, so argument-less tools omit `parameters`.
  return [
    {
      functionDeclarations: TOOLS.map((t) =>
        Object.keys(t.parameters.properties).length ? t : { name: t.name, description: t.description },
      ),
    },
  ];
}

/**
 * Runs the conversation with tool calls, streaming reply text through `onText` as it is generated.
 * Returns the full reply text.
 */
export async function chatWithGemini(system: string, history: ChatTurn[], ctx: Ctx, onText: OnText): Promise<string> {
  const contents: GeminiContent[] = history.map((t) => ({ role: t.role === 'assistant' ? 'model' : 'user', parts: [{ text: t.text }] }));
  const tools = geminiTools();
  let full = '';
  let needBreak = false;

  for (let step = 0; step < MAX_STEPS; step++) {
    const parts: GeminiPart[] = [];
    for await (const chunk of geminiStream({
      systemInstruction: { parts: [{ text: system }] },
      contents,
      tools,
      generationConfig: { maxOutputTokens: 2048 },
    })) {
      for (const part of chunk) {
        parts.push(part);
        if (typeof part.text === 'string' && part.text && !part.thought && !part.functionCall) {
          // Text from an earlier step ("Let me check…") gets a paragraph break before the answer.
          const delta = needBreak && full ? `\n\n${part.text.trimStart()}` : part.text;
          needBreak = false;
          full += delta;
          onText(delta);
        }
      }
    }

    const calls = parts.filter((p) => p.functionCall);
    if (!calls.length) {
      if (full.trim()) return full.trim();
      throw new ProviderError('gemini', 200, 'empty reply');
    }
    needBreak = true;
    // Echo the model turn back unchanged: it carries the thought signatures newer models require.
    contents.push({ role: 'model', parts });
    const results = await Promise.all(
      calls.map(async ({ functionCall: fc }) => ({
        functionResponse: {
          name: fc!.name,
          ...(fc!.id ? { id: fc!.id } : {}),
          response: { result: await runTool(fc!.name, fc!.args ?? {}, ctx) },
        },
      })),
    );
    contents.push({ role: 'user', parts: results });
  }
  throw new ProviderError('gemini', 200, 'too many tool steps');
}

/** Turns a short voice note into text in whatever language was spoken. */
export async function transcribeWithGemini(mimeType: string, base64: string): Promise<string> {
  const { content } = await geminiCall({
    contents: [
      {
        role: 'user',
        parts: [
          { inlineData: { mimeType, data: base64 } },
          {
            text: 'Transcribe this voice message word for word, in the language it is spoken in (it may be English, Nigerian Pidgin, Yoruba, Igbo or Hausa, or a mix). Reply with only the transcript, no notes or translation. If there is no clear speech, reply with nothing.',
          },
        ],
      },
    ],
    generationConfig: { maxOutputTokens: 1024 },
  });
  return geminiText(content?.parts);
}

/* ---------------- Grok (optional backup, OpenAI-compatible API) ---------------- */

const XAI_URL = 'https://api.x.ai/v1/chat/completions';
const xaiModel = () => process.env.XAI_MODEL || 'grok-4.3';

type OAIMessage = {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | null;
  tool_calls?: { id: string; type: 'function'; function: { name: string; arguments: string } }[];
  tool_call_id?: string;
};

export const grokAvailable = () => Boolean(process.env.XAI_API_KEY);

/** Backup only, so not streamed: the finished reply is handed to `onText` in one piece. */
export async function chatWithGrok(system: string, history: ChatTurn[], ctx: Ctx, onText: OnText): Promise<string> {
  const key = process.env.XAI_API_KEY;
  if (!key) throw new ProviderError('grok', 0, 'XAI_API_KEY is not set');
  const messages: OAIMessage[] = [{ role: 'system', content: system }, ...history.map((t) => ({ role: t.role, content: t.text }))];
  const tools = TOOLS.map((t) => ({ type: 'function' as const, function: t }));

  for (let step = 0; step < MAX_STEPS; step++) {
    const res = await fetch(XAI_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: xaiModel(), messages, tools, max_tokens: 2048 }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: 'no-store',
    });
    if (!res.ok) throw new ProviderError('grok', res.status, (await res.text()).slice(0, 500));
    const msg: OAIMessage | undefined = (await res.json())?.choices?.[0]?.message;
    if (!msg) throw new ProviderError('grok', 200, 'no message');
    if (!msg.tool_calls?.length) {
      const text = (msg.content ?? '').trim();
      if (!text) throw new ProviderError('grok', 200, 'empty reply');
      onText(text);
      return text;
    }
    messages.push({ role: 'assistant', content: msg.content ?? null, tool_calls: msg.tool_calls });
    for (const call of msg.tool_calls) {
      let args: Record<string, unknown> = {};
      try {
        args = JSON.parse(call.function.arguments || '{}');
      } catch {
        /* run with no arguments */
      }
      const result = await runTool(call.function.name, args, ctx);
      messages.push({ role: 'tool', tool_call_id: call.id, content: JSON.stringify(result) });
    }
  }
  throw new ProviderError('grok', 200, 'too many tool steps');
}
