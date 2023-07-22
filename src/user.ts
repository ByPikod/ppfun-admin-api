export class User {

    private id: number
    private name: string
    private flag: string

    constructor(id: number, name: string, flag: string) {
        this.id = id
        this.name = name
        this.flag = flag
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

}