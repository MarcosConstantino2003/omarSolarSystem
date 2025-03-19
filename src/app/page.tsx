"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Sun } from "../components/Sun";
import { Stars } from "../components/Stars";
import { Mercury } from "../components/Mercury";

export default function Home() {
  const canvasRef = useRef<HTMLDivElement>(null);
  let rotationX = 0, rotationY = 0;
  let zoomDistance = 1700;
  let mercuryAngle = 0;  // Ángulo inicial de Mercurio

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.set(0, 0, zoomDistance);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasRef.current.appendChild(renderer.domElement);

    // Añadir el Sol
    const sun = Sun();
    scene.add(sun);

    // Crear la órbita de Mercurio
    const mercuryOrbitGeometry = new THREE.TorusGeometry(2000, 0.7, 16, 100);
    const mercuryOrbitMaterial = new THREE.MeshBasicMaterial({
      color: 0xaaaaaa,
      wireframe: true,
    });
    const mercuryOrbit = new THREE.Mesh(mercuryOrbitGeometry, mercuryOrbitMaterial);
    mercuryOrbit.rotation.x = Math.PI / 2;
    scene.add(mercuryOrbit);

    // Crear el planeta Mercurio
    const mercury = Mercury();
    scene.add(mercury);

    const stars = Stars();
    scene.add(stars);

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

      rotationX -= deltaX * 0.002;
      rotationY += deltaY * 0.002;
      rotationY = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, rotationY));

      previousMouseX = event.clientX;
      previousMouseY = event.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // Zoom handling with smooth zooming
    const MIN_ZOOM = 500;
    const MAX_ZOOM = 10000;
    const ZOOM_SPEED = 300;

    const onScroll = (event: WheelEvent) => {
      zoomDistance += event.deltaY * 0.3;
      zoomDistance = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoomDistance));
    };

    window.addEventListener("wheel", onScroll);

    const animate = () => {
      requestAnimationFrame(animate);

      // Actualizar el ángulo de Mercurio para que se mueva a lo largo de la órbita
      mercuryAngle += 0.01;  // Aumentar el ángulo, controla la velocidad de la órbita
      if (mercuryAngle > 2 * Math.PI) mercuryAngle -= 2 * Math.PI;  // Mantener el ángulo dentro de 0 a 2π

      // Calcular la nueva posición de Mercurio
      const mercuryRadius = 2000;  // Radio de la órbita
      const mercuryX = mercuryRadius * Math.cos(mercuryAngle);  // Posición en X
      const mercuryZ = mercuryRadius * Math.sin(mercuryAngle);  // Posición en Z
      mercury.position.set(mercuryX, 0, mercuryZ);  // Actualizar la posición de Mercurio

      // Movimiento de la cámara
      const x = zoomDistance * Math.cos(rotationY) * Math.sin(rotationX);
      const y = zoomDistance * Math.sin(rotationY);
      const z = zoomDistance * Math.cos(rotationY) * Math.cos(rotationX);
      camera.position.set(x, y, z);
      camera.lookAt(sun.position);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("wheel", onScroll);
      canvasRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={canvasRef} className="w-full h-screen" />;
}
