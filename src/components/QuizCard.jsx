import { useState } from "react";

export default function QuizCard({ question, onAnswer, disabled }) {
  const [selected, setSelected] = useState(null);

  if (!question) return null;

  const handleSelect = (optionId) => {
    if (disabled) return;
    setSelected(optionId);
    onAnswer?.(optionId);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-ink-soft p-6">
      {question.imageUrl && (
        <img
          src={question.imageUrl}
          alt=""
          className="mb-4 h-40 w-full rounded-xl object-cover"
        />
      )}

      <h2 className="font-display text-xl font-bold text-white">{question.text}</h2>

      <div className="mt-5 grid gap-3">
        {question.options.map((option, i) => {
          const isSelected = selected === option.id;
          return (
            <button
              key={option.id}
              type="button"
              disabled={disabled}
              onClick={() => handleSelect(option.id)}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
                isSelected
                  ? "border-violet bg-violet/10 text-white"
                  : "border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/5"
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/15 font-mono text-xs text-slate-400">
                {String.fromCharCode(65 + i)}
              </span>
              {option.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
