import { Packets } from "../packets";

/**
 * Creates a ping packet and returns
 * @returns 
 */
export function createPingPacket() {
    return new Uint8Array([Packets.PING_OP]).buffer;
}  