import { Bot } from "../bot";

export type OnlineData = {
    [key: number]: number,
    total: number
}

/*
* Unpacks the online counter binary packet
*/
export function unpackOnlineCounter(data: DataView): OnlineData {

    const online: OnlineData = {
        total: data.getUint16(1)
    };
    
    let off = data.byteLength;

    while (off > 3) {
        const onlineUsers = data.getUint16(off -= 2);
        const canvas = data.getUint8(off -= 1);
        online[canvas] = onlineUsers;
    }

    return online;

}

/**
* Handles online counter packets
* @emits userCountUpdated
*/
export function receivedOnline(bot: Bot, data: DataView): OnlineData {
    const unpack = unpackOnlineCounter(data)
    bot.emit("onlineCounter", unpack)
    return unpack
}