import * as THREE from "three";

export const Makemake = () => {
  const textureLoader = new THREE.TextureLoader();
  const makemakeTexture = textureLoader.load("/textures/makemake.jpg");

  const makemakeGeometry = new THREE.SphereGeometry(7, 32, 32); 
  const makemakeMaterial = new THREE.MeshPhongMaterial({
    map: makemakeTexture,
    shininess: 5, // Reducir brillo para menos contraste duro
    specular: new THREE.Color(0x222222), // Reflejos más suaves y oscuros
    color: new THREE.Color(0xaaaaaa),
  });

  const makemakeMesh = new THREE.Mesh(makemakeGeometry, makemakeMaterial);
  makemakeMesh.castShadow = true; // Allow Makemake to cast shadows
  makemakeMesh.receiveShadow = true; // Allow Makemake to receive shadows

  return makemakeMesh;
};
