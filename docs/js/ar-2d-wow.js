// ar.js

//====== A-Frame Components ===============
AFRAME.registerComponent("occluder-obj", {
  init: function () {
    const el = this.el;

    const apply = () => {
      el.object3D.traverse((node) => {
        if (!node.isMesh) return;

        // Material klonen, damit wir nichts anderes beeinflussen
        node.material = node.material.clone();

        // Unsichtbar, aber depth schreiben (Occlusion)
        node.material.colorWrite = false;
        node.material.depthWrite = true;
        node.material.depthTest = true;
      });
    };

    // OBJ kommt manchmal async rein -> paar Frames warten
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

let missionStarted = false;

//For language
let currentLang = localStorage.getItem("lang") || "de";

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem("lang", currentLang);
  document.documentElement.lang = currentLang;

  const langBtn = document.getElementById("langBtn");
  if (langBtn) langBtn.textContent = currentLang === "de" ? "EN" : "DE";
}
const i18n = {
  de: {
    
    permissionTitle: "Kamera Erlaubnis",
    permissionText:
      "Für die AR-Darstellung greift diese Anwendung auf die Kamera deines Geräts zu. Das Kamerabild wird nur lokal im Browser verarbeitet und nicht gespeichert.",
    permissionLi1: "Nur zur Erkennung des AR-Markers (z. B. HIRO).",
    permissionLi2: "Keine Übertragung an einen Server.",
    permissionLi3: "Ohne Kamerazugriff kann die Anwendung nicht genutzt werden.",
    denyBtn: "Zurück",
    allowBtn: "Zustimmen & starten",
    loadingText: "Inhalte werden geladen...",
    missionTitle: "MISSION 1",
    missionSub: "Tippe alle Pins an",
    tapHere: "Tippe hier",
    footerMissionBtn: "MISSION ABSCHLIEßEN",
    footerMinigameStatus: "Erreiche das Tap-Ziel!",
    footerStart: "START",
    launchBtn: "RAKETE STARTEN",
    infoCloseAria: "Overlay schließen",
    menuAria: "Menü öffnen",
    mission2Title: "MISSION 2",
    mission2Sub: "Lade die Rakete auf",
    mgReady: "Bereit machen…",
    mgGo: "LOS! Tippe so schnell du kannst!",
    mgRunning: "LÄUFT…",
    mgRetry: "NOCHMAL",
    mgTimeOver: "Zeit vorbei!",
    mgInstruction: "Erreiche das Tap-Ziel bevor die Zeit abläuft.",
    pinLabel1: "MISSION",
    pinLabel2: "NETZWERK",
    pinLabel3: "TEAM & ARBEITSWEISE",
    pinLabel4: "PROJEKTE",
    
    rocketToast: "Rakete ist vollgeladen!",
    missionBannerSub: "Finde alle Infos über die Pins",
    
    btnStartMission2: "MISSION 2 STARTEN",
    
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
    permissionTitle: "Camera Permission",
    permissionText:
      "For the AR experience, this application needs access to your device camera. The camera feed is processed locally in your browser and is not saved.",
    permissionLi1: "Only for detecting the AR marker (e.g., HIRO).",
    permissionLi2: "No data is sent to a server.",
    permissionLi3: "Without camera access, the application cannot be used.",
    denyBtn: "Back",
    allowBtn: "Agree & Start",
    loadingText: "Loading content...",
    missionTitle: "MISSION 1",
    missionSub: "Tap all pins",
    tapHere: "Tap here",
    footerMissionBtn: "COMPLETE MISSION",
    footerMinigameStatus: "Reach the tap goal!",
    footerStart: "START",
    launchBtn: "LAUNCH ROCKET",
    infoCloseAria: "Close overlay",
    menuAria: "Open Menu",
    mission2Title: "MISSION 2",
    mission2Sub: "Charge the rocket",
    mgReady: "Get ready…",
    mgGo: "GO! Tap as fast as you can!",
    mgRunning: "RUNNING…",
    mgRetry: "TRY AGAIN",
    mgTimeOver: "Time is up!",
    mgInstruction: "Reach the tap goal before time runs out.",
    pinLabel1: "MISSION",
    pinLabel2: "NETWORK",
    pinLabel3: "TEAM & METHOD",
    pinLabel4: "PROJECTS",

rocketToast: "Rocket fully charged!",
missionBannerSub: "Find all info via the pins",

btnStartMission2: "START MISSION 2",

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
  return i18n[currentLang][key];
}

function applyTranslations() {
  const permTitle = document.querySelector("#permission-overlay h2");
  const permText = document.querySelector("#permission-overlay p");
  const permLis = document.querySelectorAll("#permission-overlay ul li");

  if (permTitle) permTitle.textContent = t("permissionTitle");
  if (permText) permText.textContent = t("permissionText");

  if (permLis.length >= 3) {
    permLis[0].textContent = t("permissionLi1");
    permLis[1].textContent = t("permissionLi2");
    permLis[2].textContent = t("permissionLi3");
  }

  const denyBtn = document.getElementById("deny-btn");
  const allowBtn = document.getElementById("allow-btn");
  if (denyBtn) denyBtn.textContent = t("denyBtn");
  if (allowBtn) allowBtn.textContent = t("allowBtn");

  const loadingText = document.querySelector(".loading-text");
  if (loadingText) loadingText.textContent = t("loadingText");

  const missionTitle = document.getElementById("mission-title");
  const missionSub = document.getElementById("mission-sub");
  if (missionTitle) missionTitle.textContent = t("missionTitle");
  if (missionSub) missionSub.textContent = t("missionSub");

  const tapBox = document.querySelector("#tap-box .tap-box-text");
  if (tapBox) tapBox.textContent = t("tapHere");

  const footerMissionBtn = document.getElementById("footer-btn-pins");
  if (footerMissionBtn) footerMissionBtn.textContent = t("footerMissionBtn");

  const mgStatus = document.getElementById("mg-status");
  if (mgStatus) mgStatus.textContent = t("footerMinigameStatus");

  const mgStartBtn = document.getElementById("mg-start-btn");
  if (mgStartBtn) mgStartBtn.textContent = t("footerStart");

  const launchBtn = document.getElementById("launch-btn");
  if (launchBtn) launchBtn.textContent = t("launchBtn");

  const infoClose = document.getElementById("info-close");
  if (infoClose) infoClose.setAttribute("aria-label", t("infoCloseAria"));

  const menuToggle = document.querySelector(".menu-toggle");
  if (menuToggle) menuToggle.setAttribute("aria-label", t("menuAria"));
}


document.addEventListener("DOMContentLoaded", () => {

  //language
    setLang(currentLang);
    applyTranslations();

document.getElementById("langBtn")?.addEventListener("click", () => {
  setLang(currentLang === "de" ? "en" : "de");
  applyTranslations();
  applyARTranslations();
});
 //ok


  const permissionOverlay = document.getElementById("permission-overlay");
  const allowBtn = document.getElementById("allow-btn");
  const denyBtn = document.getElementById("deny-btn");
  const loadingEl = document.getElementById("loading");
  const arRoot = document.getElementById("ar-root");
  const arFooter = document.getElementById("ar-footer");

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
      <a-asset-item id="podest-obj" src="sources/3D/Podest.obj"></a-asset-item>
      <a-asset-item id="podest-mtl" src="sources/3D/Podest.mtl"></a-asset-item>
       <video id="rocketDrehVid"
         src="sources/2D/rocket_seq/Rocket_drehen.webm"
         loop
         muted
         playsinline
         webkit-playsinline
         preload="auto"
         crossorigin="anonymous"
        ></video>

        <video id="rocketLaunchVid"
          src="sources/2D/rocket_launch_info/rocket_launch_info.webm"
          muted
          playsinline
          webkit-playsinline
          preload="auto"
          crossorigin="anonymous"             
        ></video>

        <!-- Countdown PNG -->
        <img id="rocketCountdownImg"
            src="sources/2D/rocket_launch_info/rocket_launch_info_00000.png"
            crossorigin="anonymous">

        <video
          id="smokeVid"
          src="sources/2D/rocket_launch_wow/rauch_2d_wow.webm"
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

        
      <a-plane
        position="0 0 0"
        rotation="-90 0 0"
        width="1"
        height="1"
        material="color: red; opacity: 0.25; transparent: true; side: double;"
        shadow="receive: true"
      ></a-plane>

      <a-entity id="podest-rig" position="0 0 0" rotation="0 0 0" scale="0.18 0.18 0.18">
        <a-entity
          id="podest-visible"
          obj-model="obj: url(sources/3D/Podest.obj); mtl: url(sources/3D/podest.mtl)"
          position="0 0 0"
          rotation="0 90 0"
          scale="1 1 1"
        ></a-entity>

        <a-entity
          id="podest-occluder"
          obj-model="obj: url(sources/3D/Podest.obj); mtl: url(sources/3D/podest.mtl)"
          position="0 0 0"
          rotation="0 90 0"
          scale="1 1 1"
          occluder
        ></a-entity>
      </a-entity>


        

        <a-plane
          id="rocket"
          visible="false"
          position="0 -2 0"
          rotation="0 0 0"
          width="2"
          height="9.2"
          material="src: #rocketDrehVid; transparent: true; alphaTest: 0.5; shader: flat; side: double;"
          shadow="cast: true"
        ></a-plane>

        <a-plane
          id="smoke-back"
          visible="false"
          position="0 6 -1"
          rotation="0 0 0"
          width="15"
          height="15"
          material="shader: flat; src: #smokeVid; transparent: true; depthWrite: false; side: double; opacity: 0.85;"
        ></a-plane>

         <a-plane
          id="smoke-middle"
          visible="false"
          position="0 5 0.01"
          rotation="0 0 0"
          width="5"
          height="10"
          material="shader: flat; src: #smokeVid; transparent: true; depthWrite: false; side: double;opacity: 0.85;"
          shadow="cast: true"
        ></a-plane>

        <a-plane
          id="smoke-front"
          visible="false"
          position="0 13 1"
          rotation="0 0 0"
          width="20"
          height="30"
          material="shader: flat; src: #smokeVid; transparent: true; side: double; depthWrite: false; depthTest: false; opacity: 0.85;"
          shadow="cast: true"
         
        ></a-plane>

        <a-entity id="pinGroup-1" visible="false" look-at="[camera]">
        
          <a-box
            id="hit-1"
            class="pin"
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
            value="${t("pinLabel1")}"
            position="0.78 2.015 0.35"
            rotation="0 0 0"
            align="left"
            width="3.5"
            color="#EBFF00"
            side="double"
          ></a-text>

        </a-entity>

        <a-entity id="pinGroup-2" visible="false" look-at="[camera]">

          <!-- HITBOX -->
          <a-plane
            id="hit-2"
            class="pin"
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
            value="${t("pinLabel2")}"
            position="-0.78 1.485 0.35"
            rotation="0 0 0"
            align="right"
            width="3.5"
            color="#EBFF00"
            side="double"
          ></a-text>

        </a-entity>


        <a-entity id="pinGroup-3" visible="false">
        <!-- Hitbox -->
          <a-plane
            id="hit-3"
            class="pin"
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
            value="${t("pinLabel3")}"
            position="0.78 1 0.35"
            rotation="0 0 0"
            align="left"
            width="3.5"
            color="#EBFF00"
            side="double"
          ></a-text>

        </a-entity>
        <a-entity id="pinGroup-4" visible="false" position="0 0.5 0">

          <a-plane
            id="hit-4"
            class="pin"
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
            value="${t("pinLabel4")}"
            position="-0.78 0.015 0.35"
            rotation="0 0 0"
            align="right"
            width="3.5"
            color="#EBFF00"
            side="double"
          ></a-text>

        </a-entity>


        <a-entity
            id="rocket-toast"
            visible="false"
            position="0 1.2 0.15"
            look-at="#cam"
            >
            <!-- Hintergrund-Plane -->
            <a-plane
                width="1.25"
                height="0.28"
                material="color: #12244C; opacity: 0.92; transparent: true; shader: flat; side: double; depthTest: false; depthWrite: false;"
            ></a-plane>

            <!-- Text -->
            <a-text
                value="${t("rocketToast")}"
                align="center"
                width="2.2"
                color="#EBFF00"
                position="0 0 0.01"
            ></a-text>
        </a-entity>

        <!-- Mission Banner (vor der Rakete) -->
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



      <!-- Cursor/Raycaster für Hover mit Maus -->
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

function pad5(n) {
  return String(n).padStart(5, "0");
}

function preloadRocketFrames({ folder, prefix, start, end }) {
  for (let i = start; i <= end; i++) {
    const img = new Image();
    img.src = `${folder}/${prefix}${pad5(i)}.png`;
  }
}

function setFooterMode(mode) {
 const pinsView = document.getElementById("footer-view-pins");
  const mgView = document.getElementById("footer-view-minigame");
  const launchView = document.getElementById("footer-view-launch");

  [pinsView, mgView, launchView].forEach((v) => v?.classList.add("hidden"));

  if (mode === "minigame") mgView?.classList.remove("hidden");
  else if (mode === "launch") launchView?.classList.remove("hidden");
  else pinsView?.classList.remove("hidden");
}

function showARRocketToast(ms = 1600) {
  const toast = document.getElementById("rocket-toast");
  if (!toast) return;

  toast.setAttribute("visible", "true");

  // optional: kleines Pop
  toast.setAttribute("scale", "0.9 0.9 0.9");
  toast.setAttribute("animation__pop", "property: scale; dur: 220; easing: easeOutBack; to: 1 1 1");

  setTimeout(() => {
    toast.setAttribute("visible", "false");
  }, ms);
}

function showMissionScreen({ title, sub, durationMs = 2600, onDone }) {
  const overlay = document.getElementById("mission-overlay");
  const wrap = document.getElementById("mission-wrap");
  const t = document.getElementById("mission-title");
  const s = document.getElementById("mission-sub");

  if (!overlay || !wrap || !t || !s) {
    onDone && onDone();
    return;
  }

  t.textContent = title;
  s.textContent = sub;

  overlay.classList.remove("hidden");

  // Animation neu triggern
  wrap.classList.remove("mission-anim");
  void wrap.offsetWidth;
  wrap.classList.add("mission-anim");

  // nach Animation ausblenden + callback
  setTimeout(() => {
    overlay.classList.add("hidden");
    wrap.classList.remove("mission-anim");
    onDone && onDone();
  }, durationMs);
}

function fitPodestToRealDims(el, { height = 0.95, diameter = 1.8 } = {}) {
  const obj = el.getObject3D("mesh");
  if (!obj) return;

  // Reset, damit wir nicht "aufaddieren"
  el.object3D.position.set(0, 0, 0);
  el.object3D.scale.set(1, 1, 1);
  el.object3D.updateMatrixWorld(true);

  // World bbox
  let box = new THREE.Box3().setFromObject(obj);
  let size = new THREE.Vector3();
  box.getSize(size);

  if (size.y <= 0) return;

  // Scale so, dass Höhe passt
  const sH = height / size.y;

  // Scale so, dass Durchmesser (max x/z) passt
  const base = Math.max(size.x, size.z);
  const sD = base > 0 ? (diameter / base) : sH;

  // Nimm den größeren der beiden Faktoren (damit es nicht zu klein wird)
  const s = Math.max(sH, sD);
  el.object3D.scale.multiplyScalar(s);

  // Neu berechnen nach scaling
  el.object3D.updateMatrixWorld(true);
  box = new THREE.Box3().setFromObject(obj);

  const parent = el.object3D.parent;
  if (!parent) return;

  // Center & top in parent-local
  const centerW = box.getCenter(new THREE.Vector3());
  const centerP = parent.worldToLocal(centerW.clone());

  const topW = new THREE.Vector3(centerW.x, box.max.y, centerW.z);
  const topP = parent.worldToLocal(topW.clone());

  // Zentrieren + TOP auf Marker-Ebene (y=0)
  el.object3D.position.x -= centerP.x;
  el.object3D.position.z -= centerP.z;
  el.object3D.position.y -= topP.y;

  el.object3D.updateMatrixWorld(true);
}


function applyARTranslations() {
  const setAValue = (id, txt) => {
    const el = document.getElementById(id);
    if (el) el.setAttribute("value", txt);
  };

  // pin labels
  setAValue("pinLabel-1", t("pinLabel1"));
  setAValue("pinLabel-2", t("pinLabel2"));
  setAValue("pinLabel-3", t("pinLabel3"));
  setAValue("pinLabel-4", t("pinLabel4"));

  // toast + banner
  setAValue("rocket-toast-text", t("rocketToast"));
  setAValue("mission-banner-sub", t("missionBannerSub"));
}



// ------------------------------------------------------------------------------------------
// Init Logik
// ------------------------------------------------------------------------------------------

  function initARLogic() {
     
    const scene = document.getElementById("ar-scene");
    const marker = document.getElementById("marker-hiro");
    const rocket = document.getElementById("rocket");
    const label = document.getElementById("rocket-label");
    const hint = document.getElementById("hint");
    const arRoot = document.getElementById("ar-root");
    const podestVisible = document.getElementById("podest-visible");
    const podestOcc = document.getElementById("podest-occluder");

    // --- Rocket media assets aus <a-assets> ---
    const rocketIdleVid   = document.getElementById("rocketDrehVid");
    const rocketLaunchVid = document.getElementById("rocketLaunchVid");
    const rocketCountdownImg = document.getElementById("rocketCountdownImg");
    //const smokeVid = document.getElementById("smokeVid");  
    const vid = document.getElementById("smokeVid");
    const launchVid = document.getElementById("RocketLaunchVid")

    let vidsUnlocked = false;

    // Beginn Animation
    const ROCKET_IN_POS  = "0 -2 0";  // im Podest (Start)
    const ROCKET_OUT_POS = "0 4.2 0";  // oben raus (Ziel)

    const revealRocketFromPodest = () => {
      if (!rocket) return;

      // sicherstellen, dass sie erstmal "drin" steht
      rocket.setAttribute("position", ROCKET_IN_POS);

      // falls schon mal animiert wurde: reset
      rocket.removeAttribute("animation__rise");
      rocket.removeAttribute("animation__pop");

      // optional: kleiner Pop über Scale
      rocket.setAttribute("scale", "0.95 0.95 0.95");
      rocket.setAttribute(
        "animation__pop",
        "property: scale; dur: 260; easing: easeOutBack; to: 1 1 1"
      );

      // “rausfahren”
      rocket.setAttribute(
        "animation__rise",
        `property: position; dur: 5000; easing: easeOutCubic; to: ${ROCKET_OUT_POS}`
      );
    };

//=========================================
    // PIN GROUPS 
    //=====================================
    
    const enablePinsAndTapGrid = () => {
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

  // Pins sichtbar machen (z.B. nur den ersten, wenn du unlock-st)
  pinGroups.forEach((g, i) => {
    if (!g) return;
    g.setAttribute("visible", i === 0 ? "true" : "false");
    if (g.object3D) g.object3D.visible = (i === 0);
  });

  // HitTargets klickbar machen (Raycaster targets)
  hitTargets.forEach((h) => h?.classList.add("pin"));

  // TapGrid einschalten (falls du es nutzt)
  const gridEl = document.getElementById("tapGrid");
  if (gridEl) {
    gridEl.style.display = "";
    gridEl.style.pointerEvents = "auto";
  }
};


    const hidePinsAndDisableHit = () => {
  // PinGroups verstecken
  ["1","2","3","4"].forEach(n => {
    const g = document.getElementById(`pinGroup-${n}`);
    if (!g) return;
    g.setAttribute("visible", "false");
    if (g.object3D) g.object3D.visible = false;
  });

  // HitTargets aus Raycaster raus
  ["1","2","3","4"].forEach(n => {
    document.getElementById(`hit-${n}`)?.classList.remove("pin");
  });

  // TapGrid deaktivieren
  const gridEl = document.getElementById("tapGrid");
  if (gridEl) {
    gridEl.style.pointerEvents = "none";
    gridEl.style.display = "none";
  }
};



    // Helper: plane material src wechseln
    const setRocketSrc = (selector) => {
      if (!rocket) return;
      rocket.setAttribute("material", "shader", "flat");
      rocket.setAttribute("material", "transparent", true);
      rocket.setAttribute("material", "side", "double");
      rocket.setAttribute("material", "src", selector);
    };

    const safePlay = async (vid) => {
      if (!vid) return;
      try { await vid.play(); } catch(e) {}
    };

    // Zustände:
    const showIdleLoop = async () => {
      setRocketSrc("#rocketDrehVid");
      if (rocketLaunchVid) {
         rocketLaunchVid.pause(); 
         rocketIdleVid.playbackRate = 0.5; 
         rocketLaunchVid.currentTime = 0; }
      if (rocketIdleVid)   { rocketIdleVid.currentTime = 0; await safePlay(rocketIdleVid); }
    };

    const showCountdownPNG = () => {
      rocketIdleVid?.pause();
      rocketLaunchVid?.pause();
      if (rocketIdleVid) rocketIdleVid.currentTime = 0;
      if (rocketLaunchVid) rocketLaunchVid.currentTime = 0;
      setRocketSrc("#rocketCountdownImg");
    };

    const playLaunchOnce = async (onDone) => {
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
      if (!vid) return;
      try {
        // muss muted sein, sonst blocken viele Browser
        vid.muted = true;
        vid.playsInline = true;

        // kurzer Play->Pause “Unlock”
        const p = vid.play();
        if (p && typeof p.then === "function") await p;
        vid.pause();
        vid.currentTime = 0;
      } catch (e) {
        console.warn("unlockVid blocked:", e);
      }
    };

    const unlockAllVidsOnce = async () => {
      if (vidsUnlocked) return;
      vidsUnlocked = true;
      await unlockVid(vid);
      await unlockVid(launchVid); // optional (nur wenn playLaunchOnce ein Video ist)
    };

    // -----------------------------
    // Smoke Play
    // -----------------------------
  function playSmokeAll({ durationMs = 3000 } = {}) {
  
  const front = document.getElementById("smoke-front");
  const mid = document.getElementById("smoke-middle");
  const back = document.getElementById("smoke-back");

  console.log("🔥 playSmokeAll", { vid: !!vid, front: !!front, mid: !!mid, back: !!back });
  if (!vid || !front || !mid || !back) return;

  // Planes sichtbar
  [front, mid, back].forEach((p) => {
    p.setAttribute("visible", "true");
    if (p.object3D) p.object3D.visible = true;
  });

  // Video reset + play
  try { vid.pause(); } catch {}
  try { vid.currentTime = 0; } catch {}
  vid.muted = true;

  const p = vid.play();
  if (p?.catch) p.catch((e) => console.warn("❌ smoke play blocked:", e));

  // nach Dauer wieder aus
  window.setTimeout(() => {
    [front, mid, back].forEach((p) => {
      p.setAttribute("visible", "false");
      if (p.object3D) p.object3D.visible = false;
    });
  }, durationMs);
}


    //Podest laden
    podestVisible?.addEventListener("model-loaded", () => {
      fitPodestToRealDims(podestVisible, { height: 0.95, diameter: 1.8 });
    });

    podestOcc?.addEventListener("model-loaded", () => {
      fitPodestToRealDims(podestOcc, { height: 0.95, diameter: 1.8 });
    });

    if (podestVisible) {
      podestVisible.addEventListener("model-loaded", () => console.log("✅ Podest geladen"));
      podestVisible.addEventListener("model-error", (e) => console.log("❌ Podest Fehler", e.detail));
    }
    // -------------------------------------------------------
    // FIX "GEQUETSCHT": Video + Canvas identisch als COVER fitten
    // (keine Verzerrung, keine Ränder, kann cropen -> ok)
    // -------------------------------------------------------
    const syncARCover = () => {
      const vv = window.visualViewport;
      const vw = vv ? vv.width : window.innerWidth;
      const vh = vv ? vv.height : window.innerHeight;
      const vLeft = vv ? vv.offsetLeft : 0;
      const vTop  = vv ? vv.offsetTop  : 0;

      const video = document.getElementById("arjs-video") || document.querySelector("video");
      const canvasWrap = document.querySelector(".a-canvas");
      const canvas = scene?.renderer?.domElement || document.querySelector("canvas");

      if (!video || !canvas) return false;
      if (!video.videoWidth || !video.videoHeight) return false;

      const vidW = video.videoWidth;
      const vidH = video.videoHeight;

      // COVER: max -> füllt Viewport komplett, crop ok
      const scale = Math.max(vw / vidW, vh / vidH);
      const boxW = Math.round(vidW * scale);
      const boxH = Math.round(vidH * scale);

      const left = Math.round(vLeft + (vw - boxW) / 2);
      const top  = Math.round(vTop  + (vh - boxH) / 2);

      // gleiche Box auf Video + Canvas (+ optional .a-canvas wrapper)
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

      // AR.js resize pipeline (wichtig!)
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

    // Starten wenn Video ready ist
    const startARCoverSync = () => {
      let tries = 0;
      const t = setInterval(() => {
        tries++;
        if (syncARCover() || tries > 120) clearInterval(t);
      }, 50);
    };

    if (scene.hasLoaded) startARCoverSync();
    else scene.addEventListener("loaded", startARCoverSync, { once: true });

    window.addEventListener("resize", () => setTimeout(syncARCover, 80));
    window.addEventListener("orientationchange", () => setTimeout(syncARCover, 250));

    // ----------------------------
    // Mission Banner (AR Plane)
    // ----------------------------
    const showMissionBanner = (title, sub, ms = 1500) => {
        const banner = document.getElementById("mission-banner");
        const t = document.getElementById("mission-banner-title");
        const s = document.getElementById("mission-banner-sub");
        if (!banner || !t || !s) return;

        t.setAttribute("value", title);
        s.setAttribute("value", sub);

        banner.setAttribute("visible", "true");
        banner.setAttribute("scale", "0.9 0.9 0.9");
        banner.setAttribute(
        "animation__pop",
        "property: scale; dur: 220; easing: easeOutBack; to: 1 1 1"
        );

        setTimeout(() => banner.setAttribute("visible", "false"), ms);
    };

  
    if (!scene || !marker || !rocket) return;
    const isGltfRocket = !!rocket.getAttribute("gltf-model");

    // -------------------------------------------------------
    // Aspect Fix
    // -------------------------------------------------------
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
    // ANDROID FIX: Touch -> MouseEvents MIT KOORDINATEN
    // -------------------------------------------------------
    const enableTouchToMouseWithCoords = () => {
        const canvas = scene.canvas;
        if (!canvas) return;

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

    if (scene.hasLoaded) enableTouchToMouseWithCoords();
    else scene.addEventListener("loaded", enableTouchToMouseWithCoords, { once: true });

    // -------------------------------------------------------
    // Mission Flow
    // -------------------------------------------------------
    let mission1Started = false;
    let mission2Started = false;

    const startMission2 = () => {
        if (mission2Started) return;
        mission2Started = true;

        //showMissionBanner("MISSION 2", "Lade die Rakete auf");
        setFooterMode("minigame");

        

        showMissionScreen({
          title: t("mission2Title"),
          sub: t("mission2Sub"),
            durationMs: 2600,
            onDone: () => {
                setupMission2Minigame({
                    goal: 30,
                    durationMs: 5000,
                    onDone: ({ success }) => {
                        if (success) {
                        if (typeof showARRocketToast === "function") showARRocketToast(1600);
                        setFooterMode("launch");
                        } else {
                        setFooterMode("minigame");
                        }
                    },
                });
            },
        });
    }

    /*------------------------------------- 
COUNTDOWN
---------------------------------------*/

const countdownOverlay = document.getElementById("countdown-overlay");
const countdownNumber = document.getElementById("countdown-number");

const startCountdown = (seconds = 3, onDone) => {
  if (!countdownOverlay || !countdownNumber) return;

  const STEP_DURATION = 1100; 
  const END_DURATION = 800;

  let n = seconds;

  const showNumber = (val) => {
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



    // Rocket launch
    const launchBtn = document.getElementById("launch-btn");

    // Launch Button (wenn Mission 2 geschafft)
    const launchRocket = async () => {
      // 1) Countdown-Phase: PNG anzeigen
      showCountdownPNG();
      ;

      startCountdown(3, () => {

        playSmokeAll({ durationMs: 5000 });
        playLaunchOnce(() => {
        window.location.href = "mehrErfahren.html";
        });
      });
    };


    // -------------------------------------------------------
    // Marker Verhalten
    // -------------------------------------------------------
      marker.addEventListener("markerFound", () => {
        rocket.setAttribute("visible", "true");
        label?.setAttribute("visible", "true");
        hint?.setAttribute("visible", "false");

        loadingEl.classList.add("hidden");
        arFooter.classList.remove("hidden");

        showIdleLoop();
        
        
        // ✅ Mission 1 zuerst starten (nur einmal)
        if (!mission1Started) {
          mission1Started = true;

          setFooterMode("pins");

          showMissionScreen({
            title: "MISSION 1",
            sub: t("missionSub"),


              durationMs: 2600,
              onDone: () => {
                
                showIdleLoop();              
                revealRocketFromPodest();  
                playSmokeAll({ durationMs: 5000 });

                  // Wenn Rocket fertig “raus” -> Pins an
                  //rocket.addEventListener("animationcomplete__rise", enablePinsAndTapGrid, { once: true });

                setupMission1Pins({
                  onAllPinsDone: () => {
                    if (!isGltfRocket) showIdleLoop(); ;
                    startMission2();

                    launchBtn?.addEventListener("click", async (e) => {
                      e.preventDefault();

                      // ✅ unlock einmalig bei erstem Klick
                      await unlockAllVidsOnce();

                      launchRocket();
                      playSmokeAll({ durationMs: 5000 });
                    });
                  },
                });
              },
          });
        }
      });

      marker.addEventListener("markerLost", () => {
              
        rocket.setAttribute("visible", "false");
        label?.setAttribute("visible", "false");
        hint?.setAttribute("visible", "true");

        rocketIdleVid?.pause();
        rocketLaunchVid?.pause();
      });
    
    }



  //------------------------------------------------------------------------------------ 
  //                                   MISSIONS 
  //  ----------------------------------------------------------------------------------

  function setupMission1Pins({ onAllPinsDone }) {
  // ---- Overlay Elemente GANZ OBEN (kein TDZ/Hoisting Stress) ----
  const overlay = document.getElementById("info-overlay");
  const titleEl = document.getElementById("info-title");
  const textEl = document.getElementById("info-text2");
  const closeBtn = document.getElementById("info-close");
  const scene = document.getElementById("ar-scene");
  const marker = document.getElementById("marker-hiro");

  // ---- Pins / HitTargets ----
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

  // ---- Footer Elemente (WICHTIG: nur Pins-View Button!) ----
  const progressBarEl = document.querySelector("#ar-footer .footer-progress-bar");
  const startBtn = document.querySelector("#footer-view-pins .footer-cta"); // << wichtig!

  // ---- State ----
  const clickedPins = new Set(); // 0..3


  const pinContent = [
  { icon: "sources/icons/Icon_Mission.png", sub: t("pinSub1"), text: t("pinText1") },
  { icon: "sources/icons/Icon_Netzwerk.png", sub: t("pinSub2"), text: t("pinText2") },
  { icon: "sources/icons/Icon_Team.png", sub: t("pinSub3"), text: t("pinText3") },
  { icon: "sources/icons/Icon_Projekt.png", sub: t("pinSub4"), text: t("pinText4") },
];


  const setVisible = (el, visible) => {
    if (!el) return;
    el.setAttribute("visible", visible ? "true" : "false");
    if (el.object3D) el.object3D.visible = !!visible;
  };

  const setProgress = () => {
    const pct = Math.round((clickedPins.size / 4) * 100);
    if (progressBarEl) progressBarEl.style.width = `${pct}%`;
  };

  const setBtnEnabled = (enabled) => {
    if (!startBtn) return;
    startBtn.classList.toggle("is-disabled", !enabled);
    startBtn.setAttribute("aria-disabled", String(!enabled));
  };

  // ---- Overlay close (nur 1x binden) ----
  const closeInfo = () => overlay?.classList.add("hidden");

  if (overlay && overlay.dataset.boundClose !== "1") {
    overlay.dataset.boundClose = "1";
    closeBtn?.addEventListener("click", closeInfo);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeInfo();
    });
  }

  // ---- Öffnen ----
  const openInfoByIndex = (idx) => {
        const iconEl = document.getElementById("info-icon");
        const subEl = document.getElementById("info-subtitle");

        const c = pinContent[idx];
        if (!c) return;

        if (iconEl && c.icon) iconEl.src = c.icon;
        if (subEl) subEl.textContent = c.sub;
        if (textEl) textEl.textContent = c.text;

        overlay?.classList.remove("hidden");

        // ✅ Fortschritt updaten + Button freischalten
        const before = clickedPins.size;
        clickedPins.add(idx);

        if (clickedPins.size !== before) {
            setProgress();
            if (clickedPins.size === 4) {
                setBtnEnabled(true);
            }
        }
     };

  // TapGrid initialisieren 
  const tg = window.TapGrid?.init({
    scene,
    marker,
    hitTargets,
    getUnlockedStep: () => 4
  });

  if (!window.__mission1PinselectedBound) {
    window.__mission1PinselectedBound = true;
    window.addEventListener("pinselected", (e) => {
      openInfoByIndex(e.detail.index);
  });
}
// ---- Mission 1 Initialisierung: ALLES sichtbar + klickbar ----
  pinGroups.forEach((g) => setVisible(g, true));
   hitTargets.forEach((h) => h?.classList.add("pin")); // wichtig für raycaster="objects: .pin"

  if (startBtn) startBtn.textContent = "MISSION 2 STARTEN";
  setProgress();      // startet bei 0%
  setBtnEnabled(false);

  // ---- Hover Cursor (optional, bleibt wie bei dir) ----
  let hoverCount = 0;
  hitTargets.forEach((hit, idx) => {
    if (!hit) return;

    hit.addEventListener("raycaster-intersected", () => {
      hoverCount++;
      pinGroups[idx]?.setAttribute("scale", "1.06 1.06 1.06");
      if (window.scene?.canvas) window.scene.canvas.style.cursor = "pointer";
    });

    hit.addEventListener("raycaster-intersected-cleared", () => {
      hoverCount = Math.max(0, hoverCount - 1);
      pinGroups[idx]?.setAttribute("scale", "1 1 1");
      if (window.scene?.canvas) window.scene.canvas.style.cursor = hoverCount ? "pointer" : "default";
    });
  });

  // ---- ✅ Zuverlässiger Pick: Canvas click + Raycaster intersectedEls ----
  
  const cam = document.getElementById("cam");

  const setupCanvasPick = () => {
    const canvas = scene?.canvas;
    if (!canvas || !cam) return;

    // verhindert doppeltes Binden
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

  if (scene?.hasLoaded) setupCanvasPick();
  else scene?.addEventListener("loaded", setupCanvasPick, { once: true });

  // ---- Button: Mission 2 starten ----
  startBtn?.addEventListener("click", (e) => {
    if (clickedPins.size < 4) {
      e.preventDefault();
      return;
    }

    // Mission 1 schließen
    pinGroups.forEach((g) => setVisible(g, false));
    hitTargets.forEach((h) => h?.classList.remove("pin"));
    overlay?.classList.add("hidden");

    onAllPinsDone && onAllPinsDone();
  });
}



function setupMission2Minigame({ goal = 30, durationMs = 5000, onDone } = {}) {
  // Overlay (Progress + Tapbox in der Mitte)
  const overlay = document.getElementById("minigame-overlay");
  const tapBox = document.getElementById("tap-box");
  const barEl = document.getElementById("minigame-progress-bar");

  // Footer Elements
  const statusEl = document.getElementById("mg-status");
  const timeEl = document.getElementById("minigame-time");
  const tapsEl = document.getElementById("mg-taps");
  const goalEl = document.getElementById("mg-goal");
  const startBtn = document.getElementById("mg-start-btn");

  // Countdown overlay (optional)
  const cdWrap = document.getElementById("minigame-countdown");
  const cdNum = document.getElementById("minigame-countdown-number");

  if (!overlay || !tapBox || !barEl || !statusEl || !timeEl || !tapsEl || !goalEl || !startBtn) {
    console.warn("Minigame/Footer Elemente fehlen");
    return;
  }

  overlay.classList.remove("hidden");
  goalEl.textContent = String(goal);

  let running = false;
  let taps = 0;

  let startTime = 0;
  let rafId = 0;
  let endTimeout = 0;

  const fmt = (ms) => `${(ms / 1000).toFixed(1)}s`;

  const stopLoops = () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
    if (endTimeout) clearTimeout(endTimeout);
    endTimeout = 0;
  };

  //Progressbar Farbwechsel
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

  const setProgress = () => {
    const pct = Math.min(100, Math.round((taps / goal) * 100));
    barEl.style.width = `${pct}%`;
    setBarColorByPercent(pct);
  };


  // reset
  const reset = () => {
    stopLoops();
    running = false;
    taps = 0;

    tapsEl.textContent = "0";
    timeEl.textContent = fmt(durationMs);
    barEl.style.width = "0%";
    barEl.style.backgroundColor = "#ef4444"; 


    tapBox.classList.add("is-disabled");
    statusEl.textContent = t("mgInstruction");

    startBtn.textContent = t("footerStart");

  };

  const tick = () => {
    if (!running) return;

    const now = performance.now();
    const elapsed = now - startTime;
    const remaining = Math.max(0, durationMs - elapsed);

    timeEl.textContent = fmt(remaining);

    if (remaining <= 0) return;
    rafId = requestAnimationFrame(tick);
  };

  const finish = (success) => {
    running = false;
    stopLoops();
    tapBox.classList.add("is-disabled");

    if (success) {
        showARRocketToast(1600);
        barEl.style.width = "100%";
        setFooterMode("launch");

        overlay.classList.add("hidden");
    } else {
     statusEl.textContent = `${t("mgTimeOver")} ${taps}/${goal} taps 😅`;
     startBtn.textContent = t("mgRetry");
    }

    setTimeout(() => {
      onDone && onDone({ success, taps, goal });
    }, 150);
  };

  const startRound = () => {
    reset();
    running = true;

    tapBox.classList.remove("is-disabled");
    statusEl.textContent = t("mgGo");
    startBtn.textContent = t("mgRunning");


    startTime = performance.now();
    rafId = requestAnimationFrame(tick);

    endTimeout = setTimeout(() => {
      if (taps >= goal) finish(true);
      else finish(false);
    }, durationMs);
  };

  // Countdown helper
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

  const startWithCountdown = () => {
    tapBox.classList.add("is-disabled");
    statusEl.textContent = t("mgReady");
    startBtn.textContent = "…";
    showCountdown(3, startRound);
  };

  const registerTap = () => {
    if (!running) return;

    taps += 1;
    tapsEl.textContent = String(taps);
    setProgress();

    tapBox.classList.remove("pop");
    void tapBox.offsetWidth;
    tapBox.classList.add("pop");

    if (taps >= goal) finish(true);
  };

  startBtn.onclick = () => {
    if (running) return;

   

    startWithCountdown();
  };

  tapBox.addEventListener("click", registerTap);
  tapBox.addEventListener(
    "touchstart",
    (e) => {
      e.preventDefault();
      registerTap();
    },
    { passive: false }
  );

  reset();
}



  //------------------------------------------------------------------------------------ 
  //                                   Buttons 
  //  ----------------------------------------------------------------------------------
  denyBtn?.addEventListener("click", () => (window.location.href = "index.html"));

  allowBtn?.addEventListener("click", async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      stream.getTracks().forEach((t) => t.stop());

      permissionOverlay.classList.add("hidden");
      loadingEl.classList.remove("hidden");

      arRoot.innerHTML = createARScene();

      const scene = document.getElementById("ar-scene");
      if (scene?.hasLoaded) initARLogic();
      else scene?.addEventListener("loaded", initARLogic, { once: true });

      setTimeout(() => loadingEl.classList.add("hidden"), 5000);
    } catch (err) {
      alert("Ohne Kamerazugriff kann AR nicht gestartet werden.");
      window.location.href = "index.html";
    }
  });
});
