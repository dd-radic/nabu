import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, Navigate } from "react-router-dom"; // Removed useParams
import { useAuth } from "../AuthProvider";
import DashboardNav from "../components/DashboardNav";
import CreateFlashcardModal from "../components/CreateFlashcardModal";
import "../components/FlashcardFlip.css";
import Button from "../components/Button";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const FlashcardDetailPage = () => {
    // 1. Get Data from State (No params needed)
    const location = useLocation();
    const { userdata, token } = useAuth();

    // Passed from ResourceCard
    const flashcardSet = location.state?.flashcardSet;

    // Local cards state
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState({}); 

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null); 
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    // Initialize cards
    useEffect(() => {
        const initial =
            flashcardSet?.cards ||
            flashcardSet?.Cards ||
            flashcardSet?.flashcards ||
            flashcardSet?.Flashcards ||
            [];

        setCards(Array.isArray(initial) ? initial : []);
        setFlipped({});
    }, [flashcardSet]);

    const normalizedCards = useMemo(() => {
        const src = Array.isArray(cards) ? cards : [];
        return src.map((c, idx) => {
            const question = c?.question || c?.front || c?.Question || c?.Front || c?.text || "";
            const answer = c?.answer || c?.back || c?.Answer || c?.Back || c?.value || "";
            return { id: c?.id ?? c?.Id ?? idx, question, answer };
        });
    }, [cards]);

    // Handlers
    const toggleFlip = useCallback((index) => {
        setFlipped((prev) => ({ ...prev, [index]: !prev[index] }));
    }, []);

    const openAdd = useCallback(() => {
        setEditingIndex(null);
        setIsModalOpen(true);
    }, []);

    const openEdit = useCallback((index) => {
        setEditingIndex(index);
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => setIsModalOpen(false), []);

    const initialModalData = useMemo(() => {
        if (editingIndex === null) return null;
        return {
            question: normalizedCards[editingIndex]?.question || "",
            answer: normalizedCards[editingIndex]?.answer || "",
        };
    }, [editingIndex, normalizedCards]);

    const handleSubmit = useCallback(({ question, answer }) => {
        if (editingIndex === null) {
            // ADD
            setCards((prev) => [...prev, { id: Date.now(), question, answer }]);
        } else {
            // EDIT
            setCards((prev) => {
                const copy = [...prev];
                const existing = copy[editingIndex] || {};
                copy[editingIndex] = { ...existing, question, answer };
                return copy;
            });
        }
    }, [editingIndex]);

    // Guards
    if (!userdata?.id && !token) return <Navigate to="/" />;
    if (!flashcardSet) return <Navigate to="/dashboard" replace />;

    return (
        <main className="dashboard-page">
            <DashboardNav initialActiveTab={"content"} showBackButton={true} />

            <section className="dashboard-box" style={{ marginTop: "1.5rem" }}>
                <h1>My Flashcards: {flashcardSet.name}</h1>
                <p style={{ color: "#777", marginTop: "0.5rem", marginBottom: "1.5rem" }}>
                    Description: {flashcardSet.summary || flashcardSet.description || "No description provided."}
                </p>

                {normalizedCards.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "2rem", color: "#888" }}>
                        No flashcards found. Click <strong>+</strong> to add one.
                    </div>
                ) : (
                    <div className="flashcard-grid">
                        {normalizedCards.map((card, index) => {
                            const isFlipped = !!flipped[index];
                            return (
                                <div
                                    key={card.id ?? index}
                                    style={{ position: "relative" }}
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                >
                                    <div
                                        className={`flashcard ${isFlipped ? "is-flipped" : ""}`}
                                        onClick={() => toggleFlip(index)}
                                    >
                                        <div className="flashcard-inner">
                                            {/* FRONT */}
                                            <div className="flashcard-face flashcard-front">
                                                <h3>Question</h3>
                                                <p className="flashcard-text">{card.question}</p>
                                                <p className="flashcard-hint">Click to flip</p>
                                            </div>
                                            {/* BACK */}
                                            <div className="flashcard-face flashcard-back">
                                                <h3>Answer</h3>
                                                <p className="flashcard-text">{card.answer}</p>
                                                <p className="flashcard-hint">Click to flip back</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Edit/Delete Buttons (Hover only) */}
                                    {hoveredIndex === index && (
                                        <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: 8, zIndex: 20 }}>
                                            <Button
                                                variant="outline"
                                                title="Edit"
                                                onClick={(e) => { e.stopPropagation(); openEdit(index); }}
                                            >
                                                ✏️
                                            </Button>
                                            <Button
                                                variant="outline"
                                                title="Delete"
                                                onClick={(e) => { e.stopPropagation(); setDeleteTarget(index); }}
                                            >
                                                🗑️
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                <button type="button" className="floating-add-btn" onClick={openAdd}>+</button>

                <CreateFlashcardModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onSubmit={handleSubmit}
                    mode={editingIndex === null ? "add" : "edit"}
                    initialData={initialModalData}
                />
            </section>
            
            <ConfirmDeleteModal
                isOpen={deleteTarget !== null}
                title="Delete flashcard?"
                message="Are you sure you want to delete this flashcard?"
                onCancel={() => setDeleteTarget(null)}
                onConfirm={() => {
                    setCards((prev) => prev.filter((_, i) => i !== deleteTarget));
                    setDeleteTarget(null);
                }}
            />
        </main>
    );
};

export default FlashcardDetailPage;