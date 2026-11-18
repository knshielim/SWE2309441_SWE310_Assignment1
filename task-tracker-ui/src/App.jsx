import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Users from "./pages/Users";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="page-bg">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/users" element={<Users />} />
          </Routes>
        </div>
      </main>
    </BrowserRouter>
  );
}

export default App;
