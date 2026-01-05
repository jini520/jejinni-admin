import { useState, useEffect, useRef } from "react";
import {
  certificationsApi,
  certificationApi,
  awardApi,
} from "../api/certifications";
import type {
  CertificationDto,
  AwardDto,
  CertificationRequestDto,
  AwardRequestDto,
} from "../@types";
import "./Certifications.css";

type TabType = "certifications" | "awards";
type ModalType = "certification" | "award" | null;

const Certifications = () => {
  const [certificationList, setCertificationList] = useState<
    CertificationDto[]
  >([]);
  const [awardList, setAwardList] = useState<AwardDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 탭 상태
  const [activeTab, setActiveTab] = useState<TabType>("certifications");

  // 모달 상태
  const [modalType, setModalType] = useState<ModalType>(null);
  const [editingCertification, setEditingCertification] =
    useState<CertificationDto | null>(null);
  const [editingAward, setEditingAward] = useState<AwardDto | null>(null);

  // 폼 상태
  const [certificationForm, setCertificationForm] =
    useState<CertificationRequestDto>({
      name: "",
      date: "",
      organization: "",
      tier: "",
      orderIndex: 0,
    });

  const [awardForm, setAwardForm] = useState<AwardRequestDto>({
    name: "",
    date: "",
    organization: "",
    tier: "",
    orderIndex: 0,
  });

  // 입력 필드 ref (자동 포커스용)
  const nameInputRef = useRef<HTMLInputElement>(null);

  // 모달이 열릴 때 이름 입력 필드에 포커스
  useEffect(() => {
    if (modalType) {
      const timer = setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [modalType]);

  // 데이터 로드
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await certificationsApi.getAllCertifications();
      setCertificationList(response.data.data.certifications || []);
      setAwardList(response.data.data.awards || []);
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

  // Certification CRUD
  const handleAddCertification = () => {
    setEditingCertification(null);
    setCertificationForm({
      name: "",
      date: "",
      organization: "",
      tier: "",
      orderIndex: certificationList.length,
    });
    setModalType("certification");
  };

  const handleEditCertification = (certification: CertificationDto) => {
    setEditingCertification(certification);
    setCertificationForm({
      name: certification.name || "",
      date: certification.date || "",
      organization: certification.organization || "",
      tier: certification.tier || "",
      orderIndex: 0,
    });
    setModalType("certification");
  };

  const handleSaveCertification = async () => {
    try {
      if (editingCertification) {
        await certificationApi.updateCertification(
          editingCertification.id,
          certificationForm
        );
      } else {
        await certificationApi.createCertification(certificationForm);
      }
      closeModal();
      loadData();
    } catch (err) {
      setError("저장에 실패했습니다.");
      console.error(err);
    }
  };

  const handleDeleteCertification = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await certificationApi.deleteCertification(id);
      loadData();
    } catch (err) {
      setError("삭제에 실패했습니다.");
      console.error(err);
    }
  };

  // Award CRUD
  const handleAddAward = () => {
    setEditingAward(null);
    setAwardForm({
      name: "",
      date: "",
      organization: "",
      tier: "",
      orderIndex: awardList.length,
    });
    setModalType("award");
  };

  const handleEditAward = (award: AwardDto) => {
    setEditingAward(award);
    setAwardForm({
      name: award.name || "",
      date: award.date || "",
      organization: award.organization || "",
      tier: award.tier || "",
      orderIndex: 0,
    });
    setModalType("award");
  };

  const handleSaveAward = async () => {
    try {
      if (editingAward) {
        await awardApi.updateAward(editingAward.id, awardForm);
      } else {
        await awardApi.createAward(awardForm);
      }
      closeModal();
      loadData();
    } catch (err) {
      setError("저장에 실패했습니다.");
      console.error(err);
    }
  };

  const handleDeleteAward = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await awardApi.deleteAward(id);
      loadData();
    } catch (err) {
      setError("삭제에 실패했습니다.");
      console.error(err);
    }
  };

  const closeModal = () => {
    setModalType(null);
    setEditingCertification(null);
    setEditingAward(null);
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
    <div className="certifications-container">
      <header className="certifications-header">
        <h1>Certifications 관리</h1>
        <p className="subtitle">자격증과 수상 내역을 관리합니다</p>
      </header>

      {error && <div className="error-banner">{error}</div>}

      {/* 탭 */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === "certifications" ? "active" : ""}`}
          onClick={() => setActiveTab("certifications")}
        >
          자격증 ({certificationList.length})
        </button>
        <button
          className={`tab ${activeTab === "awards" ? "active" : ""}`}
          onClick={() => setActiveTab("awards")}
        >
          수상 내역 ({awardList.length})
        </button>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>로딩중...</p>
        </div>
      ) : (
        <div className="content">
          {/* Certifications 탭 */}
          {activeTab === "certifications" && (
            <div className="certifications-section">
              <div className="section-header">
                <h2>자격증 목록</h2>
                <button
                  className="btn-primary"
                  onClick={handleAddCertification}
                >
                  + 자격증 추가
                </button>
              </div>

              {certificationList.length === 0 ? (
                <div className="empty-state">
                  <p>등록된 자격증이 없습니다.</p>
                  <button
                    className="btn-primary"
                    onClick={handleAddCertification}
                  >
                    첫 자격증 추가하기
                  </button>
                </div>
              ) : (
                <div className="certification-list">
                  {certificationList.map((certification) => (
                    <div key={certification.id} className="certification-card">
                      <div className="certification-card-header">
                        <div className="certification-main-info">
                          <h3 className="certification-name">
                            {certification.name}
                          </h3>
                          {certification.date && (
                            <span className="date">{certification.date}</span>
                          )}
                        </div>
                        <div className="certification-actions">
                          <button
                            className="btn-edit"
                            onClick={() =>
                              handleEditCertification(certification)
                            }
                          >
                            수정
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() =>
                              handleDeleteCertification(certification.id)
                            }
                          >
                            삭제
                          </button>
                        </div>
                      </div>

                      <div className="certification-card-body">
                        <div className="certification-meta">
                          {certification.organization && (
                            <span className="meta-item">
                              <strong>발급 기관:</strong>{" "}
                              {certification.organization}
                            </span>
                          )}
                          {certification.tier && (
                            <span className="meta-item">
                              <strong>등급:</strong> {certification.tier}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Awards 탭 */}
          {activeTab === "awards" && (
            <div className="certifications-section">
              <div className="section-header">
                <h2>수상 내역 목록</h2>
                <button className="btn-primary" onClick={handleAddAward}>
                  + 수상 내역 추가
                </button>
              </div>

              {awardList.length === 0 ? (
                <div className="empty-state">
                  <p>등록된 수상 내역이 없습니다.</p>
                  <button className="btn-primary" onClick={handleAddAward}>
                    첫 수상 내역 추가하기
                  </button>
                </div>
              ) : (
                <div className="certification-list">
                  {awardList.map((award) => (
                    <div key={award.id} className="certification-card">
                      <div className="certification-card-header">
                        <div className="certification-main-info">
                          <h3 className="certification-name">{award.name}</h3>
                          {award.date && (
                            <span className="date">{award.date}</span>
                          )}
                        </div>
                        <div className="certification-actions">
                          <button
                            className="btn-edit"
                            onClick={() => handleEditAward(award)}
                          >
                            수정
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => handleDeleteAward(award.id)}
                          >
                            삭제
                          </button>
                        </div>
                      </div>

                      <div className="certification-card-body">
                        <div className="certification-meta">
                          {award.organization && (
                            <span className="meta-item">
                              <strong>주최 기관:</strong> {award.organization}
                            </span>
                          )}
                          {award.tier && (
                            <span className="meta-item">
                              <strong>등급:</strong> {award.tier}
                            </span>
                          )}
                        </div>
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
                {modalType === "certification"
                  ? editingCertification
                    ? "자격증 수정"
                    : "자격증 추가"
                  : editingAward
                  ? "수상 내역 수정"
                  : "수상 내역 추가"}
              </h2>
              <button className="btn-close" onClick={closeModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              {modalType === "certification" ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveCertification();
                  }}
                >
                  <div className="form-group">
                    <label>자격증명 *</label>
                    <input
                      ref={nameInputRef}
                      type="text"
                      value={certificationForm.name}
                      onChange={(e) =>
                        setCertificationForm({
                          ...certificationForm,
                          name: e.target.value,
                        })
                      }
                      placeholder="자격증명 입력"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>취득일 * (YY.MM.)</label>
                      <input
                        type="text"
                        value={certificationForm.date}
                        onChange={(e) =>
                          setCertificationForm({
                            ...certificationForm,
                            date: handleDateInput(e.target.value),
                          })
                        }
                        placeholder="24.01."
                        pattern="\d{2}\.\d{2}\."
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>등급</label>
                      <input
                        type="text"
                        value={certificationForm.tier}
                        onChange={(e) =>
                          setCertificationForm({
                            ...certificationForm,
                            tier: e.target.value,
                          })
                        }
                        placeholder="1급, 2급 등"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>발급 기관</label>
                    <input
                      type="text"
                      value={certificationForm.organization}
                      onChange={(e) =>
                        setCertificationForm({
                          ...certificationForm,
                          organization: e.target.value,
                        })
                      }
                      placeholder="발급 기관명 입력"
                    />
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
                    handleSaveAward();
                  }}
                >
                  <div className="form-group">
                    <label>수상명 *</label>
                    <input
                      ref={nameInputRef}
                      type="text"
                      value={awardForm.name}
                      onChange={(e) =>
                        setAwardForm({
                          ...awardForm,
                          name: e.target.value,
                        })
                      }
                      placeholder="수상명 입력"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>수상일 * (YY.MM.)</label>
                      <input
                        type="text"
                        value={awardForm.date}
                        onChange={(e) =>
                          setAwardForm({
                            ...awardForm,
                            date: handleDateInput(e.target.value),
                          })
                        }
                        placeholder="24.01."
                        pattern="\d{2}\.\d{2}\."
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>등급</label>
                      <input
                        type="text"
                        value={awardForm.tier}
                        onChange={(e) =>
                          setAwardForm({
                            ...awardForm,
                            tier: e.target.value,
                          })
                        }
                        placeholder="금상, 은상 등"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>주최 기관</label>
                    <input
                      type="text"
                      value={awardForm.organization}
                      onChange={(e) =>
                        setAwardForm({
                          ...awardForm,
                          organization: e.target.value,
                        })
                      }
                      placeholder="주최 기관명 입력"
                    />
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

export default Certifications;

