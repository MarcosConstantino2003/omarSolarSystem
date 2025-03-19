import * as THREE from "three";

export const Neptune = () => {
  const textureLoader = new THREE.TextureLoader();
  const neptuneTexture = textureLoader.load("/textures/neptune.jpg");

  const neptuneGeometry = new THREE.SphereGeometry(35.4, 32, 32); // Radio
  const neptuneMaterial = new THREE.MeshBasicMaterial({
    map: neptuneTexture,
  });

  const neptuneMesh = new THREE.Mesh(neptuneGeometry, neptuneMaterial);

  return neptuneMesh;
};