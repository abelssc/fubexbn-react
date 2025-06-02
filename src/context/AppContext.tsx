import { createContext, useContext, type ReactNode } from "react";


type AppContext={
    enqueue:(obj:any)=>void;
};

const AppContext = createContext<AppContext|null>(null);

export const AppProvider=({children}:{children:ReactNode})=>{
    const queue:any = [];
    let isProcessing = false;
    let lastExecutionTime = 0;

    const enqueue = (obj:any) => {
        queue.push(obj);
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
        const obj = queue.shift();
        const naw=new Date();
        console.log("Fetching..."+obj.action,naw.getMinutes(),naw.getSeconds(),naw.getMilliseconds());
        
        try {
            // AQUI EJECUTAMOS LOS CALLBACK
            
        } finally {
            isProcessing = false;
            processQueue(); // Procesar la siguiente tarea inmediatamente (se calculará el delay)
        }
    };

    return (
        <AppContext.Provider value={
            {
                enqueue
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