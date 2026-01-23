import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { DatProvider } from "./context"; // Adjust this path to where your context.jsx is
import LP from "./componets/landingp";
import Gamep from "./componets/gamep";
import PlanetMap from "./componets/PlanetMap";
import {LL} from "./componets/LL";
import NP from "./componets/NP";

function App() {
  // return (
  //   <DatProvider> {/* THIS MUST WRAP EVERYTHING */}
  //     <BrowserRouter>
  //       <nav>
  //         <Link to="/">landing page</Link>
  //         <Link to="/np">new p</Link>
  //       </nav>
  //       <Routes>
  //         <Route to="/np" element={<NP/>}></Route>
  //         <Route path="/" element={<LP />} />
  //         <Route path="/LL" element={<LL/>}/>
  //         <Route path="/G" element={<Gamep />} />
  //         <Route path="/map" element={<PlanetMap />} />
  //       </Routes>
  //     </BrowserRouter>
  //   </DatProvider>
  // );
  return()
}

export default App;

/////          <Route path="/G"></Route>
////          <Route path="/edit"></Route>