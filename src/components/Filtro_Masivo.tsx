import React, { useEffect, useRef, useState } from "react";
import readXlsxFile from "read-excel-file";
import Swal from "sweetalert2";

type Cliente = {
  dni: string;
  plazo: number;
  observaciones: string;
};

type DatosMasivos = {
  clientes: Cliente[];
  correlativo: number;
};

const Filtro_Masivo = ({captcha}:{captcha:string}) => {
  const archivoRef = useRef<HTMLInputElement | null>(null);
  const [datosMasivos, setDatosMasivos] = useState<DatosMasivos | null>(null);
  const [errorArchivo, setErrorArchivo] = useState("");

  useEffect(() => {
    const datosGuardados = localStorage.getItem("datosMasivos");
    if (datosGuardados) {
      try {
        setDatosMasivos(JSON.parse(datosGuardados));
      } catch (error) {
        console.error("Error al cargar datos:", error);
        localStorage.removeItem("datosMasivos");
      }
    }
  }, []);

  const procesarArchivoExcel = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorArchivo("");

    const archivo = archivoRef.current;
    if (!archivo || !archivo.files || archivo.files.length === 0) return;

    try {
      const rows = await readXlsxFile(archivo.files[0]);
      if (
        rows[0][0] !== "DNI_CLIENTE" ||
        rows[0][1] !== "PLAZO" ||
        rows[0][2] !== "OBS_VENDEDOR"
      ) {
        throw new Error("Formato de archivo inválido. Verifique las columnas");
      }
      //eliminar cabecera
      rows.shift();

      const clientes: Cliente[] = rows.map((row) => {
        return {
          dni: String(row[0] ?? "").padStart(8, "0"),
          plazo: Number(row[1] ?? 60),
          observaciones: String(row[2] ?? ""),
        };
      });

      const datosMasivos: DatosMasivos = {
        correlativo: 0,
        clientes,
      };
      localStorage.setItem("datosMasivos", JSON.stringify(datosMasivos));
      setDatosMasivos(datosMasivos);
      setErrorArchivo("");
      console.log("Archivo procesado correctamente.");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorArchivo(error.message || "Error al procesar el archivo");
      } else {
        setErrorArchivo("Error al procesar el archivo");
      }
    }
  };

  const handleSubmit=()=>{
    if(!captcha.length) {
        Swal.fire('Rellene el captcha');
        return;
    }
    console.log(datosMasivos);
    
  }

  return (
    <div className="py-2 px-4 bg-gray-100 mb-4 rounded-xl">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Carga Masiva</h3>

        {/* Mostrar correlativo si existe */}
        {datosMasivos && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Archivo cargado:</span>
              {datosMasivos.clientes.length} clientes | Enviados:{" "}
              {datosMasivos.correlativo}
              <button 
                className="bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-700 text-xs cursor-pointer ml-4"
                onClick={handleSubmit}
                >
                  Enviar
              </button>
            </p>
          </div>
        )}

      <form className="flex flex-col gap-3" onSubmit={procesarArchivoExcel}>
        <div>
          <input
            type="file"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            required
            ref={archivoRef}
            accept=".xlsx, .xls"
          />
          <p className="mt-1 text-xs text-gray-500">
            Formato requerido: .xlsx con columnas DNI_CLIENTE, PLAZO,
            OBS_VENDEDOR
          </p>
        </div>

        {errorArchivo && (
          <div className="text-red-500 text-sm py-2">{errorArchivo}</div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-sm self-end cursor-pointer"
        >
          Procesar Archivo
        </button>
      </form>
    </div>
  );
};

export default Filtro_Masivo;
