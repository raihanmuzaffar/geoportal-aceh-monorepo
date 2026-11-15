import { Link } from 'react-router-dom';
import ButtonLink from '../../components/ui/ButtonLink';
import StatusTag from '../../components/ui/StatusTag';
import { publicDomains } from '../../data/publicDomains';

export default function AnalyticsIndexPage() {
  return (
    <section className="container-content py-12 md:py-16 lg:py-24">
      <div className="max-w-prose">
        <p className="text-sm font-semibold text-ink-2">Analitik</p>
        <h1 className="mt-4 text-3xl text-ink md:text-4xl">
          Status data dan model lima layanan
        </h1>
        <p className="mt-5 text-lg text-ink-2">
          Ringkasan ketersediaan data dan hasil analisis untuk Kependudukan,
          Kesehatan, Pendidikan, Pertanian, dan Kebencanaan.
        </p>
      </div>

      <ul className="mt-10 border-t border-line">
        {publicDomains.map((domain) => (
          <li
            key={domain.slug}
            className="grid gap-4 border-b border-line py-6 md:grid-cols-12 md:items-start md:gap-6 md:py-8"
          >
            <div className="md:col-span-3">
              <h2 className="font-display text-2xl text-ink">{domain.name}</h2>
            </div>
            <div className="md:col-span-6">
              <StatusTag status={domain.status}>{domain.statusLabel}</StatusTag>
              <p className="mt-3 text-sm text-ink-2">{domain.summary}</p>
              <p className="mt-2 text-xs text-ink-3">
                Data: {domain.dataLabel}. Hasil atau model: {domain.modelLabel}.
              </p>
            </div>
            <div className="md:col-span-3 md:text-right">
              <Link
                to={domain.href}
                aria-label={`Buka status ${domain.name}`}
                className="inline-flex min-h-11 items-center text-sm font-semibold text-forest underline-offset-4 hover:underline"
              >
                Buka status {domain.name}
              </Link>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-6 max-w-prose text-xs text-ink-3">
        Sumber: dataset dan metadata pada repositori layanan analitik. Tidak ada
        angka yang ditampilkan tanpa sumber.
      </p>

      <div className="mt-8">
        <ButtonLink to="/" variant="secondary">
          Kembali ke beranda
        </ButtonLink>
      </div>
    </section>
  );
}
