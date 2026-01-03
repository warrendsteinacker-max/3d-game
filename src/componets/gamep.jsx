import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Gamep = () => {
    const mountRef = useRef(null);
    const shipRef = useRef(null);
    const keys = useRef({});

    useEffect(() => {
        let frameId;
        const scene = new THREE.Scene();
        const loader = new THREE.TextureLoader();

        // 1. IMPROVED BACKGROUND (Starfield)
        // We create a large sphere around the scene with stars inside
        const starGeo = new THREE.SphereGeometry(90, 32, 32);
        const starMat = new THREE.MeshBasicMaterial({
            map: loader.load('/vimal-s-GBg3jyGS-Ug-unsplash.jpg'),
            side: THREE.BackSide // Render on the inside of the sphere
        });
        const starField = new THREE.Mesh(starGeo, starMat);
        scene.add(starField);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Clear previous canvas if any (Fixes the multiple canvas bug)
        if (mountRef.current) {
            mountRef.current.innerHTML = "";
            mountRef.current.appendChild(renderer.domElement);
        }

        const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
        sunLight.position.set(-5, 10, 7);
        scene.add(sunLight);
        scene.add(new THREE.AmbientLight(0x404040, 2));

        // 2. REALISTIC GEOMETRY SHIP
        const shipGroup = new THREE.Group();
        const metalMat = new THREE.MeshStandardMaterial({ 
            color: 0x888888, 
            metalness: 0.8, 
            roughness: 0.2 
        });

        // Main Cockpit/Body
        const body = new THREE.Mesh(new THREE.ConeGeometry(0.25, 1, 12), metalMat);
        body.rotation.x = Math.PI / 2;
        shipGroup.add(body);

        // Sleek Wings
        const wingShape = new THREE.BoxGeometry(1.2, 0.05, 0.5);
        const wings = new THREE.Mesh(wingShape, metalMat);
        wings.position.z = 0.2;
        shipGroup.add(wings);

        // Engine Glow (The "Realistic" touch)
        const engineGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 12);
        const engineMat = new THREE.MeshBasicMaterial({ color: 0x00ffff }); // Cyan Glow
        const engine = new THREE.Mesh(engineGeo, engineMat);
        engine.rotation.x = Math.PI / 2;
        engine.position.z = 0.5;
        shipGroup.add(engine);

        // Point Light for the Engine
        const thrusterLight = new THREE.PointLight(0x00ffff, 1, 2);
        thrusterLight.position.set(0, 0, 0.6);
        shipGroup.add(thrusterLight);

        shipGroup.position.set(0, 0, 10);
        scene.add(shipGroup);
        shipRef.current = shipGroup;

        // 3. EARTH
        const earthGroup = new THREE.Group();
        const earthMesh = new THREE.Mesh(
            new THREE.IcosahedronGeometry(2, 12), 
            new THREE.MeshStandardMaterial({ map: loader.load('/earth_day.jpg') })
        );
        const clouds = new THREE.Mesh(
            new THREE.IcosahedronGeometry(2.05, 12), 
            new THREE.MeshStandardMaterial({ map: loader.load('/earth_clouds.jpg'), transparent: true, opacity: 0.4 })
        );
        earthGroup.add(earthMesh, clouds);
        scene.add(earthGroup);

        // 4. CONTROLS & ANIMATION
        const onKeyDown = (e) => { keys.current[e.key.toLowerCase()] = true; };
        const onKeyUp = (e) => { keys.current[e.key.toLowerCase()] = false; };
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);

        const animate = () => {
            frameId = requestAnimationFrame(animate);
            earthGroup.rotation.y += 0.0005;

            if (shipRef.current) {
                const ship = shipRef.current;
                const speed = keys.current['w'] ? 0.15 : (keys.current['s'] ? -0.1 : 0);
                ship.translateZ(-speed);

                if (keys.current['a']) ship.rotation.y += 0.03;
                if (keys.current['d']) ship.rotation.y -= 0.03;

                // Camera following
                const cameraOffset = new THREE.Vector3(0, 1.2, 5).applyMatrix4(ship.matrixWorld);
                camera.position.lerp(cameraOffset, 0.1);
                camera.lookAt(ship.position);
            }
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // CLEANUP
        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
            if (mountRef.current) mountRef.current.innerHTML = "";
            renderer.dispose();
        };
    }, []);

    return <div ref={mountRef} style={{ width: "100vw", height: "100vh", background: "#000" }} />;
};

export default Gamep;