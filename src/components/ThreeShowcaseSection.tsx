import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Eye, RotateCw, ZoomIn, Sun, Flame, Moon, Check } from 'lucide-react';

interface ShowcaseItemInfo {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  tag: string;
  highlights: string[];
}

const SHOWCASE_ITEMS: ShowcaseItemInfo[] = [
  {
    id: 'pizza',
    title: 'Volcano Pizza',
    subtitle: 'Signature Center-Burst Mozzarella Crust with Marinated Paneer & Herbs',
    category: 'Artisan Pizzas',
    tag: 'House Masterpiece',
    highlights: ['Freshly hand-stretched dough', '100% real mozzarella cheese melt', 'Tandoori marinated cottage cheese', 'Fresh sweet corn & Spanish olives'],
  },
  {
    id: 'burger',
    title: 'Special Loaded Burger',
    subtitle: 'Double Deck Stacked Brioche with Crispy Patty & Cheddar Meltdown',
    category: 'Gourmet Burgers',
    tag: 'Chef Special',
    highlights: ['Toasted sesame butter brioche', 'Thick spiced crunchy golden patty', 'Signature house secret sauce blend', 'Crisp garden greens & pickled relish'],
  },
  {
    id: 'coffee',
    title: 'Dream Cold Coffee',
    subtitle: 'Creamy Slow-Roasted Cold Brew Swirled with Chocolate Ganache',
    category: 'Handcrafted Beverages',
    tag: 'All-Time Favorite',
    highlights: ['Double shot dark roasted beans', 'Velvety chilled dairy blend', 'Madagascar vanilla & chocolate whip', 'Pure concentrated cold brew flavor'],
  },
  {
    id: 'momos',
    title: 'Kurkure Momos Platter',
    subtitle: 'Crusted Ultra-Crunchy Dumplings with Spicy Fiery Dip',
    category: 'Sides & Snacks',
    tag: 'Super Crunch',
    highlights: ['Flaky spiced golden coating', 'Steamy fragrant paneer / veggie core', 'Smoky red chili garlic dip', 'Beri favorite evening bite'],
  },
];

export const ThreeShowcaseSection: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<'pizza' | 'burger' | 'coffee' | 'momos'>('pizza');
  const [lightPreset, setLightPreset] = useState<'warm' | 'gold' | 'neon'>('warm');
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(4.8);

  const modelGroupRef = useRef<THREE.Group | null>(null);
  const lightsRef = useRef<{
    keyLight: THREE.DirectionalLight;
    rimLight: THREE.PointLight;
    pedestalLight: THREE.PointLight;
    ambientLight: THREE.AmbientLight;
  } | null>(null);
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });

  const currentItem = SHOWCASE_ITEMS.find((item) => item.id === selectedId) || SHOWCASE_ITEMS[0];

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.4, zoomLevel);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xfff0dd, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffa238, 2.5);
    keyLight.position.set(4, 6, 4);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0xff6600, 3, 10);
    rimLight.position.set(-4, 2, -3);
    scene.add(rimLight);

    const pedestalLight = new THREE.PointLight(0xffb703, 2.2, 5);
    pedestalLight.position.set(0, -1, 0);
    scene.add(pedestalLight);

    lightsRef.current = { keyLight, rimLight, pedestalLight, ambientLight };

    // Pedestal
    const pedestalGroup = new THREE.Group();
    scene.add(pedestalGroup);

    const plateGeo = new THREE.CylinderGeometry(1.9, 2.1, 0.16, 48);
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0x181512,
      roughness: 0.35,
      metalness: 0.4,
    });
    const plate = new THREE.Mesh(plateGeo, plateMat);
    plate.position.y = -0.95;
    pedestalGroup.add(plate);

    const rimRingGeo = new THREE.TorusGeometry(1.92, 0.035, 16, 64);
    const rimRingMat = new THREE.MeshStandardMaterial({
      color: 0xffaa22,
      emissive: 0xaa5500,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.8,
    });
    const rimRing = new THREE.Mesh(rimRingGeo, rimRingMat);
    rimRing.rotation.x = Math.PI / 2;
    rimRing.position.y = -0.86;
    pedestalGroup.add(rimRing);

    // Dynamic Food Mesh Group
    const foodGroup = new THREE.Group();
    scene.add(foodGroup);
    modelGroupRef.current = foodGroup;

    // BUILD DIFFERENT 3D MODELS
    const buildModel = () => {
      foodGroup.clear();

      if (selectedId === 'pizza') {
        // Pizza Crust
        const crustGeo = new THREE.TorusGeometry(1.35, 0.18, 20, 48);
        const crustMat = new THREE.MeshStandardMaterial({
          color: 0xd27d2d,
          roughness: 0.75,
          wireframe,
        });
        const crust = new THREE.Mesh(crustGeo, crustMat);
        crust.rotation.x = Math.PI / 2;
        foodGroup.add(crust);

        // Cheese Bed
        const cheeseGeo = new THREE.CylinderGeometry(1.3, 1.3, 0.09, 40);
        const cheeseMat = new THREE.MeshStandardMaterial({
          color: 0xffbb22,
          roughness: 0.35,
          wireframe,
        });
        const cheese = new THREE.Mesh(cheeseGeo, cheeseMat);
        foodGroup.add(cheese);

        // Center Volcano Cheese Mound
        const centerMoundGeo = new THREE.ConeGeometry(0.5, 0.22, 24);
        const centerMound = new THREE.Mesh(centerMoundGeo, cheeseMat);
        centerMound.position.y = 0.1;
        foodGroup.add(centerMound);

        // Toppings (Paneer cubes, herbs, red peppers, olives)
        const paneerGeo = new THREE.BoxGeometry(0.18, 0.12, 0.18);
        const paneerMat = new THREE.MeshStandardMaterial({ color: 0xfffae8, roughness: 0.4, wireframe });
        for (let i = 0; i < 11; i++) {
          const mesh = new THREE.Mesh(paneerGeo, paneerMat);
          const angle = (i / 11) * Math.PI * 2;
          const r = 0.5 + (i % 3) * 0.28;
          mesh.position.set(Math.cos(angle) * r, 0.08, Math.sin(angle) * r);
          mesh.rotation.y = Math.random() * Math.PI;
          foodGroup.add(mesh);
        }

        const pepperGeo = new THREE.BoxGeometry(0.2, 0.04, 0.08);
        const pepperMat = new THREE.MeshStandardMaterial({ color: 0xd62828, roughness: 0.3, wireframe });
        for (let i = 0; i < 9; i++) {
          const mesh = new THREE.Mesh(pepperGeo, pepperMat);
          const angle = (i / 9) * Math.PI * 2 + 0.3;
          const r = 0.65 + (i % 2) * 0.35;
          mesh.position.set(Math.cos(angle) * r, 0.07, Math.sin(angle) * r);
          mesh.rotation.y = angle + 0.5;
          foodGroup.add(mesh);
        }
      } else if (selectedId === 'burger') {
        // Bun Top
        const bunMat = new THREE.MeshStandardMaterial({ color: 0xcd7f32, roughness: 0.4, wireframe });
        const topBunGeo = new THREE.SphereGeometry(1.2, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.42);
        const topBun = new THREE.Mesh(topBunGeo, bunMat);
        topBun.position.y = 0.6;
        foodGroup.add(topBun);

        // Sesame Seeds
        const seedGeo = new THREE.SphereGeometry(0.022, 6, 6);
        seedGeo.scale(1, 0.3, 1.8);
        const seedMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
        for (let i = 0; i < 40; i++) {
          const seed = new THREE.Mesh(seedGeo, seedMat);
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * 0.32 + 0.08;
          seed.position.set(1.21 * Math.sin(phi) * Math.cos(theta), 0.6 + 1.21 * Math.cos(phi), 1.21 * Math.sin(phi) * Math.sin(theta));
          seed.lookAt(seed.position.clone().multiplyScalar(2));
          foodGroup.add(seed);
        }

        // Double Patties
        const pattyMat = new THREE.MeshStandardMaterial({ color: 0x442614, roughness: 0.85, wireframe });
        const pGeo = new THREE.CylinderGeometry(1.16, 1.16, 0.22, 32);
        const p1 = new THREE.Mesh(pGeo, pattyMat);
        p1.position.y = 0.32;
        const p2 = new THREE.Mesh(pGeo, pattyMat);
        p2.position.y = -0.06;
        foodGroup.add(p1, p2);

        // Cheese Drip
        const cheeseMat = new THREE.MeshStandardMaterial({ color: 0xffb703, roughness: 0.3, wireframe });
        const cGeo = new THREE.BoxGeometry(1.5, 0.04, 1.5);
        const c1 = new THREE.Mesh(cGeo, cheeseMat);
        c1.position.y = 0.44;
        c1.rotation.y = Math.PI / 4;
        const c2 = new THREE.Mesh(cGeo, cheeseMat);
        c2.position.y = 0.06;
        c2.rotation.y = Math.PI / 6;
        foodGroup.add(c1, c2);

        // Bottom Bun
        const botBunGeo = new THREE.CylinderGeometry(1.18, 1.05, 0.32, 32);
        const botBun = new THREE.Mesh(botBunGeo, bunMat);
        botBun.position.y = -0.32;
        foodGroup.add(botBun);
      } else if (selectedId === 'coffee') {
        // Tall glass
        const glassMat = new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          transmission: 0.9,
          roughness: 0.08,
          transparent: true,
          wireframe,
        });
        const glassGeo = new THREE.CylinderGeometry(0.85, 0.62, 2.3, 32, 1, true);
        const glass = new THREE.Mesh(glassGeo, glassMat);
        glass.position.y = 0.2;
        foodGroup.add(glass);

        // Liquid
        const coffeeMat = new THREE.MeshStandardMaterial({ color: 0x3e2417, roughness: 0.3, wireframe });
        const liquidGeo = new THREE.CylinderGeometry(0.82, 0.6, 2.0, 32);
        const liquid = new THREE.Mesh(liquidGeo, coffeeMat);
        liquid.position.y = 0.05;
        foodGroup.add(liquid);

        // Whipped cream dome & peaks
        const creamMat = new THREE.MeshStandardMaterial({ color: 0xfffaf2, roughness: 0.6, wireframe });
        const creamGeo = new THREE.ConeGeometry(0.85, 0.8, 32);
        const cream = new THREE.Mesh(creamGeo, creamMat);
        cream.position.y = 1.25;
        foodGroup.add(cream);

        // Cocoa dust & straw
        const strawMat = new THREE.MeshStandardMaterial({ color: 0xfb8500, roughness: 0.4, wireframe });
        const strawGeo = new THREE.CylinderGeometry(0.045, 0.045, 2.8, 16);
        const straw = new THREE.Mesh(strawGeo, strawMat);
        straw.position.set(0.28, 0.95, 0.1);
        straw.rotation.z = -0.22;
        foodGroup.add(straw);
      } else {
        // Kurkure Momos Platter (6 crisp textured dumplings arranged on plate)
        const momoMat = new THREE.MeshStandardMaterial({
          color: 0xd9822b,
          roughness: 0.85,
          wireframe,
        });

        for (let i = 0; i < 6; i++) {
          const dumplingGroup = new THREE.Group();
          const baseGeo = new THREE.SphereGeometry(0.38, 16, 16);
          baseGeo.scale(1.2, 0.85, 0.95);
          const base = new THREE.Mesh(baseGeo, momoMat);
          dumplingGroup.add(base);

          // Top pleat
          const pleatGeo = new THREE.ConeGeometry(0.18, 0.22, 12);
          const pleat = new THREE.Mesh(pleatGeo, momoMat);
          pleat.position.y = 0.32;
          dumplingGroup.add(pleat);

          const angle = (i / 6) * Math.PI * 2;
          const radius = 0.95;
          dumplingGroup.position.set(Math.cos(angle) * radius, -0.6, Math.sin(angle) * radius);
          dumplingGroup.rotation.y = angle + Math.PI / 2;
          dumplingGroup.rotation.z = 0.1;
          foodGroup.add(dumplingGroup);
        }

        // Center Dip Bowl
        const bowlMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, wireframe });
        const bowlGeo = new THREE.CylinderGeometry(0.42, 0.32, 0.28, 24);
        const bowl = new THREE.Mesh(bowlGeo, bowlMat);
        bowl.position.set(0, -0.68, 0);
        foodGroup.add(bowl);

        // Red spicy chutney inside bowl
        const chutneyMat = new THREE.MeshStandardMaterial({ color: 0xd90429, roughness: 0.3 });
        const chutneyGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.05, 24);
        const chutney = new THREE.Mesh(chutneyGeo, chutneyMat);
        chutney.position.set(0, -0.56, 0);
        foodGroup.add(chutney);
      }
    };

    buildModel();

    // Lighting preset update
    if (lightsRef.current) {
      if (lightPreset === 'warm') {
        lightsRef.current.keyLight.color.setHex(0xffaa44);
        lightsRef.current.rimLight.color.setHex(0xff5500);
        lightsRef.current.pedestalLight.color.setHex(0xffb703);
      } else if (lightPreset === 'gold') {
        lightsRef.current.keyLight.color.setHex(0xffdd66);
        lightsRef.current.rimLight.color.setHex(0xffaa00);
        lightsRef.current.pedestalLight.color.setHex(0xffcc00);
      } else {
        // Neon Amber Night
        lightsRef.current.keyLight.color.setHex(0xff4500);
        lightsRef.current.rimLight.color.setHex(0xff0055);
        lightsRef.current.pedestalLight.color.setHex(0xff7700);
      }
    }

    // Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (autoRotate && !isDraggingRef.current && foodGroup) {
        foodGroup.rotation.y += 0.008;
      }

      rimRing.rotation.z += 0.004;

      // Slight floating motion
      if (foodGroup && selectedId !== 'momos') {
        foodGroup.position.y = Math.sin(elapsed * 1.6) * 0.08;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Interactive Drag rotation
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !foodGroup) return;
      const dx = e.clientX - prevMouseRef.current.x;
      const dy = e.clientY - prevMouseRef.current.y;
      foodGroup.rotation.y += dx * 0.009;
      foodGroup.rotation.x = Math.max(-0.5, Math.min(0.6, foodGroup.rotation.x + dy * 0.009));
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || !foodGroup || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - prevMouseRef.current.x;
      const dy = e.touches[0].clientY - prevMouseRef.current.y;
      foodGroup.rotation.y += dx * 0.012;
      foodGroup.rotation.x = Math.max(-0.5, Math.min(0.6, foodGroup.rotation.x + dy * 0.012));
      prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
    };

    const handleResize = () => {
      if (!mount) return;
      const nw = mount.clientWidth;
      const nh = mount.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };

    mount.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    mount.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
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
  }, [selectedId, lightPreset, wireframe, autoRotate, zoomLevel]);

  return (
    <section id="specials" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background Decorative Accents */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Interactive 3D Food Studio
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
          Experience Culinary Art in <span className="gold-gradient-text">360° Real-Time 3D</span>
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
          Rotate, examine textures, and explore signature handcrafted creations from Dream Cafe Beri. Rendered dynamically in WebGL right in your browser.
        </p>
      </div>

      {/* 3D Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Interactive 3D Canvas */}
        <div className="lg:col-span-7 relative bg-gradient-to-b from-[#181410] to-[#0F0D0B] rounded-3xl border border-amber-500/20 p-4 sm:p-6 shadow-2xl shadow-black/80 flex flex-col items-center">
          {/* Top Canvas Controls Bar */}
          <div className="w-full flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/5 z-10">
            {/* Model Selector Tabs */}
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedId('pizza')}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium transition ${
                  selectedId === 'pizza'
                    ? 'bg-amber-500 text-black font-semibold shadow-lg shadow-amber-500/20'
                    : 'bg-white/5 text-neutral-300 hover:bg-white/10'
                }`}
              >
                🍕 Pizza
              </button>
              <button
                onClick={() => setSelectedId('burger')}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium transition ${
                  selectedId === 'burger'
                    ? 'bg-amber-500 text-black font-semibold shadow-lg shadow-amber-500/20'
                    : 'bg-white/5 text-neutral-300 hover:bg-white/10'
                }`}
              >
                🍔 Burger
              </button>
              <button
                onClick={() => setSelectedId('coffee')}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium transition ${
                  selectedId === 'coffee'
                    ? 'bg-amber-500 text-black font-semibold shadow-lg shadow-amber-500/20'
                    : 'bg-white/5 text-neutral-300 hover:bg-white/10'
                }`}
              >
                ☕ Cold Coffee
              </button>
              <button
                onClick={() => setSelectedId('momos')}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium transition ${
                  selectedId === 'momos'
                    ? 'bg-amber-500 text-black font-semibold shadow-lg shadow-amber-500/20'
                    : 'bg-white/5 text-neutral-300 hover:bg-white/10'
                }`}
              >
                🥟 Kurkure Momos
              </button>
            </div>

            {/* Quick Utility Toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAutoRotate((prev) => !prev)}
                className={`p-1.5 rounded-lg border transition ${
                  autoRotate ? 'border-amber-500/40 text-amber-400 bg-amber-500/10' : 'border-white/10 text-neutral-400'
                }`}
                title="Toggle Auto Spin"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setWireframe((prev) => !prev)}
                className={`p-1.5 rounded-lg border transition ${
                  wireframe ? 'border-amber-500/40 text-amber-400 bg-amber-500/10' : 'border-white/10 text-neutral-400'
                }`}
                title="Toggle 3D Wireframe Mesh"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel((prev) => (prev > 4.2 ? 3.8 : 4.8))}
                className="p-1.5 rounded-lg border border-white/10 text-neutral-400 hover:text-white transition"
                title="Toggle Zoom Distance"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 3D WebGL Canvas */}
          <div
            ref={mountRef}
            className="w-full h-[360px] sm:h-[420px] md:h-[460px] cursor-grab active:cursor-grabbing relative"
            title="Drag to orbit in 3D"
          />

          {/* Bottom Lighting Presets */}
          <div className="w-full flex items-center justify-between pt-3 border-t border-white/5 text-xs text-neutral-400">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400">Atmosphere:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setLightPreset('warm')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] transition ${
                  lightPreset === 'warm' ? 'border-amber-500 text-amber-300 bg-amber-500/15' : 'border-white/10'
                }`}
              >
                <Sun className="w-3 h-3 text-amber-400" /> Warm Bistro
              </button>
              <button
                onClick={() => setLightPreset('gold')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] transition ${
                  lightPreset === 'gold' ? 'border-amber-500 text-amber-300 bg-amber-500/15' : 'border-white/10'
                }`}
              >
                <Flame className="w-3 h-3 text-orange-400" /> Golden Hour
              </button>
              <button
                onClick={() => setLightPreset('neon')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] transition ${
                  lightPreset === 'neon' ? 'border-amber-500 text-amber-300 bg-amber-500/15' : 'border-white/10'
                }`}
              >
                <Moon className="w-3 h-3 text-red-400" /> Midnight Ember
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Culinary Details Card */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            {currentItem.tag}
          </div>

          <div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
              {currentItem.title}
            </h3>
            <p className="text-amber-200/80 text-sm font-medium mb-3">
              {currentItem.category}
            </p>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              {currentItem.subtitle}
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="text-xs uppercase tracking-widest text-neutral-400 font-semibold">
              Culinary Craftsmanship
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentItem.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2 bg-white/[0.03] p-2.5 rounded-xl border border-white/5">
                  <Check className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <span className="text-xs text-neutral-200 leading-tight">{h}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex flex-wrap gap-4 items-center">
            <a
              href="#menu"
              className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-black font-bold text-sm tracking-wide shadow-lg shadow-orange-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              View in Menu Catalog
            </a>
            <a
              href="tel:+918278233573"
              className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-medium text-sm border border-white/10 transition-all"
            >
              Call Dream Cafe
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
