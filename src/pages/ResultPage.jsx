import { Link } from "react-router-dom";
import { useQuiz } from "../context/QuizContext.jsx";
import ScoreBadge from "../components/ScoreBadge.jsx";

export default function ResultPage() {
  const { session } = useQuiz();

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-violet-soft">Kuis selesai</p>
      <h1 className="font-display text-3xl font-bold text-white">
        Topik: {session.topic ?? "-"}
      </h1>

      <ScoreBadge score={session.score} level={session.level} />

      <p className="text-sm text-slate-400">
        Skor kamu sudah tersimpan. Cek posisimu di leaderboard.
      </p>

      <div className="flex gap-3">
        <Link
          to="/"
          className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-slate-300 transition hover:border-white/20 hover:text-white"
        >
          Kuis baru
        </Link>
        <Link
          to="/leaderboard"
          className="rounded-xl bg-violet px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-soft"
        >
          Lihat leaderboard
        </Link>
      </div>
    </div>
  );
}
