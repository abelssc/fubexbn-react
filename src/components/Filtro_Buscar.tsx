import { useState } from "react";
import Captcha from "./Captcha";
import Swal from "sweetalert2";
import clientAxios from "../config/axios";
import { useApp } from "../context/AppContext";
import { toast } from "react-toastify";

const Filtro_Buscar = () => {
  const { enqueue, setRespuestas } = useApp();
  const [dni, setDni] = useState("");
  const [captcha, setCaptcha] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captcha.length) {
      Swal.fire("Rellene el captcha");
      return;
    }
    const formData = new FormData();
    formData.append("DNI_CLIENTE", dni);
    formData.append("captcha_respuesta3", captcha);

    const id = toast.loading('✉️ Buscando Dni...',{
      closeOnClick: true,
      position: "top-right",
      closeButton: true,
    });

    enqueue({
      action: "BuscarFiltro.php",
      callback: async () => {
        try {
          const { data } = await clientAxios.post("BuscarFiltro.php", formData);
          if(data==="Captcha incorrecto. Vuelve a intentarlo."){
            throw new Error(data);
          }

          toast.update(id, { render: "✉️ Dni buscando!", type: "success", isLoading: false, autoClose: 2000 });

          setRespuestas(data);
          setDni("");
        } catch (error: unknown) {
          toast.update(id, { render: "✉️ Error al buscar Dni", type: "error", isLoading: false, autoClose: 2000 });
          if (error instanceof Error) {
            Swal.fire({
              title: error.message || "Error al enviar el filtro",
              icon: "error",
            });
          } else {
            Swal.fire({
              title: "Error al enviar el filtro",
              icon: "error",
            });
          }
          console.error(error);
        }
      },
    });
  };

  return (
    <details className="bg-white border border-gray-300 rounded-xl p-4 shadow-sm">
      <summary className="text-lg font-semibold text-gray-800 mb-3 cursor-pointer">
        Buscar Filtro
      </summary>
      <Captcha
        src="https://fuvexbn.a365.com.pe:7443/BN/captcha3.php"
        captcha={captcha}
        setCaptcha={setCaptcha}
      />
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="block text-sm text-gray-700">DNI</label>
          <input
            type="text"
            name="dni"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          />
        </div>

        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm cursor-pointer">
          Buscar
        </button>
      </form>
    </details>
  );
};

export default Filtro_Buscar;
