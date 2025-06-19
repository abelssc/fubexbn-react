import React, { useEffect, useRef, useState } from "react";
import readXlsxFile from "read-excel-file";
import Swal from "sweetalert2";
import clientAxios from "../config/axios";
import { useApp } from "../context/AppContext";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { getFechaCompacta } from "../utils/helpers";

type Cliente = {
  dni: string;
  plazo: number;
  monto: number;
  observaciones: string;

  fecha?: string;
  estado_respuesta?: string;
  respuesta?: string;
};

type DatosMasivos = {
  clientes: Cliente[];
  correlativo: number;
};

type Details = {
  time:string;
  content:string;
}

const statusTypes = {
    SUCCESS: 'REGISTRADO_CON_EXITO',
    FILTERED: 'YA_FILTRADO',
    ERROR: 'ERROR',
    UNKNOWN: 'DESCONOCIDO',
    WAITING: 'EN_ESPERA',
    CAPTCHA: 'CAPTCHA_INCORRECTO'
};

type Filtro_Masivo={
  captcha:string;
  loading:boolean;
  setLoading:(loading:boolean)=>void;
};

const Filtro_Masivo = ({captcha,loading,setLoading}:Filtro_Masivo) => {
  const {enqueue} = useApp();
  const archivoRef = useRef<HTMLInputElement | null>(null);
  const [datosMasivos, setDatosMasivos] = useState<DatosMasivos | null>(null);
  const [errorArchivo, setErrorArchivo] = useState("");
  const enviandoRef = useRef(true);
  const timeoutRef  = useRef<number | null>(null);
  const [details,setDetails]=useState<Details[]>([]);

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

  const procesarArchivoExcel = async (e:React.ChangeEvent<HTMLInputElement>) => {
    
    setErrorArchivo("");

    const archivo = archivoRef.current;
    if (!archivo || !archivo.files || archivo.files.length === 0) return;

    try {
      const rows = await readXlsxFile(archivo.files[0]);
      if (
        rows[0][0] !== "DNI_CLIENTE" ||
        rows[0][1] !== "PLAZO" ||
        rows[0][2] !== "MONTO" ||
        rows[0][3] !== "OBS_VENDEDOR"
      ) {
        throw new Error("Formato de archivo inválido. Verifique las columnas");
      }
      //eliminar cabecera
      rows.shift();

      const clientes: Cliente[] = rows.map((row) => {
        return {
          dni: String(row[0] ?? "").padStart(8, "0"),
          plazo: Number(row[1] ?? 60),
          monto: Number(row[2] ?? 0),
          observaciones: String(row[3] ?? ""),
        };
      });

      const newDatosMasivos: DatosMasivos = {
        correlativo: 0,
        clientes,
      };
      localStorage.setItem("datosMasivos", JSON.stringify(newDatosMasivos));
      setDatosMasivos(newDatosMasivos);
      setErrorArchivo("");
      e.target.value="";
      toast.success("📃 Archivo cargado exitósamente",{
        autoClose: 2000
      })

    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorArchivo(error.message || "Error al procesar el archivo");
      } else {
        setErrorArchivo("Error al procesar el archivo");
      }
    }
  };

  const enviarDatosSecuenciales=()=>{
    setLoading(true);
    if(!enviandoRef.current){
      setLoading(false);
      return;
    }

    if(!captcha.length) {
        Swal.fire('Rellene el captcha');
        setLoading(false);
        return;
    }

    const datosGuardados = localStorage.getItem("datosMasivos");
    if (!datosGuardados) {
      Swal.fire('No hay datos para enviar');
      setLoading(false);
      return;
    }
    const datosMasivos: DatosMasivos = JSON.parse(datosGuardados);

    const {clientes,correlativo}=datosMasivos;
   
    if (correlativo >= clientes.length) {
        Swal.fire('Se terminaron de enviar todos los dnis al filtro');
        setLoading(false);
        return;
    }
    const cliente=clientes[correlativo];
    const formData=new FormData();
    formData.append("DNI_CLIENTE", cliente.dni);
    formData.append("PLAZO", String(cliente.plazo));
    formData.append("MONTO", String(cliente.monto));
    formData.append("OBS_VENDEDOR", cliente.observaciones);
    formData.append("captcha_respuesta2", captcha);

    enqueue({
      action: "GuardarFiltro.php",
      callback: async () => {
        try {
          const {data} = await clientAxios.post("GuardarFiltro.php", formData);
          const result=evaluarRespuesta(data);
          setDetails(prev=>[
            {
              time: new Date().toLocaleTimeString(),
              content: `Dni enviado: ${cliente.dni}; ${result.mensaje}`
            },
            ...prev
          ]);
          
          if(result.status===statusTypes.WAITING){
            //ESPERAMOS 2MIN PARA VOLVER A ENVIAR EL SUBMIT
            timeoutRef.current=setTimeout(enviarDatosSecuenciales,120000);
            return;
          }
          if(result.status===statusTypes.CAPTCHA){
            Swal.fire('Captcha Filtros incorrecto');
            setLoading(false);
            return;
          }

          cliente.fecha=getFechaCompacta();
          cliente.estado_respuesta=result.status;
          cliente.respuesta=result.mensaje;
          clientes[correlativo]=cliente;
         
          const newDatosMasivos: DatosMasivos = {
            correlativo: correlativo+1,
            clientes,
          };
          localStorage.setItem('datosMasivos',JSON.stringify(newDatosMasivos));
          setDatosMasivos(newDatosMasivos);
          timeoutRef.current=setTimeout(enviarDatosSecuenciales,2000);
         
          
        } catch (error: unknown) {
          setLoading(false);
          if (error instanceof Error) {
            Swal.fire({
              title: error.message || "Error al enviar el Filtro",
              icon: "error",
            });
          } else {
            Swal.fire({
              title: "Error al enviar el Filtro",
              icon: "error",
            });
          }
          console.error(error);
        }
      },
    });

    
  }

  const detenerDatosSecuenciales=()=>{
    setLoading(false);
   
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      console.log("⛔ Timeout cancelado");
    }
  }

  const evaluarRespuesta=(mensaje:string)=>{
     if (!mensaje?.includes) return { status: statusTypes.ERROR, mensaje: 'Entrada inválida' };

    // Casos directos
    if (mensaje.includes("Se registró con éxito")) return { status: statusTypes.SUCCESS, mensaje: "Registro exitoso!" };
    if (mensaje.includes("Captcha incorrecto")) return { status: statusTypes.CAPTCHA, mensaje: "Error en captcha, reintente" };

    // Parseo condicional
    try {
      const doc = new DOMParser().parseFromString(mensaje, 'text/html');
      const getText = (sel:string) => doc.querySelector(sel)?.textContent?.trim();
      
      if (mensaje.includes("text-danger")) {
        const texto = getText(".text-danger");
        if (texto?.includes("cola de espera")) return { status: statusTypes.WAITING, mensaje: "Espere 2 minutos" };
        return { status: statusTypes.UNKNOWN, mensaje: texto || "Respuesta desconocida" };
      }
      
      if (mensaje.includes("text-primary")) {
        return { status: statusTypes.FILTERED, mensaje: getText("table tr:nth-child(2) td") || "Ya existe" };
      }

      return { status: statusTypes.UNKNOWN, mensaje: mensaje };

    } catch {
      return { status: statusTypes.ERROR, mensaje: "Error al procesar respuesta" };
    }
  }

  const descargarReporte=()=>{
      const datos=localStorage.getItem("datosMasivos");
      if(!datos) {
        Swal.fire('No hay datos que descargar');
        return;
      };
  
      const { clientes } = JSON.parse(datos);
      
      const renamedData = clientes.map((cliente: Cliente) => {
          return {
              FECHA: cliente.fecha,
              ESTADO: cliente.estado_respuesta,
              RESPUESTA: cliente.respuesta,
              DNI_CLIENTE: cliente.dni,
              PLAZO: cliente.plazo,
              MONTO: cliente.monto,
              OBS_VENDEDOR: cliente.observaciones,
          }
      });
  
      // Preparar los datos para el archivo Excel
      const ws = XLSX.utils.json_to_sheet(renamedData);
  
        // Crear un nuevo libro de trabajo
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Clientes");
  
      // Generar y descargar el archivo Excel
      XLSX.writeFile(wb, 'ReporteClientes.xlsx');
    }

  return (
    <div className="py-2 px-4 bg-blue-50 mb-4 rounded-xl">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Carga Masiva</h3>

        {/* Mostrar correlativo si existe */}
        {datosMasivos && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Archivo cargado:</span>
              {datosMasivos.clientes.length} clientes | Enviados:{" "}
              {datosMasivos.correlativo}
              {
                loading
                ?<>
                  <span className="bg-gray-200 py-1 px-2 rounded ml-4">Enviando...</span>
                  <button 
                    className="bg-red-600 text-white py-1 px-2 rounded hover:bg-red-700 text-xs cursor-pointer ml-4"
                    onClick={()=>{
                      enviandoRef.current=false;
                      detenerDatosSecuenciales();
                    }}
                  >
                      Detener
                  </button>
                </>
                :<button 
                  className="bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-700 text-xs cursor-pointer ml-4"
                  onClick={()=>{
                    enviandoRef.current=true;
                    enviarDatosSecuenciales();
                  }}
                  >
                    Enviar
                </button>
              }
            </p>
          </div>
        )}
      {
        loading  
        ?
          <div className="bg-black w-full text-green-500 p-4 text-xs h-36 overflow-y-scroll">
            {
              details.map((detail,idx)=>{
                return(
                  <div className="mb-2" key={idx}>
                    <p>&gt; {detail.time}</p>
                    <p>{detail.content}</p>
                  </div>
                )
              })
            }
          </div>
        :
          <form className="flex flex-col gap-3">
            <div>
              <input
                type="file"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                required
                ref={archivoRef}
                accept=".xlsx, .xls"
                onChange={procesarArchivoExcel}
              />
              <div className="flex gap-4 mt-1 text-xs text-gray-500">
                <a className="text-blue-600 hover:text-blue-800" href="/media/filtro.xlsx">Descargar Plantilla</a>
                <span className="text-xs text-green-600 hover:text-green-800 cursor-pointer" onClick={descargarReporte}>Descargar Reporte</span>
              </div>
            </div>

            {errorArchivo && (
              <div className="text-red-500 text-sm py-2">{errorArchivo}</div>
            )}
          </form>
      }
    </div>
  );
};

export default Filtro_Masivo;
