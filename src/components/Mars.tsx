import * as THREE from "three";

export const Mars = () => {
  const textureLoader = new THREE.TextureLoader();
  const marsTexture = textureLoader.load("/textures/mars.jpg");

  const marsGeometry = new THREE.SphereGeometry(4.88, 32, 32); // Radio
  const marsMaterial = new THREE.MeshBasicMaterial({
    map: marsTexture,
  });

  const marsMesh = new THREE.Mesh(marsGeometry, marsMaterial);

  return marsMesh;
};
