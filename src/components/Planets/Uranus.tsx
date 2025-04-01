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

  // Anillo de Urano 
  const asteroidGeometry = new THREE.BufferGeometry();
  const numAsteroids = 8000; 
  const innerRadius = 200;  
  const middleRadius = 230; 
  const outerRadius = 250;  
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
    const y = (Math.random() - 0.5) * 5;
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
    size: 2,
  });

  const asteroidRing = new THREE.Points(asteroidGeometry, asteroidMaterial);
  asteroidRing.rotation.x = Math.PI * 1.75; // Inclinación de 100 grados (~1.75 pi)
  asteroidRing.castShadow = true;
  asteroidRing.receiveShadow = true;

  // Grupo Urano + anillo
  const uranusWithRing = new THREE.Group();
  uranusWithRing.add(uranusMesh);
  uranusWithRing.add(asteroidRing);

  return uranusWithRing;
};
