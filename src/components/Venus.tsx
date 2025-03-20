import * as THREE from "three";

export const Venus = () => {
  const textureLoader = new THREE.TextureLoader();
  const venusTexture = textureLoader.load("/textures/venus.jpg");

  const venusGeometry = new THREE.SphereGeometry(40, 32, 32);
  const venusMaterial = new THREE.MeshPhongMaterial({
    map: venusTexture,
    shininess: 5, // Reducir brillo para menos contraste duro
    specular: new THREE.Color(0x222222), // Reflejos más suaves y oscuros
    color: new THREE.Color(0xaaaaaa),
  });

  const venusMesh = new THREE.Mesh(venusGeometry, venusMaterial);
  venusMesh.castShadow = true; // Allow Venus to cast shadows
  venusMesh.receiveShadow = true; // Allow Venus to receive shadows

  return venusMesh;
};