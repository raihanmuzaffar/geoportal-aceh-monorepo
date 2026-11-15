import { Outlet, useLocation } from 'react-router-dom';
import PublicFooter from './PublicFooter';
import PublicHeader from './PublicHeader';
import SkipLink from '../ui/SkipLink';

export default function PublicLayout() {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-dvh flex-col bg-paper text-ink">
      <SkipLink />
      <PublicHeader key={pathname} />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
