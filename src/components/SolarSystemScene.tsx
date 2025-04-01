"use client";

import { useEffect } from "react";
import * as THREE from "three";
import { Sun } from "./Space/Sun";
import { Stars } from "./Space/Stars";
import { Mercury } from "./Planets/Mercury";
import { Venus } from "./Planets/Venus";
import { Earth } from "./Planets/Earth";
import { Mars } from "./Planets/Mars";
import { Jupiter } from "./Planets/Jupiter";
import { Saturn } from "./Planets/Saturn";
import { Uranus } from "./Planets/Uranus";
import { Neptune } from "./Planets/Neptune";
import { Pluto } from "./Planets/Pluto";
import { Eris } from "./Planets/Eris";
import { Ceres } from "./Planets/Ceres";
import { Haumea } from "./Planets/Haumea";
import { Makemake } from "./Planets/Makemake";

interface Planet {
  name: string;
  angle: number;
  speed: number;
  mesh: THREE.Object3D;
  inclination: number;
  a: number;
  e: number;
  orbitPoints: THREE.Vector3[]; // Puntos precalculados de la órbita
}

const dwarfPlanets = ["Pluto", "Eris", "Ceres", "Haumea", "Makemake"];

export function SolarSystemScene({
  canvasRef,
  sceneRef,
  cameraRef,
  rendererRef,
  planetsRef,
  sunRef,
  rotationRef,
  setFollowedPlanet,
  showDwarfOrbits,
  setIsLoading,
  updateSpritesRef,
  updateCameraRef,
}: {
  canvasRef: React.RefObject<HTMLDivElement> | null;
  sceneRef: React.RefObject<THREE.Scene | null>;
  cameraRef: React.RefObject<THREE.PerspectiveCamera | null>;
  rendererRef: React.RefObject<THREE.WebGLRenderer | null>;
  planetsRef: React.RefObject<Planet[]>;
  sunRef: React.RefObject<THREE.Object3D | null>;
  rotationRef: React.RefObject<{ x: number; y: number; z: number }>;
  zoomDistanceRef: React.RefObject<number>;
  setFollowedPlanet: (planet: string | null) => void;
  showDwarfOrbits: boolean;
  setIsLoading: (loading: boolean) => void;
  getMinZoom: (planetName: string | null) => number;
  MAX_ZOOM: number;
  followedPlanet: string | null;
  updateSpritesRef: React.RefObject<(() => void) | null>;
  updateCameraRef: React.RefObject<(() => void) | null>;
}) {
  useEffect(() => {
    if (!canvasRef || !canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50000000);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    canvasRef.current.appendChild(renderer.domElement);

    const sun = Sun({ cameraRef });
    scene.add(sun);
    sunRef.current = sun;

    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const stars = Stars();
    scene.add(stars);

    const planets: Planet[] = [
      { name: "Mercury", angle: 19, speed: 0.004, mesh: Mercury(), a: 166400, e: 0.2056, inclination: 7.00, orbitPoints: [] },
      { name: "Venus", angle: 16, speed: 0.0035, mesh: Venus(), a: 310943, e: 0.0068, inclination: 3.39, orbitPoints: [] },
      { name: "Earth", angle: 13, speed: 0.003, mesh: Earth(), a: 429873, e: 0.0167, inclination: 0.00, orbitPoints: [] },
      { name: "Mars", angle: 11, speed: 0.0025, mesh: Mars(), a: 654774, e: 0.0934, inclination: 1.85, orbitPoints: [] },
      { name: "Jupiter", angle: 147, speed: 0.0015, mesh: Jupiter(), a: 2237118, e: 0.0484, inclination: 1.31, orbitPoints: [] },
      { name: "Saturn", angle: 4, speed: 0.001, mesh: Saturn(), a: 4118616, e: 0.0556, inclination: 2.49, orbitPoints: [] },
      { name: "Uranus", angle: 2, speed: 0.0006, mesh: Uranus(), a: 8255094, e: 0.0472, inclination: 0.77, orbitPoints: [] },
      { name: "Neptune", angle: 1, speed: 0.0004, mesh: Neptune(), a: 12927625, e: 0.0086, inclination: 1.77, orbitPoints: [] },
      { name: "Pluto", angle: 0, speed: 0.0002, mesh: Pluto(), a: 16971614, e: 0.2488, inclination: 17.14, orbitPoints: [] },
      { name: "Eris", angle: 0, speed: 0.0002, mesh: Eris(), a: 29080020, e: 0.436, inclination: 44, orbitPoints: [] },
      { name: "Ceres", angle: 0, speed: 0.0025, mesh: Ceres(), a: 1189629, e: 0.075, inclination: 10.7, orbitPoints: [] },
      { name: "Haumea", angle: 2, speed: 0.0002, mesh: Haumea(), a: 18539822, e: 0.195, inclination: 28.2, orbitPoints: [] },
      { name: "Makemake", angle: 16, speed: 0.0002, mesh: Makemake(), a: 19683475, e: 0.159, inclination: 29, orbitPoints: [] },
    ];

    planets.forEach(({ mesh, name, a, e, inclination }) => {
      scene.add(mesh);
    
      const b = a * Math.sqrt(1 - e * e);
      const inclinacionRad = THREE.MathUtils.degToRad(inclination);
    
      // Aumentar la precisión de la órbita a 10,000 puntos
      const points: THREE.Vector3[] = Array.from({ length: 10000 }, (_, i) => {
        const theta = (i / 9999) * 2 * Math.PI; // 9999 en vez de 10000 para evitar superposición
        const x = a * Math.cos(theta);
        const zBase = b * Math.sin(theta);
        return new THREE.Vector3(x, zBase * Math.sin(inclinacionRad), zBase * Math.cos(inclinacionRad));
      });
    
      // Crear la órbita visual
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: 0xffffff });
      const orbit = new THREE.Line(geometry, material);
    
      orbit.visible = !dwarfPlanets.includes(name) || showDwarfOrbits;
      orbit.userData = { isDwarfOrbit: dwarfPlanets.includes(name) };
      scene.add(orbit);
    
      // Almacenar los puntos en el planeta
      const planet = planets.find(p => p.name === name)!;
      planet.orbitPoints = points;
      mesh.userData.name = name; // Para depuración
    });

    planetsRef.current = planets;

    let isDragging = false;
    let previousX = 0,
      previousY = 0;

    const onMouseDown = (event: MouseEvent) => {
      isDragging = true;
      previousX = event.clientX;
      previousY = event.clientY;
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = event.clientX - previousX;
      const deltaY = event.clientY - previousY;
      rotationRef.current.x -= deltaX * 0.002;
      rotationRef.current.y += deltaY * 0.002;
      rotationRef.current.y = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, rotationRef.current.y));
      previousX = event.clientX;
      previousY = event.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onClick = (event: MouseEvent) => {
      const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      for (const planet of planets) {
        const intersects = raycaster.intersectObject(planet.mesh);
        if (intersects.length > 0) {
          setFollowedPlanet(planet.name);
          return;
        }
      }
      const intersectsSun = raycaster.intersectObject(sun);
      if (intersectsSun.length > 0) setFollowedPlanet(null);
    };

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("click", onClick);

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    let hasRenderedFirstFrame = false;

    const animate = () => {
      requestAnimationFrame(animate);
      planets.forEach(({ mesh, speed, orbitPoints }) => {
        // Actualizar el ángulo
        mesh.userData.angle = (mesh.userData.angle ?? 0) + speed;
        if (mesh.userData.angle > 2 * Math.PI) mesh.userData.angle -= 2 * Math.PI;

        // Calcular índice fraccional para interpolación
        const t = (mesh.userData.angle / (2 * Math.PI)) * (orbitPoints.length - 1);
        const index = Math.floor(t);
        const fraction = t - index; // Parte fraccional entre 0 y 1

        // Obtener los dos puntos adyacentes
        const point1 = orbitPoints[index];
        const point2 = orbitPoints[(index + 1) % orbitPoints.length]; // Usar módulo para cerrar la órbita

        // Interpolar entre point1 y point2
        const interpolatedPosition = point1.clone().lerp(point2, fraction);
        mesh.position.copy(interpolatedPosition);

        // Rotación del planeta sobre su eje
        mesh.rotation.y += 0.002;
      });

      if (updateSpritesRef.current) {
        updateSpritesRef.current();
      }
      if (updateCameraRef.current) {
        updateCameraRef.current(); 
      }
      renderer.render(scene, camera);
      if (!hasRenderedFirstFrame) {
        hasRenderedFirstFrame = true;
        setTimeout(() => setIsLoading(false), 500);
      }
    };
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("click", onClick);
      canvasRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return null;
}