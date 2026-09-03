export default function Input({ label, error, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium">{label}</label>}
      <input
        className={`w-full rounded-md border px-3 py-2.5 text-sm bg-surface-light dark:bg-surface-dark outline-none transition-colors focus:border-accent ${
          error ? "border-red-500" : "border-black/10 dark:border-white/10"
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
