import { createContext } from "react";


export const DatC = createContext()

export const DataP = ({childre}) => {


    return(<DatC.Provider value={{}}>{childre}</DatC.Provider>)
}

