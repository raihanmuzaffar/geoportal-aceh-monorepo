import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import HomeBasemap from '../../components/public/HomeBasemap';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ButtonLink from '../../components/ui/ButtonLink';
import Reveal from '../../components/ui/Reveal';
import SearchField from '../../components/ui/SearchField';
import StatusTag from '../../components/ui/StatusTag';
import {
  publicServices,
  serviceCategories,
  type PublicService,
  type ServiceCategory,
} from '../../data/publicServices';

type CategoryFilter = ServiceCategory | 'semua';

function matchesQuery(service: PublicService, query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  return [service.name, service.description, service.categoryLabel, ...service.keywords]
    .join(' ')
    .toLowerCase()
    .includes(normalized);
}

export default function ServiceCatalogPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('semua');

  const filteredServices = useMemo(
    () =>
      publicServices.filter(
        (service) =>
          (category === 'semua' || service.category === category) &&
          matchesQuery(service, query),
      ),
    [category, query],
  );

  const featuredService = filteredServices.find((service) => service.featured);
  const sectorServices = filteredServices.filter(
    (service) => service.category === 'analitik',
  );
  const catalogService = filteredServices.find(
    (service) => service.category === 'katalog',
  );
  const hasResults =
    Boolean(featuredService) ||
    sectorServices.length > 0 ||
    Boolean(catalogService);

  const isFiltering = query.trim() !== '' || category !== 'semua';
  const activeCategoryLabel =
    serviceCategories.find((item) => item.id === category)?.label ??
    'Semua Layanan';

  const clearFilters = () => {
    setQuery('');
    setCategory('semua');
  };

  return (
    <>
      <section aria-labelledby="layanan-heading" className="border-b border-line">
        <div className="container-content py-12 md:py-16 lg:py-24">
          <Breadcrumb
            items={[{ label: 'Beranda', to: '/' }, { label: 'Layanan' }]}
          />

          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="text-sm font-semibold text-ink-2">Layanan publik</p>
              <h1
                id="layanan-heading"
                className="mt-3 text-3xl text-ink md:text-4xl"
              >
                Layanan Geospasial Aceh
              </h1>
              <p className="mt-5 max-w-prose text-lg leading-relaxed text-ink-2">
                Telusuri peta dasar, hasil analisis lima sektor, dan katalog
                data. Setiap layanan mencantumkan status ketersediaan dan
                batasannya.
              </p>
            </div>
            <div className="lg:col-span-5">
              <SearchField
                id="cari-layanan"
                label="Cari layanan"
                value={query}
                onChange={setQuery}
                placeholder="Contoh: peta, kependudukan, katalog"
                hint="Pencarian mencocokkan nama layanan, kategori, dan kata kunci."
              />
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="filter-layanan-heading"
        className="border-b border-line bg-surface-soft"
      >
        <div className="container-content py-6 md:py-8">
          <h2 id="filter-layanan-heading" className="sr-only">
            Filter layanan
          </h2>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div
              role="group"
              aria-label="Kategori layanan"
              className="flex flex-wrap gap-2"
            >
              {serviceCategories.map((item) => {
                const active = category === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setCategory(item.id)}
                    className={`inline-flex min-h-11 items-center rounded border px-4 text-sm font-semibold transition-[background-color,border-color,color,transform] duration-200 ease-editorial active:translate-y-px ${
                      active
                        ? 'border-forest bg-forest text-paper'
                        : 'border-line-strong bg-surface text-ink-2 hover:bg-paper hover:text-ink'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
            <p role="status" aria-live="polite" className="text-sm text-ink-3">
              {isFiltering
                ? `${filteredServices.length} layanan cocok dengan pencarian.`
                : 'Semua layanan ditampilkan.'}
            </p>
          </div>
        </div>
      </section>

      {featuredService ? (
        <section
          aria-labelledby="featured-layanan-heading"
          className="border-b border-line bg-surface-soft"
        >
          <div className="container-content py-12 md:py-16">
            <Reveal className="bg-forest p-6 text-paper md:p-10">
              <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
                <div className="lg:col-span-6">
                  <p className="text-sm font-semibold text-forest-soft">
                    {featuredService.categoryLabel}
                  </p>
                  <h2
                    id="featured-layanan-heading"
                    className="mt-3 font-display text-3xl md:text-4xl"
                  >
                    {featuredService.name}
                  </h2>
                  <p className="mt-4 max-w-prose text-forest-soft">
                    {featuredService.description}
                  </p>
                  <p className="mt-4 text-sm text-forest-soft">
                    Status: {featuredService.availabilityLabel}.
                  </p>
                  <div className="mt-6">
                    <ButtonLink to={featuredService.href} variant="inverse">
                      Jelajahi Peta
                    </ButtonLink>
                  </div>
                </div>
                <div className="lg:col-span-6">
                  <HomeBasemap />
                  <p className="mt-3 text-xs leading-relaxed text-forest-soft">
                    Pratinjau peta dasar OpenStreetMap. Lapisan batas
                    administrasi resmi belum tersedia.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}

      {sectorServices.length > 0 ? (
        <section aria-labelledby="sektor-heading" className="border-b border-line">
          <div className="container-content py-12 md:py-16 lg:py-24">
            <Reveal className="grid gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-4">
                <p className="text-sm font-semibold text-ink-2">
                  Analitik sektoral
                </p>
                <h2
                  id="sektor-heading"
                  className="mt-3 text-2xl text-ink md:text-3xl"
                >
                  Lima sektor data
                </h2>
                <p className="mt-4 max-w-prose text-ink-2">
                  Ringkasan ketersediaan data dan hasil analisis per sektor.
                  Status mengikuti data dan model yang benar-benar tersedia.
                </p>
              </div>
              <div className="lg:col-span-8">
                <ul className="border-t border-line">
                  {sectorServices.map((service) => (
                    <li
                      key={service.id}
                      className="border-b border-line py-6 transition-colors duration-150 ease-editorial hover:bg-surface-soft"
                    >
                      <div className="grid gap-4 md:grid-cols-12 md:gap-6">
                        <div className="md:col-span-4">
                          <h3 className="font-display text-xl text-ink">
                            <Link
                              to={service.href}
                              className="underline-offset-4 transition-colors duration-200 ease-editorial hover:underline"
                            >
                              {service.name}
                            </Link>
                          </h3>
                          <p className="mt-1 text-xs text-ink-3">
                            {service.categoryLabel}
                          </p>
                        </div>
                        <div className="md:col-span-5">
                          <StatusTag status={service.availability}>
                            {service.availabilityLabel}
                          </StatusTag>
                          <p className="mt-3 text-sm leading-relaxed text-ink-2">
                            {service.description}
                          </p>
                        </div>
                        <div className="md:col-span-3 md:text-right">
                          <Link
                            to={service.href}
                            className="inline-flex min-h-11 items-center text-sm font-semibold text-forest underline-offset-4 transition-colors duration-200 ease-editorial hover:underline"
                          >
                            Buka analitik {service.name}
                          </Link>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}

      {catalogService ? (
        <section
          aria-labelledby="katalog-layanan-heading"
          className="border-b border-line bg-surface-soft"
        >
          <div className="container-content py-12 md:py-16">
            <Reveal className="grid gap-8 lg:grid-cols-12 lg:items-start">
              <div className="lg:col-span-7">
                <p className="text-sm font-semibold text-ink-2">
                  {catalogService.categoryLabel}
                </p>
                <h2
                  id="katalog-layanan-heading"
                  className="mt-3 text-2xl text-ink md:text-3xl"
                >
                  {catalogService.name}
                </h2>
                <p className="mt-4 max-w-prose text-ink-2">
                  {catalogService.description}
                </p>
                <p className="mt-4 max-w-prose text-sm text-ink-2">
                  Katalog dibuka dengan status belum berisi dataset. Entri akan
                  ditambahkan setelah sumber dan metadata resmi terverifikasi.
                </p>
              </div>
              <div className="lg:col-span-5 lg:border-l lg:border-line lg:pl-8">
                <StatusTag status={catalogService.availability}>
                  {catalogService.availabilityLabel}
                </StatusTag>
                <div className="mt-6">
                  <ButtonLink to={catalogService.href} variant="primary">
                    Jelajahi Katalog Data
                  </ButtonLink>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}

      {!hasResults ? (
        <section className="container-content py-12 md:py-16">
          <div className="max-w-prose animate-rise-in border-y border-line py-10">
            <h2 className="text-2xl text-ink">Layanan tidak ditemukan</h2>
            <p className="mt-4 text-ink-2">
              Tidak ada layanan yang cocok dengan pencarian atau kategori{' '}
              {activeCategoryLabel}. Coba kata kunci lain atau tampilkan semua
              layanan.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 inline-flex min-h-11 items-center rounded border border-forest bg-forest px-5 text-sm font-semibold text-paper transition-[background-color,border-color,color,transform] duration-200 ease-editorial hover:bg-forest-deep active:translate-y-px"
            >
              Bersihkan pencarian dan filter
            </button>
          </div>
        </section>
      ) : null}

      <section
        aria-labelledby="layanan-cta-heading"
        className="bg-forest text-paper"
      >
        <div className="container-content py-12 md:py-16">
          <Reveal className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <h2
                id="layanan-cta-heading"
                className="font-display text-2xl md:text-3xl"
              >
                Telusuri data Aceh dari sumbernya
              </h2>
              <p className="mt-3 max-w-prose text-forest-soft">
                Mulai dari peta, baca analitik sektoral, atau periksa katalog
                data. Setiap halaman mencantumkan sumber, periode, dan batasan
                data.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
              <ButtonLink to="/webgis" variant="inverse">
                Buka WebGIS
              </ButtonLink>
              <ButtonLink to="/data" variant="inverse">
                Lihat katalog data
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
