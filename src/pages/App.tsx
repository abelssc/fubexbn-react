import { ToastContainer } from "react-toastify"
import Filtro from "../components/Filtro"
import Filtro_Buscar from "../components/Filtro_Buscar"
import Respuestas from "../components/Respuestas"
import Sumarizado from "../components/Sumarizado"
import { AppProvider } from "../context/AppContext"
import { useEffect, useState } from "react"
import clientAxios from "../config/axios"

export type User={
  mes_sel:string;
}

const App = () => {
  const [user, setUser] = useState<User|null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(()=>{
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }   

    const fetchUser= async ()=>{
      try{
         const { data } = await clientAxios.get("http://abelabed.com/fubexbn.php", {
          params: {
            action: "getTokenInfo",
            token: token
          },
          withCredentials:false,
        });
        if(data.status===400){
          throw new Error(data.message);
        }
        const {mes_sel,expiration_date}=data.data;
        const current_date=new Date();
        if(current_date>=new Date(expiration_date)){
          throw new Error("El programa debe actualizarse cada inicio de mes, comuníquese con sistema");
        }
        setUser({ mes_sel });
      }catch(error){
        console.log(error);
        setUser(null);
        setError(error instanceof Error ? error.message : String(error));
      }finally{
        setLoading(false);
      }
    }

    fetchUser();

  },[]);
   if (loading) return <p>Cargando...</p>;
   if(!user) return <p>{error}</p>

  return (
    <AppProvider user={user}>
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