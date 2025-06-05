import Filtro from "../components/Filtro"
import Filtro_Buscar from "../components/Filtro_Buscar"
import Respuestas from "../components/Respuestas"
import Sumarizado from "../components/Sumarizado"
import { AppProvider } from "../context/AppContext"

const App = () => {
  return (
    <AppProvider>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        <Filtro />
        <div className="col-span-2">
        <Sumarizado />
        </div>
      </div>
        <Filtro_Buscar />
      <Respuestas />
    </AppProvider>
  )
}

export default App