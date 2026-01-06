import React, { useEffect, useRef, useContext, useState } from 'react';
import * as THREE from 'three';
import { Link } from 'react-router-dom'; // Added this back for the link
import { DatC } from '../context'; 

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

        // 1. STARFIELD
        const starGeo = new THREE.SphereGeometry(250, 32, 32);
        const starMat = new THREE.MeshBasicMaterial({
            map: loader.load('/vimal-s-GBg3jyGS-Ug-unsplash.jpg'),
            side: THREE.BackSide 
        });
        scene.add(new THREE.Mesh(starGeo, starMat));

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        if (mountRef.current) {
            mountRef.current.innerHTML = "";
            mountRef.current.appendChild(renderer.domElement);
        }

        scene.add(new THREE.AmbientLight(0xffffff, 0.6));
        const sun = new THREE.DirectionalLight(0xffffff, 2);
        sun.position.set(5, 10, 7);
        scene.add(sun);

        // 2. THE PERMANENT EARTH (Restored)
        const earthGroup = new THREE.Group();
        const earthMesh = new THREE.Mesh(
            new THREE.IcosahedronGeometry(3, 15), 
            new THREE.MeshStandardMaterial({ map: loader.load('/earth_day.jpg') })
        );
        const clouds = new THREE.Mesh(
            new THREE.IcosahedronGeometry(3.06, 15), 
            new THREE.MeshStandardMaterial({ map: loader.load('/earth_clouds.jpg'), transparent: true, opacity: 0.3 })
        );
        earthGroup.add(earthMesh, clouds);
        scene.add(earthGroup);

        // 3. SPAWN CUSTOM PLANETS FROM MAP PAGE
        planets.forEach(p => {
            const geometry = new THREE.SphereGeometry(Number(p.size), 32, 32);
            const customTexture = loader.load(p.texture);
            const material = new THREE.MeshStandardMaterial({ map: customTexture });
            const planet = new THREE.Mesh(geometry, material);
            planet.position.set(p.x, 0, p.z);
            scene.add(planet);
        });

        // 4. SHIP
        const shipGroup = new THREE.Group();
        const metalMat = new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.9, roughness: 0.1 });
        const body = new THREE.Mesh(new THREE.ConeGeometry(0.2, 1.2, 12), metalMat);
        body.rotation.x = Math.PI / 2;
        shipGroup.add(body);
        shipGroup.position.set(0, 0, 20);
        scene.add(shipGroup);
        shipRef.current = shipGroup;

        // 5. CONTROLS & ANIMATION
        const onKeyDown = (e) => { keys.current[e.key.toLowerCase()] = true; };
        const onKeyUp = (e) => { keys.current[e.key.toLowerCase()] = false; };
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);

        const animate = () => {
            frameId = requestAnimationFrame(animate);
            earthGroup.rotation.y += 0.001; // Earth still spins

            if (shipRef.current) {
                const ship = shipRef.current;
                const speed = keys.current['shift'] ? 0.4 : 0.15;
                if (keys.current['w']) ship.translateZ(-speed);
                if (keys.current['s']) ship.translateZ(speed);
                if (keys.current['a']) ship.rotation.y += 0.035;
                if (keys.current['d']) ship.rotation.y -= 0.035;
                if (keys.current['r']) ship.position.y += speed;
                if (keys.current['f']) ship.position.y -= speed;

                setShipPos({ x: ship.position.x, z: ship.position.z });
                setHudCoords({ x: ship.position.x.toFixed(1), y: ship.position.y.toFixed(1), z: ship.position.z.toFixed(1) });

                const camOffset = new THREE.Vector3(0, 1.8, 6).applyMatrix4(ship.matrixWorld);
                camera.position.lerp(camOffset, 0.1);
                camera.lookAt(ship.position);
            }
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
            renderer.dispose();
        };
    }, [planets]);

    return (
        <div style={{ position: "relative", backgroundColor: "#000" }}>
            <div ref={mountRef} style={{ width: "100vw", height: "100vh", overflow: "hidden" }} />
            
            {/* MAP NAVIGATION LINK (Restored) */}
            <div style={navStyle}>
                <Link to="/map" style={{ color: "#0ff", textDecoration: "none", fontSize: "1.2em", fontWeight: "bold" }}>
                    🛰️ OPEN PLANET MAP
                </Link>
            </div>

            {/* TELEMETRY HUD */}
            <div style={hudStyle}>
                <h2 style={{margin: "0 0 10px 0", color: "#0ff"}}>E-45 TELEMETRY</h2>
                <p>X: {hudCoords.x} | Y: {hudCoords.y} | Z: {hudCoords.z}</p>
                <div style={{fontSize: "0.8em"}}>W/S: THRUST | R/F: ALTITUDE</div>
            </div>
        </div>
    );
};

const navStyle = {
    position: "absolute",
    top: "20px",
    left: "20px",
    background: "rgba(0, 20, 20, 0.8)",
    padding: "10px 20px",
    borderRadius: "5px",
    border: "1px solid #0ff",
    zIndex: 10
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
    fontFamily: "monospace"
};

export default Gamep;