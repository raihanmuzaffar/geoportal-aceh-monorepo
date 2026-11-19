import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ButtonLink from '../../components/ui/ButtonLink';
import FilterSelect from '../../components/ui/FilterSelect';
import Reveal from '../../components/ui/Reveal';
import SearchField from '../../components/ui/SearchField';
import StatusTag from '../../components/ui/StatusTag';
import {
  datasetAvailabilityOptions,
  datasetMetadataFields,
  datasets,
  getDatasetFilterOptions,
  type Dataset,
} from '../../data/datasets';

type FilterOption = {
  value: string;
  label: string;
};

function withAllOption(allLabel: string, values: string[]): FilterOption[] {
  return [
    { value: 'all', label: allLabel },
    ...values.map((value) => ({ value, label: value })),
  ];
}

function CatalogEmptyState() {
  return (
    <div className="grid animate-rise-in gap-10 border-y border-line py-10 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-7">
        <p className="text-sm font-semibold text-ink-2">Status katalog</p>
        <h2 className="mt-3 text-2xl text-ink md:text-3xl">
          Belum ada dataset yang dipublikasikan.
        </h2>
        <p className="mt-4 max-w-prose text-ink-2">
          Katalog ini tidak menampilkan contoh dataset. Setiap entri akan
          ditambahkan setelah sumber, periode, cakupan wilayah, dan berkas
          resmi tersedia.
        </p>
        <p className="mt-3 max-w-prose text-sm text-ink-2">
          Sampai saat itu, halaman ini berfungsi sebagai gambaran metadata yang
          akan tersedia, bukan sebagai daftar data.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink to="/layanan" variant="primary">
            Kembali ke layanan
          </ButtonLink>
          <ButtonLink to="/webgis" variant="text">
            Buka WebGIS
          </ButtonLink>
        </div>
      </div>
      <div className="lg:col-span-5 lg:border-l lg:border-line lg:pl-8">
        <h3 className="text-sm font-semibold text-ink">
          Metadata yang akan tersedia
        </h3>
        <dl className="mt-4 space-y-3">
          {datasetMetadataFields.map((field) => (
            <div key={field.label}>
              <dt className="text-sm font-semibold text-ink">{field.label}</dt>
              <dd className="text-sm text-ink-2">{field.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

function FilterEmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="max-w-prose animate-rise-in border-y border-line py-10">
      <h2 className="text-2xl text-ink">Tidak ada dataset yang cocok</h2>
      <p className="mt-4 text-ink-2">
        Tidak ada dataset yang sesuai dengan pencarian dan filter saat ini.
        Hapus filter untuk melihat seluruh katalog.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-6 inline-flex min-h-11 items-center rounded border border-forest bg-forest px-5 text-sm font-semibold text-paper transition-[background-color,border-color,color,transform] duration-200 ease-editorial hover:bg-forest-deep active:translate-y-px"
      >
        Hapus semua filter
      </button>
    </div>
  );
}

function DatasetList({ items }: { items: Dataset[] }) {
  return (
    <ul className="border-t border-line">
      {items.map((dataset, index) => (
        <li
          key={dataset.id}
          className="border-b border-line py-6 transition-colors duration-150 ease-editorial hover:bg-surface-soft"
        >
          <Reveal delay={Math.min(index * 45, 180)}>
          <div className="grid gap-4 md:grid-cols-12 md:gap-6">
            <div className="md:col-span-8">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-display text-xl text-ink">
                  <Link
                    to={`/data/${dataset.slug}`}
                    className="underline-offset-4 transition-colors duration-200 ease-editorial hover:underline"
                  >
                    {dataset.title}
                  </Link>
                </h3>
                <StatusTag status={dataset.availability}>
                  {dataset.availabilityLabel}
                </StatusTag>
              </div>
              <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-2">
                {dataset.description}
              </p>
              <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-ink-3">
                {dataset.category ? (
                  <div className="flex gap-1">
                    <dt>Kategori:</dt>
                    <dd>{dataset.category}</dd>
                  </div>
                ) : null}
                {dataset.year !== null ? (
                  <div className="flex gap-1">
                    <dt>Tahun:</dt>
                    <dd>{dataset.year}</dd>
                  </div>
                ) : null}
                {dataset.region ? (
                  <div className="flex gap-1">
                    <dt>Wilayah:</dt>
                    <dd>{dataset.region}</dd>
                  </div>
                ) : null}
                {dataset.format ? (
                  <div className="flex gap-1">
                    <dt>Format:</dt>
                    <dd>{dataset.format}</dd>
                  </div>
                ) : null}
              </dl>
            </div>
            <div className="md:col-span-4 md:text-right">
              <Link
                to={`/data/${dataset.slug}`}
                className="inline-flex min-h-11 items-center text-sm font-semibold text-forest underline-offset-4 transition-colors duration-200 ease-editorial hover:underline"
              >
                Lihat detail dataset
              </Link>
            </div>
          </div>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

export default function DataCatalogPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [year, setYear] = useState('all');
  const [format, setFormat] = useState('all');
  const [region, setRegion] = useState('all');
  const [availability, setAvailability] = useState('all');

  const filterOptions = useMemo(() => getDatasetFilterOptions(datasets), []);

  const filteredDatasets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return datasets.filter((dataset) => {
      if (category !== 'all' && dataset.category !== category) return false;
      if (year !== 'all' && String(dataset.year ?? '') !== year) return false;
      if (format !== 'all' && dataset.format !== format) return false;
      if (region !== 'all' && dataset.region !== region) return false;
      if (availability !== 'all' && dataset.availability !== availability) {
        return false;
      }
      if (!normalizedQuery) return true;

      const searchable = [
        dataset.title,
        dataset.description,
        dataset.category,
        dataset.region ?? '',
        dataset.format ?? '',
        dataset.source ?? '',
        dataset.year !== null ? String(dataset.year) : '',
        ...dataset.keywords,
      ]
        .join(' ')
        .toLowerCase();

      return searchable.includes(normalizedQuery);
    });
  }, [availability, category, format, query, region, year]);

  const hasActiveFilters =
    query.trim() !== '' ||
    category !== 'all' ||
    year !== 'all' ||
    format !== 'all' ||
    region !== 'all' ||
    availability !== 'all';

  const clearFilters = () => {
    setQuery('');
    setCategory('all');
    setYear('all');
    setFormat('all');
    setRegion('all');
    setAvailability('all');
  };

  const resultLabel =
    datasets.length === 0
      ? 'Katalog belum berisi dataset.'
      : `${filteredDatasets.length} dataset ditemukan.`;

  return (
    <>
      <section aria-labelledby="data-heading" className="border-b border-line">
        <div className="container-content py-12 md:py-16 lg:py-24">
          <Breadcrumb
            items={[{ label: 'Beranda', to: '/' }, { label: 'Katalog Data' }]}
          />

          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="text-sm font-semibold text-ink-2">Katalog data</p>
              <h1
                id="data-heading"
                className="mt-3 text-3xl text-ink md:text-4xl"
              >
                Katalog Data Geospasial
              </h1>
              <p className="mt-5 max-w-prose text-lg leading-relaxed text-ink-2">
                Temukan dataset geospasial Aceh beserta sumber, periode,
                cakupan wilayah, dan status ketersediaannya.
              </p>
            </div>
            <div className="lg:col-span-5">
              <SearchField
                id="cari-dataset"
                label="Cari dataset"
                value={query}
                onChange={setQuery}
                placeholder="Contoh: kependudukan, sekolah, format"
                hint="Pencarian mencocokkan judul, deskripsi, sumber, wilayah, dan kata kunci."
              />
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="filter-data-heading"
        className="border-b border-line bg-surface-soft"
      >
        <div className="container-content py-6 md:py-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2
                id="filter-data-heading"
                className="text-sm font-semibold text-ink"
              >
                Filter dataset
              </h2>
              <p className="mt-1 text-xs text-ink-3">
                Pilihan mengikuti metadata dataset yang sudah tersedia.
              </p>
            </div>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex min-h-11 items-center rounded border border-line-strong bg-surface px-4 text-sm font-semibold text-forest transition-[background-color,border-color,color,transform] duration-200 ease-editorial hover:bg-forest-soft active:translate-y-px"
              >
                Bersihkan filter
              </button>
            ) : null}
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <FilterSelect
              id="filter-kategori"
              label="Kategori data"
              value={category}
              onChange={setCategory}
              options={withAllOption(
                'Semua kategori',
                filterOptions.categories,
              )}
            />
            <FilterSelect
              id="filter-tahun"
              label="Tahun"
              value={year}
              onChange={setYear}
              options={withAllOption('Semua tahun', filterOptions.years)}
            />
            <FilterSelect
              id="filter-format"
              label="Format"
              value={format}
              onChange={setFormat}
              options={withAllOption('Semua format', filterOptions.formats)}
            />
            <FilterSelect
              id="filter-wilayah"
              label="Wilayah"
              value={region}
              onChange={setRegion}
              options={withAllOption('Semua wilayah', filterOptions.regions)}
            />
            <FilterSelect
              id="filter-status"
              label="Status ketersediaan"
              value={availability}
              onChange={setAvailability}
              options={datasetAvailabilityOptions.map((option) => ({
                value: option.value,
                label: option.label,
              }))}
            />
          </div>

          <p role="status" aria-live="polite" className="mt-5 text-sm text-ink-3">
            {resultLabel}
          </p>
        </div>
      </section>

      <section
        aria-labelledby="daftar-dataset-heading"
        className="container-content py-12 md:py-16 lg:py-24"
      >
        <h2 id="daftar-dataset-heading" className="sr-only">
          Daftar dataset
        </h2>
        {datasets.length === 0 ? (
          <CatalogEmptyState />
        ) : filteredDatasets.length === 0 ? (
          <FilterEmptyState onClear={clearFilters} />
        ) : (
          <DatasetList items={filteredDatasets} />
        )}
      </section>
    </>
  );
}
