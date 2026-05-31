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
      <div className="page-bg">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/users" element={<Users />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
