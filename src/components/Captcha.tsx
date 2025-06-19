import { useRef } from "react";

type Captcha={
    src:string;//url for captcha image
    captcha: string;
    setCaptcha: (value: string) => void;
}

const Captcha = ({src,captcha,setCaptcha}:Captcha) => {

    const captchaRef = useRef<HTMLImageElement | null>(null);

    const reloadCaptcha = () => {
    if (!captchaRef.current) return;
    captchaRef.current.src = src;
    }

  return (
    <div className="flex mb-6 px-4">
      <img
        src={src}
        alt=""
        width={96}
        height={40}
        ref={captchaRef}
        className="border border-gray-300"
      />
      <input
        type="text"
        value={captcha}
        name="captcha"
        onChange={(e) => setCaptcha(e.target.value)}
        className="w-full border border-gray-300 rounded px-2 py-1 text-sm max-w-48"
        placeholder="Ingrese captcha"
      />
       <svg
        xmlns="http://www.w3.org/2000/svg"
        width={60}
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="cursor-pointer border border-gray-300 px-3"
        onClick={reloadCaptcha}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
        />
      </svg>
    </div>
  );
};

export default Captcha;
