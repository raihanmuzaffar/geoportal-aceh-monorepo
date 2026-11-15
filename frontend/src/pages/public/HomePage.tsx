import { Link } from 'react-router-dom';
import HomeBasemap from '../../components/public/HomeBasemap';
import ButtonLink from '../../components/ui/ButtonLink';
import StatusTag from '../../components/ui/StatusTag';
import { publicDomains } from '../../data/publicDomains';

export default function HomePage() {
  const kependudukan = publicDomains.find(
    (domain) => domain.slug === 'kependudukan',
  );
  const otherDomains = publicDomains.filter(
    (domain) => domain.slug !== 'kependudukan',
  );

  if (!kependudukan) return null;

  return (
    <>
      <section
        aria-labelledby="home-hero-heading"
        className="overflow-x-clip border-b border-line"
      >
        <div className="container-content grid lg:grid-cols-12 lg:items-stretch">
          <div className="py-12 md:py-16 lg:col-span-5 lg:py-24 lg:pr-10">
            <p className="text-sm font-semibold text-ink-2">
              Geoportal Provinsi Aceh
            </p>
            <h1
              id="home-hero-heading"
              className="mt-5 max-w-[15ch] text-hero text-ink"
            >
              Membaca Aceh lewat peta dan data
            </h1>
            <p className="mt-6 max-w-prose text-lg text-ink-2">
              Portal publik untuk membaca peta dasar, hasil analisis, dan status
              data lima layanan di Aceh.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/webgis">Buka WebGIS</ButtonLink>
              <ButtonLink to="/analitik" variant="secondary">
                Lihat analitik
              </ButtonLink>
            </div>
          </div>

          <div className="flex flex-col justify-between bg-forest p-6 text-paper md:p-8 lg:col-span-7 lg:min-h-[560px] lg:p-10 xl:-mr-[calc((100vw-1280px)/2+3rem)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-forest-soft/40 pb-5">
              <p className="text-sm font-semibold text-paper">Provinsi Aceh</p>
              <p className="text-sm text-forest-soft">Data 2024</p>
            </div>

            <div className="py-10 lg:py-16">
              <p className="font-display text-[clamp(5rem,13vw,11rem)] leading-none tracking-display text-paper">
                Aceh
              </p>
            </div>

            <div>
              <div className="h-px bg-forest-soft/40" />
              <dl className="mt-5 grid gap-4 sm:grid-cols-3">
                <div>
                  <dt className="text-xs text-forest-soft">Tahun data</dt>
                  <dd className="mt-1 text-sm font-semibold text-paper">2024</dd>
                </div>
                <div>
                  <dt className="text-xs text-forest-soft">Cakupan dataset</dt>
                  <dd className="mt-1 text-sm font-semibold text-paper">
                    23 kabupaten/kota
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-forest-soft">Sumber</dt>
                  <dd className="mt-1 text-sm font-semibold text-paper">
                    Dataset kependudukan
                  </dd>
                </div>
              </dl>
              <p className="mt-5 max-w-prose text-xs text-forest-soft">
                Angka cakupan berasal dari dataset kependudukan 2024.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="home-coverage-heading"
        className="border-b border-line bg-surface-soft"
      >
        <div className="container-content py-12 md:py-16 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <figure className="lg:col-span-7">
              <HomeBasemap />
              <figcaption className="mt-3 text-xs text-ink-3">
                Peta dasar{' '}
                <a
                  href="https://www.openstreetmap.org/copyright"
                  target="_blank"
                  rel="noreferrer"
                  className="underline-offset-4 hover:underline"
                >
                  © kontributor OpenStreetMap
                </a>
                . Lapisan batas administrasi resmi belum tersedia.
              </figcaption>
            </figure>

            <div className="lg:col-span-5">
              <p className="text-sm font-semibold text-ink-2">Cakupan wilayah</p>
              <h2
                id="home-coverage-heading"
                className="mt-3 text-2xl text-ink md:text-3xl"
              >
                Wilayah dan cakupan data
              </h2>
              <p className="mt-5 text-base text-ink-2">
                Dataset kependudukan 2024 mencakup 23 kabupaten/kota dan membentuk
                3 cluster. Batas administrasi resmi belum tersedia, jadi peta pada
                bagian ini hanya menampilkan peta dasar OpenStreetMap.
              </p>
              <p className="mt-4 text-base text-ink-2">
                Laju pertumbuhan penduduk pada dataset belum diverifikasi terhadap
                sumber resmi. Hasil clustering berasal dari eksperimen awal.
              </p>
              <div className="mt-6">
                <ButtonLink to="/analitik/kependudukan" variant="text">
                  Lihat status kependudukan
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="home-domains-heading" className="border-b border-line">
        <div className="container-content py-12 md:py-16 lg:py-24">
          <div className="max-w-prose">
            <p className="text-sm font-semibold text-ink-2">Lima layanan</p>
            <h2
              id="home-domains-heading"
              className="mt-3 text-2xl text-ink md:text-3xl"
            >
              Status lima layanan
            </h2>
            <p className="mt-4 text-base text-ink-2">
              Setiap layanan punya status yang berbeda. Kependudukan sudah memiliki
              hasil clustering tersimpan. Empat layanan lain menunggu model atau
              dataset.
            </p>
          </div>

          <div className="mt-8 bg-forest p-6 text-paper md:p-10 lg:mt-12 lg:p-12">
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-7">
                <span className="inline-flex max-w-full border border-forest-soft px-2.5 py-1 text-left text-sm font-semibold text-paper">
                  {kependudukan.statusLabel}
                </span>
                <h3 className="mt-5 font-display text-3xl text-paper md:text-4xl">
                  {kependudukan.name}
                </h3>
                <p className="mt-4 max-w-prose text-base text-forest-soft">
                  {kependudukan.summary}
                </p>
                <p className="mt-3 max-w-prose text-sm text-forest-soft">
                  {kependudukan.sourceNote}
                </p>
                <div className="mt-6">
                  <ButtonLink to={kependudukan.href} variant="inverse">
                    Buka status kependudukan
                  </ButtonLink>
                </div>
              </div>

              <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-forest-soft/40 pt-6 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                {kependudukan.details
                  ?.filter((detail) => detail.featured)
                  .map((detail) => (
                    <div key={detail.label}>
                      <dt className="text-xs text-forest-soft">{detail.label}</dt>
                      <dd className="mt-1 text-base font-semibold text-paper">
                        {detail.value}
                      </dd>
                    </div>
                  ))}
              </dl>
            </div>
          </div>

          <ul className="mt-8 border-t border-line">
            {otherDomains.map((domain) => (
              <li
                key={domain.slug}
                className="grid gap-4 border-b border-line py-6 md:grid-cols-12 md:items-start md:gap-6 md:py-7"
              >
                <div className="md:col-span-3">
                  <h3 className="font-display text-2xl text-ink">{domain.name}</h3>
                </div>
                <div className="md:col-span-6">
                  <StatusTag status={domain.status}>
                    {domain.statusLabel}
                  </StatusTag>
                  <p className="mt-3 text-sm text-ink-2">{domain.summary}</p>
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
        </div>
      </section>

      <section aria-labelledby="home-status-heading" className="bg-surface-soft">
        <div className="container-content py-12 md:py-16 lg:py-24">
          <div className="max-w-prose">
            <p className="text-sm font-semibold text-ink-2">Status data</p>
            <h2
              id="home-status-heading"
              className="mt-3 text-2xl text-ink md:text-3xl"
            >
              Ketersediaan data dan model
            </h2>
            <p className="mt-4 text-base text-ink-2">
              Ringkasan ini mengikuti dataset dan model yang ada di repositori.
              Tidak ada angka yang ditampilkan tanpa sumber.
            </p>
          </div>

          <div className="mt-8 hidden border-y border-line md:block">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="sr-only">
                Status ketersediaan data lima domain layanan
              </caption>
              <thead>
                <tr className="border-b border-line-strong">
                  <th scope="col" className="py-3 pr-4 font-semibold text-ink-2">
                    Domain
                  </th>
                  <th scope="col" className="py-3 pr-4 font-semibold text-ink-2">
                    Data
                  </th>
                  <th scope="col" className="py-3 pr-4 font-semibold text-ink-2">
                    Hasil atau model
                  </th>
                  <th scope="col" className="py-3 text-right font-semibold text-ink-2">
                    Halaman
                  </th>
                </tr>
              </thead>
              <tbody>
                {publicDomains.map((domain) => (
                  <tr key={domain.slug} className="border-b border-line">
                    <th scope="row" className="py-4 pr-4 font-semibold text-ink">
                      {domain.name}
                    </th>
                    <td className="py-4 pr-4 text-ink-2">{domain.dataLabel}</td>
                    <td className="py-4 pr-4 text-ink-2">{domain.modelLabel}</td>
                    <td className="py-4 text-right">
                      <Link
                        to={domain.href}
                        aria-label={`Buka status ${domain.name}`}
                        className="inline-flex min-h-11 items-center text-sm font-semibold text-forest underline-offset-4 hover:underline"
                      >
                        Buka status
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="mt-8 divide-y divide-line border-y border-line md:hidden">
            {publicDomains.map((domain) => (
              <li key={domain.slug} className="py-5">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="font-display text-xl text-ink">{domain.name}</h3>
                  <Link
                    to={domain.href}
                    aria-label={`Buka status ${domain.name}`}
                    className="inline-flex min-h-11 items-center text-sm font-semibold text-forest underline-offset-4 hover:underline"
                  >
                    Buka status
                  </Link>
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-xs text-ink-3">Data</dt>
                    <dd className="mt-1 text-sm text-ink-2">{domain.dataLabel}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-3">Hasil atau model</dt>
                    <dd className="mt-1 text-sm text-ink-2">{domain.modelLabel}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>

          <p className="mt-6 max-w-prose text-xs text-ink-3">
            Sumber: dataset dan metadata pada repositori layanan analitik. Rincian
            per domain ada di halaman status masing-masing.
          </p>
        </div>
      </section>
    </>
  );
}
