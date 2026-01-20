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
        <a-assets>
          <a-asset-item id="rocket-obj" src="sources/3D/Rocket.obj"></a-asset-item>
          <a-asset-item id="rocket-mtl" src="sources/3D/Rocket.mtl"></a-asset-item>
        </a-assets>

        <a-marker
          id="marker-hiro"
          preset="hiro"
          smooth="true"
          smoothCount="10"
          smoothTolerance="0.01"
          smoothThreshold="2"
        >
          <a-entity
            id="rocket"
            visible="false"
            obj-model="obj: #rocket-obj; mtl: #rocket-mtl"
            position="0 0 0"
            rotation="0 0 0"
            scale="0.15 0.15 0.15"
          ></a-entity>
        </a-marker>

        <a-entity id="cam" camera></a-entity>
      </a-scene>
    `;
  }

  function initARLogic() {
    const scene = document.getElementById("ar-scene");
    const marker = document.getElementById("marker-hiro");
    const rocket = document.getElementById("rocket");

    if (!scene || !marker || !rocket) return;

    marker.addEventListener("markerFound", () => {
      rocket.setAttribute("visible", "true");
      loadingEl?.classList.add("hidden");
      arFooter?.classList.remove("hidden");
    });

    marker.addEventListener("markerLost", () => {
      rocket.setAttribute("visible", "false");
    });
  }

  denyBtn?.addEventListener("click", () => (window.location.href = "index.html"));

  allowBtn?.addEventListener("click", async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      stream.getTracks().forEach((t) => t.stop());

      permissionOverlay?.classList.add("hidden");
      loadingEl?.classList.remove("hidden");

      arRoot.innerHTML = createARScene();

      const scene = document.getElementById("ar-scene");
      if (scene?.hasLoaded) initARLogic();
      else scene?.addEventListener("loaded", initARLogic, { once: true });

      setTimeout(() => loadingEl?.classList.add("hidden"), 5000);
    } catch (err) {
      alert("Ohne Kamerazugriff kann AR nicht gestartet werden.");
      window.location.href = "index.html";
    }
  });
});
