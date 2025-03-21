import * as THREE from "three";

export const SaturnAsteroidRing = () => {
  const asteroidGeometry = new THREE.BufferGeometry();
  const asteroidMaterial = new THREE.PointsMaterial({
    color: 0xaaaaaa,
    size: 2, // Tamaño de los asteroides
  });

  const asteroidVertices = [];
  const numAsteroids = 5000; // Cantidad de asteroides en el anillo

  const innerRadius = 320; // Radio interno del anillo
  const outerRadius = 480; // Radio externo del anillo

  for (let i = 0; i < numAsteroids; i++) {
    const angle = Math.random() * Math.PI * 2; // Ángulo aleatorio (0 a 2π)
    const radius = innerRadius + Math.random() * (outerRadius - innerRadius); // Distribución en el anillo

    const x = Math.cos(angle) * radius;
    const y = (Math.random() - 0.5) * 10; // Variación en altura
    const z = Math.sin(angle) * radius;

    asteroidVertices.push(x, y, z);
  }

  asteroidGeometry.setAttribute("position", new THREE.Float32BufferAttribute(asteroidVertices, 3));

  const asteroidRing = new THREE.Points(asteroidGeometry, asteroidMaterial);
  asteroidRing.rotation.x = Math.PI / 2; // Inclinado como el anillo de Saturno
  asteroidRing.rotation.z = Math.PI / 3; // Inclinación de 60 grados

  return asteroidRing;
};
