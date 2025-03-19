import * as THREE from "three";

export const Uranus = () => {
  const textureLoader = new THREE.TextureLoader();
  const uranusTexture = textureLoader.load("/textures/uranus.jpg");

  const uranusGeometry = new THREE.SphereGeometry(36.4, 32, 32); // Radio
  const uranusMaterial = new THREE.MeshBasicMaterial({
    map: uranusTexture,
  });

  const uranusMesh = new THREE.Mesh(uranusGeometry, uranusMaterial);

  return uranusMesh;
};