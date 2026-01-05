import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Admin Dashboard</h1>
        <p className="subtitle">관리할 항목을 선택하세요</p>
      </header>

      <div className="menu-grid">
        <Link to="/skills" className="menu-card skills-card">
          <div className="card-icon">🛠️</div>
          <h2>Skills</h2>
          <p>기술 스택과 카테고리를 관리합니다</p>
          <span className="card-arrow">→</span>
        </Link>

        <Link to="/projects" className="menu-card projects-card">
          <div className="card-icon">📁</div>
          <h2>Projects</h2>
          <p>프로젝트 정보와 상세 내용을 관리합니다</p>
          <span className="card-arrow">→</span>
        </Link>

        <Link to="/careers" className="menu-card careers-card">
          <div className="card-icon">💼</div>
          <h2>Careers</h2>
          <p>경력 정보와 사업 내역을 관리합니다</p>
          <span className="card-arrow">→</span>
        </Link>

        <Link to="/certifications" className="menu-card certifications-card">
          <div className="card-icon">🏆</div>
          <h2>Certifications</h2>
          <p>자격증과 수상 내역을 관리합니다</p>
          <span className="card-arrow">→</span>
        </Link>
      </div>

      <footer className="home-footer">
        <p>jejinni Admin Panel</p>
      </footer>
    </div>
  );
};

export default Home;

