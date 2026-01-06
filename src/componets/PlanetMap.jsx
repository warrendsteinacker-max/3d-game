import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PlanetMap = () => {
    const navigate = useNavigate();
    const [planets, setPlanets] = useState([]);

    // Handle clicking the map to add a planet
    const handleMapClick = (e) => {
        const rect = e.target.getBoundingClientRect();
        // Calculate coordinates relative to the center of the map (0,0)
        const x = Math.round((e.clientX - rect.left - rect.width / 2) / 10);
        const z = Math.round((e.clientY - rect.top - rect.height / 2) / 10);
        
        const newPlanet = { id: Date.now(), x, z, name: `Planet_${planets.length + 1}` };
        setPlanets([...planets, newPlanet]);
        
        console.log(`Training Log: New Planet deployment plotted at X: ${x}, Z: ${z}`);
    };

    return (
        <div style={containerStyle}>
            <header style={headerStyle}>
                <h1>PLANET DEPLOYMENT MAP</h1>
                <button onClick={() => navigate('/G')} style={backBtn}>RETURN TO COCKPIT</button>
            </header>

            <div style={mapWrapper}>
                <div style={gridContainer} onClick={handleMapClick}>
                    {/* Visual Center Point (Sun/Origin) */}
                    <div style={originPoint}></div>

                    {/* Render Plotted Planets */}
                    {planets.map(p => (
                        <div key={p.id} style={{
                            ...planetStyle,
                            left: `calc(50% + ${p.x * 10}px)`,
                            top: `calc(50% + ${p.z * 10}px)`
                        }}>
                            <span style={labelStyle}>{p.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <aside style={sidebarStyle}>
                <h3>COORDINATE LOGS</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {planets.map(p => (
                        <li key={p.id} style={logItem}>
                            📍 {p.name}: [X: {p.x}, Z: {p.z}]
                        </li>
                    ))}
                </ul>
                {planets.length === 0 && <p>Click the grid to deploy planets...</p>}
            </aside>
        </div>
    );
};

// --- STYLING ---
const containerStyle = { justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', backgroundColor: '#050505', color: '#00ffff', fontFamily: 'monospace' };
const headerStyle = { padding: '20px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #00ffff' };
const mapWrapper = { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' };
const gridContainer = { 
    width: '600px', height: '600px', border: '1px solid #113333', position: 'relative', 
    backgroundImage: 'radial-gradient(#113333 1px, transparent 1px)', backgroundSize: '20px 20px', cursor: 'crosshair' 
};
const originPoint = { position: 'absolute', left: '50%', top: '50%', width: '10px', height: '10px', backgroundColor: '#ffcc00', borderRadius: '50%', transform: 'translate(-50%, -50%)', boxShadow: '0 0 15px #ffcc00' };
const planetStyle = { position: 'absolute', width: '12px', height: '12px', backgroundColor: '#00ffff', borderRadius: '50%', transform: 'translate(-50%, -50%)', boxShadow: '0 0 10px #00ffff' };
const labelStyle = { position: 'absolute', top: '-20px', whiteSpace: 'nowrap', fontSize: '10px' };
const sidebarStyle = { width: '300px', borderLeft: '1px solid #00ffff', padding: '20px', backgroundColor: '#0a0a0a' };
const backBtn = { background: '#00ffff', color: '#000', border: 'none', padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold' };
const logItem = { marginBottom: '10px', fontSize: '0.9em', borderBottom: '1px solid #113333' };

export default PlanetMap;