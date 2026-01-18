import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import VirtualGlassesTryOn from "./VirtualGlassesTryOn";
import "./VirtualGlassesTryOn.css";
import "./VirtualTryOnModal.css";

/**
 * Virtual Glasses Try-On Modal Component
 * Full-screen modal overlay with close button
 */
const VirtualTryOnModal = ({ isOpen, onClose }) => {
    const [selectedGlasses, setSelectedGlasses] = useState("/glasses/sun-glasses.png");

    const glassesCatalog = [
        { id: 1, name: "Sun Glasses", image: "/glasses/sun-glasses.png" },
        { id: 2, name: "Transparent", image: "/glasses/transparent-glasses.png" },
        { id: 3, name: "Study", image: "/glasses/study-glasses.png" },
        { id: 4, name: "Fashion", image: "/glasses/fashion-glasses.png" },
        { id: 5, name: "Eye Glasses", image: "/glasses/eye-glasses.png" },
        { id: 6, name: "Heart", image: "/glasses/heart-glasses.png" },
    ];

    if (!isOpen) return null;

    return (
        <div className="tryon-modal-overlay">
            <div className="tryon-modal-container">
                {/* Virtual Try-On Component */}
                <VirtualGlassesTryOn glassesImageUrl={selectedGlasses} />

                {/* Top Bar with Title and Close Button */}
                <div className="tryon-modal-top-bar">
                    <h1 className="tryon-modal-title">Virtual Glasses Try-On</h1>
                    <button
                        className="tryon-modal-close-button"
                        onClick={onClose}
                        aria-label="Close virtual try-on"
                    >
                        <IoClose />
                    </button>
                </div>

                {/* Glasses Selector (bottom overlay) */}
                <div className="tryon-modal-selector-container">
                    <p className="tryon-modal-selector-label">Choose Your Style</p>
                    <div className="tryon-modal-selector-grid">
                        {glassesCatalog.map((glasses) => (
                            <button
                                key={glasses.id}
                                onClick={() => setSelectedGlasses(glasses.image)}
                                className={`tryon-modal-glasses-button ${selectedGlasses === glasses.image ? "active" : ""
                                    }`}
                            >
                                {glasses.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VirtualTryOnModal;
