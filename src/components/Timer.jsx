import { useEffect, useState } from "react";

export default function Timer({ seconds = 30, onExpire, resetKey }) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds, resetKey]);

  useEffect(() => {
    if (remaining <= 0) {
      onExpire?.();
      return;
    }
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining, onExpire]);

  const percent = Math.max(0, (remaining / seconds) * 100);
  const isUrgent = remaining <= 5;

  return (
    <div className="w-full">
      <div className="mb-1 flex justify-between text-xs text-slate-400">
        <span>Waktu tersisa</span>
        <span className={isUrgent ? "text-rose-400" : "text-slate-300"}>{remaining}s</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${
            isUrgent ? "bg-rose-400" : "bg-violet"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
