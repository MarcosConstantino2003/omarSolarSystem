"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Head from "next/head";
import { Sun } from "../components/Sun";
import { Stars } from "../components/Stars";
import { Mercury } from "../components/Mercury";
import { Venus } from "../components/Venus";
import { Earth } from "../components/Earth";
import { Mars } from "../components/Mars";
import { Jupiter } from "../components/Jupiter";
import { Saturn } from "../components/Saturn";
import { Uranus } from "../components/Uranus";
import { Neptune } from "../components/Neptune";
import './globals.css';

interface Planet {
  name: string;
  radius: number;
  angle: number;
  speed: number;
  mesh: THREE.Object3D;
}

export default function Home() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [followedPlanet, setFollowedPlanet] = useState<string | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const planetsRef = useRef<Planet[]>([]);
  const sunRef = useRef<THREE.Object3D | null>(null);
  const rotationRef = useRef({ x: 0, y: 0 });
  const zoomDistanceRef = useRef(1700); // INITIAL_ZOOM

  // Primer useEffect: Configuración inicial (solo se ejecuta una vez)
  useEffect(() => {
    if (!canvasRef.current) return;

    // Escena
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    // Cámara
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50000);
    camera.position.set(3000, 4000, 3000);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasRef.current.appendChild(renderer.domElement);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Sol
    const sun = Sun();
    scene.add(sun);
    sunRef.current = sun;

    // Luz ambiental
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);

    // Cubo de prueba
    const createTextTexture = (text: string) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = 256;
      canvas.height = 256;
      if (ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "24px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
      }
      return new THREE.CanvasTexture(canvas);
    };
    const textTexture = createTextTexture("easter egg decirle a omar");
    const testCubeMaterials = Array(6).fill(null).map(() => new THREE.MeshBasicMaterial({ map: textTexture }));
    const testCube = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100), testCubeMaterials);
    testCube.position.set(500, 0, 0);
    scene.add(testCube);

    // Estrellas
    const stars = Stars();
    scene.add(stars);

    // Planetas
    const planets: Planet[] = [
      { name: "Mercury", radius: 1800, angle: 0, speed: 0.004, mesh: Mercury() },
      { name: "Venus", radius: 2300, angle: 0, speed: 0.0035, mesh: Venus() },
      { name: "Earth", radius: 2700, angle: 0, speed: 0.003, mesh: Earth() },
      { name: "Mars", radius: 3100, angle: 0, speed: 0.0025, mesh: Mars() },
      { name: "Jupiter", radius: 4200, angle: 0, speed: 0.0015, mesh: Jupiter() },
      { name: "Saturn", radius: 5700, angle: 0, speed: 0.001, mesh: Saturn() },
      { name: "Uranus", radius: 7000, angle: 0, speed: 0.0006, mesh: Uranus() },
      { name: "Neptune", radius: 7600, angle: 0, speed: 0.0004, mesh: Neptune() },
    ];
    planets.forEach(({ mesh, radius }) => {
      scene.add(mesh);
      const orbit = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.7, 16, 100),
        new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
      );
      orbit.rotation.x = Math.PI / 2;
      scene.add(orbit);
    });
    planetsRef.current = planets;

    // Eventos de ratón
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

    // Zoom dinámico
    const MAX_ZOOM = 10000;
    const getMinZoom = (planetName: string | null) => {
      switch (planetName) {
        case "Mercury": return 10;
        case "Venus":
        case "Earth": return 60;
        case "Mars": return 30;
        case "Uranus":
        case "Neptune": return 300;
        case "Jupiter":
        case "Saturn": return 450;
        default: return 10;
      }
    };

    const onScroll = (event: WheelEvent) => {
      const zoomSpeed = zoomDistanceRef.current * 0.001;
      zoomDistanceRef.current += event.deltaY * zoomSpeed;
      const MIN_ZOOM = getMinZoom(followedPlanet);
      zoomDistanceRef.current = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoomDistanceRef.current));
    };

    // Listeners
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("click", onClick);
    window.addEventListener("wheel", onScroll);

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    // Animación
    const animate = () => {
      requestAnimationFrame(animate);

      // Mover planetas
      planets.forEach((planet) => {
        planet.angle += planet.speed;
        if (planet.angle > 2 * Math.PI) planet.angle -= 2 * Math.PI;
        const x = planet.radius * Math.cos(planet.angle);
        const z = planet.radius * Math.sin(planet.angle);
        planet.mesh.position.set(x, 0, z);
        planet.mesh.rotation.y += 0.002;
      });

      // Actualizar cámara (se maneja en el segundo useEffect, pero renderizamos aquí)
      renderer.render(scene, camera);
    };
    animate();

    // Limpieza
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("wheel", onScroll);
      window.removeEventListener("click", onClick);
      canvasRef.current?.removeChild(renderer.domElement);
    };
  }, []); // Sin dependencias, solo se ejecuta al montar

  // Segundo useEffect: Actualización de la cámara según el planeta seguido
  useEffect(() => {
    const camera = cameraRef.current;
    const sun = sunRef.current;
    const planets = planetsRef.current;
    if (!camera || !sun) return;

    const updateCamera = () => {
      const targetPlanet = planets.find(p => p.name === followedPlanet);
      const { x: rotationX, y: rotationY } = rotationRef.current;
      const zoomDistance = zoomDistanceRef.current;

      if (targetPlanet) {
        const { mesh } = targetPlanet;
        const x = zoomDistance * Math.cos(rotationY) * Math.sin(rotationX);
        const y = zoomDistance * Math.sin(rotationY);
        const z = zoomDistance * Math.cos(rotationY) * Math.cos(rotationX);
        camera.position.set(mesh.position.x + x, y, mesh.position.z + z);
        camera.lookAt(mesh.position);
      } else {
        const x = zoomDistance * Math.cos(rotationY) * Math.sin(rotationX);
        const y = zoomDistance * Math.sin(rotationY);
        const z = zoomDistance * Math.cos(rotationY) * Math.cos(rotationX);
        camera.position.set(x, y, z);
        camera.lookAt(sun.position);
      }
    };

    // Actualizar cámara inmediatamente y en cada frame
    const animateCamera = () => {
      updateCamera();
      requestAnimationFrame(animateCamera);
    };
    animateCamera();
  }, [followedPlanet]); // Solo depende de followedPlanet

  const [isOpen, setIsOpen] = useState(false);
  const planetNames: { [key: string]: string } = {
    Mercury: "Mercurio",
    Venus: "Venus",
    Earth: "Tierra",
    Mars: "Marte",
    Jupiter: "Júpiter",
    Saturn: "Saturno",
    Uranus: "Urano",
    Neptune: "Neptuno",
    Sun: "Sol",
  };

  return (
    <>
      <Head>
        <title>Omar's Solar System</title>
        <meta name="description" content="A 3D simulation of the solar system" />
      </Head>
      <div className="relative w-full h-screen">
        <div className="planet-dropdown-container">
          <button className="planet-dropdown-button" onClick={() => setIsOpen(!isOpen)}>
            {followedPlanet ? planetNames[followedPlanet] : planetNames["Sun"]}
          </button>
          {isOpen && (
            <ul className="planet-dropdown-list">
              <li onClick={() => { setFollowedPlanet(null); setIsOpen(false); }}>
                {planetNames["Sun"]}
              </li>
              {["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"].map((planet) => (
                <li
                  key={planet}
                  onClick={() => {
                    setFollowedPlanet(planet);
                    setIsOpen(false);
                  }}
                >
                  {planetNames[planet]}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div ref={canvasRef} className="w-full h-full" />
      </div>
    </>
  );
}