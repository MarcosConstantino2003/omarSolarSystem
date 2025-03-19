"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Sun } from "../components/Sun";
import { Stars } from "../components/Stars";

export default function Home() {
  const canvasRef = useRef<HTMLDivElement>(null);
  let rotationX = 0, rotationY = 0;
  let zoomDistance = 10;

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, zoomDistance);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasRef.current.appendChild(renderer.domElement);

    // Add Sun and Stars
    const sun = Sun();
    scene.add(sun);

    const stars = Stars();
    scene.add(stars);

    // Mouse movement handling
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

    // Zoom handling
    const onScroll = (event: WheelEvent) => {
      zoomDistance += event.deltaY * 0.01;
      zoomDistance = Math.max(3, Math.min(30, zoomDistance));
    };

    window.addEventListener("wheel", onScroll);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      const x = zoomDistance * Math.cos(rotationY) * Math.sin(rotationX);
      const y = zoomDistance * Math.sin(rotationY);
      const z = zoomDistance * Math.cos(rotationY) * Math.cos(rotationX);
      camera.position.set(x, y, z);
      camera.lookAt(sun.position);

      renderer.render(scene, camera);
    };

    animate();

    // Window resize handling
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