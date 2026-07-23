const LEVEL_COLOR = {
  easy: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  medium: "bg-amber/15 text-amber border-amber/30",
  hard: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

export default function ScoreBadge({ score, level = "medium" }) {
  const levelClass = LEVEL_COLOR[level] ?? LEVEL_COLOR.medium;

  return (
    <div className="flex items-center gap-3">
      <div className="rounded-full border border-white/10 bg-ink-soft px-4 py-1.5">
        <span className="font-display text-lg font-bold text-white">{score}</span>
        <span className="ml-1 text-xs text-slate-400">poin</span>
      </div>
      <span className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${levelClass}`}>
        {level}
      </span>
    </div>
  );
}
