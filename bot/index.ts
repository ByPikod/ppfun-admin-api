import Bot from "../src/Bot";
import Channel from "../src/Channel";
import Subscriptions from "../src/Subscriptions";
import { OnlineData } from "../src/packets/online";
import Message from "../src/Message";

import * as config from "./config.json";
import VoidBot from "./Void";
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

bot.connect(
    config.url, 
    config.apiKey, 
    Subscriptions.CHAT | Subscriptions.ONLINE
).then(() => {
    console.log("Bot connected!")
})

const voidbot = new VoidBot(bot)