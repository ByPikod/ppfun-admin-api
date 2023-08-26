import { Bot } from "./bot";
import { Channel } from "./channel";
import { User } from "./user";
import { createMention } from "./utils";

export class Message {

    private author: User
    private channel: Channel
    private content: string
    private bot: Bot
    private created_at: number; // unix timestamp

    constructor(author: User, channel: Channel, content: string) {
        this.created_at = Date.now();
        this.author = author;
        this.channel = channel;
        this.content = content;
        this.bot = channel.getBot();
    }

    /**
     * Returns message author.
     * @returns 
     */
    getAuthor(): User {
        return this.author;
    }

    /**
     * Returns the chat room message sent to.
     * @returns 
     */
    getChatRoom(): Channel {
        return this.channel;
    }

    /**
     * Returns the message content
     * @returns 
     */
    getContent(): string {
        return this.content;
    }

    /**
     * Returns the unix timestamp of the time message created.
     */
    getCreationTime(){
        return this.created_at;
    }

    /**
     * Returns the parent bot.
     * @returns Bot
     */
    getBot(): Bot {
        return this.bot;
    }

    /**
     * Send a message to channel.
     * @param message Message content
     * @param name Bot username to appear
     * @param userId Bot id to appear when ping'd
     * @param country Bot country to appear in the flag icon
     */
    reply(
        message: string,
        name?: string,
        userId?: number,
        country?: string
    ) {
        const author = this.getAuthor()
        const mention = createMention(
            author.getName(),
            author.getId()
        )
        this.channel.sendMessage(
            `${mention}, ${message}`, 
            name, 
            userId, 
            country
        )
    }
}