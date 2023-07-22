import Message from "./message";

/**
 * Represents a chat room in the chat.
 */
class Channel {

    private id: number
    private name: string
    private messages: Array<Message> = []

    constructor(id: number, name: string) {
        this.id = id
        this.name = name
    }

    /**
     * Return channel id
     * @returns ID
     */
    getId(): number {
        return this.id;
    }

    /**
     * Returns channel name
     * @returns Name
     */
    getName(): string {
        return this.name;
    }

    /**
     * On received a message
     * @param user Message author
     * @param message Message Content
     */
    onMessage(message: Message) {
        
        this.messages.push(message)
        
        if(this.messages.length >= 50)
            this.messages.shift();

    }

}

export default Channel