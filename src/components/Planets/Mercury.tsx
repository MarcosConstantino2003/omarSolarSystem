import * as THREE from "three";

export const Mercury = () => {
  const textureLoader = new THREE.TextureLoader();
  const mercuryTexture = textureLoader.load("/textures/mercury.jpg");

  const mercuryGeometry = new THREE.SphereGeometry(7);
  const mercuryMaterial = new THREE.MeshPhongMaterial({
    map: mercuryTexture,
    shininess: 5, 
    specular: new THREE.Color(0x222222), 
    color: new THREE.Color(0xaaaaaa),
  });

  const mercuryMesh = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
  mercuryMesh.castShadow = true;
  mercuryMesh.receiveShadow = true; 

  return mercuryMesh;
};