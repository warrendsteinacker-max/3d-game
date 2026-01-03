import React from "react";
import { Link } from "react-router-dom";

const LP = () => {
    return (
        <div style={{ position: "relative", height: "100vh", width: "100vw", overflow: "hidden" }}>
            {/* Background Image */}
            <img 
                src="/vimal-s-GBg3jyGS-Ug-unsplash.jpg" 
                style={{ height: "100vh", width: "100vw", objectFit: "cover" }} 
                alt="Space Background"
            />

            {/* Content Overlay */}
            <div style={{ 
                position: "absolute", 
                top: "50%", 
                left: "50%", 
                transform: "translate(-50%, -50%)", 
                textAlign: "center" 
            }}>
                <h1 style={{ color: "green", fontSize: "3rem" }}>Welcome to Space Game</h1>
                <Link to="/G" style={{ 
                    color: "white", 
                    background: "green", 
                    padding: "10px 20px", 
                    textDecoration: "none",
                    borderRadius: "5px"
                }}>
                    Start Game
                </Link>
            </div>
        </div>
    );
}

export default LP;