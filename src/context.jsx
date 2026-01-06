import React, { createContext, useState } from 'react';

export const DatC = createContext();

export const DatProvider = ({ children }) => {
    const [planets, setPlanets] = useState([]);
    const [shipPos, setShipPos] = useState({ x: 0, z: 0 }); // To show your location on map

    const addPlanet = (planetData) => {
        setPlanets((prev) => [...prev, planetData]);
    };

    return (
        <DatC.Provider value={{ planets, addPlanet, shipPos, setShipPos }}>
            {children}
        </DatC.Provider>
    );
};

