import * as THREE from "three";

export const Sun = ({ cameraRef }: { cameraRef: React.RefObject<THREE.PerspectiveCamera | null> }) => {
  const sunGroup = new THREE.Group();

  const textureLoader = new THREE.TextureLoader();
  const sunTexture = textureLoader.load("/textures/sun.jpg");
  const glowTexture = textureLoader.load("/textures/sunglow.png");

  const sunGeometry = new THREE.SphereGeometry(2000);
  const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
  const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
  sunGroup.add(sunMesh);

  const glowMaterial = new THREE.SpriteMaterial({
    map: glowTexture,
    color: 0xffff99,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthTest: false,
  });
  const glowSprite = new THREE.Sprite(glowMaterial);
  glowSprite.scale.set(10000, 10000, 1);
  glowSprite.position.set(0, 0, 0);
  sunGroup.add(glowSprite);

  const sunLight = new THREE.PointLight(0xffffff, 4, 0, 0.12);
  sunLight.position.set(0, 0, 0);
  sunLight.castShadow = true;
  sunGroup.add(sunLight);

  const animate = () => {
    sunMesh.rotation.y += 0.001;

    const camera = cameraRef.current;
    if (camera) {
      const distance = camera.position.distanceTo(sunGroup.position);
      const scale = Math.max(10000, distance * 0.15);
      glowSprite.scale.set(scale, scale, 1);
    }

    requestAnimationFrame(animate);
  };
  animate();

  return sunGroup;
};