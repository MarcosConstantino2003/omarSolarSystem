import * as THREE from "three";

export const Ceres = () => {
  const textureLoader = new THREE.TextureLoader();
  const ceresTexture = textureLoader.load("/textures/ceres.jpg");

  const ceresGeometry = new THREE.SphereGeometry(0.14); 
  const ceresMaterial = new THREE.MeshPhongMaterial({
    map: ceresTexture,
    shininess: 5, 
    specular: new THREE.Color(0x222222), 
    color: new THREE.Color(0xaaaaaa),
  });

  const ceresMesh = new THREE.Mesh(ceresGeometry, ceresMaterial);
  ceresMesh.castShadow = true; 
  ceresMesh.receiveShadow = true; 

  return ceresMesh;
};
