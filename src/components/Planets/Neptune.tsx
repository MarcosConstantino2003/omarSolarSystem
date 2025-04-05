import * as THREE from "three";

export const Neptune = ({ timeScaleFactorRef }: { timeScaleFactorRef?: React.RefObject<number> }) => {
  const textureLoader = new THREE.TextureLoader();

  // 🌑 Neptuno: planeta
  const neptuneTexture = textureLoader.load("/textures/neptune.jpg");
  const neptuneGeometry = new THREE.SphereGeometry(7.1);
  const neptuneMaterial = new THREE.MeshPhongMaterial({
    map: neptuneTexture,
    shininess: 5,
    specular: new THREE.Color(0x222222),
    color: new THREE.Color(0xaaaaaa),
  });
  const neptuneMesh = new THREE.Mesh(neptuneGeometry, neptuneMaterial);
  neptuneMesh.castShadow = true;
  neptuneMesh.receiveShadow = true;

  // Tritón
  const tritonTexture = textureLoader.load("/textures/moons/triton.jpg");
  const tritonGeometry = new THREE.SphereGeometry(0.390);
  const tritonMaterial = new THREE.MeshPhongMaterial({
    map: tritonTexture,
    shininess: 5,
    specular: new THREE.Color(0x222222),
    color: new THREE.Color(0xaaaaaa),
  });
  const tritonMesh = new THREE.Mesh(tritonGeometry, tritonMaterial);
  tritonMesh.castShadow = true;
  tritonMesh.receiveShadow = true;

  // Proteo
  const proteusTexture = textureLoader.load("/textures/moons/proteus.jpg");
  const proteusGeometry = new THREE.SphereGeometry(0.061);
  const proteusMaterial = new THREE.MeshPhongMaterial({
    map: proteusTexture,
    shininess: 5,
    specular: new THREE.Color(0x222222),
    color: new THREE.Color(0xaaaaaa),
  });
  const proteusMesh = new THREE.Mesh(proteusGeometry, proteusMaterial);
  proteusMesh.castShadow = true;
  proteusMesh.receiveShadow = true;

  // Grupo Neptuno + lunas
  const neptuneGroup = new THREE.Group();
  neptuneGroup.add(neptuneMesh);
  neptuneGroup.add(tritonMesh);
  neptuneGroup.add(proteusMesh);

  // Parámetros de órbita
  let tritonAngle = 0;
  const tritonOrbitRadius = 102.28;
  const baseTritonOrbitSpeed = -0.0163; // Negativo por órbita retrógrada

  let proteusAngle = 0;
  const proteusOrbitRadius = 33.92;
  const baseProteusOrbitSpeed = 0.0854;

  // Animación
  const animate = () => {
    const timeScaleFactor = timeScaleFactorRef?.current ?? 7;

    // Rotación de Neptuno sobre su eje
    neptuneMesh.rotation.y += 0.0015;

    // Órbita de Tritón (retrógrada)
    const scaledTritonOrbitSpeed = baseTritonOrbitSpeed * timeScaleFactor;
    tritonAngle += scaledTritonOrbitSpeed;
    if (tritonAngle < 0) tritonAngle += 2 * Math.PI; // Mantener el ángulo positivo
    const tritonX = Math.cos(tritonAngle) * tritonOrbitRadius;
    const tritonZ = Math.sin(tritonAngle) * tritonOrbitRadius;
    tritonMesh.position.set(tritonX, 0, tritonZ);
    tritonMesh.rotation.y += 0.0002 * timeScaleFactor;

    // Órbita de Proteo
    const scaledProteusOrbitSpeed = baseProteusOrbitSpeed * timeScaleFactor;
    proteusAngle += scaledProteusOrbitSpeed;
    if (proteusAngle > 2 * Math.PI) proteusAngle -= 2 * Math.PI;
    const proteusX = Math.cos(proteusAngle) * proteusOrbitRadius;
    const proteusZ = Math.sin(proteusAngle) * proteusOrbitRadius;
    proteusMesh.position.set(proteusX, 0, proteusZ);
    proteusMesh.rotation.y += 0.0002 * timeScaleFactor;

    requestAnimationFrame(animate);
  };
  animate();

  return neptuneGroup;
};