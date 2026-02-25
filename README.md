# Stratosfare

# Stratosfare WebAR Prototypes (Bachelor Project)

This repository contains browser-based WebAR prototypes developed as part of a bachelor thesis.  
The project explores different interaction and presentation styles (e.g., **2D Info**, **2D Wow**, and a planned **3D** version) using **marker-based AR** in the mobile browser (Android).

---

##  Features (current state)

- **Marker-based WebAR** using **AR.js** + **A-Frame**
- **Permission-first start flow** (camera permission is requested before initializing AR)
- **Mission-based UX flow**
  - Mission 1: interactive pins + info overlays + progress
  - Mission 2: tap-based minigame (time-limited, goal-based)
  - Launch: countdown + rocket launch animation + smoke layers + redirect
- **UI overlays** (HTML/CSS) on top of the AR canvas:
  - Header / Footer
  - Permission overlay
  - Loading overlay
  - Info overlay (icons + subtitle + text)
  - Mission screen overlay
  - Minigame overlay + countdown
- **Mobile interaction fixes**
  - Touch events are bridged to mouse events with coordinates to make A-Frame raycaster clicks reliable on Android.

---

## Tech Stack

Loaded via CDN:

- **A-Frame** `1.5.0`  
  `https://aframe.io/releases/1.5.0/aframe.min.js`
- **AR.js (A-Frame build)** `3.4.5`  
  `https://cdn.jsdelivr.net/gh/AR-js-org/AR.js@3.4.5/aframe/build/aframe-ar.min.js`
- **aframe-extras (loaders)** `6.1.1`  
  `https://cdn.jsdelivr.net/npm/aframe-extras@6.1.1/dist/aframe-extras.loaders.min.js`

> Note: A-Frame internally uses **Three.js** as its WebGL rendering engine.

---

##  Project Structure (typical)

> File


---

## Requirements

### Browser / Device
- **Android** device recommended (tested primarily on Android/Chrome)
- iOS is **not** a target for this project

### Hosting (important)
Camera access requires a **secure context**:
- ✅ HTTPS hosting (recommended)
- ✅ localhost
- ❌ plain HTTP on mobile will usually fail

---

## Run Locally

### Option A: VS Code Live Server
1. Open this repository in VS Code.
2. Install **Live Server** extension.
3. Right-click `docs/ar-2d-wow.html` (or another entry file) → **Open with Live Server**.

### Option B: Python simple server
From repo root:

```bash
cd docs
python -m http.server 8000
