import { Link } from 'react-router-dom';
import ClusterDistribution from '../../components/analytics/ClusterDistribution';
import ButtonLink from '../../components/ui/ButtonLink';
import Reveal from '../../components/ui/Reveal';
import StatusTag from '../../components/ui/StatusTag';
import {
  kependudukanCluster2024,
  kependudukanMetadata,
} from '../../data/kependudukan';
import { publicDomains } from '../../data/publicDomains';

export default function AnalyticsIndexPage() {
  const kependudukan = publicDomains.find(
    (domain) => domain.slug === 'kependudukan',
  );
  const otherDomains = publicDomains.filter(
    (domain) => domain.slug !== 'kependudukan',
  );

  if (!kependudukan) return null;

  return (
    <section className="container-content py-12 md:py-16 lg:py-24">
      <div className="max-w-prose">
        <p className="text-sm font-semibold text-ink-2">Analitik</p>
        <h1 className="mt-4 text-3xl text-ink md:text-4xl">
          Data dan model lima layanan
        </h1>
        <p className="mt-5 text-lg text-ink-2">
          Kependudukan memiliki hasil clustering tersimpan. Empat layanan lain
          baru memiliki data mentah atau belum memiliki data dan model.
        </p>
      </div>

      <Reveal className="mt-10 border-y border-line">
        <div className="grid gap-8 py-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <p className="text-sm font-semibold text-ink-2">
              Hasil model tersimpan
            </p>
            <div className="mt-3">
              <StatusTag status={kependudukan.status}>
                {kependudukan.statusLabel}
              </StatusTag>
            </div>
            <h2 className="mt-5 text-2xl text-ink md:text-3xl">
              Kependudukan 2024
            </h2>
            <p className="mt-4 max-w-prose text-base text-ink-2">
              {kependudukan.summary}
            </p>

            <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
              <div>
                <dt className="text-xs text-ink-3">Model</dt>
                <dd className="mt-1 text-sm font-semibold text-ink">
                  {kependudukanMetadata.algorithm}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-ink-3">Wilayah</dt>
                <dd className="mt-1 text-sm font-semibold text-ink">
                  {kependudukanMetadata.regionCount}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-ink-3">Cluster</dt>
                <dd className="mt-1 text-sm font-semibold text-ink">
                  {kependudukanMetadata.clusterCount}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-ink-3">Silhouette</dt>
                <dd
                  data-numeric
                  className="mt-1 text-sm font-semibold text-ink"
                >
                  {kependudukanMetadata.silhouette.toFixed(4)}
                </dd>
              </div>
            </dl>

            <div className="mt-6">
              <ButtonLink to={kependudukan.href}>
                Buka analisis kependudukan
              </ButtonLink>
            </div>
          </div>

          <div className="border-t border-line pt-6 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <h3 className="text-sm font-semibold text-ink">
              Komposisi cluster
            </h3>
            <ClusterDistribution
              rows={kependudukanCluster2024}
              className="mt-4"
            />
            <p className="mt-4 text-xs text-ink-3">
              Dihitung dari 23 baris CSV hasil clustering 2024.
            </p>
          </div>
        </div>
      </Reveal>

      <div className="mt-12">
        <div className="max-w-prose">
          <h2 className="text-2xl text-ink">Status layanan lain</h2>
          <p className="mt-4 text-base text-ink-2">
            Empat layanan berikut belum memiliki hasil model. Halaman status
            hanya menampilkan dataset dan batas yang tersedia.
          </p>
        </div>

        <Reveal className="mt-6">
          <ul className="border-t border-line">
            {otherDomains.map((domain) => (
              <li
                key={domain.slug}
                className="grid gap-4 border-b border-line py-6 transition-colors duration-150 ease-editorial hover:bg-surface-soft md:grid-cols-12 md:items-start md:gap-6 md:py-8"
              >
                <div className="md:col-span-3">
                  <h3 className="font-display text-2xl text-ink">
                    {domain.name}
                  </h3>
                </div>
                <div className="md:col-span-6">
                  <StatusTag status={domain.status}>
                    {domain.statusLabel}
                  </StatusTag>
                  <p className="mt-3 text-sm text-ink-2">{domain.summary}</p>
                  <p className="mt-2 text-xs text-ink-3">
                    Data: {domain.dataLabel}. Hasil atau model:{' '}
                    {domain.modelLabel}.
                  </p>
                </div>
                <div className="md:col-span-3 md:text-right">
                  <Link
                    to={domain.href}
                    aria-label={`Buka status ${domain.name}`}
                    className="inline-flex min-h-11 items-center text-sm font-semibold text-forest underline-offset-4 transition-colors duration-200 ease-editorial hover:underline"
                  >
                    Buka status {domain.name}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <p className="mt-6 max-w-prose break-words text-xs text-ink-3">
        Sumber: CSV hasil clustering, metadata model K-Means, dan dataset mentah
        pada repositori layanan analitik. Tidak ada angka yang ditampilkan tanpa
        sumber.
      </p>

      <div className="mt-8">
        <ButtonLink to="/" variant="secondary">
          Kembali ke beranda
        </ButtonLink>
      </div>
    </section>
  );
}
