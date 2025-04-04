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

const MAX_ZOOM = 500000;
const getMinZoom = (planetName: string | null) => {
  switch (planetName) {
    case "Pluto": case "Mercury": case "Eris": case "Ceres": case "Haumea": case "Makemake": return 0.5;
    case "Venus": case "Earth": return 3.5;
    case "Mars": return 2.0;
    case "Uranus": case "Neptune": return 25.0;
    case "Jupiter": case "Saturn": return 40.0;
    default: return 8000;
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
  updateCameraRef,
}: {
  cameraRef: React.RefObject<THREE.PerspectiveCamera | null>;
  sunRef: React.RefObject<THREE.Object3D | null>;
  planetsRef: React.RefObject<Planet[]>;
  sliderRef: React.RefObject<HTMLInputElement> | null;
  followedPlanet: string | null;
  rotationRef: React.RefObject<{ x: number; y: number; z: number }>;
  zoomDistanceRef: React.RefObject<number>;
  updateCameraRef: React.RefObject<(() => void) | null>;
}) {
  useEffect(() => {
    if (!sliderRef || !sliderRef.current) return;
    const camera = cameraRef.current;
    const sun = sunRef.current;
    const planets = planetsRef.current;
    const slider = sliderRef.current;
    if (!camera || !sun) return;

    // Ajustar zoom inicial según followedPlanet
    if (followedPlanet) {
      const minZoom = getMinZoom(followedPlanet);
      zoomDistanceRef.current = minZoom * 3;
    } else {
      zoomDistanceRef.current = 8000; 
    }

    let isDragging = false;
    let previousX = 0, previousY = 0;
    let previousTouchDistance = 0;

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

    // Pasar updateCamera al ref para que se use en SolarSystemScene
    updateCameraRef.current = updateCamera;

    const onScroll = (event: WheelEvent) => {
      const minZoom = getMinZoom(followedPlanet);
      const zoomSpeed = zoomDistanceRef.current * 0.001;
      zoomDistanceRef.current += event.deltaY * zoomSpeed;
      zoomDistanceRef.current = Math.max(minZoom, Math.min(MAX_ZOOM, zoomDistanceRef.current));
    };

    const onTouchStart = (event: TouchEvent) => {
      const zoomSlider = document.querySelector(".zoom-slider");
      const timeScaleSlider = document.querySelector(".time-scale-slider");
      if (
        (zoomSlider && zoomSlider.contains(event.target as Node)) ||
        (timeScaleSlider && timeScaleSlider.contains(event.target as Node))
      ) {
        return; 
      }
      event.preventDefault();
      if (event.touches.length === 1) {
        isDragging = true;
        previousX = event.touches[0].clientX;
        previousY = event.touches[0].clientY;
      } else if (event.touches.length === 2) {
        const dx = event.touches[0].clientX - event.touches[1].clientX;
        const dy = event.touches[0].clientY - event.touches[1].clientY;
        previousTouchDistance = Math.sqrt(dx * dx + dy * dy);
        isDragging = true;
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      const zoomSlider = document.querySelector(".zoom-slider");
      const timeScaleSlider = document.querySelector(".time-scale-slider");
      if (
        (zoomSlider && zoomSlider.contains(event.target as Node)) ||
        (timeScaleSlider && timeScaleSlider.contains(event.target as Node))
      ) {
        return; 
      }
      
      if (!isDragging) return;
      event.preventDefault();

      if (event.touches.length === 1) {
        const deltaX = event.touches[0].clientX - previousX;
        const deltaY = event.touches[0].clientY - previousY;
        rotationRef.current.x -= deltaX * 0.004;
        rotationRef.current.y += deltaY * 0.004;
        rotationRef.current.y = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, rotationRef.current.y));
        previousX = event.touches[0].clientX;
        previousY = event.touches[0].clientY;
      } else if (event.touches.length === 2) {
        const dx = event.touches[0].clientX - event.touches[1].clientX;
        const dy = event.touches[0].clientY - event.touches[1].clientY;
        const currentTouchDistance = Math.sqrt(dx * dx + dy * dy);
        const deltaDistance = previousTouchDistance - currentTouchDistance;

        const minZoom = getMinZoom(followedPlanet);
        const zoomSpeed = zoomDistanceRef.current * 0.001;
        zoomDistanceRef.current += deltaDistance * zoomSpeed * 20;
        zoomDistanceRef.current = Math.max(minZoom, Math.min(MAX_ZOOM, zoomDistanceRef.current));
        previousTouchDistance = currentTouchDistance;
      }
    };

    const onTouchEnd = (event: TouchEvent) => {
      isDragging = false;
      previousTouchDistance = 0;
    };

    window.addEventListener("wheel", onScroll);
    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("wheel", onScroll);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      updateCameraRef.current = null; // Limpiar la referencia
    };
  }, [followedPlanet]);

  return null;
}