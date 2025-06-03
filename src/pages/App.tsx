import Filtro from "../components/Filtro"
import Respuestas from "../components/Respuestas"
import { AppProvider } from "../context/AppContext"

const App = () => {
  return (
    <AppProvider>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Filtro />
      </div>
      <Respuestas />
    </AppProvider>
  )
}

export default App