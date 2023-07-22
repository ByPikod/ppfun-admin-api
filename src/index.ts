import Bot from "./bot";
import Channel from "./channel";
import * as config from "./config.json";
import Subscriptions from "./subscriptions";

// Connection
const bot = new Bot()

bot.connect(
    config.url, 
    config.apiKey, 
    Subscriptions.CHAT | Subscriptions.ONLINE | Subscriptions.PIXEL
).then(() => {
    
    bot.subscribeChannels().then((channels) => {
        
        const chatNames = channels.map(
            (channel: Channel) => channel.getName()
        );

        console.log(`Subscribed channels: ${chatNames.join(", ")}`)

    })

    bot.subscribeUserCounter().then((online) => {
        console.log(online);
    })

})