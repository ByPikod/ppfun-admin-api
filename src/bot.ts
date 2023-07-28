import EventEmitter from "events"
import WebSocket, { MessageEvent } from "ws"

import { Channel } from "./channel"
import { Packets } from "./packets"
import { Subscriptions } from "./subscriptions"
import { User } from "./user"

import { toArrayBuffer } from "./utils"
import { BotFailedToConnect } from "./exceptions"
import { receivedChannels } from "./packets/channels"
import { OnlineData, receivedOnline } from "./packets/online"
import { recievedMessage } from "./packets/message"
import { receivedPixel } from "./packets/pixel"

/**
 * Events:
 * @emits open
 * @emits error
 * @emits channelsLoaded
 * @emits userCountUpdated
 * @emits chatMessage
 */
export class Bot extends EventEmitter {
    
    _ws: WebSocket | undefined
    _timeout: number = 5000

    private subscriptions: Subscriptions = 1
    private channels = new Map<number, Channel>();
    private users: Array<User> = []
    private online: OnlineData = { total: 0 }

    private botName: string
    private botChatId: number
    private botCountry: string
    
    constructor(botName: string="Bot", botChatId: number=0, botCountry: string="zz") {
        super()
        this.botName = botName
        this.botChatId = botChatId
        this.botCountry = botCountry
    }

    async connect(url: string, apiKey: string, subscriptions: Subscriptions) {
        
        await new Promise((resolve, reject) => {

            this._ws = new WebSocket(
                url,
                {
                    perMessageDeflate: false,
                    headers: {
                        'Authorization': `Bearer ${apiKey}`
                    }
                }
            );
            
            this._ws.onerror = (err) => {
                this.emit('error', err)
                reject(err)
            }

            this._ws.onopen = () => {
                
                // solves tslint error
                if (this._ws === undefined) return;

                if(Subscriptions.CHAT & subscriptions)
                    this._ws.send(
                        JSON.stringify(
                            ["sub", "chat"]
                        )
                    )

                if(Subscriptions.ONLINE & subscriptions)
                    this._ws.send(
                        JSON.stringify(
                            ["sub", "online"]
                        )
                    )

                if(Subscriptions.PIXEL & subscriptions)
                    this._ws.send(
                        JSON.stringify(
                            ["sub", "pxl"]
                        )
                    )

                this.emit('open')
                resolve(this._ws)

            }

        }).then((ws: any) => {
            ws.onmessage = this.onPacket.bind(this)
        }).catch((error) => {
            throw new BotFailedToConnect(error)
        })

    }

    /**
     * Handle the packets received.
     * @param packet Packet data
     */
    protected onPacket({data: packet}: MessageEvent){

        try {

            if (typeof packet == "string")
                this.onTextPacket(packet);
            else
                this.onBinaryPacket(packet);

          } catch (err) {

            console.log(
                `An error occurred while parsing websocket message ${packet}`,
                err,
            );

        }

    }

    /**
     * Parse the received text packet and redirect to related function.
     * @param text received packet
     */
    protected onTextPacket(text: string) {
    
        let jsondata;

        try {
        
            jsondata = JSON.parse(text)
        
        } catch {
            
            console.error(`Failed to parse packet: ${text}`);
            return;

        }

        let type: string = jsondata[0]
        let rest = jsondata.splice(1);

        switch(type){

            case 'chans':
                let channels = receivedChannels(this, rest)
                for(let channel of channels) {
                    this.channels.set(
                        channel.getId(),
                        channel
                    )   
                }
                this.emit("channelsLoaded", channels)
                break

            case 'msg':
                let message = recievedMessage(this, rest)
                this.emit("chatMessage", message)
                break
                
        }

    }

    protected onBinaryPacket(buffer: any){

        if(buffer instanceof Buffer) buffer = toArrayBuffer(buffer)
        if (buffer.byteLength === 0) return;
        
        let data = new DataView(buffer);
        let opcode = data.getUint8(0);

        switch(opcode) {
            
            case Packets.ONLINE_COUNTER_OP:
                this.online = receivedOnline(this, data)
                break;
            
            case Packets.PIXEL_UPDATE_OP:
                receivedPixel(this, data)
                break;

        }
    
    }

    /**
     * Create a channel room to listen it.
     * @param name
     */
    _createUser(
        authorId: number, 
        authorName: string, 
        authorFlag: string
    ): User {
        let user = new User(authorId, authorName, authorFlag)
        this.users.push(user)
        
        return user

    }

    /**
     * Returns Channel object by the id.
     * @param name Channel name
     * @returns Channel
     */
    getChannelById(id: number): Channel | undefined {
        return this.channels.get(id);
    }

    /**
     * Returns Channel object by the name.
     * @param name Channel name
     * @returns Channel
     */
    getChannelByName(name: string): Channel | undefined {
        
        for(let channel of this.channels.values()){
            if(channel.getName() == name) return channel;
        }

        return undefined;
        
    }

    /**
     * Create a channel room to listen it.
     * @param name
     */
    getChannels(): Channel[] {
        return Array.from(this.channels.values());
    }

    /**
     * Returns user by its id
     * @param id User's ID
     * @returns
     */
    getUserById(id: number): User | undefined {
        return this.users[id]
    }

    /**
     * Create a channel room to listen it.
     * @param name
     */
    getUsers(): Channel[] {
        return Array.from(this.channels.values());
    }

    /**
     * Returns true if subscribed
     * @param subscription Subscription(s)
     */
    checkSubscribed(subscription: Subscriptions): boolean {
        return ((subscription & this.subscriptions) % 2) == 1
    }

    /**
     * Returns raw online data.
     * @returns 
     */
    getOnlineData(): OnlineData {
        return this.online;
    }

    /**
     * Returns the total online amount. If data is not loaded yet it will return 0
     * @returns
     */
    getTotalOnline(): number {
        return this.online.total;
    }

    /**
     * Set bot name
     * @param text New name
     */
    setBotName(newName: string) {
        this.botName = newName
    }

    /**
     * Returns bot name
     * @returns 
     */
    getBotName(): string {
        return this.botName
    }
    
    /**
     * Set chat id
     * @param id New ID
     */
    setChatId(newId: number) {
        this.botChatId = newId;
    }

    /**
     * Returns bot chat ID
     * @returns
     */
    getChatId(): number {
        return this.botChatId;
    }

    /**
     * Set bot's country
     * @param text New country
     */
    setBotCountry(newCountry: string) {
        this.botCountry = newCountry
    }

    /**
     * Returns bot's country
     * @returns 
     */
    getBotCountry(): string {
        return this.botCountry
    }

    /**
     * Broadcast a chat message
     * @param message 
     * @param name 
     * @param userId 
     * @param country 
     */
    broadcastMessage(
        message: string,
        name?: string, 
        userId?: number,
        country?: string
    ) {
        for(let channel of this.channels.values()){
            channel.sendMessage(message, name, userId, country)
        }
    }

}