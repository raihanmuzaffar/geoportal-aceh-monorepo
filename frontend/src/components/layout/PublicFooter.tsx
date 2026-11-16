import { Link } from 'react-router-dom';
import { publicDomains } from '../../data/publicDomains';
import Reveal from '../ui/Reveal';
import Wordmark from '../ui/Wordmark';

const exploreLinks = [
  { to: '/', label: 'Home' },
  { to: '/webgis', label: 'WebGIS' },
  { to: '/analitik', label: 'Analitik' },
  { to: '/layanan', label: 'Layanan' },
  { to: '/data', label: 'Katalog Data' },
];

export default function PublicFooter() {
  return (
    <footer className="border-t border-line bg-surface-soft">
      <div className="container-content py-12 md:py-16">
        <Reveal className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Wordmark />
            <p className="mt-4 max-w-prose text-sm text-ink-2">
              Portal publik untuk membaca peta dan data Aceh.
            </p>
          </div>

          <nav aria-label="Navigasi footer" className="md:col-span-3">
            <h2 className="text-sm font-semibold text-ink">Jelajahi</h2>
            <ul className="mt-4 space-y-2">
              {exploreLinks.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="inline-flex min-h-11 items-center text-sm text-ink-2 underline-offset-4 transition-colors duration-200 ease-editorial hover:text-ink hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <h2 className="text-sm font-semibold text-ink">Data</h2>
            <p className="mt-4 text-sm text-ink-2">
              Lima layanan yang dibahas di halaman analitik:
            </p>
            <ul className="mt-3 space-y-1 text-sm text-ink-2">
              {publicDomains.map((domain) => (
                <li key={domain.slug}>
                  <Link
                    to={domain.href}
                    className="inline-flex min-h-11 items-center underline-offset-4 transition-colors duration-200 ease-editorial hover:text-ink hover:underline"
                  >
                    {domain.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <div className="mt-12 border-t border-line pt-6">
          <p className="text-xs text-ink-3">
            Sumber data dicantumkan pada setiap halaman yang menampilkan data.
          </p>
        </div>
      </div>
    </footer>
  );
}
