import Bot from "../bot";

type OnlineCount = {
    [key: string]: number
}

/*
* Unpacks the online counter binary packet
*/
export function unpackOnlineCounterBinary(data: Buffer): OnlineCount {

    const online: OnlineCount = {};

    online.total = data.readUInt16BE(1);
    let off = data.length;

    while (off > 3) {
        const onlineUsers = data.readUInt16BE(off -= 2);
        const canvas = data.readUInt8(off -= 1);
        online[canvas] = onlineUsers;
    }

    return online;

}

/**
* Handles online counter packets
* @emits userCountUpdated
*/
export function receiveOnlineCounter(bot: Bot, data: DataView){
    bot.emit("userCountUpdated")
}