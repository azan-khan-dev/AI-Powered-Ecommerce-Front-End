# Virtual Glasses Try-On - Adjustment Guide

Use this guide to fine-tune the glasses alignment based on the debug landmarks (red dots on eyes, blue dot on nose).

## 🎯 Key Adjustment Settings

### 1. **Glasses Width/Scale** (Line 202)
**Current:** `const glassesWidth = eyeDistance * 3.2;`

This controls how wide the glasses are relative to the distance between your eyes.

**Adjustment Guide:**
- **Too wide** (frame ends far beyond eye corners): **DECREASE** the multiplier
  - Try: `2.8`, `2.5`, `2.2`, `2.0`
- **Too narrow** (frame ends don't reach eye corners): **INCREASE** the multiplier
  - Try: `3.5`, `3.8`, `4.0`
- **Perfect fit**: Frame ends should align with or slightly beyond the red dots (eye corners)

**Recommended starting point:** `2.5` (then adjust up/down by 0.2 increments)

---

### 2. **Vertical Position** (Line 210)
**Current:** `const centerY = noseBridgePixel.y;`

This controls how high/low the glasses sit on your face.

**Adjustment Options:**

**Move glasses UP (closer to eyes):**
```javascript
const centerY = noseBridgePixel.y - (eyeDistance * 0.15);
```
- Increase `0.15` to move higher: `0.2`, `0.25`, `0.3`

**Move glasses DOWN (away from eyes):**
```javascript
const centerY = noseBridgePixel.y + (eyeDistance * 0.1);
```
- Increase `0.1` to move lower: `0.15`, `0.2`

**Perfect alignment:** The center of the glasses frame should align with the blue dot (nose bridge)

---

### 3. **Horizontal Position** (Line 209)
**Current:** `const centerX = noseBridgePixel.x;`

This controls left/right positioning.

**Adjustment (if needed):**
```javascript
// Shift LEFT
const centerX = noseBridgePixel.x - 10;

// Shift RIGHT
const centerX = noseBridgePixel.x + 10;
```

**Note:** Usually doesn't need adjustment if mirroring is correct.

---

## 🔧 Quick Adjustment Workflow

### Step 1: Fix the Width First
1. Look at the **red dots** (eye corners)
2. Adjust **line 202** multiplier until frame ends align with red dots
3. Start with `2.5`, then adjust by `0.2` increments

### Step 2: Fix the Vertical Position
1. Look at the **blue dot** (nose bridge)
2. Adjust **line 210** to center the frame on the blue dot
3. Use formula: `noseBridgePixel.y - (eyeDistance * X)` where X is 0.1 to 0.3

### Step 3: Fine-tune
1. Test with head movements (left, right, tilt)
2. Ensure glasses stay aligned with landmarks
3. Adjust smoothing if jittery (lines 215-218)

---

## 📝 Example Configurations

### Configuration A: Tight Fit (Smaller Frames)
```javascript
// Line 202
const glassesWidth = eyeDistance * 2.2;

// Line 210
const centerY = noseBridgePixel.y - (eyeDistance * 0.12);
```

### Configuration B: Standard Fit (Medium Frames)
```javascript
// Line 202
const glassesWidth = eyeDistance * 2.8;

// Line 210
const centerY = noseBridgePixel.y - (eyeDistance * 0.08);
```

### Configuration C: Oversized Fit (Large Frames)
```javascript
// Line 202
const glassesWidth = eyeDistance * 3.5;

// Line 210
const centerY = noseBridgePixel.y - (eyeDistance * 0.05);
```

---

## 🎨 Advanced: Per-Glasses Adjustments

If different glasses need different settings, modify `GlassesTryOnPage.jsx`:

```javascript
const glassesCatalog = [
    { 
        id: 1, 
        name: "Classic Black", 
        image: "/glasses/sun-glasses.png",
        scale: 2.5,      // Custom scale
        verticalOffset: 0.1  // Custom offset
    },
    { 
        id: 2, 
        name: "Aviator", 
        image: "/glasses/transparent-glasses.png",
        scale: 3.0,
        verticalOffset: 0.15
    }
];
```

Then pass these to `VirtualGlassesTryOn` component and use them in calculations.

---

## 🐛 Troubleshooting

**Problem:** Glasses too big, far from landmarks
- **Solution:** Decrease line 202 multiplier (try `2.0` to `2.5`)

**Problem:** Glasses too small, don't cover eyes
- **Solution:** Increase line 202 multiplier (try `3.0` to `3.5`)

**Problem:** Glasses too high above nose
- **Solution:** Increase vertical offset on line 210 (add `+ (eyeDistance * 0.1)`)

**Problem:** Glasses too low below eyes
- **Solution:** Decrease vertical offset on line 210 (use `- (eyeDistance * 0.2)`)

**Problem:** Glasses jittery/shaky
- **Solution:** Decrease smoothing factors on lines 215-218 (use `0.2` instead of `0.4`)

---

## 📍 Current Settings Summary

**Location in Code:**
- **Width/Scale:** Line 202 in `VirtualGlassesTryOn.jsx`
- **Vertical Position:** Line 210 in `VirtualGlassesTryOn.jsx`
- **Horizontal Position:** Line 209 in `VirtualGlassesTryOn.jsx`
- **Smoothing:** Lines 215-218 in `VirtualGlassesTryOn.jsx`

**Your Current Values:**
- Width multiplier: `3.2` ← **Start here, reduce to 2.5 or lower**
- Vertical offset: `0` (no offset) ← **Add offset if needed**
- Smoothing: `0.4` for position, `0.3` for scale

---

## ✅ Recommended First Fix

Based on your description, try this:

**Line 202:** Change from `3.2` to `2.5`
```javascript
const glassesWidth = eyeDistance * 2.5;
```

**Line 210:** Add slight upward offset
```javascript
const centerY = noseBridgePixel.y - (eyeDistance * 0.08);
```

This should make the glasses smaller and better aligned with the landmark dots!
