import { useState } from "react";
import Captcha from "./Captcha";
import Sumarizado_Masivo from "./Sumarizado_Masivo";
import Sumarizado_Personalizado from "./Sumarizado_Personalizado";

const Sumarizado = () => {

  const [captcha,setCaptcha] = useState('');
  const [loading,setLoading] = useState(false);

  return (
      <details className="bg-white border border-gray-300 rounded-xl p-4 shadow-sm">
        <summary className="text-xl font-semibold text-gray-800 mb-3 cursor-pointer">
          {
            !loading
            ? <span>Sumarizado</span>
            : <span>
                <svg 
                      className="size-5 animate-spin inline-block text-gray-400" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
                    >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg> Enviando sumarizado ... 
              </span>
          }
        </summary>
        {/* CAPTCHA */}
        <Captcha 
          src="https://fuvexbn.a365.com.pe:7443/BN/captcha.php"
          captcha={captcha} 
          setCaptcha={setCaptcha} 
        />
        {/* CARGA MASIVA */}
        <Sumarizado_Masivo captcha={captcha} loading={loading} setLoading={setLoading}/>
        {/* PERSONALIZADO */}
        <Sumarizado_Personalizado captcha={captcha}/>
      </details>
  );
};

export default Sumarizado;
