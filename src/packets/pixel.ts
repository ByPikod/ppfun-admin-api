import { Bot } from "../bot";

export type RawPixelData = [
    number, number
]

export type RawPixelChunk = [
    number,
    number,
    RawPixelData[]
]

/**
 * Dehydrates binary pixel packet
 * @param data 
 * @returns 
 */
export function unpackPixelUpdate(data: DataView): RawPixelChunk {

    const i = data.getUint8(1); // chunk x
    const j = data.getUint8(2); // chunk y

    /*
     * offset and color of every pixel
     * 3 bytes offset
     * 1 byte color
     */
    const pixels: Array<RawPixelData> = [];
    let off = data.byteLength;
    
    while (off > 3) {
        const color = data.getUint8(off -= 1);
        const offsetL = data.getUint16(off -= 2);
        const offsetH = data.getUint8(off -= 1) << 16;
        pixels.push([offsetH | offsetL, color]);
    }

    return [
        i, j, pixels,
    ];

}

/**
 * Called from Bot to handle pixel packet
 * @param bot 
 * @param data 
 * @returns 
 */
export function receivedPixel(bot: Bot, data: DataView): RawPixelChunk {
    const unpack = unpackPixelUpdate(data)
    bot.emit("pixelUpdate", unpack)
    return unpack
}
  