import * as THREE from "three";

export const Pluto = () => {
  const textureLoader = new THREE.TextureLoader();
  const plutoTexture = textureLoader.load("/textures/pluto.jpg");

  const plutoGeometry = new THREE.SphereGeometry(7, 32, 32); 
  const plutoMaterial = new THREE.MeshPhongMaterial({
    map: plutoTexture,
    shininess: 5, // Reducir brillo para menos contraste duro
    specular: new THREE.Color(0x222222), // Reflejos más suaves y oscuros
    color: new THREE.Color(0xaaaaaa),
  });

  const plutoMesh = new THREE.Mesh(plutoGeometry, plutoMaterial);
  plutoMesh.castShadow = true; // Allow Pluto to cast shadows
  plutoMesh.receiveShadow = true; // Allow Pluto to receive shadows

  return plutoMesh;
};
