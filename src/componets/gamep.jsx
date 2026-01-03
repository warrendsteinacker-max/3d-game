import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Gamep = () => {
    const mountRef = useRef(null);
    const shipRef = useRef(null);
    const keys = useRef({});

    useEffect(() => {
        const scene = new THREE.Scene();
        const loader = new THREE.TextureLoader();
        scene.background = loader.load('/vimal-s-GBg3jyGS-Ug-unsplash.jpg');

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap pixel ratio for performance
        mountRef.current.appendChild(renderer.domElement);

        const sunLight = new THREE.DirectionalLight(0xffffff, 2);
        sunLight.position.set(-2, 5, 5);
        scene.add(sunLight);
        scene.add(new THREE.AmbientLight(0xffffff, 0.4));

        // 1. HIGH-PERFORMANCE EARTH SETUP
        const earthGroup = new THREE.Group();
        // Lower geometry detail to save your GPU
        const earthGeo = new THREE.IcosahedronGeometry(1, 6); 
        
        const earthMesh = new THREE.Mesh(
            earthGeo, 
            new THREE.MeshStandardMaterial({ map: loader.load('/earth_day.jpg') })
        );
        
        const cloudsMesh = new THREE.Mesh(
            earthGeo, 
            new THREE.MeshStandardMaterial({ 
                map: loader.load('/earth_clouds.jpg'), 
                transparent: true, 
                opacity: 0.3 
            })
        );
        cloudsMesh.scale.setScalar(1.01);
        earthGroup.add(earthMesh, cloudsMesh);
        scene.add(earthGroup);

        // 2. GEOMETRY-BASED SPACESHIP (ZERO LAG)
        const shipGroup = new THREE.Group();
        
        // Ship Body (Cone)
        const bodyGeo = new THREE.ConeGeometry(0.2, 0.8, 8);
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.rotation.x = Math.PI / 2; // Point forward
        shipGroup.add(body);

        // Wings (Boxes)
        const wingGeo = new THREE.BoxGeometry(0.8, 0.05, 0.3);
        const wing = new THREE.Mesh(wingGeo, bodyMat);
        shipGroup.add(wing);

        shipGroup.position.set(0, 0, 5);
        scene.add(shipGroup);
        shipRef.current = shipGroup;

        // 3. INPUTS & ANIMATION
        const onKeyDown = (e) => { keys.current[e.key.toLowerCase()] = true; };
        const onKeyUp = (e) => { keys.current[e.key.toLowerCase()] = false; };
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);

        const animate = () => {
            const frameId = requestAnimationFrame(animate);
            earthGroup.rotation.y += 0.001;

            if (shipRef.current) {
                const ship = shipRef.current;
                if (keys.current['w']) ship.translateZ(-0.1);
                if (keys.current['s']) ship.translateZ(0.1);
                if (keys.current['a']) ship.rotation.y += 0.04;
                if (keys.current['d']) ship.rotation.y -= 0.04;

                const offset = new THREE.Vector3(0, 1.5, 4).applyMatrix4(ship.matrixWorld);
                camera.position.lerp(offset, 0.1);
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

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
            if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, []);

    return <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />;
};

export default Gamep;