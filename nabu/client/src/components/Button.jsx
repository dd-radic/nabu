import React from 'react';
import './Button.css'; // Import the specific styles for buttons

/**
 * Reusable Button Component [cite: 4]
 * Usage: <Button variant="danger" onClick={...}>Delete</Button>
 */
const Button = ({
    variant = 'primary', // 'primary', 'secondary', 'danger', 'outline'
    className = '',      // Allow extra custom classes if absolutely needed
    onClick,
    children,
    disabled = false,
    type = 'button',
    icon = false,
    size = 'default'

}) => {

    // 1. Base class (Shape, Font, Transitions)
    let finalClass = 'nabu-btn';

    // 2. Add Variant Style
    switch (variant) {
        case 'secondary':
            finalClass += ' nabu-btn-secondary'; // Gray/White
            break;
        case 'danger':
            finalClass += ' nabu-btn-danger'; // Red to Gradient hover
            break;
        case 'outline':
            finalClass += ' nabu-btn-outline'; // Transparent with border
            break;
        case 'primary':
        default:
            finalClass += ' nabu-btn-primary'; // Standard Gradient
            break;
    }

    // 3. Append any extra classes
    if (className) finalClass += ` ${className}`;
    let inlineStyle = {};

    if (size === 'icon' || icon) {
        inlineStyle = {
            padding: "6px",
            minWidth: "32px",
            height: "32px",
            borderRadius: "50%",
            lineHeight: "1",
            fontSize: "14px",
        };
    }


    return (
        <button
            type={type}
            className={finalClass}
            onClick={onClick}
            disabled={disabled}
            style={inlineStyle}
        >
            {children}
        </button>
    );
};

export default Button;