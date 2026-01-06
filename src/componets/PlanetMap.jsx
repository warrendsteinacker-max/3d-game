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
        if (!clickCoords) return alert("Click the map grid first to set a location!");
        
        const textureData = canvasRef.current.toDataURL();
        addPlanet({
            id: Date.now(),
            x: clickCoords.x,
            z: clickCoords.z,
            size: pSize,
            texture: textureData
        });
        
        // Reset after deploy
        setClickCoords(null);
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, 300, 200);
    };

    return (
        <div style={layoutStyle}>
            {/* LEFT SIDE: THE CLICKABLE MAP AREA */}
            <div style={mapArea} onClick={(e) => {
                // This logic handles clicking on the grid to set coordinates
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) / 5;
                const z = (e.clientY - rect.top - rect.height / 2) / 5;
                setClickCoords({ x, z });
            }}>
                <div style={grid} />
                
                {/* 1. Permanent Earth Zone */}
                <div style={earthMarker}>
                    <div style={{border: '1px solid #444', borderRadius: '50%', width: '60px', height: '60px'}}></div>
                    EARTH
                </div>

                {/* 2. Ship Position Indicator (Pink Dot) */}
                <div style={{
                    ...playerDot, 
                    left: `calc(50% + ${shipPos?.x * 5 || 0}px)`, 
                    top: `calc(50% + ${shipPos?.z * 5 || 0}px)`
                }}>
                    <span style={label}>YOU</span>
                </div>
                
                {/* 3. Preview Dot (Where you just clicked) */}
                {clickCoords && (
                    <div style={{
                        ...previewDot, 
                        left: `calc(50% + ${clickCoords.x * 5}px)`, 
                        top: `calc(50% + ${clickCoords.z * 5}px)`
                    }} />
                )}

                {/* 4. Already Deployed Planets */}
                {planets.map(p => (
                    <div key={p.id} style={{
                        ...planetDot, 
                        width: p.size * 5, 
                        height: p.size * 5, 
                        left: `calc(50% + ${p.x * 5}px)`, 
                        top: `calc(50% + ${p.z * 5}px)`
                    }} />
                ))}
            </div>

            {/* RIGHT SIDE: SIDEBAR CONTROLS */}
            <div style={sidebar}>
                <h2 style={{color: '#0ff', margin: '0 0 10px 0'}}>PLANET CREATOR</h2>
                
                <p>1. Draw Texture:</p>
                <canvas 
                    ref={canvasRef} width={300} height={200} 
                    style={canvasStyle} onMouseDown={startDrawing} 
                    onMouseMove={draw} onMouseUp={() => setIsDrawing(false)} 
                />
                
                <p>2. Set Radius: {pSize}</p>
                <input style={{width: '100%'}} type="range" min="1" max="15" value={pSize} onChange={(e) => setPSize(e.target.value)} />
                
                <div style={{marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px'}}>
                    <button onClick={deployPlanet} style={deployBtn}>🚀 DEPLOY PLANET</button>
                    <button onClick={() => navigate('/G')} style={backBtn}>RETURN TO COCKPIT</button>
                </div>

                {clickCoords ? (
                    <div style={coordBox}>
                        TARGET ACQUIRED:<br/>
                        X: {clickCoords.x.toFixed(1)}<br/>
                        Z: {clickCoords.z.toFixed(1)}
                    </div>
                ) : (
                    <p style={{color: '#666', fontSize: '0.8em'}}>Click the grid to select deployment coordinates.</p>
                )}
            </div>
        </div>
    );
};

// --- STYLES ---
const layoutStyle = { display: 'flex', height: '100vh', width: '100vw', background: '#000', fontFamily: 'monospace', overflow: 'hidden' };
const mapArea = { flex: 2, position: 'relative', borderRight: '2px solid #0ff', overflow: 'hidden', cursor: 'crosshair', backgroundColor: '#050505' };
const grid = { position: 'absolute', width: '2000px', height: '2000px', left: '-500px', top: '-500px', backgroundImage: 'linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' };
const sidebar = { width: '350px', padding: '20px', background: '#111', color: '#0ff', zIndex: 10, display: 'flex', flexDirection: 'column' };
const canvasStyle = { background: '#1a1a1a', border: '2px solid #0ff', borderRadius: '5px', cursor: 'crosshair' };
const earthMarker = { position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', color: '#444', textAlign: 'center', pointerEvents: 'none', fontSize: '0.7em' };
const planetDot = { position: 'absolute', background: 'radial-gradient(circle, #00ffff, #005555)', borderRadius: '50%', transform: 'translate(-50%, -50%)', boxShadow: '0 0 10px #0ff', pointerEvents: 'none' };
const previewDot = { position: 'absolute', border: '2px solid #fff', width: '15px', height: '15px', borderRadius: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' };
const playerDot = { position: 'absolute', background: '#ff00ff', width: '10px', height: '10px', borderRadius: '50%', transform: 'translate(-50%, -50%)', boxShadow: '0 0 10px #f0f', border: '1px solid #fff', pointerEvents: 'none', zIndex: 5 };
const label = { position: 'absolute', top: '-15px', left: '10px', fontSize: '0.7em', color: '#ff00ff' };
const deployBtn = { background: '#0ff', color: '#000', border: 'none', padding: '12px', fontWeight: 'bold', cursor: 'pointer' };
const backBtn = { background: '#333', color: '#fff', border: 'none', padding: '10px', cursor: 'pointer' };
const coordBox = { marginTop: '15px', padding: '10px', border: '1px solid #0ff', fontSize: '0.9em', color: '#fff', background: '#002222' };

export default PlanetMap;