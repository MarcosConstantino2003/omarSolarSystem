import * as THREE from "three";

export const Earth = () => {
  const textureLoader = new THREE.TextureLoader();
  const earthTexture = textureLoader.load("/textures/earth.jpg");

  const earthGeometry = new THREE.SphereGeometry(38, 32, 32);
  const earthMaterial = new THREE.MeshPhongMaterial({
    map: earthTexture,
    shininess: 5, // Reducir brillo para menos contraste duro
    specular: new THREE.Color(0x222222), // Reflejos más suaves y oscuros
    color: new THREE.Color(0xaaaaaa),
  });

  const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
  earthMesh.castShadow = true; // Allow Earth to cast shadows
  earthMesh.receiveShadow = true; // Allow Earth to receive shadows

  return earthMesh;
};