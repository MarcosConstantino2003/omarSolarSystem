import * as THREE from "three";

export const Venus = () => {
  const textureLoader = new THREE.TextureLoader();
  const venusTexture = textureLoader.load("/textures/venus.jpg");

  const venusGeometry = new THREE.SphereGeometry(17);
  const venusMaterial = new THREE.MeshPhongMaterial({
    map: venusTexture,
    shininess: 5, 
    specular: new THREE.Color(0x222222),
    color: new THREE.Color(0xaaaaaa),
  });

  const venusMesh = new THREE.Mesh(venusGeometry, venusMaterial);
  venusMesh.castShadow = true; 
  venusMesh.receiveShadow = true;

  return venusMesh;
};