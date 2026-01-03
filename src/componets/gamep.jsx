import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Link } from 'react-router-dom';

const Gamep = () => {
    const mountRef = useRef(null);
    const shipRef = useRef(null);
    const keys = useRef({});
    const [coords, setCoords] = useState({ x: 0, y: 0, z: 0 });

    useEffect(() => {
        let frameId;
        const scene = new THREE.Scene();
        const loader = new THREE.TextureLoader();

        // 1. Scene Setup
        const starGeo = new THREE.SphereGeometry(200, 32, 32);
        const starMat = new THREE.MeshBasicMaterial({
            map: loader.load('/vimal-s-GBg3jyGS-Ug-unsplash.jpg'),
            side: THREE.BackSide 
        });
        scene.add(new THREE.Mesh(starGeo, starMat));

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true }); // Required for screenshots
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        if (mountRef.current) {
            mountRef.current.innerHTML = "";
            mountRef.current.appendChild(renderer.domElement);
        }

        scene.add(new THREE.AmbientLight(0xffffff, 0.7));

        // 2. Ship Geometry
        const shipGroup = new THREE.Group();
        const metalMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.1 });
        const body = new THREE.Mesh(new THREE.ConeGeometry(0.2, 1.2, 12), metalMat);
        body.rotation.x = Math.PI / 2;
        shipGroup.add(body);
        
        shipGroup.position.set(0, 0, 15);
        scene.add(shipGroup);
        shipRef.current = shipGroup;

        // 3. Earth
        const earthGroup = new THREE.Group();
        earthGroup.add(new THREE.Mesh(
            new THREE.IcosahedronGeometry(3, 15), 
            new THREE.MeshStandardMaterial({ map: loader.load('/earth_day.jpg') })
        ));
        scene.add(earthGroup);

        // 4. Input & Animation
        const onKeyDown = (e) => { keys.current[e.key.toLowerCase()] = true; };
        const onKeyUp = (e) => { keys.current[e.key.toLowerCase()] = false; };
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);

        const animate = () => {
            frameId = requestAnimationFrame(animate);
            if (shipRef.current) {
                const ship = shipRef.current;
                const speed = keys.current['shift'] ? 0.3 : 0.12;
                if (keys.current['w']) ship.translateZ(-speed);
                if (keys.current['s']) ship.translateZ(speed);
                if (keys.current['a']) ship.rotation.y += 0.03;
                if (keys.current['d']) ship.rotation.y -= 0.03;
                if (keys.current['r']) ship.position.y += speed;
                if (keys.current['f']) ship.position.y -= speed;

                setCoords({ 
                    x: ship.position.x.toFixed(2), 
                    y: ship.position.y.toFixed(2), 
                    z: ship.position.z.toFixed(2) 
                });

                const cameraOffset = new THREE.Vector3(0, 1.8, 6).applyMatrix4(ship.matrixWorld);
                camera.position.lerp(cameraOffset, 0.1);
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
    }, []);

    // SCREENSHOT & LOGGING FUNCTION
    const captureData = () => {
        const canvas = mountRef.current.firstChild;
        const image = canvas.toDataURL("image/png");
        console.log(`LOG [${new Date().toISOString()}]: Ship at X:${coords.x} Y:${coords.y} Z:${coords.z}`);
        const link = document.createElement('a');
        link.download = `training-capture-${Date.now()}.png`;
        link.href = image;
        link.click();
    };

    return (
        <div style={{ position: "relative", backgroundColor: "#000" }}>
            <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />
            
            {/* HUD with Links & Logging */}
            <div style={hudStyle}>
                <h3>SYSTEM CONTROLS</h3>
                <p>POS: {coords.x}, {coords.y}, {coords.z}</p>
                <button onClick={captureData} style={btnStyle}>📸 CAPTURE & LOG</button>
                <Link to="/map" style={linkStyle}>🗺️ OPEN PLANET MAP</Link>
            </div>
        </div>
    );
};

// Styles for the HUD
const hudStyle = { position: "absolute", top: "20px", left: "20px", color: "#00ffff", fontFamily: "monospace", background: "rgba(0,0,0,0.7)", padding: "20px", borderRadius: "10px", border: "1px solid #00ffff", display: "flex", flexDirection: "column", gap: "10px" };
const btnStyle = { background: "#00ffff", color: "#000", border: "none", padding: "10px", cursor: "pointer", fontWeight: "bold" };
const linkStyle = { color: "#fff", textDecoration: "underline", marginTop: "10px" };

export default Gamep;