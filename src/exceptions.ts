export class BotRequestTimedOut extends Error {
    name = "RequestTimedOut"
    message = "Request timed out."
}

export class BotFailedToConnect extends Error {
    constructor(reason: any) {
        super()
        this.name = "BotFailedToConnect"
        this.message = `An error occured while connecting to servers: ${reason}`
    }
}

export class BotNotConnected extends Error {
    name = "BotNotConnected"
    message = "Bot is not connected yet. Make sure you called connect() and awaited."
}

export class BotFailedToFetchChannel extends Error {
    constructor(channelId: number){
        super()
        this.name = "BotFailedToFetchChannel"
        this.message = `Message cannot be handled, failed to fetch room #${channelId}!`
    }
}