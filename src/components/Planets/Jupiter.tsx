import * as THREE from "three";

export const Jupiter = () => {
  const textureLoader = new THREE.TextureLoader();
  const jupiterTexture = textureLoader.load("/textures/jupiter.jpg");

  const jupiterGeometry = new THREE.SphereGeometry(300, 32, 32);
  const jupiterMaterial = new THREE.MeshPhongMaterial({
    map: jupiterTexture,
    shininess: 5, // Reducir brillo para menos contraste duro
    specular: new THREE.Color(0x222222), // Reflejos más suaves y oscuros
    color: new THREE.Color(0xaaaaaa),
  });

  const jupiterMesh = new THREE.Mesh(jupiterGeometry, jupiterMaterial);
  jupiterMesh.castShadow = true; // Allow Jupiter to cast shadows
  jupiterMesh.receiveShadow = true; // Allow Jupiter to receive shadows

  return jupiterMesh;
};