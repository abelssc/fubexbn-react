import React, { useEffect, useRef, useState } from "react";
import readXlsxFile from "read-excel-file";
import Swal from "sweetalert2";
import clientAxios from "../config/axios";
import { useApp } from "../context/AppContext";
import productos from "../data/productos.json";
import oficinas from "../data/oficinas.json";
import estados from "../data/estados.json";
import canales from "../data/canales.json";
import { toast } from "react-toastify";
import { getFechaCompacta } from "../utils/helpers";
import * as XLSX from "xlsx";

type Cliente = {
  dni: string;
  nombres: string;
  correo: string;
  celular1: string;
  celular2: string;
  tipo_gestion: string;
  producto: string;
  oficina: string;
  departamento:string;
  provincia: string;
  distrito: string;
  estado: string;
  monto: number;
  plazo: number;
  tasa: number;
  
  fecha?:string;
  estado_respuesta?:string;
  respuesta?:string;
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
    //CONTINUA LA EJECUCION
    SUCCESS: 'REGISTRADO_CON_EXITO',
    UNKNOWN: 'DESCONOCIDO',
    FILTERED_BY_OTHER_USER: 'FILTERED_BY_OTHER_USER',
    NOT_FILTERED: 'DNI_NO_FILTRADO',
    DUPLICADO: 'YA_LO_REGISTRASTE',
  
    //DETIENE LA EJECUCION
    ERROR: 'ERROR',
    CAPTCHA: 'CAPTCHA_INCORRECTO',
};

type Sumarizado_Masivo={
  captcha:string;
  loading:boolean;
  setLoading:(loading:boolean)=>void;
};

const Sumarizado_Masivo = ({captcha,loading,setLoading}:Sumarizado_Masivo) => {
  const {enqueue,_mes_sel} = useApp();
  const archivoRef = useRef<HTMLInputElement | null>(null);
  const [datosMasivos, setDatosMasivos] = useState<DatosMasivos | null>(null);
  const [errorArchivo, setErrorArchivo] = useState("");

  const enviandoRef = useRef(true);
  const timeoutRef  = useRef<number | null>(null);
  const [details,setDetails]=useState<Details[]>([]);
  const timestanpRef = useRef(Math.floor(Date.now() / 1000));

  useEffect(() => {
    const datosGuardados = localStorage.getItem("datosMasivosSumarizado");
    if (datosGuardados) {
      try {
        setDatosMasivos(JSON.parse(datosGuardados));
      } catch (error) {
        console.error("Error al cargar datos:", error);
        localStorage.removeItem("datosMasivosSumarizado");
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
        rows[0][1] !== "NOMBRE_CLIENTE" ||
        rows[0][2] !== "CELULAR" ||
        rows[0][3] !== "TIPO_GESTION" ||
        rows[0][4] !== "PRODUCTO" ||
        rows[0][5] !== "DEPARTAMENTO" ||
        rows[0][6] !== "PROVINCIA" ||
        rows[0][7] !== "DISTRITO" ||
        rows[0][8] !== "TIPO_DE_CONTACTO" ||
        rows[0][9] !== "MONTO" ||
        rows[0][10] !== "PLAZO" ||
        rows[0][11] !== "TASA"
      ) {
        throw new Error("Formato de archivo inválido. Verifique las columnas");
      }
      //eliminar cabecera
      rows.shift();

      const clientes: Cliente[] = rows.map((row) => {
        return {
            dni: String(row[0] ?? "").padStart(8, "0"),
            nombres: String(row[1] ?? ""),
            correo: "",
            celular1: String(row[2] ?? ""),
            celular2: "",
            tipo_gestion: String(row[3] ?? ""),
            producto: String(row[4] ?? ""),
            oficina:"",
            departamento: String(row[5] ?? ""),
            provincia: String(row[6] ?? ""),
            distrito: String(row[7] ?? ""),
            estado: String(row[8] ?? ""),
            monto: Number(row[9] ?? 0),
            plazo: Number(row[10] ?? 0),
            tasa: Number(row[11] ?? 0)
        };
      });

      const newDatosMasivos: DatosMasivos = {
        correlativo: 0,
        clientes,
      };
      localStorage.setItem("datosMasivosSumarizado", JSON.stringify(newDatosMasivos));
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

    const datosGuardados = localStorage.getItem("datosMasivosSumarizado");
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
    const cliente=depurarCliente(clientes[correlativo]);
    const formData=new FormData();
    formData.append("MES_SEL",_mes_sel);
    formData.append("DNI_CLIENTE",cliente.dni);
    formData.append("NOMBRE_CLIENTE",cliente.nombres);
    formData.append("CORREO",cliente.correo);
    formData.append("TELEFONO1",cliente.celular1);
    formData.append("TELEFONO2",cliente.celular2);
    formData.append("CANAL",cliente.tipo_gestion);
    formData.append("honeypot","");
    formData.append("timestamp",String(timestanpRef.current));
    formData.append("PRODUCTO",cliente.producto);
    formData.append("OFICINA",cliente.oficina);
    formData.append("ESTADO_REGISTRO",cliente.estado);
    formData.append("MONTO",String(cliente.monto));
    formData.append("PLAZO",String(cliente.plazo));
    formData.append("TASA",String(cliente.tasa));
    formData.append("archivo_nuevo_M","");
    formData.append("TITULO_M","");
    formData.append("OBSERVACION","");
    formData.append("captcha_respuesta",captcha);


    enqueue({
      action: "GuardarProspecto_BN.php",
      callback: async () => {
        try {
          const {data} = await clientAxios.post("GuardarProspecto_BN.php", formData);
          const result=evaluarRespuesta(data);
          setDetails(prev=>[
            {
              time: new Date().toLocaleTimeString(),
              content: `Sumarizado enviado: ${cliente.dni}; ${result.mensaje}`
            },
            ...prev
          ]);
          
          if(result.status===statusTypes.CAPTCHA || result.status===statusTypes.ERROR){
            Swal.fire(result.mensaje);
            setLoading(false);
            return;
          }

          //Actualizamos Datos Cliente
          cliente.fecha=getFechaCompacta();
          cliente.estado_respuesta=result.status;
          cliente.respuesta=result.mensaje;
          clientes[correlativo]=cliente;
         
          const newDatosMasivos: DatosMasivos = {
            correlativo: correlativo+1,
            clientes,
          };
          localStorage.setItem('datosMasivosSumarizado',JSON.stringify(newDatosMasivos));
          setDatosMasivos(newDatosMasivos);
          timeoutRef.current=setTimeout(enviarDatosSecuenciales,20000);

        } catch (error: unknown) {
          setLoading(false);
          if (error instanceof Error) {
            Swal.fire({
              title: error.message || "Error al enviar el Sumarizado",
              icon: "error",
            });
          } else {
            Swal.fire({
              title: "Error al enviar el Sumarizado",
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

  const depurarCliente = (cliente: Cliente): Cliente => {
      const normalize = (str: string) => str.trim().toUpperCase();
      // const limpiarTexto = (str: string) =>
      //     str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();

      const clienteDepurado = { ...cliente };

      // OFICINA
      const departamento = normalize(clienteDepurado.oficina);
      const provincia = normalize(clienteDepurado.provincia);
      const distrito = normalize(clienteDepurado.distrito);
      const oficinadistrito = `${departamento} - ${distrito}`;
      const oficinaprovincia = `${departamento} - ${provincia}`;

      if (oficinas.includes(oficinadistrito)) {
          clienteDepurado.oficina = oficinadistrito;
      } else if (oficinas.includes(oficinaprovincia)) {
          clienteDepurado.oficina = oficinaprovincia;
      } else {
          clienteDepurado.oficina =
          oficinas.find((o) => o.includes(departamento)) || oficinas[0];
      }

      // PRODUCTO
      clienteDepurado.producto = normalize(clienteDepurado.producto);
      if (!productos.includes(clienteDepurado.producto)) {
          clienteDepurado.producto = productos[0];
      }

      // ESTADO
      clienteDepurado.estado = normalize(clienteDepurado.estado);
      if (!estados.includes(clienteDepurado.estado)) {
          clienteDepurado.estado = estados[1];
      }

      // CANAL
      clienteDepurado.tipo_gestion = normalize(clienteDepurado.tipo_gestion);
      if(!canales.includes(clienteDepurado.tipo_gestion)){
          clienteDepurado.tipo_gestion=canales[0];
      }
      
      return clienteDepurado;
  };

  const evaluarRespuesta=(mensaje:string)=>{
     if (!mensaje?.includes) return { status: statusTypes.ERROR, mensaje: 'Entrada inválida' };

    // Casos directos
    if (mensaje.includes("Se registró con éxito")) 
        return { status: statusTypes.SUCCESS, mensaje: "Registro exitoso!" };
    if (mensaje.includes("Captcha incorrecto")) 
        return { status: statusTypes.CAPTCHA, mensaje: "Error en captcha Sumarizado, reintente" };
    if(mensaje.includes("No se pueden ingresar registros")) 
        return { status: statusTypes.ERROR, mensaje: "No se pueden ingresar registros en días feriados"};
    if(mensaje.includes("Solo se pueden registrar")) 
        return { status: statusTypes.ERROR, mensaje: "Solo se pueden registrar clientes entre las 7am y 8pm"};

    // Parseo condicional
    try {
      const doc = new DOMParser().parseFromString(mensaje, 'text/html');
      const getText = (sel:string) => doc.querySelector(sel)?.textContent?.trim();
      
      if (mensaje.includes("text-danger")) {
        const texto = getText(".text-danger");
        if (texto?.includes("no estás designado")) return { status: statusTypes.FILTERED_BY_OTHER_USER, mensaje: texto };
        if (texto?.includes("no a sido filtrado")) return { status: statusTypes.NOT_FILTERED, mensaje: texto };
        return { status: statusTypes.UNKNOWN, mensaje: texto || "Error no especificado" };
      }

      if(mensaje.includes("text-primary")){
        const texto = getText(".text-primary");
        return { status: statusTypes.DUPLICADO, mensaje: texto}
      }

      return { status: statusTypes.UNKNOWN, mensaje: mensaje };

    } catch {
      return { status: statusTypes.ERROR, mensaje: "Error al procesar respuesta" };
    }
  };

  const descargarReporte=()=>{
    const datos=localStorage.getItem("datosMasivosSumarizado");
    if(!datos) {
      Swal.fire('No hay datos que descargar');
      return;
    };

    const { clientes } = JSON.parse(datos);
    
    const renamedData = clientes.map((cliente: Cliente) => {
        return {
            FECHA: cliente.fecha??"",
            ESTADO: cliente.estado_respuesta??"",
            RESPUESTA: cliente.respuesta??"",
            DNI_CLIENTE: cliente.dni??"",
            NOMBRE_CLIENTE: cliente.nombres??"",
            CELULAR: cliente.celular1??"",
            TIPO_GESTION: cliente.tipo_gestion??"",
            PRODUCTO: cliente.producto??"",
            DEPARTAMENTO: cliente.departamento??"",
            PROVINCIA: cliente.provincia??"",
            DISTRITO: cliente.distrito??"",
            TIPO_DE_CONTACTO: cliente.estado??"",
            MONTO: cliente.monto??"",
            PLAZO: cliente.plazo??"",
            TASA: cliente.tasa??"",
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
                <a className="text-blue-600 hover:text-blue-800" href="https://fubex.movisunsa.com/media/sumarizado.xlsx">Descargar Plantilla</a>
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

export default Sumarizado_Masivo;
