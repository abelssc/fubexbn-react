import { createContext, useContext, useRef, useState, type ReactNode } from "react";
import type { User } from "../pages/App";


type Task = {
  action: string;
  callback: () => Promise<void>;
};

type AppContextType = {
  enqueue: (task: Task) => void;
  respuestas: string;
  setRespuestas: (value: string) => void;
  _mes_sel:string;
};
const AppContext = createContext<AppContextType|null>(null);

export const AppProvider=({children,user}:{children:ReactNode,user:User})=>{
    const [respuestas,setRespuestas] = useState('');
    const _mes_sel=user.mes_sel;

    const queue = useRef<Task[]>([]);
    const isProcessing = useRef(false);
    const lastExecutionTime = useRef(0);

    const enqueue = (task:Task) => {
        queue.current.push(task);
        processQueue();
    };

    const processQueue = async () => {
        if (isProcessing.current || queue.current.length === 0) return;

        isProcessing.current = true;
        
        const now = Date.now();
        const timeSinceLastExecution = now - lastExecutionTime.current;
        const delayNeeded = Math.max(0, 2000 - timeSinceLastExecution);
        
        await new Promise(resolve => setTimeout(resolve,delayNeeded));
    
        const task = queue.current.shift();
        console.log("Ejecutando:", task?.action, new Date().toLocaleTimeString() + ":" + new Date().getMilliseconds());

        
        try {
            // AQUI EJECUTAMOS LOS CALLBACK
             if (task?.callback) {
                await task.callback(); // 🔥 Ejecutamos el callback proporcionado
            }
        } finally {
            lastExecutionTime.current = Date.now();
            isProcessing.current = false;
            processQueue(); // Procesar la siguiente tarea inmediatamente (se calculará el delay)
        }
    };

    return (
        <AppContext.Provider value={
            {
                enqueue,
                respuestas,
                setRespuestas,
                _mes_sel
            }
        }>
            {children}
        </AppContext.Provider>
    )


};

export const useApp = ()=>{
    const context = useContext(AppContext)
    if(context === null){
        throw new Error('useApp must be used within a AppProvider')
    }
    return context
}