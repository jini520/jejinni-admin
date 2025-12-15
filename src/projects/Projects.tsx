import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { projectsApi } from "../api/projects";
import type { ProjectListItemDto, ProjectRequestDto } from "../@types";
import "./Projects.css";

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectListItemDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 페이지네이션
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // 모달 상태
  const [showModal, setShowModal] = useState(false);

  // 프로젝트 폼
  const [projectForm, setProjectForm] = useState<ProjectRequestDto>({
    title: "",
    description: "",
    skills: [],
    participants: 1,
    period: "",
    order: 0,
  });
  const [skillInput, setSkillInput] = useState("");

  const titleInputRef = useRef<HTMLInputElement>(null);

  // 모달 열릴 때 포커스
  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showModal]);

  // 프로젝트 목록 로드
  const loadProjects = async (pageNum = 0) => {
    setLoading(true);
    setError(null);
    try {
      const res = await projectsApi.getProjectList(pageNum);
      const data = res.data.data;
      setProjects(data.items || []);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
      setPage(data.number);
    } catch (err) {
      setError("프로젝트 목록을 불러오는데 실패했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // 프로젝트 추가
  const handleAddProject = () => {
    setProjectForm({
      title: "",
      description: "",
      skills: [],
      participants: 1,
      period: "",
      order: totalElements, // 새 프로젝트는 마지막 순서
    });
    setSkillInput("");
    setShowModal(true);
  };

  const handleSaveProject = async () => {
    try {
      const res = await projectsApi.createProject(projectForm);
      setShowModal(false);
      // 생성된 프로젝트 상세로 이동
      navigate(`/projects/${res.data.data.id}`);
    } catch (err) {
      setError("프로젝트 생성에 실패했습니다.");
      console.error(err);
    }
  };

  // 스킬 추가/삭제
  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !projectForm.skills?.includes(trimmed)) {
      setProjectForm({
        ...projectForm,
        skills: [...(projectForm.skills || []), trimmed],
      });
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProjectForm({
      ...projectForm,
      skills: projectForm.skills?.filter((s) => s !== skillToRemove) || [],
    });
  };

  // 페이지 변경
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      loadProjects(newPage);
    }
  };

  return (
    <div className="projects-container">
      <header className="projects-header">
        <h1>Projects 관리</h1>
        <p className="subtitle">프로젝트 상세 내용을 관리합니다</p>
      </header>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>로딩중...</p>
        </div>
      ) : (
        <div className="projects-list-view">
          <div className="section-header">
            <h2>프로젝트 목록 ({totalElements})</h2>
            <button className="btn-primary" onClick={handleAddProject}>
              + 프로젝트 추가
            </button>
          </div>

          {projects.length === 0 ? (
            <div className="empty-state">
              <p>등록된 프로젝트가 없습니다.</p>
              <button className="btn-primary" onClick={handleAddProject}>
                첫 프로젝트 추가하기
              </button>
            </div>
          ) : (
            <>
              <div className="projects-grid">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="project-card"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    <h3 className="project-title">{project.title}</h3>
                    {project.description && (
                      <p className="project-description">{project.description}</p>
                    )}
                    <div className="project-meta">
                      {project.period && (
                        <span className="project-period">📅 {project.period}</span>
                      )}
                      {project.skills && project.skills.length > 0 && (
                        <div className="project-skills">
                          {project.skills.slice(0, 3).map((skill, idx) => (
                            <span key={idx} className="skill-tag">
                              {skill}
                            </span>
                          ))}
                          {project.skills.length > 3 && (
                            <span className="skill-tag more">
                              +{project.skills.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="btn-page"
                    onClick={() => handlePageChange(0)}
                    disabled={page === 0}
                  >
                    ««
                  </button>
                  <button
                    className="btn-page"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 0}
                  >
                    «
                  </button>
                  <span className="page-info">
                    {page + 1} / {totalPages}
                  </span>
                  <button
                    className="btn-page"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages - 1}
                  >
                    »
                  </button>
                  <button
                    className="btn-page"
                    onClick={() => handlePageChange(totalPages - 1)}
                    disabled={page === totalPages - 1}
                  >
                    »»
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* 프로젝트 추가 모달 */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>프로젝트 추가</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveProject();
                }}
              >
                <div className="form-group">
                  <label>제목</label>
                  <input
                    ref={titleInputRef}
                    type="text"
                    value={projectForm.title}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, title: e.target.value })
                    }
                    placeholder="프로젝트 제목"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>설명</label>
                  <textarea
                    value={projectForm.description}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, description: e.target.value })
                    }
                    placeholder="프로젝트 설명"
                    rows={3}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>기간</label>
                    <input
                      type="text"
                      value={projectForm.period}
                      onChange={(e) =>
                        setProjectForm({ ...projectForm, period: e.target.value })
                      }
                      placeholder="예: 2024.01 - 2024.06"
                    />
                  </div>
                  <div className="form-group">
                    <label>참여 인원</label>
                    <input
                      type="number"
                      min="1"
                      value={projectForm.participants}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          participants: parseInt(e.target.value) || 1,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>표시 순서</label>
                  <input
                    type="number"
                    min="0"
                    value={projectForm.order ?? 0}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        order: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>기술 스택</label>
                  <div className="skill-input-wrapper">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                      placeholder="스킬 입력 후 Enter"
                    />
                    <button type="button" className="btn-add-skill" onClick={addSkill}>
                      추가
                    </button>
                  </div>
                  {projectForm.skills && projectForm.skills.length > 0 && (
                    <div className="skill-tags-edit">
                      {projectForm.skills.map((skill, idx) => (
                        <span key={idx} className="skill-tag-edit">
                          {skill}
                          <button
                            type="button"
                            className="skill-remove"
                            onClick={() => removeSkill(skill)}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setShowModal(false)}
                  >
                    취소
                  </button>
                  <button type="submit" className="btn-primary">
                    저장
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
