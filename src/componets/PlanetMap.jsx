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

    // --- Drawing Logic ---
    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        const ctx = canvasRef.current.getContext('2d');
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
        ctx.lineWidth = 5;
        ctx.stroke();
    };

    const deployPlanet = () => {
        if (!clickCoords) return alert("Click on the map first!");
        
        const textureData = canvasRef.current.toDataURL(); // Converts drawing to image
        const newPlanet = {
            id: Date.now(),
            x: clickCoords.x,
            z: clickCoords.z,
            size: pSize,
            texture: textureData
        };
        addPlanet(newPlanet);
        setClickCoords(null);
        // Clear canvas for next one
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    };

    return (
        <div style={layoutStyle}>
            {/* 2D MAP AREA */}
            <div style={mapArea} onClick={(e) => {
                const rect = e.target.getBoundingClientRect();
                setClickCoords({
                    x: (e.clientX - rect.left - rect.width / 2) / 5,
                    z: (e.clientY - rect.top - rect.height / 2) / 5
                });
            }}>
                <div style={grid} />
                {/* User Location Indicator */}
                <div style={{...playerDot, left: `calc(50% + ${shipPos.x * 5}px)`, top: `calc(50% + ${shipPos.z * 5}px)`}} />
                
                {/* Existing Planets */}
                {planets.map(p => (
                    <div key={p.id} style={{...planetDot, width: p.size*5, height: p.size*5, left: `calc(50% + ${p.x * 5}px)`, top: `calc(50% + ${p.z * 5}px)`}} />
                ))}
            </div>

            {/* CUSTOMIZER SIDEBAR */}
            <div style={sidebar}>
                <h2>PLANET CREATOR</h2>
                <p>1. Draw Texture:</p>
                <canvas 
                    ref={canvasRef} width={200} height={200} 
                    style={canvasStyle} onMouseDown={startDrawing} 
                    onMouseMove={draw} onMouseUp={() => setIsDrawing(false)} 
                />
                
                <p>2. Set Dimensions (Radius): {pSize}</p>
                <input type="range" min="1" max="10" value={pSize} onChange={(e) => setPSize(e.target.value)} />
                
                <button onClick={deployPlanet} style={deployBtn}>DEPLOY PLANET</button>
                <button onClick={() => navigate('/G')} style={backBtn}>RETURN TO GAME</button>
            </div>
        </div>
    );
};

// Styles (Simplified for space)
const layoutStyle = { display: 'flex', height: '100vh', background: '#000', color: '#0ff' };
const mapArea = { flex: 2, position: 'relative', border: '1px solid #333', cursor: 'crosshair', overflow: 'hidden' };
const grid = { position: 'absolute', width: '100%', height: '100%', backgroundImage: 'linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)', backgroundSize: '50px 50px' };
const sidebar = { flex: 1, padding: '20px', background: '#111', display: 'flex', flexDirection: 'column', gap: '10px' };
const canvasStyle = { background: '#222', border: '1px solid #0ff', cursor: 'pencil' };
const planetDot = { position: 'absolute', background: '#0ff', borderRadius: '50%', transform: 'translate(-50%, -50%)', boxShadow: '0 0 10px #0ff' };
const playerDot = { position: 'absolute', background: '#f0f', width: '10px', height: '10px', borderRadius: '50%', border: '2px solid white' };
const deployBtn = { background: '#0ff', color: '#000', padding: '10px', fontWeight: 'bold' };
const backBtn = { background: '#333', color: '#fff', padding: '10px' };

export default PlanetMap;