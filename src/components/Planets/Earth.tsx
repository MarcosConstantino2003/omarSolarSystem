import * as THREE from "three";

export const Earth = ({ timeScaleFactorRef }: { timeScaleFactorRef?: React.RefObject<number> }) => {
  const textureLoader = new THREE.TextureLoader();

  // Tierra
  const earthTexture = textureLoader.load("/textures/earth.jpg");
  const earthGeometry = new THREE.SphereGeometry(1.8);
  const earthMaterial = new THREE.MeshPhongMaterial({
    map: earthTexture,
    shininess: 5,
    specular: new THREE.Color(0x222222),
    color: new THREE.Color(0xaaaaaa),
  });
  const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
  earthMesh.castShadow = true;
  earthMesh.receiveShadow = true;

  // Luna
  const moonTexture = textureLoader.load("/textures/moons/moon.jpg");
  const moonGeometry = new THREE.SphereGeometry(0.5);
  const moonMaterial = new THREE.MeshPhongMaterial({
    map: moonTexture,
    shininess: 5,
    specular: new THREE.Color(0x222222),
    color: new THREE.Color(0xaaaaaa),
  });
  const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
  moonMesh.castShadow = true;
  moonMesh.receiveShadow = true;

  // Grupo Tierra + Luna
  const earthGroup = new THREE.Group();
  earthGroup.add(earthMesh);
  earthGroup.add(moonMesh);

  let moonAngle = 0;
  const moonOrbitRadius = 10;
  const baseMoonOrbitSpeed = 0.002; 

  const animate = () => {
    const timeScaleFactor = timeScaleFactorRef?.current ?? 7; 
    const scaledMoonOrbitSpeed = baseMoonOrbitSpeed * timeScaleFactor; 

    moonAngle += scaledMoonOrbitSpeed;
    if (moonAngle > 2 * Math.PI) moonAngle -= 2 * Math.PI;

    const moonX = Math.cos(moonAngle) * moonOrbitRadius;
    const moonZ = Math.sin(moonAngle) * moonOrbitRadius;
    moonMesh.position.set(moonX, 0, moonZ);

    moonMesh.rotation.y += 0.0002 * timeScaleFactor; // También escalar la rotación de la Luna

    requestAnimationFrame(animate);
  };
  animate();

  return earthGroup;
};