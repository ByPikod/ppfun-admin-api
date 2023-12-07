import { BotFailedToFetchChannel } from "../exceptions"
import { Bot } from "../bot"
import { Message } from "../message"

/**
 * Turns the data pack into a Message object and reutrns it
 * @param data
 * @returns Message
 */
export function recievedMessage(bot: Bot, data: any): Message {

    const authorName = data[0]
    const authorId = data[1]
    const messageContent = data[2]
    const authorFlag = data[3]
    const authorBadges = data[4]
    const channelId = data[5]

    /* Get user */
    let user = bot.getUserById(authorId)
    if (user === undefined) {
        user = bot._createUser(authorId, authorName, authorFlag, authorBadges);
    }

    /* Get channel */
    const channel = bot.getChannelById(channelId)
    if (channel === undefined)
        throw new BotFailedToFetchChannel(channelId);

    /* Get message */
    const message = new Message(user, channel, messageContent) // Create the message
    channel._addMessage(message) // Adds message to the channel's message history
    user.getMessageHistory()._addMessage(message); // Adds message to the user's message history

    return message;

}