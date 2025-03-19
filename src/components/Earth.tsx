import * as THREE from "three";

export const Earth = () => {
  const textureLoader = new THREE.TextureLoader();
  const earthTexture = textureLoader.load("/textures/earth.jpg");

  const earthGeometry = new THREE.SphereGeometry(9.16, 32, 32); // Radio
  const earthMaterial = new THREE.MeshBasicMaterial({
    map: earthTexture,
  });

  const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);

  return earthMesh;
};
