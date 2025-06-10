import { ToastContainer } from "react-toastify"
import Filtro from "../components/Filtro"
import Filtro_Buscar from "../components/Filtro_Buscar"
import Respuestas from "../components/Respuestas"
import Sumarizado from "../components/Sumarizado"
import { AppProvider } from "../context/AppContext"

const App = () => {
  return (
    <AppProvider>
        <div className="grid lg:grid-cols-3 gap-4 p-4">
          <div className="col-span-3 lg:col-span-1 space-y-4">
            <Filtro />
            <Filtro_Buscar />
          </div>
          <div className="col-span-3 lg:col-span-2">
            <Sumarizado />
          </div>
        </div>
      <Respuestas />
      <ToastContainer/>
    </AppProvider>
  )
}

export default App