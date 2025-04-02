import * as THREE from "three";

export const Uranus = () => {
  const textureLoader = new THREE.TextureLoader();
  const uranusTexture = textureLoader.load("/textures/uranus.jpg");

  // 🌑 Urano: planeta
  const uranusGeometry = new THREE.SphereGeometry(7.3);
  const uranusMaterial = new THREE.MeshPhongMaterial({
    map: uranusTexture,
    shininess: 5,
    specular: new THREE.Color(0x222222),
    color: new THREE.Color(0xaaaaaa),
  });
  const uranusMesh = new THREE.Mesh(uranusGeometry, uranusMaterial);
  uranusMesh.castShadow = true;
  uranusMesh.receiveShadow = true;

  // Anillo de Urano
  const asteroidGeometry = new THREE.BufferGeometry();
  const numAsteroids = 4000;
  const innerRadius = 20;
  const middleRadius = 23;
  const outerRadius = 25;

  const asteroidVertices = [];
  const asteroidColors = [];
  const color = new THREE.Color();

  // Crear los asteroides con el degradado de colores para las 3 capas
  for (let i = 0; i < numAsteroids; i++) {
    const angle = Math.random() * Math.PI * 2;
    let radius = Math.random() * (outerRadius - innerRadius) + innerRadius;

    if (radius < middleRadius) {
      radius = innerRadius + Math.random() * (middleRadius - innerRadius); // Capa interna
    } else {
      radius = middleRadius + Math.random() * (outerRadius - middleRadius); // Capa externa
    }

    const x = Math.cos(angle) * radius;
    const y = (Math.random() - 0.5) * 0.5; // Grosor reducido
    const z = Math.sin(angle) * radius;
    asteroidVertices.push(x, y, z);

    // Degradado de color
    const t = (radius - innerRadius) / (outerRadius - innerRadius);
    if (t < 0.33) {
      color.setRGB(0.05, 0.05, 0.05);
    } else if (t < 0.66) {
      color.setRGB(0.05, 0.02, 0.02);
    } else {
      color.setRGB(0, 0, 0.01);
    }
    asteroidColors.push(color.r, color.g, color.b);
  }

  asteroidGeometry.setAttribute("position", new THREE.Float32BufferAttribute(asteroidVertices, 3));
  asteroidGeometry.setAttribute("color", new THREE.Float32BufferAttribute(asteroidColors, 3));

  const asteroidMaterial = new THREE.PointsMaterial({
    vertexColors: true,
    size: 0.3,
  });

  const asteroidRing = new THREE.Points(asteroidGeometry, asteroidMaterial);
  asteroidRing.rotation.x = Math.PI * 1.75; // Inclinación de ~100°
  asteroidRing.castShadow = true;
  asteroidRing.receiveShadow = true;

  // Grupo Urano + anillo
  const uranusWithRing = new THREE.Group();
  uranusWithRing.add(uranusMesh);
  uranusWithRing.add(asteroidRing);

  // Animación
  const animate = () => {
    // Rotación de Urano sobre su eje
    uranusMesh.rotation.y += 0.0015;

    // Compensar la rotación del anillo para que permanezca fijo
    asteroidRing.rotation.y -= 0.005; // Contrarrestar la rotación del planeta

    requestAnimationFrame(animate);
  };
  animate();

  return uranusWithRing;
};