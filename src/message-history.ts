import { Message } from "./message";

export class MessageHistory {
    
    protected messages: Array<Message> = []

    /**
     * Returns oldest message available.
     * Maximum 50 messages are stored.
     * @returns Message
     */
    public getOldestMessage(): Message | undefined {
        return this.messages[0];
    }

    /**
     * Returns the last message
     * @returns Message
     */
    public getLastMessage(): Message | undefined {
        return this.messages[this.messages.length - 1];
    }

    /**
     * Returns the messages that its content matches to the Regex Query passed.
     * @param pattern Pattern to match
     * @retursn Array of messages
     */
    public getMatchingMessages(pattern: string | RegExp): Array<Message> {
        return this.messages.filter(m => m.getContent().match(pattern));
    }

    /**
     * Returns the messages that are includes the text passed in the content.
     * @param text Text to look
     * @returns Array of messages
     */
    public getIncludingMessages(text: string): Array<Message> {
        return this.messages.filter(m => m.getContent().includes(text));
    }

    /**
     * Returns messages between two timestamps.
     * @param from From (Unix in MS)
     * @param to To (Unix in MS)
     * @returns Array of messages
     */
    public getMessagesBetween(from: number, to: number): Array<Message> {
        return this.messages.filter(
            m => m.getCreationTime() >= from && m.getCreationTime() <= to
        )
    }

    /**
     * Returns messages that sent after a specific time.
     * @param time Unix in MS 
     * @returns Message
     */
    public getMessagesSince(time: number): Array<Message> {
        return this.messages.filter(m => m.getCreationTime() >= time)
    }

    /**
     * Returns messages by the author's name
     * @param name Author name
     * @returns Message
     */
    public getMessagesByAuthorName(name: string): Array<Message> {
        return this.messages.filter(m => m.getAuthor().getName() === name);
    }

    /**
     * Returns messages by the author's ID
     * @param id Author ID
     * @returns Message
     */
    public getMessagesByAuthorID(id: number): Array<Message> {
        return this.messages.filter(m => m.getAuthor().getId() === id);
    }

    /**
     * Returns message history (up to 50 messages).
     * @returns 
     */
    public getMessages(): Array<Message> {
        return this.messages
    }

    /**
     * Adds a message into message list.
     * @param user Message author
     * @param message Message Content
     */
    public _addMessage(message: Message) {
        
        this.messages.push(message)
        
        if(this.messages.length >= 50)
            this.messages.shift();

    }

}