import * as THREE from "three";

export const Venus = () => {
  // Cargar la textura de Venus (asegúrate de tener el archivo en public/textures)
  const textureLoader = new THREE.TextureLoader();
  const venusTexture = textureLoader.load("/textures/venus.jpg");

  // Crear la esfera de Venus con textura
  const venusGeometry = new THREE.SphereGeometry(8.7, 32, 32); // Radio de 8.7
  const venusMaterial = new THREE.MeshBasicMaterial({
    map: venusTexture,
  });

  const venusMesh = new THREE.Mesh(venusGeometry, venusMaterial);

  return venusMesh;
};
