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
  radius: number;
  angle: number;
  speed: number;
  mesh: THREE.Object3D;
}

const planetInclinaciones: { [key: string]: number } = {
  Mercury: 7.00, Venus: 3.39, Earth: 0.00, Mars: 1.85, Jupiter: 1.31,
  Saturn: 2.49, Uranus: 0.77, Neptune: 1.77, Pluto: 17.14, Eris: 44,
  Ceres: 10.7, Haumea: 28.2, Makemake: 29,
};

const planetEllipses: { [key: string]: { a: number; e: number } } = {
  Mercury: { a: 1800, e: 0.2056 }, Venus: { a: 2300, e: 0.0068 },
  Earth: { a: 2700, e: 0.0167 }, Mars: { a: 3100, e: 0.0934 },
  Jupiter: { a: 4200, e: 0.0484 }, Saturn: { a: 5700, e: 0.0556 },
  Uranus: { a: 7000, e: 0.0472 }, Neptune: { a: 7600, e: 0.0086 },
  Pluto: { a: 9000, e: 0.2488 }, Eris: { a: 10200, e: 0.436 },
  Ceres: { a: 3800, e: 0.075 }, Haumea: { a: 11610, e: 0.195 },
  Makemake: { a: 12258, e: 0.159 },
};

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
  antialias,
  setIsLoading,
}: {
  canvasRef: React.RefObject<HTMLDivElement> | null;
  sceneRef: React.MutableRefObject<THREE.Scene | null>;
  cameraRef: React.MutableRefObject<THREE.PerspectiveCamera | null>;
  rendererRef: React.MutableRefObject<THREE.WebGLRenderer | null>;
  planetsRef: React.MutableRefObject<Planet[]>;
  sunRef: React.MutableRefObject<THREE.Object3D | null>;
  rotationRef: React.MutableRefObject<{ x: number; y: number; z: number }>;
  setFollowedPlanet: (planet: string | null) => void;
  showDwarfOrbits: boolean;
  antialias: boolean;
  setIsLoading: (loading: boolean) => void;
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
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    canvasRef.current.appendChild(renderer.domElement);

    //Sol 
    const sun = Sun();
    scene.add(sun);
    sunRef.current = sun;

    //Luz global
    const ambientLight = new THREE.AmbientLight(0x404040, 1.7);
    scene.add(ambientLight);

    //Cubo 
    const textTexture = createTextTexture("easter egg decirle a omar");
    const testCubeMaterials = Array(6).fill(null).map(() => new THREE.MeshBasicMaterial({ map: textTexture }));
    const testCube = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100), testCubeMaterials);
    testCube.position.set(0, 0, 0);
    scene.add(testCube);

    //Estrellas
    const stars = Stars();
    scene.add(stars);

    //Planetas
    const planets: Planet[] = [
      { name: "Mercury", radius: 1800, angle: 19, speed: 0.004, mesh: Mercury() },
      { name: "Venus", radius: 2300, angle: 16, speed: 0.0035, mesh: Venus() },
      { name: "Earth", radius: 2700, angle: 13, speed: 0.003, mesh: Earth() },
      { name: "Mars", radius: 3100, angle: 11, speed: 0.0025, mesh: Mars() },
      { name: "Jupiter", radius: 4200, angle: 7, speed: 0.0015, mesh: Jupiter() },
      { name: "Saturn", radius: 5700, angle: 4, speed: 0.001, mesh: Saturn() },
      { name: "Uranus", radius: 7000, angle: 2, speed: 0.0006, mesh: Uranus() },
      { name: "Neptune", radius: 7600, angle: 1, speed: 0.0004, mesh: Neptune() },
      { name: "Pluto", radius: 9000, angle: 0, speed: 0.0002, mesh: Pluto() },
      { name: "Eris", radius: 10000, angle: 0, speed: 0.0002, mesh: Eris() },
      { name: "Ceres", radius: 7500, angle: 0, speed: 0.0002, mesh: Ceres() },
      { name: "Haumea", radius: 12000, angle: 2, speed: 0.0002, mesh: Haumea() },
      { name: "Makemake", radius: 12300, angle: 16, speed: 0.0002, mesh: Makemake() },
    ];

    // Orbitas
    planets.forEach(({ mesh, name }) => {
      scene.add(mesh);

      // Parámetros de la elipse
      const { a, e } = planetEllipses[name];
      const b = a * Math.sqrt(1 - e * e); // Semieje menor
      const inclinacion = THREE.MathUtils.degToRad(planetInclinaciones[name]);

      // Generar puntos de la elipse en el plano XZ
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= 100; i++) {
        const theta = (i / 100) * 2 * Math.PI;
        const x = a * Math.cos(theta); // Coordenada X
        const zBase = b * Math.sin(theta); // Coordenada Z antes de inclinación
        const y = zBase * Math.sin(inclinacion); // Coordenada Y ajustada por inclinación
        const z = zBase * Math.cos(inclinacion); // Coordenada Z ajustada por inclinación
        points.push(new THREE.Vector3(x, y, z));
      }

      // Crear geometría y línea para la órbita
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: 0xffffff });
      const orbit = new THREE.Line(geometry, material);

      // Mostrar u ocultar órbitas de planetas enanos según el estado
      orbit.visible = !dwarfPlanets.includes(name) || showDwarfOrbits;
      orbit.userData = { isDwarfOrbit: dwarfPlanets.includes(name) };
      scene.add(orbit);
    });
    planetsRef.current = planets;

    //Eventos mouse
    let isDragging = false;
    let previousMouseX = 0, previousMouseY = 0;

    const onMouseDown = (event: MouseEvent) => {
      isDragging = true;
      previousMouseX = event.clientX;
      previousMouseY = event.clientY;
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = event.clientX - previousMouseX;
      const deltaY = event.clientY - previousMouseY;
      rotationRef.current.x -= deltaX * 0.002;
      rotationRef.current.y += deltaY * 0.002;
      rotationRef.current.y = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, rotationRef.current.y));
      previousMouseX = event.clientX;
      previousMouseY = event.clientY;
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

      let hasRenderedFirstFrame = false; // Bandera para el primer frame

    //Animacion planetas
    const animate = () => {
      requestAnimationFrame(animate);
      planets.forEach((planet) => {
        // Incrementar el ángulo (anomalía media aproximada)
        planet.angle += planet.speed;
        if (planet.angle > 2 * Math.PI) planet.angle -= 2 * Math.PI;

        // Parámetros de la elipse
        const { a, e } = planetEllipses[planet.name];
        const b = a * Math.sqrt(1 - e * e); // Semieje menor

        // Posición en la elipse (plano base XZ)
        const x = a * Math.cos(planet.angle);
        const z = b * Math.sin(planet.angle);

        // Aplicar inclinación
        const inclinacion = THREE.MathUtils.degToRad(planetInclinaciones[planet.name]);
        const y = z * Math.sin(inclinacion); // Ajustar Y según la inclinación
        const zInclinado = z * Math.cos(inclinacion); // Ajustar Z según la inclinación

        // Actualizar la posición del planeta
        planet.mesh.position.set(x, y, zInclinado);

        // Rotación del planeta sobre su propio eje
        planet.mesh.rotation.y += 0.002;
      });

      renderer.render(scene, camera);

       if (!hasRenderedFirstFrame) {
        hasRenderedFirstFrame = true;
        setTimeout(() => setIsLoading(false), 500); // Retraso adicional de 500ms
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

  useEffect(() => {
    if (!canvasRef || !canvasRef.current) return;

    // Crear un WebGLRenderer con antialias para suavizar bordes
    const renderer = new THREE.WebGLRenderer({ antialias: antialias });
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (antialias) {
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;
      renderer.setClearColor(0x000000, 1.0);
    } else {
      // Configuración de baja calidad
      renderer.shadowMap.enabled = false;
    }

    canvasRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    return () => {
      if (rendererRef.current && canvasRef.current) {
        canvasRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose(); // Liberar recursos (si dispose existe)
      }
    };
  }, [antialias]);
  return null;
}