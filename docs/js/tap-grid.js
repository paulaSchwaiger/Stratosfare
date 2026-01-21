// docs/js/tap-grid.js
// Reusable Tap Grid (8x4) that emits: window.dispatchEvent(new CustomEvent("pinselected",{detail:{index}}))

(function () {
  const DEFAULTS = {
    rows: 8,
    cols: 4,
    updateMs: 150,     // 120-200ms recommended
    block2x2: true,    // true = 2x2 tap area around pin
    debug: true        // set false later
  };

  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

  function ensureGridElement() {
    let el = document.getElementById("tapGrid");
    if (!el) {
      el = document.createElement("div");
      el.id = "tapGrid";
      el.setAttribute("aria-hidden", "true");
      document.body.appendChild(el);
    }
    return el;
  }

  function buildGrid(tapGrid, rows, cols) {
    tapGrid.innerHTML = "";
    tapGrid.style.display = "grid";
    tapGrid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    tapGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    for (let i = 0; i < rows * cols; i++) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tapCell";
      btn.dataset.index = String(i);
      tapGrid.appendChild(btn);
    }
  }

  function clearActive(tapGrid) {
    [...tapGrid.children].forEach((cell) => {
      cell.classList.remove("active");
      delete cell.dataset.pin;
    });
  }

  function activateCell(tapGrid, rows, cols, row, col, pinId) {
    row = clamp(row, 0, rows - 1);
    col = clamp(col, 0, cols - 1);
    const idx = row * cols + col;
    const cell = tapGrid.children[idx];
    if (!cell) return;
    cell.classList.add("active");
    cell.dataset.pin = pinId; // "pin1".."pin4"
  }

  function activateAround(tapGrid, rows, cols, row, col, pinId, block2x2) {
    if (block2x2) {
      activateCell(tapGrid, rows, cols, row, col, pinId);
      activateCell(tapGrid, rows, cols, row, col + 1, pinId);
      activateCell(tapGrid, rows, cols, row + 1, col, pinId);
      activateCell(tapGrid, rows, cols, row + 1, col + 1, pinId);
      return;
    }
    // fallback: single cell
    activateCell(tapGrid, rows, cols, row, col, pinId);
  }

  function worldToGridCell(scene, tapGrid, rows, cols, worldPos) {
    const cam = scene?.camera;
    const canvas = scene?.renderer?.domElement;
    if (!cam || !canvas) return null;

    const canvasRect = canvas.getBoundingClientRect();
    const gridRect = tapGrid.getBoundingClientRect();

    const v = worldPos.clone().project(cam);
    if (v.z > 1) return null;

    const sx = canvasRect.left + (v.x + 1) * 0.5 * canvasRect.width;
    const sy = canvasRect.top + (1 - (v.y + 1) * 0.5) * canvasRect.height;

    const u = (sx - gridRect.left) / gridRect.width;
    const w = (sy - gridRect.top) / gridRect.height;

    if (u < 0 || u > 1 || w < 0 || w > 1) return null;

    const col = clamp(Math.floor(u * cols), 0, cols - 1);
    const row = clamp(Math.floor(w * rows), 0, rows - 1);

    return { row, col };
  }

  // Public initializer: window.TapGrid.init({ scene, marker, hitTargets, getUnlockedStep })
  function init(userOpts) {
    const opts = { ...DEFAULTS, ...(userOpts || {}) };

    const tapGrid = ensureGridElement();
    buildGrid(tapGrid, opts.rows, opts.cols);

    // Make sure overlay can receive taps
    tapGrid.style.position = "fixed";
    tapGrid.style.inset = "0";
    tapGrid.style.zIndex = "9999";
    tapGrid.style.pointerEvents = "auto";

    let timer = null;

    const triggerPin = (pinId) => {
      const index = parseInt(String(pinId).replace("pin", ""), 10) - 1;
      if (Number.isNaN(index)) return;
      window.dispatchEvent(new CustomEvent("pinselected", { detail: { index } }));
    };

    // Tap handler (only active cells)
    tapGrid.addEventListener("touchstart", (e) => {
      const cell = e.target.closest(".tapCell.active");
      if (!cell) return;
      e.preventDefault();
      triggerPin(cell.dataset.pin);
    }, { passive: false });

    tapGrid.addEventListener("click", (e) => {
      const cell = e.target.closest(".tapCell.active");
      if (!cell) return;
      triggerPin(cell.dataset.pin);
    });

    const update = () => {
      const scene = opts.scene;
      const hitTargets = opts.hitTargets || [];
      const unlockedStep = typeof opts.getUnlockedStep === "function" ? opts.getUnlockedStep() : 4;

      if (!scene?.camera || !scene?.renderer) return;

      clearActive(tapGrid);

      hitTargets.forEach((hit, i) => {
        const step = i + 1;
        if (!hit || step > unlockedStep) return;
        if (!hit.object3D) return;

        const wp = new THREE.Vector3();
        hit.object3D.getWorldPosition(wp);

        const cell = worldToGridCell(scene, tapGrid, opts.rows, opts.cols, wp);
        if (!cell) return;

        activateAround(tapGrid, opts.rows, opts.cols, cell.row, cell.col, `pin${step}`, opts.block2x2);
      });
    };

    const start = () => {
      if (timer) return;
      update();
      timer = setInterval(update, opts.updateMs);
    };

    const stop = () => {
      if (!timer) return;
      clearInterval(timer);
      timer = null;
      clearActive(tapGrid);
    };

    // If marker provided: start/stop with marker
    if (opts.marker) {
      opts.marker.addEventListener("markerFound", start);
      opts.marker.addEventListener("markerLost", stop);
    } else {
      start();
    }

    return { start, stop, update, el: tapGrid };
  }

  window.TapGrid = { init };
})();
