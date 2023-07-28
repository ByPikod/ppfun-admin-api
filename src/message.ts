import { Channel } from "./channel";
import { User } from "./user";
import { createMention } from "./utils";

export class Message {

    private author: User
    private chat: Channel
    private content: string

    constructor(author: User, chat: Channel, content: string) {
        this.author = author;
        this.chat = chat;
        this.content = content;
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
        return this.chat;
    }

    /**
     * Returns the message content
     * @returns 
     */
    getContent(): string {
        return this.content;
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
        let author = this.getAuthor()
        let mention = createMention(
            author.getName(),
            author.getId()
        )
        this.chat.sendMessage(
            `${mention}, ${message}`, 
            name, 
            userId, 
            country
        )
    }
}