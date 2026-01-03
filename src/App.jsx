import { BrowserRouter, Route, Routes } from "react-router-dom"
///import { DataP } from "./context"
import LP from "./componets/landingp"
function App() {
  const [count, setCount] = useState(0)

  return (
    <>

        <BrowserRouter>
        <Routes>
          <Route path="/" element={<LP/>}></Route>
        </Routes>
        </BrowserRouter>

    </>
  )
}

export default App

/////          <Route path="/G"></Route>
////          <Route path="/edit"></Route>