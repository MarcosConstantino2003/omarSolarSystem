import * as THREE from "three";

export const Uranus = () => {
  const textureLoader = new THREE.TextureLoader();
  const uranusTexture = textureLoader.load("/textures/uranus.jpg");

  const uranusGeometry = new THREE.SphereGeometry(160, 32, 32);
  const uranusMaterial = new THREE.MeshPhongMaterial({
    map: uranusTexture,
    shininess: 5, // Reducir brillo para menos contraste duro
    specular: new THREE.Color(0x222222), // Reflejos más suaves y oscuros
    color: new THREE.Color(0xaaaaaa),
  });

  const uranusMesh = new THREE.Mesh(uranusGeometry, uranusMaterial);
  uranusMesh.castShadow = true; // Allow Uranus to cast shadows
  uranusMesh.receiveShadow = true; // Allow Uranus to receive shadows

  return uranusMesh;
};