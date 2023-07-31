import { Packets } from "../packets";

export function createPingPacket() {
    return new Uint8Array([Packets.PING_OP]).buffer;
}  