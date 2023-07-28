import Bot from "../src/bot";
import Message from "../src/message";

class VoidBot {

    bot: Bot

    constructor(bot: Bot) {
        this.bot = bot
        bot.addListener(
            "chatMessage", 
            this.onMessage.bind(this)
        )
    }

    /**
     * Tell when is void
     * @param message 
     */
    onMessage(message: Message) {
        
        let content = message.getContent()
        content = content.toLowerCase()

        if(
            content == "when void" ||
            content == "void when" 
        ) {
            message.reply("Void")
        }

    }

}

export default VoidBot;