import * as THREE from "three";

export const Neptune = () => {
  const textureLoader = new THREE.TextureLoader();
  const neptuneTexture = textureLoader.load("/textures/neptune.jpg");

  const neptuneGeometry = new THREE.SphereGeometry(180, 32, 32);
  const neptuneMaterial = new THREE.MeshPhongMaterial({
    map: neptuneTexture,
    shininess: 5, // Reducir brillo para menos contraste duro
    specular: new THREE.Color(0x222222), // Reflejos más suaves y oscuros
    color: new THREE.Color(0xaaaaaa),
  });

  const neptuneMesh = new THREE.Mesh(neptuneGeometry, neptuneMaterial);
  neptuneMesh.castShadow = true; // Allow Neptune to cast shadows
  neptuneMesh.receiveShadow = true; // Allow Neptune to receive shadows

  return neptuneMesh;
};