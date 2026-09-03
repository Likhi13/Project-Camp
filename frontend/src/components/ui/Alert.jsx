export default function Alert({ type = "error", children }) {
  const styles = {
    error: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    success:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    info: "bg-accent/10 text-accent border-accent/20",
  };
  return (
    <div className={`text-sm px-3 py-2.5 rounded-md border ${styles[type]}`}>
      {children}
    </div>
  );
}
