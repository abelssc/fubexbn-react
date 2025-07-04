import { useState } from "react";
import Swal from "sweetalert2";
import clientAxios from "../config/axios";
import { useApp } from "../context/AppContext";
import { toast } from "react-toastify";

type FormularioPersonalizado = {
    dni: string;
    plazo: number;
    monto: number;
    observaciones: string;
};

const Filtro_Personalizado = ({captcha}:{captcha:string}) => {
  const {enqueue,setRespuestas} = useApp();
  const [formularioPersonalizado, setFormularioPersonalizado] =
    useState<FormularioPersonalizado>({
      dni: "",
      plazo: 60,
      monto: 0,
      observaciones: "",
    });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormularioPersonalizado((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const enviarFormularioPersonalizado = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!captcha.length) {
        Swal.fire('Rellene el captcha');
        return;
    }

    const formData = new FormData();
    formData.append("DNI_CLIENTE", formularioPersonalizado.dni);
    formData.append("PLAZO", String(formularioPersonalizado.plazo));
    formData.append("MONTO", String(formularioPersonalizado.monto));
    formData.append("OBS_VENDEDOR", formularioPersonalizado.observaciones);
    formData.append("captcha_respuesta2", captcha);

    const id = toast.loading('✉️ Enviando Dni...',{
      closeOnClick: true,
      position: "top-right",
      closeButton: true,
    });
    enqueue({
      action: "GuardarFiltro Personalizado",
      callback: async () => {
        try {
          const {data} = await clientAxios.post("GuardarFiltro.php", formData);
          if(data==="Captcha incorrecto. Vuelve a intentarlo."){
            throw new Error(data);
          }
          setRespuestas(data);

          toast.update(id, { render: "✉️ Dni enviado!", type: "success", isLoading: false, autoClose: 2000 });

          setFormularioPersonalizado((prev) => ({
            ...prev,
            dni: "",
            observaciones: "",
          }));
        } catch (error: unknown) {
          toast.update(id, { render: "✉️ Error al enviar el filtro", type: "error", isLoading: false, autoClose: 2000 });
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
  }

  return (
    <div className="py-2 px-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Registro Personalizado
      </h3>
      <form
        className="flex flex-col gap-3"
        onSubmit={enviarFormularioPersonalizado}
      > 
        <div className="flex gap-4">
          <div>
            <label className="block text-sm text-gray-700">DNI</label>
            <input
              type="text"
              name="dni"
              value={formularioPersonalizado.dni}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Plazo</label>
            <input
              type="number"
              name="plazo"
              value={formularioPersonalizado.plazo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Monto</label>
            <input
              type="number"
              name="monto"
              value={formularioPersonalizado.monto}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              required
            />
          </div>
        </div>

        <div className="mb-2">
          <label className="block text-sm text-gray-700">Observaciones</label>
          <textarea
            name="observaciones"
            value={formularioPersonalizado.observaciones}
            onChange={handleChange}
            rows={2}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm resize-none"
          />
        </div>

        <button 
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm cursor-pointer">
          Registrar Cliente
        </button>
      </form>
    </div>

  );
};

export default Filtro_Personalizado;
