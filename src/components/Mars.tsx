import * as THREE from "three";

export const Mars = () => {
  const textureLoader = new THREE.TextureLoader();
  const marsTexture = textureLoader.load("/textures/mars.jpg");

  const marsGeometry = new THREE.SphereGeometry(19, 32, 32);
  const marsMaterial = new THREE.MeshPhongMaterial({
    map: marsTexture,
    shininess: 5, // Reducir brillo para menos contraste duro
    specular: new THREE.Color(0x222222), // Reflejos más suaves y oscuros
    color: new THREE.Color(0xaaaaaa),
  });

  const marsMesh = new THREE.Mesh(marsGeometry, marsMaterial);
  marsMesh.castShadow = true; // Allow Mars to cast shadows
  marsMesh.receiveShadow = true; // Allow Mars to receive shadows

  return marsMesh;
};