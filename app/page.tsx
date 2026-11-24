import HomeHero from '@/components/home/HomeHero';
import IntroVideo from '@/components/home/IntroVideo';
import ApproachBand from '@/components/home/ApproachBand';
import AvailableProperties from '@/components/home/AvailableProperties';
import WhyUs from '@/components/home/WhyUs';
import Steps from '@/components/home/Steps';
import Faq from '@/components/home/Faq';
import ContactCta from '@/components/home/ContactCta';

export const revalidate = 60;

export default function Home() {
  return (
    <main className="bg-paper">
      <HomeHero />
      <IntroVideo />
      <ApproachBand />
      <AvailableProperties />
      <WhyUs />
      <Steps />
      <Faq />
      <ContactCta />
    </main>
  );
}
