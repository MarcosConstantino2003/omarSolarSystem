import * as THREE from "three";

export const Jupiter = ({ timeScaleFactorRef }: { timeScaleFactorRef?: React.RefObject<number> }) => {
  const textureLoader = new THREE.TextureLoader();

  // Júpiter
  const jupiterTexture = textureLoader.load("/textures/jupiter.jpg");
  const jupiterGeometry = new THREE.SphereGeometry(20);
  const jupiterMaterial = new THREE.MeshPhongMaterial({
    map: jupiterTexture,
    shininess: 5,
    specular: new THREE.Color(0x222222),
    color: new THREE.Color(0xaaaaaa),
  });
  const jupiterMesh = new THREE.Mesh(jupiterGeometry, jupiterMaterial);
  jupiterMesh.castShadow = true;
  jupiterMesh.receiveShadow = true;

  // Io
  const ioTexture = textureLoader.load("/textures/moons/io.jpg");
  const ioGeometry = new THREE.SphereGeometry(0.52); // Escala basada en radio real
  const ioMaterial = new THREE.MeshPhongMaterial({
    map: ioTexture,
    shininess: 5,
    specular: new THREE.Color(0x222222),
    color: new THREE.Color(0xaaaaaa),
  });
  const ioMesh = new THREE.Mesh(ioGeometry, ioMaterial);
  ioMesh.castShadow = true;
  ioMesh.receiveShadow = true;

  // Europa
  const europaTexture = textureLoader.load("/textures/moons/europa.jpg");
  const europaGeometry = new THREE.SphereGeometry(0.45);
  const europaMaterial = new THREE.MeshPhongMaterial({
    map: europaTexture,
    shininess: 5,
    specular: new THREE.Color(0x222222),
    color: new THREE.Color(0xaaaaaa),
  });
  const europaMesh = new THREE.Mesh(europaGeometry, europaMaterial);
  europaMesh.castShadow = true;
  europaMesh.receiveShadow = true;

  // Ganímedes
  const ganymedeTexture = textureLoader.load("/textures/moons/ganymede.jpg");
  const ganymedeGeometry = new THREE.SphereGeometry(0.75);
  const ganymedeMaterial = new THREE.MeshPhongMaterial({
    map: ganymedeTexture,
    shininess: 5,
    specular: new THREE.Color(0x222222),
    color: new THREE.Color(0xaaaaaa),
  });
  const ganymedeMesh = new THREE.Mesh(ganymedeGeometry, ganymedeMaterial);
  ganymedeMesh.castShadow = true;
  ganymedeMesh.receiveShadow = true;

  // Calisto
  const callistoTexture = textureLoader.load("/textures/moons/callisto.jpg");
  const callistoGeometry = new THREE.SphereGeometry(0.69);
  const callistoMaterial = new THREE.MeshPhongMaterial({
    map: callistoTexture,
    shininess: 5,
    specular: new THREE.Color(0x222222),
    color: new THREE.Color(0xaaaaaa),
  });
  const callistoMesh = new THREE.Mesh(callistoGeometry, callistoMaterial);
  callistoMesh.castShadow = true;
  callistoMesh.receiveShadow = true;

  // Grupo Júpiter + Lunas
  const jupiterGroup = new THREE.Group();
  jupiterGroup.add(jupiterMesh);
  jupiterGroup.add(ioMesh);
  jupiterGroup.add(europaMesh);
  jupiterGroup.add(ganymedeMesh);
  jupiterGroup.add(callistoMesh);

  // Parámetros de órbita
  let ioAngle = 0;
  const ioOrbitRadius = 120.62; 
  const baseIoOrbitSpeed = 0.054; 

  let europaAngle = 0;
  const europaOrbitRadius = 191.92;
  const baseEuropaOrbitSpeed = 0.027; 

  let ganymedeAngle = 0;
  const ganymedeOrbitRadius = 306.23;
  const baseGanymedeOrbitSpeed = 0.013; 

  let callistoAngle = 0;
  const callistoOrbitRadius = 538.70;
  const baseCallistoOrbitSpeed = 0.006; 
  
  const animate = () => {
    const timeScaleFactor = timeScaleFactorRef?.current ?? 7; // Valor por defecto 7
    const scaledIoOrbitSpeed = baseIoOrbitSpeed * timeScaleFactor;
    const scaledEuropaOrbitSpeed = baseEuropaOrbitSpeed * timeScaleFactor;
    const scaledGanymedeOrbitSpeed = baseGanymedeOrbitSpeed * timeScaleFactor;
    const scaledCallistoOrbitSpeed = baseCallistoOrbitSpeed * timeScaleFactor;

    // Órbita de Io
    ioAngle += scaledIoOrbitSpeed;
    if (ioAngle > 2 * Math.PI) ioAngle -= 2 * Math.PI;
    const ioX = Math.cos(ioAngle) * ioOrbitRadius;
    const ioZ = Math.sin(ioAngle) * ioOrbitRadius;
    ioMesh.position.set(ioX, 0, ioZ);
    ioMesh.rotation.y += 0.0002 * timeScaleFactor;

    // Órbita de Europa
    europaAngle += scaledEuropaOrbitSpeed;
    if (europaAngle > 2 * Math.PI) europaAngle -= 2 * Math.PI;
    const europaX = Math.cos(europaAngle) * europaOrbitRadius;
    const europaZ = Math.sin(europaAngle) * europaOrbitRadius;
    europaMesh.position.set(europaX, 0, europaZ);
    europaMesh.rotation.y += 0.0002 * timeScaleFactor;

    // Órbita de Ganímedes
    ganymedeAngle += scaledGanymedeOrbitSpeed;
    if (ganymedeAngle > 2 * Math.PI) ganymedeAngle -= 2 * Math.PI;
    const ganymedeX = Math.cos(ganymedeAngle) * ganymedeOrbitRadius;
    const ganymedeZ = Math.sin(ganymedeAngle) * ganymedeOrbitRadius;
    ganymedeMesh.position.set(ganymedeX, 0, ganymedeZ);
    ganymedeMesh.rotation.y += 0.0002 * timeScaleFactor;

    // Órbita de Calisto
    callistoAngle += scaledCallistoOrbitSpeed;
    if (callistoAngle > 2 * Math.PI) callistoAngle -= 2 * Math.PI;
    const callistoX = Math.cos(callistoAngle) * callistoOrbitRadius;
    const callistoZ = Math.sin(callistoAngle) * callistoOrbitRadius;
    callistoMesh.position.set(callistoX, 0, callistoZ);
    callistoMesh.rotation.y += 0.0002 * timeScaleFactor;

    requestAnimationFrame(animate);
  };
  animate();

  return jupiterGroup;
};