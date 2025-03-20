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
  let rotationX = 0, rotationY = 0;
  const INITIAL_ZOOM = 1700;
  const PLANET_ZOOM = 100;




  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.set(3000, 4000, 3000); // Vista inicial en diagonal
    camera.lookAt(0, 0, 0);
    let zoomDistance = INITIAL_ZOOM;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasRef.current.appendChild(renderer.domElement);
    renderer.shadowMap.enabled = true; // Habilitar sombras
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Sombras suaves


    // Sol
    const sun = Sun();
    scene.add(sun);

    const ambientLight = new THREE.AmbientLight(0x404040, 1); // Gris oscuro, intensidad baja
    scene.add(ambientLight);

    const testCubeGeometry = new THREE.BoxGeometry(100, 100, 100);
    const testCubeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const testCube = new THREE.Mesh(testCubeGeometry, testCubeMaterial);
    testCube.position.set(500, 0, 0); // Near the Sun
    scene.add(testCube);

    // Estrellas
    const stars = Stars();
    scene.add(stars);

    // Lista de planetas
    const planets: Planet[] = [
      {
        name: "Mercury",
        radius: 1800,
        angle: 0,
        speed: 0.004,
        mesh: Mercury(),
      },
      {
        name: "Venus",
        radius: 2300,
        angle: 0,
        speed: 0.0035,
        mesh: Venus(),
      },
      {
        name: "Earth",
        radius: 2700,
        angle: 0,
        speed: 0.003,
        mesh: Earth(),
      },
      {
        name: "Mars",
        radius: 3100,
        angle: 0,
        speed: 0.0025,
        mesh: Mars(),
      },
      {
        name: "Jupiter",
        radius: 4200,
        angle: 0,
        speed: 0.0015,
        mesh: Jupiter(),
      },
      {
        name: "Saturn",
        radius: 5700,
        angle: 0,
        speed: 0.001,
        mesh: Saturn(),
      },
      {
        name: "Uranus",
        radius: 7000,
        angle: 0,
        speed: 0.0006,
        mesh: Uranus(),
      },
      {
        name: "Neptune",
        radius: 7600,
        angle: 0,
        speed: 0.0004,
        mesh: Neptune(),
      }
    ];

    planets.forEach(({ mesh, radius }) => {
      scene.add(mesh);
      const orbitGeometry = new THREE.TorusGeometry(radius, 0.7, 16, 100);
      const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit.rotation.x = Math.PI / 2;
      scene.add(orbit);
    });

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
    };

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("click", onClick);

    // Zoom
    const MIN_ZOOM = 10, MAX_ZOOM = 10000;
    const onScroll = (event: WheelEvent) => {
      zoomDistance += event.deltaY * 0.3;
      zoomDistance = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoomDistance));
    };
    window.addEventListener("wheel", onScroll);

    // Animación
    const animate = () => {
      requestAnimationFrame(animate);

      // Mover planetas en sus órbitas
      planets.forEach((planet) => {
        planet.angle += planet.speed;
        if (planet.angle > 2 * Math.PI) planet.angle -= 2 * Math.PI;

        const x = planet.radius * Math.cos(planet.angle);
        const z = planet.radius * Math.sin(planet.angle);
        planet.mesh.position.set(x, 0, z);
        planet.mesh.rotation.y += 0.002; // Rotación propia
      });

      // Cámara sigue al planeta seleccionado
      const targetPlanet = planets.find(p => p.name === followedPlanet);
      if (targetPlanet) {
        const { mesh } = targetPlanet;
        const x = zoomDistance * Math.cos(rotationY) * Math.sin(rotationX);
        const y = zoomDistance * Math.sin(rotationY);
        const z = zoomDistance * Math.cos(rotationY) * Math.cos(rotationX);

        camera.position.set(mesh.position.x + x, y, mesh.position.z + z);
        camera.lookAt(mesh.position);
      } else {
        // Cámara manual si no sigue un planeta
        const x = zoomDistance * Math.cos(rotationY) * Math.sin(rotationX);
        const y = zoomDistance * Math.sin(rotationY);
        const z = zoomDistance * Math.cos(rotationY) * Math.cos(rotationX);
        camera.position.set(x, y, z);
        camera.lookAt(sun.position);
      }

      renderer.render(scene, camera);
    };
    animate();

    // Manejo de redimensionamiento
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
      window.removeEventListener("click", onClick);
      canvasRef.current?.removeChild(renderer.domElement);
    };
  }, [followedPlanet]);

  return (
    <>
      <Head>
        <title>Omar's Solar System</title>
        <meta name="description" content="A 3D simulation of the solar system" />
      </Head>
      <div ref={canvasRef} className="w-full h-screen" />
    </>
  );
}
