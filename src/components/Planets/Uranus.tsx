import * as THREE from "three";

export const Uranus = ({ timeScaleFactorRef }: { timeScaleFactorRef?: React.RefObject<number> }) => {
  const textureLoader = new THREE.TextureLoader();

  // 🌑 Urano: planeta
  const uranusTexture = textureLoader.load("/textures/uranus.jpg");
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
  const asteroidAngles: number[] = [];
  const asteroidRadii: number[] = [];
  const color = new THREE.Color();

  for (let i = 0; i < numAsteroids; i++) {
    const angle = Math.random() * Math.PI * 2;
    let radius = Math.random() * (outerRadius - innerRadius) + innerRadius;

    if (radius < middleRadius) {
      radius = innerRadius + Math.random() * (middleRadius - innerRadius); // Capa interna
    } else {
      radius = middleRadius + Math.random() * (outerRadius - middleRadius); // Capa externa
    }

    const x = Math.cos(angle) * radius;
    const y = (Math.random() - 0.5) * 0.5;
    const z = Math.sin(angle) * radius;
    asteroidVertices.push(x, y, z);
    asteroidAngles.push(angle);
    asteroidRadii.push(radius);

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

  // Titania
  const titaniaTexture = textureLoader.load("/textures/moons/titania.jpg");
  const titaniaGeometry = new THREE.SphereGeometry(0.227);
  const titaniaMaterial = new THREE.MeshPhongMaterial({
    map: titaniaTexture,
    shininess: 5,
    specular: new THREE.Color(0x222222),
    color: new THREE.Color(0xaaaaaa),
  });
  const titaniaMesh = new THREE.Mesh(titaniaGeometry, titaniaMaterial);
  titaniaMesh.castShadow = true;
  titaniaMesh.receiveShadow = true;

  // Oberón
  const oberonTexture = textureLoader.load("/textures/moons/oberon.jpg");
  const oberonGeometry = new THREE.SphereGeometry(0.219);
  const oberonMaterial = new THREE.MeshPhongMaterial({
    map: oberonTexture,
    shininess: 5,
    specular: new THREE.Color(0x222222),
    color: new THREE.Color(0xaaaaaa),
  });
  const oberonMesh = new THREE.Mesh(oberonGeometry, oberonMaterial);
  oberonMesh.castShadow = true;
  oberonMesh.receiveShadow = true;

  // Umbriel
  const umbrielTexture = textureLoader.load("/textures/moons/umbriel.jpg");
  const umbrielGeometry = new THREE.SphereGeometry(0.168);
  const umbrielMaterial = new THREE.MeshPhongMaterial({
    map: umbrielTexture,
    shininess: 5,
    specular: new THREE.Color(0x222222),
    color: new THREE.Color(0xaaaaaa),
  });
  const umbrielMesh = new THREE.Mesh(umbrielGeometry, umbrielMaterial);
  umbrielMesh.castShadow = true;
  umbrielMesh.receiveShadow = true;

  // Ariel
  const arielTexture = textureLoader.load("/textures/moons/ariel.png");
  const arielGeometry = new THREE.SphereGeometry(0.167);
  const arielMaterial = new THREE.MeshPhongMaterial({
    map: arielTexture,
    shininess: 5,
    specular: new THREE.Color(0x222222),
    color: new THREE.Color(0xaaaaaa),
  });
  const arielMesh = new THREE.Mesh(arielGeometry, arielMaterial);
  arielMesh.castShadow = true;
  arielMesh.receiveShadow = true;

  // Miranda
  const mirandaTexture = textureLoader.load("/textures/moons/miranda.png");
  const mirandaGeometry = new THREE.SphereGeometry(0.068);
  const mirandaMaterial = new THREE.MeshPhongMaterial({
    map: mirandaTexture,
    shininess: 5,
    specular: new THREE.Color(0x222222),
    color: new THREE.Color(0xaaaaaa),
  });
  const mirandaMesh = new THREE.Mesh(mirandaGeometry, mirandaMaterial);
  mirandaMesh.castShadow = true;
  mirandaMesh.receiveShadow = true;

  // Grupo Urano + anillo + lunas
  const uranusWithRing = new THREE.Group();
  uranusWithRing.add(uranusMesh);
  uranusWithRing.add(asteroidRing);
  uranusWithRing.add(titaniaMesh);
  uranusWithRing.add(oberonMesh);
  uranusWithRing.add(umbrielMesh);
  uranusWithRing.add(arielMesh);
  uranusWithRing.add(mirandaMesh);

  // Parámetros de órbita
  let titaniaAngle = 0;
  const titaniaOrbitRadius = 125.50;
  const baseTitaniaOrbitSpeed = 0.011;

  let oberonAngle = 0;
  const oberonOrbitRadius = 168.00;
  const baseOberonOrbitSpeed = 0.0071;

  let umbrielAngle = 0;
  const umbrielOrbitRadius = 76.65;
  const baseUmbrielOrbitSpeed = 0.023;

  let arielAngle = 0;
  const arielOrbitRadius = 55.00;
  const baseArielOrbitSpeed = 0.038;

  let mirandaAngle = 0;
  const mirandaOrbitRadius = 37.40;
  const baseMirandaOrbitSpeed = 0.068;

  // Animación
  const animate = () => {
    const timeScaleFactor = timeScaleFactorRef?.current ?? 7;

    // Rotación de Urano sobre su eje
    uranusMesh.rotation.y += 0.0015;

    // Rotación diferencial de los asteroides
    const positions = asteroidGeometry.attributes.position.array as Float32Array;
    for (let i = 0; i < numAsteroids; i++) {
      const radius = asteroidRadii[i];
      const orbitSpeed = (0.01 / Math.sqrt(radius)) * timeScaleFactor; // Escalar con timeScaleFactor
      asteroidAngles[i] += orbitSpeed;
      if (asteroidAngles[i] > 2 * Math.PI) asteroidAngles[i] -= 2 * Math.PI;

      const x = Math.cos(asteroidAngles[i]) * radius;
      const z = Math.sin(asteroidAngles[i]) * radius;
      const y = positions[i * 3 + 1];

      positions[i * 3] = x;
      positions[i * 3 + 2] = z;
    }
    asteroidGeometry.attributes.position.needsUpdate = true;

    // Órbita de Titania
    const scaledTitaniaOrbitSpeed = baseTitaniaOrbitSpeed * timeScaleFactor;
    titaniaAngle += scaledTitaniaOrbitSpeed;
    if (titaniaAngle > 2 * Math.PI) titaniaAngle -= 2 * Math.PI;
    const titaniaX = Math.cos(titaniaAngle) * titaniaOrbitRadius;
    const titaniaZ = Math.sin(titaniaAngle) * titaniaOrbitRadius;
    titaniaMesh.position.set(titaniaX, 0, titaniaZ);
    titaniaMesh.rotation.y += 0.0002 * timeScaleFactor;

    // Órbita de Oberón
    const scaledOberonOrbitSpeed = baseOberonOrbitSpeed * timeScaleFactor;
    oberonAngle += scaledOberonOrbitSpeed;
    if (oberonAngle > 2 * Math.PI) oberonAngle -= 2 * Math.PI;
    const oberonX = Math.cos(oberonAngle) * oberonOrbitRadius;
    const oberonZ = Math.sin(oberonAngle) * oberonOrbitRadius;
    oberonMesh.position.set(oberonX, 0, oberonZ);
    oberonMesh.rotation.y += 0.0002 * timeScaleFactor;

    // Órbita de Umbriel
    const scaledUmbrielOrbitSpeed = baseUmbrielOrbitSpeed * timeScaleFactor;
    umbrielAngle += scaledUmbrielOrbitSpeed;
    if (umbrielAngle > 2 * Math.PI) umbrielAngle -= 2 * Math.PI;
    const umbrielX = Math.cos(umbrielAngle) * umbrielOrbitRadius;
    const umbrielZ = Math.sin(umbrielAngle) * umbrielOrbitRadius;
    umbrielMesh.position.set(umbrielX, 0, umbrielZ);
    umbrielMesh.rotation.y += 0.0002 * timeScaleFactor;

    // Órbita de Ariel
    const scaledArielOrbitSpeed = baseArielOrbitSpeed * timeScaleFactor;
    arielAngle += scaledArielOrbitSpeed;
    if (arielAngle > 2 * Math.PI) arielAngle -= 2 * Math.PI;
    const arielX = Math.cos(arielAngle) * arielOrbitRadius;
    const arielZ = Math.sin(arielAngle) * arielOrbitRadius;
    arielMesh.position.set(arielX, 0, arielZ);
    arielMesh.rotation.y += 0.0002 * timeScaleFactor;

    // Órbita de Miranda
    const scaledMirandaOrbitSpeed = baseMirandaOrbitSpeed * timeScaleFactor;
    mirandaAngle += scaledMirandaOrbitSpeed;
    if (mirandaAngle > 2 * Math.PI) mirandaAngle -= 2 * Math.PI;
    const mirandaX = Math.cos(mirandaAngle) * mirandaOrbitRadius;
    const mirandaZ = Math.sin(mirandaAngle) * mirandaOrbitRadius;
    mirandaMesh.position.set(mirandaX, 0, mirandaZ);
    mirandaMesh.rotation.y += 0.0002 * timeScaleFactor;

    requestAnimationFrame(animate);
  };
  animate();

  return uranusWithRing;
};