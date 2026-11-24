/**
 * CSS-only version of <Reveal> for content visible on load (page headings). No JavaScript, so the
 * heading paints straight away; see .hero-reveal in globals.css.
 */
export default function HeroReveal({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <div className="hero-reveal h-full">{children}</div>
    </div>
  );
}
