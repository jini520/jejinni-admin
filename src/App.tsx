import { Routes, Route, Link, useLocation } from "react-router-dom";
import "./App.css";
import Home from "./home/Home";
import Skills from "./skills/Skills";
import Projects from "./projects/Projects";
import ProjectDetail from "./projects/ProjectDetail";

function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="app">
      {!isHome && (
        <nav className="main-nav">
          <Link to="/" className="nav-brand">
            Admin
          </Link>
          <div className="nav-links">
            <Link
              to="/skills"
              className={`nav-link ${
                location.pathname === "/skills" ? "active" : ""
              }`}
            >
              Skills
            </Link>
            <Link
              to="/projects"
              className={`nav-link ${
                location.pathname.startsWith("/projects") ? "active" : ""
              }`}
            >
              Projects
            </Link>
          </div>
        </nav>
      )}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
