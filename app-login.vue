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
            v-tippy="{ placement: 'top', content: 'Access Token for connecting<br/>to the live session.', trigger: $global.value.tippyTrigger }"
            v-on:keyup.enter="connect"
            @input="exportHash">
        <button style="grid-area: connect"
            v-bind:disabled="!accessToken || connectionRunning || reconnecting"
            @click="connect"
            v-tippy="{ placement: 'bottom', content: 'Connect to the<br/>live session.', trigger: $global.value.tippyTrigger }">
            Connect <i class="icon fas fa-arrow-alt-circle-right"></i>
        </button>
        <div style="grid-area: banner" class="banner">
            <img src="./app-banner.svg" alt="Your live feedback channel!">
        </div>
    </div>
</template>

<style lang="stylus">
.app-login
    display: grid
    grid-template: "label" "input" "connect" "banner"
    grid-gap: 2px
    input
        resize: none
        font-size: 16pt
        border: 0
        background-color: var(--color-std-bg-2)
        border-top: 1px solid var(--color-std-bg-1)
        border-left: 1px solid var(--color-std-bg-1)
        border-right: 1px solid var(--color-std-bg-5)
        border-bottom: 1px solid var(--color-std-bg-5)
        padding: 8px 12px
        border-radius: 4px
        &::placeholder
            color: var(--color-std-fg-1)
            font-size: 10pt
            font-weight: 300
        .hoverable &:hover,
        &:focus
            border: 0
            outline: none
            color: var(--color-acc-fg-5)
            background-color: var(--color-acc-bg-3)
            border-top: 1px solid var(--color-acc-bg-1)
            border-left: 1px solid var(--color-acc-bg-1)
            border-right: 1px solid var(--color-acc-bg-5)
            border-bottom: 1px solid var(--color-acc-bg-5)
            &::placeholder
                color: var(--color-acc-fg-1)
    button
        cursor: pointer
        color: var(--color-std-fg-3)
        background-color: var(--color-std-bg-4)
        border-top: 1px solid var(--color-std-bg-5)
        border-left: 1px solid var(--color-std-bg-5)
        border-right: 1px solid var(--color-std-bg-1)
        border-bottom: 1px solid var(--color-std-bg-1)
        font-size: 14pt
        line-height: 18pt
        text-align: center
        margin-top: 2px
        padding: 10px 0
        border-radius: 4px
        .hoverable &:hover:not(:disabled)
            color: var(--color-acc-fg-3)
            background-color: var(--color-acc-bg-4)
            border-top: 1px solid var(--color-acc-bg-5)
            border-left: 1px solid var(--color-acc-bg-5)
            border-right: 1px solid var(--color-acc-bg-1)
            border-bottom: 1px solid var(--color-acc-bg-1)
        &:disabled
            cursor: not-allowed
            color: var(--color-std-fg-1)
            background-color: var(--color-std-bg-4)
            border-top: 1px solid var(--color-std-bg-5)
            border-left: 1px solid var(--color-std-bg-5)
            border-right: 1px solid var(--color-std-bg-1)
            border-bottom: 1px solid var(--color-std-bg-1)
        .icon
            margin-left: 8px
    .banner
        width: auto
        text-align: center
        img
            margin-top: 20px
            width: 80%
</style>

<script setup lang="ts">
import { defineComponent } from "vue"
</script>

<script lang="ts">
let suppressHashChangeAction = false
let autoconnecttimer: ReturnType<typeof setTimeout> | null = null
let attendanceRefreshInterval: ReturnType<typeof setInterval> | null = null

export default defineComponent({
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
                this.accessToken = window.location.hash.substring(1).trim()
                this.autoconnect()
            }
        },
        async exportHash () {
            this.$global.clearError()
            if (this.huds.isReconnecting()) {
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
            if (this.accessToken === "" || this.connectionRunning || this.huds.isReconnecting())
                return

            /*  parse access token  */
            const match = this.accessToken.match(/^(.+?)-([^-]+)-([^-]+)$/)
            if (match === null) {
                this.$global.setMessage("Status: Failed to connect")
                this.$global.setError("Error: Invalid access token format")
                return
            }
            const [ , channel, token1, token2 ] = match

            /*  connect to HUDS MQTT broker  */
            this.connectionRunning = true
            const client = this.huds.connect(channel, token1, token2)

            /*  react on MQTT broker status  */
            client.on("connect", async () => {
                const isValidConnection = await this.huds.isValidConnection().catch(() => false)
                if (!isValidConnection) {
                    try { client.end() } catch (ev) { } /* eslint brace-style: off */
                    this.$global.setMessage("Status: Connection Error")
                    this.$global.setError("Error: Connection Refused: Not authorized")
                    return
                }
                this.$global.setMessage("Status: Connected")
                this.$global.clearError()
                this.$global.setConnectionEstablished()
                await this.huds.beginAttendance()
                await this.huds.sendFeeling(3, 3)
                if (!attendanceRefreshInterval)
                    attendanceRefreshInterval = setInterval(() => { this.huds.refreshAttendance() }, 10 * 60 * 1000)
                this.reconnecting = false
            })
            client.on("close", () => {
                this.connectionRunning = false
                if (!this.huds.isReconnecting())
                    this.$global.setMessage("Status: Disconnected")
                this.$global.setConnectionClosed()
                if (attendanceRefreshInterval) {
                    clearInterval(attendanceRefreshInterval)
                    attendanceRefreshInterval = null
                }
                if (this.$global.value.feelingRefreshInterval) {
                    clearInterval(this.$global.value.feelingRefreshInterval)
                    this.$global.value.feelingRefreshInterval = null
                }
            })
            client.on("disconnect", () => {
                this.$global.setMessage("Status: Disconnected")
                this.$global.setConnectionClosed()
            })
            client.on("offline", () => {
                this.$global.setMessage("Status: Offline")
            })
            client.on("error", (err) => {
                this.$global.setMessage("Status: Communication Error")
                this.$global.setError(err.toString())
                if (err.toString().match(/Not authorized/i))
                    try { client.end() } catch (ev) { } /* eslint brace-style: off */
            })
            client.on("reconnect", () => {
                this.$global.setMessage("Status: Reconnecting")
                this.reconnecting = true
            })

            /*  react on MQTT messages  */
            client.on("message", (topic: string, message: any) => {
                if (topic === "$SYS/broker/clients/connected") {
                    let clients = parseInt(message.toString())
                    if (this.$global.value.logTraffic)
                        console.log(`HUDS: RECV: topic=${topic} message=${clients}`)
                    if (clients > 1)
                        clients-- /* there will be always US plus the HUDS, so drop the HUDS */
                    this.$global.setClients(clients)
                }
                else if (topic === `stream/${this.huds.channel}/receiver`) {
                    try {
                        message = JSON.parse(message.toString())
                    }
                    catch (ex) {
                        message = null
                    }
                    if (this.$global.value.logTraffic)
                        console.log(`HUDS: RECV: topic=${topic} message=${JSON.stringify(message)}`)
                    if (typeof message?.event !== "string")
                        return
                    if (message.event === "voting-begin") {
                        this.$global.disabledMessaging(false)
                        this.$global.disabledVoting(true)
                        this.$global.setVotingType("propose")
                        this.$global.clearVoting()
                    }
                    else if (message.event === "voting-end") {
                        this.$global.disabledMessaging(false)
                        this.$global.disabledVoting(true)
                        this.$global.setVotingType("propose")
                        this.$global.clearVoting()
                    }
                    else if (message.event === "voting-type") {
                        if (typeof message.data?.type === "string") {
                            if (message.data.type === "propose") {
                                this.$global.disabledMessaging(false)
                                this.$global.disabledVoting(true)
                            }
                            else {
                                this.$global.disabledMessaging(true)
                                this.$global.disabledVoting(false)
                            }
                            this.$global.setVotingType(message.data.type)
                            this.$global.clearVoting()
                        }
                    }
                }
            })

            /*  track MQTT communication  */
            let timer: ReturnType<typeof setTimeout> | null = null
            client.on("packetsend", (packet: any) => {
                this.$global.setActiveTraffic(true)
                if (timer !== null)
                    clearTimeout(timer)
                timer = setTimeout(() => {
                    timer = null
                    this.$global.setActiveTraffic(false)
                }, 250)
                if (this.$global.value.logTraffic)
                    console.log(`MQTT: SEND: packet=${JSON.stringify(packet)}`)
            })
            client.on("packetreceive", (packet: any) => {
                this.$global.setActiveTraffic(true)
                if (timer !== null)
                    clearTimeout(timer)
                timer = setTimeout(() => {
                    timer = null
                    this.$global.setActiveTraffic(false)
                }, 250)
                if (this.$global.value.logTraffic)
                    console.log(`MQTT: RECV: packet=${JSON.stringify(packet)}`)
            })
        },
        async disconnect () {
            this.$global.setMessage("Status: Disconnecting")
            this.$global.clearError()
            await this.huds.endAttendance().catch(() => {})
            return this.huds.disconnect()
        }
    }
})
</script>

