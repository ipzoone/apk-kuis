import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuizSession } from "../hooks/useQuizSession.js";
import QuizCard from "../components/QuizCard.jsx";
import CodeEditor from "../components/CodeEditor.jsx";
import Timer from "../components/Timer.jsx";
import ScoreBadge from "../components/ScoreBadge.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

export default function QuizPage() {
  const { session, loading, error, answer, finish } = useQuizSession();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const question = session.currentQuestion;

  const handleAnswer = useCallback(
    async (value) => {
      if (!question || submitting) return;
      setSubmitting(true);
      try {
        const result = await answer(question.id, value);
        if (!result.nextQuestion) {
          await finish();
          navigate("/result");
        }
      } finally {
        setSubmitting(false);
      }
    },
    [question, submitting, answer, finish, navigate]
  );

  const handleTimeExpire = useCallback(() => handleAnswer(null), [handleAnswer]);

  if (loading && !question) {
    return <LoadingSpinner label="Menyiapkan soal..." />;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center text-rose-400">
        Terjadi kesalahan: {error}
      </div>
    );
  }

  if (!question) {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center text-slate-400">
        Belum ada sesi kuis aktif. Kembali ke beranda untuk memulai.
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-6 px-6 py-16">
      <div className="flex items-center justify-between">
        <ScoreBadge score={session.score} level={session.level} />
        <span className="text-xs text-slate-500">{session.topic}</span>
      </div>

      <Timer seconds={30} resetKey={question.id} onExpire={handleTimeExpire} />

      {question.type === "coding" ? (
        <CodeEditor
          language={question.language ?? "javascript"}
          starterCode={question.starterCode ?? ""}
          onSubmit={handleAnswer}
          disabled={submitting}
        />
      ) : (
        <QuizCard question={question} onAnswer={handleAnswer} disabled={submitting} />
      )}
    </div>
  );
}
