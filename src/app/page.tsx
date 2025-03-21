"use client";

import { useRef, useState } from "react";
import * as THREE from "three";
import Head from "next/head";
import { SolarSystemScene } from "../components/SolarSystemScene";
import { CameraControls } from "../components/CameraControls";
import { PlanetLabels } from "../components/PlanetLabels";
import "../app/globals.css";

interface Planet {
  name: string;
  radius: number;
  angle: number;
  speed: number;
  mesh: THREE.Object3D;
}

const MAX_ZOOM = 20000;
const getMinZoom = (planetName: string | null) => {
  switch (planetName) {
    case "Pluto": case "Mercury": case "Eris": case "Ceres": case "Haumea": case "Makemake": return 20;
    case "Venus": case "Earth": return 70;
    case "Mars": return 40;
    case "Uranus": case "Neptune": return 320;
    case "Jupiter": case "Saturn": return 470;
    default: return 1700;
  }
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(true); 
  const canvasRef = useRef<HTMLDivElement>(null!);;
  const sliderRef = useRef<HTMLInputElement>(null!);;
  const [followedPlanet, setFollowedPlanet] = useState<string | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const planetsRef = useRef<Planet[]>([]);
  const sunRef = useRef<THREE.Object3D | null>(null);
  const rotationRef = useRef({ x: Math.PI / 4, y: Math.PI / 4, z: Math.PI / 4 });
  const zoomDistanceRef = useRef(Math.sqrt(8000 * 1000 + 8000 * 1000 + 6000 * 1000));
  const [showDwarfOrbits, setShowDwarfOrbits] = useState(true);
  const [showPlanetNames, setShowPlanetNames] = useState(true);
  const [antialias, setAntialias] = useState(false);

  const planetNames: { [key: string]: string } = {
    Mercury: "Mercurio", Venus: "Venus", Earth: "Tierra", Mars: "Marte",
    Jupiter: "Júpiter", Saturn: "Saturno", Uranus: "Urano", Neptune: "Neptuno",
    Pluto: "Plutón", Eris: "Eris", Ceres: "Ceres", Haumea: "Haumea",
    Makemake: "Makemake", Sun: "Sol",
  };

  const handleZoomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const minZoom = getMinZoom(followedPlanet);
    const sliderValue = Number(event.target.value);
    zoomDistanceRef.current = minZoom + (MAX_ZOOM - minZoom) * (1 - sliderValue / 100);
  };

  const [isOpen, setIsOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Omar's Solar System</title>
        <meta name="description" content="A 3D simulation of the solar system" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=VT323&display=swap" />
      </Head>
      <div className="relative w-full h-screen">
        {/* Pantalla de carga */}
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
          sunRef={sunRef}
          rotationRef={rotationRef}
          setFollowedPlanet={setFollowedPlanet}
          showDwarfOrbits={showDwarfOrbits}
          antialias={antialias}
          setIsLoading={setIsLoading}
        />
        <CameraControls
          cameraRef={cameraRef}
          sunRef={sunRef}
          planetsRef={planetsRef}
          sliderRef={sliderRef}
          followedPlanet={followedPlanet}
          rotationRef={rotationRef}
          zoomDistanceRef={zoomDistanceRef}
        />
        <PlanetLabels
          sceneRef={sceneRef}
          cameraRef={cameraRef}
          planetsRef={planetsRef}
          showPlanetNames={showPlanetNames}
          showDwarfOrbits={showDwarfOrbits}
          followedPlanet={followedPlanet}
          planetNames={planetNames}
        />
        <div className="planet-dropdown-container">
          <button className="planet-dropdown-button" onClick={() => setIsOpen(!isOpen)}>
            {followedPlanet ? planetNames[followedPlanet] : planetNames["Sun"]}
          </button>
          {isOpen && (
            <ul className="planet-dropdown-list">
              <li onClick={() => { setFollowedPlanet(null); setIsOpen(false); }}>
                {planetNames["Sun"]}
              </li>
              {["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "Eris", "Ceres", "Haumea", "Makemake"].map((planet) => (
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
          style={{ writingMode: "vertical-rl" }}
        />
        <div ref={canvasRef} className="w-full h-full" />
        <div className="contact-container">
          <button className="contact-button" onClick={() => setContactOpen(!contactOpen)}>
            <span className={`triangle ${contactOpen ? "active" : ""}`} />
          </button>
          <div className={`contact-info ${contactOpen ? "open" : ""}`}>
            <p>by Marcos Constantino</p>
            <p>• contact me at:</p>
            <a href="https://www.linkedin.com/in/marquitosconstantino/" target="_blank" rel="noopener noreferrer">
              <img src="/linkedin.png" alt="LinkedIn" className="linkedin-logo" />
            </a>
          </div>
        </div>
        <div className="checkbox-container">
          {/* <label className="antialias-label">
            <input
              type="checkbox"
              checked={antialias}
              onChange={(e) => setAntialias(e.target.checked)}
            />
              DEV Antialias
          </label> */}
          <label className="dwarf-orbits-label">
            <input
              type="checkbox"
              checked={showDwarfOrbits}
              onChange={(e) => {
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
            Órbitas de enanos
          </label>
          <label className="planet-names-label">
            <input
              type="checkbox"
              checked={showPlanetNames}
              onChange={(e) => setShowPlanetNames(e.target.checked)}
            />
            Nombres de planetas
          </label>
        </div>
      </div>
    </>
  );
}