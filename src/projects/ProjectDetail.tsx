import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { projectsApi, projectContentsApi } from "../api/projects";
import type {
  ProjectDetailDto,
  ProjectRequestDto,
  ProjectContentDto,
  ProjectContentRequestDto,
} from "../@types";
import "./Projects.css";

type ModalType = "project" | "content" | null;

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<ProjectDetailDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 모달 상태
  const [modalType, setModalType] = useState<ModalType>(null);
  const [editingContent, setEditingContent] = useState<ProjectContentDto | null>(null);

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

  // 콘텐츠 폼
  const [contentForm, setContentForm] = useState<ProjectContentRequestDto>({
    projectId: "",
    parentId: undefined,
    order: 0,
    content: "",
  });

  const titleInputRef = useRef<HTMLInputElement>(null);
  const contentInputRef = useRef<HTMLTextAreaElement>(null);

  // 모달 열릴 때 포커스
  useEffect(() => {
    if (modalType === "project") {
      const timer = setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    } else if (modalType === "content") {
      const timer = setTimeout(() => {
        contentInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [modalType]);

  // 프로젝트 상세 로드
  const loadProjectDetail = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await projectsApi.getProjectDetail(id);
      setProject(res.data.data);
    } catch (err) {
      setError("프로젝트 상세를 불러오는데 실패했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjectDetail();
  }, [id]);

  // 프로젝트 수정
  const handleEditProject = () => {
    if (!project) return;
    setProjectForm({
      title: project.title,
      description: project.description || "",
      skills: project.skills || [],
      participants: project.participants || 1,
      period: project.period || "",
      order: project.order ?? 0,
    });
    setSkillInput("");
    setModalType("project");
  };

  const handleSaveProject = async () => {
    if (!project) return;
    try {
      await projectsApi.updateProject(project.id, projectForm);
      closeModal();
      loadProjectDetail();
    } catch (err) {
      setError("프로젝트 저장에 실패했습니다.");
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

  // 콘텐츠 CRUD
  const handleAddContent = (parentId?: string) => {
    if (!project) return;
    setEditingContent(null);
    const contents = project.contents || [];

    // 같은 depth의 콘텐츠 개수를 계산하여 순서 설정
    const siblingContents = parentId
      ? contents.filter((c) => c.parentId === parentId)
      : contents.filter((c) => !c.parentId);

    setContentForm({
      projectId: project.id,
      parentId: parentId,
      order: siblingContents.length,
      content: "",
    });
    setModalType("content");
  };

  const handleEditContent = (content: ProjectContentDto) => {
    if (!project) return;
    setEditingContent(content);
    setContentForm({
      projectId: project.id,
      parentId: content.parentId,
      order: content.order || 0,
      content: content.content,
    });
    setModalType("content");
  };

  const handleSaveContent = async () => {
    try {
      if (editingContent) {
        await projectContentsApi.updateContent(editingContent.id, contentForm);
      } else {
        await projectContentsApi.createContent(contentForm);
      }
      closeModal();
      loadProjectDetail();
    } catch (err) {
      setError("콘텐츠 저장에 실패했습니다.");
      console.error(err);
    }
  };

  const handleDeleteContent = async (contentId: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await projectContentsApi.deleteContent(contentId);
      loadProjectDetail();
    } catch (err) {
      setError("콘텐츠 삭제에 실패했습니다.");
      console.error(err);
    }
  };

  const closeModal = () => {
    setModalType(null);
    setEditingContent(null);
  };

  // 콘텐츠를 트리 구조로 정렬
  const organizeContents = (contents: ProjectContentDto[]) => {
    const rootContents = contents
      .filter((c) => !c.parentId)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    const getChildren = (parentId: string): ProjectContentDto[] => {
      return contents
        .filter((c) => c.parentId === parentId)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    };

    return { rootContents, getChildren };
  };

  // 콘텐츠 렌더링 (재귀)
  const renderContent = (
    content: ProjectContentDto,
    getChildren: (parentId: string) => ProjectContentDto[],
    depth = 0
  ) => {
    const children = getChildren(content.id);

    return (
      <div key={content.id} className="content-item" style={{ marginLeft: depth * 24 }}>
        <div className="content-row">
          <div className="content-text">{content.content}</div>
          <div className="content-actions">
            <button
              className="btn-add-small"
              onClick={() => handleAddContent(content.id)}
              title="하위 콘텐츠 추가"
            >
              +
            </button>
            <button
              className="btn-edit-small"
              onClick={() => handleEditContent(content)}
              title="수정"
            >
              ✎
            </button>
            <button
              className="btn-delete-small"
              onClick={() => handleDeleteContent(content.id)}
              title="삭제"
            >
              ✕
            </button>
          </div>
        </div>
        {children.length > 0 && (
          <div className="content-children">
            {children.map((child) => renderContent(child, getChildren, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="projects-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>로딩중...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="projects-container">
        <div className="error-banner">프로젝트를 찾을 수 없습니다.</div>
        <button className="btn-back" onClick={() => navigate("/projects")}>
          ← 목록으로
        </button>
      </div>
    );
  }

  return (
    <div className="projects-container">
      <header className="projects-header">
        <h1>Projects 관리</h1>
        <p className="subtitle">프로젝트 상세 내용을 관리합니다</p>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <div className="project-detail-view">
        <button className="btn-back" onClick={() => navigate("/projects")}>
          ← 목록으로
        </button>

        <div className="project-detail-header">
          <div className="detail-header-top">
            <h2>{project.title}</h2>
            <button className="btn-edit" onClick={handleEditProject}>
              프로젝트 수정
            </button>
          </div>
          {project.description && (
            <p className="detail-description">{project.description}</p>
          )}
          <div className="detail-meta">
            {project.order !== undefined && (
              <span className="meta-item">🔢 순서: {project.order}</span>
            )}
            {project.period && (
              <span className="meta-item">📅 {project.period}</span>
            )}
            {project.participants && (
              <span className="meta-item">👥 {project.participants}명</span>
            )}
          </div>
          {project.skills && project.skills.length > 0 && (
            <div className="detail-skills">
              {project.skills.map((skill, idx) => (
                <span key={idx} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="contents-section">
          <div className="section-header">
            <h3>프로젝트 콘텐츠</h3>
            <button className="btn-primary" onClick={() => handleAddContent()}>
              + 콘텐츠 추가
            </button>
          </div>

          {(!project.contents || project.contents.length === 0) ? (
            <div className="empty-state">
              <p>등록된 콘텐츠가 없습니다.</p>
              <button className="btn-primary" onClick={() => handleAddContent()}>
                첫 콘텐츠 추가하기
              </button>
            </div>
          ) : (
            <div className="contents-tree">
              {(() => {
                const { rootContents, getChildren } = organizeContents(project.contents);
                return rootContents.map((content) =>
                  renderContent(content, getChildren)
                );
              })()}
            </div>
          )}
        </div>
      </div>

      {/* 프로젝트 수정 모달 */}
      {modalType === "project" && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>프로젝트 수정</h2>
              <button className="btn-close" onClick={closeModal}>
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
                  <button type="button" className="btn-cancel" onClick={closeModal}>
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

      {/* 콘텐츠 모달 */}
      {modalType === "content" && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingContent ? "콘텐츠 수정" : "콘텐츠 추가"}</h2>
              <button className="btn-close" onClick={closeModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveContent();
                }}
              >
                <div className="form-group">
                  <label>내용</label>
                  <textarea
                    ref={contentInputRef}
                    value={contentForm.content}
                    onChange={(e) =>
                      setContentForm({ ...contentForm, content: e.target.value })
                    }
                    placeholder="콘텐츠 내용을 입력하세요"
                    rows={5}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>표시 순서</label>
                  <input
                    type="number"
                    min="0"
                    value={contentForm.order}
                    onChange={(e) =>
                      setContentForm({
                        ...contentForm,
                        order: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={closeModal}>
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

export default ProjectDetail;

