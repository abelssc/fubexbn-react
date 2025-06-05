import { createContext, useContext, useState, type ReactNode } from "react";


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

export const AppProvider=({children}:{children:ReactNode})=>{
    const [respuestas,setRespuestas] = useState('');
    const _mes_sel="_06_2025";

    const queue:Task[] = [];
    let isProcessing = false;
    let lastExecutionTime = 0;

    const enqueue = (task:Task) => {
        queue.push(task);
        processQueue();
    };

    const processQueue = async () => {
        if (isProcessing || queue.length === 0) return;
        
        const now = Date.now();
        const timeSinceLastExecution = now - lastExecutionTime;
        const delayNeeded = Math.max(0, 2000 - timeSinceLastExecution);

        if (delayNeeded > 0) {
            setTimeout(processQueue, delayNeeded);
            return;
        }

        isProcessing = true;
        lastExecutionTime = now;

        const task = queue.shift();
        const time=new Date();
        console.log("Ejecutando: " + task?.action, time.toLocaleTimeString());
        
        try {
            // AQUI EJECUTAMOS LOS CALLBACK
             if (task?.callback) {
                await task.callback(); // 🔥 Ejecutamos el callback proporcionado
            }
        } finally {
            isProcessing = false;
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