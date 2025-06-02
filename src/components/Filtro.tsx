import { useRef, useState } from "react";
import Filtro_Masivo from "./Filtro_Masivo";
import Filtro_Personalizado from "./Filtro_Personalizado";

const Filtro = () => {

  const captchaRef = useRef<HTMLImageElement | null>(null);
  const [captcha,setCaptcha] = useState('');


  const reloadCaptcha = () => {
    if (!captchaRef.current) return;
    captchaRef.current.src = "https://fuvexbn.a365.com.pe:7443/BN/captcha2.php";
  }

  return (
    <div className="w-full p-4">
      <div className="bg-white border border-gray-300 rounded-xl p-4 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-800 mb-3">
          Enviar DNI's
        </h1>
        
        {/* CAPTCHA */}
        <div className="flex gap-3 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width={40} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="cursor-pointer" onClick={reloadCaptcha}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          <img
            src="https://fuvexbn.a365.com.pe:7443/BN/captcha2.php"
            alt=""
            width={120}
            height={50}
            ref={captchaRef}
          />
          <input
            type="text"
            value={captcha}
            name="captcha"
            onChange={(e)=>setCaptcha(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            placeholder="Ingrese captcha"
          />
        </div>
        {/* CARGA MASIVA */}
        <Filtro_Masivo captcha={captcha}/>
      
        {/* PERSONALIZADO */}
        <Filtro_Personalizado captcha={captcha}/>
            
      </div>
    </div>
  );
};

export default Filtro;
