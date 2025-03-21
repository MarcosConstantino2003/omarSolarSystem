import * as THREE from "three";

export const Mercury = () => {
  const textureLoader = new THREE.TextureLoader();
  const mercuryTexture = textureLoader.load("/textures/mercury.jpg");

  const mercuryGeometry = new THREE.SphereGeometry(14, 32, 32);
  const mercuryMaterial = new THREE.MeshPhongMaterial({
    map: mercuryTexture,
    shininess: 5, // Reducir brillo para menos contraste duro
    specular: new THREE.Color(0x222222), // Reflejos más suaves y oscuros
    color: new THREE.Color(0xaaaaaa),
  });

  const mercuryMesh = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
  mercuryMesh.castShadow = true; // Allow Mercury to cast shadows
  mercuryMesh.receiveShadow = true; // Allow Mercury to receive shadows

  return mercuryMesh;
};