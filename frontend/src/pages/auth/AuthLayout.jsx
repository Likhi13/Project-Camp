export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-light dark:bg-bg-dark px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="font-heading font-semibold text-xl">
            Project Camp
          </span>
        </div>
        <div className="bg-surface-light dark:bg-surface-dark border border-black/10 dark:border-white/10 rounded-lg p-6">
          <h1 className="text-lg font-heading font-semibold mb-1">{title}</h1>
          {subtitle && <p className="text-sm text-muted mb-5">{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}
