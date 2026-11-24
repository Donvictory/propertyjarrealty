'use client';

import { usePathname } from 'next/navigation';
import SiteHeader from './site/SiteHeader';
import SiteFooter from './site/SiteFooter';
import CommunityModal from './site/CommunityModal';

/** Focused screens (sign in, sign up, password help…) fill the window under the header, with no footer. */
const NO_FOOTER = ['/sign-in', '/sign-up', '/forgot-password', '/reset-password', '/check-email', '/signed-out'];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  const showFooter = !NO_FOOTER.includes(pathname ?? '');

  return (
    <>
      <SiteHeader />
      <div className="pt-20">{children}</div>
      {showFooter && <SiteFooter />}
      <CommunityModal />
    </>
  );
}
