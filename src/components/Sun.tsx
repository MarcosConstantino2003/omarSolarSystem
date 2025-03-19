import * as THREE from "three";

export const Sun = () => {
  const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
  const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  return new THREE.Mesh(sunGeometry, sunMaterial);
};