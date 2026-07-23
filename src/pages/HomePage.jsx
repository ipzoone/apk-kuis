import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuizSession } from "../hooks/useQuizSession.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

const TOPIC_PRESETS = ["Pemrograman JavaScript", "Sejarah Indonesia", "Matematika Dasar", "Bahasa Inggris"];

export default function HomePage() {
  const [topic, setTopic] = useState("");
  const { begin, loading, error } = useQuizSession();
  const navigate = useNavigate();

  const handleStart = async (chosenTopic) => {
    const finalTopic = chosenTopic ?? topic;
    if (!finalTopic.trim()) return;
    await begin(finalTopic);
    navigate("/quiz");
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 text-center">
      <p className="mb-3 font-mono text-xs uppercase tracking-widest text-violet-soft">
        Kuis interaktif buatan AI
      </p>
      <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
        Uji pemahamanmu, dibuat AI khusus untukmu
      </h1>
      <p className="mt-4 max-w-md text-slate-400">
        Tulis topik apa saja, soal akan digenerate langsung dan tingkat kesulitan
        menyesuaikan seiring kamu menjawab.
      </p>

      <div className="mt-8 flex w-full max-w-md gap-2">
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Contoh: Fisika kuantum untuk pemula"
          className="flex-1 rounded-xl border border-white/10 bg-ink-soft px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-violet"
        />
        <button
          onClick={() => handleStart()}
          disabled={loading || !topic.trim()}
          className="rounded-xl bg-violet px-5 py-3 text-sm font-medium text-white transition hover:bg-violet-soft disabled:opacity-50"
        >
          Mulai
        </button>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {TOPIC_PRESETS.map((preset) => (
          <button
            key={preset}
            onClick={() => handleStart(preset)}
            disabled={loading}
            className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-400 transition hover:border-white/20 hover:text-white"
          >
            {preset}
          </button>
        ))}
      </div>

      {loading && <LoadingSpinner label="Menyiapkan soal pertama..." />}
      {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}
    </div>
  );
}
