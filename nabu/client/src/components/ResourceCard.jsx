import React from 'react';
import { Link } from 'react-router-dom';
import './ResourceCard.css';

/**
 * ResourceCard Component: Your universal card template.
 * * It displays a single item, whether it's a main Classroom, a Quiz, or a Flashcard set.
 * * @param {object} resource - The item's data (must include: id, name, type).
 * @param {boolean} isClassroomLevel - If TRUE, this card acts as a link to navigate to the classroom's content.
 */
const ResourceCard = ({ resource, isClassroomLevel = false }) => {

    // --- Card Logic and Display Choices ---

    // Uses a CSS class that truncates the text for the main Dashboard view.
    const descriptionClass = isClassroomLevel
        ? "classroom-description-short"
        : "classroom-description";

    // Determines which field to show: 'description' (for main Classrooms) 
    // or 'summary' (for Quizzes/Flashcards).
    const descriptionText = isClassroomLevel
        ? resource.description
        : resource.summary || resource.description;

    // --- The Card's Visual Content (the actual JSX structure) ---
    const cardContent = (
        <article className="classroom-card">
            <h3>{resource.name}</h3>

            {/* Shows the description/summary using the determined styling */}
            {descriptionText && (
                <p className={descriptionClass}>{descriptionText}</p>
            )}

            {/* The type label helps the user quickly identify the item */}
            <p className="classroom-type">
                Type: {resource.type}
            </p>

            {/* Only shows this extra instruction if it's a content card */}
            {!isClassroomLevel && (
                <p className="classroom-description">
                    Click to view/edit this {resource.type.toLowerCase()}.
                </p>
            )}
        </article>
    );

    // --- Final Render: Link or Standalone Card ---

    // If it's a main Classroom, we wrap the entire card in a <Link>
    // to navigate to the content page (e.g., /classroom/ID).
    if (isClassroomLevel) {
        return (
            <Link
                to={`/classroom/${resource.id}`}
                key={resource.id}
                className="classroom-card-link"
            >
                {cardContent}
            </Link>
        );
    }

    // If it's a Quiz or Flashcard, just render the static card display.
    // Quiz → quiz detail page
    if (resource.type === "Quiz") {
        return (
            <Link
                to={`/quiz/${resource.id}`}
                state={{ quiz: resource }}
                className="classroom-card-link"
            >
                {cardContent}
            </Link>

        );
    }
    // Flashcard
    if (resource.type === "Flashcard") {
        return (
            <Link
                to={`/flashcard/${resource.id}`}
                state={{ flashcardSet: resource }}
                className="classroom-card-link"
            >
                {cardContent}
            </Link>
        );
    }

    return cardContent;
};

export default ResourceCard;