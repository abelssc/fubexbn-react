import React, { useState } from "react";
import clientAxios from "../config/axios";
import readXlsxFile from "read-excel-file";

type Inputs = {
  DNI_CLIENTE: string;
  PLAZO: string;
  OBS_VENDEDOR: string;
  captcha_respuesta2: string;
};

const Filtro = () => {
  const [inputs, setInputs] = useState<Inputs>({
    DNI_CLIENTE: "",
    PLAZO: "",
    OBS_VENDEDOR: "",
    captcha_respuesta2: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("DNI_CLIENTE", inputs.DNI_CLIENTE);
    formData.append("PLAZO", inputs.PLAZO);
    formData.append("OBS_VENDEDOR", inputs.OBS_VENDEDOR);
    formData.append("captcha_respuesta2", inputs.captcha_respuesta2);

    try {
      const response = await clientAxios.post("", formData);

      console.log("Respuesta:", response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const readFile= async (e: React.ChangeEvent<HTMLInputElement>) =>{
    const {files} = e.target;
    if(!files) return;

    try{
        const rows= await readXlsxFile(files[0]);
        if (rows[0][0] !== 'DNI_CLIENTE' ||
             rows[0][1] !== 'PLAZO' || 
             rows[0][2] !== 'OBS_VENDEDOR'
        ){
            throw('');
        }
        //eliminar cabecera
        rows.shift();

        const data = rows.map((row) => {
            // Formatear DNI a 8 dígitos
            const dni = String(row[0] ?? "").padStart(8, "0");

            return {
                DNI_CLIENTE: dni,
                PLAZO: row[1] ?? 60,
                OBS_VENDEDOR: row[2] ?? "",
            };
        });

        const filtros={
            correlativo:0,
            data
        }
      localStorage.setItem("filtros", JSON.stringify(filtros));


    }catch(error){
        console.log(error);
    }
  };

  return (
    <div className="w-full p-4">
      <div className="bg-white border border-gray-300 rounded-xl p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Enviar DNIs Masivo
        </h2>
        <input
            type="file"
            onChange={readFile}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
        />
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Enviar DNIs Personalizado
        </h2>
        <div className="mb-2">
          <label className="block text-sm text-gray-700">DNI</label>
          <input
            type="text"
            name="DNI_CLIENTE"
            value={inputs.DNI_CLIENTE}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm text-gray-700">Plazo</label>
          <input
            type="text"
            name="PLAZO"
            value={inputs.PLAZO}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm text-gray-700">Observaciones</label>
          <textarea
            name="OBS_VENDEDOR"
            value={inputs.OBS_VENDEDOR}
            onChange={handleChange}
            rows={2}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm resize-none"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm text-gray-700">Captcha</label>
          <input
            type="text"
            name="captcha_respuesta2"
            value={inputs.captcha_respuesta2}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm"
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default Filtro;
