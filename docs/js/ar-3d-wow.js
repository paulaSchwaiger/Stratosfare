// ar.js

// ===== Mission / UI state =====
let missionOverlayTimer = 0;              // Timer used to control overlay visibility / transitions
let missionOverlayMode = "none";          // Current overlay mode: "none" | "hinweis" | "mission1start" | "other"
let currentMissionForHelp = "mission1";   // Which mission the help system currently targets: "mission1" | "mission2"
let missionHelpVisible = false;           // Whether the contextual help overlay is currently shown
let missionHelpIdleTimer = 0;             // Idle timer used to trigger help after inactivity
let markerIsTrackedForHelp = false;       // Marker tracking state used to decide whether help should be displayed
// "none" | "hinweis" | "mission1start" | "other"
let rocketDetached = false;               // Tracks whether the rocket has been detached from its initial anchor/parent

//====== A-Frame Components ===============

// Component: turns an OBJ model into an occluder.
// The mesh becomes invisible but still writes to the depth buffer so other objects can be hidden behind it.
AFRAME.registerComponent("occluder-obj", {
  init: function () {
    const el = this.el;

    // Applies occlusion settings to all meshes in the loaded object hierarchy.
    const apply = () => {
      el.object3D.traverse((node) => {
        // Only process mesh nodes.
        if (!node.isMesh) return;

        // Clone material to avoid mutating shared materials used by other objects.
        node.material = node.material.clone();

        // Occlusion setup: invisible in color buffer, but participates in depth testing/writing.
        node.material.colorWrite = false;
        node.material.depthWrite = true;
        node.material.depthTest = true;
      });
    };

    // OBJ assets can load asynchronously; poll for children for a limited number of frames.
    let tries = 0;
    const tick = () => {
      tries++;
      if (el.object3D && el.object3D.children && el.object3D.children.length) {
        apply();
      } else if (tries < 60) {
        requestAnimationFrame(tick);
      }
    };
    tick();
  },
});

let missionStarted = false; // Flag to prevent starting a mission multiple times / gate mission flow

// ===== Language / i18n =====
let currentLang = localStorage.getItem("lang") || "de"; // Persisted UI language ("de" default)

// Sets the current language, persists it, and updates UI toggle labels.
function setLang(lang) {
  currentLang = lang;
  localStorage.setItem("lang", currentLang);
  document.documentElement.lang = currentLang; // Keep the <html lang="..."> attribute in sync

  // Button shows the *next* language to switch to.
  const nextLabel = currentLang === "de" ? "EN" : "DE";

  // Main UI language toggle.
  const langBtn = document.getElementById("langBtn");
  if (langBtn) langBtn.textContent = nextLabel;

  // Permission overlay language toggle (if present).
  const langBtnPermission = document.getElementById("langBtnPermission");
  if (langBtnPermission) langBtnPermission.textContent = nextLabel;
}

// Central translation map for UI text.
// Keys within each language are referenced by the UI to render labels, hints, and mission copy.
const i18n = {
  de: {
    // Primary buttons
    startMission1Btn: "MISSION 1 STARTEN",
    startMission2Btn: "MISSION 2 STARTEN",

    // Camera permission overlay
    permissionTitle: "Kamera Erlaubnis",
    permissionText:
      "Für die AR-Darstellung greift diese Anwendung auf die Kamera deines Geräts zu. Das Kamerabild wird nur lokal im Browser verarbeitet und nicht gespeichert.",
    permissionLi1: "Nur zur Erkennung des AR-Markers (z. B. HIRO).",
    permissionLi2: "Keine Übertragung an einen Server.",
    permissionLi3: "Ohne Kamerazugriff kann die Anwendung nicht genutzt werden.",
    denyBtn: "Zurück",
    allowBtn: "Zustimmen & starten",

    // Loading / marker guidance
    loadingText: "Inhalte werden geladen...",
    holdToMarkerTitle: "HINWEIS",
    holdToMarkerText: "Bitte halte die Kamera auf den Marker.",

    // Mission 1 UI
    missionTitle: "MISSION 1",
    missionSub: "Entdecke Stratosfare: Tippe die Pins an und erfahre mehr über Mission, Netzwerk, Team und Projekte.",
    tapHere: "Tippe hier",

    // Footer / controls
    footerMissionBtn: "MISSION ABSCHLIEßEN",
    footerMinigameStatus: "Erreiche das Tap-Ziel!",
    footerStart: "START",
    launchBtn: "RAKETE STARTEN",

    // Accessibility labels
    infoCloseAria: "Overlay schließen",
    menuAria: "Menü öffnen",

    // Mission 2 UI
    mission2Title: "MISSION 2",
    mission2StartText: "Tippe so schnell du kannst, um die Rakete aufzuladen!",
    mission2Sub: "Lade die Rakete auf",

    // Minigame status messages
    mgReady: "Bereit machen…",
    mgGo: "LOS! Tippe so schnell du kannst!",
    mgRunning: "LÄUFT…",
    mgRetry: "NOCHMAL",
    mgTimeOver: "Zeit vorbei!",
    mgInstruction: "Erreiche das Tap-Ziel bevor die Zeit abläuft.",

    // Pin labels (UI categories)
    pinLabel1: "MISSION",
    pinLabel2: "NETZWERK",
    pinLabel3: "TEAM & ARBEITSWEISE",
    pinLabel4: "PROJEKTE",

    // Short help prompts shown during missions
    helpMission1: "Tippe alle Pins an",
    helpMission2: "Tippe so schnell wie möglich",

    // Notifications / banners
    rocketToast: "Rakete ist vollgeladen!",
    missionBannerSub: "Finde alle Infos über die Pins",

    // Additional CTA
    btnStartMission2: "MISSION 2 STARTEN",

    // Pin detail overlays (headline + description)
    pinSub1: "MISSION AKTIVIERT",
    pinText1: "Stratosfare arbeitet daran, neue Technologien aus Start-ups in den Mittelstand zu bringen.",

    pinSub2: "VERBINDUNG HERGESTELLT",
    pinText2: "Unternehmen, Start-ups und Forschung arbeiten gemeinsam an Lösungen.",

    pinSub3: "CREW BEREIT",
    pinText3: "Ein interdisziplinäres Team begleitet Innovation von der Idee bis zur Umsetzung.",

    pinSub4: "PROJEKTE LAUFEN",
    pinText4: "In Workshops und Pilotvorhaben entstehen konkrete Anwendungen.",
  },

  en: {
    // Primary buttons
    startMission1Btn: "START MISSION 1",
    startMission2Btn: "START MISSION 2",

    // Camera permission overlay
    permissionTitle: "Camera Permission",
    permissionText:
      "For the AR experience, this application needs access to your device camera. The camera feed is processed locally in your browser and is not saved.",
    permissionLi1: "Only for detecting the AR marker (e.g., HIRO).",
    permissionLi2: "No data is sent to a server.",
    permissionLi3: "Without camera access, the application cannot be used.",
    denyBtn: "Back",
    allowBtn: "Agree & Start",

    // Loading / marker guidance
    loadingText: "Loading content...",
    holdToMarkerTitle: "NOTICE",
    holdToMarkerText: "Please hold the camera to the marker.",

    // Mission 1 UI
    missionTitle: "MISSION 1",
    missionSub: "Discover Stratosfare: tap the pins to learn about the mission, network, team and projects.",
    tapHere: "Tap here",

    // Footer / controls
    footerMissionBtn: "COMPLETE MISSION",
    footerMinigameStatus: "Reach the tap goal!",
    footerStart: "START",
    launchBtn: "LAUNCH ROCKET",

    // Accessibility labels
    infoCloseAria: "Close overlay",
    menuAria: "Open Menu",

    // Mission 2 UI
    mission2Title: "MISSION 2",
    mission2StartText: "Tap as fast as you can to charge the rocket!",
    mission2Sub: "Charge the rocket",

    // Minigame status messages
    mgReady: "Get ready…",
    mgGo: "GO! Tap as fast as you can!",
    mgRunning: "RUNNING…",
    mgRetry: "TRY AGAIN",
    mgTimeOver: "Time is up!",
    mgInstruction: "Reach the tap goal before time runs out.",

    // Pin labels (UI categories)
    pinLabel1: "MISSION",
    pinLabel2: "NETWORK",
    pinLabel3: "TEAM & METHOD",
    pinLabel4: "PROJECTS",

    // Short help prompts shown during missions
    helpMission1: "Tap all pins",
    helpMission2: "Tap as fast as possible",

    // Notifications / banners
    rocketToast: "Rocket fully charged!",
    missionBannerSub: "Find all info via the pins",

    // Additional CTA
    btnStartMission2: "START MISSION 2",

    // Pin detail overlays (headline + description)
    pinSub1: "MISSION ACTIVATED",
    pinText1: "Stratosfare brings new startup technologies into established companies.",

    pinSub2: "CONNECTED",
    pinText2: "Companies, startups and research work together on solutions.",

    pinSub3: "CREW READY",
    pinText3: "An interdisciplinary team supports innovation from idea to implementation.",

    pinSub4: "PROJECTS RUNNING",
    pinText4: "Workshops and pilot projects create real applications.",
  },
};

function t(key) {
  // Convenience accessor for the currently selected language dictionary.
  // Assumes the key exists in i18n[currentLang].
  return i18n[currentLang][key];
}

function applyTranslations() {
  // ===== Permission overlay =====
  const permTitle = document.querySelector("#permission-overlay h2");
  const permText = document.querySelector("#permission-overlay p");
  const permLis = document.querySelectorAll("#permission-overlay ul li");

  if (permTitle) permTitle.textContent = t("permissionTitle");
  if (permText) permText.textContent = t("permissionText");

  // Permission list expects three bullet points.
  if (permLis.length >= 3) {
    permLis[0].textContent = t("permissionLi1");
    permLis[1].textContent = t("permissionLi2");
    permLis[2].textContent = t("permissionLi3");
  }

  // ===== Minigame counters (numeric only) =====
  const mgGoal = document.getElementById("mg-goal");
  const mgTaps = document.getElementById("mg-taps");
  // (these are numbers, no translation needed)

  // ===== Mission start buttons (only translate the currently visible start overlay) =====
  const mission1Btn = document.getElementById("mission-start-btn");
  const mission2Btn = document.getElementById("mission2-start-btn");

  if (missionOverlayMode === "mission1start" && mission1Btn) {
    mission1Btn.textContent = t("startMission1Btn");
  }
  if (missionOverlayMode === "mission2start" && mission2Btn) {
    mission2Btn.textContent = t("startMission2Btn");
  }

  // ===== Permission buttons =====
  const denyBtn = document.getElementById("deny-btn");
  const allowBtn = document.getElementById("allow-btn");
  if (denyBtn) denyBtn.textContent = t("denyBtn");
  if (allowBtn) allowBtn.textContent = t("allowBtn");

  // ===== Loading state =====
  const loadingText = document.querySelector(".loading-text");
  if (loadingText) loadingText.textContent = t("loadingText");

  // ===== Mission overlay headline/subline =====
  const missionTitleEl = document.getElementById("mission-title");
  const missionSubEl = document.getElementById("mission-sub");

  if (missionTitleEl && missionSubEl) {
    // Marker guidance overlay.
    if (missionOverlayMode === "hinweis") {
      missionTitleEl.textContent = t("holdToMarkerTitle");
      missionSubEl.textContent = t("holdToMarkerText");

    // Mission 1 start overlay.
    } else if (missionOverlayMode === "mission1start") {
      missionTitleEl.textContent = t("missionTitle");
      missionSubEl.textContent = t("missionSub");

    // Mission 2 start overlay (tap-to-charge instruction).
    } else if (missionOverlayMode === "mission2start") {
      missionTitleEl.textContent = t("mission2Title");
      missionSubEl.textContent = t("mission2StartText");

      // Mission 2 parameters (goal / duration); currently not applied here but kept for reference.
      const goal = 30;
      const durationMs = 5000;

      // Language-specific instruction text (kept inline to match existing behavior).
      missionSubEl.textContent =
        currentLang === "de"
          ? `Tippe so schnell du kannst, um die Rakete aufzuladen!`
          : `Tap as fast as you can to charge the rocket!`;
    }
  }

  // ===== Tap hint (Mission 1 pins) =====
  const tapBox = document.querySelector("#tap-box .tap-box-text");
  if (tapBox) tapBox.textContent = t("tapHere");

  // ===== Footer / minigame status =====
  const mgStatus = document.getElementById("mg-status");
  if (mgStatus) mgStatus.textContent = t("footerMinigameStatus");

  // ===== Launch button =====
  const launchBtn = document.getElementById("launch-btn");
  if (launchBtn) launchBtn.textContent = t("launchBtn");

  // ===== Accessibility labels =====
  const infoClose = document.getElementById("info-close");
  if (infoClose) infoClose.setAttribute("aria-label", t("infoCloseAria"));

  const menuToggle = document.querySelector(".menu-toggle");
  if (menuToggle) menuToggle.setAttribute("aria-label", t("menuAria"));
}

document.addEventListener("DOMContentLoaded", () => {
  // Bind dynamic footer height to a CSS variable for layout calculations.
  bindFooterHeightToCSSVar();   // ✅ add this

  // Initialize language from persisted state and apply initial translations.
  setLang(currentLang);
  applyTranslations();

  // Toggles between German and English, then updates all translation-dependent UI.
  const toggleLanguage = () => {
    setLang(currentLang === "de" ? "en" : "de");
    applyTranslations();
    applyARTranslations();
  };

  // Language toggle buttons (main UI + permission overlay).
  document.getElementById("langBtn")?.addEventListener("click", toggleLanguage);
  document.getElementById("langBtnPermission")?.addEventListener("click", toggleLanguage);

  // ===== Core DOM references used for permission / loading / AR mounting =====
  const permissionOverlay = document.getElementById("permission-overlay"); // Permission modal container
  const allowBtn = document.getElementById("allow-btn");                  // Starts AR after permission is granted
  const denyBtn = document.getElementById("deny-btn");                    // Returns / closes permission flow
  const loadingEl = document.getElementById("loading");                   // Loading indicator element
  const arRoot = document.getElementById("ar-root");                      // Root container where the AR scene is injected
  const arFooter = document.getElementById("ar-footer");                  // Footer UI shown during AR

 // Creates the A-Frame + AR.js scene markup as a template string.
 // Translation keys are resolved at creation time via t(...).
 function createARScene() {
  return `
    <a-scene
      id="ar-scene"
      embedded
      vr-mode-ui="enabled: false"
      renderer="antialias: true; alpha: true; shadow: true"
      arjs="sourceType: webcam; facingMode: environment; debugUIEnabled: false;"
    >

    <!--  ASSETS -->
    <a-assets>
      <!-- Occluder model (OBJ/MTL) used to mask/hide geometry behind the pedestal -->
      <a-asset-item id="podest-obj" src="sources/3D/Podest.obj"></a-asset-item>
      <a-asset-item id="podest-mtl" src="sources/3D/Podest.mtl"></a-asset-item>

        <!-- Video textures for particle / smoke / fire effects -->
        <video
          id="fxVid"
          src="sources/3D/rauch_3D_info/rauch_3D.webm"
           preload="auto"
            loop
            muted
            playsinline
            webkit-playsinline
            crossorigin="anonymous" 
        ></video>
        <video
          id="smokeVid"
          src="sources/3D/rauch_3D_wow/rauch_szene.webm"
           muted
          playsinline
          webkit-playsinline
          preload="auto"
          crossorigin="anonymous"  
        ></video>
         <video
          id="fireVid"
          src="sources/3D/rauch_3D_wow/feuer.webm"
           muted
          playsinline
          webkit-playsinline
          preload="auto"
          crossorigin="anonymous"  
        ></video>
    </a-assets>


    <!-- Lights for shadows -->
    <a-entity light="type: ambient; intensity: 0.5; color: #fdf6e4"></a-entity>
    <a-entity
      light="type: directional; intensity: 0.9; color: #ffffff; castShadow: true"
      position="1 2 1"
    ></a-entity>

    <!--  MARKER -->
      <a-marker 
      id="marker-hiro" preset="hiro"
      smooth="true"
      smoothCount="10"
      smoothTolerance="0.01"
      smoothThreshold="2"
      >

        
      <!-- Invisible ground plane: receives shadows and provides a stable reference surface -->
      <a-plane
        position="0 0 0"
        rotation="-90 0 0"
        width="1"
        height="1"
        material="color: red; opacity: 0; transparent: true; side: double;"
        shadow="receive: true"
      ></a-plane>

     

        <!-- Pedestal occluder: invisible but writes depth to occlude AR objects behind it -->
        <a-entity
          id="podest-occluder"
          obj-model="obj: #podest-obj; mtl: #podest-mtl"
          position="0 0 0"
          rotation="0 90 0"
          scale="1 1 1"
          occluder-obj
        ></a-entity>
      </a-entity>

         <!-- Rocket model (hidden until activated); rotates continuously -->
         <a-entity
          id="rocket"
          visible="false"
          gltf-model="sources/3D/Rocket.glb"
          position="0 -3 0"
          rotation="0 0 0"
          scale="10 10 10"
          animation="property: rotation; to: 0 360 0; loop: true; dur: 15000; easing: linear" 
           place-at-model-bottom="target: #rocket-video-plane; offsetY: -0.02; offsetZ: 0;"
           shadow="cast: true">

          <!-- Group for rocket-attached VFX (shown when needed) -->
          <a-entity id="fx-group" position="0 0 0" scale="1 1 1" visible="false">

           <!-- Front fire overlay (video as texture, rendered flat and not writing depth) -->
           <a-video
              id="smoke-front"
              visible="false"
              position="0 -0.18 0"
              rotation="0 0 0"
              width="0.25"
              height="0.35"
              src="#fireVid"
              transparent="true"
              material="shader: flat; side: double; depthWrite: false; depthTest: false;"
            ></a-video>
          </a-entity>

        </a-entity>

    

        <!-- Large smoke planes placed around the marker space (layered depth-disabled VFX) -->
        <a-plane
          id="smoke-back"
          visible="false"
          position="0 3 -1.5"
          rotation="0 0 0"
          width="7"
          height="7"
          material="shader: flat; src: #smokeVid; transparent: true; depthWrite: false; side: double; opacity: 0.85;"
        ></a-plane>

         <a-plane
          id="smoke-middle"
          visible="false"
          position="0 3 0.1"
          rotation="0 0 0"
          width="4"
          height="6.5"
          material="shader: flat; src: #smokeVid; transparent: true; side: double; depthWrite: false; depthTest: false; opacity: 1;"
          shadow="cast: true"
         
        ></a-plane>

        <a-plane
          id="smoke-front"
          visible="false"
          position="0 5 1"
          rotation="0 0 0"
          width="10"
          height="15"
          material="shader: flat; src: #smokeVid; transparent: true; side: double; depthWrite: false; depthTest: false; opacity: 1;"
          shadow="cast: true"
         
        ></a-plane>

        

       <!-- Mission 1: Pin group 1 (hitbox + pin + connector line + label) -->
       <a-entity id="pinGroup-1" visible="false" >
          <!-- HITBOX (transparent, larger target for interaction) -->
          <a-box
            id="hit-1"
            
            position="0.8 2 0.35"
            rotation="0 0 0"
            width="1.6"
            height="0.45"
            depth="0.3"
            material="opacity: 0.001; transparent: true; side: double; depthWrite: false;"
          ></a-box>


          <!-- Pin -->
          <a-sphere
            id="pin-1"  
            position="0.35 2.001 0.35"
            radius="0.04"
            material="color: #EBFF00; emissive: #EBFF00; emissiveIntensity: 0.9;"
          ></a-sphere>

          <!-- Linie -->
          <a-plane
            position="0.57 2.002 0.35"
            rotation="0 0 0"
            width="0.39"
            height="0.01"
            material="color: #EBFF00; emissive: #EBFF00; emissiveIntensity: 0.7; shader: flat; side: double;"
            look-at="[camera]"
          ></a-plane>

          <!-- Titel -->
          <a-text
            id="pinLabel1"
            value="${t("pinLabel1")}"
            position="0.78 2.015 0.35"
            rotation="0 0 0"
            align="left"
            width="3.5"
            color="#EBFF00"
            side="double"
          ></a-text>

        </a-entity>

        <!-- Mission 1: Pin group 2 (flat-aligned to marker) -->
        <a-entity id="pinGroup-2" visible="false" >

          <!-- HITBOX -->
          <a-plane
            id="hit-2"
          
            position="-0.62 1.499 0.35"
            rotation="-90 0 0"
            width="1.6"
            height="0.45"
            depth="0.3"
            material="opacity: 0.001; color: #EBFF00; side: double; depthWrite: false;"
          ></a-plane>

          <!-- PIN -->
          <a-sphere
            id="pin-2"
            position="-0.35 1.499 0.35"
            radius="0.04"
            material="color: #EBFF00; emissive: #EBFF00; emissiveIntensity: 0.9;"
          ></a-sphere>

          <!-- LINIE (ohne look-at, flach auf Marker) -->
          <a-plane
            position="-0.57 1.498 0.35"
            rotation="-90 0 0"
            width="0.39"
            height="0.01"
            material="color: #EBFF00; emissive: #EBFF00; emissiveIntensity: 0.7; shader: flat; side: double;"
          ></a-plane>

          <!-- TITEL (auch flach, leicht höher) -->
          <a-text
          id="pinLabel2"
          value="${t("pinLabel2")}"
          position="-0.78 1.485 0.35"
          rotation="0 0 0"
          align="right"
          width="3.5"
          color="#EBFF00"
          side="double"
          ></a-text>

        </a-entity>


        <!-- Mission 1: Pin group 3 -->
        <a-entity id="pinGroup-3" visible="false">
        <!-- Hitbox -->
          <a-plane
            id="hit-3"
        
            position="0.62 1 0.35"
            rotation="0 0 0"
            width="1.6"
            height="0.45"
            depth="0.3"
            material="opacity: 0; transparent: true; side: double; depthWrite: false;"
          ></a-plane>

          <!-- Pin -->
          <a-sphere
            id="pin-3"
            class="pin"
            position="0.35 1 0.35"
            radius="0.04"
            material="color: #EBFF00; emissive: #EBFF00; emissiveIntensity: 0.9;"
          ></a-sphere>

          <!-- Linie -->
          <a-plane
            position="0.57 1 0.35"
            rotation="-90 0 0"
            width="0.39"
            height="0.01"
            material="color: #EBFF00; emissive: #EBFF00; emissiveIntensity: 0.7; shader: flat; side: double;"
            look-at="[camera]"
          ></a-plane>

          <!-- Titel -->
          <a-text
            id="pinLabel3"
            value="${t("pinLabel3")}"
            position="0.78 1 0.35"
            rotation="0 0 0"
            align="left"
            width="3.5"
            color="#EBFF00"
            side="double"
          ></a-text>

        </a-entity>

        <!-- Mission 1: Pin group 4 -->
        <a-entity id="pinGroup-4" visible="false" position="0 0.5 0">

          <a-plane
            id="hit-4"
            position="-0.62 0.001 0.35"
            rotation="-90 0 0"
            width="1.6"
            height="0.45"
            depth="0.3"
            material="opacity: 0.001; transparent: true; side: double; depthWrite: false;"
          ></a-plane>

          <a-sphere
            id="pin-4"
            position="-0.35 0.001 0.35"
            radius="0.04"
            material="color: #EBFF00; emissive: #EBFF00; emissiveIntensity: 0.9;"
          ></a-sphere>

          <a-plane
            position="-0.57 0.002 0.35"
            rotation="-90 0 0"
            width="0.39"
            height="0.01"
            material="color: #EBFF00; emissive: #EBFF00; emissiveIntensity: 0.7; shader: flat; side: double;"
          ></a-plane>

          <a-text
            id="pinLabel4"
            value="${t("pinLabel4")}"
            position="-0.78 0.015 0.35"
            rotation="0 0 0"
            align="right"
            width="3.5"
            color="#EBFF00"
            side="double"
          ></a-text>

        </a-entity>


        <!-- Toast shown when the rocket has reached full charge -->
        <a-entity
            id="rocket-toast"
            visible="false"
            position="0 1.2 0.15"
            look-at="#cam"
            >
            <!-- Background plane -->
            <a-plane
                width="1.25"
                height="0.28"
                material="color: #12244C; opacity: 0.92; transparent: true; shader: flat; side: double; depthTest: false; depthWrite: false;"
            ></a-plane>

            <!-- Text -->
            <a-text
                id="rocket-toast-text"
                value="${t("rocketToast")}"
                align="center"
                width="2.2"
                color="#EBFF00"
                position="0 0 0.01"
            ></a-text>
        </a-entity>

        <!-- Mission banner displayed in front of the rocket -->
        <a-entity id="mission-banner" visible="false" position="0 1.1 0.18" look-at="#cam">
        <a-plane
            width="1.3"
            height="0.38"
            material="color: #12244C; opacity: 0.92; transparent: true; shader: flat; side: double; depthTest: false; depthWrite: false;"
        ></a-plane>

        <a-text
            id="mission-banner-title"
            value="MISSION 1"
            align="center"
            width="2.8"
            color="#EBFF00"
            position="0 0.06 0.01"
        ></a-text>

        <a-text
            id="mission-banner-sub"
            value="${t("missionBannerSub")}"
            align="center"
            width="2.6"
            color="#e5e7eb"
            position="0 -0.08 0.01"
        ></a-text>
        </a-entity>



      </a-marker>



      <!-- Mouse-based cursor + raycaster for desktop interaction -->
     <a-entity
        id="cam"
        camera
        cursor="rayOrigin: mouse; fuse: false"
        raycaster="objects: .pin; far: 30; interval: 0"
      ></a-entity>

    </a-scene>
  `;
}

// ------------------------------------------------------------------------------------
// Funktionen
// ------------------------------------------------------------------------------------
function refreshLanguageUI() {
  // Central helper to re-apply all language-dependent UI in one place.
  setLang(currentLang);       // Updates currentLang + persists it + updates both language toggle button labels
  applyTranslations();        // Updates standard DOM (permission overlay, footer, mission overlay text)
  applyARTranslations();      // Updates AR DOM (A-Frame <a-text> labels), if the scene exists
}

function showMissionStartScreen({ title, sub, buttonLabel, onStart, buttonId = "mission-start-btn", mode = "mission1start" }) {
  // Displays the mission start dialog overlay with a single start button.
  // buttonId/mode allow reusing the same UI for multiple missions.
  const overlay = document.getElementById("mission-overlay");
  overlay.classList.add("mission-dialog-mode");
  const wrap = document.getElementById("mission-wrap");
  const titleEl = document.getElementById("mission-title");
  const subEl = document.getElementById("mission-sub");
  
  // If required DOM nodes are missing, fall back to starting immediately.
  if (!overlay || !wrap || !titleEl || !subEl) {
    onStart && onStart();
    return;
  }

  // Cancel any pending auto-hide timer from previous overlays.
  if (missionOverlayTimer) {
    clearTimeout(missionOverlayTimer);
    missionOverlayTimer = 0;
  }

  // Track overlay state to support translation updates and conditional behavior.
  missionOverlayMode = mode ;

  // Populate overlay text.
  titleEl.textContent = title;
  subEl.textContent = sub;
  
  // Hide all buttons inside the wrap, then show/create the required start button.
  wrap.querySelectorAll("button").forEach((b) => {
    b.style.display = "none";
  });

  // Ensure the requested start button exists.
  let btn = document.getElementById(buttonId);
  if (!btn) {
    btn = document.createElement("button");
    btn.id = buttonId;
    btn.type = "button";
    btn.className = "mission2-start-btn";
    wrap.appendChild(btn);
  }

  // Ensure the button is visible (it may have been hidden by a Hinweis overlay).
  btn.style.display = "";

  // Use provided label or a safe default.
  btn.textContent = buttonLabel || "START";

  // Show overlay.
  overlay.classList.remove("hidden");

  // Prevent overlay clicks from bubbling up to other handlers.
  overlay.onclick = (e) => e.stopPropagation();
  wrap.onclick = (e) => e.stopPropagation();

  // Start mission: close overlay, clear mode state, then run callback.
  btn.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    overlay.classList.add("hidden");
    overlay.classList.remove("mission-dialog-mode");
    missionOverlayMode = "none"; // Clear mode when the dialog closes
    onStart && onStart();
  };
}

function setFooterMode(mode) {
  // Switches footer UI between pins view, minigame view, launch view, or hidden.
  const pinsView = document.getElementById("footer-view-pins");
  const mgView = document.getElementById("footer-view-minigame");
  const launchView = document.getElementById("footer-view-launch");

  // Hide all footer views, then reveal the requested one.
  [pinsView, mgView, launchView].forEach((v) => v?.classList.add("hidden"));
  if (mode === "none") return;          // ✅ show nothing in footer
  if (mode === "minigame") mgView?.classList.remove("hidden");
  else if (mode === "launch") launchView?.classList.remove("hidden");
  else pinsView?.classList.remove("hidden");
}

function showARRocketToast(ms = 1600) {
  // Displays the in-scene toast (A-Frame entity) for a limited duration.
  const toast = document.getElementById("rocket-toast");
  if (!toast) return;

  // Show toast entity.
  toast.setAttribute("visible", "true");

  // Simple pop-in animation via scale.
  toast.setAttribute("scale", "0.9 0.9 0.9");
  toast.setAttribute("animation__pop", "property: scale; dur: 220; easing: easeOutBack; to: 1 1 1");

  // Hide toast again after the configured delay.
  setTimeout(() => {
    toast.setAttribute("visible", "false");
  }, ms);
}

let hinweisVisible = false; // Tracks whether the Hinweis overlay is currently intended to be visible

function showHinweisOverlay({ title, sub } = {}) {
  // Shows the "Hinweis" (marker guidance) overlay and applies the Hinweis animation.
  const overlay = document.getElementById("mission-overlay");
  overlay.classList.remove("mission-dialog-mode");
  const wrap = document.getElementById("mission-wrap");
  const tEl = document.getElementById("mission-title");
  const sEl = document.getElementById("mission-sub");
  if (!overlay || !wrap || !tEl || !sEl) return;

  // Cancel any pending auto-hide timer from previous overlays.
  if (missionOverlayTimer) {
    clearTimeout(missionOverlayTimer);
    missionOverlayTimer = 0;
  }

  // Track overlay state to avoid interfering with mission dialogs.
  missionOverlayMode = "hinweis";

  // Hide the Mission 1 start button if it exists (Hinweis should not show mission CTAs).
  const missionBtn = document.getElementById("mission-start-btn");
  if (missionBtn) missionBtn.style.display = "none";

  // Populate overlay text (nullish coalescing allows empty defaults).
  tEl.textContent = title ?? "";
  sEl.textContent = sub ?? "";

  // Show overlay and trigger animation restart.
  overlay.classList.remove("hidden");

  wrap.classList.remove("mission-anim", "hinweis-anim");
  void wrap.offsetWidth; // Force reflow so the animation restarts reliably
  wrap.classList.add("hinweis-anim");
}

function hideHinweisOverlay() {
  // Only hides if the current mode is Hinweis to avoid closing mission overlays accidentally.
  if (missionOverlayMode !== "hinweis") return; // don't touch Mission 1 overlay

  const overlay = document.getElementById("mission-overlay");
  const wrap = document.getElementById("mission-wrap");

  overlay?.classList.add("hidden");
  wrap?.classList.remove("hinweis-anim");

  // Reset mode after closing.
  missionOverlayMode = "none";
}

function showMissionScreen({ title, sub, durationMs = 2600, onDone }) {
  // Shows a transient mission overlay (e.g., status/instructions) and auto-hides after durationMs.
  const overlay = document.getElementById("mission-overlay");
  const wrap = document.getElementById("mission-wrap");
  const tEl = document.getElementById("mission-title");
  const sEl = document.getElementById("mission-sub");

  // If required DOM nodes are missing, proceed immediately.
  if (!overlay || !wrap || !tEl || !sEl) {
    onDone && onDone();
    return;
  }

  // Cancel any pending auto-hide timer.
  if (missionOverlayTimer) {
    clearTimeout(missionOverlayTimer);
    missionOverlayTimer = 0;
  }

  // Populate overlay text and show it.
  tEl.textContent = title;
  sEl.textContent = sub;

  overlay.classList.remove("hidden");

  // Restart mission animation.
  wrap.classList.remove("mission-anim");
  void wrap.offsetWidth; // Force reflow to restart CSS animation
  wrap.classList.add("mission-anim");

  // Auto-hide and optionally invoke callback.
  missionOverlayTimer = setTimeout(() => {
    overlay.classList.add("hidden");
    wrap.classList.remove("mission-anim");
    missionOverlayTimer = 0;
    onDone && onDone();
  }, durationMs);
}

function fitPodestToRealDims(el, { height = 0.95, diameter = 1.8 } = {}) {
  // Fits the pedestal model to real-world dimensions by computing its bounding box and scaling accordingly.
  // After scaling, the model is centered and aligned so its top sits on the marker plane (y = 0).
  const obj = el.getObject3D("mesh");
  if (!obj) return;

  // Reset transforms to avoid accumulating adjustments across calls.
  el.object3D.position.set(0, 0, 0);
  el.object3D.scale.set(1, 1, 1);
  el.object3D.updateMatrixWorld(true);

  // Compute bounding box in world space.
  let box = new THREE.Box3().setFromObject(obj);
  let size = new THREE.Vector3();
  box.getSize(size);

  if (size.y <= 0) return;

  // Scale factor to match the requested height.
  const sH = height / size.y;

  // Scale factor to match the requested diameter (max of x/z).
  const base = Math.max(size.x, size.z);
  const sD = base > 0 ? (diameter / base) : sH;

  // Use the larger factor to avoid under-sizing in either dimension.
  const s = Math.max(sH, sD);
  el.object3D.scale.multiplyScalar(s);

  // Recompute bounding box after scaling.
  el.object3D.updateMatrixWorld(true);
  box = new THREE.Box3().setFromObject(obj);

  const parent = el.object3D.parent;
  if (!parent) return;

  // Compute center and top in parent-local coordinates for alignment.
  const centerW = box.getCenter(new THREE.Vector3());
  const centerP = parent.worldToLocal(centerW.clone());

  const topW = new THREE.Vector3(centerW.x, box.max.y, centerW.z);
  const topP = parent.worldToLocal(topW.clone());

  // Center in X/Z and align top to marker plane at y = 0.
  el.object3D.position.x -= centerP.x;
  el.object3D.position.z -= centerP.z;
  el.object3D.position.y -= topP.y;

  el.object3D.updateMatrixWorld(true);
}


function setupMissionHelpButton() {
  // Initializes the mission help UI (button + expandable help bar) and exposes helpers for mission code.
  const ui = document.getElementById("mission-help-ui");
  const btn = document.getElementById("mission-help-btn");
  const bar = document.getElementById("mission-help-bar");
  const textEl = document.getElementById("mission-help-text");

  // Abort if any required element is missing.
  if (!ui || !btn || !bar || !textEl) return;

  // UI is hidden until explicitly enabled by mission flow.
  ui.classList.add("hidden");

  // Returns the mission-specific help message based on current mission context.
  const getMissionHelpText = () => {
    if (currentMissionForHelp === "mission2") return t("helpMission2");
    return t("helpMission1");
  };

  // Marker-lost message (kept inline rather than i18n keys).
  const getMarkerLostText = () => {
    return currentLang === "de"
      ? "Bitte halte die Kamera auf den Marker"
      : "Please hold the camera to the marker";
  };

  // Shows the gray help bar with the provided message.
  const showBar = (msg) => {
    textEl.textContent = msg || "";
    bar.classList.remove("hidden");
    missionHelpVisible = true;
  };

  // Hides the gray help bar.
  const hideBar = () => {
    bar.classList.add("hidden");
    missionHelpVisible = false;
  };

  // Restarts the idle timer that can automatically show a hint after inactivity.
  const resetIdleHintTimer = () => {
    if (missionHelpIdleTimer) clearTimeout(missionHelpIdleTimer);

    missionHelpIdleTimer = setTimeout(() => {
      // Only show idle hint if marker is tracked (mission 1) or if mission 2 is active.
      if (currentMissionForHelp === "mission2" || markerIsTrackedForHelp) {
        showBar(getMissionHelpText());
      }
    }, 5000);
  };

  // Expose helpers globally so mission logic can show/hide/update the help UI without importing scope.
  window.showMissionHelpBar = showBar;
  window.hideMissionHelpBar = hideBar;
  window.resetMissionHelpText = () => showBar(getMissionHelpText());
  window.showMarkerLostHelp = () => {
    // Marker guidance is relevant for mission 1; mission 2 may have different requirements.
    if (currentMissionForHelp === "mission1") showBar(getMarkerLostText());
  };
  window.resetMissionHelpIdleTimer = resetIdleHintTimer;
  window.clearMissionHelpIdleTimer = () => {
    if (missionHelpIdleTimer) clearTimeout(missionHelpIdleTimer);
    missionHelpIdleTimer = 0;
  };

  // Toggle behavior on help button click.
  btn.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Toggle gray bar visibility.
    if (missionHelpVisible) {
      hideBar();
    } else {
      showBar(getMissionHelpText());
    }

    // Restart idle timer after manual interaction.
    resetIdleHintTimer();
  };

  // Start hidden.
  hideBar();
}

function showMissionHelpButton() {
  // Shows the help UI container (button + optional bar).
  document.getElementById("mission-help-ui")?.classList.remove("hidden");
}

function hideMissionHelpButton() {
  // Hides the help UI container and ensures the bar is closed.
  document.getElementById("mission-help-ui")?.classList.add("hidden");
  document.getElementById("mission-help-bar")?.classList.add("hidden"); // also close gray bar
}

function bindFooterHeightToCSSVar() {
  // Keeps a CSS custom property updated with the AR footer height for responsive layout.
  const footer = document.getElementById("ar-footer");
  if (!footer) return;

  const setVar = () => {
    const h = footer.getBoundingClientRect().height || 0;
    document.documentElement.style.setProperty("--ar-footer-h", `${Math.ceil(h)}px`);
  };

  // Initialize immediately.
  setVar();

  // Update when footer size changes (e.g., content switches between modes).
  const ro = new ResizeObserver(setVar);
  ro.observe(footer);

  // Fallback updates for viewport changes.
  window.addEventListener("resize", () => setTimeout(setVar, 50));
  window.addEventListener("orientationchange", () => setTimeout(setVar, 150));
}

function hideTapGrid() {
  // Hides the tap grid UI and disables pointer interaction.
  const grid = document.getElementById("tapGrid");
  if (!grid) return;
  grid.classList.add("hidden");
  grid.style.pointerEvents = "none";
}

function applyARTranslations() {
  // Applies language updates to AR scene entities (<a-text>) that use the "value" attribute.
  const setAValue = (id, txt) => {
    const el = document.getElementById(id);
    if (el) el.setAttribute("value", txt);
  };

  // AR pin labels.
  setAValue("pinLabel1", t("pinLabel1"));
  setAValue("pinLabel2", t("pinLabel2"));
  setAValue("pinLabel3", t("pinLabel3"));
  setAValue("pinLabel4", t("pinLabel4"));

  // AR banner + toast.
  setAValue("mission-banner-sub", t("missionBannerSub"));
  setAValue("rocket-toast-text", t("rocketToast"));

  // If the notice overlay is currently open, refresh its text.
  if (missionOverlayMode === "hinweis") {
    const titleEl = document.getElementById("mission-title");
    const subEl = document.getElementById("mission-sub");
    if (titleEl) titleEl.textContent = t("holdToMarkerTitle");
    if (subEl) subEl.textContent = t("holdToMarkerText");
  }

  // If Mission 1 start overlay is open, refresh title/subtitle/button.
  if (missionOverlayMode === "mission1start") {
    const titleEl = document.getElementById("mission-title");
    const subEl = document.getElementById("mission-sub");
    const btn = document.getElementById("mission-start-btn");

    if (titleEl) titleEl.textContent = t("missionTitle");
    if (subEl) subEl.textContent = t("missionSub");
    if (btn) btn.textContent = t("startMission1Btn");
  }

  // If Mission 2 start overlay is open, refresh title/subtitle/button.
  if (missionOverlayMode === "mission2start") {
    const titleEl = document.getElementById("mission-title");
    const subEl = document.getElementById("mission-sub");
    const btn = document.getElementById("mission2-start-btn");

    if (titleEl) titleEl.textContent = t("mission2Title");
    if (subEl) subEl.textContent = t("mission2StartText"); // Mission 2 instruction text
    if (btn) btn.textContent = t("startMission2Btn");
  }
}

function vibrateLaunchFade({
  totalMs = 2500,     // Total vibration duration
  startMs = 70,       // Initial pulse duration (stronger)
  endMs = 18,         // Final pulse duration (softer)
  intervalMs = 180,   // Delay between pulses
  pauseMs = 60,       // Pause after each pulse
} = {}) {
  // Progressive vibration effect that fades intensity over time (mobile only).
  if (!("vibrate" in navigator)) return;

  const start = performance.now();

  const tick = (t) => {
    const elapsed = t - start;
    const p = Math.min(1, elapsed / totalMs); // 0..1 progress

    // Linear interpolation from startMs -> endMs.
    const pulse = Math.round(startMs + (endMs - startMs) * p);

    // Clamp very small values which may be imperceptible.
    const pulseClamped = Math.max(10, pulse);

    // Pattern: vibrate then pause.
    navigator.vibrate([pulseClamped, pauseMs]);

    if (elapsed < totalMs) {
      setTimeout(() => requestAnimationFrame(tick), intervalMs);
    } else {
      navigator.vibrate(0); // Stop vibration
    }
  };

  requestAnimationFrame(tick);
}




// ------------------------------------------------------------------------------------------
// Init Logik
// ------------------------------------------------------------------------------------------
 function initARLogic() {
    // Initializes AR scene behavior: marker tracking, model setup, VFX/video handling, and mission progression.

    // ===== Core A-Frame / AR entities =====
    const scene = document.getElementById("ar-scene");        // <a-scene> root (created dynamically)
    const marker = document.getElementById("marker-hiro");    // AR.js marker entity (HIRO)
    const rocket = document.getElementById("rocket");         // Rocket GLTF entity
    const label = document.getElementById("rocket-label");    // Optional label entity (if present)
    const hint = document.getElementById("hint");             // Optional hint UI element (if present)
    const arRoot = document.getElementById("ar-root");        // AR container in the DOM
    const podestVisible = document.getElementById("podest-visible"); // Visible pedestal model (if used)
    const podestOcc = document.getElementById("podest-occluder");    // Occluder pedestal model

    // ===== Video / VFX elements =====
    const fxGroup = document.getElementById("fx-group");      // Rocket-attached effects group
    const fxVid = document.getElementById("fxVid");           // VFX video element (looped)
    const vid = document.getElementById("smokeVid");           // Smoke video element (for planes)
    const rocketVid = document.getElementById("fireVid");      // Fire video element (for rocket overlay)
    const fireEl = document.querySelector("#smoke-front");     // Front VFX plane/entity (id collision with a-video in template possible)
    //fireEl.setAttribute("scale", "0 0 0");
    //fireEl.setAttribute("visible", "false");

   const revealRocketFromPodest = () => {
    // Makes the rocket visible and animates it upward from a "hidden in pedestal" start position.
    if (!rocket) return;

    rocket.setAttribute("visible", "true");

    // Start position (below marker level) so the rocket appears to rise out of the pedestal.
    rocket.setAttribute("position", "0 -3 0");  // <- wirkt wie im Podest

    // Reset existing reveal animation before re-applying.
    rocket.removeAttribute("animation__reveal");
    rocket.setAttribute(
      "animation__reveal",
      "property: position; dur: 1500; easing: easeOutCubic; to: 0 0 0"
    );
  };

  let gridBooted = false; // Ensures pin/tap grid is initialized only once.

  const startGridAfterReveal = () => {
    // Boots mission 1 pins and sets up transition into mission 2 + launch behavior.
    if (gridBooted) return;
    gridBooted = true;

    setupMission1Pins({
      onAllPinsDone: () => {
        // When all pins are completed, start mission 2, hide the tap UI, and enable launch.
        startMission2();
        hideTapGrid();
        document.getElementById("launch-btn")?.addEventListener("click", async () => {
          // Haptic feedback ramp for launch interaction.
          vibrateLaunchFade({
            totalMs: 3200,
            startMs: 75,
            endMs: 15,
            intervalMs: 170,
            pauseMs: 70,
          });
          // await playFX();
          launchRocket3D();
        });
      },
    });

    // Force raycaster to rebuild after interactive .pin entities are added.
    requestAnimationFrame(() => {
      const cam = document.getElementById("cam");
      cam?.components?.raycaster?.refreshObjects?.();
    });
  };

  //rocket.addEventListener("animationcomplete__reveal", () => {
  // Optional: start rotation only after reveal finishes.
  // rocket.setAttribute("animation", "property: rotation; to: 0 360 0; loop: true; dur: 15000; easing: linear");

  // startGridAfterReveal();
  //}, { once: true });

  const playLaunchOnce = async (onDone) => {
      // Plays the launch video once, then invokes the completion callback.
      rocketIdleVid?.pause();
      if (rocketIdleVid) rocketIdleVid.currentTime = 0;

      setRocketSrc("#rocketLaunchVid");

      if (!rocketLaunchVid) { onDone && onDone(); return; }

      rocketLaunchVid.currentTime = 0;
      await safePlay(rocketLaunchVid);

      const ended = () => {
        rocketLaunchVid.removeEventListener("ended", ended);
        onDone && onDone();
      };
      rocketLaunchVid.addEventListener("ended", ended);
    };

    // -----------------------------
    // iOS/Android Autoplay-Policy Fix
    // -----------------------------

    const unlockVid = async (vid) => {
      // Attempts a short muted play/pause to satisfy mobile autoplay policies.
      if (!vid) return;
      try {
        // Must be muted; otherwise most browsers block programmatic play.
        vid.muted = true;
        vid.playsInline = true;

        // Short play->pause "unlock" sequence.
        const p = vid.play();
        if (p && typeof p.then === "function") await p;
        vid.pause();
        vid.currentTime = 0;
      } catch (e) {
        console.warn("unlockVid blocked:", e);
      }
    };

    const unlockAllVidsOnce = async () => {
      // Runs the unlock sequence only once for relevant videos.
      if (vidsUnlocked) return;
      vidsUnlocked = true;
      await unlockVid(fxVid);
      await unlockVid(launchVid); // optional (nur wenn playLaunchOnce ein Video ist)
    };

    const glitchMarker = (marker) => {
      // Forces a markerLost/markerFound cycle to refresh AR.js tracking state.
      if (!marker) return;
      marker.emit("markerLost");
      requestAnimationFrame(() => marker.emit("markerFound"));
    };

    // -----------------------------
    // Smoke Play
    // -----------------------------

  function playSmokeAll({ durationMs = 3000 } = {}) {
    // Plays smoke video on three layered planes, then hides them after durationMs.

    const front = document.getElementById("smoke-front");
    const mid = document.getElementById("smoke-middle");
    const back = document.getElementById("smoke-back");

    console.log("🔥 playSmokeAll", { vid: !!vid, front: !!front, mid: !!mid, back: !!back });
    if (!vid || !front || !mid || !back) return;

    // Show smoke planes.
    [front, mid, back].forEach((p) => {
      p.setAttribute("visible", "true");
      if (p.object3D) p.object3D.visible = true;
    });

    // Reset and play the smoke video.
    try { vid.pause(); } catch {}
    try { vid.currentTime = 0; } catch {}
    vid.muted = true;

    const p = vid.play();
    if (p?.catch) p.catch((e) => console.warn("❌ smoke play blocked:", e));

    // Hide planes after the configured duration.
    window.setTimeout(() => {
      [front, mid, back].forEach((p) => {
        p.setAttribute("visible", "false");
        if (p.object3D) p.object3D.visible = false;
      });
    }, durationMs);
  }

  const playFX = async () => {
    // Starts the looping rocket-attached VFX video and makes the VFX group visible.
    if (!fxGroup || !fxVid) return;

    fxGroup.setAttribute("visible", "true");

    fxVid.pause();
    fxVid.currentTime = 0;
    fxVid.loop = true;
    fxVid.muted = true;

    try { await fxVid.play(); } catch (e) { console.log("fx play failed", e); }
  };

  const stopFX = () => {
    // Stops the looping VFX video and hides the VFX group.
    if (!fxGroup || !fxVid) return;
    fxVid.pause();
    fxVid.currentTime = 0;
    fxGroup.setAttribute("visible", "false");
  };

    // ===== Pedestal model sizing =====

    // Scale visible pedestal model to real-world dimensions once loaded.
    podestVisible?.addEventListener("model-loaded", () => {
      fitPodestToRealDims(podestVisible, { height: 0.95, diameter: 1.8 });
    });

    // Scale occluder pedestal model to match the visible pedestal.
    podestOcc?.addEventListener("model-loaded", () => {
      fitPodestToRealDims(podestOcc, { height: 0.95, diameter: 1.8 });
    });

    // Basic load/error logging for debugging asset issues.
    if (podestVisible) {
      podestVisible.addEventListener("model-loaded", () => console.log("✅ Podest geladen"));
      podestVisible.addEventListener("model-error", (e) => console.log("❌ Podest Fehler", e.detail));
    }
    
    const syncARCover = () => {
      // Ensures the camera video and WebGL canvas are sized/positioned like CSS "background-size: cover".
      // Uses VisualViewport when available to handle mobile browser UI insets and dynamic viewport changes.
      const vv = window.visualViewport;
      const vw = vv ? vv.width : window.innerWidth;
      const vh = vv ? vv.height : window.innerHeight;
      const vLeft = vv ? vv.offsetLeft : 0;
      const vTop  = vv ? vv.offsetTop  : 0;

      // AR.js injects a video element (often #arjs-video); fall back to the first <video> if needed.
      const video = document.getElementById("arjs-video") || document.querySelector("video");
      const canvasWrap = document.querySelector(".a-canvas"); // A-Frame canvas wrapper
      const canvas = scene?.renderer?.domElement || document.querySelector("canvas"); // WebGL canvas

      // Abort until video + canvas exist and the video metadata is ready.
      if (!video || !canvas) return false;
      if (!video.videoWidth || !video.videoHeight) return false;

      const vidW = video.videoWidth;
      const vidH = video.videoHeight;

      // COVER scale: fill the viewport entirely (cropping permitted).
      const scale = Math.max(vw / vidW, vh / vidH);
      const boxW = Math.round(vidW * scale);
      const boxH = Math.round(vidH * scale);

      // Center the scaled video/canvas within the visual viewport.
      const left = Math.round(vLeft + (vw - boxW) / 2);
      const top  = Math.round(vTop  + (vh - boxH) / 2);

      // Apply the same fixed bounding box to the video + canvas (and optionally the wrapper).
      const applyBox = (el) => {
        if (!el) return;
        el.style.position = "fixed";
        el.style.left = `${left}px`;
        el.style.top = `${top}px`;
        el.style.width = `${boxW}px`;
        el.style.height = `${boxH}px`;
        el.style.transform = "none";
      };

      applyBox(video);
      applyBox(canvas);
      applyBox(canvasWrap);

      // Trigger AR.js resize pipeline to keep internal canvases in sync with the renderer size.
      const arSystem = scene.systems && (scene.systems.arjs || scene.systems["arjs"]);
      const src = arSystem && arSystem.arToolkitSource;
      const ctx = arSystem && arSystem.arToolkitContext;

      if (src && scene.renderer) {
        src.onResizeElement();
        src.copyElementSizeTo(scene.renderer.domElement);
        if (ctx && ctx.arController && ctx.arController.canvas) {
          src.copyElementSizeTo(ctx.arController.canvas);
        }
      }

      return true;
    };

    // Starts cover syncing once the camera video is ready; retries for a limited time.
    const startARCoverSync = () => {
      let tries = 0;
      const t = setInterval(() => {
        tries++;
        if (syncARCover() || tries > 120) clearInterval(t);
      }, 50);
    };

    // Defer until the scene is loaded to ensure renderer/canvas are initialized.
    if (scene.hasLoaded) startARCoverSync();
    else scene.addEventListener("loaded", startARCoverSync, { once: true });

    // Re-apply cover sizing after viewport changes.
    window.addEventListener("resize", () => setTimeout(syncARCover, 80));
    window.addEventListener("orientationchange", () => setTimeout(syncARCover, 250));

    // ----------------------------
    // Mission Banner (AR Plane)
    // ----------------------------

    // Displays a temporary in-scene banner (A-Frame entity) with title and subtitle.
    const showMissionBanner = (title, sub, ms = 1500) => {
        const banner = document.getElementById("mission-banner");
        const t = document.getElementById("mission-banner-title");
        const s = document.getElementById("mission-banner-sub");
        if (!banner || !t || !s) return;

        t.setAttribute("value", title);
        s.setAttribute("value", sub);

        // Show with a small pop-in scale animation.
        banner.setAttribute("visible", "true");
        banner.setAttribute("scale", "0.9 0.9 0.9");
        banner.setAttribute(
        "animation__pop",
        "property: scale; dur: 220; easing: easeOutBack; to: 1 1 1"
        );

        setTimeout(() => banner.setAttribute("visible", "false"), ms);
    };

    // Hard abort if critical entities are missing.
    if (!scene || !marker || !rocket) return;

    // Used to branch logic depending on whether the rocket is a GLTF entity.
    const isGltfRocket = !!rocket.getAttribute("gltf-model");

    // -------------------------------------------------------
    // Aspect 
    // -------------------------------------------------------

    // Ensures renderer and camera aspect match the AR root container dimensions.
    const fixARAspect = () => {
        if (!scene || !arRoot) return;

        const w = arRoot.clientWidth;
        const h = arRoot.clientHeight;
        if (!w || !h) return;

        if (scene.renderer) scene.renderer.setSize(w, h, false);

        if (scene.camera) {
        scene.camera.aspect = w / h;
        scene.camera.updateProjectionMatrix();
        }
    };

    if (scene.hasLoaded) fixARAspect();
    else scene.addEventListener("loaded", fixARAspect, { once: true });

    window.addEventListener("resize", fixARAspect);
    window.addEventListener("orientationchange", () => setTimeout(fixARAspect, 250));

    // -------------------------------------------------------
    // Touch -> MouseEvents WITH COORDINATES
    // -------------------------------------------------------

    // Converts touch events on the canvas into mouse events so raycaster/cursor logic works on Android.
    const enableTouchToMouseWithCoords = () => {
        const canvas = scene.canvas;
        if (!canvas) return;

        // Prevent default scrolling/zoom gestures on the AR canvas.
        canvas.style.touchAction = "none";
        canvas.style.pointerEvents = "auto";

        const dispatchMouse = (type, touch) => {
        const evt = new MouseEvent(type, {
            bubbles: true,
            cancelable: true,
            clientX: touch.clientX,
            clientY: touch.clientY,
        });
        canvas.dispatchEvent(evt);
        };

        canvas.addEventListener(
        "touchstart",
        (e) => {
            e.preventDefault();
            const t = e.changedTouches[0];
            dispatchMouse("mousemove", t);
            dispatchMouse("mousedown", t);
        },
        { passive: false }
        );

        canvas.addEventListener(
        "touchmove",
        (e) => {
            e.preventDefault();
            const t = e.changedTouches[0];
            dispatchMouse("mousemove", t);
        },
        { passive: false }
        );

        canvas.addEventListener(
        "touchend",
        (e) => {
            e.preventDefault();
            const t = e.changedTouches[0];
            dispatchMouse("mouseup", t);
            dispatchMouse("click", t);
        },
        { passive: false }
        );
    };

    // Defer until the scene is loaded so scene.canvas exists.
    if (scene.hasLoaded) enableTouchToMouseWithCoords();
    else scene.addEventListener("loaded", enableTouchToMouseWithCoords, { once: true });


    // -------------------------------------------------------
    // Mission Flow
    // -------------------------------------------------------

    // Mission state flags (prevent re-entry).
    let mission1Started = false;
    let mission2Started = false;

    // Gate conditions for Mission 1 interaction.
    let mission1Confirmed = false;      // Start Mission 1 pressed by the user
    let markerTracked = false;          // markerFound/markerLost state
    let mission1GridSetupDone = false;  // setupMission1Pins executed once

    const updateMission1Active = () => {
      // Arms/disarms Mission 1 hit targets based on user confirmation + marker tracking state.
      // This toggles the `.pin` class on hit entities, which the raycaster is configured to target.
      const cam = document.getElementById("cam");
      if (!mission1GridSetupDone) return;

      const active = mission1Confirmed && markerTracked;

      const hits = [
        document.getElementById("hit-1"),
        document.getElementById("hit-2"),
        document.getElementById("hit-3"),
        document.getElementById("hit-4"),
      ];

      // Toggle raycastability by adding/removing the `.pin` class.
      hits.forEach((h) => {
        if (!h) return;
        if (active) h.classList.add("pin");
        else h.classList.remove("pin");
      });

      // Refresh raycaster after changing the set of target elements.
      requestAnimationFrame(() => {
        cam?.components?.raycaster?.refreshObjects?.();
      });
    };

    const startMission2 = () => {
      // Starts Mission 2 (tap minigame) once and routes footer/help UI accordingly.
      if (mission2Started) return;
      mission2Started = true;

      // Mission 2 parameters.
      const goal = 30;
      const durationMs = 5000;

      // Localized inline instruction (computed but not directly used in the overlay here).
      const instruction =
        currentLang === "de"
          ? `Tippe ${goal}x in ${Math.round(durationMs / 1000)} Sekunden.`
          : `Tap ${goal} times in ${Math.round(durationMs / 1000)} seconds.`;

      showMissionStartScreen({
        title: t("mission2Title"),
        sub: t("mission2StartText"),
        buttonLabel: t("startMission2Btn"),
        buttonId: "mission2-start-btn",
        mode: "mission2start",
        onStart: () => {
          // Switch footer to minigame view and initialize the tap minigame.
          setFooterMode("minigame");

          setupMission2Minigame({
            goal,
            durationMs,

            onDone: ({ success }) => {
              // On success, transition to launch state and stop mission help.
              if (success) {
                hideMissionHelpButton();
                window.clearMissionHelpIdleTimer?.();
                currentMissionForHelp = "none";
                setFooterMode("launch");
              } else {
                // On failure, keep minigame footer visible.
                setFooterMode("minigame");
              }
            },
          });

          // Auto-trigger the minigame start after UI is ready (two frames to ensure DOM is updated).
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              document.getElementById("mg-start-btn")?.click();
            });
          });
        },
      });
    };

    // Mission 1 grid init is allowed only once.
    let mission1GridBooted = false;

    const startMission1Grid = () => {
      // Initializes Mission 1 pins and help UI, then arms interactions when marker is tracked.
      currentMissionForHelp = "mission1";
      window.resetMissionHelpText?.();
      showMissionHelpButton(); // show from Mission 1 onward
      window.resetMissionHelpIdleTimer?.();
      if (mission1GridBooted) return;
      mission1GridBooted = true;

      // User confirmed Mission 1 start.
      mission1Confirmed = true;

      // Show pins footer view.
      setFooterMode("pins");

      // Build Mission 1 interaction (pins) once.
      setupMission1Pins({
        onAllPinsDone: () => {
          // Transition help context into Mission 2 and move to minigame flow.
          currentMissionForHelp = "mission2";
          window.hideMissionHelpBar?.();
          window.resetMissionHelpIdleTimer?.();
          startMission2();

          // Bind launch handler only once globally.
          if (!window.__launchBound) {
            window.__launchBound = true;

            document.getElementById("launch-btn")?.addEventListener("click", async () => {
              // Launch feedback + VFX + rocket animation.
              vibrateLaunchFade({
                totalMs: 3200,
                startMs: 75,
                endMs: 15,
                intervalMs: 170,
                pauseMs: 70,
              });
              playRocketVid();
              playSmokeAll({ durationMs: 7000 });
              launchRocket3D();
            });
          }
        },
      });

      // Mark setup complete so updateMission1Active can safely toggle hit targets.
      mission1GridSetupDone = true;

      // Defer arming to ensure A-Frame entities and raycaster are fully initialized.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          updateMission1Active(); // arms immediately if markerTracked is already true
        });
      });
    };

    /*------------------------------------- 
    COUNTDOWN
    ---------------------------------------*/

    const countdownOverlay = document.getElementById("countdown-overlay"); // Countdown container
    const countdownNumber = document.getElementById("countdown-number");   // Number/text element

    const startCountdown = (seconds = 3, onDone) => {
      // Displays a short countdown overlay and invokes onDone after "START".
      if (!countdownOverlay || !countdownNumber) return;

      // Step duration is slightly > 1s to accommodate animation timing.
      const STEP_DURATION = 1100; 
      const END_DURATION = 800;

      let n = seconds;

      const showNumber = (val) => {
        // Updates countdown text and restarts the CSS "pop" animation.
        countdownNumber.textContent = String(val);
        countdownNumber.classList.remove("pop");
        void countdownNumber.offsetWidth; // restart animation
        countdownNumber.classList.add("pop");
      };

      countdownOverlay.classList.remove("hidden");
      showNumber(n);

      const tick = () => {
        n -= 1;

        if (n <= 0) {
          // Final state: display "START", then hide overlay and proceed.
          showNumber("START");
          setTimeout(() => {
            countdownOverlay.classList.add("hidden");
            onDone && onDone();
          }, END_DURATION);
          return;
        }

        showNumber(n);
        setTimeout(tick, STEP_DURATION);
      };

      setTimeout(tick, STEP_DURATION);
    };


    // ================================================
    //Rocket launch
    //==================================================
  const launchBtn = document.getElementById("launch-btn"); // Launch CTA (used elsewhere to bind click handler)

  let launchRaf = null; // requestAnimationFrame handle for the launch animation loop

  const launchRocket3D = () => {
    // Animates the rocket upward with a short shake, then accelerates out of view.
    // After completion, redirects to the next page.
    if (!rocket) return;

    // Reset any previous animations and state.
    rocket.removeAttribute("animation__shake");
    rocket.removeAttribute("animation");  
    if (launchRaf) cancelAnimationFrame(launchRaf);
    rocket.setAttribute("position", "0 0 0");

    // Shake phase (brief pre-launch rumble).
    rocket.setAttribute(
      "animation__shake",
      "property: position; dur: 120; dir: alternate; loop: 10; easing: easeInOutSine; to: 0 0 0.02"
    );

    // After shake completes: switch to manual RAF-driven acceleration.
    setTimeout(() => {
      rocket.removeAttribute("animation__shake");

      const start = performance.now();
      const y0 = 0;

      // Motion tuning parameters.
      const initialVel = 0.2;   // Initial upward velocity
      const accel = 1.6;        // Constant acceleration
      const duration = 4500;    // Max duration before forcing completion
      const maxY = 160;         // Target Y position (out of frame)

      let v = initialVel;
      let y = y0;
      let last = performance.now();

      const tick = (t) => {
        const dt = (t - last) / 1000; // seconds
        last = t;

        // Integrate velocity and position with constant acceleration.
        v += accel * dt;
        y += v * dt;

        // Stop condition: time elapsed or max height reached.
        if (t - start >= duration || y >= maxY) {
          rocket.setAttribute("position", `0 ${maxY} 0`);
          return;
        }

        rocket.setAttribute("position", `0 ${y} 0`);
        launchRaf = requestAnimationFrame(tick);
      };

      launchRaf = requestAnimationFrame(tick);
    }, 120 * 10); // Approximate shake duration (dur * loop)

    // Post-launch navigation (delayed to allow animation/VFX to play out).
    setTimeout(() => {
      window.location.href = "mehrErfahren.html";
    }, 8000);
  };

  /* ---------------------------------------
    Fire play
    -----------------------------------------*/

  const playRocketVid = async () => {
    // Shows the FX group and starts the rocket fire video.
    if (!rocketVid || !fxGroup) return;
    fxGroup.setAttribute("visible", "true");
    rocketVid.currentTime = 0;
    try { await rocketVid.play(); } catch (e) {}
  };

  // -------------------------------------------------------
  // Marker Verhalten
  // -------------------------------------------------------

  marker.addEventListener("markerFound", () => {
    // Marker reacquired: enable Mission 1 interactions and hide marker guidance.
    markerTracked = true;
    updateMission1Active();
    markerIsTrackedForHelp = true;

    // Help UI: hide marker-lost bar and restart idle hint timer.
    window.hideMissionHelpBar?.();
    window.resetMissionHelpIdleTimer?.();

    // Show AR elements.
    rocket.setAttribute("visible", "true");
    label?.setAttribute("visible", "true");
    hint?.setAttribute("visible", "false");

    // Switch from loading to active UI.
    loadingEl.classList.add("hidden");
    arFooter.classList.remove("hidden");

    // If Hinweis is visible, hide it now.
    if (missionOverlayMode === "hinweis") {
      hideHinweisOverlay();
    }

    // If Mission 1 has not been confirmed, show its start dialog.
    if (!mission1Confirmed) {
      setFooterMode("none");

      // Reveal sequence should run only once per session.
      if (!mission1Started) {
        mission1Started = true;

        // Animate rocket rising and play initial smoke.
        revealRocketFromPodest();
        playSmokeAll({ durationMs: 5000 });

        // After reveal completes, show the Mission 1 start overlay.
        rocket.addEventListener(
          "animationcomplete__reveal",
          () => {
            showMissionStartScreen({
              title: t("missionTitle"),
              sub: t("missionSub"),
              buttonLabel: t("startMission1Btn"),
              onStart: () => {
                // User confirmed: arm pins and refresh marker state.
                mission1Confirmed = true;
                missionOverlayMode = "none";
                startMission1Grid();
                glitchMarker(marker);
              },
            });
          },
          { once: true }
        );
      } else {
        // Marker was lost and found again before pressing start: re-show start overlay.
        showMissionStartScreen({
          title: "MISSION 1",
          sub: t("missionSub"),
          buttonLabel: t("startMission1Btn"),
          onStart: () => {
            mission1Confirmed = true;
            missionOverlayMode = "none";
            startMission1Grid();
            glitchMarker(marker);
          },
        });
      }
    }
  });

  marker.addEventListener("markerLost", () => {
    // Marker lost: disarm Mission 1 interactions and show guidance if needed.
    markerTracked = false;
    updateMission1Active();
    markerIsTrackedForHelp = false;

    // Stop idle help timer when marker is not tracked.
    window.clearMissionHelpIdleTimer?.();

    // Hide AR elements and stop running effects.
    rocket.setAttribute("visible", "false");
    label?.setAttribute("visible", "false");
    hint?.setAttribute("visible", "true");
    stopFX();

    // If Mission 1 is active, show marker-lost help text.
    if (mission1Confirmed && currentMissionForHelp === "mission1") {
      window.showMarkerLostHelp?.();
    }

    // Before Mission 1 is confirmed, switch back to Hinweis guidance overlay.
    if (!mission1Confirmed) {
      showHinweisOverlay({
        title: t("holdToMarkerTitle"),
        sub: t("holdToMarkerText"),
      });
    }
  });
    
    }


  //------------------------------------------------------------------------------------ 
  //                                   MISSIONS 
  //  ----------------------------------------------------------------------------------

  function setupMission1Pins({ onAllPinsDone }) {
    // Initializes Mission 1 pin interactions:
    // - shows pins step-by-step (unlock flow)
    // - opens info overlay per pin
    // - tracks progress and triggers Mission 2 when all pins are completed

    // ---- Overlay elements (declared upfront to avoid ordering/TDZ issues) ----
    const overlay = document.getElementById("info-overlay");
    const titleEl = document.getElementById("info-title");
    const textEl = document.getElementById("info-text2");
    const closeBtn = document.getElementById("info-close");
    const scene = document.getElementById("ar-scene");
    const marker = document.getElementById("marker-hiro");

    // ---- Pin groups and hit targets (one per pin) ----
    const pinGroups = [
      document.getElementById("pinGroup-1"),
      document.getElementById("pinGroup-2"),
      document.getElementById("pinGroup-3"),
      document.getElementById("pinGroup-4"),
    ];

    const hitTargets = [
      document.getElementById("hit-1"),
      document.getElementById("hit-2"),
      document.getElementById("hit-3"),
      document.getElementById("hit-4"),
    ];

    // ---- Footer elements (pins view only) ----
    const progressBarEl = document.querySelector("#ar-footer .footer-progress-bar");
    const startBtn = document.querySelector("#footer-view-pins .footer-cta"); // pins view CTA (not the minigame/launch CTA)

    // ---- State ----
    const clickedPins = new Set(); // Tracks completed pins (0..3)
    let mission1Completed = false;
    let mission2Queued = false;

    // Per-pin overlay content (icon + translation keys).
    const pinContent = [
      { icon: "sources/icons/Icon_Mission.png",  subKey: "pinSub1", textKey: "pinText1" },
      { icon: "sources/icons/Icon_Netzwerk.png", subKey: "pinSub2", textKey: "pinText2" },
      { icon: "sources/icons/Icon_Team.png",     subKey: "pinSub3", textKey: "pinText3" },
      { icon: "sources/icons/Icon_Projekt.png",  subKey: "pinSub4", textKey: "pinText4" },
    ];

    // Sets an A-Frame entity visible/hidden and mirrors to object3D when available.
    const setVisible = (el, visible) => {
      if (!el) return;
      el.setAttribute("visible", visible ? "true" : "false");
      if (el.object3D) el.object3D.visible = !!visible;
    };

    // ===== Step-by-step pin unlock =====
    let currentStep = 0; // Active pin index (0..3)
    const cam = document.getElementById("cam");

    const setActiveStep = (step) => {
      // Shows pins up to the current step and makes only the current hit target raycastable.
      currentStep = Math.max(0, Math.min(3, step));

      // Show pin groups incrementally (0..currentStep).
      pinGroups.forEach((g, i) => setVisible(g, i <= currentStep));

      // Only the active hit target receives the `.pin` class (raycaster targets).
      hitTargets.forEach((h, i) => {
        if (!h) return;
        if (i === currentStep) h.classList.add("pin");
        else h.classList.remove("pin");
      });

      // Refresh raycaster targets after modifying `.pin` classes.
      requestAnimationFrame(() => {
        cam?.components?.raycaster?.refreshObjects?.();
      });
    };

    // Init: show only the first pin.
    setActiveStep(0);

    // Updates the footer progress bar based on completed pins.
    const setProgress = () => {
      const pct = Math.round((clickedPins.size / 4) * 100);
      if (progressBarEl) progressBarEl.style.width = `${pct}%`;
    };

    // Enables/disables the pins footer CTA (kept for accessibility/state control).
    const setBtnEnabled = (enabled) => {
      if (!startBtn) return;
      startBtn.classList.toggle("is-disabled", !enabled);
      startBtn.setAttribute("aria-disabled", String(!enabled));
    };

    // ---- Overlay close handler (bound once) ----
    const closeInfo = () => {
      // Hides overlay; if this was the final pin, triggers transition into Mission 2.
      overlay?.classList.add("hidden");

      // Only after user closed the last pin overlay.
      if (mission1Completed && !mission2Queued) {
        mission2Queued = true;

        // Allow close animation/render, then proceed to next mission.
        setTimeout(() => {
          // Hide Mission 1 pins and disarm hit targets.
          pinGroups.forEach((g) => setVisible(g, false));
          hitTargets.forEach((h) => h?.classList.remove("pin"));
          hideTapGrid();
          setFooterMode("none");

          onAllPinsDone && onAllPinsDone();

          // Safety reset to prevent repeated transitions.
          mission1Completed = false;
        }, 120);
      }
    };

    // Prevent double-binding close handlers across multiple setup calls.
    if (overlay && overlay.dataset.boundClose !== "1") {
      overlay.dataset.boundClose = "1";

      closeBtn?.addEventListener("click", closeInfo);

      // Close when clicking outside the content area (overlay backdrop).
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeInfo();
      });
    }

    // ---- Open overlay by pin index ----
    const openInfoByIndex = (idx) => {
      // Resets idle help and hides the help bar when the user interacts with a pin.
      window.resetMissionHelpIdleTimer?.();
      window.hideMissionHelpBar?.();

      const iconEl = document.getElementById("info-icon");
      const subEl = document.getElementById("info-subtitle");

      const c = pinContent[idx];
      if (!c) return;

      // Block clicking pins out of order.
      if (idx !== currentStep) return;

      // Populate overlay UI from translation keys.
      if (iconEl && c.icon) iconEl.src = c.icon;
      if (subEl) subEl.textContent = t(c.subKey);
      if (textEl) textEl.textContent = t(c.textKey);

      overlay?.classList.remove("hidden");

      // Track completion and update progress only when the pin is newly clicked.
      const before = clickedPins.size;
      clickedPins.add(idx);

      if (clickedPins.size !== before) {
        setProgress();

        // Unlock next pin.
        if (idx < 3) setActiveStep(idx + 1);

        // All done: mark completion and remove footer interaction.
        if (clickedPins.size === 4) {
          mission1Completed = true;
          setFooterMode("none");
        }
      }
    };

    // TapGrid initialization (external helper responsible for emitting "pinselected" events).
    const tg = window.TapGrid?.init({
      scene,
      marker,
      hitTargets,
      getUnlockedStep: () => 4
    });

    // Bind pinselected event only once globally (to avoid duplicate opens).
    if (!window.__mission1PinselectedBound) {
      window.__mission1PinselectedBound = true;
      window.addEventListener("pinselected", (e) => {
        openInfoByIndex(e.detail.index);
      });
    }

    // Initialize progress UI.
    setProgress();      // starts at 0%

    // ---- Hover cursor handling (desktop) ----
    let hoverCount = 0;
    hitTargets.forEach((hit, idx) => {
      if (!hit) return;

      hit.addEventListener("raycaster-intersected", () => {
        // Scale up hovered pin group and show pointer cursor.
        hoverCount++;
        pinGroups[idx]?.setAttribute("scale", "1.06 1.06 1.06");
        if (window.scene?.canvas) window.scene.canvas.style.cursor = "pointer";
      });

      hit.addEventListener("raycaster-intersected-cleared", () => {
        // Restore scale and cursor when no longer hovering any hit target.
        hoverCount = Math.max(0, hoverCount - 1);
        pinGroups[idx]?.setAttribute("scale", "1 1 1");
        if (window.scene?.canvas) window.scene.canvas.style.cursor = hoverCount ? "pointer" : "default";
      });
    });

    const setupCanvasPick = () => {
      // Optional click-to-pick using raycaster's current intersection (useful when cursor events are unreliable).
      const canvas = scene?.canvas;
      if (!canvas || !cam) return;

      // Prevent double-binding.
      if (canvas.dataset.boundPick === "1") return;
      canvas.dataset.boundPick = "1";

      canvas.addEventListener("click", () => {
        const rc = cam.components && cam.components.raycaster;
        if (!rc) return;

        const hitEl = rc.intersectedEls && rc.intersectedEls[0];
        if (!hitEl) return;

        const id = hitEl.getAttribute("id");
        if (!id || !id.startsWith("hit-")) return;

        const idx = parseInt(id.split("-")[1], 10) - 1;
        if (Number.isNaN(idx)) return;

        openInfoByIndex(idx);
      });
    };

    // Defer until scene is loaded so scene.canvas exists.
    if (scene?.hasLoaded) setupCanvasPick();
    else scene?.addEventListener("loaded", setupCanvasPick, { once: true });
  }


function setupMission2Minigame({ goal = 30, durationMs = 5000, onDone } = {}) {
  // Mission 2 tap-minigame:
  // - shows an overlay with a tappable center box and progress bar
  // - runs for a fixed duration with a tap goal
  // - reports success/failure via onDone callback

  // Overlay (progress + tap box)
  const overlay = document.getElementById("minigame-overlay");
  const tapBox = document.getElementById("tap-box");
  const barEl = document.getElementById("minigame-progress-bar");
  const hintEl = document.getElementById("minigame-hint");
  const mgFooterView = document.getElementById("footer-view-minigame");

  // Footer elements
  const statusEl = document.getElementById("mg-status");
  const timeEl = document.getElementById("minigame-time");
  const tapsEl = document.getElementById("mg-taps");
  const goalEl = document.getElementById("mg-goal");
  const startBtn = document.getElementById("mg-start-btn");

  // Countdown overlay (optional)
  const cdWrap = document.getElementById("minigame-countdown");
  const cdNum = document.getElementById("minigame-countdown-number");

  // Abort early if core elements are missing.
  if (!overlay || !tapBox || !barEl || !statusEl || !timeEl || !tapsEl || !goalEl || !startBtn) {
    console.warn("Minigame/Footer Elemente fehlen");
    return;
  }

  overlay.classList.remove("hidden");
  goalEl.textContent = String(goal);

  // ---- Runtime state ----
  let running = false;
  let taps = 0;

  let startTime = 0;
  let rafId = 0;
  let endTimeout = 0;

  // Formats remaining time in seconds.
  const fmt = (ms) => `${(ms / 1000).toFixed(1)}s`;

  // Cancels animation frame and timeout loops.
  const stopLoops = () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
    if (endTimeout) clearTimeout(endTimeout);
    endTimeout = 0;
  };

  // Progress bar color ramp based on completion percentage.
  const setBarColorByPercent = (pct) => {
    if (pct < 30) {
      barEl.style.backgroundColor = "#ef4444"; 
    } else if (pct < 60) {
      barEl.style.backgroundColor = "#f97316"; 
    } else if (pct < 90) {
      barEl.style.backgroundColor = "#EBFF00"; 
    } else {
      barEl.style.backgroundColor = "#22c55e"; 
    }
  };

  // Updates progress bar width and color.
  const setProgress = () => {
    const pct = Math.min(100, Math.round((taps / goal) * 100));
    barEl.style.width = `${pct}%`;
    setBarColorByPercent(pct);
  };

  // Resets the minigame UI/state to its initial (idle) configuration.
  const reset = () => {
    stopLoops();
    running = false;
    taps = 0;

    tapsEl.textContent = "0";
    timeEl.textContent = fmt(durationMs);
    barEl.style.width = "0%";
    barEl.style.backgroundColor = "#ef4444"; 

    // Disable tapping until the round starts.
    tapBox.classList.add("is-disabled");
    if (hintEl) hintEl.textContent = t("mgInstruction");

    // Start button uses aria-label; visible text is intentionally empty.
    startBtn.textContent = "";            // ✅ no text
    startBtn.setAttribute("aria-label", t("mgRetry")); // for screen reader
  };

  // RAF loop that updates the remaining time display while running.
  const tick = () => {
    if (!running) return;

    const now = performance.now();
    const elapsed = now - startTime;
    const remaining = Math.max(0, durationMs - elapsed);

    timeEl.textContent = fmt(remaining);

    if (remaining <= 0) return;
    rafId = requestAnimationFrame(tick);
  };

  // Ends the round, updates UI accordingly, then reports result via onDone.
  const finish = (success) => {
    running = false;
    stopLoops();
    tapBox.classList.add("is-disabled");

    if (success) {
      // Hide mission 2 overlay on success.
      overlay.classList.add("hidden");

      // Reset footer retry UI.
      mgFooterView?.classList.remove("show-retry");
      startBtn.classList.add("hidden");

      // Disable mission help after Mission 2 completes.
      hideMissionHelpButton();
      window.clearMissionHelpIdleTimer?.();
      currentMissionForHelp = "none";
    } else {
      // Show retry button again on failure.
      startBtn.classList.remove("hidden");
      startBtn.textContent = "";
      startBtn.setAttribute("aria-label", t("mgRetry"));
    }

    // Delay callback slightly to allow DOM updates to render.
    setTimeout(() => {
      onDone && onDone({ success, taps, goal });
    }, 150);
  };

  // Starts a new round immediately (without countdown).
  const startRound = () => {
    reset();
    running = true;

    tapBox.classList.remove("is-disabled");
    if (hintEl) hintEl.textContent = t("mgGo");

    startTime = performance.now();
    rafId = requestAnimationFrame(tick);

    // Hard end after duration; success depends on tap count at the end.
    endTimeout = setTimeout(() => {
      if (taps >= goal) finish(true);
      else finish(false);
    }, durationMs);
  };

  // Countdown helper (optional UI) before starting a round.
  const showCountdown = (seconds = 3, cb) => {
    if (!cdWrap || !cdNum) {
      cb && cb();
      return;
    }

    let n = seconds;
    cdWrap.classList.remove("hidden");

    const show = (val) => {
      cdNum.textContent = String(val);
      cdNum.classList.remove("pop");
      void cdNum.offsetWidth;
      cdNum.classList.add("pop");
    };

    show(n);

    const step = () => {
      n -= 1;
      if (n <= 0) {
        show("GO");
        setTimeout(() => {
          cdWrap.classList.add("hidden");
          cb && cb();
        }, 450);
        return;
      }
      show(n);
      setTimeout(step, 850);
    };

    setTimeout(step, 850);
  };

  // Starts the round after showing the countdown overlay.
  const startWithCountdown = () => {
    tapBox.classList.add("is-disabled");
    showCountdown(3, startRound);
  };

  // Registers a single tap during an active round.
  const registerTap = () => {
    // User interaction counts as activity for the help timer.
    window.resetMissionHelpIdleTimer?.();
    window.hideMissionHelpBar?.(); // optional
    if (!running) return;

    taps += 1;
    tapsEl.textContent = String(taps);
    setProgress();

    // Visual feedback animation on the tap box.
    tapBox.classList.remove("pop");
    void tapBox.offsetWidth;
    tapBox.classList.add("pop");

    // Early completion if goal is reached before time ends.
    if (taps >= goal) finish(true);
  };

  // Start/retry button behavior: restart flow with countdown.
  startBtn.onclick = () => {
    if (running) {
      stopLoops();
      // Hard reset UI + restart with countdown.
      reset();
      startWithCountdown();
      return;
    }

    // If not running -> start normally.
    startWithCountdown();

    // Legacy behavior: "WEITER" closes the overlay (kept as-is).
    if (startBtn.textContent === "WEITER") {
      overlay.classList.add("hidden");
      return;
    }
  };

  // Tap input (mouse + touch).
  tapBox.addEventListener("click", registerTap);
  tapBox.addEventListener(
    "touchstart",
    (e) => {
      e.preventDefault();
      registerTap();
    },
    { passive: false }
  );

  // Initialize UI in idle state.
  reset();
}

  // Deny camera permission: return to the start page.
  denyBtn?.addEventListener("click", () => (window.location.href = "index.html"));

  // Allow camera permission: request camera access, then mount and start the AR scene.
  allowBtn?.addEventListener("click", async () => {
    try {
      // Request camera access (environment/back camera preferred).
      // Immediately stop tracks afterwards; AR.js will request its own stream once the scene is created.
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      stream.getTracks().forEach((t) => t.stop());

      // Transition UI from permission overlay to loading state.
      permissionOverlay.classList.add("hidden");
      loadingEl.classList.remove("hidden");

      // Inject AR markup and initialize supporting UI.
      arRoot.innerHTML = createARScene();
      setupMissionHelpButton();

      // Start AR logic when the scene has fully loaded.
      const scene = document.getElementById("ar-scene");
      if (scene?.hasLoaded) initARLogic();
      else scene?.addEventListener("loaded", initARLogic, { once: true });

      // After initial scene boot, hide loading and show the marker guidance overlay.
      setTimeout(() => {
        loadingEl.classList.add("hidden");
        // ✅ show Hinweis ONLY after loading is gone
        showHinweisOverlay({
          title: t("holdToMarkerTitle"),
          sub: t("holdToMarkerText"),
        });
      },1500);

    } catch (err) {
      // If camera permission is denied or fails, inform the user and return.
      alert("Ohne Kamerazugriff kann AR nicht gestartet werden.");
      window.location.href = "index.html";
    }
  });
});