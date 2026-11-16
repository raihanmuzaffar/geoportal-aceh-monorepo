import { Link, Navigate } from 'react-router-dom';
import ButtonLink from '../../components/ui/ButtonLink';
import Reveal from '../../components/ui/Reveal';
import StatusTag from '../../components/ui/StatusTag';
import { getPublicDomain } from '../../data/publicDomains';

type DomainStatusPageProps = {
  slug: string;
};

export default function DomainStatusPage({ slug }: DomainStatusPageProps) {
  const domain = getPublicDomain(slug);

  if (!domain) {
    return <Navigate to="/analitik" replace />;
  }

  return (
    <article className="container-content py-12 md:py-16 lg:py-24">
      <nav aria-label="Breadcrumb" className="text-sm text-ink-2">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link
              to="/"
              className="underline-offset-4 transition-colors duration-200 ease-editorial hover:underline"
            >
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              to="/analitik"
              className="underline-offset-4 transition-colors duration-200 ease-editorial hover:underline"
            >
              Analitik
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink">
            {domain.name}
          </li>
        </ol>
      </nav>

      <header className="mt-8 max-w-prose">
        <p className="text-sm font-semibold text-ink-2">Status data dan model</p>
        <h1 className="mt-3 text-3xl text-ink md:text-4xl">{domain.name}</h1>
        <div className="mt-5">
          <StatusTag status={domain.status}>{domain.statusLabel}</StatusTag>
        </div>
        <p className="mt-5 text-lg text-ink-2">{domain.summary}</p>
      </header>

      <Reveal className="mt-10 grid gap-8 border-t border-line pt-8 lg:grid-cols-12 lg:gap-12">
        <section aria-labelledby="tersedia-heading" className="lg:col-span-7">
          <h2 id="tersedia-heading" className="text-xl text-ink">
            Yang tersedia
          </h2>

          {domain.datasets.length > 0 ? (
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {domain.datasets.map((dataset) => (
                <li key={dataset.name} className="py-4">
                  <p className="text-base text-ink-2">{dataset.name}</p>
                  {dataset.period && (
                    <p className="mt-1 text-xs text-ink-3">
                      Periode data: {dataset.period}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-base text-ink-2">
              Belum ada dataset yang dapat ditampilkan.
            </p>
          )}

          {domain.details && (
            <div className="mt-8">
              <h2 className="text-xl text-ink">
                {domain.status === 'available'
                  ? 'Ringkasan model'
                  : 'Rincian data'}
              </h2>
              <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-5 sm:grid-cols-3">
                {domain.details.map((detail) => (
                  <div key={detail.label}>
                    <dt className="text-xs text-ink-3">{detail.label}</dt>
                    <dd className="mt-1 text-base font-semibold text-ink">
                      {detail.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </section>

        <aside aria-labelledby="catatan-heading" className="lg:col-span-5">
          <h2 id="catatan-heading" className="text-xl text-ink">
            Catatan
          </h2>
          <p className="mt-4 text-sm text-ink-2">{domain.sourceNote}</p>
          {domain.limitation && (
            <p className="mt-4 text-sm text-ink-2">{domain.limitation}</p>
          )}

          <div className="mt-6">
            <ButtonLink to="/" variant="secondary">
              Kembali ke beranda
            </ButtonLink>
          </div>
        </aside>
      </Reveal>
    </article>
  );
}
