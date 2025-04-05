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
    case "Pluto": case "Mercury": case "Eris": case "Ceres": case "Haumea": case "Makemake": return 0.5;
    case "Venus": case "Earth": return 3.5;
    case "Mars": return 2.0;
    case "Uranus": case "Neptune": return 25.0;
    case "Jupiter": case "Saturn": return 40.0;
    default: return 340.0;
  }
};

const getMoonOffsetY = (moonName: string) => {
  switch (moonName) {
    case "Phobos": case "Deimos": case "Namaka": case "MK2": case "Charon": case "Enceladus": return 0.5;
    case "Moon": case "Mimas": case "Miranda": case "Proteus": case "Hiiaka": case "Rhea": case "Tethys": case "Iapetus": return 1;
    case "Ariel": case "Umbriel": return 2;
    case "Dhione": case "Io": case "Europa": case "Ganymede": case "Oberon": case "Titania": case "Triton": return 3;
    case "Callisto": case "Titan": return 5;
    default: return 0.5;
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
  setFollowedPlanet,
  updateSpritesRef,
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
    const spriteElements: { object: THREE.Object3D; sprite: THREE.Sprite; name: string; isMoon: boolean; parentPlanet?: string }[] = [];

    const moonNames: { [key: string]: string } = {
      Moon: "Luna",
      Phobos: "Phobos",
      Deimos: "Deimos",
      Charon: "Caronte",
      Io: "Io",
      Europa: "Europa",
      Ganymede: "Ganímedes",
      Callisto: "Calisto",
      Titan: "Titán",
      Rhea: "Rea",
      Iapetus: "Jápeto",
      Dione: "Dione",
      Tethys: "Tetis",
      Enceladus: "Encélado",
      Mimas: "Mimas",
      Titania: "Titania",
      Oberon: "Oberón",
      Umbriel: "Umbriel",
      Ariel: "Ariel",
      Miranda: "Miranda",
      Triton: "Tritón",
      Proteus: "Proteo",
      Hiiaka: "Hiʻiaka",
      Namaka: "Namaka",
      MK2: "MK2",
      Dysnomia: "Disnomia",
    };

    const moonLabelSizeByPlanet: { [key: string]: number } = {
      Pluto: 1,
      Mars: 2,
      Earth: 2,
      Jupiter: 30,
      Saturn: 6,
      Uranus: 8,
      Neptune: 6,
      Haumea: 2,
      Makemake: 1,
      Eris: 1,
    };

    const createSprite = (name: string, object: THREE.Object3D, isMoon: boolean, parentPlanet?: string) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const baseFontSize = isMoon ? 8 : 16;
      const sizeFactor = 1 + getMinZoom(name) / 100;
      const fontSize = baseFontSize * sizeFactor;

      canvas.width = 512;
      canvas.height = 128;
      ctx.scale(2, 2);

      ctx.fillStyle = "rgba(0, 0, 0, 0)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#ffffff";
      ctx.font = `${fontSize}px 'VT323', monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const displayName = isMoon ? moonNames[name] : planetNames[name];
      ctx.fillText(displayName, canvas.width / 4, canvas.height / 4);
      ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
      ctx.shadowBlur = 5;
      ctx.fillText(displayName, canvas.width / 4, canvas.height / 4);
      ctx.shadowColor = "rgba(255, 255, 255, 0.6)";
      ctx.shadowBlur = 10;
      ctx.fillText(displayName, canvas.width / 4, canvas.height / 4);
      ctx.shadowBlur = 0;
      ctx.fillText(displayName, canvas.width / 4, canvas.height / 4);

      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
      const sprite = new THREE.Sprite(material);

      sprite.position.copy(object.position);
      sprite.userData = { name, isMoon, parentPlanet };

      spriteElements.push({ object, sprite, name, isMoon, parentPlanet });
      scene.add(sprite);
    };

    planets.forEach(planet => {
      console.log(`Planeta: ${planet.name}, es Group: ${planet.mesh instanceof THREE.Group}, hijos: ${planet.mesh.children?.length}`);
      createSprite(planet.name, planet.mesh, false);

      if (planet.mesh instanceof THREE.Group) {
        planet.mesh.children.forEach((child, index) => {
          if (index > 0) { // Excluir el planeta (primer hijo)
            let moonName: string;
            switch (planet.name) {
              case "Earth":
                moonName = "Moon";
                break;
              case "Mars":
                moonName = index === 1 ? "Phobos" : "Deimos";
                break;
              case "Pluto":
                moonName = "Charon";
                break;
              case "Jupiter":
                moonName = ["Io", "Europa", "Ganymede", "Callisto"][index - 1];
                break;
              case "Saturn":
                moonName = ["Titan", "Rhea", "Iapetus", "Dione", "Tethys", "Enceladus", "Mimas"][index - 2];
                break;
              case "Uranus":
                if (index === 1) return; // Saltar asteroidRing
                moonName = ["Titania", "Oberon", "Umbriel", "Ariel", "Miranda"][index - 2];
                break;
              case "Neptune":
                moonName = ["Triton", "Proteus"][index - 1];
                break;
              case "Haumea":
                moonName = ["Hiiaka", "Namaka"][index - 1];
                break;
              case "Makemake":
                moonName = "MK2";
                break;
              case "Eris":
                moonName = "Dysnomia";
                break;
              default:
                return;
            }
            console.log(`Creando luna: ${moonName} para ${planet.name}`);
            createSprite(moonName, child, true, planet.name);
          }
        });
      }
    });

    console.log("Sprites creados:", spriteElements.map(se => ({ name: se.name, isMoon: se.isMoon, parentPlanet: se.parentPlanet })));

    const updateSprites = () => {
      spriteElements.forEach(({ object, sprite, name, isMoon, parentPlanet }) => {
        const isDwarf = dwarfPlanets.includes(name); // Si el objeto actual es un planeta enano
        const isParentDwarf = parentPlanet && dwarfPlanets.includes(parentPlanet); // Si el planeta padre es enano

        // Visibilidad para planetas
        const planetShouldShow = showPlanetNames && (!isDwarf || showDwarfOrbits);
        // Visibilidad para lunas: solo se muestran si el planeta seguido es el padre y, si es enano, las órbitas de enanos están activadas
        const moonShouldShow = showPlanetNames && followedPlanet === parentPlanet && (!isParentDwarf || showDwarfOrbits);

        // Aplicar la visibilidad según si es luna o planeta
        sprite.visible = isMoon ? moonShouldShow : planetShouldShow;

        if (sprite.visible) {
          let offsetY = isMoon ? getMoonOffsetY(name) : (followedPlanet === name ? getMinZoom(name) * 1.1 + 2 : getMinZoom(name) + 5);
          if (!followedPlanet && !isMoon) offsetY = getMinZoom(name) + 20;

          // Usar posición global del objeto (planeta o luna)
          const targetPosition = new THREE.Vector3();
          object.getWorldPosition(targetPosition);
          targetPosition.y += offsetY;
          sprite.position.copy(targetPosition);

          const baseScale = 20;
          const followedBaseScale = 5 + getMinZoom(name) * 2;
          const distance = camera.position.distanceTo(sprite.position);
          const scaleFactor = Math.max(1, distance * 0.015);
          const distanceThreshold = 500;

          const isFollowed = name === followedPlanet || (isMoon && parentPlanet === followedPlanet);

          if (isFollowed) {
            let scale;
            if (isMoon && parentPlanet) {
              const moonBaseScale = moonLabelSizeByPlanet[parentPlanet] || 2;
              scale = distance < distanceThreshold ? moonBaseScale : (baseScale * scaleFactor) / 4;
            } else {
              scale = distance < distanceThreshold ? followedBaseScale : baseScale * scaleFactor;
            }
            sprite.scale.set(scale, scale / 3, 1);
          } else {
            sprite.scale.set(baseScale * scaleFactor, (baseScale * scaleFactor) / 3, 1);
          }

          console.log(`Sprite ${name} - Posición:`, sprite.position, `Escala:`, sprite.scale, `Distancia:`, distance);
        }
      });
    };

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
        const spriteData = spriteElements.find(se => se.sprite === clickedSprite);
        if (spriteData && !spriteData.isMoon) {
          setFollowedPlanet(spriteData.name);
        }
      }
    };

    window.addEventListener("click", onClick);

    return () => {
      spriteElements.forEach(({ sprite }) => scene.remove(sprite));
      spriteElements.forEach(({ sprite }) => sprite.material.map?.dispose());
      spriteElements.forEach(({ sprite }) => sprite.material.dispose());
      window.removeEventListener("click", onClick);
      updateSpritesRef.current = null;
    };
  }, [showPlanetNames, showDwarfOrbits, followedPlanet, planetNames, setFollowedPlanet]);

  return null;
}