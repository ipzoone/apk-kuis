// 1. UBAH BARIS PERTAMA: Tambahkan import "Annotation" di ujungnya
import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";

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

// 2. UBAH BAGIAN INI: Bungkus QuizState menggunakan Annotation.Root agar kompatibel dengan versi terbaru
const QuizState = Annotation.Root({
  messages: Annotation({ 
    reducer: (current, next) => current.concat(next), default: () => [] 
  }),
  currentQuestion: Annotation({ 
    reducer: (x) => x, default: () => "" 
  }),
  correctAnswer: Annotation({ 
    reducer: (x) => x, default: () => "" 
  }),
  score: Annotation({
    reducer: (current, next) => current + next, default: () => 0 
  }),
  questionCount: Annotation({
    reducer: (current, next) => current + next, default: () => 0 
  }),
});

// =========================================================================
// SISA KODE DI BAWAH INI SAMA PERSIS SEPERTI FILE ASLI ANDA (TIDAK BERUBAH)
// =========================================================================

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

export const onRequestPost = async (context) => {
  try {
    const requestData = await context.request.json();
    const currentMessages = requestData.messages || [];

    // Memicu jalannya grafik LangGraph menggunakan data HTTP Request
    const resultState = await agent.invoke({
      messages: currentMessages,
      currentQuestion: requestData.currentQuestion || "",
      correctAnswer: requestData.correctAnswer || "",
      score: requestData.score || 0,
      questionCount: requestData.questionCount || 0
    });

    // Mengembalikan status data kuis terupdate ke Frontend atau Curl
    return new Response(JSON.stringify(resultState), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
