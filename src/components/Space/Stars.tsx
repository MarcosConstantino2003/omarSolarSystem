import * as THREE from "three";

export const Stars = () => {
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 }); // Increased size slightly for visibility

  const starVertices = [];
  const starCount = 7000; 
  for (let i = 0; i < starCount; i++) {
    const x = (Math.random() - 0.5) * 100000;
    const y = (Math.random() - 0.5) * 100000; 
    const z = (Math.random() - 0.5) * 100000; 
    starVertices.push(x, y, z);
  }

  starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starVertices, 3));
  return new THREE.Points(starGeometry, starMaterial);
};