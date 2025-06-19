let scene, camera, renderer, mixer, clock;
let spikeBall;

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 2, 10);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  // Load GLB Model
  const loader = new THREE.GLTFLoader();
  loader.load("Spike Mine.glb", (gltf) => {
    spikeBall = gltf.scene;
    spikeBall.scale.set(1, 1, 1);
    scene.add(spikeBall);

    // Optional: Animation support
    mixer = new THREE.AnimationMixer(spikeBall);
    if (gltf.animations.length > 0) {
      gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
      });
    }
  });

  clock = new THREE.Clock();

  animate();
}

function animate() {
  requestAnimationFrame(animate);

  if (spikeBall) {
    // Roll forward like a ball
    spikeBall.position.z -= 0.1;
    spikeBall.rotation.x += 0.05;
  }

  if (mixer) {
    mixer.update(clock.getDelta());
  }

  renderer.render(scene, camera);
}

init();
