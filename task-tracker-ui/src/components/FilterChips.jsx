// Segmented pill filter with optional counts
function FilterChips({ options, value, onChange, counts }) {
  return (
    <div className="flex flex-wrap gap-1 rounded-full bg-slate-100 p-1">
      {options.map((option) => {
        const active = value === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
              active ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {option}
            {counts && counts[option] !== undefined && (
              <span
                className={`rounded-full px-1.5 text-xs ${
                  active ? "bg-blue-100 text-blue-700" : "bg-slate-200/70 text-slate-500"
                }`}
              >
                {counts[option]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default FilterChips;
