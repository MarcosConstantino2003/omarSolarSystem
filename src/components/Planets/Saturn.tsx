import * as THREE from "three";

export const Saturn = () => {
  const textureLoader = new THREE.TextureLoader();

  // 🌑 Saturno: planeta
  const saturnTexture = textureLoader.load("/textures/saturn.jpg");
  const saturnGeometry = new THREE.SphereGeometry(16.7);
  const saturnMaterial = new THREE.MeshPhongMaterial({
    map: saturnTexture,
    shininess: 5,
    specular: new THREE.Color(0x222222),
    color: new THREE.Color(0xaaaaaa),
  });
  const saturnMesh = new THREE.Mesh(saturnGeometry, saturnMaterial);
  saturnMesh.castShadow = true;
  saturnMesh.receiveShadow = true;

  // Anillo de asteroides
  const asteroidGeometry = new THREE.BufferGeometry();
  const numAsteroids = 6400;
  const innerRadius = 30;
  const outerRadius = 56;

  const asteroidVertices = [];
  const asteroidColors = [];
  const asteroidAngles: number[] = []; // Para almacenar los ángulos iniciales
  const asteroidRadii: any[] = []; // Para almacenar el radio de cada partícula
  const color = new THREE.Color();

  for (let i = 0; i < numAsteroids; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
    const x = Math.cos(angle) * radius;
    const y = (Math.random() - 0.5) * 5;
    const z = Math.sin(angle) * radius;

    asteroidVertices.push(x, y, z);
    asteroidAngles.push(angle);
    asteroidRadii.push(radius);

    const t = (radius - innerRadius) / (outerRadius - innerRadius);
    color.setRGB(0.8 - 0.8 * t, 0.7 - 0.7 * t, 0.5 - 0.5 * t);
    asteroidColors.push(color.r, color.g, color.b);
  }

  asteroidGeometry.setAttribute("position", new THREE.Float32BufferAttribute(asteroidVertices, 3));
  asteroidGeometry.setAttribute("color", new THREE.Float32BufferAttribute(asteroidColors, 3));

  const asteroidMaterial = new THREE.PointsMaterial({
    vertexColors: true,
    size: 0.3,
  });

  const asteroidRing = new THREE.Points(asteroidGeometry, asteroidMaterial);
  asteroidRing.rotation.x = Math.PI * 1.1; // Inclinación fija de los anillos
  asteroidRing.castShadow = true;
  asteroidRing.receiveShadow = true;

  // Grupo principal
  const saturnWithRing = new THREE.Group();
  saturnWithRing.add(saturnMesh);
  saturnWithRing.add(asteroidRing);

  // Animación
  const animate = () => {
    // Rotación de Saturno sobre su eje
    saturnMesh.rotation.y += 0.002;

    // Rotación diferencial de los asteroides
    const positions = asteroidGeometry.attributes.position.array as Float32Array;
    for (let i = 0; i < numAsteroids; i++) {
      const radius = asteroidRadii[i];
      // Velocidad orbital inversamente proporcional al radio (aproximación de Kepler)
      const orbitSpeed = 0.01 / Math.sqrt(radius); // Más rápido cerca, más lento lejos
      asteroidAngles[i] += orbitSpeed;
      if (asteroidAngles[i] > 2 * Math.PI) asteroidAngles[i] -= 2 * Math.PI;

      const x = Math.cos(asteroidAngles[i]) * radius;
      const z = Math.sin(asteroidAngles[i]) * radius;
      const y = positions[i * 3 + 1]; // Mantener la altura original

      positions[i * 3] = x;
      positions[i * 3 + 2] = z;
    }
    asteroidGeometry.attributes.position.needsUpdate = true; // Actualizar posiciones

    requestAnimationFrame(animate);
  };
  animate();

  return saturnWithRing;
};