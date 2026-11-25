/**
 * CSS-only version of <Reveal> for content visible on load (page headings, opening panels). No
 * JavaScript, so it paints straight away; see .hero-reveal in globals.css. On phones it rises instead.
 */
export default function HeroReveal({
  children,
  className,
  from = 'left',
}: {
  children: React.ReactNode;
  className?: string;
  from?: 'left' | 'right';
}) {
  return (
    <div className={className}>
      <div className={`${from === 'right' ? 'hero-reveal-right' : 'hero-reveal'} h-full`}>{children}</div>
    </div>
  );
}
