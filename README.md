# Stratosfare — WebAR Prototypes (Bachelor Project)

Dieses Repository enthält browserbasierte WebAR-Prototypen, entwickelt im Rahmen einer Bachelorarbeit.  
Das Projekt untersucht unterschiedliche Interaktions- und Präsentationsstile (**2D Info**, **2D Wow**, **3D Info**, **3D Wow**) mit **markerbasierter AR** im mobilen Browser (primär **Android/Chrome**).

---

## Prototypen / Entry Points (Startseiten)

Öffne eine dieser Dateien, um einen Prototyp zu starten:

- **2D Info**: `docs/ar-2d-info.html`
- **2D Wow**: `docs/ar-2d-wow.html`
- **3D Info**: `docs/ar-3d-info.html`
- **3D Wow**: `docs/ar-3d-wow.html`

Zusätzliche Seiten:
- `docs/index.html` (Startseite)
- `docs/mehrErfahren.html` (Zielseite nach Launch/Redirect)
- `docs/ar.html` (optional/legacy entry – je nach Stand)

> “Entry Point” = die jeweilige HTML-Startdatei eines Prototyps.

---

## Features (aktueller Stand)

- **Markerbasiertes WebAR** mit **AR.js** + **A-Frame**
- **Permission-first Start Flow**  
  Kamera-Permission wird angefragt, bevor AR initialisiert wird
- **Mission-basierter UX-Flow**
  - **Mission 1**: interaktive Pins + Info-Overlay + Fortschritt
  - **Mission 2**: Tap-Minispiel (zeit- & zielbasiert)
  - **Launch**: Countdown + Raketen-Animation + Smoke Layer + Redirect
- **UI Overlays (HTML/CSS)** über dem AR Canvas
  - Header / Footer
  - Permission Overlay
  - Loading Overlay
  - Info Overlay (Icon + Subtitle + Text)
  - Mission Overlay / Hinweis
  - Minigame Overlay + Countdown
- **Mobile Interaction Fixes**
  - Touch Events werden zu Mouse Events mit Koordinaten “gemappt”, damit Raycaster-Klicks auf Android zuverlässiger sind

---

## Tech Stack

Via CDN geladen:

- **A-Frame** `1.5.0`  
  `https://aframe.io/releases/1.5.0/aframe.min.js`
- **AR.js (A-Frame build)** `3.4.5`  
  `https://cdn.jsdelivr.net/gh/AR-js-org/AR.js@3.4.5/aframe/build/aframe-ar.min.js`
- **aframe-extras (loaders)** `6.1.1`  
  `https://cdn.jsdelivr.net/npm/aframe-extras@6.1.1/dist/aframe-extras.loaders.min.js`

> Hinweis: A-Frame nutzt intern **Three.js** als Rendering Engine.

---

## Projektstruktur

Stratosfare/
├─ docs/
│  ├─ css/
│  ├─ js/
│  ├─ sources/
│  ├─ ar-2d-info.html
│  ├─ ar-2d-wow.html
│  ├─ ar-3d-info.html
│  ├─ ar-3d-wow.html
│  └─ index.html
└─ README.md

## Requirements

### Browser / Device
- ✅ Android Gerät empfohlen (getestet v.a. Android/Chrome)
- ⚠️ iOS ist aktuell kein Zielsystem (nicht aktiv getestet)

### Hosting (wichtig)
Kamerazugriff erfordert einen **Secure Context**:
- ✅ HTTPS Hosting
- ✅ `localhost`
- ❌ HTTP auf Mobile funktioniert meist nicht

---

## Online testen (GitHub Pages)

GitHub Pages ist ideal für WebAR, weil du automatisch **HTTPS** bekommst (wichtig für Kamera-Zugriff).

### 1) GitHub Pages aktivieren (deploy aus `/docs`)
1. Repo auf GitHub pushen
2. Auf GitHub: **Settings → Pages**
3. Unter **Build and deployment**
   - **Source**: `Deploy from a branch`
   - **Branch**: `main`
   - **Folder**: `/docs`
4. **Save** → nach kurzer Zeit bekommst du eine URL wie:
   - `https://<username>.github.io/<repo>/`

> Wichtig: Da deine Entry-HTMLs im Ordner `docs/` liegen, muss GitHub Pages auf **/docs** zeigen.

---

### 2) Prototypen online öffnen

Sobald Pages aktiv ist, kannst du direkt diese URLs nutzen:

- **2D Info**: `https://<username>.github.io/<repo>/ar-2d-info.html`
- **2D Wow**: `https://<username>.github.io/<repo>/ar-2d-wow.html`
- **3D Info**: `https://<username>.github.io/<repo>/ar-3d-info.html`
- **3D Wow**: `https://<username>.github.io/<repo>/ar-3d-wow.html`

Startseite:
- `https://<username>.github.io/<repo>/index.html`

---

### 3) Handy-Test (empfohlen)
- Öffne die Links auf **Android/Chrome**
- Erlaube die Kamera-Permission
- Marker gut ausleuchten und vollständig im Bild halten

---

### Optional: Direkt-Link in GitHub Repo anzeigen
Du kannst die Pages-URL auch oben im Repo sichtbar machen:
- **Settings → Pages** (oder **About** rechts im Repo)
- Website-URL eintragen und “Display on profile” aktivieren

## Lokal starten

### Option A: VS Code Live Server
1. Repo in VS Code öffnen
2. Extension **Live Server** installieren
3. Rechtsklick auf z.B. `docs/ar-2d-wow.html` → **Open with Live Server**

### Option B: Python HTTP Server
```bash
cd docs
python -m http.server 8000
