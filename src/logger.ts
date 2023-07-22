/**
 * Information log
 * @param message 
 */
export function info(message: string){
    console.log(`[${new Date().toLocaleTimeString()}][INFO] ${message}`)
}

/**
 * Warning log
 * @param message 
 */
export function warn(message: string){
    console.log(`[${new Date().toLocaleTimeString()}][WARN] ${message}`)
}