export function BadgeCardSkeleton() {
  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-black/5 bg-gray-50 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-gray-200 mt-1" />
      <div className="w-14 h-4 bg-gray-200 rounded-full" />
      <div className="w-20 h-3 bg-gray-200 rounded-full" />
      <div className="w-full h-1.5 bg-gray-200 rounded-full" />
      <div className="w-10 h-3 bg-gray-200 rounded-full" />
    </div>
  );
}
