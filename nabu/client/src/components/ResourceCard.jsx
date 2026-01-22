import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ResourceCard.css';
import './FlashcardFlip.css'; // IMPORT THE ANIMATION FILE

const ResourceCard = ({ resource, isClassroomLevel = false }) => {
    const [flipped, setFlipped] = useState(false);

    const descriptionClass = isClassroomLevel ? "classroom-description-short" : "classroom-description";
    const descriptionText = isClassroomLevel ? resource.description : resource.summary || resource.description;

    // --- 1. CLASSROOM CARD (Standard) ---
    if (isClassroomLevel) {
        return (
            <Link to={`/classroom/${resource.id}`} className="classroom-card-link">
                <article className="classroom-card">
                    <h3>{resource.name}</h3>
                    <p className={descriptionClass}>{descriptionText}</p>
                    <p className="classroom-type">Type: Classroom</p>
                </article>
            </Link>
        );
    }

    // --- 2. QUIZ CARD (Standard) ---
    if (resource.type === "Quiz") {
        return (
            <Link to={`/quiz/${resource.id}`} state={{ quiz: resource }} className="classroom-card-link">
                <article className="classroom-card">
                    <h3>{resource.name}</h3>
                    <p className={descriptionClass}>{descriptionText}</p>
                    <p className="classroom-type">Type: Quiz</p>
                    <p className="classroom-description" style={{marginTop:'auto', fontSize:'0.8rem'}}>
                        Click to play
                    </p>
                </article>
            </Link>
        );
    }

    // --- 3. FLASHCARD (The "Good" Flip Animation) ---
    if (resource.type === "Flashcard") {
        return (
            <div 
                className={`flashcard ${flipped ? 'is-flipped' : ''}`} 
                onClick={() => setFlipped(!flipped)}
            >
                <div className="flashcard-inner">
                    {/* FRONT FACE: Shows the Title */}
                    <div className="flashcard-face flashcard-front">
                        <h3>{resource.name}</h3>
                        
                        {/* CHANGED: Using the exact same style as Quiz */}
                        <p className="classroom-description" style={{marginTop:'auto', fontSize:'0.8rem'}}>
                            Click to flip
                        </p>
                    </div>

                    {/* BACK FACE: Shows the Description */}
                    <div className="flashcard-face flashcard-back">
                        <p>{resource.description || resource.summary || "No description provided."}</p>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default ResourceCard;