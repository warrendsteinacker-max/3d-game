import { createContext } from "react";
import { useNavigate } from "react-router-dom";


export const DatC = createContext()

export const DataP = ({childre}) => {

    ///////needed things for landing page
    const N = useNavigate()
    const go2game = () => {
        N("/G")
    }

    ///////


    return(<DatC.Provider value={{}}>{childre}</DatC.Provider>)
}

