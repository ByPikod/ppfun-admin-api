import { BotFailedToFetchChannel } from "../exceptions"
import { Bot } from "../bot"
import { Message } from "../message"
import { CPNBot } from "../cpnbot"

/**
 * We need to check if the bot is a CPNBot or not in the runtime
 * because typescript somehow doesn't allow us to check if the bot is a CPNBot
 * @param bot 
 * @returns boolean
 */
function isCpnBot(bot: Bot) {
    return (bot as CPNBot).sendAnnouncement !== undefined;
}

/**
 * Turns the data pack into a Message object and reutrns it
 * @param data
 * @returns Message
 */
export function recievedMessage(bot: Bot | CPNBot, data: any): Message {

    const authorName = data[0]
    const authorId = data[1]
    const messageContent = data[2]
    const authorFlag = data[3]

    let authorBadges, channelId;
    if (isCpnBot(bot)) {
        authorBadges = data[4]
        channelId = data[5];
    } else {
        channelId = data[4];
    }

    /* Get user */
    let user = bot.getUserById(authorId)
    if (user === undefined) {
        if (isCpnBot(bot))
            user = (bot as CPNBot)._createCPNUser(authorId, authorName, authorFlag, authorBadges);
        else
            user = bot._createUser(authorId, authorName, authorFlag);
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