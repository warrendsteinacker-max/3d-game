import React, { createContext, useState } from 'react';

// 1. Create the context
export const DatC = createContext();

// 2. Create the provider component
export const DatProvider = ({ children }) => {
    const [planets, setPlanets] = useState([]);
    const [shipPos, setShipPos] = useState({ x: 0, z: 0 });

    const addPlanet = (planetData) => {
        setPlanets((prev) => [...prev, planetData]);
    };

    return (
        <DatC.Provider value={{ planets, addPlanet, shipPos, setShipPos }}>
            {children}
        </DatC.Provider>
    );
};
