<!--
**
**  HUDS - Head-Up-Display Server (HUDS)
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
**
-->

<template>
    <div class="app-login">
        <h2 style="grid-area: label">ACCESS TOKEN</h2>
        <input v-model="accessToken"
            style="grid-area: input"
            type="text"
            placeholder="Enter your Access Token..."
            v-tippy="{ placement: 'top', content: 'Access Token for connecting<br/>to the live session.', trigger: $status.value.tippyTrigger }"
            v-on:keyup.enter="connect"
            @input="exportHash">
        <button style="grid-area: connect"
            v-bind:disabled="!accessToken || connectionRunning || reconnecting"
            @click="connect"
            v-tippy="{ placement: 'bottom', content: 'Connect to the<br/>live session.', trigger: $status.value.tippyTrigger }">
            Connect <i class="icon fas fa-arrow-alt-circle-right"></i>
        </button>
        <div style="grid-area: banner" class="banner">
            <img src="app-banner.svg" alt="Your live feedback channel!">
        </div>
    </div>
</template>

<style lang="less">
.app-login {
    display: grid;
    grid-template: "label" "input" "connect" "banner";
    grid-gap: 2px;
    input {
        resize: none;
        font-size: 16pt;
        border: 0;
        background-color: var(--color-std-bg-2);
        border-top: 1px solid var(--color-std-bg-1);
        border-left: 1px solid var(--color-std-bg-1);
        border-right: 1px solid var(--color-std-bg-5);
        border-bottom: 1px solid var(--color-std-bg-5);
        padding: 8px 12px;
        border-radius: 4px;
        &::placeholder {
            color: var(--color-std-fg-1);
            font-size: 10pt;
            font-weight: 300;
        }
        .hoverable &:hover,
        &:focus {
            border: 0;
            outline: none;
            color: var(--color-acc-fg-5);
            background-color: var(--color-acc-bg-3);
            border-top: 1px solid var(--color-acc-bg-1);
            border-left: 1px solid var(--color-acc-bg-1);
            border-right: 1px solid var(--color-acc-bg-5);
            border-bottom: 1px solid var(--color-acc-bg-5);
            &::placeholder {
                color: var(--color-acc-fg-1);
            }
        }
    }
    button {
        cursor: pointer;
        color: var(--color-std-fg-3);
        background-color: var(--color-std-bg-4);
        border-top: 1px solid var(--color-std-bg-5);
        border-left: 1px solid var(--color-std-bg-5);
        border-right: 1px solid var(--color-std-bg-1);
        border-bottom: 1px solid var(--color-std-bg-1);
        font-size: 14pt;
        line-height: 18pt;
        text-align: center;
        margin-top: 2px;
        padding: 10px 0;
        border-radius: 4px;
        .hoverable &:hover:not(:disabled) {
            color: var(--color-acc-fg-3);
            background-color: var(--color-acc-bg-4);
            border-top: 1px solid var(--color-acc-bg-5);
            border-left: 1px solid var(--color-acc-bg-5);
            border-right: 1px solid var(--color-acc-bg-1);
            border-bottom: 1px solid var(--color-acc-bg-1);
        }
        &:disabled {
            cursor: not-allowed;
            color: var(--color-std-fg-1);
            background-color: var(--color-std-bg-4);
            border-top: 1px solid var(--color-std-bg-5);
            border-left: 1px solid var(--color-std-bg-5);
            border-right: 1px solid var(--color-std-bg-1);
            border-bottom: 1px solid var(--color-std-bg-1);
        }
        .icon {
            margin-left: 8px;
        }
    }
    .banner {
        width: auto;
        text-align: center;
        img {
            margin-top: 20px;
            width: 80%;
        }
    }
}
</style>

<script>
let suppressHashChangeAction = false
let autoconnecttimer = null
let attendanceRefreshInterval = null

module.exports = {
    name: "app-login",
    data: () => ({
        accessToken: "",
        connectionRunning: false,
        reconnecting: false
    }),
    created () {
        window.addEventListener("hashchange", async () => {
            if (!suppressHashChangeAction)
                this.importHash()
        }, false)
        this.importHash()
    },
    methods: {
        importHash () {
            if (this.accessToken !== window.location.hash) {
                this.accessToken = this.accessToken.trim()
                this.accessToken = window.location.hash.substring(1)
                this.autoconnect()
            }
        },
        async exportHash () {
            this.$info.clearError()
            if (this.isReconnecting()) {
                await this.disconnect().catch(() => {})
                this.reconnecting = false
            }
            if (this.accessToken !== window.location.hash) {
                this.accessToken = this.accessToken.trim()
                suppressHashChangeAction = true
                window.location.hash = "#" + this.accessToken
                setTimeout(() => {
                    suppressHashChangeAction = false
                }, 100)
            }
        },
        async autoconnect () {
            if (autoconnecttimer !== null)
                clearTimeout(autoconnecttimer)
            await this.disconnect().catch(() => {})
            autoconnecttimer = setTimeout(async () => {
                this.reconnecting = false
                this.connect()
            }, 500)
        },
        connect () {
            /*  sanity check situation  */
            if (this.accessToken === "" || this.connectionRunning || this.huds.client?.reconnecting)
                return

            /*  parse access token  */
            const match = this.accessToken.match(/^(.+?)-([^-]+)-([^-]+)$/)
            if (match === null) {
                this.$info.setMessage("Status: Failed to connect")
                this.$info.setError("Error: Invalid access token format")
                return
            }
            const [ , channel, token1, token2 ] = match

            /*  connect to HUDS MQTT broker  */
            this.connectionRunning = true
            const client = this.huds.connect(channel, token1, token2)

            /*  react on MQTT broker status  */
            client.on("connect", async () => {
                const isValidStream = await this.checkValidStream().catch(() => false)
                if (!isValidStream) {
                    try { client.end() } catch (ev) { } /* eslint brace-style: off */
                    this.$info.setMessage("Status: Connection Error")
                    this.$info.setError("Error: Connection Refused: Not authorized")
                    return
                }
                this.$info.setMessage("Status: Connected")
                this.$info.clearError()
                this.$status.setConnectionEstablished()
                await this.huds.beginAttendance()
                await this.huds.sendFeeling(3, 3)
                if (!attendanceRefreshInterval)
                    attendanceRefreshInterval = setInterval(() => { this.huds.refreshAttendance() }, 10 * 60 * 1000)
                this.reconnecting = false
            })
            client.on("close", () => {
                this.connectionRunning = false
                if (!this.isReconnecting())
                    this.$info.setMessage("Status: Disconnected")
                this.$status.setConnectionClosed()
                if (attendanceRefreshInterval) {
                    clearInterval(attendanceRefreshInterval)
                    attendanceRefreshInterval = null
                }
                if (this.$status.feelingRefreshInterval) {
                    clearInterval(this.$status.feelingRefreshInterval)
                    this.$status.feelingRefreshInterval = null
                }
            })
            client.on("disconnect", () => {
                this.$info.setMessage("Status: Disconnected")
                this.$status.setConnectionClosed()
            })
            client.on("offline", () => {
                this.$info.setMessage("Status: Offline")
            })
            client.on("error", (err) => {
                this.$info.setMessage("Status: Communication Error")
                this.$info.setError(err.toString())
                if (err.toString().match(/Not authorized/i))
                    try { client.end() } catch (ev) { } /* eslint brace-style: off */
            })
            client.on("reconnect", () => {
                this.$info.setMessage("Status: Reconnecting")
                this.reconnecting = true
            })

            /*  react on MQTT messages  */
            client.on("message", (topic, message) => {
                if (topic === "$SYS/broker/clients/connected") {
                    let clients = parseInt(message.toString())
                    if (this.$status.value.logTraffic)
                        console.log(`HUDS: RECV: topic=${topic} message=${clients}`)
                    if (clients > 1)
                        clients-- /* there will be always US plus the HUDS, so drop the HUDS */
                    this.$info.setClients(clients)
                }
                else if (topic === `stream/${this.huds.channel}/receiver`) {
                    try {
                        message = JSON.parse(message.toString())
                    }
                    catch (ex) {
                        message = null
                    }
                    if (this.$status.value.logTraffic)
                        console.log(`HUDS: RECV: topic=${topic} message=${JSON.stringify(message)}`)
                    if (typeof message?.event !== "string")
                        return
                    if (message.event === "voting-begin") {
                        this.$status.disabledMessaging(false)
                        this.$status.disabledVoting(true)
                        this.$status.setVotingType("propose")
                        this.$status.clearVoting()
                    }
                    else if (message.event === "voting-end") {
                        this.$status.disabledMessaging(false)
                        this.$status.disabledVoting(true)
                        this.$status.setVotingType("propose")
                        this.$status.clearVoting()
                    }
                    else if (message.event === "voting-type") {
                        if (typeof message.data?.type === "string") {
                            if (message.data.type === "propose") {
                                this.$status.disabledMessaging(false)
                                this.$status.disabledVoting(true)
                            }
                            else {
                                this.$status.disabledMessaging(true)
                                this.$status.disabledVoting(false)
                            }
                            this.$status.setVotingType(message.data.type)
                            this.$status.clearVoting()
                        }
                    }
                }
            })

            /*  track MQTT communication  */
            let timer = null
            client.on("packetsend", (packet) => {
                this.$status.setActiveTraffic(true)
                if (timer !== null)
                    clearTimeout(timer)
                timer = setTimeout(() => {
                    timer = null
                    this.$status.setActiveTraffic(false)
                }, 250)
                if (this.$status.value.logTraffic)
                    console.log(`MQTT: SEND: packet=${JSON.stringify(packet)}`)
            })
            client.on("packetreceive", (packet) => {
                this.$status.setActiveTraffic(true)
                if (timer !== null)
                    clearTimeout(timer)
                timer = setTimeout(() => {
                    timer = null
                    this.$status.setActiveTraffic(false)
                }, 250)
                if (this.$status.value.logTraffic)
                    console.log(`MQTT: RECV: packet=${JSON.stringify(packet)}`)
            })
        },
        async disconnect () {
            this.$info.setMessage("Status: Disconnecting")
            this.$info.clearError()
            await this.huds.endAttendance().catch(() => {})
            return this.huds.disconnect()
        },
        checkValidStream () {
            /*  Notice: MQTT provides no way to check for the existance of a topic/channel, so
                the only way to check if the topic/channel "stream/<id>/receiver" is an existing one,
                is to subscribe to a sub-topic, send a dummy message and check if one can receive
                the dummy message back again.  */
            return new Promise((resolve, reject) => {
                const timer = setTimeout(() => {
                    reject(new Error("timeout on loopback communication"))
                }, 500)
                const channel = `stream/${this.huds.channel}/receiver/${this.huds.clientId}/loopback`
                const msg = "<ping>"
                this.huds.client.subscribe(channel, (err, granted) => {
                    if (err) {
                        clearTimeout(timer)
                        reject(err)
                    }
                    else {
                        const cb = (topic, message) => {
                            if (topic === channel) {
                                clearTimeout(timer)
                                this.huds.client.unsubscribe(channel)
                                this.huds.client.removeListener("message", cb)
                                if (message.toString() === msg)
                                    resolve(true)
                                else
                                    reject(new Error("invalid message received"))
                            }
                        }
                        this.huds.client.on("message", cb)
                        this.huds.client.publish(channel, msg, { qos: 2, retain: false }, (err) => {
                            if (err) {
                                clearTimeout(timer)
                                this.huds.client.unsubscribe(channel)
                                this.huds.client.removeListener("message", cb)
                                reject(err)
                            }
                        })
                    }
                })
            })
        },
        isReconnecting () {
            return this.huds.client ? this.huds.client.reconnecting : false
        }
    }
}
</script>

