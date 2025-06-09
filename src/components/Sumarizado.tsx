import { useState } from "react";
import Captcha from "./Captcha";
import Sumarizado_Masivo from "./Sumarizado_Masivo";
import Sumarizado_Personalizado from "./Sumarizado_Personalizado";

const Sumarizado = () => {

  const [captcha,setCaptcha] = useState('');

  return (
      <div className="bg-white border border-gray-300 rounded-xl p-4 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-800 mb-3">
          Sumarizado
        </h1>
        {/* CAPTCHA */}
        <Captcha 
          src="https://fuvexbn.a365.com.pe:7443/BN/captcha.php"
          captcha={captcha} 
          setCaptcha={setCaptcha} 
        />
        {/* CARGA MASIVA */}
        <Sumarizado_Masivo captcha={captcha}/>
        {/* PERSONALIZADO */}
        <Sumarizado_Personalizado captcha={captcha}/>
      </div>
  );
};

export default Sumarizado;
