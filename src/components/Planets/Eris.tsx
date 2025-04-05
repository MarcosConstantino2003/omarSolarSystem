import * as THREE from "three";

export const Eris = ({ timeScaleFactorRef }: { timeScaleFactorRef?: React.RefObject<number> }) => {
  const textureLoader = new THREE.TextureLoader();

  // 🌑 Eris
  const erisTexture = textureLoader.load("/textures/eris.jpg");
  const erisGeometry = new THREE.SphereGeometry(0.33); 
  const erisMaterial = new THREE.MeshPhongMaterial({
    map: erisTexture,
    shininess: 5,
    specular: new THREE.Color(0x222222),
    color: new THREE.Color(0xaaaaaa),
  });
  const erisMesh = new THREE.Mesh(erisGeometry, erisMaterial);
  erisMesh.castShadow = true;
  erisMesh.receiveShadow = true;

  // 🌑 Dysnomia (luna de Eris)
  const dysnomiaTexture = textureLoader.load("/textures/moons/dysnomia.jpg");
  const dysnomiaGeometry = new THREE.SphereGeometry(0.07); // Tamaño estimado
  const dysnomiaMaterial = new THREE.MeshPhongMaterial({
    map: dysnomiaTexture,
    shininess: 5,
    specular: new THREE.Color(0x222222),
    color: new THREE.Color(0xaaaaaa),
  });
  const dysnomiaMesh = new THREE.Mesh(dysnomiaGeometry, dysnomiaMaterial);
  dysnomiaMesh.castShadow = true;
  dysnomiaMesh.receiveShadow = true;

  // Grupo Eris + Dysnomia
  const erisGroup = new THREE.Group();
  erisGroup.add(erisMesh);
  erisGroup.add(dysnomiaMesh);

  // Parámetros de órbita
  let dysnomiaAngle = 0;
  const dysnomiaOrbitRadius = 13; // Aproximación
  const baseDysnomiaOrbitSpeed = 0.0021; // Ajustable para visualización

  // Animación
  const animate = () => {
    const timeScaleFactor = timeScaleFactorRef?.current ?? 7;

    // Rotación de Eris
    erisMesh.rotation.y += 0.001; // Rotación lenta estimada

    // Órbita de Dysnomia
    const scaledDysnomiaOrbitSpeed = baseDysnomiaOrbitSpeed * timeScaleFactor;
    dysnomiaAngle += scaledDysnomiaOrbitSpeed;
    if (dysnomiaAngle > 2 * Math.PI) dysnomiaAngle -= 2 * Math.PI;
    const dysnomiaX = Math.cos(dysnomiaAngle) * dysnomiaOrbitRadius;
    const dysnomiaZ = Math.sin(dysnomiaAngle) * dysnomiaOrbitRadius;
    dysnomiaMesh.position.set(dysnomiaX, 0, dysnomiaZ);
    dysnomiaMesh.rotation.y += 0.0002 * timeScaleFactor;

    requestAnimationFrame(animate);
  };
  animate();

  return erisGroup;
};
