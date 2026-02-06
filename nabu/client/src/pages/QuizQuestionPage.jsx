import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useLocation, Navigate } from "react-router-dom"; // Removed useParams, useNavigate
import { useAuth } from "../AuthProvider";

import Button from "../components/Button";
import CreateQuizQuestionModal from "../components/CreateQuizQuestionModal";
import ViewQuizQuestionModal from "../components/ViewQuizQuestionModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import GameEngine from "../components/game/GameBuilder.jsx"

const QuizQuestionPage = () => {
    // 1. Get Data (No params needed)
    const location = useLocation();
    const { userdata, token, fetchQuizQuestions, createQuestion, deleteQuestion, completeQuiz } = useAuth();

    const quiz = location.state?.quiz;

    // Local Questions State
    const [questions, setQuestions] = useState([]);
    const [quizIsActive, setQuizIsActive] = useState(false);
    let score = 0;

    // Modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [viewIndex, setViewIndex] = useState(null);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    // Local funcs
    //courtesy of https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    function shuffleArr(array){
        let currentIndex = array.length;
        // While there remain elements to shuffle...
        while (currentIndex !== 0) {

        // Pick a remaining element...
            let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
      }
      return array;
    }

    // Questions from db query
    useEffect(() => {
        const loadQuiz = async () => {
            try {
                const initial = await fetchQuizQuestions(quiz.id);
                if (!initial) {
                    console.warn("Quiz not found.");
                }
                setQuestions(initial);
            }
            catch (err) {
                console.error("Error fetching quiz: ", err);
                return;
            }
        }
        loadQuiz();
    }, [quiz, fetchQuizQuestions]);

    // Normalize shape: { id, text, options[] }
    const normalizedQuestions = useMemo(() => {
        const source = Array.isArray(questions) ? questions : [];
        return source.map((q, idx) => {
            const text = q?.Query || q?.text || q?.question || q?.QuestionText || q?.Title || `Question ${idx + 1}`;
            const rawOptions = q?.Answer || q?.options || q?.Options || q?.answers || q?.Answers || q?.choices || q?.Choices || [];
            const opts = rawOptions.split("//");
            const isCorrect = null;
            return { id: q?.id ?? q?.Id ?? idx, text, options: opts, isCorrect: isCorrect, type: q.Type };
        });
    }, [questions]);

    // Handlers
    const openAdd = useCallback(() => setIsAddModalOpen(true), []);
    const closeAdd = useCallback(() => setIsAddModalOpen(false), []);

    const openView = useCallback((index) => {
        setViewIndex(index);
        setIsViewOpen(true);
    }, []);

    const closeView = useCallback(() => setIsViewOpen(false), []);

    const handleAddQuestion = useCallback((payload) => {
        setQuestions((prev) => [
            ...prev,
            { id: Date.now(), text: payload.text, options: payload.options, questionType: payload.questionType },
        ]);
        createQuestion({
            quizId: quiz.id,
            type: payload.questionType,
            query: payload.text,
            answer: payload.options,
        });
        console.log(payload);
    }, [createQuestion, quiz]);

    const handleSaveFromView = useCallback((payload) => {
        if (viewIndex === null) return;
        setQuestions((prev) => {
            const copy = [...prev];
            const existing = copy[viewIndex] || {};
            copy[viewIndex] = { ...existing, text: payload.text, options: payload.options };
            return copy;
        });
    }, [viewIndex]);


    const viewedQuestion = useMemo(() => {
        if (viewIndex === null) return null;
        return normalizedQuestions[viewIndex] || null;
    }, [viewIndex, normalizedQuestions]);


    // Guards
    if (!userdata?.id && !token) return <Navigate to="/" />;
    if (!quiz) return <Navigate to="/dashboard" replace />;

    const quizTable = quizIsActive ?
        //active
        (<table className="quiz-table">
            <thead>
                <tr>
                    <th style={{ width: "80px" }}>No</th>
                    <th>Question</th>
                </tr>
            </thead>
            <tbody>
                {normalizedQuestions.map((q, index) => (
                    <tr
                    >
                        <td>{index + 1}</td>
                        <td>
                            <GameEngine question={q}></GameEngine>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>) :
        //inactive
        (<table className="quiz-table">
            <thead>
                <tr>
                    <th>Questions</th>
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
                        <td style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ maxWidth: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {q.text}
                            </span>
                            {hoveredIndex === index && (
                                <Button
                                    variant="outline"
                                    className="icon-btn" // Reusing styling
                                    title="Delete Question"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setDeleteTarget(q.id);
                                    }}
                                >
                                    🗑️
                                </Button>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>);


    const handleQuizStart = () => {
        if (quizIsActive) {
            for (const q of normalizedQuestions) {
                if (q.isCorrect)
                    score++;
            }
            let passed = score >= questions.length * 0.66;
            if (passed) {
                //MARK AS COMPLETE

                //CALCULATE EXP

                //UPDATE LEADERBOARD

                completeQuiz(quiz.id, userdata.id);
                alert(`Score: ${score}/${questions.length} (${(score / questions.length) * 100}%) \nQuiz Passed!`);
            }
            else
                alert(`Score: ${score}/${questions.length} (${(score / questions.length) * 100}%) \nQuiz Failed!!`);
        }
        setQuizIsActive(!quizIsActive);
    };

    return (
        <main className="dashboard-page">


            <section className="dashboard-box" style={{ marginTop: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                    <div>
                        <h2>{quiz.name}</h2>
                        <p style={{ color: "#777", marginTop: "0.5rem" }}>
                            {!quizIsActive?
                                quiz.summary || quiz.description || "No description provided.":""
                            }
                        </p>
                    </div>
                    <Button type="button" onClick={handleQuizStart}>
                        {!quizIsActive? "Start Quiz" : "Finish Quiz"}
                        </Button>
                </div>

                {normalizedQuestions.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "2rem", color: "#888" }}>
                        No questions available. Click the <strong>+</strong> button to add one.
                    </div>
                ) : (
                    quizTable
                )}

                <button type="button" className="floating-add-btn" onClick={openAdd} title="Add Question">+</button>

                <ViewQuizQuestionModal
                    isOpen={isViewOpen}
                    onClose={closeView}
                    question={viewedQuestion}
                    onSave={handleSaveFromView}
                />

                <CreateQuizQuestionModal
                    isOpen={isAddModalOpen}
                    onClose={closeAdd}
                    onSubmit={handleAddQuestion}
                />
            </section>

            <ConfirmDeleteModal
                isOpen={deleteTarget !== null}
                title="Delete Question"
                message="Are you sure you want to permanently delete this question?"
                onCancel={() => setDeleteTarget(null)}
                onConfirm={async () => {
                    try {
                        await deleteQuestion(deleteTarget);
                        setQuestions((prev) => prev.filter((_, i) => i !== deleteTarget));
                        setDeleteTarget(null);
                    } catch (err) {
                        console.error("Failed to delete question: ", err);
                    }
                }}
            />
        </main>
    );
};

export default QuizQuestionPage;