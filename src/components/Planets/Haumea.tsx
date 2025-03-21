import * as THREE from "three";

export const Haumea = () => {
  const textureLoader = new THREE.TextureLoader();
  const haumeaTexture = textureLoader.load("/textures/haumea.jpg");

  const haumeaGeometry = new THREE.SphereGeometry(7, 32, 32); 
  const haumeaMaterial = new THREE.MeshPhongMaterial({
    map: haumeaTexture,
    shininess: 5, // Reducir brillo para menos contraste duro
    specular: new THREE.Color(0x222222), // Reflejos más suaves y oscuros
    color: new THREE.Color(0xaaaaaa),
  });

  const haumeaMesh = new THREE.Mesh(haumeaGeometry, haumeaMaterial);
  haumeaMesh.castShadow = true; // Allow Haumea to cast shadows
  haumeaMesh.receiveShadow = true; // Allow Haumea to receive shadows

  return haumeaMesh;
};
