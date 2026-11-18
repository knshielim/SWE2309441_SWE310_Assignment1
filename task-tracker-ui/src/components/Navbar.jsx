import { useState } from "react";
import { NavLink } from "react-router-dom";
import Icon from "./Icons";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: "dashboard", end: true },
  { to: "/projects", label: "Projects", icon: "folder" },
  { to: "/tasks", label: "Tasks", icon: "check" },
  { to: "/users", label: "Users", icon: "users" },
];

// Navigation bar
function Navbar() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
      isActive
        ? "bg-blue-100/70 text-blue-700"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200/80 bg-[#fbf8f4]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <NavLink to="/" className="flex shrink-0 items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-300 to-pink-300 text-white shadow-md shadow-pink-300/30">
            <Icon name="checkCircle" className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-semibold text-slate-900">Task Tracker</span>
        </NavLink>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map(({ to, label, icon, end }) => (
            <NavLink key={to} to={to} className={linkClass} end={end}>
              <Icon name={icon} className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </div>

        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          <Icon name={open ? "x" : "menu"} className="h-5 w-5" />
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-2 md:hidden">
          {NAV_ITEMS.map(({ to, label, icon, end }) => (
            <NavLink key={to} to={to} className={linkClass} end={end} onClick={() => setOpen(false)}>
              <Icon name={icon} className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
