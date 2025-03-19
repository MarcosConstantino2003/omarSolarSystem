import * as THREE from "three";

export const Sun = () => {
  // Create a group to hold both the sun and its glow
  const sunGroup = new THREE.Group();

  // Load the texture
  const textureLoader = new THREE.TextureLoader();
  const sunTexture = textureLoader.load("/textures/sun.jpg");

  // Create the sun sphere
  const sunGeometry = new THREE.SphereGeometry(1000, 1000, 1000);
  const sunMaterial = new THREE.MeshBasicMaterial({
    map: sunTexture,
  });
  const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
  sunGroup.add(sunMesh);

  // Animation function
  const animate = () => {
    // Rotate the sun on its Y axis
    sunMesh.rotation.y += 0.001; // Adjust speed as needed
    
    requestAnimationFrame(animate);
  };
  animate();

  return sunGroup;
};