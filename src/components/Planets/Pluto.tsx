import * as THREE from "three";

export const Pluto = ({ timeScaleFactorRef }: { timeScaleFactorRef?: React.RefObject<number> }) => {
  const textureLoader = new THREE.TextureLoader();

  // Plutón
  const plutoTexture = textureLoader.load("/textures/pluto.jpg");
  const plutoGeometry = new THREE.SphereGeometry(0.3); // Tamaño pequeño para Plutón
  const plutoMaterial = new THREE.MeshPhongMaterial({
    map: plutoTexture,
    shininess: 5,
    specular: new THREE.Color(0x222222),
    color: new THREE.Color(0xaaaaaa),
  });
  const plutoMesh = new THREE.Mesh(plutoGeometry, plutoMaterial);
  plutoMesh.castShadow = true;
  plutoMesh.receiveShadow = true;

  // Caronte
  const charonTexture = textureLoader.load("/textures/moons/charon.jpg");
  const charonGeometry = new THREE.SphereGeometry(0.2); 
  const charonMaterial = new THREE.MeshPhongMaterial({
    map: charonTexture,
    shininess: 5,
    specular: new THREE.Color(0x222222),
    color: new THREE.Color(0xaaaaaa),
  });
  const charonMesh = new THREE.Mesh(charonGeometry, charonMaterial);
  charonMesh.castShadow = true;
  charonMesh.receiveShadow = true;

  // Grupo Plutón + Caronte
  const plutoGroup = new THREE.Group();
  plutoGroup.add(plutoMesh);
  plutoGroup.add(charonMesh);

  let charonAngle = 0;
  const charonOrbitRadius = 2; 
  const baseCharonOrbitSpeed = 0.015; 

  const animate = () => {
    const timeScaleFactor = timeScaleFactorRef?.current ?? 7;
    const scaledCharonOrbitSpeed = baseCharonOrbitSpeed * timeScaleFactor;

    charonAngle += scaledCharonOrbitSpeed;
    if (charonAngle > 2 * Math.PI) charonAngle -= 2 * Math.PI;

    const charonX = Math.cos(charonAngle) * charonOrbitRadius;
    const charonZ = Math.sin(charonAngle) * charonOrbitRadius;
    charonMesh.position.set(charonX, 0, charonZ);

    charonMesh.rotation.y += 0.0002 * timeScaleFactor;

    requestAnimationFrame(animate);
  };
  animate();

  return plutoGroup;
};