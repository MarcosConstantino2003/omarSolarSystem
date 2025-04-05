import * as THREE from "three";

export const Haumea = ({ timeScaleFactorRef }: { timeScaleFactorRef?: React.RefObject<number> }) => {
  const textureLoader = new THREE.TextureLoader();

  // 🌑 Haumea: planeta enano
  const haumeaTexture = textureLoader.load("/textures/haumea.jpg");
  const haumeaGeometry = new THREE.SphereGeometry(0.22);
  const haumeaMaterial = new THREE.MeshPhongMaterial({
    map: haumeaTexture,
    shininess: 5,
    specular: new THREE.Color(0x222222),
    color: new THREE.Color(0xaaaaaa),
  });
  const haumeaMesh = new THREE.Mesh(haumeaGeometry, haumeaMaterial);
  haumeaMesh.castShadow = true;
  haumeaMesh.receiveShadow = true;

  // Hiʻiaka
  const hiiakaTexture = textureLoader.load("/textures/moons/hiiaka.jpg");
  const hiiakaGeometry = new THREE.SphereGeometry(0.057);
  const hiiakaMaterial = new THREE.MeshPhongMaterial({
    map: hiiakaTexture,
    shininess: 5,
    specular: new THREE.Color(0x222222),
    color: new THREE.Color(0xaaaaaa),
  });
  const hiiakaMesh = new THREE.Mesh(hiiakaGeometry, hiiakaMaterial);
  hiiakaMesh.castShadow = true;
  hiiakaMesh.receiveShadow = true;

  // Namaka
  const namakaTexture = textureLoader.load("/textures/moons/namaka.jpg");
  const namakaGeometry = new THREE.SphereGeometry(0.030);
  const namakaMaterial = new THREE.MeshPhongMaterial({
    map: namakaTexture,
    shininess: 5,
    specular: new THREE.Color(0x222222),
    color: new THREE.Color(0xaaaaaa),
  });
  const namakaMesh = new THREE.Mesh(namakaGeometry, namakaMaterial);
  namakaMesh.castShadow = true;
  namakaMesh.receiveShadow = true;

  // Grupo Haumea + lunas
  const haumeaGroup = new THREE.Group();
  haumeaGroup.add(haumeaMesh);
  haumeaGroup.add(hiiakaMesh);
  haumeaGroup.add(namakaMesh);

  // Parámetros de órbita
  let hiiakaAngle = 0;
  const hiiakaOrbitRadius = 17.70;
  const baseHiiakaOrbitSpeed = 0.00195;

  let namakaAngle = 0;
  const namakaOrbitRadius = 9.10;
  const baseNamakaOrbitSpeed = 0.00524;

  // Animación
  const animate = () => {
    const timeScaleFactor = timeScaleFactorRef?.current ?? 7;

    // Rotación de Haumea sobre su eje (rápida debido a su forma elipsoidal)
    haumeaMesh.rotation.y += 0.01; // Haumea rota en ~3.9 horas, mucho más rápido que otros cuerpos

    // Órbita de Hiʻiaka
    const scaledHiiakaOrbitSpeed = baseHiiakaOrbitSpeed * timeScaleFactor;
    hiiakaAngle += scaledHiiakaOrbitSpeed;
    if (hiiakaAngle > 2 * Math.PI) hiiakaAngle -= 2 * Math.PI;
    const hiiakaX = Math.cos(hiiakaAngle) * hiiakaOrbitRadius;
    const hiiakaZ = Math.sin(hiiakaAngle) * hiiakaOrbitRadius;
    hiiakaMesh.position.set(hiiakaX, 0, hiiakaZ);
    hiiakaMesh.rotation.y += 0.0002 * timeScaleFactor;

    // Órbita de Namaka
    const scaledNamakaOrbitSpeed = baseNamakaOrbitSpeed * timeScaleFactor;
    namakaAngle += scaledNamakaOrbitSpeed;
    if (namakaAngle > 2 * Math.PI) namakaAngle -= 2 * Math.PI;
    const namakaX = Math.cos(namakaAngle) * namakaOrbitRadius;
    const namakaZ = Math.sin(namakaAngle) * namakaOrbitRadius;
    namakaMesh.position.set(namakaX, 0, namakaZ);
    namakaMesh.rotation.y += 0.0002 * timeScaleFactor;

    requestAnimationFrame(animate);
  };
  animate();

  return haumeaGroup;
};