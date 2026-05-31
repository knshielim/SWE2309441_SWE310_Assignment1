// Blue Primary colour
export const ENTITY_STYLE = {
  header:
    "bg-white rounded-xl border border-gray-200 border-l-4 border-l-blue-400 shadow-md",
  icon: "bg-blue-100 ring-2 ring-pink-200",
  title: "text-gray-800",
  btn: "bg-blue-200 text-blue-800 hover:bg-blue-300 shadow-sm",
  panel: "bg-blue-50/50 border-blue-200 border-l-2 border-l-pink-200 shadow-sm",
  tableWrap: "border-gray-200 shadow-md rounded-lg overflow-hidden",
  tableHead: "bg-blue-200 text-blue-900",
  rowEven: "bg-blue-50/30",
  rowOdd: "bg-white",
  rowHover: "hover:bg-blue-100/50",
  editBtn: "bg-blue-100 text-blue-800 hover:bg-blue-200 shadow-sm",
  empty: "text-gray-500",
  filterActive: "bg-blue-200 text-blue-800 border-blue-300 shadow-sm",
  filterIdle: "bg-white text-gray-600 border-gray-200 hover:bg-pink-50 hover:border-pink-200",
  inputFocus: "focus:ring-blue-300 border-gray-300",
};

// Pink Secondary colour
export const SUB_STYLE = {
  badge: "bg-pink-100 text-pink-800 border border-pink-200",
  btn: "bg-pink-200 text-pink-800 hover:bg-pink-300",
  deleteBtn: "bg-pink-200 text-pink-900 hover:bg-pink-300",
  text: "text-pink-700",
  textStrong: "text-pink-600 font-semibold",
  border: "border-pink-200",
  borderAccent: "border-l-pink-300",
  ring: "ring-pink-200",
  sectionBar: "bg-gradient-to-b from-blue-400 to-pink-300",
};

export function PageHeader({ title, buttonLabel, onAdd, icon }) {
  return (
    <div
      className={`flex items-center justify-between mb-6 p-4 ${ENTITY_STYLE.header}`}
    >
      <h1 className={`text-3xl font-bold flex items-center gap-3 ${ENTITY_STYLE.title}`}>
        {icon && (
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-lg text-xl ${ENTITY_STYLE.icon}`}
          >
            {icon}
          </span>
        )}
        {title}
      </h1>
      {buttonLabel && onAdd && (
        <button
          type="button"
          onClick={onAdd}
          className={`px-4 py-2 rounded-lg font-semibold shadow-sm transition ${ENTITY_STYLE.btn}`}
        >
          + {buttonLabel}
        </button>
      )}
    </div>
  );
}

export function SectionTitle({ children }) {
  return (
    <h2 className="text-xl font-bold mb-4 text-gray-700 flex items-center gap-2">
      <span className={`w-1.5 h-6 rounded-full ${SUB_STYLE.sectionBar}`} />
      {children}
    </h2>
  );
}

export function Card({ children, className = "", accent = "blue" }) {
  const topBorder = {
    blue: "border-t-blue-400",
    pink: "border-t-pink-300",
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 border-t-4 ${topBorder[accent] || topBorder.blue} p-5 mb-6 hover:shadow-md transition-shadow ${className}`}
    >
      {children}
    </div>
  );
}

export function Panel({ children, className = "" }) {
  return (
    <div
      className={`rounded-xl border shadow-sm p-5 mb-6 ${ENTITY_STYLE.panel} ${className}`}
    >
      {children}
    </div>
  );
}
