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
  getMinZoom,
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
  antialias: boolean;
  setIsLoading: (loading: boolean) => void;
  getMinZoom: (planetName: string | null) => number;
  MAX_ZOOM: number;
  followedPlanet: string | null;
}) {
  const createTextTexture = (text: string) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 256;
    canvas.height = 256;
    if (ctx) {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    }
    return new THREE.CanvasTexture(canvas);
  };

  useEffect(() => {
    if (!canvasRef || !canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000);
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

    const sun = Sun();
    scene.add(sun);
    sunRef.current = sun;

    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const stars = Stars();
    scene.add(stars);

    //a: semieje mayor, e: excentricidad
    const planets: Planet[] = [
      { name: "Mercury", angle: 19, speed: 0.004, mesh: Mercury(), a: 1800, e: 0.2056, inclination: 7.00 },
      { name: "Venus",  angle: 16, speed: 0.0035, mesh: Venus(), a: 2300, e: 0.0068, inclination: 3.39 },
      { name: "Earth", angle: 13, speed: 0.003, mesh: Earth(), a: 2700, e: 0.0167, inclination: 0.00 },
      { name: "Mars",  angle: 11, speed: 0.0025, mesh: Mars(), a: 3100, e: 0.0934, inclination: 1.85 },
      { name: "Jupiter",  angle: 147, speed: 0.0015, mesh: Jupiter(), a: 4200, e: 0.0484, inclination: 1.31 },
      { name: "Saturn", angle: 4, speed: 0.001, mesh: Saturn(), a: 5700, e: 0.0556, inclination: 2.49 },
      { name: "Uranus",  angle: 2, speed: 0.0006, mesh: Uranus(), a: 7000, e: 0.0472, inclination: 0.77 },
      { name: "Neptune",  angle: 1, speed: 0.0004, mesh: Neptune(), a: 7600, e: 0.0086, inclination: 1.77 },
      { name: "Pluto",  angle: 0, speed: 0.0002, mesh: Pluto(), a: 9000, e: 0.2488, inclination: 17.14 },
      { name: "Eris",  angle: 0, speed: 0.0002, mesh: Eris(), a: 10200, e: 0.436, inclination: 44 },
      { name: "Ceres", angle: 0, speed: 0.0025, mesh: Ceres(), a: 3800, e: 0.075, inclination: 10.7 },
      { name: "Haumea",  angle: 2, speed: 0.0002, mesh: Haumea(), a: 11610, e: 0.195, inclination: 28.2 },
      { name: "Makemake",  angle: 16, speed: 0.0002, mesh: Makemake(), a: 12258, e: 0.159, inclination: 29 },
    ];
    

    planets.forEach(({ mesh, name, a, e, inclination }) => {
      scene.add(mesh);
    
      // Calcular el semieje menor (b)
      const b = a * Math.sqrt(1 - e * e);
    
      // Convertir la inclinación a radianes
      const inclinacionRad = THREE.MathUtils.degToRad(inclination);
    
      // Generar los puntos de la órbita
      const points: THREE.Vector3[] = Array.from({ length: 101 }, (_, i) => {
        const theta = (i / 100) * 2 * Math.PI;
        const x = a * Math.cos(theta);
        const zBase = b * Math.sin(theta);
        return new THREE.Vector3(x, zBase * Math.sin(inclinacionRad), zBase * Math.cos(inclinacionRad));
      });
    
      // Crear la geometría y el material de la órbita
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: 0xffffff });
      const orbit = new THREE.Line(geometry, material);
    
      // Controlar la visibilidad de órbitas enanos
      orbit.visible = !dwarfPlanets.includes(name) || showDwarfOrbits;
      orbit.userData = { isDwarfOrbit: dwarfPlanets.includes(name) };
    
      scene.add(orbit);
    });
    
    planetsRef.current = planets;
    let isDragging = false;
    let previousX = 0, previousY = 0;

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
      planets.forEach(({ mesh, a, e, inclination, speed }) => {
        // Actualizar ángulo
        mesh.userData.angle = (mesh.userData.angle ?? 0) + speed;
        if (mesh.userData.angle > 2 * Math.PI) mesh.userData.angle -= 2 * Math.PI;
    
        // Calcular la posición orbital
        const b = a * Math.sqrt(1 - e * e);
        const x = a * Math.cos(mesh.userData.angle);
        const zBase = b * Math.sin(mesh.userData.angle);
    
        // Aplicar inclinación orbital
        const inclinacionRad = THREE.MathUtils.degToRad(inclination);
        const y = zBase * Math.sin(inclinacionRad);
        const z = zBase * Math.cos(inclinacionRad);
    
        // Aplicar la nueva posición
        mesh.position.set(x, y, z);
    
        // Rotación del planeta sobre su eje
        mesh.rotation.y += 0.002;
      });
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