import * as THREE from "three";

export const Eris = () => {
  const textureLoader = new THREE.TextureLoader();
  const erisTexture = textureLoader.load("/textures/eris.jpg");

  const erisGeometry = new THREE.SphereGeometry(3.3); 
  const erisMaterial = new THREE.MeshPhongMaterial({
    map: erisTexture,
    shininess: 5,
    specular: new THREE.Color(0x222222),
    color: new THREE.Color(0xaaaaaa),
  });

  const erisMesh = new THREE.Mesh(erisGeometry, erisMaterial);
  erisMesh.castShadow = true; 
  erisMesh.receiveShadow = true; 

  return erisMesh;
};
