import React, { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DatC } from '../context';

const PlanetMap = () => {
    const { planets, addPlanet, shipPos } = useContext(DatC);
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [pSize, setPSize] = useState(2);
    const [clickCoords, setClickCoords] = useState(null);

    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        const ctx = canvasRef.current.getContext('2d');
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = nativeEvent;
        const ctx = canvasRef.current.getContext('2d');
        ctx.lineTo(offsetX, offsetY);
        ctx.strokeStyle = "#00ffff";
        ctx.lineWidth = 10;
        ctx.stroke();
    };

    const deployPlanet = () => {
        if (!clickCoords) return alert("Click the map to set a location!");
        
        const textureData = canvasRef.current.toDataURL();
        addPlanet({
            id: Date.now(),
            x: clickCoords.x,
            z: clickCoords.z,
            size: pSize,
            texture: textureData
        });
        setClickCoords(null);
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, 300, 300);
    };

    return (
        <div style={layoutStyle}>
            <div style={mapArea} onClick={(e) => {
                const rect = e.target.getBoundingClientRect();
                // Map screen pixels to 3D world units
                setClickCoords({
                    x: (e.clientX - rect.left - rect.width / 2) / 5,
                    z: (e.clientY - rect.top - rect.height / 2) / 5
                });
            }}>
                <div style={grid} />
                
                {/* PERMANENT EARTH INDICATOR */}
                <div style={earthMarker}>EARTH ZONE</div>

                {/* SHIP POSITION (Live) */}
                <div style={{...playerDot, left: `calc(50% + ${shipPos.x * 5}px)`, top: `calc(50% + ${shipPos.z * 5}px)`}} />
                
                {/* NEW PLANET PREVIEW (Before Deploy) */}
                {clickCoords && (
                    <div style={{...previewDot, left: `calc(50% + ${clickCoords.x * 5}px)`, top: `calc(50% + ${clickCoords.z * 5}px)`}} />
                )}

                {/* DEPLOYED PLANETS */}
                {planets.map(p => (
                    <div key={p.id} style={{...planetDot, width: p.size*8, height: p.size*8, left: `calc(50% + ${p.x * 5}px)`, top: `calc(50% + ${p.z * 5}px)`}} />
                ))}
            </div>

            <div style={sidebar}>
                <h2 style={{color: '#0ff'}}>MISSION CONTROL</h2>
                <p>1. Draw Planet Texture:</p>
                <canvas 
                    ref={canvasRef} width={300} height={200} 
                    style={canvasStyle} onMouseDown={startDrawing} 
                    onMouseMove={draw} onMouseUp={() => setIsDrawing(false)} 
                />
                
                <p>2. Size: {pSize} units</p>
                <input type="range" min="1" max="15" value={pSize} onChange={(e) => setPSize(e.target.value)} />
                
                <div style={{marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px'}}>
                    <button onClick={deployPlanet} style={deployBtn}>🚀 DEPLOY TO COORDINATES</button>
                    <button onClick={() => navigate('/G')} style={backBtn}>RETURN TO COCKPIT</button>
                </div>
                
                {clickCoords && <p style={{color: '#fff'}}>Selected: X: {clickCoords.x.toFixed(1)} Z: {clickCoords.z.toFixed(1)}</p>}
            </div>
        </div>
    );
};

// --- STYLES ---
const layoutStyle = { display: 'flex', height: '100vh', background: '#000', fontFamily: 'monospace' };
const mapArea = { flex: 2, position: 'relative', borderRight: '2px solid #0ff', overflow: 'hidden', cursor: 'crosshair', backgroundColor: '#050505' };
const grid = { position: 'absolute', width: '100%', height: '100%', backgroundImage: 'linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)', backgroundSize: '40px 40px' };
const sidebar = { flex: 1, padding: '30px', background: '#111', color: '#0ff' };
const canvasStyle = { background: '#1a1a1a', border: '2px solid #0ff', borderRadius: '10px' };
const earthMarker = { position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', border: '2px dashed #444', color: '#444', padding: '20px', borderRadius: '50%', pointerEvents: 'none' };
const planetDot = { position: 'absolute', background: 'radial-gradient(circle, #00ffff, #005555)', borderRadius: '50%', transform: 'translate(-50%, -50%)', boxShadow: '0 0 15px #0ff' };
const previewDot = { position: 'absolute', border: '2px solid #fff', width: '20px', height: '20px', borderRadius: '50%', transform: 'translate(-50%, -50%)' };
const playerDot = { position: 'absolute', background: '#ff00ff', width: '12px', height: '12px', borderRadius: '50%', transform: 'translate(-50%, -50%)', boxShadow: '0 0 10px #f0f', border: '2px solid #fff' };
const deployBtn = { background: '#0ff', color: '#000', border: 'none', padding: '15px', fontWeight: 'bold', cursor: 'pointer' };
const backBtn = { background: '#333', color: '#fff', border: 'none', padding: '10px', cursor: 'pointer' };

export default PlanetMap;