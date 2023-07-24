import { BotRequestTimedOut } from "./Exceptions";

export function promiseWithTimeout(millis: number, promise: Promise<any>) {
    
    let timeout = new Promise((resolve, reject) =>
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

    let arrayBuffer = new ArrayBuffer(buffer.length);
    let view = new Uint8Array(arrayBuffer);

    for (let i = 0; i < buffer.length; ++i) {
      view[i] = buffer[i];
    }

    return arrayBuffer;

}

/**
 * Creates chat mention
 * @param nick 
 * @param id 
 */
export function createMention(nick: string, id: number): string {
    nick = nick.replace("[", "\\[").replace("]", "\\]")
    return `@[${nick}](${id})`
}