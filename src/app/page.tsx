"use client";

import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import Head from "next/head";
import { SolarSystemScene } from "../components/SolarSystemScene";
import { CameraControls } from "../components/CameraControls";
import { PlanetLabels } from "../components/PlanetLabels";
import "../app/globals.css";

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

const MAX_ZOOM = 500000;
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

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef<HTMLDivElement>(null!);
  const sliderRef = useRef<HTMLInputElement>(null!);
  const [followedPlanet, setFollowedPlanet] = useState<string | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const planetsRef = useRef<Planet[]>([]);
  const sunRef = useRef<THREE.Object3D | null>(null);
  const rotationRef = useRef({ x: Math.PI / 4, y: Math.PI / 4, z: Math.PI / 4 });
  const zoomDistanceRef = useRef(Math.sqrt(8000 * 1000 + 8000 * 1000 + 6000 * 1000));
  const updateSpritesRef = useRef<(() => void) | null>(null);
  const [showDwarfOrbits, setShowDwarfOrbits] = useState(false);
  const [showPlanetNames, setShowPlanetNames] = useState(true);
  const updateCameraRef = useRef<(() => void) | null>(null);
  const planetNames: { [key: string]: string } = {
    Mercury: "Mercurio", Venus: "Venus", Earth: "Tierra", Mars: "Marte",
    Jupiter: "Júpiter", Saturn: "Saturno", Uranus: "Urano", Neptune: "Neptuno",
    Pluto: "Plutón", Eris: "Eris", Ceres: "Ceres", Haumea: "Haumea",
    Makemake: "Makemake", Sun: "Sol",
  };

  const handleZoomChange = (sliderValue: number) => {
    const minZoom = getMinZoom(followedPlanet);
    zoomDistanceRef.current = minZoom + (MAX_ZOOM - minZoom) * (1 - sliderValue / 100);
    if (sliderRef.current) sliderRef.current.value = String(sliderValue);
  };

  const [isOpen, setIsOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let isDraggingSlider = false;
    let startY = 0;

    const onTouchStart = (event: TouchEvent) => {
      if (event.target === slider) {
        event.preventDefault();
        isDraggingSlider = true;
        startY = event.touches[0].clientY;
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!isDraggingSlider || event.target !== slider) return;
      event.preventDefault();

      const touchY = event.touches[0].clientY;
      const sliderRect = slider.getBoundingClientRect();
      const sliderHeight = sliderRect.height;
      const deltaY = startY - touchY; 
      const sensitivity = 100 / sliderHeight; 
      let newValue = Number(slider.value) + deltaY * sensitivity;

      newValue = Math.max(0, Math.min(100, newValue)); 
      handleZoomChange(newValue);
      startY = touchY; 
    };

    const onTouchEnd = () => {
      isDraggingSlider = false;
    };

    slider.addEventListener("touchstart", onTouchStart, { passive: false });
    slider.addEventListener("touchmove", onTouchMove, { passive: false });
    slider.addEventListener("touchend", onTouchEnd);

    return () => {
      slider.removeEventListener("touchstart", onTouchStart);
      slider.removeEventListener("touchmove", onTouchMove);
      slider.removeEventListener("touchend", onTouchEnd);
    };
  }, [followedPlanet]); 

  return (
    <>
      <Head>
        <title>Omar's Solar System</title>
        <meta name="description" content="A 3D simulation of the solar system" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=VT323&display=swap" />
      </Head>
      <div className="relative w-full h-screen">
        {isLoading && (
          <div className="loading-screen">
            <div className="spinner"></div>
            <p className="main-text">Cargando...</p>
            <p className="footer-text">by Marcos Constantino</p>
          </div>
        )}
        <SolarSystemScene
          canvasRef={canvasRef}
          sceneRef={sceneRef}
          cameraRef={cameraRef}
          rendererRef={rendererRef}
          planetsRef={planetsRef}
          zoomDistanceRef={zoomDistanceRef}
          sunRef={sunRef}
          rotationRef={rotationRef}
          setFollowedPlanet={setFollowedPlanet}
          showDwarfOrbits={showDwarfOrbits}
          setIsLoading={setIsLoading}
          getMinZoom={getMinZoom}
          MAX_ZOOM={MAX_ZOOM}
          followedPlanet={followedPlanet}
          updateSpritesRef={updateSpritesRef}
          updateCameraRef={updateCameraRef}
        />
        <CameraControls
          cameraRef={cameraRef}
          sunRef={sunRef}
          planetsRef={planetsRef}
          sliderRef={sliderRef}
          followedPlanet={followedPlanet}
          rotationRef={rotationRef}
          zoomDistanceRef={zoomDistanceRef}
          updateCameraRef={updateCameraRef}
        />
        <PlanetLabels
          sceneRef={sceneRef}
          cameraRef={cameraRef}
          planetsRef={planetsRef}
          showPlanetNames={showPlanetNames}
          showDwarfOrbits={showDwarfOrbits}
          followedPlanet={followedPlanet}
          planetNames={planetNames}
          updateSpritesRef={updateSpritesRef}
          setFollowedPlanet={setFollowedPlanet}
        />
        <div className="planet-dropdown-container">
          <button
            className="planet-dropdown-button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
          >
            {followedPlanet ? planetNames[followedPlanet] : planetNames["Sun"]}
          </button>
          {isOpen && (
            <ul className="planet-dropdown-list">
              <li
                onClick={(e) => {
                  e.stopPropagation();
                  setFollowedPlanet(null);
                  setIsOpen(false);
                }}
              >
                {planetNames["Sun"]}
              </li>
              {["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "Eris", "Ceres", "Haumea", "Makemake"].map((planet) => (
                <li
                  key={planet}
                  onClick={(e) => {
                    e.stopPropagation();
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
          onChange={(e) => {
            e.stopPropagation(); 
            handleZoomChange(Number(e.target.value));
          }}
          className="zoom-slider absolute bottom-4 left-4"
          style={{ writingMode: "vertical-rl" }}
        />
        <div ref={canvasRef} className="w-full h-full" />
        <div className="contact-container">
          <button
            className="contact-button"
            onClick={(e) => {
              e.stopPropagation(); // Prevent contact button click from reaching canvas
              setContactOpen(!contactOpen);
            }}
          >
            <span className={`triangle ${contactOpen ? "active" : ""}`} />
          </button>
          <div className={`contact-info ${contactOpen ? "open" : ""}`}>
            <p>by Marcos Constantino</p>
            <p>• contact me at:</p>
            <div className="linkedin-container">
              <a
                href="https://www.linkedin.com/in/marquitosconstantino/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()} 
              >
                <img
                  src="/linkedin.png"
                  alt="LinkedIn"
                  className="linkedin-logo"
                />
              </a>
            </div>
          </div>
        </div>
        <div className="checkbox-container">
          <label className="dwarf-orbits-label">
            <input
              type="checkbox"
              checked={showDwarfOrbits}
              onChange={(e) => {
                e.stopPropagation();
                setShowDwarfOrbits(e.target.checked);
                const scene = sceneRef.current;
                if (scene) {
                  scene.traverse((object) => {
                    if (object.userData.isDwarfOrbit) {
                      object.visible = e.target.checked;
                    }
                  });
                }
              }}
            />
            <div onClick={(e) => e.stopPropagation()}>Órbitas de enanos</div>
          </label>
          <label className="planet-names-label">
            <input
              type="checkbox"
              checked={showPlanetNames}
              onChange={(e) => {
                e.stopPropagation();
                setShowPlanetNames(e.target.checked);
              }}
            />
            <div onClick={(e) => e.stopPropagation()}>Nombres de planetas</div>
          </label>
        </div>
      </div>
    </>
  );
}