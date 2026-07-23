import { createContext, useContext, useState } from "react";

const QuizContext = createContext(null);

export function QuizProvider({ children }) {
  const [session, setSession] = useState({
    conversationId: null,
    topic: null,
    level: "medium",
    score: 0,
    currentQuestion: null,
  });

  const startSession = (topic) => {
    const conversationId = crypto.randomUUID();
    setSession({
      conversationId,
      topic,
      level: "medium",
      score: 0,
      currentQuestion: null,
    });
    return conversationId;
  };

  const updateSession = (patch) =>
    setSession((prev) => ({ ...prev, ...patch }));

  return (
    <QuizContext.Provider value={{ session, startSession, updateSession }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz harus dipakai di dalam QuizProvider");
  return ctx;
}
