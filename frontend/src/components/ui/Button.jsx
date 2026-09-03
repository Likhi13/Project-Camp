import Spinner from "./Spinner";

export default function Button({
  children,
  isLoading,
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium px-4 py-2.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-accent text-white hover:bg-accent/90",
    secondary:
      "border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5",
    ghost: "text-muted hover:text-text-light dark:hover:text-text-dark",
  };
  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Spinner size={14} />}
      {children}
    </button>
  );
}
