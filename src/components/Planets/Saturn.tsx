import * as THREE from 'three';

export const Saturn = () => {
  const textureLoader = new THREE.TextureLoader();

  // 🌑 Saturno: planeta
  const saturnTexture = textureLoader.load("/textures/saturn.jpg");
  const saturnGeometry = new THREE.SphereGeometry(167); // Más detalle
  const saturnMaterial = new THREE.MeshPhongMaterial({
    map: saturnTexture,
    shininess: 5,
    specular: new THREE.Color(0x222222),
    color: new THREE.Color(0xaaaaaa),
  });
  const saturnMesh = new THREE.Mesh(saturnGeometry, saturnMaterial);
  saturnMesh.castShadow = true;
  saturnMesh.receiveShadow = true;

  const asteroidGeometry = new THREE.BufferGeometry();
  const numAsteroids = 16000; // Más asteroides
  const innerRadius = 340;
  const outerRadius = 600;

  const asteroidVertices = [];
  const asteroidColors = [];
  const color = new THREE.Color();

  for (let i = 0; i < numAsteroids; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
    const x = Math.cos(angle) * radius;
    const y = (Math.random() - 0.5) * 5; 
    const z = Math.sin(angle) * radius;
    asteroidVertices.push(x, y, z);

    // Degradado de color: gris en los bordes, amarillo/beige en el centro
    const t = (radius - innerRadius) / (outerRadius - innerRadius); 
    color.setRGB(
      0.8 - 0.8 * t,
      0.7 - 0.7 * t,
      0.5 - 0.5 * t
    );
    asteroidColors.push(color.r, color.g, color.b);
  }

  asteroidGeometry.setAttribute("position", new THREE.Float32BufferAttribute(asteroidVertices, 3));
  asteroidGeometry.setAttribute("color", new THREE.Float32BufferAttribute(asteroidColors, 3));

  // Material Phong para los asteroides
  const asteroidMaterial = new THREE.PointsMaterial({
    vertexColors: true, 
    size: 2,
  });

  // Asteroides como puntos
  const asteroidRing = new THREE.Points(asteroidGeometry, asteroidMaterial);
  asteroidRing.rotation.x = Math.PI * 1.1;
  asteroidRing.castShadow = true;
  asteroidRing.receiveShadow = true;

  const saturnWithRing = new THREE.Group();
  saturnWithRing.add(saturnMesh);
  
  saturnWithRing.add(asteroidRing);

  return saturnWithRing;
};
