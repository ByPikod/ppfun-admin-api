import Bot from "../Bot";
import Channel from "../Channel";

/**
 * Turns the raw channels data into Channel objects and returns it
 * @param data
 * @returns Channels
 */
export function receivedChannels(bot: Bot, data: any): Channel[] {
    
    let channels: Channel[] = [];

    for(let result of data) {
        let channel = new Channel(bot, result[0], result[1])
        channels.push(channel)
    }

    return channels;

}