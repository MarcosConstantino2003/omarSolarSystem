import * as THREE from "three";

export const Saturn = () => {
  const textureLoader = new THREE.TextureLoader();
  const saturnTexture = textureLoader.load("/textures/saturn.jpg");

  const saturnGeometry = new THREE.SphereGeometry(83.72, 32, 32); // Radio
  const saturnMaterial = new THREE.MeshBasicMaterial({
    map: saturnTexture,
  });

  const saturnMesh = new THREE.Mesh(saturnGeometry, saturnMaterial);

  return saturnMesh;
};