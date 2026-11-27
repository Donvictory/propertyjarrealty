'use client';

import { useRef, useState } from 'react';
import Reveal from '@/components/motion/Reveal';

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return '0:00';
  const s = Math.floor(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

const QUESTIONS = {
  where: {
    q: 'Where is the property?',
    a: 'Every listing shows its location, and we arrange site visits before you pay.',
  },
  what: {
    q: 'What am I buying?',
    a: 'Plot size, title documents and what you can build, set out plainly.',
  },
  how: {
    q: 'How do I pay?',
    a: 'Outright or in instalments. The options sit on each property page.',
  },
};

/** A question pinned to the film with a leader line, like a note on a drawing. */
function Note({ q, a, side }: { q: string; a: string; side: 'left' | 'right' }) {
  const line = (
    <span aria-hidden className="hidden flex-1 items-center lg:flex">
      {side === 'right' && <span className="h-1.5 w-1.5 shrink-0 bg-brand" />}
      <span className="h-px flex-1 bg-ink/25" />
      {side === 'left' && <span className="h-1.5 w-1.5 shrink-0 bg-brand" />}
    </span>
  );
  return (
    <div className={`flex items-center gap-5 ${side === 'left' ? 'lg:text-right' : ''}`}>
      {side === 'right' && line}
      <div className="lg:max-w-[15rem]">
        <p className="text-xl font-medium tracking-[-0.01em]">{q}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">{a}</p>
      </div>
      {side === 'left' && line}
    </div>
  );
}

/** The film from the previous site (portrait, shot on phone), presented as an annotated drawing. */
export default function IntroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const fullscreen = () => void videoRef.current?.requestFullscreen?.();

  return (
    <section className="shell py-20 lg:py-28">
      <Reveal from="left">
        <h2 className="max-w-2xl text-4xl font-medium leading-[1.05] tracking-[-0.02em] lg:text-[52px]">
          Start with the right questions.
        </h2>
        <p className="mt-5 max-w-xl leading-relaxed text-muted">
          We help you understand the details before you make a decision. Watch how we take you from first enquiry to
          the day you get your keys.
        </p>
      </Reveal>

      <div className="mt-14 grid items-center gap-10 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_400px_minmax(0,1fr)] lg:gap-0">
        {/* Left notes (desktop) */}
        <div className="order-2 space-y-10 lg:order-none lg:space-y-28">
          <Reveal from="left">
            <Note side="left" {...QUESTIONS.where} />
          </Reveal>
          <Reveal from="left" distance={1.3}>
            <Note side="left" {...QUESTIONS.what} />
          </Reveal>
        </div>

        {/* The film, framed like a sheet */}
        <div className="order-1 mx-auto w-full max-w-[400px] lg:order-none">
          <div className="stay-dark rounded-xl bg-sage-200 p-4 sm:p-5">
            <div className="relative aspect-[9/16] overflow-hidden rounded-lg bg-ink">
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full cursor-pointer object-cover"
                poster="/thumbnail.jpeg"
                playsInline
                preload="metadata"
                onClick={togglePlay}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={() => setPlaying(false)}
                onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
              >
                <source src="/IMG_5677.MOV" type="video/mp4" />
                <source src="/IMG_5677.MOV" type="video/quicktime" />
              </video>
              {!playing && (
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label="Play the PropertyJar film"
                  className="group absolute inset-0 flex items-center justify-center bg-ink/15"
                >
                  <span className="icon-fill h-16 w-16 bg-brand text-on-brand [--fill-bg:var(--color-paper)] [--fill-fg:var(--color-brand)]">
                    <svg width="18" height="20" viewBox="0 0 18 20" aria-hidden>
                      <path d="M0 0 18 10 0 20z" fill="currentColor" />
                    </svg>
                  </span>
                </button>
              )}
            </div>
            <div className="flex h-11 items-center gap-4 bg-ink px-4 text-xs text-paper/90">
              <button type="button" onClick={togglePlay} className="w-10 text-left font-medium text-paper">
                {playing ? 'Pause' : 'Play'}
              </button>
              <span className="tabular-nums text-paper/65">
                {formatTime(time)} / {formatTime(duration)}
              </span>
              <span className="ml-auto flex items-center gap-3">
                <button type="button" onClick={toggleMute} className="hover:text-paper">
                  {muted ? 'Unmute' : 'Mute'}
                </button>
                <button type="button" onClick={fullscreen} className="hover:text-paper">
                  Full screen
                </button>
              </span>
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-muted">
            The PropertyJar film{duration > 0 ? ` (${formatTime(duration)})` : ''}
          </p>
        </div>

        {/* Right note (desktop) */}
        <Reveal from="right" className="order-3 lg:order-none">
          <Note side="right" {...QUESTIONS.how} />
        </Reveal>
      </div>
    </section>
  );
}
