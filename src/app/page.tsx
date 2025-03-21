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

// Definición de tipos y constantes globales
interface Planet {
  name: string;
  radius: number;
  angle: number;
  speed: number;
  mesh: THREE.Object3D;
}

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
    default: return 1700;
  }
};

// Componente principal
export default function Home() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLInputElement>(null);
  const [followedPlanet, setFollowedPlanet] = useState<string | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const planetsRef = useRef<Planet[]>([]);
  const sunRef = useRef<THREE.Object3D | null>(null);
  const rotationRef = useRef({ x: Math.PI / 4, y: Math.PI / 4, z: Math.PI / 4 });
  const zoomDistanceRef = useRef(Math.sqrt(8000 * 1000 + 8000 * 1000 + 6000 * 1000));

  // Configuración inicial de la escena (se ejecuta una vez)
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50000);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasRef.current.appendChild(renderer.domElement);
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
      { name: "Mercury", radius: 1800, angle: 0, speed: 0.004, mesh: Mercury() },
      { name: "Venus", radius: 2300, angle: 0, speed: 0.0035, mesh: Venus() },
      { name: "Earth", radius: 2700, angle: 0, speed: 0.003, mesh: Earth() },
      { name: "Mars", radius: 3100, angle: 0, speed: 0.0025, mesh: Mars() },
      { name: "Jupiter", radius: 4200, angle: 0, speed: 0.0015, mesh: Jupiter() },
      { name: "Saturn", radius: 5700, angle: 0, speed: 0.001, mesh: Saturn() },
      { name: "Uranus", radius: 7000, angle: 0, speed: 0.0006, mesh: Uranus() },
      { name: "Neptune", radius: 7600, angle: 0, speed: 0.0004, mesh: Neptune() },
    ];
    //Orbitas
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

    //Animacion planetas
    const animate = () => {
      requestAnimationFrame(animate);
      planets.forEach((planet) => {
        planet.angle += planet.speed;
        if (planet.angle > 2 * Math.PI) planet.angle -= 2 * Math.PI;
        const x = planet.radius * Math.cos(planet.angle);
        const z = planet.radius * Math.sin(planet.angle);
        planet.mesh.position.set(x, 0, z);
        planet.mesh.rotation.y += 0.002;
      });
      renderer.render(scene, camera);
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

  // Actualización dinámica de la cámara y zoom
  useEffect(() => {
    const camera = cameraRef.current;
    const sun = sunRef.current;
    const planets = planetsRef.current;
    const slider = sliderRef.current;
    if (!camera || !sun) return;

    if (followedPlanet) {
      const minZoom = getMinZoom(followedPlanet);
      zoomDistanceRef.current = minZoom * 3;
    } else {
      zoomDistanceRef.current = 1600;
    }

    const updateCamera = () => {
      const targetPlanet = planets.find(p => p.name === followedPlanet);
      const { x: rotationX, y: rotationY } = rotationRef.current;
      const zoomDistance = zoomDistanceRef.current;
      const minZoom = getMinZoom(followedPlanet);

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

      if (slider) slider.value = String(100 * (1 - (zoomDistance - minZoom) / (MAX_ZOOM - minZoom)));
    };

    const onScroll = (event: WheelEvent) => {
      const minZoom = getMinZoom(followedPlanet);
      const zoomSpeed = zoomDistanceRef.current * 0.001;
      zoomDistanceRef.current += event.deltaY * zoomSpeed;
      zoomDistanceRef.current = Math.max(minZoom, Math.min(MAX_ZOOM, zoomDistanceRef.current));
    };
    window.addEventListener("wheel", onScroll);

    const animateCamera = () => {
      updateCamera();
      requestAnimationFrame(animateCamera);
    };
    animateCamera();

    return () => {
      window.removeEventListener("wheel", onScroll);
    };
  }, [followedPlanet]);

  // Funciones de utilidad
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

  const handleZoomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const minZoom = getMinZoom(followedPlanet);
    const sliderValue = Number(event.target.value);
    zoomDistanceRef.current = minZoom + (MAX_ZOOM - minZoom) * (1 - sliderValue / 100);
  };

  // Renderizado del componente
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

  const [isOpen, setIsOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false); // State for contact info panel

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
        <input
          type="range"
          min="0"
          max="100"
          defaultValue="50"
          ref={sliderRef}
          onChange={handleZoomChange}
          className="zoom-slider absolute bottom-4 left-4"
          style={{ writingMode: 'vertical-rl' }}
        />
        <div ref={canvasRef} className="w-full h-full" />
          {/* Contact Info Button */}
          <div className="contact-container">
          <button className="contact-button" onClick={() => setContactOpen(!contactOpen)}>
            <span className={`triangle ${contactOpen ? 'active' : ''}`} />
          </button>
          
          {/* Contact Info Panel */}
          {contactOpen && (
            <div className="contact-info open">
              <p> by Marcos Constantino</p>
              <p> • contact me at: </p>
            </div>
       )}
       </div>
     </div>
   </>
 );
};