import EventEmitter from "events"
import WebSocket, { MessageEvent } from "ws"

import { Channel } from "./channel"
import { Packets } from "./packets"
import { Subscriptions } from "./subscriptions"
import { User } from "./user"

import { promiseWithTimeout, toArrayBuffer } from "./utils"
import { BotFailedToConnect } from "./exceptions"
import { receivedChannels } from "./packets/channels"
import { OnlineData, receivedOnline } from "./packets/online"
import { recievedMessage } from "./packets/message"
import { receivedPixel } from "./packets/pixel"
import { createPingPacket } from "./packets/ping"

/**
 * Events:
 * @emits open
 * @emits error
 * @emits channelsLoaded
 * @emits onlineCounter
 * @emits pixelUpdate
 * @emits chatMessage
 * @emits heartbeat
 */
export class Bot extends EventEmitter {
    
    _ws: WebSocket | undefined
    _timeout: number = 5000

    private subscriptions: Subscriptions = 0
    private channels = new Map<number, Channel>()
    private users: Array<User> = []
    private online: OnlineData = { total: 0 }

    private botName: string
    private botChatId: number
    private botCountry: string

    private timeLastPing: number = 0
    private timeLastSent: number = 0
    private heartbeatTimer?: NodeJS.Timer
    
    constructor(botName: string="Bot", botChatId: number=0, botCountry: string="zz") {
        super()
        this.botName = botName
        this.botChatId = botChatId
        this.botCountry = botCountry
    }

    async connect(url: string, apiKey: string, subscriptions: Subscriptions = 0) {
        
        this.subscriptions = subscriptions
        
        await new Promise((resolve, reject) => {

            this._ws = new WebSocket(
                url,
                {
                    perMessageDeflate: false,
                    headers: {
                        'Authorization': `Bearer ${apiKey}`
                    }
                }
            )
            
            this._ws.onerror = (err) => {
                this.emit('error', err)
                reject(err)
            }

            this._ws.onopen = () => {
                this.onSocketReady()
                this.emit('open')
                resolve(this._ws)
            }

        }).then((ws: any) => {
            ws.onmessage = this.onPacket.bind(this)
        }).catch((error) => {
            throw new BotFailedToConnect(error)
        })

    }
    
    //*****************************//
    //        EVENT LISTENERS
    //*****************************//

    protected onSocketReady() {

        // solves tslint error
        if (this._ws?.readyState !== WebSocket.OPEN)
            return

        // Subscriptions

        if(this.checkSubscribed(Subscriptions.CHAT))
            this._ws.send(
                JSON.stringify(
                    ["sub", "chat"]
                )
            )

        if(this.checkSubscribed(Subscriptions.ONLINE))
            this._ws.send(
                JSON.stringify(
                    ["sub", "online"]
                )
            )

        if(this.checkSubscribed(Subscriptions.PIXEL))
            this._ws.send(
                JSON.stringify(
                    ["sub", "pxl"]
                )
            )
        
        // Health checks
        const now = Date.now()
        this.timeLastPing = now
        this.timeLastSent = now

        this.heartbeatTimer = setInterval(this.heartbeat.bind(this), 2000)
            
    }

    //*****************************//
    //           PRIVATE
    //*****************************//

    /**
     * Pping the server in every 5 seconds.
     * @returns Returns false if connection is terminated.
     */
    protected heartbeat(): boolean {

        if (this._ws?.readyState !== WebSocket.OPEN) {
            this.close("Websocket is closed somehow")
            return false
        }

        const now = Date.now()
        /*
        if (now - 30000 > this.timeLastPing) {
            this.close("Server is silent, websocket closed.")
            return false
        }
        */
        if (now - 5000 > this.timeLastSent) this._pingServer()
        return true

    }

    /**
     * Handle the packets received.
     * @param packet Packet data
     */
    protected onPacket({data: packet}: MessageEvent){

        this.timeLastPing = Date.now()

        try {

            if (typeof packet == "string")
                this.onTextPacket(packet)
            else
                this.onBinaryPacket(packet)

          } catch (err) {

            console.log(
                `An error occurred while parsing websocket message ${packet}`,
                err,
            )

        }

    }

    /**
     * Parse the received text packet and redirect to related function.
     * @param text received packet
     */
    protected onTextPacket(text: string) {
    
        let jsondata

        try {
        
            jsondata = JSON.parse(text)
        
        } catch {
            
            console.error(`Failed to parse packet: ${text}`)
            return

        }

        let type: string = jsondata[0]
        let rest = jsondata.splice(1)

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
            
            case 'flag':
                this.emit('flag', rest)
                break
                
        }

    }

    protected onBinaryPacket(buffer: any){

        if(buffer instanceof Buffer) buffer = toArrayBuffer(buffer)
        if (buffer.byteLength === 0) return
        
        let data = new DataView(buffer)
        let opcode = data.getUint8(0)

        switch(opcode) {
            
            case Packets.ONLINE_COUNTER_OP:
                this.online = receivedOnline(this, data)
                break
            
            case Packets.PIXEL_UPDATE_OP:
                receivedPixel(this, data)
                break

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
     * Ping server and return true if packet successfully sent.
     * @returns boolean
     */
    _pingServer(): boolean {
        // solves tslint error
        if (this._ws?.readyState !== WebSocket.OPEN)
            return false
        // make sure we send something at least all 25s
        this._ws.send(createPingPacket())
        this.timeLastSent = Date.now()
        this.emit("heartbeat")
        return true
    }

    
    //*****************************//
    //             API
    //*****************************//

    /**
     * Returns flag from the ID 
     * @param userId 
     * @returns
     */
    fetchFlag(userId: number): Promise<[string, string]> {
        
        return promiseWithTimeout(5000, new Promise((res) => {
            
            this._ws?.send(
                JSON.stringify(
                    ["getflag", userId]
                )
            )

            const flagListener = (data: any) => {
                if(data[0] === userId) res(data)
                // listen once more
                this.once("flag", flagListener)
            } 
    
            this.once("flag", flagListener)

        }))

    }

    /**
     * Returns Channel object by the id.
     * @param name Channel name
     * @returns Channel
     */
    getChannelById(id: number): Channel | undefined {
        return this.channels.get(id)
    }

    /**
     * Returns Channel object by the name.
     * @param name Channel name
     * @returns Channel
     */
    getChannelByName(name: string): Channel | undefined {
        
        for(let channel of this.channels.values()){
            if(channel.getName() == name) return channel
        }

        return undefined
        
    }

    /**
     * Create a channel room to listen it.
     * @param name
     */
    getChannels(): Channel[] {
        return Array.from(this.channels.values())
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
        return Array.from(this.channels.values())
    }

    /**
     * Returns true if subscribed
     * @param subscription Subscription(s)
     */
    checkSubscribed(subscription: Subscriptions): number {
        return this.subscriptions & subscription
    }

    /**
     * Returns raw online data.
     * @returns 
     */
    getOnlineData(): OnlineData {
        return this.online
    }

    /**
     * Returns the total online amount. If data is not loaded yet it will return 0
     * @returns
     */
    getTotalOnline(): number {
        return this.online.total
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
        this.botChatId = newId
    }

    /**
     * Returns bot chat ID
     * @returns
     */
    getChatId(): number {
        return this.botChatId
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

    /**
     * Terminate connection
     */
    close(message: string) {
        clearInterval(this.heartbeatTimer)
        this._ws?.close()
        this.emit("close", message)
    }

}