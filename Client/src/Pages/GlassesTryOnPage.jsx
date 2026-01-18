import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import VirtualGlassesTryOn from "../Components/VirtualGlassesTryOn";
import "../Components/VirtualGlassesTryOn.css";
import "./GlassesTryOnPage.css";

/**
 * Virtual Glasses Try-On Page
 * Full-screen immersive experience
 */
const GlassesTryOnPage = () => {
    const navigate = useNavigate();
    const [selectedGlasses, setSelectedGlasses] = useState("/glasses/sun-glasses.png");

    const glassesCatalog = [
        { id: 1, name: "Sun Glasses", image: "/glasses/sun-glasses.png" },
        { id: 2, name: "Transparent", image: "/glasses/transparent-glasses.png" },
        { id: 3, name: "Study", image: "/glasses/study-glasses.png" },
        { id: 4, name: "Fashion", image: "/glasses/fashion-glasses.png" },
        { id: 5, name: "Eye Glasses", image: "/glasses/eye-glasses.png" },
        { id: 6, name: "Heart", image: "/glasses/heart-glasses.png" },
    ];

    return (
        <div className="tryon-page-wrapper">
            {/* Virtual Try-On Component */}
            <VirtualGlassesTryOn glassesImageUrl={selectedGlasses} />

            {/* Top Bar with Title and Back Button */}
            <div className="tryon-top-bar">
                <button
                    className="tryon-back-button"
                    onClick={() => navigate("/")}
                    aria-label="Go back to home"
                >
                    <IoArrowBack />
                    <span>Back</span>
                </button>
                <h1 className="tryon-title">Virtual Glasses Try-On</h1>
                <div className="tryon-spacer"></div>
            </div>

            {/* Glasses Selector (bottom overlay) */}
            <div className="tryon-selector-container">
                <p className="tryon-selector-label">Choose Your Style</p>
                <div className="tryon-selector-grid">
                    {glassesCatalog.map((glasses) => (
                        <button
                            key={glasses.id}
                            onClick={() => setSelectedGlasses(glasses.image)}
                            className={`tryon-glasses-button ${selectedGlasses === glasses.image ? "active" : ""
                                }`}
                        >
                            {glasses.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GlassesTryOnPage;
