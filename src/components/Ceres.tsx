import * as THREE from "three";

export const Ceres = () => {
  const textureLoader = new THREE.TextureLoader();
  const ceresTexture = textureLoader.load("/textures/ceres.jpg");

  const ceresGeometry = new THREE.SphereGeometry(7, 32, 32); 
  const ceresMaterial = new THREE.MeshPhongMaterial({
    map: ceresTexture,
    shininess: 5, // Reducir brillo para menos contraste duro
    specular: new THREE.Color(0x222222), // Reflejos más suaves y oscuros
    color: new THREE.Color(0xaaaaaa),
  });

  const ceresMesh = new THREE.Mesh(ceresGeometry, ceresMaterial);
  ceresMesh.castShadow = true; // Allow Ceres to cast shadows
  ceresMesh.receiveShadow = true; // Allow Ceres to receive shadows

  return ceresMesh;
};
