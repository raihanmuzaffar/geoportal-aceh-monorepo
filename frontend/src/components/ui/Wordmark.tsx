import { Link } from 'react-router-dom';

type WordmarkProps = {
  className?: string;
};

export default function Wordmark({ className = '' }: WordmarkProps) {
  return (
    <Link
      to="/"
      aria-label="Geoportal Aceh, kembali ke beranda"
      className={`font-display text-lg font-semibold tracking-display text-ink ${className}`}
    >
      Geoportal Aceh
    </Link>
  );
}
