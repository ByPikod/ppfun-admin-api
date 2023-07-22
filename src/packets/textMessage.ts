import Bot from "../bot"
import { BotFailedToFetchChannel } from "../exceptions"
import Message from "../message"
import { User } from "../user"

/**
 * On message received
 * @param data 
 * @emits chatMessage
 */
export function receiveTextMessage(bot: Bot, data: any) {
        
    const authorName = data[0]
    const authorId = data[1]
    const messageContent = data[2]
    const authorFlag = data[3]
    const channelId = data[4]

    /* Get user */
    let user = bot.getUserById(authorId)
    if (user === undefined) {
        user = bot.createUser(authorId, authorName, authorFlag);
    }

    /* Get channel */
    const channel = bot.getChannelById(channelId)
    if(channel === undefined)
        throw new BotFailedToFetchChannel(channelId);

    /* Get message */
    const message = new Message(user, channel, messageContent) // Create the message
    channel.onMessage(message) // Adds message to the channel's message history
    bot.emit("chatMessage", message)

}