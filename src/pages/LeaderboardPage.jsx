import { Link } from "react-router-dom";
import { useLeaderboard } from "../hooks/useLeaderboard.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

export default function LeaderboardPage() {
  const { scores, loading, error } = useLeaderboard();

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-white">Leaderboard</h1>
        <Link to="/" className="text-sm text-violet-soft hover:underline">
          Kuis baru
        </Link>
      </div>

      {loading && <LoadingSpinner label="Mengambil skor tertinggi..." />}
      {error && <p className="text-sm text-rose-400">{error}</p>}

      {!loading && !error && scores.length === 0 && (
        <p className="text-sm text-slate-400">Belum ada skor tercatat. Jadilah yang pertama.</p>
      )}

      <ol className="space-y-2">
        {scores.map((entry, i) => (
          <li
            key={entry.userId}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-ink-soft px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-slate-500">{i + 1}</span>
              <span className="text-sm text-slate-100">{entry.name}</span>
            </div>
            <span className="font-display font-bold text-amber">{entry.score}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
