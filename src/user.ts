import { Bot } from "./bot"

export class User {

    private id: number
    private name: string
    private flag: string
    private bot: Bot

    constructor(id: number, name: string, flag: string, bot: Bot) {
        this.id = id
        this.name = name
        this.flag = flag
        this.bot = bot;
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

}