import { Message } from "./message";

export abstract class MessageHolder {
    
    protected messages: Array<Message> = []

    /**
     * Returns oldest message available.
     * Maximum 50 messages are stored.
     * @returns Message
     */
    public getOldestMessage(): Message {
        return this.messages[0];
    }

    /**
     * Returns the last message
     * @returns Message
     */
    public getLastMessage(): Message {
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
     * Returns message by author name
     * @param name Author name
     * @returns Message
     */
    public getMessageByAuthorName(name: string): Message | undefined {
        return this.messages.find(message => message.getAuthor().getName() === name)
    }

    /**
     * Returns message by author ID
     * @param id Author ID
     * @returns Message
     */
    public getMessageByAuthorID(id: number): Message | undefined {
        return this.messages.find(m => m.getAuthor().getId() === id)
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