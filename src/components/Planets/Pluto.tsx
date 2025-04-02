import * as THREE from "three";

export const Pluto = () => {
  const textureLoader = new THREE.TextureLoader();

  // Plutón
  const plutoTexture = textureLoader.load("/textures/pluto.jpg");
  const plutoGeometry = new THREE.SphereGeometry(0.35);
  const plutoMaterial = new THREE.MeshPhongMaterial({
    map: plutoTexture,
    shininess: 5,
    specular: new THREE.Color(0x222222),
    color: new THREE.Color(0xaaaaaa),
  });
  const plutoMesh = new THREE.Mesh(plutoGeometry, plutoMaterial);
  plutoMesh.castShadow = true;
  plutoMesh.receiveShadow = true;

  // Caronte
  const charonTexture = textureLoader.load("/textures/charon.jpg");
  const charonGeometry = new THREE.SphereGeometry(0.2); // Caronte es ~mitad del tamaño de Plutón
  const charonMaterial = new THREE.MeshPhongMaterial({
    map: charonTexture,
    shininess: 5,
    specular: new THREE.Color(0x222222),
    color: new THREE.Color(0xaaaaaa),
  });
  const charonMesh = new THREE.Mesh(charonGeometry, charonMaterial);
  charonMesh.castShadow = true;
  charonMesh.receiveShadow = true;

  // Grupo Plutón + Caronte
  const plutoGroup = new THREE.Group();
  plutoGroup.add(plutoMesh);
  plutoGroup.add(charonMesh);

  // Parámetros de la órbita de Caronte
  let charonAngle = 0;
  const charonOrbitRadius = 2.5; 
  const charonOrbitSpeed = 0.005;

  // Animación de Caronte
  const animate = () => {
    charonAngle += charonOrbitSpeed;
    if (charonAngle > 2 * Math.PI) charonAngle -= 2 * Math.PI;

    // Posición de Caronte en una órbita circular
    const charonX = Math.cos(charonAngle) * charonOrbitRadius;
    const charonZ = Math.sin(charonAngle) * charonOrbitRadius;
    charonMesh.position.set(charonX, 0, charonZ);

    // Rotación de Caronte sobre su eje
    charonMesh.rotation.y += 0.0001; // Rotación más lenta que la Luna

    requestAnimationFrame(animate);
  };
  animate();

  return plutoGroup;
};