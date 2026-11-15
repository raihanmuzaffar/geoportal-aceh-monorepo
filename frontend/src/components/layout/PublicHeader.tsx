import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Wordmark from '../ui/Wordmark';

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/webgis', label: 'WebGIS', end: false },
  { to: '/analitik', label: 'Analitik', end: false },
];

export default function PublicHeader() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      buttonRef.current?.focus();
    };

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (panelRef.current?.contains(target) || buttonRef.current?.contains(target)) return;
      setOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLAnchorElement>('a')?.focus();
  }, [open]);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)');
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };

    desktop.addEventListener('change', handleChange);
    return () => desktop.removeEventListener('change', handleChange);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper">
      <div className="container-content flex h-16 items-center justify-between gap-4 md:h-[72px]">
        <Wordmark />

        <nav aria-label="Navigasi utama" className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `inline-flex min-h-11 items-center border-b-2 py-1 text-sm font-semibold transition-colors duration-200 ease-editorial ${
                  isActive
                    ? 'border-earth text-ink'
                    : 'border-transparent text-ink-2 hover:border-line-strong hover:text-ink'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="hidden min-h-11 items-center px-3 text-sm font-semibold text-forest underline-offset-4 hover:underline md:inline-flex"
          >
            Masuk
          </Link>

          <button
            ref={buttonRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded border border-line-strong px-3 text-sm font-semibold text-ink transition-colors duration-200 ease-editorial hover:bg-surface md:hidden"
          >
            {open ? (
              <X aria-hidden="true" size={18} strokeWidth={1.5} />
            ) : (
              <Menu aria-hidden="true" size={18} strokeWidth={1.5} />
            )}
            <span>{open ? 'Tutup' : 'Menu'}</span>
          </button>
        </div>
      </div>

      <div
        id="mobile-navigation"
        ref={panelRef}
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-line bg-paper shadow-overlay md:hidden"
      >
        <nav aria-label="Navigasi mobile" className="container-content py-4">
          <ul className="flex flex-col">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex min-h-12 items-center border-b border-line text-base font-semibold ${
                      isActive ? 'text-ink' : 'text-ink-2'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center text-base font-semibold text-forest"
              >
                Masuk
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
