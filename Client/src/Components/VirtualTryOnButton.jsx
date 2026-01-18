import React, { useState } from "react";
import { FaGlasses } from "react-icons/fa";
import VirtualTryOnModal from "./VirtualTryOnModal";
import "./VirtualTryOnButton.css";

/**
 * Floating Virtual Try-On Button Component
 * Opens modal on click with hover tooltip
 */
const VirtualTryOnButton = () => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClick = () => {
        setIsModalOpen(true);
        // Prevent body scroll when modal is open
        document.body.classList.add("modal-open");
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        // Re-enable body scroll
        document.body.classList.remove("modal-open");
    };

    return (
        <>
            <div className="virtual-tryon-button-container">
                <button
                    className="virtual-tryon-button"
                    onClick={handleClick}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    aria-label="Try Virtual Glasses Try-On"
                >
                    <FaGlasses className="glasses-icon" />

                    {/* Animated pulse ring */}
                    <span className="pulse-ring"></span>
                </button>

                {/* Tooltip */}
                {showTooltip && (
                    <div className="virtual-tryon-tooltip">
                        <span className="tooltip-text">
                            🎉 Try our new Virtual Try-On feature!
                        </span>
                        <div className="tooltip-arrow"></div>
                    </div>
                )}
            </div>

            {/* Virtual Try-On Modal */}
            <VirtualTryOnModal isOpen={isModalOpen} onClose={handleCloseModal} />
        </>
    );
};

export default VirtualTryOnButton;
