import Channel from "./channel";
import { User } from "./user";

class Message {

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

}

export default Message;