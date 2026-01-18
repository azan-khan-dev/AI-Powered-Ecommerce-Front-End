# Virtual Glasses Try-On Setup Guide

## 📦 Installation

Install required MediaPipe packages:

```bash
npm install @mediapipe/face_mesh @mediapipe/camera_utils
```

## 🖼️ Glasses Assets Setup

1. Create a `public/glasses/` directory in your project
2. Add PNG images with **transparent backgrounds**
3. Recommended dimensions: 800-1200px width
4. Example structure:
```
public/
  glasses/
    default.png
    classic-black.png
    aviator.png
    round-vintage.png
    cat-eye.png
```

## 🎨 Preparing Glasses Images

**Important:** Your glasses PNG must have:
- ✅ Transparent background (no white/black background)
- ✅ High resolution (800px+ width recommended)
- ✅ Centered alignment
- ✅ Facing straight ahead (not tilted)

**Tools to create transparent PNGs:**
- [Remove.bg](https://www.remove.bg/) - Auto background removal
- Photoshop/GIMP - Manual editing
- Canva - Online design tool

## 🚀 Usage

### Basic Usage (Single Glasses)

```jsx
import VirtualGlassesTryOn from "./Components/VirtualGlassesTryOn";
import "./Components/VirtualGlassesTryOn.css";

function App() {
  return <VirtualGlassesTryOn glassesImageUrl="/glasses/default.png" />;
}
```

### Advanced Usage (Multiple Glasses Selector)

```jsx
import GlassesTryOnPage from "./Pages/GlassesTryOnPage";

function App() {
  return <GlassesTryOnPage />;
}
```

## 🔧 Configuration

### Adjust Glasses Size

In `VirtualGlassesTryOn.jsx`, modify the multiplier on **line 154**:

```javascript
// Increase/decrease 2.5 to make glasses bigger/smaller
const glassesWidth = eyeDistance * 2.5; // Default: 2.5
```

### Adjust Smoothing (Reduce Jitter)

Modify lerp factors on **lines 171-174**:

```javascript
const smoothCenterX = lerp(prevValuesRef.current.centerX, centerX, 0.4); // 0.1-0.5
const smoothCenterY = lerp(prevValuesRef.current.centerY, centerY, 0.4);
const smoothScale = lerp(prevValuesRef.current.scale, scale, 0.3);
const smoothAngle = lerp(prevValuesRef.current.angle, faceAngle, 0.3);
```

**Lower values** = smoother but slower response  
**Higher values** = faster but more jittery

### Enable Debug Landmarks

Uncomment **lines 210-214** in `VirtualGlassesTryOn.jsx`:

```javascript
ctx.fillStyle = "red";
ctx.fillRect(leftEyePixel.x - 3, leftEyePixel.y - 3, 6, 6);
ctx.fillRect(rightEyePixel.x - 3, rightEyePixel.y - 3, 6, 6);
ctx.fillStyle = "blue";
ctx.fillRect(noseBridgePixel.x - 3, noseBridgePixel.y - 3, 6, 6);
```

This will show:
- 🔴 Red dots: Left & right eye corners
- 🔵 Blue dot: Nose bridge anchor point

## 📱 Mobile Support

The component is fully responsive and works on mobile devices. Ensure your app has camera permissions:

```html
<!-- In public/index.html or your HTML head -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
```

## 🐛 Troubleshooting

### Camera Not Working
- Check browser permissions (allow camera access)
- Use HTTPS (required for `getUserMedia` on production)
- Test on localhost first

### Glasses Not Appearing
- Check console for image loading errors
- Verify glasses PNG path is correct
- Ensure image has transparent background

### Poor Performance
- Reduce video resolution in `VirtualGlassesTryOn.jsx` (line 73):
  ```javascript
  width: 640,  // Change from 1280
  height: 480, // Change from 720
  ```
- Adjust canvas size (line 247):
  ```javascript
  <canvas width={640} height={480} /> // Match video size
  ```

### Glasses Misaligned
- Adjust glasses size multiplier (line 154)
- Check if glasses PNG is centered
- Enable debug landmarks to verify anchor points

## 🎯 Key Landmarks Used

MediaPipe Face Mesh provides 468 landmarks. We use:

| Landmark | Index | Purpose |
|----------|-------|---------|
| Left eye outer corner | 33 | Left anchor point |
| Right eye outer corner | 263 | Right anchor point |
| Nose bridge | 168 | Center anchor point |

[View full landmark map](https://github.com/google/mediapipe/blob/master/mediapipe/modules/face_geometry/data/canonical_face_model_uv_visualization.png)

## ⚡ Performance Tips

1. **Use CDN for MediaPipe** (already configured)
2. **Optimize glasses images** (compress PNGs without losing transparency)
3. **Disable debug rendering** (comment out landmark drawing)
4. **Use requestAnimationFrame** (already implemented)
5. **Test on target devices** (different cameras have different latencies)

## 📚 Resources

- [MediaPipe Face Mesh Docs](https://google.github.io/mediapipe/solutions/face_mesh.html)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) (for 3D glasses)
- [TensorFlow.js](https://www.tensorflow.org/js) (alternative ML backend)

## 🔐 Security & Privacy

- All processing happens **client-side** (no video sent to servers)
- Camera stream is **not recorded or stored**
- MediaPipe models load from CDN (can self-host for offline use)

## 📝 License

This component uses:
- MediaPipe (Apache 2.0)
- React (MIT)
- Camera Utils (Apache 2.0)
