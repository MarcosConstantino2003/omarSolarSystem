import * as THREE from "three";

export const Mercury = () => {
  // Load the texture for Mercury (you can replace it with your own texture if available)
  const textureLoader = new THREE.TextureLoader();
  const mercuryTexture = textureLoader.load("/textures/mercury.jpg");  // Asegúrate de tener la textura de Mercurio en public/textures

  // Create the Mercury sphere with texture
  const mercuryGeometry = new THREE.SphereGeometry(3.5, 32, 32); // Radio de 3.5
  const mercuryMaterial = new THREE.MeshBasicMaterial({
    map: mercuryTexture,
  });
  const mercuryMesh = new THREE.Mesh(mercuryGeometry, mercuryMaterial);

  // Return Mercury as a mesh to be added to the scene
  return mercuryMesh;
};
