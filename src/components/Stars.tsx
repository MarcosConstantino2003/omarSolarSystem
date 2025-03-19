import * as THREE from "three";

export const Stars = () => {
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 });

  const starVertices = [];
  for (let i = 0; i < 1000; i++) {
    const x = (Math.random() - 0.5) * 100;
    const y = (Math.random() - 0.5) * 100;
    const z = (Math.random() - 0.5) * 100;
    starVertices.push(x, y, z);
  }

  starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starVertices, 3));
  return new THREE.Points(starGeometry, starMaterial);
};