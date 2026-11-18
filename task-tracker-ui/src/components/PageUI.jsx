import Icon from "./Icons";

// ---------------------------------------------------------------------------
// Shared design tokens (blue primary, pink secondary accent, slate neutrals)
// ---------------------------------------------------------------------------

export const inputClass = (hasError = false) =>
  `w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 shadow-xs transition focus:outline-none focus:ring-4 ${
    hasError
      ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
      : "border-slate-200 focus:border-blue-300 focus:ring-blue-100"
  }`;

const STATUS_STYLES = {
  "To Do": { pill: "bg-slate-100 text-slate-700 ring-slate-200", dot: "bg-slate-400" },
  "Not Started": { pill: "bg-slate-100 text-slate-700 ring-slate-200", dot: "bg-slate-400" },
  "In Progress": { pill: "bg-blue-50 text-blue-700 ring-blue-200", dot: "bg-blue-500" },
  Completed: { pill: "bg-emerald-50 text-emerald-700 ring-emerald-200", dot: "bg-emerald-500" },
};

const PRIORITY_STYLES = {
  Low: { pill: "bg-slate-50 text-slate-600 ring-slate-200", dot: "bg-slate-400" },
  Medium: { pill: "bg-amber-50 text-amber-700 ring-amber-200", dot: "bg-amber-500" },
  High: { pill: "bg-rose-50 text-rose-700 ring-rose-200", dot: "bg-rose-500" },
};

// Hex values kept in sync with the pills above, for charts
export const STATUS_HEX = {
  "To Do": "#cdbcaa",
  "In Progress": "#7c86cf",
  Completed: "#80ab84",
};

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

export function PageHeader({ title, subtitle, icon, buttonLabel, onAdd, children }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-center gap-4">
        {icon && (
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-300 to-pink-300 text-white shadow-md shadow-pink-300/30">
            <Icon name={icon} className="h-6 w-6" />
          </span>
        )}
        <div>
          <h1 className="text-3xl text-slate-900 sm:text-4xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {children}
        {buttonLabel && onAdd && (
          <Button onClick={onAdd} icon="plus">
            {buttonLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

export function SectionTitle({ children, className = "" }) {
  return (
    <h2 className={`mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 ${className}`}>
      {children}
    </h2>
  );
}

export function Card({ children, className = "", title, icon, action }) {
  return (
    <div
      className={`mb-6 rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm backdrop-blur-sm ${className}`}
    >
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-2">
          <h3 className="flex items-center gap-2 text-base font-semibold text-slate-800">
            {icon && <Icon name={icon} className="h-4 w-4 text-slate-400" />}
            {title}
          </h3>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function Panel({ children, className = "" }) {
  return (
    <div
      className={`mb-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Controls
// ---------------------------------------------------------------------------

const BUTTON_VARIANTS = {
  primary:
    "bg-blue-500 text-white shadow-sm shadow-blue-500/25 hover:bg-blue-600 focus-visible:ring-blue-200",
  secondary:
    "bg-white text-slate-700 border border-slate-300 shadow-xs hover:bg-slate-50 focus-visible:ring-slate-200",
  danger: "bg-rose-600 text-white shadow-sm hover:bg-rose-700 focus-visible:ring-rose-200",
  ghost: "text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-200",
};

const BUTTON_SIZES = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-5 py-2.5 text-sm gap-2",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  loading = false,
  className = "",
  type = "button",
  disabled,
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-full font-bold transition focus:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${BUTTON_VARIANTS[variant]} ${BUTTON_SIZES[size]} ${className}`}
      {...rest}
    >
      {loading ? (
        <Icon name="loader" className="h-4 w-4 animate-spin" />
      ) : (
        icon && <Icon name={icon} className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />
      )}
      {children}
    </button>
  );
}

// Small square icon button used for row actions
export function IconButton({ icon, label, onClick, tone = "default" }) {
  const tones = {
    default: "text-slate-500 hover:bg-slate-100 hover:text-slate-800",
    primary: "text-slate-500 hover:bg-blue-50 hover:text-blue-700",
    danger: "text-slate-500 hover:bg-rose-50 hover:text-rose-600",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 ${tones[tone]}`}
    >
      <Icon name={icon} className="h-4 w-4" />
    </button>
  );
}

export function Field({ label, optional, error, hint, children, className = "" }) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {optional && <span className="ml-1 font-normal text-slate-400">(optional)</span>}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-600">
          <Icon name="alert" className="h-3.5 w-3.5" />
          {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-slate-400">{hint}</p>
      )}
    </div>
  );
}

export function Alert({ children, tone = "error" }) {
  const tones = {
    error: "border-rose-200 bg-rose-50 text-rose-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  };
  return (
    <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${tones[tone]}`}>
      <Icon name={tone === "error" ? "alert" : "checkCircle"} className="h-4 w-4 shrink-0" />
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Data display
// ---------------------------------------------------------------------------

export function StatusBadge({ value, kind = "status" }) {
  const styles = kind === "priority" ? PRIORITY_STYLES : STATUS_STYLES;
  const style = styles[value] ?? { pill: "bg-slate-100 text-slate-600 ring-slate-200", dot: "bg-slate-400" };
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${style.pill}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {value}
    </span>
  );
}

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-pink-100 text-pink-700",
  "bg-violet-100 text-violet-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-cyan-100 text-cyan-700",
];

export function Avatar({ name, size = "md" }) {
  const sizes = { sm: "h-6 w-6 text-[10px]", md: "h-8 w-8 text-xs", lg: "h-10 w-10 text-sm" };
  if (!name) {
    return (
      <span
        className={`inline-flex shrink-0 items-center justify-center rounded-full border border-dashed border-slate-300 text-slate-400 ${sizes[size]}`}
      >
        ?
      </span>
    );
  }
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
  const hash = [...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${AVATAR_COLORS[hash % AVATAR_COLORS.length]} ${sizes[size]}`}
    >
      {initials}
    </span>
  );
}

export function Person({ name, fallback = "Unassigned", sub }) {
  return (
    <div className="flex items-center gap-2.5">
      <Avatar name={name} />
      <div className="min-w-0">
        <p className={`truncate text-sm ${name ? "font-medium text-slate-800" : "text-slate-400"}`}>
          {name || fallback}
        </p>
        {sub && <p className="truncate text-xs text-slate-500">{sub}</p>}
      </div>
    </div>
  );
}

export function ProgressBar({ percent = 0 }) {
  const color = percent >= 100 ? "bg-emerald-500" : percent > 0 ? "bg-blue-500" : "bg-slate-300";
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
      />
    </div>
  );
}

// Table chrome shared by Projects / Tasks / Users
export function DataTable({ columns, children }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50/80">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.label}
                  scope="col"
                  className={`whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 ${
                    col.align === "right" ? "text-right" : "text-left"
                  } ${col.className ?? ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">{children}</tbody>
        </table>
      </div>
    </div>
  );
}

export function EmptyState({ icon = "inbox", title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-14 text-center">
      <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <Icon name={icon} className="h-6 w-6" />
      </span>
      <p className="text-sm font-semibold text-slate-700">{title}</p>
      {message && <p className="mt-1 max-w-sm text-sm text-slate-500">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function LoadingState({ label = "Loading..." }) {
  return (
    <div className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200/80 bg-white py-14 text-sm text-slate-500 shadow-sm">
      <Icon name="loader" className="h-5 w-5 animate-spin text-blue-500" />
      {label}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function formatDate(value, withTime = false) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
  });
}

// Days from today until the given date (negative = past)
export function daysUntil(value) {
  if (!value) return null;
  const today = new Date(new Date().toDateString());
  const target = new Date(new Date(value).toDateString());
  return Math.round((target - today) / 86400000);
}

export function relativeDue(value) {
  const d = daysUntil(value);
  if (d === null) return null;
  if (d === 0) return "Due today";
  if (d === 1) return "Due tomorrow";
  if (d > 1) return `In ${d} days`;
  if (d === -1) return "1 day overdue";
  return `${-d} days overdue`;
}
