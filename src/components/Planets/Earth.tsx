import * as THREE from "three";

export const Earth = () => {
  const textureLoader = new THREE.TextureLoader();

  // Tierra
  const earthTexture = textureLoader.load("/textures/earth.jpg");
  const earthGeometry = new THREE.SphereGeometry(18);
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
  const moonTexture = textureLoader.load("/textures/moon.jpg");
  const moonGeometry = new THREE.SphereGeometry(5); 
  const moonMaterial = new THREE.MeshPhongMaterial({
    map: moonTexture,
    shininess: 5,
    specular: new THREE.Color(0x222222),
    color: new THREE.Color(0xaaaaaa),
  });
  const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
  moonMesh.castShadow = true;
  moonMesh.receiveShadow = true;

  //  Grupo Tierra + Luna
  const earthGroup = new THREE.Group();
  earthGroup.add(earthMesh);
  earthGroup.add(moonMesh);

  // Parámetros de la órbita lunar
  let moonAngle = 0;
  const moonOrbitRadius = 100; 
  const moonOrbitSpeed = 0.01; 

  // Animación de la Luna
  const animate = () => {
    moonAngle += moonOrbitSpeed;
    if (moonAngle > 2 * Math.PI) moonAngle -= 2 * Math.PI;

    // Posición de la Luna en una órbita circular (puede hacerse elíptica si querés)
    const moonX = Math.cos(moonAngle) * moonOrbitRadius;
    const moonZ = Math.sin(moonAngle) * moonOrbitRadius;
    moonMesh.position.set(moonX, 0, moonZ); 

    // Rotación de la Luna 
    moonMesh.rotation.y += 0.0002;

    requestAnimationFrame(animate);
  };
  animate();

  return earthGroup;
};