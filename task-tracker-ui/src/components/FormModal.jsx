import { useEffect } from "react";
import Icon from "./Icons";

// Modal dialog. Closes on backdrop click or Escape, and locks page scroll while open.
function FormModal({ children, onClose, maxWidth = "max-w-xl", title, subtitle }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`relative flex max-h-[90vh] w-full animate-pop-in flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ${maxWidth}`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4">
          <div className="min-w-0">
            {title && <h2 className="truncate text-lg font-semibold text-slate-900">{title}</h2>}
            {subtitle && <div className="mt-0.5 text-sm text-slate-500">{subtitle}</div>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="-mr-2 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <Icon name="x" className="h-5 w-5" />
          </button>
        </div>
        <div className="scroll-thin overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

export default FormModal;
