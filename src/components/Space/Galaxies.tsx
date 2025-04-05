import * as THREE from "three";

const createGalaxyTexture = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
  
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
    gradient.addColorStop(0.5, "rgba(200, 200, 255, 0.3)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
  
    return new THREE.CanvasTexture(canvas);
  };
  
  export const Galaxies = () => {
    const galaxyGroup = new THREE.Group();
    const galaxyTexture = createGalaxyTexture();
  
    const galaxyCount = 15;
    const radius = 1200000;
  
    for (let i = 0; i < galaxyCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
  
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
  
      const material = new THREE.SpriteMaterial({
        map: galaxyTexture,
        color: 0xccccff, // Tinte azulado
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthTest: true,
      });
  
      const sprite = new THREE.Sprite(material);
      sprite.position.set(x, y, z);
  
      const size = Math.random() * 50000 + 25000;
      sprite.scale.set(size, size, 1);
  
      galaxyGroup.add(sprite);
    }
  
    return galaxyGroup;
  };