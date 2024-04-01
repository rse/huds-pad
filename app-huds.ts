/*
**  HUDS -- Head-Up-Display Server (HUDS)
**  Copyright (c) 2022-2024 Dr. Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import MQTT         from "mqtt"
import MQTTPacket   from "mqtt-packet"
import UUID         from "pure-uuid"
import EventEmitter from "eventemitter2"

/*  HUDS communication  */
export default class HUDS extends EventEmitter {
    private channel   = ""
    private client    = { connected: false } as MQTT.MqttClient
    private clientId  = (new UUID(1)).format()
    private api       = ""
    private url       = ""
    private peer      = ""

    /*  setup object  */
    constructor (private settings: any = {}) {
        super()

        /*  take over optional settings  */
        this.api  = settings.api
        this.url  = settings.url
        this.peer = settings.peer
    }

    /*  connect to MQTT broker  */
    async connect (channel: string, token1: string, token2: string) {
        /*  connect to MQTT broker  */
        this.channel = channel
        this.client = MQTT.connect(this.url, {
            protocolId: "MQTT",
            protocolVersion: 5,
            will: {
                /*  use an MQTT "last will" message to end attendance (implicitly)  */
                topic:   `stream/${this.channel}/sender`,
                payload: Buffer.from(this.createMessage("attendance", { event: "end" })),
                qos:     2,
                retain:  false
            },
            username:        token1,
            password:        token2,
            clientId:        this.clientId,
            clean:           true,
            resubscribe:     true,
            keepalive:       60,        /* 60s */
            reconnectPeriod: 2  * 1000, /*  2s */
            connectTimeout:  30 * 1000  /* 30s */
        })
        this.client.once("connect", (connack: MQTT.IConnackPacket) => {
            if (!connack.sessionPresent) {
                this.client.subscribe([
                    `stream/${this.channel}/receiver`,
                    "$SYS/broker/clients/connected"
                ], () => {})
            }
        })
        this.client.on("error", (error: Error) => {
            this.emit("error", error)
        })
        this.client.on("connect", (packet: MQTT.IConnackPacket) => {
            this.emit("connect", packet)
        })
        this.client.on("packetsend", (packet: MQTT.Packet) => {
            this.emit("packet-send", JSON.stringify(packet))
        })
        this.client.on("packetreceive", (packet: MQTT.Packet) => {
            this.emit("packet-receive", JSON.stringify(packet))
        })
        this.client.on("message", (topic: string, payload: Buffer, packet: MQTT.IPublishPacket) => {
            if (topic === "$SYS/broker/clients/connected") {
                const clients = parseInt(payload.toString())
                this.emit("clients", clients)
            }
            else if (topic === `stream/${this.channel}/receiver`) {
                let message
                try {
                    message = JSON.parse(payload.toString())
                }
                catch (ex) {
                    message = null
                }
                this.emit("message", message)
            }
        })
        this.client.on("close", () => {
            this.emit("close")
        })
        this.client.on("end", () => {
            this.emit("end")
        })
        this.client.on("reconnect", () => {
            this.emit("reconnect")
        })
        this.client.on("offline", () => {
            this.emit("offline")
        })
        this.client.on("outgoingEmpty", () => {
            this.emit("outgoingEmpty")
        })
        this.client.on("disconnect", (packet: MQTT.IDisconnectPacket) => {
            this.emit("disconnect", packet)
        })
    }

    /*  check we are connected  */
    isConnected () {
        return this.client?.connected ?? false
    }

    /*  check whether connection is valid  */
    isValidConnection () {
        /*  Notice: MQTT provides no way to check for the existance of a topic/channel, so
            the only way to check if the topic/channel "stream/<id>/receiver" is an existing one,
            is to subscribe to a sub-topic, send a dummy message and check if one can receive
            the dummy message back again.  */
        return new Promise((resolve, reject) => {
            const channel = `stream/${this.channel}/receiver/${this.clientId}/loopback`
            const msg = "<ping>"
            let cleanup: () => void = () => {}
            const onMessage = (topic: string, message: any) => {
                if (topic !== channel)
                    return
                cleanup()
                if (message.toString() === msg)
                    resolve(true)
                else
                    reject(new Error("invalid message received"))
            }
            let subscribed = false
            let listening  = false
            let timer: ReturnType<typeof setTimeout> | null = null
            cleanup = () => {
                if (subscribed) {
                    this.client.unsubscribe(channel)
                    subscribed = false
                }
                if (listening) {
                    this.client.removeListener("message", onMessage)
                    listening = false
                }
                if (timer !== null) {
                    clearTimeout(timer)
                    timer = null
                }
            }
            timer = setTimeout(() => {
                cleanup()
                reject(new Error("timeout on loopback communication"))
            }, 500)
            this.client.subscribe(channel, (err, granted) => {
                if (err) {
                    cleanup()
                    reject(err)
                }
                else {
                    subscribed = true
                    this.client.on("message", onMessage)
                    listening = true
                    this.client.publish(channel, msg, { qos: 2, retain: false }, (err) => {
                        if (err) {
                            cleanup()
                            reject(err)
                        }
                    })
                }
            })
        })
    }

    /*  check whether MQTT client is currently reconnecting  */
    isReconnecting () {
        return (this.client?.reconnecting ?? false)
    }

    /*  begin/end attendance (explicitly)  */
    beginAttendance () {
        return this.sendMessageToBroker("attendance", {
            event: "begin",
            data: {
                privacy: "public"
            }
        })
    }
    refreshAttendance () {
        return this.sendMessageToBroker("attendance", {
            event: "refresh"
        })
    }
    endAttendance () {
        return this.sendMessageToBroker("attendance", {
            event: "end"
        })
    }

    /*  send a message/feedback/feeling  */
    sendMessage (text: string, title = "Anonymous Attendee") {
        return this.sendMessageToBroker("message", {
            title,
            text
        })
    }
    sendFeedback (type: string) {
        return this.sendMessageToBroker("feedback", {
            type
        })
    }
    sendFeeling (mood: number, challenge: number) {
        return this.sendMessageToBroker("feeling", {
            challenge,
            mood
        })
    }

    /*  send an arbitrary message to the MQTT broker  */
    sendMessageToBroker (event: string, data: any = {}) {
        return new Promise((resolve, reject) => {
            if (!this.client.connected)
                reject(new Error("Not connected to MQTT broker"))
            const msg = this.createMessage(event, data)
            this.client.publish(`stream/${this.channel}/sender`, msg, { qos: 2, retain: false }, (err: Error | undefined) => {
                if (err) reject(err)
                else     resolve(true)
            })
        })
    }

    /*  create an arbitrary MQTT message for HUDS  */
    private createMessage (event: string, data: any = {}) {
        data.client = this.clientId
        return JSON.stringify({
            id:    this.peer,
            event,
            data
        })
    }

    /*  disconnect from MQTT broker  */
    disconnect () {
        return new Promise((resolve, reject) => {
            if (!this.client?.connected)
                reject(new Error("still not connected"))
            try {
                this.client?.end()
                this.client = <MQTT.MqttClient>{ connected: false }
                resolve(true)
            }
            catch (error) {
                reject(error)
            }
        })
    }
}

