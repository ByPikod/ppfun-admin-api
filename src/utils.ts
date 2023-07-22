import { BotRequestTimedOut } from "./exceptions";

export function promiseWithTimeout(millis: number, promise: Promise<any>) {
    
    const timeout = new Promise((resolve, reject) =>
        setTimeout(
            () => reject(`Timed out after ${millis} ms.`), 
            millis
        )
    );
    
    return Promise.race([
        promise,
        timeout
    ]);

};

export function toArrayBuffer(buffer: Buffer) {

    const arrayBuffer = new ArrayBuffer(buffer.length);
    const view = new Uint8Array(arrayBuffer);

    for (let i = 0; i < buffer.length; ++i) {
      view[i] = buffer[i];
    }

    return arrayBuffer;

}