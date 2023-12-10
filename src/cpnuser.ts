import { Bot } from "./bot"
import { User } from "./user"

export class CPNUser extends User {
    private badges: string

    constructor(id: number, name: string, flag: string, badges: string, bot: Bot) {
        super(id, name, flag, bot)
        this.badges = badges
    }

    /**
     * Returns the badges of the user
     * @returns string
     */
    getBadges(): string {
        return this.badges;
    }
}