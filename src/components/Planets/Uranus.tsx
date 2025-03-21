import * as THREE from "three";

export const Uranus = () => {
  const textureLoader = new THREE.TextureLoader();
  const uranusTexture = textureLoader.load("/textures/uranus.jpg");

  const uranusGeometry = new THREE.SphereGeometry(160, 32, 32);
  const uranusMaterial = new THREE.MeshPhongMaterial({
    map: uranusTexture,
    shininess: 5,
    specular: new THREE.Color(0x222222),
    color: new THREE.Color(0xaaaaaa),
  });

  const uranusMesh = new THREE.Mesh(uranusGeometry, uranusMaterial);
  uranusMesh.castShadow = true;
  uranusMesh.receiveShadow = true;

  // 🌑 Anillo de Urano (con 2 capas y más separación)
  const asteroidGeometry = new THREE.BufferGeometry();
  const numAsteroids = 8000; // Número de asteroides
  const innerRadius = 200;  // Anillo interno
  const middleRadius = 230; // Mayor separación entre capas
  const outerRadius = 250;  // Anillo externo
  const asteroidVertices = [];
  const asteroidColors = [];
  const color = new THREE.Color();

  // Crear los asteroides con el degradado de colores para las 3 capas
  for (let i = 0; i < numAsteroids; i++) {
    const angle = Math.random() * Math.PI * 2;
    let radius = Math.random() * (outerRadius - innerRadius) + innerRadius;

    // Asignar un radio según las capas, con separación visible entre ellas
    if (radius < middleRadius) {
      radius = innerRadius + Math.random() * (middleRadius - innerRadius); // Capa interna
    } else {
      radius = middleRadius + Math.random() * (outerRadius - middleRadius); // Capa externa
    }

    const x = Math.cos(angle) * radius;
    const y = (Math.random() - 0.5) * 5; // Menos dispersión en vertical
    const z = Math.sin(angle) * radius;
    asteroidVertices.push(x, y, z);

    // Degradado de color más oscuro: gris casi negro en el centro, rojo y azul mucho más oscuros en las capas externas
    const t = (radius - innerRadius) / (outerRadius - innerRadius); // 0 en el centro, 1 en los bordes
    if (t < 0.33) {
      color.setRGB(0.05, 0.05, 0.05); // Gris muy oscuro (casi negro)
    } else if (t < 0.66) {
      color.setRGB(0.05, 0.02, 0.02); // Rojo más oscuro (más opaco)
    } else {
      color.setRGB(0, 0, 0.01); // Azul mucho más oscuro (más opaco)
    }
    asteroidColors.push(color.r, color.g, color.b);
  }

  asteroidGeometry.setAttribute("position", new THREE.Float32BufferAttribute(asteroidVertices, 3));
  asteroidGeometry.setAttribute("color", new THREE.Float32BufferAttribute(asteroidColors, 3));

  const asteroidMaterial = new THREE.PointsMaterial({
    vertexColors: true, // Permite el degradado de colores
    size: 2,
  });

  const asteroidRing = new THREE.Points(asteroidGeometry, asteroidMaterial);
  asteroidRing.rotation.x = Math.PI * 1.75; // Inclinación de 100 grados (~1.75 pi)
  asteroidRing.castShadow = true;
  asteroidRing.receiveShadow = true;

  // 📦 Grupo Urano + anillo
  const uranusWithRing = new THREE.Group();
  uranusWithRing.add(uranusMesh);
  uranusWithRing.add(asteroidRing);

  return uranusWithRing;
};
