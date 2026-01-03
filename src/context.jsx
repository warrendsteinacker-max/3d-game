import { createContext } from "react";
import { useNavigate } from "react-router-dom";


export const DatC = createContext()

export const DataP = ({childre}) => {

    ///////needed things for landing page

    ////not anything

    ///////


    return(<DatC.Provider>{childre}</DatC.Provider>)
}

