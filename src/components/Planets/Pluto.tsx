import * as THREE from "three";

export const Pluto = () => {
  const textureLoader = new THREE.TextureLoader();
  const plutoTexture = textureLoader.load("/textures/pluto.jpg");

  const plutoGeometry = new THREE.SphereGeometry(3.5); 
  const plutoMaterial = new THREE.MeshPhongMaterial({
    map: plutoTexture,
    shininess: 5, 
    specular: new THREE.Color(0x222222), 
    color: new THREE.Color(0xaaaaaa),
  });

  const plutoMesh = new THREE.Mesh(plutoGeometry, plutoMaterial);
  plutoMesh.castShadow = true; 
  plutoMesh.receiveShadow = true; 

  return plutoMesh;
};
