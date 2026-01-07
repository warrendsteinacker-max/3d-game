import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DatProvider } from "./context"; // Adjust this path to where your context.jsx is
import LP from "./componets/landingp";
import Gamep from "./componets/gamep";
import PlanetMap from "./componets/PlanetMap";

function App() {
  return (
    <DatProvider> {/* THIS MUST WRAP EVERYTHING */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LP />} />
          <Route path="/B" element={<LL/>}
          <Route path="/G" element={<Gamep />} />
          <Route path="/map" element={<PlanetMap />} />
        </Routes>
      </BrowserRouter>
    </DatProvider>
  );
}

export default App;

/////          <Route path="/G"></Route>
////          <Route path="/edit"></Route>