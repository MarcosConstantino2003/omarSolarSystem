import * as THREE from "three";

export const Sun = () => {
  // Create a group to hold the sun mesh and light
  const sunGroup = new THREE.Group();

  // Load the texture
  const textureLoader = new THREE.TextureLoader();
  const sunTexture = textureLoader.load("/textures/sun.jpg");

  // Create the sun sphere
  const sunGeometry = new THREE.SphereGeometry(2000);
  const sunMaterial = new THREE.MeshBasicMaterial({
    map: sunTexture,
  });
  const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
  sunGroup.add(sunMesh);

  // Add a PointLight to make the Sun emit light
  const sunLight = new THREE.PointLight(0xffffff, 10000, 0,1); // Color, intensity, distance
  sunLight.position.set(0, 0, 0); // Light originates from the Sun's center
  sunLight.castShadow = true; // Enable shadow casting
  sunGroup.add(sunLight);

  // Animation function
  const animate = () => {
    sunMesh.rotation.y += 0.001; // Rotate the sun
    requestAnimationFrame(animate);
  };
  animate();
  return sunGroup;
};