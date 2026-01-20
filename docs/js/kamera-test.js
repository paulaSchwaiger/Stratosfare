document.addEventListener("DOMContentLoaded", () => {
  const arRoot = document.getElementById("ar-root");
  if (!arRoot) return;

  arRoot.innerHTML = `
    <a-scene
      id="ar-scene"
      embedded
      vr-mode-ui="enabled: false"
      renderer="antialias: true; alpha: true"
      arjs="sourceType: webcam; facingMode: environment; debugUIEnabled: false;"
    >
      <a-marker id="marker-hiro" preset="hiro">
        <a-plane
          width="1"
          height="1"
          rotation="-90 0 0"
          position="0 0.01 0"
          material="color: #ff0000; opacity: 0.25; transparent: true; side: double;"
        ></a-plane>
      </a-marker>

      <a-entity camera></a-entity>
    </a-scene>
  `;
});
