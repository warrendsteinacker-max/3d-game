import { BrowserRouter, Route, Routes } from "react-router-dom"
///import { DataP } from "./context"
import LP from "./componets/landingp"
import Gamep from "./componets/gamep"
function App() {


  return (
    <>

        <BrowserRouter>
        <Routes>
          <Route path="/" element={<LP/>}></Route>
          <Route path="/map" element={<PlanetMap/>}></Route>
          <Route path="/G" element={<Gamep/>}></Route>
        </Routes>
        </BrowserRouter>

    </>
  )
}

export default App

/////          <Route path="/G"></Route>
////          <Route path="/edit"></Route>