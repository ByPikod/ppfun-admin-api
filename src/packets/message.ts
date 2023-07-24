import { BotFailedToFetchChannel } from "../Exceptions"
import Bot from "../Bot"
import Message from "../Message"

/**
 * Turns the data pack into a Message object and reutrns it
 * @param data
 * @returns Message
 */
export function recievedMessage(bot: Bot, data: any): Message {
            
    let authorName = data[0]
    let authorId = data[1]
    let messageContent = data[2]
    let authorFlag = data[3]
    let channelId = data[4]

    /* Get user */
    let user = bot.getUserById(authorId)
    if (user === undefined) {
        user = bot._createUser(authorId, authorName, authorFlag);
    }

    /* Get channel */
    let channel = bot.getChannelById(channelId)
    if(channel === undefined)
        throw new BotFailedToFetchChannel(channelId);

    /* Get message */
    let message = new Message(user, channel, messageContent) // Create the message
    channel._addMessage(message) // Adds message to the channel's message history
    
    return message;

}