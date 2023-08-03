import { Bot } from "../bot";
import { Channel } from "../channel";

/**
 * Turns the raw channels data into Channel objects and returns it
 * @param data
 * @returns Channels
 */
export function receivedChannels(bot: Bot, data: any): Channel[] {
    
    const channels: Channel[] = [];

    for(const result of data) {
        const channel = new Channel(bot, result[0], result[1])
        channels.push(channel)
    }

    return channels;

}