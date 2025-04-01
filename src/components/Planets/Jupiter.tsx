import * as THREE from "three";

export const Jupiter = () => {
  const textureLoader = new THREE.TextureLoader();
  const jupiterTexture = textureLoader.load("/textures/jupiter.jpg");

  const jupiterGeometry = new THREE.SphereGeometry(200);
  const jupiterMaterial = new THREE.MeshPhongMaterial({
    map: jupiterTexture,
    shininess: 5, 
    specular: new THREE.Color(0x222222), 
    color: new THREE.Color(0xaaaaaa),
  });

  const jupiterMesh = new THREE.Mesh(jupiterGeometry, jupiterMaterial);
  jupiterMesh.castShadow = true; 
  jupiterMesh.receiveShadow = true; 

  return jupiterMesh;
};