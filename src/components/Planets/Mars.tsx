import * as THREE from "three";

export const Mars = () => {
  const textureLoader = new THREE.TextureLoader();
  const marsTexture = textureLoader.load("/textures/mars.jpg");

  const marsGeometry = new THREE.SphereGeometry(10);
  const marsMaterial = new THREE.MeshPhongMaterial({
    map: marsTexture,
    shininess: 5, 
    specular: new THREE.Color(0x222222), 
    color: new THREE.Color(0xaaaaaa),
  });

  const marsMesh = new THREE.Mesh(marsGeometry, marsMaterial);
  marsMesh.castShadow = true; 
  marsMesh.receiveShadow = true; 

  return marsMesh;
};