import { useState, useEffect, useRef } from "react";
import { careersApi, businessApi, careerProjectApi } from "../api/careers";
import type {
  BusinessDto,
  CareerProjectDto,
  BusinessRequestDto,
  CareerProjectRequestDto,
} from "../@types";
import "./Careers.css";

type TabType = "business" | "projects";
type ModalType = "business" | "careerProject" | null;

const Careers = () => {
  const [businessList, setBusinessList] = useState<BusinessDto[]>([]);
  const [projectList, setProjectList] = useState<CareerProjectDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 탭 상태
  const [activeTab, setActiveTab] = useState<TabType>("business");

  // 모달 상태
  const [modalType, setModalType] = useState<ModalType>(null);
  const [editingBusiness, setEditingBusiness] = useState<BusinessDto | null>(
    null
  );
  const [editingProject, setEditingProject] = useState<CareerProjectDto | null>(
    null
  );

  // 폼 상태
  const [businessForm, setBusinessForm] = useState<BusinessRequestDto>({
    startDate: "",
    endDate: "",
    company: "",
    department: "",
    position: "",
    skills: [],
    orderIndex: 0,
    details: [],
  });

  const [projectForm, setProjectForm] = useState<CareerProjectRequestDto>({
    startDate: "",
    endDate: "",
    company: "",
    department: "",
    position: "",
    skills: [],
    orderIndex: 0,
  });

  // 스킬 및 세부사항 입력용 임시 상태
  const [skillInput, setSkillInput] = useState("");
  const [detailInput, setDetailInput] = useState("");

  // 입력 필드 ref (자동 포커스용)
  const companyInputRef = useRef<HTMLInputElement>(null);

  // 모달이 열릴 때 회사 입력 필드에 포커스
  useEffect(() => {
    if (modalType) {
      const timer = setTimeout(() => {
        companyInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [modalType]);

  // 데이터 로드
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await careersApi.getAllCareers();
      setBusinessList(response.data.data.businesses || []);
      setProjectList(response.data.data.projects || []);
    } catch (err) {
      setError("데이터를 불러오는데 실패했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Business CRUD
  const handleAddBusiness = () => {
    setEditingBusiness(null);
    setBusinessForm({
      startDate: "",
      endDate: "",
      company: "",
      department: "",
      position: "",
      skills: [],
      orderIndex: businessList.length,
      details: [],
    });
    setSkillInput("");
    setDetailInput("");
    setModalType("business");
  };

  const handleEditBusiness = (business: BusinessDto) => {
    setEditingBusiness(business);
    setBusinessForm({
      startDate: business.startDate || "",
      endDate: business.endDate || "",
      company: business.company || "",
      department: business.department || "",
      position: business.position || "",
      skills: business.skills || [],
      orderIndex: 0,
      details: business.details || [],
    });
    setSkillInput("");
    setDetailInput("");
    setModalType("business");
  };

  const handleSaveBusiness = async () => {
    try {
      if (editingBusiness) {
        await businessApi.updateBusiness(editingBusiness.id, businessForm);
      } else {
        await businessApi.createBusiness(businessForm);
      }
      closeModal();
      loadData();
    } catch (err) {
      setError("저장에 실패했습니다.");
      console.error(err);
    }
  };

  const handleDeleteBusiness = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await businessApi.deleteBusiness(id);
      loadData();
    } catch (err) {
      setError("삭제에 실패했습니다.");
      console.error(err);
    }
  };

  // Career Project CRUD
  const handleAddProject = () => {
    setEditingProject(null);
    setProjectForm({
      startDate: "",
      endDate: "",
      company: "",
      department: "",
      position: "",
      skills: [],
      orderIndex: projectList.length,
    });
    setSkillInput("");
    setModalType("careerProject");
  };

  const handleEditProject = (project: CareerProjectDto) => {
    setEditingProject(project);
    setProjectForm({
      startDate: project.startDate || "",
      endDate: project.endDate || "",
      company: project.company || "",
      department: project.department || "",
      position: project.position || "",
      skills: project.skills || [],
      orderIndex: 0,
    });
    setSkillInput("");
    setModalType("careerProject");
  };

  const handleSaveProject = async () => {
    try {
      if (editingProject) {
        await careerProjectApi.updateCareerProject(
          editingProject.id,
          projectForm
        );
      } else {
        await careerProjectApi.createCareerProject(projectForm);
      }
      closeModal();
      loadData();
    } catch (err) {
      setError("저장에 실패했습니다.");
      console.error(err);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await careerProjectApi.deleteCareerProject(id);
      loadData();
    } catch (err) {
      setError("삭제에 실패했습니다.");
      console.error(err);
    }
  };

  const closeModal = () => {
    setModalType(null);
    setEditingBusiness(null);
    setEditingProject(null);
  };

  // 스킬 추가/삭제 핸들러
  const handleAddSkill = () => {
    if (!skillInput.trim()) return;
    if (modalType === "business") {
      setBusinessForm({
        ...businessForm,
        skills: [...(businessForm.skills || []), skillInput.trim()],
      });
    } else {
      setProjectForm({
        ...projectForm,
        skills: [...(projectForm.skills || []), skillInput.trim()],
      });
    }
    setSkillInput("");
  };

  const handleRemoveSkill = (index: number) => {
    if (modalType === "business") {
      setBusinessForm({
        ...businessForm,
        skills: businessForm.skills?.filter((_, i) => i !== index),
      });
    } else {
      setProjectForm({
        ...projectForm,
        skills: projectForm.skills?.filter((_, i) => i !== index),
      });
    }
  };

  // 세부사항 추가/삭제 핸들러 (Business 전용)
  const handleAddDetail = () => {
    if (!detailInput.trim()) return;
    setBusinessForm({
      ...businessForm,
      details: [...(businessForm.details || []), detailInput.trim()],
    });
    setDetailInput("");
  };

  const handleRemoveDetail = (index: number) => {
    setBusinessForm({
      ...businessForm,
      details: businessForm.details?.filter((_, i) => i !== index),
    });
  };

  // 날짜 포맷팅 (YY.MM. 형식)
  const formatPeriod = (startDate?: string, endDate?: string) => {
    if (!startDate) return "-";
    const end = endDate || "현재";
    return `${startDate} ~ ${end}`;
  };

  // 날짜 입력 핸들러 (YY.MM. 형식 자동 포맷팅)
  const handleDateInput = (value: string, maxLength = 6) => {
    // 숫자와 점만 허용
    let cleaned = value.replace(/[^\d.]/g, "");

    // 자동으로 점 추가 (2자리 입력 후, 4자리 입력 후)
    const digits = cleaned.replace(/\./g, "");
    if (digits.length >= 4) {
      cleaned = digits.substring(0, 2) + "." + digits.substring(2, 4) + ".";
    } else if (digits.length >= 2) {
      cleaned = digits.substring(0, 2) + "." + digits.substring(2);
    } else {
      cleaned = digits;
    }

    // 최대 길이 제한 (YY.MM. = 6자)
    return cleaned.substring(0, maxLength);
  };

  return (
    <div className="careers-container">
      <header className="careers-header">
        <h1>Careers 관리</h1>
        <p className="subtitle">경력 정보를 관리합니다</p>
      </header>

      {error && <div className="error-banner">{error}</div>}

      {/* 탭 */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === "business" ? "active" : ""}`}
          onClick={() => setActiveTab("business")}
        >
          업무 경력 ({businessList.length})
        </button>
        <button
          className={`tab ${activeTab === "projects" ? "active" : ""}`}
          onClick={() => setActiveTab("projects")}
        >
          프로젝트 경력 ({projectList.length})
        </button>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>로딩중...</p>
        </div>
      ) : (
        <div className="content">
          {/* Business 탭 */}
          {activeTab === "business" && (
            <div className="careers-section">
              <div className="section-header">
                <h2>업무 경력 목록</h2>
                <button className="btn-primary" onClick={handleAddBusiness}>
                  + 경력 추가
                </button>
              </div>

              {businessList.length === 0 ? (
                <div className="empty-state">
                  <p>등록된 업무 경력이 없습니다.</p>
                  <button className="btn-primary" onClick={handleAddBusiness}>
                    첫 경력 추가하기
                  </button>
                </div>
              ) : (
                <div className="career-list">
                  {businessList.map((business) => (
                    <div key={business.id} className="career-card">
                      <div className="career-card-header">
                        <div className="career-main-info">
                          <h3 className="company-name">{business.company}</h3>
                          <span className="period">
                            {formatPeriod(business.startDate, business.endDate)}
                          </span>
                        </div>
                        <div className="career-actions">
                          <button
                            className="btn-edit"
                            onClick={() => handleEditBusiness(business)}
                          >
                            수정
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => handleDeleteBusiness(business.id)}
                          >
                            삭제
                          </button>
                        </div>
                      </div>

                      <div className="career-card-body">
                        <div className="career-meta">
                          {business.department && (
                            <span className="meta-item">
                              <strong>부서:</strong> {business.department}
                            </span>
                          )}
                          {business.position && (
                            <span className="meta-item">
                              <strong>직책:</strong> {business.position}
                            </span>
                          )}
                        </div>

                        {business.skills && business.skills.length > 0 && (
                          <div className="career-skills">
                            {business.skills.map((skill, index) => (
                              <span key={index} className="skill-tag">
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}

                        {business.details && business.details.length > 0 && (
                          <div className="career-details">
                            <strong>업무 내용:</strong>
                            <ul>
                              {business.details.map((detail, index) => (
                                <li key={index}>{detail}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Career Projects 탭 */}
          {activeTab === "projects" && (
            <div className="careers-section">
              <div className="section-header">
                <h2>프로젝트 경력 목록</h2>
                <button className="btn-primary" onClick={handleAddProject}>
                  + 경력 추가
                </button>
              </div>

              {projectList.length === 0 ? (
                <div className="empty-state">
                  <p>등록된 프로젝트 경력이 없습니다.</p>
                  <button className="btn-primary" onClick={handleAddProject}>
                    첫 경력 추가하기
                  </button>
                </div>
              ) : (
                <div className="career-list">
                  {projectList.map((project) => (
                    <div key={project.id} className="career-card">
                      <div className="career-card-header">
                        <div className="career-main-info">
                          <h3 className="company-name">{project.company}</h3>
                          <span className="period">
                            {formatPeriod(project.startDate, project.endDate)}
                          </span>
                        </div>
                        <div className="career-actions">
                          <button
                            className="btn-edit"
                            onClick={() => handleEditProject(project)}
                          >
                            수정
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => handleDeleteProject(project.id)}
                          >
                            삭제
                          </button>
                        </div>
                      </div>

                      <div className="career-card-body">
                        <div className="career-meta">
                          {project.department && (
                            <span className="meta-item">
                              <strong>부서:</strong> {project.department}
                            </span>
                          )}
                          {project.position && (
                            <span className="meta-item">
                              <strong>직책:</strong> {project.position}
                            </span>
                          )}
                        </div>

                        {project.skills && project.skills.length > 0 && (
                          <div className="career-skills">
                            {project.skills.map((skill, index) => (
                              <span key={index} className="skill-tag">
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 모달 */}
      {modalType && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalType === "business"
                  ? editingBusiness
                    ? "업무 경력 수정"
                    : "업무 경력 추가"
                  : editingProject
                  ? "프로젝트 경력 수정"
                  : "프로젝트 경력 추가"}
              </h2>
              <button className="btn-close" onClick={closeModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              {modalType === "business" ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveBusiness();
                  }}
                >
                  <div className="form-row">
                    <div className="form-group">
                      <label>회사명 *</label>
                      <input
                        ref={companyInputRef}
                        type="text"
                        value={businessForm.company}
                        onChange={(e) =>
                          setBusinessForm({
                            ...businessForm,
                            company: e.target.value,
                          })
                        }
                        placeholder="회사명 입력"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>부서</label>
                      <input
                        type="text"
                        value={businessForm.department}
                        onChange={(e) =>
                          setBusinessForm({
                            ...businessForm,
                            department: e.target.value,
                          })
                        }
                        placeholder="부서명 입력"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>시작일 * (YY.MM.)</label>
                      <input
                        type="text"
                        value={businessForm.startDate}
                        onChange={(e) =>
                          setBusinessForm({
                            ...businessForm,
                            startDate: handleDateInput(e.target.value),
                          })
                        }
                        placeholder="24.01."
                        pattern="\d{2}\.\d{2}\."
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>종료일 (YY.MM.)</label>
                      <input
                        type="text"
                        value={businessForm.endDate}
                        onChange={(e) =>
                          setBusinessForm({
                            ...businessForm,
                            endDate: handleDateInput(e.target.value),
                          })
                        }
                        placeholder="24.12. (비워두면 현재)"
                        pattern="\d{2}\.\d{2}\."
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>직책</label>
                    <input
                      type="text"
                      value={businessForm.position}
                      onChange={(e) =>
                        setBusinessForm({
                          ...businessForm,
                          position: e.target.value,
                        })
                      }
                      placeholder="직책 입력"
                    />
                  </div>

                  <div className="form-group">
                    <label>스킬</label>
                    <div className="tag-input-wrapper">
                      <div className="tags-display">
                        {businessForm.skills?.map((skill, index) => (
                          <span key={index} className="tag">
                            {skill}
                            <button
                              type="button"
                              className="tag-remove"
                              onClick={() => handleRemoveSkill(index)}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="tag-input-row">
                        <input
                          type="text"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddSkill();
                            }
                          }}
                          placeholder="스킬 입력 후 Enter"
                        />
                        <button
                          type="button"
                          className="btn-add-tag"
                          onClick={handleAddSkill}
                        >
                          추가
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>업무 내용</label>
                    <div className="tag-input-wrapper">
                      <div className="details-display">
                        {businessForm.details?.map((detail, index) => (
                          <div key={index} className="detail-item">
                            <span>{detail}</span>
                            <button
                              type="button"
                              className="detail-remove"
                              onClick={() => handleRemoveDetail(index)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="tag-input-row">
                        <input
                          type="text"
                          value={detailInput}
                          onChange={(e) => setDetailInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddDetail();
                            }
                          }}
                          placeholder="업무 내용 입력 후 Enter"
                        />
                        <button
                          type="button"
                          className="btn-add-tag"
                          onClick={handleAddDetail}
                        >
                          추가
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="modal-actions">
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={closeModal}
                    >
                      취소
                    </button>
                    <button type="submit" className="btn-primary">
                      저장
                    </button>
                  </div>
                </form>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveProject();
                  }}
                >
                  <div className="form-row">
                    <div className="form-group">
                      <label>회사명 *</label>
                      <input
                        ref={companyInputRef}
                        type="text"
                        value={projectForm.company}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            company: e.target.value,
                          })
                        }
                        placeholder="회사명 입력"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>부서</label>
                      <input
                        type="text"
                        value={projectForm.department}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            department: e.target.value,
                          })
                        }
                        placeholder="부서명 입력"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>시작일 * (YY.MM.)</label>
                      <input
                        type="text"
                        value={projectForm.startDate}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            startDate: handleDateInput(e.target.value),
                          })
                        }
                        placeholder="24.01."
                        pattern="\d{2}\.\d{2}\."
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>종료일 (YY.MM.)</label>
                      <input
                        type="text"
                        value={projectForm.endDate}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            endDate: handleDateInput(e.target.value),
                          })
                        }
                        placeholder="24.12. (비워두면 현재)"
                        pattern="\d{2}\.\d{2}\."
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>직책</label>
                    <input
                      type="text"
                      value={projectForm.position}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          position: e.target.value,
                        })
                      }
                      placeholder="직책 입력"
                    />
                  </div>

                  <div className="form-group">
                    <label>스킬</label>
                    <div className="tag-input-wrapper">
                      <div className="tags-display">
                        {projectForm.skills?.map((skill, index) => (
                          <span key={index} className="tag">
                            {skill}
                            <button
                              type="button"
                              className="tag-remove"
                              onClick={() => handleRemoveSkill(index)}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="tag-input-row">
                        <input
                          type="text"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddSkill();
                            }
                          }}
                          placeholder="스킬 입력 후 Enter"
                        />
                        <button
                          type="button"
                          className="btn-add-tag"
                          onClick={handleAddSkill}
                        >
                          추가
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="modal-actions">
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={closeModal}
                    >
                      취소
                    </button>
                    <button type="submit" className="btn-primary">
                      저장
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Careers;
