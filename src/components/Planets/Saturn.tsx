import * as THREE from "three";

export const Saturn = ({ timeScaleFactorRef }: { timeScaleFactorRef?: React.RefObject<number> }) => {
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
  const asteroidAngles: number[] = [];
  const asteroidRadii: number[] = [];
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
  asteroidRing.rotation.x = Math.PI * 1.1;
  asteroidRing.castShadow = true;
  asteroidRing.receiveShadow = true;

  // Titán
  const titanTexture = textureLoader.load("/textures/moons/titan.png");
  const titanGeometry = new THREE.SphereGeometry(0.8);
  const titanMaterial = new THREE.MeshPhongMaterial({
    map: titanTexture,
    shininess: 5,
    specular: new THREE.Color(0x222222),
    color: new THREE.Color(0xaaaaaa),
  });
  const titanMesh = new THREE.Mesh(titanGeometry, titanMaterial);
  titanMesh.castShadow = true;
  titanMesh.receiveShadow = true;

  // Rea
  const rheaTexture = textureLoader.load("/textures/moons/rhea.jpg");
  const rheaGeometry = new THREE.SphereGeometry(0.24);
  const rheaMaterial = new THREE.MeshPhongMaterial({
    map: rheaTexture,
    shininess: 5,
    specular: new THREE.Color(0x222222),
    color: new THREE.Color(0xaaaaaa),
  });
  const rheaMesh = new THREE.Mesh(rheaGeometry, rheaMaterial);
  rheaMesh.castShadow = true;
  rheaMesh.receiveShadow = true;

  // Jápeto
  const iapetusTexture = textureLoader.load("/textures/moons/iapetus.jpg");
  const iapetusGeometry = new THREE.SphereGeometry(0.23);
  const iapetusMaterial = new THREE.MeshPhongMaterial({
    map: iapetusTexture,
    shininess: 5,
    specular: new THREE.Color(0x222222),
    color: new THREE.Color(0xaaaaaa),
  });
  const iapetusMesh = new THREE.Mesh(iapetusGeometry, iapetusMaterial);
  iapetusMesh.castShadow = true;
  iapetusMesh.receiveShadow = true;

  // Dione
  const dioneTexture = textureLoader.load("/textures/moons/dione.jpg");
  const dioneGeometry = new THREE.SphereGeometry(0.17);
  const dioneMaterial = new THREE.MeshPhongMaterial({
    map: dioneTexture,
    shininess: 5,
    specular: new THREE.Color(0x222222),
    color: new THREE.Color(0xaaaaaa),
  });
  const dioneMesh = new THREE.Mesh(dioneGeometry, dioneMaterial);
  dioneMesh.castShadow = true;
  dioneMesh.receiveShadow = true;

  // Tetis
  const tethysTexture = textureLoader.load("/textures/moons/tethys.jpg");
  const tethysGeometry = new THREE.SphereGeometry(0.17);
  const tethysMaterial = new THREE.MeshPhongMaterial({
    map: tethysTexture,
    shininess: 5,
    specular: new THREE.Color(0x222222),
    color: new THREE.Color(0xaaaaaa),
  });
  const tethysMesh = new THREE.Mesh(tethysGeometry, tethysMaterial);
  tethysMesh.castShadow = true;
  tethysMesh.receiveShadow = true;

  // Encélado
  const enceladusTexture = textureLoader.load("/textures/moons/enceladus.jpg");
  const enceladusGeometry = new THREE.SphereGeometry(0.08);
  const enceladusMaterial = new THREE.MeshPhongMaterial({
    map: enceladusTexture,
    shininess: 5,
    specular: new THREE.Color(0x222222),
    color: new THREE.Color(0xaaaaaa),
  });
  const enceladusMesh = new THREE.Mesh(enceladusGeometry, enceladusMaterial);
  enceladusMesh.castShadow = true;
  enceladusMesh.receiveShadow = true;

  // Mimas
  const mimasTexture = textureLoader.load("/textures/moons/mimas.jpg");
  const mimasGeometry = new THREE.SphereGeometry(0.06);
  const mimasMaterial = new THREE.MeshPhongMaterial({
    map: mimasTexture,
    shininess: 5,
    specular: new THREE.Color(0x222222),
    color: new THREE.Color(0xaaaaaa),
  });
  const mimasMesh = new THREE.Mesh(mimasGeometry, mimasMaterial);
  mimasMesh.castShadow = true;
  mimasMesh.receiveShadow = true;

  // Grupo principal
  const saturnWithRing = new THREE.Group();
  saturnWithRing.add(saturnMesh);
  saturnWithRing.add(asteroidRing);
  saturnWithRing.add(titanMesh);
  saturnWithRing.add(rheaMesh);
  saturnWithRing.add(iapetusMesh);
  saturnWithRing.add(dioneMesh);
  saturnWithRing.add(tethysMesh);
  saturnWithRing.add(enceladusMesh);
  saturnWithRing.add(mimasMesh);

  // Parámetros de órbita
  let titanAngle = 0;
  const titanOrbitRadius = 350.50;
  const baseTitanOrbitSpeed = 0.006;

  let rheaAngle = 0;
  const rheaOrbitRadius = 151.15;
  const baseRheaOrbitSpeed = 0.021;

  let iapetusAngle = 0;
  const iapetusOrbitRadius = 1021.50;
  const baseIapetusOrbitSpeed = 0.0012;

  let dioneAngle = 0;
  const dioneOrbitRadius = 108.25;
  const baseDioneOrbitSpeed = 0.035;

  let tethysAngle = 0;
  const tethysOrbitRadius = 84.50;
  const baseTethysOrbitSpeed = 0.051;

  let enceladusAngle = 0;
  const enceladusOrbitRadius = 68.28;
  const baseEnceladusOrbitSpeed = 0.070;

  let mimasAngle = 0;
  const mimasOrbitRadius = 53.20;
  const baseMimasOrbitSpeed = 0.102;

  // Animación
  const animate = () => {
    const timeScaleFactor = timeScaleFactorRef?.current ?? 7;

    // Rotación de Saturno sobre su eje
    saturnMesh.rotation.y += 0.002;

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

    // Órbita de Titán
    const scaledTitanOrbitSpeed = baseTitanOrbitSpeed * timeScaleFactor;
    titanAngle += scaledTitanOrbitSpeed;
    if (titanAngle > 2 * Math.PI) titanAngle -= 2 * Math.PI;
    const titanX = Math.cos(titanAngle) * titanOrbitRadius;
    const titanZ = Math.sin(titanAngle) * titanOrbitRadius;
    titanMesh.position.set(titanX, 0, titanZ);
    titanMesh.rotation.y += 0.0002 * timeScaleFactor;

    // Órbita de Rea
    const scaledRheaOrbitSpeed = baseRheaOrbitSpeed * timeScaleFactor;
    rheaAngle += scaledRheaOrbitSpeed;
    if (rheaAngle > 2 * Math.PI) rheaAngle -= 2 * Math.PI;
    const rheaX = Math.cos(rheaAngle) * rheaOrbitRadius;
    const rheaZ = Math.sin(rheaAngle) * rheaOrbitRadius;
    rheaMesh.position.set(rheaX, 0, rheaZ);
    rheaMesh.rotation.y += 0.0002 * timeScaleFactor;

    // Órbita de Jápeto
    const scaledIapetusOrbitSpeed = baseIapetusOrbitSpeed * timeScaleFactor;
    iapetusAngle += scaledIapetusOrbitSpeed;
    if (iapetusAngle > 2 * Math.PI) iapetusAngle -= 2 * Math.PI;
    const iapetusX = Math.cos(iapetusAngle) * iapetusOrbitRadius;
    const iapetusZ = Math.sin(iapetusAngle) * iapetusOrbitRadius;
    iapetusMesh.position.set(iapetusX, 0, iapetusZ);
    iapetusMesh.rotation.y += 0.0002 * timeScaleFactor;

    // Órbita de Dione
    const scaledDioneOrbitSpeed = baseDioneOrbitSpeed * timeScaleFactor;
    dioneAngle += scaledDioneOrbitSpeed;
    if (dioneAngle > 2 * Math.PI) dioneAngle -= 2 * Math.PI;
    const dioneX = Math.cos(dioneAngle) * dioneOrbitRadius;
    const dioneZ = Math.sin(dioneAngle) * dioneOrbitRadius;
    dioneMesh.position.set(dioneX, 0, dioneZ);
    dioneMesh.rotation.y += 0.0002 * timeScaleFactor;

    // Órbita de Tetis
    const scaledTethysOrbitSpeed = baseTethysOrbitSpeed * timeScaleFactor;
    tethysAngle += scaledTethysOrbitSpeed;
    if (tethysAngle > 2 * Math.PI) tethysAngle -= 2 * Math.PI;
    const tethysX = Math.cos(tethysAngle) * tethysOrbitRadius;
    const tethysZ = Math.sin(tethysAngle) * tethysOrbitRadius;
    tethysMesh.position.set(tethysX, 0, tethysZ);
    tethysMesh.rotation.y += 0.0002 * timeScaleFactor;

    // Órbita de Encélado
    const scaledEnceladusOrbitSpeed = baseEnceladusOrbitSpeed * timeScaleFactor;
    enceladusAngle += scaledEnceladusOrbitSpeed;
    if (enceladusAngle > 2 * Math.PI) enceladusAngle -= 2 * Math.PI;
    const enceladusX = Math.cos(enceladusAngle) * enceladusOrbitRadius;
    const enceladusZ = Math.sin(enceladusAngle) * enceladusOrbitRadius;
    enceladusMesh.position.set(enceladusX, 0, enceladusZ);
    enceladusMesh.rotation.y += 0.0002 * timeScaleFactor;

    // Órbita de Mimas
    const scaledMimasOrbitSpeed = baseMimasOrbitSpeed * timeScaleFactor;
    mimasAngle += scaledMimasOrbitSpeed;
    if (mimasAngle > 2 * Math.PI) mimasAngle -= 2 * Math.PI;
    const mimasX = Math.cos(mimasAngle) * mimasOrbitRadius;
    const mimasZ = Math.sin(mimasAngle) * mimasOrbitRadius;
    mimasMesh.position.set(mimasX, 0, mimasZ);
    mimasMesh.rotation.y += 0.0002 * timeScaleFactor;

    requestAnimationFrame(animate);
  };
  animate();

  return saturnWithRing;
};