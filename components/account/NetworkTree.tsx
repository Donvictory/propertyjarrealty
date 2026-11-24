import type { NetworkPerson } from '@/lib/network';

/*
 * The member's referral network as a drawing: upline chain above, the member in the middle,
 * downlines below, joined by fine connector lines in the site-plan style.
 */

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('') || '•';

const joined = (iso: string) =>
  iso ? `Joined ${new Date(iso).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}` : '';

function Node({ person, tone }: { person: NetworkPerson; tone: 'upline' | 'downline' }) {
  return (
    <div className="flex items-center gap-3 border border-line bg-paper px-4 py-3">
      <span
        aria-hidden
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
          tone === 'upline' ? 'bg-sage-200 text-ink' : 'bg-sage-100 text-ink'
        }`}
      >
        {initials(person.name)}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{person.name}</p>
        <p className="text-xs text-muted">{joined(person.joinedAt)}</p>
      </div>
    </div>
  );
}

/** A vertical hairline between tiers. */
function Connector() {
  return <span aria-hidden className="mx-auto block h-8 w-px bg-ink/20" />;
}

export default function NetworkTree({ you, uplines, downlines }: { you: string; uplines: NetworkPerson[]; downlines: NetworkPerson[] }) {
  // Furthest upline at the top, nearest just above "you".
  const chain = [...uplines].sort((a, b) => b.level - a.level);

  return (
    <div className="bg-sage-100 px-4 py-10 sm:px-10">
      {/* Uplines */}
      <section aria-labelledby="uplines-heading" className="mx-auto max-w-sm">
        <h3 id="uplines-heading" className="mb-3 text-center text-xs font-medium text-muted">
          {chain.length > 1 ? 'Your uplines' : 'Your upline'}
        </h3>
        {chain.length ? (
          <ol>
            {chain.map((p, i) => (
              <li key={p.id}>
                {i > 0 && <Connector />}
                <Node person={p} tone="upline" />
              </li>
            ))}
          </ol>
        ) : (
          <p className="border border-dashed border-sage-line/60 px-4 py-4 text-center text-sm text-muted">
            You joined directly, with no referrer.
          </p>
        )}
      </section>

      <Connector />

      {/* You */}
      <div className="mx-auto flex max-w-sm items-center gap-3 bg-ink px-4 py-4 text-paper">
        <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white">
          {initials(you)}
        </span>
        <div>
          <p className="font-medium">{you}</p>
          <p className="text-xs text-paper/60">You</p>
        </div>
      </div>

      <Connector />

      {/* Downlines */}
      <section aria-labelledby="downlines-heading">
        <h3 id="downlines-heading" className="mb-3 text-center text-xs font-medium text-muted">
          Your downlines{downlines.length ? ` (${downlines.length})` : ''}
        </h3>
        {downlines.length ? (
          // One fine-lined tray holds every downline, so it reads as a single branch at any count.
          <ul className="grid gap-3 border border-ink/15 p-3 sm:grid-cols-2 sm:p-4 lg:grid-cols-3">
            {downlines.map((p) => (
              <li key={p.id}>
                <Node person={p} tone="downline" />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mx-auto max-w-sm border border-dashed border-sage-line/60 px-4 py-4 text-center text-sm text-muted">
            No one has joined with your link yet. Share it when referrals open.
          </p>
        )}
      </section>
    </div>
  );
}
