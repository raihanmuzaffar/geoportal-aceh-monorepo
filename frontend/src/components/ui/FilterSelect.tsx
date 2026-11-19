type FilterOption = {
  value: string;
  label: string;
};

type FilterSelectProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
};

export default function FilterSelect({
  id,
  label,
  value,
  onChange,
  options,
}: FilterSelectProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-ink-2">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-11 w-full rounded border border-line-strong bg-surface px-3 py-2 text-sm text-ink transition-[border-color,background-color] duration-200 ease-editorial hover:border-ink-3 focus:border-forest focus-visible:outline-earth"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
