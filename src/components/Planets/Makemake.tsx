import * as THREE from "three";

export const Makemake = ({ timeScaleFactorRef }: { timeScaleFactorRef?: React.RefObject<number> }) => {
  const textureLoader = new THREE.TextureLoader();

  // 🌑 Makemake: planeta enano
  const makemakeTexture = textureLoader.load("/textures/makemake.jpg");
  const makemakeGeometry = new THREE.SphereGeometry(0.2);
  const makemakeMaterial = new THREE.MeshPhongMaterial({
    map: makemakeTexture,
    shininess: 5,
    specular: new THREE.Color(0x222222),
    color: new THREE.Color(0xaaaaaa),
  });
  const makemakeMesh = new THREE.Mesh(makemakeGeometry, makemakeMaterial);
  makemakeMesh.castShadow = true;
  makemakeMesh.receiveShadow = true;

  // MK2
  const mk2Texture = textureLoader.load("/textures/moons/mk2.jpg");
  const mk2Geometry = new THREE.SphereGeometry(0.0245);
  const mk2Material = new THREE.MeshPhongMaterial({
    map: mk2Texture,
    shininess: 5,
    specular: new THREE.Color(0x222222),
    color: new THREE.Color(0xaaaaaa),
  });
  const mk2Mesh = new THREE.Mesh(mk2Geometry, mk2Material);
  mk2Mesh.castShadow = true;
  mk2Mesh.receiveShadow = true;

  // Grupo Makemake + luna
  const makemakeGroup = new THREE.Group();
  makemakeGroup.add(makemakeMesh);
  makemakeGroup.add(mk2Mesh);

  // Parámetros de órbita
  let mk2Angle = 0;
  const mk2OrbitRadius = 5.87;
  const baseMk2OrbitSpeed = 0.00773;

  // Animación
  const animate = () => {
    const timeScaleFactor = timeScaleFactorRef?.current ?? 7;

    // Rotación de Makemake sobre su eje
    makemakeMesh.rotation.y += 0.002; // Período estimado ~7.77 horas, ajustado visualmente

    // Órbita de MK2
    const scaledMk2OrbitSpeed = baseMk2OrbitSpeed * timeScaleFactor;
    mk2Angle += scaledMk2OrbitSpeed;
    if (mk2Angle > 2 * Math.PI) mk2Angle -= 2 * Math.PI;
    const mk2X = Math.cos(mk2Angle) * mk2OrbitRadius;
    const mk2Z = Math.sin(mk2Angle) * mk2OrbitRadius;
    mk2Mesh.position.set(mk2X, 0, mk2Z);
    mk2Mesh.rotation.y += 0.0002 * timeScaleFactor;

    requestAnimationFrame(animate);
  };
  animate();

  return makemakeGroup;
};