import * as THREE from "three";

export const Mars = ({ timeScaleFactorRef }: { timeScaleFactorRef?: React.RefObject<number> }) => {
  const textureLoader = new THREE.TextureLoader();

  // Marte
  const marsTexture = textureLoader.load("/textures/mars.jpg");
  const marsGeometry = new THREE.SphereGeometry(1);
  const marsMaterial = new THREE.MeshPhongMaterial({
    map: marsTexture,
    shininess: 5,
    specular: new THREE.Color(0x222222),
    color: new THREE.Color(0xaaaaaa),
  });
  const marsMesh = new THREE.Mesh(marsGeometry, marsMaterial);
  marsMesh.castShadow = true;
  marsMesh.receiveShadow = true;

  // Phobos
  const phobosTexture = textureLoader.load("/textures/moons/phobos.png");
  const phobosGeometry = new THREE.SphereGeometry(0.03); // Tamaño pequeño relativo a Marte
  const phobosMaterial = new THREE.MeshPhongMaterial({
    map: phobosTexture,
    shininess: 5,
    specular: new THREE.Color(0x222222),
    color: new THREE.Color(0xaaaaaa),
  });
  const phobosMesh = new THREE.Mesh(phobosGeometry, phobosMaterial);
  phobosMesh.castShadow = true;
  phobosMesh.receiveShadow = true;

  // Deimos
  const deimosTexture = textureLoader.load("/textures/moons/deimos.jpg");
  const deimosGeometry = new THREE.SphereGeometry(0.1); // Aún más pequeño
  const deimosMaterial = new THREE.MeshPhongMaterial({
    map: deimosTexture,
    shininess: 5,
    specular: new THREE.Color(0x222222),
    color: new THREE.Color(0xaaaaaa),
  });
  const deimosMesh = new THREE.Mesh(deimosGeometry, deimosMaterial);
  deimosMesh.castShadow = true;
  deimosMesh.receiveShadow = true;

  // Grupo Marte + Lunas
  const marsGroup = new THREE.Group();
  marsGroup.add(marsMesh);
  marsGroup.add(phobosMesh);
  marsGroup.add(deimosMesh);

  // Parámetros de órbita
  let phobosAngle = 0;
  const phobosOrbitRadius = 1.6;
  const basePhobosOrbitSpeed = 0.300;

  let deimosAngle = 0;
  const deimosOrbitRadius = 4; 
  const baseDeimosOrbitSpeed = 0.076; 

  const animate = () => {
    const timeScaleFactor = timeScaleFactorRef?.current ?? 7; // Valor por defecto 7
    const scaledPhobosOrbitSpeed = basePhobosOrbitSpeed * timeScaleFactor;
    const scaledDeimosOrbitSpeed = baseDeimosOrbitSpeed * timeScaleFactor;

    // Órbita de Phobos
    phobosAngle += scaledPhobosOrbitSpeed;
    if (phobosAngle > 2 * Math.PI) phobosAngle -= 2 * Math.PI;
    const phobosX = Math.cos(phobosAngle) * phobosOrbitRadius;
    const phobosZ = Math.sin(phobosAngle) * phobosOrbitRadius;
    phobosMesh.position.set(phobosX, 0, phobosZ);
    phobosMesh.rotation.y += 0.0002 * timeScaleFactor;

    // Órbita de Deimos
    deimosAngle += scaledDeimosOrbitSpeed;
    if (deimosAngle > 2 * Math.PI) deimosAngle -= 2 * Math.PI;
    const deimosX = Math.cos(deimosAngle) * deimosOrbitRadius;
    const deimosZ = Math.sin(deimosAngle) * deimosOrbitRadius;
    deimosMesh.position.set(deimosX, 0, deimosZ);
    deimosMesh.rotation.y += 0.0002 * timeScaleFactor;

    requestAnimationFrame(animate);
  };
  animate();

  return marsGroup;
};