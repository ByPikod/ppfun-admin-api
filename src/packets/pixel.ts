import Bot from "../Bot";

export type RawPixelData = [
    number, number
]

export type RawPixelChunk = [
    number,
    number,
    RawPixelData[]
]

export function unpackPixelUpdate(data: DataView): RawPixelChunk {

    let i = data.getUint8(1); // chunk x
    let j = data.getUint8(2); // chunk y

    /*
     * offset and color of every pixel
     * 3 bytes offset
     * 1 byte color
     */
    let pixels: Array<RawPixelData> = [];
    let off = data.byteLength;
    
    while (off > 3) {
        let color = data.getUint8(off -= 1);
        let offsetL = data.getUint16(off -= 2);
        let offsetH = data.getUint8(off -= 1) << 16;
        pixels.push([offsetH | offsetL, color]);
    }

    return [
        i, j, pixels,
    ];

}

export function receivedPixel(bot: Bot, data: DataView): RawPixelChunk {
    let unpack = unpackPixelUpdate(data)
    bot.emit("pixelUpdate", unpack)
    return unpack
}
  