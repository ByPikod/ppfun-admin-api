import Bot from "./Bot";
import Message from "./Message";

/**
 * Represents a chat room in the chat.
 */
class Channel {

    private messages: Array<Message> = []

    private bot: Bot
    private id: number
    private name: string

    constructor(bot: Bot, id: number, name: string) {
        this.bot = bot
        this.id = id
        this.name = name
    }

    /**
     * On received a message
     * @param user Message author
     * @param message Message Content
     */
    _addMessage(message: Message) {
        
        this.messages.push(message)
        
        if(this.messages.length >= 50)
            this.messages.shift();

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
     * Send a message to channel.
     * @param message Message content
     * @param name Bot username to appear
     * @param userId Bot id to appear when ping'd
     * @param country Bot country to appear in the flag icon
     */
    sendMessage(
        message: string,
        name: string = this.bot.getBotName(), 
        userId: number = this.bot.getChatId(),
        country: string = this.bot.getBotCountry()
    ) {
        this.bot._ws?.send(
            JSON.stringify(
                ["chat", name, userId, message, country, this.getId()]
            )
        )
    }

}

export default Channel