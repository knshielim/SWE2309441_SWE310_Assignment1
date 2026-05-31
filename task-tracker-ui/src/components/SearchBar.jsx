import { ENTITY_STYLE } from "./PageUI";

// Search input
function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full border bg-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 ${ENTITY_STYLE.inputFocus}`}
    />
  );
}

export default SearchBar;
