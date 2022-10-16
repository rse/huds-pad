
<template>
    <div class="app-login">
        <h2>Access Token</h2>
        <input v-model="accessToken"
            style="grid-area: input"
            type="text"
            placeholder="Enter your Access Token..."
            v-on:keyup.enter="updateHash"
            @input="$info.clearMessage()">
        <button style="grid-area: connect"
            v-bind:disabled="!accessToken"
            @click="updateHash">
            Connect <i class="icon fas fa-arrow-alt-circle-right"></i>
        </button>
    </div>
</template>

<style lang="less">
.app-login {
    display: grid;
    grid-template: 'label' 'input' 'connect';
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
        padding: 4px 10px 4px 10px;
        border-radius: 4px;
        &::placeholder {
            color: var(--color-std-fg-1);
            font-size: 10pt;
            font-weight: 200;
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
        font-size: 16pt;
        line-height: 18pt;
        text-align: center;
        margin-top: 2px;
        padding: 8px 0 8px 0;
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
}
</style>

<script>
module.exports = {
    name: "app-login",
    data: () => ({
        accessToken: ""
    }),
    created () {
        this.connect()
        window.addEventListener("hashchange", async () => {
            await this.disconnect()
            this.connect()
        }, false)
    },
    methods: {
        updateHash () {
            window.location.hash = this.accessToken
        },
        connect () {
            /*  sanity check situation  */
            if (!window.location.hash)
                return

            /*  parse access token  */
            const accessToken = window.location.hash.substring(1)
            const match = accessToken.match(/^(.+?)-([^-]+)-([^-]+)$/)
            if (match === null) {
                this.$info.setMessage("Status: Failed to connect")
                this.$info.setError("Error: Invalid access token format")
                return
            }
            const [ , channel, token1, token2 ] = match

            /*  connect to HUDS MQTT broker  */
            const client = this.huds.connect(channel, token1, token2)

            /*  react on MQTT broker status  */
            client.on("connect", () => {
                this.$info.setMessage("Status: Connected")
                this.$info.clearError()
                this.$status.setConnectionEstablished()
                this.huds.beginAttendance()
                this.huds.sendFeeling(3, 3)
            })
            client.on("close", () => {
                this.$info.setMessage("Status: Disconnected")
                this.$status.setConnectionClosed()
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
                if (this.client?.connected)
                    this.client.end()
            })
            client.on("reconnect", () => {
                this.$info.setMessage("Status: Reconnecting")
            })

            /*  react on MQTT messages  */
            client.on("message", (topic, message) => {
                message = JSON.parse(message.toString())
                if (typeof message?.event !== "string")
                    return
                if (message.event === "voting-begin") {
                    this.$status.disabledMessaging(true)
                    this.$status.disabledVoting(false)
                    this.$status.clearVoting()
                }
                else if (message.event === "voting-end") {
                    this.$status.disabledMessaging(false)
                    this.$status.disabledVoting(true)
                    this.$status.clearVoting()
                }
                else if (message.event === "voting-type") {
                    if (typeof message.data?.type === "string") {
                        this.$status.setVotingType(message.data.type)
                        this.$status.clearVoting()
                    }
                }
            })
        },
        disconnect () {
            this.huds.disconnect().catch(() => {})
        }
    }
}
</script>

