import { useState } from "react";
import Captcha from "./Captcha";
import clientAxios from "../config/axios";
import productos from "../data/productos.json";
import oficinas from "../data/oficinas.json";
import estados from "../data/estados.json";
import canales from "../data/canales.json";
import { useApp } from "../context/AppContext";
import Swal from "sweetalert2";

type Formulario = {
  mes_sel: string;
  dni: string;
  nombres: string;
  correo: string;
  celular1: string;
  celular2: string;
  tipo_gestion: string;
  honeypot: "";
  timestamp: string; //timestamp 1749141307
  producto: string;
  oficina: string;
  estado: string;
  monto: number;
  plazo: string;
  tasa: string;
};

const Sumarizado = () => {
  const {enqueue,_mes_sel} = useApp();
  const [captcha, setCaptcha] = useState("");
  const [tasas, setTasas] = useState<string[]>([]);
  const [formulario, setFormulario] = useState<Formulario>({
    mes_sel: "",
    dni: "",
    nombres: "",
    correo: "",
    celular1: "",
    celular2: "",
    tipo_gestion: "PRESENCIAL",
    honeypot: "",
    timestamp: "",
    producto: "PRÉSTAMO NUEVO",
    oficina: "",
    estado: "INTERESADO",
    monto: 0,
    plazo: "",
    tasa: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangePlazo = async (value: string) => {
    const formData = new FormData();
    formData.append("val_plazo", value);
    formData.append("val_mes", _mes_sel);

    enqueue({
        action: "Mostrarplazo.php",
        callback: async () =>{
            try{
                const { data } = await clientAxios.post("/Mostrarplazo.php", formData);
                const regex = /new Option\('([^']*)','([^']*)'\)/g;

                let match;
                const valores = [];

                while ((match = regex.exec(data)) !== null) {
                    const textoOpcion = match[1];
                    const valorOpcion = match[2];

                    // Ignoramos opciones vacías o textos como "Seleccione"
                    if (textoOpcion && textoOpcion !== "Seleccione") {
                        valores.push(valorOpcion);
                    }
                }
                setTasas(valores);
            } catch (error: unknown) {
                if (error instanceof Error) {
                Swal.fire({
                    title: error.message || "Error al buscar el plazo",
                    icon: "error",
                });
                } else {
                Swal.fire({
                    title: "Error al buscar el plazo",
                    icon: "error",
                });
                }
                console.error(error);
            }
        }
    })
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Datos del cliente
      </h3>

      <div className="mb-6">
        <Captcha
          src="https://fuvexbn.a365.com.pe:7443/BN/captcha.php"
          captcha={captcha}
          setCaptcha={setCaptcha}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                DNI
              </label>
              <div className="flex">
                <input
                    type="text"
                    name="dni"
                    value={formulario.dni}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="Ingrese DNI"
                />
                <button className="py-1 px-2 bg-blue-600 text-white text-xs cursor-pointer hover:bg-blue-700">
                    Enviar
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombres y Apellidos
              </label>
              <input
                type="text"
                name="nombres"
                value={formulario.nombres}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="Nombre completo"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              name="correo"
              value={formulario.correo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              placeholder="ejemplo@correo.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Celular principal
              </label>
              <input
                type="text"
                name="celular1"
                value={formulario.celular1}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                pattern="\d{9}"
                placeholder="999888777"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono secundario
              </label>
              <input
                type="text"
                name="celular2"
                value={formulario.celular2}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Opcional"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de gestión
            </label>
            <select
              name="tipo_gestion"
              value={formulario.tipo_gestion}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Seleccionar...</option>
              {
                canales.map((c,i)=><option key={i} value={c}>{c}</option>)
              }
            </select>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Producto
              </label>
              <select
                name="producto"
                value={formulario.producto}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Seleccionar producto...</option>
                {
                    productos.map((p,i)=><option key={i} value={p}>{p}</option>)
                }
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Oficina
              </label>
              <select
                name="oficina"
                value={formulario.oficina}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Seleccionar oficina...</option>
                {
                    oficinas.map((o,i)=><option key={i} value={o}>{o}</option>)
                }
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                name="estado"
                value={formulario.estado}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {
                    estados.map((e,i)=><option key={i} value={e}>{e}</option>)
                }
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto (S/)
              </label>
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="monto"
                type="number"
                required
                min="100"
                max="99999"
                value={formulario.monto}
                onChange={handleChange}
                placeholder="Ej: 5000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plazo (meses)
              </label>
              <select
                name="plazo"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                value={formulario.plazo}
                onChange={(e) => {
                  handleChange(e);
                  handleChangePlazo(e.target.value);
                }}
              >
                <option value="">Seleccionar...</option>
                <option value="12">12</option>
                <option value="24">24</option>
                <option value="36">36</option>
                <option value="48">48</option>
                <option value="60">60</option>
                <option value="72">72</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tasa (%)
              </label>
              <select
                name="tasa"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                value={formulario.tasa}
                onChange={handleChange}
              >
                <option value="">Seleccionar...</option>
                {tasas.map((tasa, idx) => (
                  <option key={idx} value={tasa}>
                    {tasa}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded cursor-pointer text-sm">
                Registrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sumarizado;
