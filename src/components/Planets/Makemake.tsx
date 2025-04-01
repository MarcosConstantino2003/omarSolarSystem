import * as THREE from "three";

export const Makemake = () => {
  const textureLoader = new THREE.TextureLoader();
  const makemakeTexture = textureLoader.load("/textures/makemake.jpg");

  const makemakeGeometry = new THREE.SphereGeometry(2); 
  const makemakeMaterial = new THREE.MeshPhongMaterial({
    map: makemakeTexture,
    shininess: 5, 
    specular: new THREE.Color(0x222222), 
    color: new THREE.Color(0xaaaaaa),
  });

  const makemakeMesh = new THREE.Mesh(makemakeGeometry, makemakeMaterial);
  makemakeMesh.castShadow = true; 
  makemakeMesh.receiveShadow = true; 

  return makemakeMesh;
};
