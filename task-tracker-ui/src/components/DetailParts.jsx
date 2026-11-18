import { Avatar, formatDate } from "./PageUI";
import Icon from "./Icons";

// Small label/value tile used at the top of detail modals
export function MetaItem({ label, children }) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 px-3 py-2.5">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <div className="mt-1 text-sm text-slate-800">{children}</div>
    </div>
  );
}

// One entry in a comment / update feed
export function FeedItem({ author, date, title, content, onDelete }) {
  return (
    <li className="group flex gap-3">
      <Avatar name={author} />
      <div className="min-w-0 flex-1 rounded-xl border border-slate-200/80 bg-white px-3.5 py-2.5">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm">
            <span className="font-semibold text-slate-800">{author}</span>
            <span className="ml-2 text-xs text-slate-400">{formatDate(date, true)}</span>
          </p>
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-slate-400 opacity-0 transition hover:bg-rose-50 hover:text-rose-600 focus:opacity-100 group-hover:opacity-100"
            aria-label="Delete"
            title="Delete"
          >
            <Icon name="trash" className="h-3.5 w-3.5" />
          </button>
        </div>
        {title && <p className="mt-1 text-sm font-semibold text-slate-900">{title}</p>}
        <p className="mt-0.5 whitespace-pre-line text-sm text-slate-600">{content}</p>
      </div>
    </li>
  );
}
