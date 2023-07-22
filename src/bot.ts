import EventEmitter from "events"
import WebSocket, { MessageEvent } from "ws"
import { BotFailedToConnect, BotNotConnected } from "./exceptions"
import { promiseWithTimeout, toArrayBuffer } from "./utils"
import { receiveChannelsLoaded } from "./packets/channelsLoaded"
import { receiveTextMessage } from "./packets/textMessage"
import { receiveOnlineCounter } from "./packets/onlineCounter"
import Packets from "./packets"
import Channel from "./channel"
import { User } from "./user"
import Subscriptions from "./subscriptions"

/**
 * Events:
 * @emits openl.
 * @emits error
 * @emits channelsLoaded
 * @emits userCountUpdated
 * @emits chatMessage
 */
class Bot extends EventEmitter {
    
    ws: WebSocket | undefined
    channels = new Map<number, Channel>();
    users: Array<User> = []
    timeout = 5000

    async connect(url: string, apiKey: string, subscriptions: Subscriptions) {
        
        await new Promise((resolve, reject) => {

            this.ws = new WebSocket(
                url,
                {
                    perMessageDeflate: false,
                    headers: {
                        'Authorization': `Bearer ${apiKey}`
                    }
                }
            );
            
            this.ws.onerror = this.onError.bind(this)
            this.ws.onopen = this.onOpen.bind(this)

            this.ws.on('error', (err) => reject(err))
            this.ws.on('open', () => resolve(this.ws))

        }).then((ws: any) => {
            ws.onmessage = this.onPacket.bind(this)
        }).catch((error) => {
            throw new BotFailedToConnect(error)
        })

    }
    
    /**
     * Called when bot successfully connected.
     * @emits open
     */
    private onOpen(){
        this.emit('open')
    }

    /**
     * Called when an error occured on WebSocket
     * @param err 
     * @emits error
     */
    private onError(err: any){
        this.emit('error', err)
    }

    /**
     * Handle the packets received.
     * @param packet Packet data
     */
    private onPacket({data: packet}: MessageEvent){

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
    private onTextPacket(text: string) {
    
        let jsondata;

        try {
            jsondata = JSON.parse(text)
        }catch {
            console.error(`Failed to parse packet: ${text}`);
            return;
        }

        const type: string = jsondata[0]
        const rest = jsondata.splice(1);

        switch(type){
            case 'chans':
                receiveChannelsLoaded(this, rest)
                break
            case 'msg':
                receiveTextMessage(this, rest)
                break
        }

    }

    private onBinaryPacket(buffer: any){

        if(buffer instanceof Buffer) buffer = toArrayBuffer(buffer)
        if (buffer.byteLength === 0) return;
        
        const data = new DataView(buffer);
        const opcode = data.getUint8(0);

        switch(opcode) {
            case Packets.ONLINE_COUNTER_OP:
                receiveOnlineCounter(this, data);
                break;
        }
    
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
     * Create a channel room to listen it.
     * @param name
     */
    createChannel(id: number, name: string) {
        const channel = new Channel(id, name)
        this.channels.set(id, channel)
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
    createUser(
        authorId: number, 
        authorName: string, 
        authorFlag: string
    ): User {
        const user = new User(authorId, authorName, authorFlag)
        this.users.push(user)
        
        return user

    }

    /**
     * Create a channel room to listen it.
     * @param name
     */
    getUsers(): Channel[] {
        return Array.from(this.channels.values());
    }

    /**
     * After subscribed to channels, bot will be listening messages.
     */
    public async subscribeChannels() {
        
        if(this.ws === undefined || this.ws.readyState != WebSocket.OPEN) 
            throw new BotNotConnected();

        this.ws.send(
            JSON.stringify(
                ["sub", "chat"]
            )
        )

        return promiseWithTimeout(this.timeout, new Promise((resolve, reject) => {

            const channelsLoaded = (channels: any) =>
                resolve(channels)

            this.once('channelsLoaded', channelsLoaded)
            
        }));

    }

    /**
     * After subscribed to user counter, bot will be receiving online count every 10s.
     */
    public async subscribeUserCounter() {

        if(this.ws === undefined || this.ws.readyState != WebSocket.OPEN) 
            throw new BotNotConnected();
        
        this.ws.send(
            JSON.stringify(
                ["sub", "online"]
            )
        )

        return promiseWithTimeout(15000, new Promise((resolve, reject) => {
            
            const userCountReceived = (channels: any) =>
                resolve(channels)
            
            this.once('userCountUpdated', userCountReceived)
            
        }));

    }

}

export default Bot;