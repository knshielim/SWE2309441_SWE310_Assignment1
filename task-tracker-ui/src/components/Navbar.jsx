import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/projects", label: "Projects" },
  { to: "/tasks", label: "Tasks" },
  { to: "/users", label: "Users" },
];

// Navigation bar
function Navbar() {
  const linkClass = ({ isActive }) =>
    isActive
      ? "px-4 py-2 rounded-lg bg-white text-blue-800 font-semibold shadow-sm"
      : "px-4 py-2 rounded-lg text-blue-100 hover:bg-blue-700 font-medium transition";

  return (
    <nav className="bg-gradient-to-r from-blue-800 to-blue-700 border-b border-blue-900 shadow-lg">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <span className="text-white text-xl font-bold flex items-center gap-2 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-lg shadow-md">
            📋
          </span>
          Task Tracker
        </span>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {NAV_ITEMS.map(({ to, label, end }) => (
            <NavLink key={to} to={to} className={linkClass} end={end}>
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
