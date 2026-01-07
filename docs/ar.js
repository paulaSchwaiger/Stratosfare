// ar.js

document.addEventListener("DOMContentLoaded", () => {
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
      renderer="antialias: true; alpha: true"
      arjs="sourceType: webcam; facingMode: environment; debugUIEnabled: false;"
    >
      <a-marker id="marker-hiro" preset="hiro">

        <a-plane
          id="rocket"
          visible="false"
          position="0 0 0"
          rotation="0 0 0"
          width="1.2"
          height="3"
          material="src: url(sources/Rakete_00.png); transparent: true;"
        ></a-plane>

        <a-entity id="pinGroup-1" visible="true">
        <!-- Hitbox -->
          <a-plane
            id="hit-1"
            class="pin"
            position="0.62 2 0.35"
            rotation="0 0 0"
            width="0.75"
            height="0.18"
            material="opacity: 0.001; transparent: true; side: double; depthWrite: false;"
          ></a-plane>

          <!-- Pin -->
          <a-sphere
            id="pin-1"
            class="pin"
            position="0.35 2 0.35"
            radius="0.06"
            material="color: #EBFF00; emissive: #EBFF00; emissiveIntensity: 0.9;"
          ></a-sphere>

          <!-- Linie -->
          <a-plane
            position="0.57 2 0.35"
            rotation="-90 0 0"
            width="0.39"
            height="0.01"
            material="color: #EBFF00; emissive: #EBFF00; emissiveIntensity: 0.7; shader: flat; side: double;"
            look-at="[camera]"
          ></a-plane>

          <!-- Titel -->
          <a-text
            value="MISSION"
            position="0.78 2 0.35"
            rotation="0 0 0"
            align="left"
            width="3.5"
            color="#EBFF00"
            side="double"
          ></a-text>

        </a-entity>

        <a-entity id="pinGroup-2" visible="false">

          <!-- HITBOX -->
          <a-plane
            id="hit-2"
            class="pin"
            position="-0.62 0.7 -0.25"
            rotation="-90 0 0"
            width="0.75"
            height="0.18"
            material="opacity: 0.001; transparent: true; side: double; depthWrite: false;"
          ></a-plane>

          <!-- PIN -->
          <a-sphere
            id="pin-2"
            position="-0.35 0.7 -0.25"
            radius="0.04"
            material="color: #EBFF00; emissive: #EBFF00; emissiveIntensity: 0.9;"
          ></a-sphere>

          <!-- LINIE -->
          <a-plane
            position="-0.57 0.7 -0.25"
            rotation="-90 0 0"
            width="0.37"
            height="0.01"
            material="color: #EBFF00; emissive: #EBFF00; emissiveIntensity: 0.7; shader: flat;"
          ></a-plane>

          <!-- TITEL -->
          <a-text
            value="GESCH\u00c4FTSMODELL"
            position="-0.78 0.7 -0.25"
            rotation="-90 0 0"
            align="right"
            width="2.2"
            color="#EBFF00"
          ></a-text>

        </a-entity>

        <a-entity id="pinGroup-3" visible="true">
        <!-- Hitbox -->
          <a-plane
            id="hit-3"
            class="pin"
            position="0.62 0.7 0"
            rotation="-90 0 0"
            width="0.75"
            height="0.18"
            material="opacity: 0; transparent: true; side: double; depthWrite: false;"
          ></a-plane>

          <!-- Pin -->
          <a-sphere
            id="pin-3"
            class="pin"
            position="0.35 0.7 0"
            radius="0.04"
            material="color: #EBFF00; emissive: #EBFF00; emissiveIntensity: 0.9;"
          ></a-sphere>

          <!-- Linie -->
          <a-plane
            position="0.57 0.7 0"
            rotation="-90 0 0"
            width="0.37"
            height="0.01"
            material="color: #EBFF00; emissive: #EBFF00; emissiveIntensity: 0.7; shader: flat;"
          ></a-plane>

          <!-- Titel -->
          <a-text
            value="TEAM & ARBEITSWEISE"
            position="0.78 0.7 0"
            rotation="-90 0 0"
            align="left"
            width="1.8"
            color="#EBFF00"
          ></a-text>

        </a-entity>

        <a-entity id="pinGroup-4" visible="false">

          <!-- HITBOX -->
          <a-plane
            id="hit-4"
            class="pin"
            position="-0.62 0.7 0.25"
            rotation="-90 0 0"
            width="0.75"
            height="0.18"
            material="opacity: 0.001; transparent: true; side: double; depthWrite: false;"
          ></a-plane>

          <!-- PIN -->
          <a-sphere
            id="pin-4"
            position="-0.35 0.7 0.25"
            radius="0.04"
            material="color: #EBFF00; emissive: #EBFF00; emissiveIntensity: 0.9;"
          ></a-sphere>

          <!-- LINIE -->
          <a-plane
            position="-0.57 0.7 0.25"
            rotation="-90 0 0"
            width="0.37"
            height="0.01"
            material="color: #EBFF00; emissive: #EBFF00; emissiveIntensity: 0.7; shader: flat;"
          ></a-plane>

          <!-- TITEL -->
          <a-text
            value="PROJEKTE"
            position="-0.78 0.7 0.25"
            rotation="-90 0 0"
            align="right"
            width="2.2"
            color="#EBFF00"
          ></a-text>

        </a-entity>


      </a-marker>

      <!-- Cursor/Raycaster für Hover mit Maus -->
     <a-entity
        id="cam"
        camera
        cursor="rayOrigin: mouse; fuse: false"
        raycaster="objects: .pin; far: 20"
      ></a-entity>

    </a-scene>
  `;
}


  function initARLogic() {
  const scene = document.getElementById("ar-scene");
  const marker = document.getElementById("marker-hiro");
  const rocket = document.getElementById("rocket");
  const label = document.getElementById("rocket-label");
  const hint = document.getElementById("hint");

const arRoot = document.getElementById("ar-root");

const fixARAspect = () => {
  if (!scene || !arRoot) return;

  const w = arRoot.clientWidth;
  const h = arRoot.clientHeight;
  if (!w || !h) return;

  // Renderer auf Containergröße setzen
  if (scene.renderer) scene.renderer.setSize(w, h, false);

  // Kamera-Aspect anpassen
  if (scene.camera) {
    scene.camera.aspect = w / h;
    scene.camera.updateProjectionMatrix();
  }
};

// Sobald die Scene wirklich bereit ist
if (scene.hasLoaded) {
  fixARAspect();
} else {
  scene.addEventListener("loaded", fixARAspect, { once: true });
}

// Bei Resize / Orientation nochmal korrigieren
window.addEventListener("resize", fixARAspect);
window.addEventListener("orientationchange", () => setTimeout(fixARAspect, 250));



  if (!scene || !marker || !rocket) return;

  // -------------------------------------------------------
  // ANDROID FIX: Touch -> MouseEvents MIT KOORDINATEN
  // (rayOrigin: mouse braucht clientX/clientY!)
  // -------------------------------------------------------
  const enableTouchToMouseWithCoords = () => {
    const canvas = scene.canvas;
    if (!canvas) return;

    // Canvas muss wirklich interaktiv sein
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
        // wichtig: mousemove setzen, damit A-Frame weiß "wo" der Cursor ist
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

  // Canvas existiert erst nach "loaded"
  if (scene.hasLoaded) enableTouchToMouseWithCoords();
  else scene.addEventListener("loaded", enableTouchToMouseWithCoords, { once: true });

  // -----------------------------------------------------
  // Marker Verhalten
  // -----------------------------------------------------
  marker.addEventListener("markerFound", () => {
    rocket.setAttribute("visible", "true");
    label?.setAttribute("visible", "true");
    hint?.setAttribute("visible", "false");

    // Bewegung erst jetzt starten (optional)
    rocket.setAttribute(
      "animation",
      "property: position; dir: alternate; dur: 2000; easing: easeInOutSine; loop: true; to: 0 0.7 0"
    );

    loadingEl.classList.add("hidden");
    arFooter.classList.remove("hidden");
  });

  marker.addEventListener("markerLost", () => {
    rocket.setAttribute("visible", "false");
    label?.setAttribute("visible", "false");
    hint?.setAttribute("visible", "true");
  });

  // -----------------------------
  // Overlay  + Pins
  // -----------------------------
   
  const overlay = document.getElementById("info-overlay");
  const titleEl = document.getElementById("info-title");
  const textEl = document.getElementById("info-text");
  const closeBtn = document.getElementById("info-close");

  const hitTargets = [
  document.getElementById("hit-1"),
  document.getElementById("hit-2"),
  document.getElementById("hit-3"),
  document.getElementById("hit-4"),
];

const pinGroups = [
  document.getElementById("pinGroup-1"),
  document.getElementById("pinGroup-2"),
  document.getElementById("pinGroup-3"),
  document.getElementById("pinGroup-4"),
];

const disableARInteraction = () => {
  // Pins / Gruppen ausblenden
  pinGroups.forEach((g) => {
    if (!g) return;
    g.setAttribute("visible", "false");
    if (g.object3D) g.object3D.visible = false;
  });

  // Overlay schließen (falls noch offen)
  overlay?.classList.add("hidden");

  // Hitboxen deaktivieren (Raycaster ignoriert sie dann)
  hitTargets.forEach((hit) => {
    if (!hit) return;
    hit.classList.remove("pin"); // wichtig: raycaster="objects: .pin"
  });
};

  const progressBarEl = document.querySelector("#ar-footer .footer-progress-bar");

  const pinContent = [
    {
      title: "MISSION & VISION",
      text: "Stratosfare verfolgt das Ziel, den Mittelstand bei der Einführung neuer Technologien zu unterstützen. Durch die Verbindung von etablierten Unternehmen und innovativen Start-ups sollen zukunftsorientierte Lösungen schneller entwickelt, getestet und in reale Unternehmensprozesse integriert werden.", },
    { title: "GESCHÄFTSMODELL", 
      text: "Der Venture-Client-Ansatz ermöglicht es Unternehmen, Innovationen nicht zu kaufen oder zu investieren, sondern sie direkt zu nutzen. Stratosfare identifiziert passende Start-ups und schafft Pilotprojekte, in denen neue Technologien unter realen Bedingungen erprobt und weiterentwickelt werden." },
    { title: "TEAM & ARBEITSWEISE", 
      text: "Das Team von Stratosfare vereint Expertise aus Technologie, Innovation und Unternehmensentwicklung. In enger Zusammenarbeit mit Unternehmen begleitet es den gesamten Innovationsprozess – von der Identifikation geeigneter Start-ups bis zur Umsetzung erfolgreicher Pilotprojekte." },
    { title: "PROJEKTE", 
      text: "In Formaten wie Workshops, Innovationsprogrammen und Pilotprojekten bringt Stratosfare Unternehmen und Start-ups zusammen. Die Aktivitäten zielen darauf ab, konkrete Anwendungsfälle umzusetzen, technologische Hürden zu reduzieren und Innovation im Mittelstand messbar voranzutreiben." },
  ];

  // robust: Sichtbarkeit wirklich setzen
  const setVisible = (el, visible) => {
    if (!el) return;
    el.setAttribute("visible", visible ? "true" : "false");
    if (el.object3D) el.object3D.visible = !!visible;
  };

  // Initial: nur Pin 1
  //pins.forEach((pin, i) => setVisible(pin, i === 0));
  pinGroups.forEach((g, i) => setVisible(g, i === 0));



  let unlockedStep = 1;       // 1..4
  let completedPins = 0; 
  let openedPinIndex = null;  // welcher Pin hat das Overlay geöffnet?
  
  const setProgress = () => {
  const totalPins = 4;
  const percent = Math.round((completedPins / totalPins) * 100);
  if (progressBarEl) progressBarEl.style.width = `${percent}%`;
};

const startBtn = document.querySelector("#ar-footer .footer-cta");

const setStartEnabled = (enabled) => {
  if (!startBtn) return;
  startBtn.classList.toggle("is-disabled", !enabled);
  startBtn.setAttribute("aria-disabled", String(!enabled));
};

setProgress(); // Start bei 0%
setStartEnabled(false); // Start: disabled

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




  startBtn?.addEventListener("click", (e) => {
    if (completedPins < 4) {
      e.preventDefault();
      return;
    }

    //  Pins, Labels, Hitboxen, Overlay deaktivieren
    disableARInteraction();

    //  Countdown starten
    startCountdown(3, () => {
      launchRocket();
    });
  });

  /*-------------------------------------------
  ROCKET LAUNCH (vorläufig)
  ---------------------------------------------*/
  const launchRocket = () => {
  const rocket = document.getElementById("rocket");
  if (!rocket) return;

    // Kurzes Zittern / Aufladen
    rocket.setAttribute(
      "animation__shake",
      "property: position; dur: 90; dir: alternate; loop: 14; easing: easeInOutSine; to: 0 0 0.03"
    );

    // Leichtes Abheben
    setTimeout(() => {
      rocket.setAttribute(
        "animation__lift",
        "property: position; dur: 900; easing: easeOutQuad; to: 0 0 -0.35"
      );
    }, 900);

    //  3. Boost nach oben + verschwinden
    setTimeout(() => {
      rocket.setAttribute(
        "animation__boost",
        "property: position; dur: 1200; easing: easeInQuad; to: 0 0 -2.5"
      );

      rocket.setAttribute(
        "animation__fade",
        "property: material.opacity; dur: 600; to: 0"
      );
    }, 1800);

    setTimeout(() => {
    window.location.href = "mehrErfahren.html";
  }, 3100);
  };

  /* ---------------------------------------
  INFO OVERLAY + PINS
  -----------------------------------------*/

  const openInfoByIndex = (index) => {
    if (!overlay || !titleEl || !textEl) return;

    const c = pinContent[index] || { title: "Info", text: "" };
    titleEl.textContent = c.title;
    textEl.textContent = c.text;

    overlay.classList.remove("hidden");
    openedPinIndex = index;

    console.log("OPEN OVERLAY FROM PIN", index + 1);
  };

  const unlockNextPinIfNeeded = () => {
    if (openedPinIndex === null) return;

    const stepOpened = openedPinIndex + 1;

    // nur wenn der User den "neuesten" (aktuellen) Pin geöffnet hatte, wird der nächste Pin freigeschaltet
    if (stepOpened === unlockedStep && unlockedStep < 4) {
      unlockedStep += 1;

      // neuen Pin sichtbar machen, alte bleiben sichtbar
      //setVisible(pins[unlockedStep - 1], true);
      setVisible(pinGroups[unlockedStep - 1], true);


      console.log("UNLOCKED PIN", unlockedStep);
    }

    openedPinIndex = null;
  };

  const closeInfo = () => {
  overlay?.classList.add("hidden");

  if (openedPinIndex !== null) {
    const stepOpened = openedPinIndex + 1;

    completedPins = Math.max(completedPins, stepOpened);
    setProgress();
    setStartEnabled(completedPins >= 4);

    if (stepOpened === unlockedStep && unlockedStep < 4) {
      unlockedStep += 1;
     // setVisible(pins[unlockedStep - 1], true);
     setVisible(pinGroups[unlockedStep - 1], true);

    }
  }

  openedPinIndex = null;
};


  // Schließen per X + Backdrop
  closeBtn?.addEventListener("click", closeInfo);
  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) closeInfo();
  });

  // Hover Feedback + Klick-Handler
 /*
  const bindPin = (pin, index) => {
    if (!pin) return;

    pin.addEventListener("mouseenter", () => {
      pin.setAttribute("scale", "1.2 1.2 1.2");
      pin.setAttribute("material", "emissiveIntensity", 1.4);
    });

    pin.addEventListener("mouseleave", () => {
      pin.setAttribute("scale", "1 1 1");
      pin.setAttribute("material", "emissiveIntensity", 0.7);
    });

    pin.addEventListener("click", () => {
      const step = index + 1;

      // nur freigeschaltete Pins reagieren
      if (step <= unlockedStep) {
        console.log("PIN CLICK", step);
        openInfoByIndex(index);
      } else {
        console.log("PIN LOCKED", step, "(unlockedStep =", unlockedStep, ")");
      }
    });
  };

  pins.forEach((pin, idx) => bindPin(pin, idx));
  */

// Hover/Klick wird an der HITBOX gebunden
// --- Hol dir Kamera + Canvas (A-Frame) ---
const cam = document.getElementById("cam");

hitTargets.forEach((hit, idx) => {
  if (!hit) return;

  hit.addEventListener("raycaster-intersected", () => {
    const v = visualPins[idx];
    if (v) {
      v.setAttribute("scale", "1.2 1.2 1.2");
      v.setAttribute("material", "emissiveIntensity", 1.4);
    }
    if (scene.canvas) scene.canvas.style.cursor = "pointer";
  });

  hit.addEventListener("raycaster-intersected-cleared", () => {
    const v = visualPins[idx];
    if (v) {
      v.setAttribute("scale", "1 1 1");
      v.setAttribute("material", "emissiveIntensity", 0.7);
    }
    if (scene.canvas) scene.canvas.style.cursor = "default";
  });
});

const setupCanvasPick = () => {
  const canvas = scene.canvas;
  if (!canvas || !cam) return;

  canvas.addEventListener("click", () => {
    const rc = cam.components && cam.components.raycaster;
    if (!rc) return;

    const hitEl = rc.intersectedEls && rc.intersectedEls[0];
    if (!hitEl) return;

    const id = hitEl.getAttribute("id");
    if (!id || !id.startsWith("hit-")) return;

    const index = parseInt(id.split("-")[1], 10) - 1; // hit-1 -> 0
    if (Number.isNaN(index)) return;

    const step = index + 1;
    if (step <= unlockedStep) {
      openInfoByIndex(index);
    }
  });
};

// Canvas existiert erst nach loaded
if (scene.hasLoaded) setupCanvasPick();
else scene.addEventListener("loaded", setupCanvasPick, { once: true });


  }


 


  //------------------------------------------------------------------------------------ 
  //                                   Buttons 
  //  ----------------------------------------------------------------------------------
  denyBtn?.addEventListener("click", () => (window.location.href = "home.html"));

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
      window.location.href = "home.html";
    }
  });
});
