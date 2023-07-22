import Bot from "../bot";

/**
 * On channels loaded
 * @param data
 * @emits channelsLoaded
 */
export function receiveChannelsLoaded(bot: Bot, data: any) {
    
    for(let result of data) {
        bot.createChannel(result[0], result[1])
    }

    bot.emit("channelsLoaded", bot.getChannels())

}