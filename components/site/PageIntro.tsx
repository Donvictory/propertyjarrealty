import HeroReveal from '@/components/motion/HeroReveal';

type Props = {
  title: React.ReactNode;
  lede?: React.ReactNode;
};

/** Eyebrow + large heading + lede that opens every inner page. */
export default function PageIntro({ title, lede }: Props) {
  return (
    <HeroReveal>
      <header className="max-w-4xl">
        <h1 className="text-[40px] font-medium leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-[52px]">
          {title}
        </h1>
        {lede && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{lede}</p>}
      </header>
    </HeroReveal>
  );
}
