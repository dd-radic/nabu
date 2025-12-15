import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useLocation, useParams, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import DashboardNav from "../components/DashboardNav";
import Button from "../components/Button";
import CreateQuizQuestionModal from "../components/CreateQuizQuestionModal";
import ViewQuizQuestionModal from "../components/ViewQuizQuestionModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const QuizQuestionPage = () => {
    const { quizId } = useParams();
    const location = useLocation();
    const { userdata, token, fetchQuiz, fetchQuizQuestions } = useAuth();

    const quiz = location.state?.quiz;

    // Questions stored locally (frontend-only)
    const [questions, setQuestions] = useState([]);

    // Add modal (CreateQuizQuestionModal)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // View/Edit modal (ViewQuizQuestionModal)
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [viewIndex, setViewIndex] = useState(null);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    // // Init questions from quiz state
    // useEffect(() => {
    //     const initial = quiz?.questions || quiz?.Questions || quiz?.quizQuestions || [];
    //     setQuestions(Array.isArray(initial) ? initial : []);
    // }, [quiz]);

    useEffect(() => {
          const loadQuiz = async() => {
            try {
              const initial = await fetchQuizQuestions(quizId);
              if(!quiz){
                console.warn("Quiz not found.");
              }
              setQuestions(initial);
            }
            catch(err){
              console.error("Error fetching quiz: ", err);
              return;
            }
          }
          loadQuiz();
        }, []);

    // Normalize shape: { id, text, options[] }
    const normalizedQuestions = useMemo(() => {
        const source = Array.isArray(questions) ? questions : [];
        return source.map((q, idx) => {
            const text =
                q?.text || q?.question || q?.QuestionText || q?.Title || `Question ${idx + 1}`;


            const rawOptions =
                q?.options ||
                q?.Options ||
                q?.answers ||
                q?.Answers ||
                q?.choices ||
                q?.Choices ||
                [];

            const opts = Array.isArray(rawOptions)
                ? rawOptions.map((o) => (typeof o === "string" ? o : (o?.text || o?.Text || o?.value || "")))
                : [];

            return { id: q?.id ?? q?.Id ?? idx, text, options: opts };
        });
    }, [questions]);

    // ---------- Handlers (hooks before guards) ----------
    const openAdd = useCallback(() => setIsAddModalOpen(true), []);
    const closeAdd = useCallback(() => setIsAddModalOpen(false), []);

    const openView = useCallback((index) => {
        setViewIndex(index);
        setIsViewOpen(true);
    }, []);

    const closeView = useCallback(() => setIsViewOpen(false), []);

    // Add new question from Create modal (+)
    const handleAddQuestion = useCallback((payload) => {
        setQuestions((prev) => [
            ...prev,
            { id: Date.now(), text: payload.text, options: payload.options },
        ]);
    }, []);

    // Save edits from View modal (inline edit)
    const handleSaveFromView = useCallback(
        (payload) => {
            if (viewIndex === null) return;

            setQuestions((prev) => {
                const copy = [...prev];
                const existing = copy[viewIndex] || {};
                copy[viewIndex] = { ...existing, text: payload.text, options: payload.options };
                return copy;
            });
        },
        [viewIndex]
    );

    const viewedQuestion = useMemo(() => {
        if (viewIndex === null) return null;
        return normalizedQuestions[viewIndex] || null;
    }, [viewIndex, normalizedQuestions]);

    const navigate = useNavigate();



    // ---------- Guards ----------
    if (!userdata?.id && !token) return <Navigate to="/" />;
    if (!quiz) return <Navigate to="/dashboard" replace />;

    return (
        <main className="dashboard-page">
            <DashboardNav initialActiveTab={"content"} showBackButton={true} />

            <section className="dashboard-box" style={{ marginTop: "1.5rem" }}>
                {/* Header row: left text, right button */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "1rem",
                        flexWrap: "wrap",
                        marginBottom: "1.5rem",
                    }}
                >
                    <div>
                        <h2>Quiz Questions: {quiz.name}</h2>
                        <p style={{ color: "#777", marginTop: "0.5rem" }}>
                            Description: {quiz.summary || quiz.description || "No description provided."}
                        </p>
                    </div>

                    <Button type="button">
                        Start Quiz
                    </Button>
                </div>

                {normalizedQuestions.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "2rem", color: "#888" }}>
                        No questions available. Click the <strong>+</strong> button to add one.
                    </div>
                ) : (
                    <table className="quiz-table">
                        <thead>
                            <tr>
                                <th style={{ width: "80px" }}>No</th>
                                <th>Question Text</th>
                            </tr>
                        </thead>
                        <tbody>
                            {normalizedQuestions.map((q, index) => (
                                <tr
                                    key={q.id ?? index}
                                    onClick={() => openView(index)}
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    style={{ cursor: "pointer", position: "relative" }}
                                >
                                    <td>{index + 1}</td>
                                    <td style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span
                                            style={{
                                                maxWidth: 700,
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }}
                                        >
                                            {q.text}
                                        </span>

                                        {hoveredIndex === index && (
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                title="Delete Question"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // prevent opening modal
                                                    setDeleteTarget(index);
                                                }}
                                            >
                                                🗑️
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* Floating + button (add new) */}
                <button
                    type="button"
                    className="floating-add-btn"
                    onClick={openAdd}
                    title="Add Question"
                >
                    +
                </button>

                {/* View/Edit modal (inline edit inside the modal) */}
                <ViewQuizQuestionModal
                    isOpen={isViewOpen}
                    onClose={closeView}
                    question={viewedQuestion}
                    onSave={handleSaveFromView}
                />

                {/* Add modal only */}
                <CreateQuizQuestionModal
                    isOpen={isAddModalOpen}
                    onClose={closeAdd}
                    onSubmit={handleAddQuestion}
                    mode="add"
                    initialData={null}
                />
            </section>
            <ConfirmDeleteModal
                isOpen={deleteTarget !== null}
                title="Delete Question"
                message="Are you sure you want to permanently delete this question?"
                onCancel={() => setDeleteTarget(null)}
                onConfirm={() => {
                    setQuestions((prev) => prev.filter((_, i) => i !== deleteTarget));
                    setDeleteTarget(null);
                }}
            />
        </main>
    );
};

export default QuizQuestionPage;