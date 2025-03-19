import * as THREE from "three";

export const Saturn = () => {
  const textureLoader = new THREE.TextureLoader();
  
  // Load Saturn's texture
  const saturnTexture = textureLoader.load("/textures/saturn.jpg");

  // Saturn geometry and material
  const saturnGeometry = new THREE.SphereGeometry(83.72, 32, 32); // Radius
  const saturnMaterial = new THREE.MeshBasicMaterial({
    map: saturnTexture,
  });

  const saturnMesh = new THREE.Mesh(saturnGeometry, saturnMaterial);

  // Saturn's ring geometry and material
  const ringGeometry = new THREE.RingGeometry(120, 180, 64);
  const ringTexture = textureLoader.load("/textures/saturnring.jpg"); // Ring texture
  const ringMaterial = new THREE.MeshBasicMaterial({
    map: ringTexture,
    side: THREE.DoubleSide, // To make sure the ring is visible from both sides
    transparent: true, // Makes it transparent so the ring texture shows through
  });

  const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);

  // Position the ring around Saturn
  ringMesh.rotation.x = Math.PI / 2; // Rotate the ring so it's flat around the planet
  ringMesh.rotation.z = Math.PI / 3; // Tilt the ring by 60 degrees (Math.PI/3 radians)
  ringMesh.position.set(0, 0, 0); // Position it at the center (you can adjust this)

  // Create a parent object to group Saturn and its ring
  const saturnWithRing = new THREE.Group();
  saturnWithRing.add(saturnMesh);
  saturnWithRing.add(ringMesh);

  return saturnWithRing;
};
