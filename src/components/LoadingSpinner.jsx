export default function LoadingSpinner({ label = "Memuat..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-soft border-t-transparent" />
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  );
}
