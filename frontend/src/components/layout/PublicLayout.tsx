import { useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import PublicFooter from './PublicFooter';
import PublicHeader from './PublicHeader';
import SkipLink from '../ui/SkipLink';

export default function PublicLayout() {
  const { pathname } = useLocation();
  const isMapRoute = pathname.startsWith('/webgis');

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-dvh flex-col bg-paper text-ink">
      <SkipLink />
      <PublicHeader key={pathname} />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 scroll-mt-16 md:scroll-mt-[72px]"
      >
        <div key={pathname} className={isMapRoute ? undefined : 'page-enter'}>
          <Outlet />
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
