import { useLocation } from 'react-router-dom';
import ButtonLink from '../../components/ui/ButtonLink';
import StatusTag from '../../components/ui/StatusTag';

type PublicPlaceholderPageProps = {
  title: string;
  description: string;
};

export default function PublicPlaceholderPage({
  title,
  description,
}: PublicPlaceholderPageProps) {
  const { pathname } = useLocation();

  return (
    <section className="container-content py-16 md:py-24">
      <div className="max-w-prose">
        <p className="text-sm font-semibold text-ink-2">Navigasi publik</p>
        <h1 className="mt-4 text-3xl text-ink md:text-4xl">{title}</h1>
        <p className="mt-5 text-lg text-ink-2">{description}</p>

        <div className="mt-8">
          <StatusTag status="partial">Halaman sedang disiapkan</StatusTag>
        </div>

        <p className="mt-6 text-base text-ink-2">
          Konten halaman ini akan ditambahkan pada tahap berikutnya. Navigasi publik sudah
          dapat digunakan.
        </p>

        {pathname !== '/' && (
          <div className="mt-8">
            <ButtonLink to="/" variant="secondary">
              Kembali ke beranda
            </ButtonLink>
          </div>
        )}
      </div>
    </section>
  );
}
