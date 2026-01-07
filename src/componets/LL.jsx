
import {Link} from "react-router-dom"

export const LL = () => {
    return(<><div style={{borderRadius: "5px", backgroundColor: "blue", width: "500px", display: "flex", alignItems: "center", justifyContent: "center"}}><nav><Link to="/G" style={{color: "red", textDecoration: "none", borderRadius: "5px", marginLeft: "10px"}}>game</Link><Link to="/" style={{color: "red", textDecoration: "none", borderRadius: "5px", marginLeft: "10px"}}>landing page</Link><Link to="/map" style={{color: "red", textDecoration: "none", borderRadius: "5px", marginLeft: "10px"}}>map</Link></nav></div></>)
}