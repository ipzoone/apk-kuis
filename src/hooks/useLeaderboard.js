import { useState, useEffect } from "react";
import { getLeaderboard } from "../lib/api.js";

export function useLeaderboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getLeaderboard()
      .then((data) => {
        if (!cancelled) setScores(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { scores, loading, error };
}
