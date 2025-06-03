import { useApp } from "../context/AppContext"

const Respuestas = () => {
    const {respuestas} = useApp();
    return (
         <div
            className="w-full p-4"
            dangerouslySetInnerHTML={{ __html: respuestas }}
        />
    )
}

export default Respuestas