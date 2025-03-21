import * as THREE from "three";

export const Eris = () => {
  const textureLoader = new THREE.TextureLoader();
  const erisTexture = textureLoader.load("/textures/eris.jpg");

  const erisGeometry = new THREE.SphereGeometry(7, 32, 32); 
  const erisMaterial = new THREE.MeshPhongMaterial({
    map: erisTexture,
    shininess: 5, // Reducir brillo para menos contraste duro
    specular: new THREE.Color(0x222222), // Reflejos más suaves y oscuros
    color: new THREE.Color(0xaaaaaa),
  });

  const erisMesh = new THREE.Mesh(erisGeometry, erisMaterial);
  erisMesh.castShadow = true; // Allow Eris to cast shadows
  erisMesh.receiveShadow = true; // Allow Eris to receive shadows

  return erisMesh;
};
