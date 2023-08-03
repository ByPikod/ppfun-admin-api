import { 
    Bot, 
    Channel, 
    Subscriptions, 
    Message, 
    OnlineData 
} from "../src";

import * as config from "./config.json";
import { info } from "./logger";

// Connection
const bot = new Bot()

/**
 * Log when channels loaded
 */
bot.on("channelsLoaded", (channels: Channel[]) => {
    
    const chatNames = channels.map(
        (channel: Channel) => channel.getName()
    );

    info(`Subscribed channels: ${chatNames.join(", ")}`)
    
})

/**
 * Log chat messages
 */
bot.on("chatMessage", (message: Message) => {
    
    info(
        `[${message.getAuthor().getFlag()}] ` +
        `${message.getAuthor().getName()} > ` + 
        `${message.getChatRoom().getName()}: ` +
        `${message.getContent()}`
    )

})

/**
 * Log online counter
 */
bot.on("onlineCounter", (online: OnlineData) => {
    info(`Online: ${online.total}`)
})

/**
 * Health checkups
 */
bot.on("close", (err: string) => {
    info(`Socket closed: ${err}`)
})

bot.on("heartbeat", () => {
    info("Ping sent!")
})

bot.connect(
    config.url, 
    config.apiKey,
    Subscriptions.CHAT + Subscriptions.ONLINE
).then(() => {
    info("Bot connected!")
    bot.fetchFlag(1).then((data) => {
        info(`Flag: ${data[0]}, ID: ${data[1]}`)
    })
})