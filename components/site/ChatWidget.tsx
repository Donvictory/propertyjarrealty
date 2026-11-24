'use client';

import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUp, MessageCircle, Mic, Square, Trash2, X } from 'lucide-react';

type Card = { id: string; title: string; location: string; price: string; url: string; image: string };
type Msg = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  voice?: boolean;
  cards?: Card[];
  error?: boolean;
  /** Arrived in this visit, so it types out word by word (restored messages show in full). */
  live?: boolean;
  /** Still receiving text from the server. */
  streaming?: boolean;
};

const STORE_KEY = 'pjr-chat-v1';
const MAX_RECORD_S = 60;
const SUGGESTIONS = [
  'What properties do you have in Lekki?',
  'Show me land under ₦20 million',
  'What is a C of O?',
  'How do I book a short-let?',
];

const uid = () => Math.random().toString(36).slice(2, 10);
/** Wall clock for the recording timer (kept outside the component; only used in event handlers). */
const now = () => Date.now();

function loadMessages(): Msg[] {
  try {
    const raw = sessionStorage.getItem(STORE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/* ---------------- tiny, safe markdown: **bold**, [links](/path), "- " lists ---------------- */

function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        const bold = part.match(/^\*\*([^*]+)\*\*$/);
        if (bold) return <strong key={i} className="font-semibold">{bold[1]}</strong>;
        const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
        if (link) {
          const [, label, href] = link;
          const cls = 'font-medium text-brand underline underline-offset-2';
          if (href.startsWith('/') && !href.startsWith('//')) return <Link key={i} href={href} className={cls}>{label}</Link>;
          if (href.startsWith('https://'))
            return <a key={i} href={href} target="_blank" rel="noopener noreferrer" className={cls}>{label}</a>;
          return <Fragment key={i}>{label}</Fragment>;
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

/**
 * While text is still arriving, hide half-written markup: an unfinished [link](…) is held back until it
 * closes, and an unclosed ** is closed so the words show bold rather than with stray asterisks.
 */
function closePartial(text: string): string {
  let t = text;
  const open = t.lastIndexOf('[');
  if (open >= 0 && !/^\[[^\]]+\]\([^)\s]+\)/.test(t.slice(open))) t = t.slice(0, open);
  if ((t.match(/\*\*/g)?.length ?? 0) % 2 === 1) t += '**';
  return t;
}

/** Reveals `text` one word at a time, speeding up if it falls far behind what has arrived. */
function TypedText({ text, streaming, onProgress }: { text: string; streaming: boolean; onProgress: () => void }) {
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduceMotion || count >= text.length) return;
    const id = setTimeout(() => {
      const backlog = text.length - count;
      const words = backlog > 400 ? 4 : backlog > 150 ? 2 : 1;
      const re = /\s*\S+/y;
      re.lastIndex = count;
      let next = count;
      for (let w = 0; w < words; w++) {
        if (!re.exec(text)) {
          next = text.length;
          break;
        }
        next = re.lastIndex;
      }
      setCount(next);
    }, 35);
    return () => clearTimeout(id);
  }, [count, text, reduceMotion]);

  useEffect(onProgress, [count, onProgress]);

  const shown = reduceMotion ? text : text.slice(0, count);
  return <RichText text={streaming || shown.length < text.length ? closePartial(shown) : shown} />;
}

function RichText({ text }: { text: string }) {
  const blocks: { list: boolean; lines: string[] }[] = [];
  for (const line of text.split('\n')) {
    const item = line.match(/^\s*(?:[-*•]|\d+[.)])\s+(.*)$/);
    const last = blocks[blocks.length - 1];
    if (item) {
      if (last?.list) last.lines.push(item[1]);
      else blocks.push({ list: true, lines: [item[1]] });
    } else if (line.trim()) {
      if (last && !last.list) last.lines.push(line);
      else blocks.push({ list: false, lines: [line] });
    } else {
      blocks.push({ list: false, lines: [] });
    }
  }
  return (
    <div className="space-y-2">
      {blocks
        .filter((b) => b.lines.length)
        .map((b, i) =>
          b.list ? (
            <ul key={i} className="list-disc space-y-1 pl-5">
              {b.lines.map((l, j) => <li key={j}><Inline text={l} /></li>)}
            </ul>
          ) : (
            <p key={i}>{b.lines.map((l, j) => <Fragment key={j}>{j > 0 && <br />}<Inline text={l} /></Fragment>)}</p>
          ),
        )}
    </div>
  );
}

/* ---------------- voice recording ---------------- */

function pickMime(): string | undefined {
  if (typeof MediaRecorder === 'undefined') return undefined;
  return ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'].find((t) => MediaRecorder.isTypeSupported(t));
}

const toBase64 = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(',')[1] ?? '');
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });

/* ---------------- widget ---------------- */

export default function ChatWidget() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const [canRecord, setCanRecord] = useState(false);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);

  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const cancelRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const messagesRef = useRef<Msg[]>([]);

  // Restore this tab's conversation, and check mic support, after hydration.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only state, read once after mount
    setMessages(loadMessages());
    setCanRecord(Boolean(navigator.mediaDevices?.getUserMedia) && Boolean(pickMime()));
  }, []);

  useEffect(() => {
    messagesRef.current = messages;
    try {
      sessionStorage.setItem(
        STORE_KEY,
        JSON.stringify(messages.filter((m) => !m.streaming).slice(-40).map((m) => ({ ...m, live: undefined }))),
      );
    } catch {
      /* storage full or blocked: the chat still works for this page */
    }
  }, [messages]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [messages, pending, open, reduceMotion]);

  // Keep the newest words in view while a reply types out, unless the reader has scrolled up.
  const stickToBottom = useCallback(() => {
    const el = listRef.current;
    if (el && el.scrollHeight - el.scrollTop - el.clientHeight < 160) el.scrollTop = el.scrollHeight;
  }, []);

  const stopTracks = () => {
    recorderRef.current?.stream.getTracks().forEach((t) => t.stop());
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const close = useCallback(() => {
    if (recorderRef.current?.state === 'recording') {
      cancelRef.current = true;
      recorderRef.current.stop();
    }
    setOpen(false);
    // The launcher mounts again on the next frame; return focus to it then.
    requestAnimationFrame(() => launcherRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close]);

  // Stop any recording if the widget unmounts.
  useEffect(() => () => stopTracks(), []);

  async function send(text: string | null, audio?: { mimeType: string; data: string; seconds: number }) {
    if (pending) return;
    // Read through the ref: a voice note's onstop handler was created before later messages arrived.
    const history = messagesRef.current.filter((m) => !m.error).map(({ role, text }) => ({ role, text }));
    const userMsg: Msg = audio
      ? { id: uid(), role: 'user', text: `Voice message (0:${String(audio.seconds).padStart(2, '0')})`, voice: true }
      : { id: uid(), role: 'user', text: text! };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setNotice(null);
    setPending(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          messages: audio ? history : [...history, { role: 'user', text }],
          audio: audio ? { mimeType: audio.mimeType, data: audio.data } : undefined,
          page: pathname ?? undefined,
        }),
      });
      const isStream = res.ok && res.body && (res.headers.get('content-type') ?? '').includes('ndjson');
      if (!isStream) {
        const data = await res.json().catch(() => ({}));
        // Nothing usable was heard or sent: drop the voice placeholder so it isn't sent as history.
        if (audio) setMessages((m) => m.filter((x) => x.id !== userMsg.id));
        setMessages((m) => [
          ...m,
          { id: uid(), role: 'assistant', error: true, text: data.error || 'Something went wrong. Try again in a moment.' },
        ]);
        return;
      }

      const replyId = uid();
      setMessages((m) => [...m, { id: replyId, role: 'assistant', text: '', live: true, streaming: true }]);
      const patchReply = (fn: (x: Msg) => Msg) => setMessages((m) => m.map((x) => (x.id === replyId ? fn(x) : x)));
      let errorText: string | null = null;

      const reader = res.body!.pipeThrough(new TextDecoderStream()).getReader();
      let buffer = '';
      for (;;) {
        const { value, done } = await reader.read();
        if (value) buffer += value;
        const lines = buffer.split('\n');
        buffer = done ? '' : (lines.pop() ?? '');
        for (const line of lines) {
          if (!line.trim()) continue;
          let event: { type: string; text?: string; properties?: Card[]; error?: string };
          try {
            event = JSON.parse(line);
          } catch {
            continue;
          }
          if (event.type === 'transcript' && event.text) {
            const t = event.text;
            setMessages((m) => m.map((x) => (x.id === userMsg.id ? { ...x, text: t } : x)));
          } else if (event.type === 'delta' && event.text) {
            const t = event.text;
            patchReply((x) => ({ ...x, text: x.text + t }));
          } else if (event.type === 'cards') {
            const cards = event.properties;
            patchReply((x) => ({ ...x, cards }));
          } else if (event.type === 'error') {
            errorText = event.error || 'Something went wrong. Try again in a moment.';
          }
        }
        if (done) break;
      }

      // Finished: drop an empty reply, and add any error underneath what did arrive.
      const finalError = errorText;
      setMessages((m) => {
        const next = m
          .map((x) => (x.id === replyId ? { ...x, streaming: false } : x))
          .filter((x) => x.id !== replyId || x.text.trim());
        return finalError ? [...next, { id: uid(), role: 'assistant' as const, error: true, text: finalError }] : next;
      });
    } catch {
      // Keep whatever part of the reply arrived; drop an empty one, and a voice note nobody heard.
      setMessages((m) => [
        ...m
          .filter((x) => !(audio && x.id === userMsg.id && x.text.startsWith('Voice message')))
          .filter((x) => !(x.streaming && !x.text.trim()))
          .map((x) => (x.streaming ? { ...x, streaming: false } : x)),
        { id: uid(), role: 'assistant', error: true, text: 'The connection dropped. Check your connection and try again.' },
      ]);
    } finally {
      setPending(false);
    }
  }

  async function startRecording() {
    setNotice(null);
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setNotice('Allow microphone access in your browser to send a voice message.');
      return;
    }
    const mimeType = pickMime();
    const rec = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    recorderRef.current = rec;
    chunksRef.current = [];
    cancelRef.current = false;
    const started = now();
    rec.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
    rec.onstop = async () => {
      stopTracks();
      setRecording(false);
      const secs = Math.max(1, Math.round((now() - started) / 1000));
      if (cancelRef.current) return;
      if (secs < 1 || !chunksRef.current.length) return;
      const blob = new Blob(chunksRef.current, { type: rec.mimeType || mimeType || 'audio/webm' });
      try {
        await send(null, { mimeType: blob.type, data: await toBase64(blob), seconds: Math.min(secs, MAX_RECORD_S) });
      } catch {
        setNotice('That recording couldn’t be sent. Try again or type your message.');
      }
    };
    rec.start();
    setSeconds(0);
    setRecording(true);
    timerRef.current = setInterval(() => {
      const s = Math.round((now() - started) / 1000);
      setSeconds(s);
      if (s >= MAX_RECORD_S && rec.state === 'recording') rec.stop();
    }, 250);
  }

  const stopRecording = (cancel: boolean) => {
    cancelRef.current = cancel;
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
  };

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (text && !pending) send(text);
  };

  const clearChat = () => {
    setMessages([]);
    setNotice(null);
    inputRef.current?.focus();
  };

  const panelMotion = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0 } }
    : {
        initial: { opacity: 0, y: 24, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 24, scale: 0.98 },
        transition: { type: 'spring' as const, stiffness: 420, damping: 36 },
      };

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            ref={launcherRef}
            key="launcher"
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Ask PropertyJar, our AI assistant"
            aria-expanded={open}
            aria-controls="pjr-chat"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
            className="fixed bottom-4 right-4 z-40 flex h-14 items-center gap-2.5 rounded-full bg-ink pl-4 pr-5 text-sm font-medium text-paper shadow-[0_12px_32px_rgba(28,28,27,0.28)] outline-none transition-colors hover:bg-brand focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-paper sm:bottom-6 sm:right-6"
          >
            <MessageCircle size={20} strokeWidth={1.75} aria-hidden />
            <span>Ask us</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.section
            key="panel"
            id="pjr-chat"
            role="dialog"
            aria-label="PropertyJar assistant"
            {...panelMotion}
            style={{ transformOrigin: 'bottom right' }}
            className="fixed inset-0 z-[70] flex flex-col bg-paper text-ink sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[min(640px,calc(100svh-7rem))] sm:w-[400px] sm:overflow-hidden sm:rounded-2xl sm:border sm:border-line sm:shadow-[0_30px_80px_rgba(28,28,27,0.3)]"
          >
            {/* Header */}
            <header className="flex items-center gap-3 bg-ink px-4 py-3 text-paper pt-[max(0.75rem,env(safe-area-inset-top))]">
              <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand">
                <MessageCircle size={18} strokeWidth={1.75} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">PropertyJar assistant</p>
                <p className="text-xs text-paper/60">Listings, prices and property questions</p>
              </div>
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={clearChat}
                  aria-label="Start a new chat"
                  title="Start a new chat"
                  className="flex h-10 w-10 items-center justify-center text-paper/70 hover:text-paper"
                >
                  <Trash2 size={17} strokeWidth={1.5} />
                </button>
              )}
              <button
                type="button"
                onClick={close}
                aria-label="Close chat"
                className="-mr-1 flex h-10 w-10 items-center justify-center text-paper/80 hover:text-paper"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </header>

            {/* Messages */}
            <div ref={listRef} aria-live="polite" className="flex-1 overflow-y-auto overscroll-contain px-4 py-5">
              {messages.length === 0 ? (
                <div>
                  <p className="text-[15px] leading-relaxed">
                    Hi. Ask about our properties, prices and payment plans, or anything about buying, renting and
                    investing in Lagos property.
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    Type or send a voice note in English, Pidgin, Yoruba, Igbo or Hausa.
                  </p>
                  <ul className="mt-5 flex flex-col items-start gap-2">
                    {SUGGESTIONS.map((s) => (
                      <li key={s}>
                        <button
                          type="button"
                          onClick={() => send(s)}
                          className="rounded-lg border border-line px-3 py-2 text-left text-sm hover:border-ink"
                        >
                          {s}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <ol className="space-y-4">
                  {messages.filter((m) => m.role === 'user' || m.text).map((m) => (
                    <li key={m.id} className={m.role === 'user' ? 'flex justify-end' : ''}>
                      {m.role === 'user' ? (
                        <div className="max-w-[85%] whitespace-pre-wrap break-words bg-ink px-3.5 py-2.5 text-[15px] leading-relaxed text-paper">
                          {m.voice && <Mic size={13} className="mr-1.5 inline -translate-y-px" aria-label="Voice message:" />}
                          {m.text}
                        </div>
                      ) : (
                        <div className="max-w-[92%]">
                          <div
                            className={`break-words text-[15px] leading-relaxed ${m.error ? 'border-l-2 border-brand pl-3 text-brand' : ''}`}
                          >
                            {m.live && !m.error ? (
                              <TypedText text={m.text} streaming={Boolean(m.streaming)} onProgress={stickToBottom} />
                            ) : (
                              <RichText text={m.text} />
                            )}
                          </div>
                          {!m.streaming && m.cards && m.cards.length > 0 && (
                            <ul className="mt-3 space-y-2">
                              {m.cards.map((c) => (
                                <li key={c.id}>
                                  <Link href={c.url} className="group flex items-center gap-3 rounded-lg border border-line bg-paper p-2 hover:border-ink">
                                    {/* eslint-disable-next-line @next/next/no-img-element -- generated SVG artwork */}
                                    <img src={c.image} alt="" className="h-12 w-[72px] shrink-0 rounded-md bg-ink object-cover" />
                                    <span className="min-w-0">
                                      <span className="block truncate text-sm font-medium group-hover:text-brand">{c.title}</span>
                                      <span className="block truncate text-xs text-muted">
                                        {c.price} · {c.location}
                                      </span>
                                    </span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                  {pending && !messages.some((m) => m.streaming && m.text) && (
                    <li aria-label="The assistant is typing" className="flex gap-1.5 py-2">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="h-1.5 w-1.5 rounded-full bg-muted motion-safe:animate-pulse"
                          style={{ animationDelay: `${i * 180}ms` }}
                        />
                      ))}
                    </li>
                  )}
                </ol>
              )}
            </div>

            {/* Composer */}
            <div className="border-t border-line px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
              {notice && <p className="mb-2 px-1 text-xs text-brand">{notice}</p>}
              {recording ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => stopRecording(true)}
                    aria-label="Cancel voice message"
                    className="flex h-11 w-11 shrink-0 items-center justify-center text-muted hover:text-ink"
                  >
                    <Trash2 size={18} strokeWidth={1.5} />
                  </button>
                  <div className="flex flex-1 items-center gap-2.5 text-sm" role="status">
                    <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-brand motion-safe:animate-pulse" />
                    Recording 0:{String(seconds).padStart(2, '0')}
                    <span className="text-xs text-muted">/ 1:00</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => stopRecording(false)}
                    className="rounded-lg flex h-11 shrink-0 items-center gap-2 bg-brand px-4 text-sm font-medium text-white"
                  >
                    <Square size={12} fill="currentColor" aria-hidden />
                    Send
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="flex items-end gap-2">
                  <label htmlFor="pjr-chat-input" className="sr-only">
                    Your message
                  </label>
                  <textarea
                    ref={inputRef}
                    id="pjr-chat-input"
                    rows={1}
                    value={input}
                    maxLength={2000}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                        e.preventDefault();
                        submit();
                      }
                    }}
                    placeholder="Ask about a property…"
                    className="max-h-32 min-h-11 flex-1 resize-none border border-line bg-paper px-3 py-2.5 text-[15px] outline-none [field-sizing:content] focus:border-ink"
                  />
                  {canRecord && !input.trim() ? (
                    <button
                      type="button"
                      onClick={startRecording}
                      disabled={pending}
                      aria-label="Record a voice message"
                      title="Record a voice message"
                      className="rounded-lg flex h-11 w-11 shrink-0 items-center justify-center bg-ink text-paper hover:bg-brand disabled:opacity-40"
                    >
                      <Mic size={18} strokeWidth={1.75} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={pending || !input.trim()}
                      aria-label="Send message"
                      className="rounded-lg flex h-11 w-11 shrink-0 items-center justify-center bg-brand text-white disabled:opacity-40"
                    >
                      <ArrowUp size={18} strokeWidth={2} />
                    </button>
                  )}
                </form>
              )}
              <p className="mt-2 px-1 text-[11px] leading-snug text-muted">
                AI answers can be wrong and aren&rsquo;t financial or legal advice. Our team confirms prices and
                availability. Don&rsquo;t share bank or card details here.
              </p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
