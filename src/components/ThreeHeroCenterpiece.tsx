import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeHeroCenterpieceProps {
  onInteraction?: () => void;
}

export const ThreeHeroCenterpiece: React.FC<ThreeHeroCenterpieceProps> = ({ onInteraction }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeModel, setActiveModel] = useState<'burger' | 'pizza' | 'coffee'>('burger');
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const modelGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene, Camera, Renderer
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 5.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    mount.appendChild(renderer.domElement);

    // Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);
    modelGroupRef.current = rootGroup;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffeedd, 1.0);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xffa142, 2.8);
    mainKeyLight.position.set(3, 5, 4);
    mainKeyLight.castShadow = true;
    scene.add(mainKeyLight);

    const rimLight = new THREE.PointLight(0xff5500, 3.5, 12);
    rimLight.position.set(-4, 2, -3);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xffe6a3, 1.8, 10);
    fillLight.position.set(2, -1, 3);
    scene.add(fillLight);

    const goldHaloLight = new THREE.PointLight(0xffb703, 2.5, 6);
    goldHaloLight.position.set(0, -0.6, 0);
    scene.add(goldHaloLight);

    // Pedestal Glow Ring
    const ringGeo = new THREE.TorusGeometry(1.6, 0.04, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xff8800, transparent: true, opacity: 0.7 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = -1.1;
    rootGroup.add(ringMesh);

    // Outer faint aura
    const auraGeo = new THREE.RingGeometry(1.3, 1.9, 32);
    const auraMat = new THREE.MeshBasicMaterial({
      color: 0xff6600,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.15,
    });
    const auraMesh = new THREE.Mesh(auraGeo, auraMat);
    auraMesh.rotation.x = -Math.PI / 2;
    auraMesh.position.y = -1.15;
    rootGroup.add(auraMesh);

    // Dynamic model container
    const dynamicGroup = new THREE.Group();
    rootGroup.add(dynamicGroup);

    // BUILD BURGER
    const buildBurger = () => {
      dynamicGroup.clear();

      // Top bun
      const topBunGeo = new THREE.SphereGeometry(1.2, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.45);
      const bunMat = new THREE.MeshStandardMaterial({
        color: 0xc8823b,
        roughness: 0.4,
        metalness: 0.1,
      });
      const topBun = new THREE.Mesh(topBunGeo, bunMat);
      topBun.position.y = 0.5;
      dynamicGroup.add(topBun);

      // Sesame Seeds on top bun
      const seedGeo = new THREE.SphereGeometry(0.025, 8, 8);
      seedGeo.scale(1, 0.4, 2);
      const seedMat = new THREE.MeshStandardMaterial({ color: 0xf5eedc, roughness: 0.6 });
      const seedCount = 45;
      for (let i = 0; i < seedCount; i++) {
        const seed = new THREE.Mesh(seedGeo, seedMat);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * 0.35 + 0.1;
        const r = 1.21;
        seed.position.x = r * Math.sin(phi) * Math.cos(theta);
        seed.position.y = 0.5 + r * Math.cos(phi);
        seed.position.z = r * Math.sin(phi) * Math.sin(theta);
        seed.lookAt(seed.position.clone().multiplyScalar(2));
        dynamicGroup.add(seed);
      }

      // Tomato Slices
      const tomatoMat = new THREE.MeshStandardMaterial({ color: 0xd92d20, roughness: 0.25, metalness: 0.05 });
      const tomatoGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.08, 24);
      const tomato1 = new THREE.Mesh(tomatoGeo, tomatoMat);
      tomato1.position.set(-0.35, 0.42, 0.2);
      tomato1.rotation.z = 0.08;
      const tomato2 = new THREE.Mesh(tomatoGeo, tomatoMat);
      tomato2.position.set(0.4, 0.43, -0.15);
      tomato2.rotation.z = -0.06;
      dynamicGroup.add(tomato1, tomato2);

      // Melted Cheddar Cheese (draped box / plane)
      const cheeseMat = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        roughness: 0.3,
        metalness: 0.05,
      });
      const cheeseGeo = new THREE.BoxGeometry(1.6, 0.04, 1.6);
      const cheese = new THREE.Mesh(cheeseGeo, cheeseMat);
      cheese.position.y = 0.32;
      cheese.rotation.y = Math.PI / 4;
      dynamicGroup.add(cheese);

      // Grilled Patty
      const pattyMat = new THREE.MeshStandardMaterial({
        color: 0x4a2e18,
        roughness: 0.85,
        metalness: 0.05,
      });
      const pattyGeo = new THREE.CylinderGeometry(1.15, 1.15, 0.32, 32);
      const patty = new THREE.Mesh(pattyGeo, pattyMat);
      patty.position.y = 0.12;
      dynamicGroup.add(patty);

      // Wavy Lettuce layer
      const lettuceMat = new THREE.MeshStandardMaterial({
        color: 0x48a12e,
        roughness: 0.6,
        side: THREE.DoubleSide,
      });
      const lettuceGeo = new THREE.TorusGeometry(1.05, 0.18, 12, 36);
      const lettuce = new THREE.Mesh(lettuceGeo, lettuceMat);
      lettuce.rotation.x = Math.PI / 2;
      lettuce.position.y = -0.08;
      dynamicGroup.add(lettuce);

      // Bottom bun
      const botBunGeo = new THREE.CylinderGeometry(1.18, 1.05, 0.35, 32);
      const botBun = new THREE.Mesh(botBunGeo, bunMat);
      botBun.position.y = -0.32;
      dynamicGroup.add(botBun);
    };

    // BUILD PIZZA
    const buildPizza = () => {
      dynamicGroup.clear();

      // Pizza crust outer rim
      const crustMat = new THREE.MeshStandardMaterial({ color: 0xc87d32, roughness: 0.7 });
      const crustGeo = new THREE.TorusGeometry(1.4, 0.16, 16, 40);
      const crust = new THREE.Mesh(crustGeo, crustMat);
      crust.rotation.x = Math.PI / 2;
      dynamicGroup.add(crust);

      // Cheese base
      const cheeseBaseMat = new THREE.MeshStandardMaterial({ color: 0xffcc33, roughness: 0.4 });
      const cheeseBaseGeo = new THREE.CylinderGeometry(1.36, 1.36, 0.08, 36);
      const cheeseBase = new THREE.Mesh(cheeseBaseGeo, cheeseBaseMat);
      dynamicGroup.add(cheeseBase);

      // Paneer Cubes
      const paneerMat = new THREE.MeshStandardMaterial({ color: 0xfffcf0, roughness: 0.5 });
      const paneerGeo = new THREE.BoxGeometry(0.18, 0.14, 0.18);
      for (let i = 0; i < 9; i++) {
        const pMesh = new THREE.Mesh(paneerGeo, paneerMat);
        const angle = (i / 9) * Math.PI * 2 + 0.2;
        const rad = 0.75 + (i % 2 === 0 ? 0.25 : -0.2);
        pMesh.position.set(Math.cos(angle) * rad, 0.08, Math.sin(angle) * rad);
        pMesh.rotation.y = Math.random();
        dynamicGroup.add(pMesh);
      }

      // Olives (rings)
      const oliveMat = new THREE.MeshStandardMaterial({ color: 0x1f2421, roughness: 0.3 });
      const oliveGeo = new THREE.TorusGeometry(0.09, 0.04, 8, 16);
      for (let i = 0; i < 8; i++) {
        const oMesh = new THREE.Mesh(oliveGeo, oliveMat);
        const angle = (i / 8) * Math.PI * 2 + 0.6;
        const rad = 0.85 + (i % 2 === 0 ? -0.3 : 0.2);
        oMesh.position.set(Math.cos(angle) * rad, 0.06, Math.sin(angle) * rad);
        oMesh.rotation.x = Math.PI / 2;
        dynamicGroup.add(oMesh);
      }

      // Cherry tomato half
      const tomatoMat = new THREE.MeshStandardMaterial({ color: 0xcc2914, roughness: 0.2 });
      const tomatoGeo = new THREE.SphereGeometry(0.12, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2);
      for (let i = 0; i < 7; i++) {
        const tMesh = new THREE.Mesh(tomatoGeo, tomatoMat);
        const angle = (i / 7) * Math.PI * 2 + 0.9;
        const rad = 0.5 + (i % 2 === 0 ? 0.35 : 0.05);
        tMesh.position.set(Math.cos(angle) * rad, 0.05, Math.sin(angle) * rad);
        dynamicGroup.add(tMesh);
      }
    };

    // BUILD COFFEE
    const buildCoffee = () => {
      dynamicGroup.clear();

      // Glass cup
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.85,
        opacity: 1,
        transparent: true,
        roughness: 0.1,
        ior: 1.5,
      });
      const glassGeo = new THREE.CylinderGeometry(0.85, 0.6, 2.2, 32, 1, true);
      const glass = new THREE.Mesh(glassGeo, glassMat);
      glass.position.y = 0.1;
      dynamicGroup.add(glass);

      // Coffee liquid inside
      const coffeeMat = new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 0.25 });
      const coffeeGeo = new THREE.CylinderGeometry(0.82, 0.58, 1.8, 32);
      const coffee = new THREE.Mesh(coffeeGeo, coffeeMat);
      coffee.position.y = -0.05;
      dynamicGroup.add(coffee);

      // Whipped cream dome on top
      const creamMat = new THREE.MeshStandardMaterial({ color: 0xfffcf7, roughness: 0.5 });
      const creamGeo = new THREE.ConeGeometry(0.86, 0.7, 32);
      const cream = new THREE.Mesh(creamGeo, creamMat);
      cream.position.y = 1.05;
      dynamicGroup.add(cream);

      // Chocolate drizzle ring
      const drizzleMat = new THREE.MeshStandardMaterial({ color: 0x22120b, roughness: 0.3 });
      const drizzleGeo = new THREE.TorusGeometry(0.5, 0.04, 8, 24);
      const drizzle = new THREE.Mesh(drizzleGeo, drizzleMat);
      drizzle.rotation.x = Math.PI / 2.3;
      drizzle.position.y = 1.1;
      dynamicGroup.add(drizzle);

      // Red Striped Straw
      const strawMat = new THREE.MeshStandardMaterial({ color: 0xee3322, roughness: 0.3 });
      const strawGeo = new THREE.CylinderGeometry(0.05, 0.05, 2.8, 16);
      const straw = new THREE.Mesh(strawGeo, strawMat);
      straw.position.set(0.3, 0.8, 0.1);
      straw.rotation.z = -0.25;
      dynamicGroup.add(straw);
    };

    if (activeModel === 'burger') buildBurger();
    else if (activeModel === 'pizza') buildPizza();
    else buildCoffee();

    // Floating spices / embers particles
    const particleCount = 70;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 1] = Math.random() * 4 - 1.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      scales[i] = Math.random() * 0.05 + 0.02;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffa500,
      size: 0.08,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (isRotating && !isDraggingRef.current && rootGroup) {
        rootGroup.rotation.y += 0.007;
      }

      // Gentle floating bob
      if (dynamicGroup) {
        dynamicGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.1;
      }

      // Spin pedestal ring slowly
      ringMesh.rotation.z += 0.005;

      // Drift particles upward
      const posAttr = particleGeo.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        let y = posAttr.getY(i);
        y += 0.01;
        if (y > 3) y = -1.5;
        posAttr.setY(i, y);
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Mouse & Touch Interaction
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
      onInteraction?.();
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !rootGroup) return;

      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      rootGroup.rotation.y += deltaX * 0.008;
      rootGroup.rotation.x = Math.max(-0.4, Math.min(0.7, rootGroup.rotation.x + deltaY * 0.008));

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        onInteraction?.();
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || !rootGroup || e.touches.length !== 1) return;

      const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
      const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;

      rootGroup.rotation.y += deltaX * 0.01;
      rootGroup.rotation.x = Math.max(-0.4, Math.min(0.7, rootGroup.rotation.x + deltaY * 0.01));

      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
    };

    const handleResize = () => {
      if (!mount) return;
      const newWidth = mount.clientWidth;
      const newHeight = mount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    mount.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    mount.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      mount.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      mount.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);

      window.removeEventListener('resize', handleResize);

      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [activeModel, isRotating, onInteraction]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* 3D WebGL Canvas container */}
      <div
        ref={mountRef}
        className="w-full h-[380px] sm:h-[440px] md:h-[480px] lg:h-[520px] cursor-grab active:cursor-grabbing relative select-none"
        title="Click and drag to rotate in 3D"
      />

      {/* 3D Control Bar Overlay */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#12100E]/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-500/25 shadow-xl shadow-black/60 z-20">
        <span className="text-[11px] font-semibold tracking-wide text-amber-400 uppercase mr-1 hidden sm:inline">
          3D Dish:
        </span>
        <button
          onClick={() => setActiveModel('burger')}
          className={`text-xs px-2.5 py-1 rounded-full transition-all duration-200 ${
            activeModel === 'burger'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          🍔 Burger
        </button>
        <button
          onClick={() => setActiveModel('pizza')}
          className={`text-xs px-2.5 py-1 rounded-full transition-all duration-200 ${
            activeModel === 'pizza'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          🍕 Pizza
        </button>
        <button
          onClick={() => setActiveModel('coffee')}
          className={`text-xs px-2.5 py-1 rounded-full transition-all duration-200 ${
            activeModel === 'coffee'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          ☕ Frappe
        </button>
        <div className="w-[1px] h-4 bg-white/10 mx-1" />
        <button
          onClick={() => setIsRotating((prev) => !prev)}
          className={`text-[11px] px-2 py-0.5 rounded transition ${
            isRotating ? 'text-amber-300' : 'text-neutral-500'
          }`}
          title="Toggle Auto-Rotation"
        >
          {isRotating ? '⏸ Pause' : '▶ Spin'}
        </button>
      </div>

      <div className="absolute top-2 right-4 text-[10px] text-amber-400/80 bg-black/50 px-2 py-1 rounded-md pointer-events-none backdrop-blur-sm border border-amber-500/20">
        ✨ Drag to rotate in 3D
      </div>
    </div>
  );
};
