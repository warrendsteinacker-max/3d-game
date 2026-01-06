import React, { useEffect, useRef, useContext, useState } from 'react';
import * as THREE from 'three';
import { DatC } from '../context'; // Ensure your context path is correct

const Gamep = () => {
    const mountRef = useRef(null);
    const shipRef = useRef(null);
    const keys = useRef({});
    const { planets, setShipPos } = useContext(DatC);
    const [hudCoords, setHudCoords] = useState({ x: 0, y: 0, z: 0 });

    useEffect(() => {
        let frameId;
        const scene = new THREE.Scene();
        const loader = new THREE.TextureLoader();

        // 1. STARFIELD SPHERE
        const starGeo = new THREE.SphereGeometry(250, 32, 32);
        const starMat = new THREE.MeshBasicMaterial({
            map: loader.load('/vimal-s-GBg3jyGS-Ug-unsplash.jpg'),
            side: THREE.BackSide 
        });
        scene.add(new THREE.Mesh(starGeo, starMat));

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        if (mountRef.current) {
            mountRef.current.innerHTML = "";
            mountRef.current.appendChild(renderer.domElement);
        }

        scene.add(new THREE.AmbientLight(0xffffff, 0.6));
        const sun = new THREE.DirectionalLight(0xffffff, 2);
        sun.position.set(5, 10, 7);
        scene.add(sun);

        // 2. SPAWN CUSTOM PLANETS FROM CONTEXT
        planets.forEach(p => {
            const geometry = new THREE.SphereGeometry(Number(p.size), 32, 32);
            // Load the base64 string drawing from the Map page
            const customTexture = loader.load(p.texture);
            const material = new THREE.MeshStandardMaterial({ 
                map: customTexture,
                roughness: 0.8
            });
            const planet = new THREE.Mesh(geometry, material);
            planet.position.set(p.x, 0, p.z);
            scene.add(planet);
        });

        // 3. ADVANCED GEOMETRY SHIP (High Performance)
        const shipGroup = new THREE.Group();
        const metalMat = new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.9, roughness: 0.1 });
        
        const body = new THREE.Mesh(new THREE.ConeGeometry(0.2, 1.2, 12), metalMat);
        body.rotation.x = Math.PI / 2;
        shipGroup.add(body);

        const wings = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.05, 0.4), metalMat);
        wings.position.z = 0.2;
        shipGroup.add(wings);

        // Thruster Glow
        const engine = new THREE.Mesh(
            new THREE.CylinderGeometry(0.12, 0.12, 0.1, 12), 
            new THREE.MeshBasicMaterial({ color: 0x00ffff })
        );
        engine.rotation.x = Math.PI / 2;
        engine.position.z = 0.6;
        shipGroup.add(engine);

        shipGroup.position.set(0, 0, 20);
        scene.add(shipGroup);
        shipRef.current = shipGroup;

        // 4. CONTROLS
        const onKeyDown = (e) => { keys.current[e.key.toLowerCase()] = true; };
        const onKeyUp = (e) => { keys.current[e.key.toLowerCase()] = false; };
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);

        const animate = () => {
            frameId = requestAnimationFrame(animate);

            if (shipRef.current) {
                const ship = shipRef.current;
                const speed = keys.current['shift'] ? 0.4 : 0.15;

                if (keys.current['w']) ship.translateZ(-speed);
                if (keys.current['s']) ship.translateZ(speed);
                if (keys.current['a']) ship.rotation.y += 0.035;
                if (keys.current['d']) ship.rotation.y -= 0.035;
                if (keys.current['r']) ship.position.y += speed;
                if (keys.current['f']) ship.position.y -= speed;

                // Sync Position back to Map
                setShipPos({ x: ship.position.x, z: ship.position.z });
                setHudCoords({ 
                    x: ship.position.x.toFixed(1), 
                    y: ship.position.y.toFixed(1), 
                    z: ship.position.z.toFixed(1) 
                });

                const camOffset = new THREE.Vector3(0, 1.8, 6).applyMatrix4(ship.matrixWorld);
                camera.position.lerp(camOffset, 0.1);
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
            cancelAnimationFrame(frameId);
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
            window.removeEventListener('resize', handleResize);
            if (mountRef.current) mountRef.current.innerHTML = "";
            renderer.dispose();
        };
    }, [planets]); // Refresh scene when context planets change

    return (
        <div style={{ position: "relative", backgroundColor: "#000" }}>
            <div ref={mountRef} style={{ width: "100vw", height: "100vh", overflow: "hidden" }} />
            
            {/* FLIGHT HUD */}
            <div style={hudStyle}>
                <h2 style={{margin: "0 0 10px 0", color: "#0ff"}}>E-45 TELEMETRY</h2>
                <p>X: {hudCoords.x}</p>
                <p>Y: {hudCoords.y}</p>
                <p>Z: {hudCoords.z}</p>
                <div style={{marginTop: "10px", fontSize: "0.8em"}}>
                    W/S: THRUST | R/F: ALTITUDE | SHIFT: BOOST
                </div>
            </div>
        </div>
    );
};

const hudStyle = {
    position: "absolute",
    top: "20px",
    right: "20px",
    background: "rgba(0, 20, 20, 0.8)",
    color: "#fff",
    padding: "15px",
    borderRadius: "10px",
    border: "2px solid #0ff",
    fontFamily: "monospace",
    pointerEvents: "none"
};

export default Gamep;