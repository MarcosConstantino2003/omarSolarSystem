import * as THREE from "three";

export const Stars = () => {
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 }); // Increased size slightly for visibility

  const starVertices = [];
  const starCount = 100000; // 1 million stars for a massive field
  for (let i = 0; i < starCount; i++) {
    const x = (Math.random() - 0.5) * 50000; // Spread over 50,000 units wide
    const y = (Math.random() - 0.5) * 100000; // Spread over 100,000 units tall
    const z = (Math.random() - 0.5) * 50000; // Spread over 50,000 units deep
    starVertices.push(x, y, z);
  }

  starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starVertices, 3));
  return new THREE.Points(starGeometry, starMaterial);
};