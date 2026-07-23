// Semua panggilan backend project ai-quiz-app terpusat di sini.
// -> /quiz              : agents/quiz        (LangGraph, session mode)
// -> /quiz/leaderboard  : edge-functions/quiz (edge node, cepat)
// -> /score/history     : cloud-functions/score (request mode)

async function handle(response) {
  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(message || "Request gagal");
  }
  return response.json();
}

export const startQuiz = (topic, conversationId) =>
  fetch("/quiz", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ topic, conversation_id: conversationId }),
  }).then(handle);

export const submitAnswer = (conversationId, questionId, answer) =>
  fetch("/quiz", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      conversation_id: conversationId,
      action: "answer",
      question_id: questionId,
      answer,
    }),
  }).then(handle);

export const stopQuiz = (conversationId) =>
  fetch("/quiz/stop", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ conversation_id: conversationId }),
  }).then(handle);

export const getLeaderboard = () =>
  fetch("/quiz/leaderboard").then(handle);

export const getScoreHistory = (userId) =>
  fetch(`/score/history?userId=${encodeURIComponent(userId)}`).then(handle);
