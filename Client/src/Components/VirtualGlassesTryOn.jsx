import React, { useRef, useEffect, useState } from "react";

import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate Euclidean distance between two points
 */
const calculateDistance = (point1, point2) => {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Calculate angle (in radians) between two points
 * Returns the rotation angle needed to align horizontal line to eye line
 */
const calculateAngle = (leftPoint, rightPoint) => {
    const dx = rightPoint.x - leftPoint.x;
    const dy = rightPoint.y - leftPoint.y;
    return Math.atan2(dy, dx);
};

/**
 * Linear interpolation for smooth transitions (reduces jitter)
 * @param start - Current value
 * @param end - Target value
 * @param factor - Smoothing factor (0-1, lower = smoother but slower)
 */
const lerp = (start, end, factor = 0.3) => {
    return start + (end - start) * factor;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const VirtualGlassesTryOn = ({ glassesImageUrl = "/glasses/default.png" }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const faceMeshRef = useRef(null);
    const cameraRef = useRef(null);
    const glassesImageRef = useRef(null);

    // Smoothing state (stores previous values for interpolation)
    const prevValuesRef = useRef({
        centerX: 0,
        centerY: 0,
        scale: 1,
        angle: 0,
    });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFaceDetected, setIsFaceDetected] = useState(false);

    // ============================================================================
    // MEDIAPIPE FACE MESH INITIALIZATION
    // ============================================================================

    useEffect(() => {
        const initializeFaceMesh = async () => {
            try {
                // Initialize MediaPipe Face Mesh
                const faceMesh = new FaceMesh({
                    locateFile: (file) => {
                        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
                    },
                });

                faceMesh.setOptions({
                    maxNumFaces: 1,
                    refineLandmarks: true, // More accurate landmarks
                    minDetectionConfidence: 0.5,
                    minTrackingConfidence: 0.5,
                });

                // Set up results callback
                faceMesh.onResults(onResults);
                faceMeshRef.current = faceMesh;

                // Initialize camera
                if (videoRef.current) {
                    const camera = new Camera(videoRef.current, {
                        onFrame: async () => {
                            await faceMesh.send({ image: videoRef.current });
                        },
                        width: 1280,
                        height: 720,
                    });

                    await camera.start();
                    cameraRef.current = camera;
                    setIsLoading(false);
                }
            } catch (err) {
                console.error("Error initializing face mesh:", err);
                setError("Failed to initialize camera or face detection");
                setIsLoading(false);
            }
        };

        initializeFaceMesh();

        // Cleanup
        return () => {
            if (cameraRef.current) {
                cameraRef.current.stop();
            }
        };
    }, []);

    // ============================================================================
    // GLASSES IMAGE PRELOADING
    // ============================================================================

    useEffect(() => {
        const img = new Image();
        img.src = glassesImageUrl;
        img.onload = () => {
            glassesImageRef.current = img;
        };
        img.onerror = () => {
            console.error("Failed to load glasses image");
            setError("Failed to load glasses image");
        };
    }, [glassesImageUrl]);

    // ============================================================================
    // FACE MESH RESULTS HANDLER (MAIN RENDERING LOGIC)
    // ============================================================================

    const onResults = (results) => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        const glassesImage = glassesImageRef.current;

        if (!canvas || !video || !glassesImage) return;

        const ctx = canvas.getContext("2d");
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw video frame
        ctx.save();
        ctx.scale(-1, 1); // Mirror video for natural selfie view
        ctx.drawImage(video, -width, 0, width, height);
        ctx.restore();

        // Check if face is detected
        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
            setIsFaceDetected(true);
            const landmarks = results.multiFaceLandmarks[0];

            // ========================================================================
            // EXTRACT KEY LANDMARKS
            // ========================================================================
            // MediaPipe Face Mesh uses 468 landmarks (0-467)
            // Left eye outer corner: 33
            // Right eye outer corner: 263
            // Nose bridge (between eyes): 168

            const leftEye = landmarks[33];   // Left eye outer corner
            const rightEye = landmarks[263]; // Right eye outer corner
            const noseBridge = landmarks[168]; // Nose bridge center

            // Convert normalized coordinates (0-1) to canvas pixels
            // IMPORTANT: Mirror X coordinates to match the mirrored video display
            const leftEyePixel = {
                x: width - (leftEye.x * width),  // Mirror X-axis
                y: leftEye.y * height,
            };
            const rightEyePixel = {
                x: width - (rightEye.x * width), // Mirror X-axis
                y: rightEye.y * height,
            };
            const noseBridgePixel = {
                x: width - (noseBridge.x * width), // Mirror X-axis
                y: noseBridge.y * height,
            };

            // ========================================================================
            // CALCULATE GLASSES POSITIONING
            // ========================================================================

            // 1. Calculate eye distance (in pixels)
            const eyeDistance = calculateDistance(leftEyePixel, rightEyePixel);

            // 2. Calculate face rotation angle (head tilt)
            const faceAngle = calculateAngle(leftEyePixel, rightEyePixel);

            // 3. Calculate glasses scale based on eye distance
            // Increased multiplier from 2.5 to 3.2 for more realistic coverage
            // This ensures the frame ends extend slightly beyond the eye corners
            const glassesWidth = eyeDistance * 1.7;
            const glassesHeight =
                (glassesWidth / glassesImage.width) * glassesImage.height;
            const scale = glassesWidth / glassesImage.width;

            // 4. Position glasses centered on nose bridge
            // Slight vertical offset upward for better alignment with eyes
            const centerX = noseBridgePixel.x;
            const centerY = noseBridgePixel.y + 15; // Lift slightly

            // ========================================================================
            // APPLY SMOOTHING (LERP) TO REDUCE JITTER
            // ========================================================================
            const smoothCenterX = lerp(prevValuesRef.current.centerX, centerX, 0.4);
            const smoothCenterY = lerp(prevValuesRef.current.centerY, centerY, 0.4);
            const smoothScale = lerp(prevValuesRef.current.scale, scale, 0.3);
            const smoothAngle = lerp(prevValuesRef.current.angle, faceAngle, 0.3);

            // Update previous values for next frame
            prevValuesRef.current = {
                centerX: smoothCenterX,
                centerY: smoothCenterY,
                scale: smoothScale,
                angle: smoothAngle,
            };

            // ========================================================================
            // DRAW GLASSES ON CANVAS
            // ========================================================================
            ctx.save();

            // Apply transformations in correct order: translate → rotate → scale
            ctx.translate(smoothCenterX, smoothCenterY);
            ctx.rotate(smoothAngle);
            // FIX: Flip Y-axis to prevent upside-down glasses
            ctx.scale(smoothScale, -smoothScale);

            // Add realistic shadow for depth
            ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 5;
            ctx.shadowOffsetY = 5;

            // Draw glasses centered at origin (we already translated)
            ctx.drawImage(
                glassesImage,
                -glassesImage.width / 2,
                -glassesImage.height / 2,
                glassesImage.width,
                glassesImage.height
            );
            ctx.restore();

            // ========================================================================
            // OPTIONAL: DRAW DEBUG LANDMARKS (uncomment for testing)
            // ========================================================================
            // ctx.fillStyle = "red";
            // ctx.fillRect(leftEyePixel.x - 3, leftEyePixel.y - 3, 6, 6);
            // ctx.fillRect(rightEyePixel.x - 3, rightEyePixel.y - 3, 6, 6);
            // ctx.fillStyle = "blue";
            // ctx.fillRect(noseBridgePixel.x - 3, noseBridgePixel.y - 3, 6, 6);
        } else {
            setIsFaceDetected(false);
        }
    };

    // ============================================================================
    // RENDER
    // ============================================================================

    return (
        <div className="virtual-glasses-container">
            {isLoading && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                    <p>Initializing camera and face detection...</p>
                </div>
            )}

            {error && (
                <div className="error-overlay">
                    <p>{error}</p>
                </div>
            )}

            {!isFaceDetected && !isLoading && !error && (
                <div className="no-face-overlay">
                    <p>👤 No face detected. Please look at the camera.</p>
                </div>
            )}

            {/* Hidden video element (used by MediaPipe) */}
            <video
                ref={videoRef}
                className="hidden-video"
                playsInline
                style={{ display: "none" }}
            />

            {/* Canvas for rendering video + glasses overlay */}
            <canvas
                ref={canvasRef}
                width={1280}
                height={720}
                className="glasses-canvas"
            />
        </div>
    );
};

export default VirtualGlassesTryOn;
