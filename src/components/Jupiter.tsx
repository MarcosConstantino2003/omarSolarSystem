import * as THREE from "three";

export const Jupiter = () => {
  const textureLoader = new THREE.TextureLoader();
  const jupiterTexture = textureLoader.load("/textures/jupiter.jpg");

  const jupiterGeometry = new THREE.SphereGeometry(100.5, 32, 32); // Radio
  const jupiterMaterial = new THREE.MeshBasicMaterial({
    map: jupiterTexture,
  });

  const jupiterMesh = new THREE.Mesh(jupiterGeometry, jupiterMaterial);

  return jupiterMesh;
};
