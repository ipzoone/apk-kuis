import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import QuizPage from "./pages/QuizPage.jsx";
import ResultPage from "./pages/ResultPage.jsx";
import LeaderboardPage from "./pages/LeaderboardPage.jsx";

function App() {
  return (
    <div className="min-h-screen bg-ink text-slate-100">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
      </Routes>
    </div>
  );
}

export default App;
