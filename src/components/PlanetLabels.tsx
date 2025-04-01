"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface Planet {
  name: string;
  angle: number;
  speed: number;
  mesh: THREE.Object3D;
  inclination: number;
  a: number;
  e: number;
  orbitPoints: THREE.Vector3[];
}

const getMinZoom = (planetName: string | null) => {
  switch (planetName) {
    case "Pluto": case "Mercury": case "Eris": case "Ceres": case "Haumea": case "Makemake": return 5; 
    case "Venus": case "Earth": return 35;
    case "Mars": return 20; 
    case "Uranus": case "Neptune": return 160; 
    case "Jupiter": case "Saturn": return 230; 
    default: return 3400;
  }
};

export function PlanetLabels({
  sceneRef,
  cameraRef,
  planetsRef,
  showPlanetNames,
  showDwarfOrbits,
  followedPlanet,
  planetNames,
  setFollowedPlanet, // Añadido para manejar clics
  updateSpritesRef, // Referencia para pasar la función al SolarSystemScene
}: {
  sceneRef: React.RefObject<THREE.Scene | null>;
  cameraRef: React.RefObject<THREE.PerspectiveCamera | null>;
  planetsRef: React.RefObject<Planet[]>;
  showPlanetNames: boolean;
  showDwarfOrbits: boolean;
  followedPlanet: string | null;
  planetNames: { [key: string]: string };
  setFollowedPlanet: (planet: string | null) => void;
  updateSpritesRef: React.RefObject<(() => void) | null>;
}) {
  useEffect(() => {
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const planets = planetsRef.current;
    if (!scene || !camera || !planets) return;

    const dwarfPlanets = ["Pluto", "Eris", "Ceres", "Haumea", "Makemake"];
    const spriteElements: { planet: Planet; sprite: THREE.Sprite }[] = [];

    planets.forEach(planet => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const fontSize = 12;
      canvas.width = 512;
      canvas.height = 128;
      ctx.scale(2, 2);

      ctx.fillStyle = "rgba(0, 0, 0, 0)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#ffffff";
      ctx.font = `${fontSize}px 'VT323', monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(planetNames[planet.name], canvas.width / 4, canvas.height / 4);
      ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
      ctx.shadowBlur = 5;
      ctx.fillText(planetNames[planet.name], canvas.width / 4, canvas.height / 4);
      ctx.shadowColor = "rgba(255, 255, 255, 0.6)";
      ctx.shadowBlur = 10;
      ctx.fillText(planetNames[planet.name], canvas.width / 4, canvas.height / 4);
      ctx.shadowBlur = 0;
      ctx.fillText(planetNames[planet.name], canvas.width / 4, canvas.height / 4);

      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
      const sprite = new THREE.Sprite(material);

      sprite.position.copy(planet.mesh.position);
      sprite.userData = { planetName: planet.name };

      spriteElements.push({ planet, sprite });
      scene.add(sprite);
    });

    const updateSprites = () => {
      spriteElements.forEach(({ planet, sprite }) => {
        const isDwarf = dwarfPlanets.includes(planet.name);
        const shouldShow = showPlanetNames && (!isDwarf || showDwarfOrbits);

        sprite.visible = shouldShow;

        if (shouldShow) {
          let offsetY: number;

          if (followedPlanet) {
            if (planet.name === followedPlanet) {
              offsetY = getMinZoom(planet.name) * 1.1 + 5;
            } else {
              offsetY = getMinZoom(planet.name) + 130; 
            }
          } else {
            // Sin planeta seguido: zoom moderado
            offsetY = getMinZoom(planet.name) + 200;
          }

          sprite.position.copy(planet.mesh.position);
          sprite.position.y += offsetY;

          const distance = camera.position.distanceTo(sprite.position);
          const scaleFactor = Math.max(1, distance * 0.006);
          sprite.scale.lerp(new THREE.Vector3(scaleFactor * 100, scaleFactor * 30, 1), 0.5);
        }
      });
    };

    // Pasar la función updateSprites al ref para usarla en SolarSystemScene
    updateSpritesRef.current = updateSprites;

    const onClick = (event: MouseEvent) => {
      const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(spriteElements.map(se => se.sprite));
      if (intersects.length > 0) {
        const clickedSprite = intersects[0].object as THREE.Sprite;
        const planetName = clickedSprite.userData.planetName;
        setFollowedPlanet(planetName);
      }
    };

    window.addEventListener("click", onClick);

    return () => {
      spriteElements.forEach(({ sprite }) => scene.remove(sprite));
      spriteElements.forEach(({ sprite }) => sprite.material.map?.dispose());
      spriteElements.forEach(({ sprite }) => sprite.material.dispose());
      window.removeEventListener("click", onClick);
      updateSpritesRef.current = null; // Limpiar la referencia
    };
  }, [showPlanetNames, showDwarfOrbits, followedPlanet, planetNames, setFollowedPlanet]);

  return null;
}