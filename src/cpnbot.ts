import { Bot } from "./bot"
import { Channel } from "./channel"
import { User } from "./user"
import { promiseWithTimeout } from "./utils"

/**
 * CanvasPixel special designed bot.
 * @emits announceRes Emited when received respond for a previous announcement packet.
 */
export class CPNBot extends Bot {

    /**
     * CPN special packet handler.
     */
    protected handleTextPacket(type: string, data: any): void {
        

        switch(type) {
            case "announceRes":
                this.emit("announceRes", data)
                return
        }
        
        super.handleTextPacket(type, data)

    }

    /**
     * Make announcement
     * @param message Specify announcement content.
     * @param receiver Specify who will receive the message.
     * @param popup Message will pop up if true.
     */
    sendAnnouncement(
        message: string, 
        receiver: Channel | User | number,
        popup: boolean
    ): Promise<number> {
        return promiseWithTimeout(this._timeout, new Promise((res, rej) => {
            
            const toUser = !(receiver instanceof Channel)

            // Turn reciever data to id.
            let receiverId: number
            if(toUser) {
                if(receiver instanceof User) 
                    receiverId = receiver.getId()
                else
                    receiverId = receiver
            }else
                receiverId = receiver.getId()

            // Send the packet
            this._ws?.send(
                JSON.stringify(
                    ["announce", message, receiverId, popup, toUser]
                )
            )
            
            // Wait for response
            const respondListener = (data: any) => {
                if(data[1] !== undefined) {
                    rej(data[1]);
                    return;
                }
                res(data)
            }
    
            this.once("announceRes", respondListener)

        }))
    }

}