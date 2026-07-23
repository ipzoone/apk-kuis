import { useState, useCallback } from "react";
import { useQuiz } from "../context/QuizContext.jsx";
import { startQuiz, submitAnswer, stopQuiz } from "../lib/api.js";

export function useQuizSession() {
  const { session, startSession, updateSession } = useQuiz();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const begin = useCallback(
    async (topic) => {
      setLoading(true);
      setError(null);
      try {
        const conversationId = startSession(topic);
        const result = await startQuiz(topic, conversationId);
        updateSession({ currentQuestion: result.question, level: result.level });
        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [startSession, updateSession]
  );

  const answer = useCallback(
    async (questionId, value) => {
      setLoading(true);
      setError(null);
      try {
        const result = await submitAnswer(session.conversationId, questionId, value);
        updateSession({
          score: result.score,
          level: result.level,
          currentQuestion: result.nextQuestion ?? null,
        });
        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [session.conversationId, updateSession]
  );

  const finish = useCallback(async () => {
    if (!session.conversationId) return;
    await stopQuiz(session.conversationId);
  }, [session.conversationId]);

  return { session, loading, error, begin, answer, finish };
}
