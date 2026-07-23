import { useState } from "react";

export default function CodeEditor({ language = "javascript", starterCode = "", onSubmit, disabled }) {
  const [code, setCode] = useState(starterCode);

  const handleKeyDown = (e) => {
    // Tab menyisipkan indentasi, bukan pindah fokus
    if (e.key === "Tab") {
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.target;
      const next = code.slice(0, selectionStart) + "  " + code.slice(selectionEnd);
      setCode(next);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-ink-soft">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="font-mono text-xs text-slate-400">{language}</span>
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/60" />
        </div>
      </div>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        spellCheck={false}
        rows={10}
        className="w-full resize-none bg-transparent p-4 font-mono text-sm text-slate-100 outline-none placeholder:text-slate-600"
        placeholder="// Tulis jawaban kode kamu di sini"
      />

      <div className="flex justify-end border-t border-white/10 px-4 py-3">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSubmit?.(code)}
          className="rounded-lg bg-violet px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-soft disabled:opacity-50"
        >
          Jalankan dan kirim
        </button>
      </div>
    </div>
  );
}
