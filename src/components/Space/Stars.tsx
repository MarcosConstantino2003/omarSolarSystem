import * as THREE from "three";

export const Stars = () => {
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });

  const starVertices = [];
  const starCount = 2000;
  const radius = 1000000; // Radio de la esfera de estrellas

  for (let i = 0; i < starCount; i++) {
    const theta = Math.random() * Math.PI * 2; 
    const phi = Math.acos(2 * Math.random() - 1); 
    
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    
    starVertices.push(x, y, z);
  }

  starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starVertices, 3));
  return new THREE.Points(starGeometry, starMaterial);
};
