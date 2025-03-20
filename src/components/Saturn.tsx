import * as THREE from "three";

export const Saturn = () => {
  const textureLoader = new THREE.TextureLoader();

  // Saturno: planeta
  const saturnTexture = textureLoader.load("/textures/saturn.jpg");
  const saturnGeometry = new THREE.SphereGeometry(280, 32, 32); // Radio
  const saturnMaterial = new THREE.MeshPhongMaterial({
    map: saturnTexture,
    shininess: 5, // Suave para transición gradual
    specular: new THREE.Color(0x222222), // Reflejos difusos
    color: new THREE.Color(0xaaaaaa), // Tono base ajustado
  });
  const saturnMesh = new THREE.Mesh(saturnGeometry, saturnMaterial);
  saturnMesh.castShadow = true; // Proyecta sombras
  saturnMesh.receiveShadow = true; // Recibe sombras

  // Anillo: versión básica ajustada
  const ringTexture = textureLoader.load("/textures/saturnring.png");
  const ringGeometry = new THREE.RingGeometry(320, 480, 64); // Ajusté los radios para que sea más proporcional
  const ringMaterial = new THREE.MeshPhongMaterial({
    map: ringTexture,
    side: THREE.DoubleSide, // Visible desde ambos lados
    transparent: true, // Transparencia para la textura
    shininess: 5, // Consistente con el planeta
    specular: new THREE.Color(0x222222),
    color: new THREE.Color(0xaaaaaa),
  });
  const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
  ringMesh.castShadow = true; // Proyecta sombras
  ringMesh.receiveShadow = true; // Recibe sombras
  ringMesh.rotation.x = Math.PI / 2; // Plano horizontal
  ringMesh.rotation.z = Math.PI / 3; // Inclinación de 60 grados
  ringMesh.position.set(0, 0, 0); // Centrado con Saturno

  // Grupo para Saturno y su anillo
  const saturnWithRing = new THREE.Group();
  saturnWithRing.add(saturnMesh);
  saturnWithRing.add(ringMesh);

  return saturnWithRing;
};