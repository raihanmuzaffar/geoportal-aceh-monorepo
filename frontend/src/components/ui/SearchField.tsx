type SearchFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
};

export default function SearchField({
  id,
  label,
  value,
  onChange,
  placeholder,
  hint,
}: SearchFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-ink">
        {label}
      </label>
      <input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-describedby={hintId}
        className="mt-2 min-h-11 w-full rounded border border-line-strong bg-surface px-3 py-2 text-base text-ink transition-[border-color,background-color] duration-200 ease-editorial placeholder:text-ink-3 hover:border-ink-3 focus:border-forest focus-visible:outline-earth"
      />
      {hint ? (
        <p id={hintId} className="mt-2 text-xs leading-relaxed text-ink-3">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
