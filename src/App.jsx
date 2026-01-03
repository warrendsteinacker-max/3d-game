import { BrowserRouter, Route, Routes } from "react-router-dom"
import { DataP } from "./context"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <DataP>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={}></Route>
          <Route path="/G"></Route>
          <Route path="/edit"></Route>
        </Routes>
        </BrowserRouter>
      </DataP>
    </>
  )
}

export default App
