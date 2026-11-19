import { useParams } from 'react-router-dom';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ButtonLink from '../../components/ui/ButtonLink';
import Reveal from '../../components/ui/Reveal';
import StatusTag from '../../components/ui/StatusTag';
import { getDatasetBySlug } from '../../data/datasets';

export default function DatasetDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const dataset = slug ? getDatasetBySlug(slug) : undefined;

  if (!dataset) {
    return (
      <article className="container-content py-12 md:py-16 lg:py-24">
        <Breadcrumb
          items={[
            { label: 'Beranda', to: '/' },
            { label: 'Katalog Data', to: '/data' },
            { label: 'Tidak ditemukan' },
          ]}
        />
        <div className="mt-8 max-w-prose animate-rise-in">
          <p className="text-sm font-semibold text-ink-2">Dataset</p>
          <h1 className="mt-3 text-3xl text-ink md:text-4xl">
            Dataset tidak ditemukan
          </h1>
          <p className="mt-4 text-ink-2">
            Alamat dataset tidak cocok dengan entri pada katalog. Katalog saat
            ini belum berisi dataset yang dipublikasikan.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <ButtonLink to="/data" variant="primary">
              Kembali ke katalog
            </ButtonLink>
            <ButtonLink to="/layanan" variant="text">
              Lihat layanan
            </ButtonLink>
          </div>
        </div>
      </article>
    );
  }

  const metadataRows = [
    { label: 'Kategori', value: dataset.category },
    { label: 'Sumber', value: dataset.source },
    {
      label: 'Tahun',
      value: dataset.year !== null ? String(dataset.year) : null,
    },
    { label: 'Cakupan wilayah', value: dataset.region },
    { label: 'Format', value: dataset.format },
    { label: 'Sistem referensi', value: dataset.spatialReference },
    { label: 'Frekuensi pembaruan', value: dataset.updateFrequency },
  ].filter((row): row is { label: string; value: string } =>
    Boolean(row.value),
  );

  return (
    <article className="container-content py-12 md:py-16 lg:py-24">
      <Breadcrumb
        items={[
          { label: 'Beranda', to: '/' },
          { label: 'Katalog Data', to: '/data' },
          { label: dataset.title },
        ]}
      />

      <header className="mt-8 max-w-prose">
        <p className="text-sm font-semibold text-ink-2">{dataset.category}</p>
        <h1 className="mt-3 text-3xl text-ink md:text-4xl">{dataset.title}</h1>
        <div className="mt-4">
          <StatusTag status={dataset.availability}>
            {dataset.availabilityLabel}
          </StatusTag>
        </div>
        <p className="mt-5 text-lg leading-relaxed text-ink-2">
          {dataset.description}
        </p>
      </header>

      <Reveal className="mt-10 grid gap-10 border-t border-line pt-8 lg:grid-cols-12 lg:gap-12">
        <section aria-labelledby="metadata-heading" className="lg:col-span-7">
          <h2 id="metadata-heading" className="text-xl text-ink">
            Metadata dataset
          </h2>
          {metadataRows.length > 0 ? (
            <dl className="mt-4 border-t border-line">
              {metadataRows.map((row) => (
                <div
                  key={row.label}
                  className="grid gap-1 border-b border-line py-3 sm:grid-cols-3 sm:gap-4"
                >
                  <dt className="text-xs font-semibold text-ink-3 sm:col-span-1">
                    {row.label}
                  </dt>
                  <dd className="text-sm text-ink-2 sm:col-span-2">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-4 border-y border-line py-4 text-sm text-ink-2">
              Metadata rinci belum tersedia untuk dataset ini.
            </p>
          )}
          <p className="mt-4 text-xs text-ink-3">
            Metadata yang belum tersedia tidak ditampilkan.
          </p>
        </section>

        <aside className="lg:col-span-5 lg:border-l lg:border-line lg:pl-8">
          <h2 className="text-xl text-ink">Unduhan</h2>
          {dataset.downloadUrl ? (
            <a
              href={dataset.downloadUrl}
              download
              className="mt-4 inline-flex min-h-12 items-center rounded bg-forest px-6 py-3 text-sm font-semibold text-paper transition-[background-color,color,transform] duration-200 ease-editorial hover:bg-forest-deep active:translate-y-px"
            >
              Unduh dataset
            </a>
          ) : (
            <p className="mt-4 border border-line bg-surface-soft p-4 text-sm text-ink-2">
              Berkas unduhan belum tersedia. Halaman ini tidak menampilkan
              tautan unduhan sampai berkas resmi tersedia.
            </p>
          )}
          {dataset.metadataUrl ? (
            <p className="mt-4">
              <a
                href={dataset.metadataUrl}
                className="inline-flex min-h-11 items-center text-sm font-semibold text-forest underline-offset-4 transition-colors duration-200 ease-editorial hover:underline"
              >
                Buka metadata lengkap
              </a>
            </p>
          ) : null}
          <div className="mt-6">
            <ButtonLink to="/data" variant="text">
              Kembali ke katalog data
            </ButtonLink>
          </div>
        </aside>
      </Reveal>
    </article>
  );
}
