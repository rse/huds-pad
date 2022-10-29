/*
**  HUDS -- Head-Up-Display Server (HUDS)
**  Copyright (c) 2022 Dr. Ralf S. Engelschall <rse@engelschall.com>
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

/*  HUDS communication  */
window.HUDS = class HUDS {
    constructor () {
        this.channel  = ""
        this.client   = null
        this.clientId = (new UUID(1)).format()
    }

    /*  load settings  */
    async load (settingsFile) {
        /*  load settings  */
        const data = await fetch(settingsFile, {
            method: "GET",
            credentials: "same-origin"
        }).then((response) => response.text())
        const settings = jsyaml.load(data)
        this.url = settings.mqtt.url
        this.id  = settings.huds.id

        /*  optionally automatically determine MQTT broker URL  */
        if (this.url === "auto") {
            const uri = URI(window.location.href)
            if (uri.protocol() === "http")
                uri.protocol("ws")
            else if (uri.protocol() === "https")
                uri.protocol("wss")
            uri.pathname("/mqtt/")
            uri.search("")
            uri.hash("")
            this.url = uri.toString()
        }
    }

    /*  connect to MQTT broker  */
    connect (channel, token1, token2) {
        /*  connect to MQTT broker  */
        this.channel = channel
        this.client = mqtt.connect(this.url, {
            will: {
                /*  use an MQTT "last will" message to end attendance (implicitly)  */
                topic:   `stream/${this.channel}/sender`,
                payload: this.createMessage("attendance", { event: "end" }),
                qos:     2,
                retain:  false
            },
            username:        token1,
            password:        token2,
            clientId:        this.clientId,
            clean:           true,
            resubscribe:     true,
            keepalive:       60,        /* 60s */
            reconnectPeriod: 4  * 1000, /*  4s */
            connectTimeout:  30 * 1000  /* 30s */
        })
        this.client.once("connect", (connack) => {
            if (!connack.sessionPresent) {
                this.client.subscribe([
                    `stream/${this.channel}/receiver`,
                    "$SYS/broker/clients/connected"
                ], () => {})
            }
        })
        return this.client
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
    sendMessage (text) {
        return this.sendMessageToBroker("message", {
            title: "Attendee Message",
            text
        })
    }
    sendFeedback (type) {
        return this.sendMessageToBroker("feedback", {
            type
        })
    }
    sendFeeling (mood, challenge) {
        return this.sendMessageToBroker("feeling", {
            challenge,
            mood
        })
    }

    /*  send an arbitrary message to the MQTT broker  */
    sendMessageToBroker (event, data) {
        return new Promise((resolve, reject) => {
            if (!this.client.connected)
                reject(new Error("Not connected to MQTT broker"))
            const msg = this.createMessage(event, data)
            this.client.publish(`stream/${this.channel}/sender`, msg, { qos: 2, retain: false }, (err) => {
                if (err) reject(err)
                else     resolve()
            })
        })
    }

    /*  create an arbitrary MQTT message for HUDS  */
    createMessage (event, data = {}) {
        data.client = this.clientId
        return JSON.stringify({
            id:    this.id,
            event,
            data
        })
    }

    /*  disconnect from MQTT broker  */
    disconnect () {
        return new Promise((resolve, reject) => {
            if (!this.client.connected)
                reject(new Error("still not connected"))
            try {
                this.client.end()
                this.client = { connected: false }
                resolve()
            }
            catch (error) {
                reject(error)
            }
        })
    }
}

