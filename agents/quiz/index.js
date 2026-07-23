import { StateGraph, START, END } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config"; // Pastikan dotenv di-import untuk membaca file .env lokal

// 1. Inisialisasi Model AI Sesuai Dokumentasi Resmi EdgeOne Makers
const model = new ChatOpenAI({
  configuration: {
    // Menggunakan base URL resmi EdgeOne Makers
    baseURL: "https://ai-gateway.edgeone.link/v1", 
    // Menggunakan variabel key yang tepat dari dokumen
    apiKey: process.env.MAKERS_MODELS_KEY, 
  },
  // Menggunakan nama model resmi dari dokumentasi EdgeOne (misal DeepSeek Flash)
  modelName: "@makers/deepseek-v4-flash", 
  temperature: 0.7,
});

const QuizState = {
  messages: { 
    value: (current, next) => current.concat(next), default: () => [] 
},
  currentQuestion: { 
    value: (x) => x, default: () => "" },
  correctAnswer: { value: (x) => x, default: () => "" 
  },
  score: {
     value: (current, next) => current + next, default: () => 0 
    },
  questionCount: {
     value: (current, next) => current + next, default: () => 0 
    },
};

const generateQuestionNode = async (state) => {
  const prompt = `Buatlah 1 pertanyaan kuis pilihan ganda (A, B, C, D) yang seru tentang programming backend, Pengetahuan umum, Matematika, Agama, Sains, dan lainnya. 
  Berikan output dalam format JSON bersih seperti ini:
  {
    "pertanyaan": "Isi pertanyaan di sini...",
    "pilihan": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "jawaban_benar": "A"
  }`;

  const response = await model.invoke([
    { role: "system", content: "Anda adalah sistem kuis backend yang mengembalikan JSON baku." },
    { role: "user", content: prompt }
  ]);

  const quizData = JSON.parse(response.content);
  return {
    currentQuestion: quizData.pertanyaan,
    correctAnswer: quizData.jawaban_benar,
    questionCount: 1,
    messages: [{ role: "ai", content: JSON.stringify(quizData) }]
  };
};

const evaluateAnswerNode = async (state) => {
  const lastMessage = state.messages[state.messages.length - 1];
  const userAnswer = lastMessage.content.toUpperCase().trim();
  let points = 0;
  let feedback = "Jawaban Anda salah.";

  if (userAnswer === state.correctAnswer) {
    points = 10;
    feedback = "Jawaban Anda benar! +10 poin.";
  }

  return {
    score: points,
    messages: [{ role: "system", content: feedback }]
  };
};

const shouldContinue = (state) => {
  if (state.questionCount >= 3) return END;
  return "generate_question";
};

const workflow = new StateGraph(QuizState)
  .addNode("generate_question", generateQuestionNode)
  .addNode("evaluate_answer", evaluateAnswerNode)
  .addEdge(START, "generate_question")
  .addEdge("generate_question", "evaluate_answer")
  .addConditionalEdges("evaluate_answer", shouldContinue);

export const agent = workflow.compile();
