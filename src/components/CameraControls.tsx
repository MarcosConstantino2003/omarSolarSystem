"use client";

import { useEffect } from "react";
import * as THREE from "three";

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

const planetInclinaciones: { [key: string]: number } = {
  Mercury: 7.00, Venus: 3.39, Earth: 0.00, Mars: 1.85, Jupiter: 1.31,
  Saturn: 2.49, Uranus: 0.77, Neptune: 1.77, Pluto: 17.14, Eris: 44,
  Ceres: 10.7, Haumea: 28.2, Makemake: 29,
};

export function CameraControls({
  cameraRef,
  sunRef,
  planetsRef,
  sliderRef,
  followedPlanet,
  rotationRef,
  zoomDistanceRef,
}: {
  cameraRef: React.MutableRefObject<THREE.PerspectiveCamera | null>;
  sunRef: React.MutableRefObject<THREE.Object3D | null>;
  planetsRef: React.MutableRefObject<Planet[]>;
  sliderRef: React.RefObject<HTMLInputElement> | null;
  followedPlanet: string | null;
  rotationRef: React.MutableRefObject<{ x: number; y: number; z: number }>;
  zoomDistanceRef: React.MutableRefObject<number>;
}) {
  useEffect(() => {
    if (!sliderRef || !sliderRef.current) return; 
    const camera = cameraRef.current;
    const sun = sunRef.current;
    const planets = planetsRef.current;
    const slider = sliderRef.current;
    if (!camera || !sun) return;

    if (followedPlanet) {
      const minZoom = getMinZoom(followedPlanet);
      zoomDistanceRef.current = minZoom * 3;
    } else {
      zoomDistanceRef.current = Math.max(1600, Math.min(MAX_ZOOM, zoomDistanceRef.current));
    }

    const updateCamera = () => {
      const targetPlanet = planets.find(p => p.name === followedPlanet);
      const { x: rotationX, y: rotationY } = rotationRef.current;
      const zoomDistance = zoomDistanceRef.current;
      const minZoom = getMinZoom(followedPlanet);

      if (targetPlanet) {
        const { mesh } = targetPlanet;
        const inclinacion = THREE.MathUtils.degToRad(planetInclinaciones[targetPlanet.name]);
        const xBase = Math.cos(rotationY) * Math.sin(rotationX);
        const yBase = Math.sin(rotationY);
        const zBase = Math.cos(rotationY) * Math.cos(rotationX);
        const direction = new THREE.Vector3(xBase, yBase, zBase).normalize();
        direction.applyAxisAngle(new THREE.Vector3(1, 0, 0), inclinacion);
        const offset = direction.multiplyScalar(zoomDistance);
        camera.position.copy(mesh.position).add(offset);
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

  return null;
}