import { Bot } from "./bot"
import { MessageHistory } from "./message-history"

export class User {

    private id: number
    private name: string
    private flag: string
    private badges: string
    private bot: Bot
    private messageHistory = new MessageHistory();

    constructor(id: number, name: string, flag: string, badges: string, bot: Bot) {
        this.id = id
        this.name = name
        this.flag = flag
        this.badges = badges
        this.bot = bot
    }

    /**
     * Returns user id
     * @returns 
     */
    getId(): number {
        return this.id;
    }

    /**
     * Returns user name
     * @returns 
     */
    getName(): string {
        return this.name;
    }

    /**
     * Returns user flag
     * @returns 
     */
    getFlag(): string {
        return this.flag;
    }

    /**
     * Returns the bot object
     * @returns Bot
     */
    getBot(): Bot {
        return this.bot;
    }

    /**
     * Returns the message history object
     * @returns MessageHistory
     */
    getMessageHistory(): MessageHistory {
        return this.messageHistory;
    }

}