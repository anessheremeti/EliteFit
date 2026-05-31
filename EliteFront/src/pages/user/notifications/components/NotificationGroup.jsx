export function NotificationGroup({ label, children }) {
  return (
    <section aria-label={`${label} notifications`}>
      <h2 className="text-[11px] font-bold text-dark/35 uppercase tracking-widest px-1 mb-2 select-none">
        {label}
      </h2>
      <div className="space-y-1.5">
        {children}
      </div>
    </section>
  );
}
