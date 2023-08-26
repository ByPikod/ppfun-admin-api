import { Bot } from "./bot";
import { Message } from "./message";
import { MessageHolder } from "./message-holder";

/**
 * Represents a chat room in the chat.
 */
export class Channel extends MessageHolder {

    protected bot: Bot
    protected id: number
    protected name: string

    constructor(bot: Bot, id: number, name: string) {
        super()
        this.bot = bot
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