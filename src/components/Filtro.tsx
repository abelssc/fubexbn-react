import { useState } from "react";
import Filtro_Masivo from "./Filtro_Masivo";
import Filtro_Personalizado from "./Filtro_Personalizado";
import Captcha from "./Captcha";

const Filtro = () => {

  const [captcha,setCaptcha] = useState('');

  return (
      <div className="bg-white border border-gray-300 rounded-xl p-4 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-800 mb-3">
          Enviar DNI's
        </h1>
        {/* CAPTCHA */}
        <Captcha 
          src="https://fuvexbn.a365.com.pe:7443/BN/captcha2.php" 
          captcha={captcha} 
          setCaptcha={setCaptcha} 
        />
        {/* CARGA MASIVA */}
        <Filtro_Masivo captcha={captcha}/>
        {/* PERSONALIZADO */}
        <Filtro_Personalizado captcha={captcha}/>
      </div>
  );
};

export default Filtro;
