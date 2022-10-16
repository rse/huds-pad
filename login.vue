
<template>
    <div id="login">
        <h2>Access Token</h2>
        <input v-model="liveAccessToken"
            style="grid-area: input"
            type="text"
            placeholder="Enter your Access Token..."
            v-on:keyup.enter="updateHash"
            @input="$info.clearMessage()">
        <button style="grid-area: connect"
            v-bind:disabled="!liveAccessToken"
            @click="updateHash">
            Connect <i class="icon fas fa-arrow-alt-circle-right"></i>
        </button>
    </div>
</template>

<style lang="less" scoped>
#login {
    display: grid;
    grid-template: 'label' 'input' 'connect';
    grid-gap: 4px;
}

input {
    resize: none;
    font-size: 16pt;
    border: 0;
    background-color: var(--color-std-bg-3);
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

    &:hover, &:focus {
        border: 0;
        outline: none;
        color: var(--color-sig-fg-5);
        background-color: var(--color-sig-bg-3);
        border-top: 1px solid var(--color-sig-bg-1);
        border-left: 1px solid var(--color-sig-bg-1);
        border-right: 1px solid var(--color-sig-bg-5);
        border-bottom: 1px solid var(--color-sig-bg-5);

        &::placeholder {
            color: var(--color-sig-fg-1);
        }
    }
}

button {
    cursor: pointer;
    color: var(--color-std-fg-3);
    background-color: var(--color-std-bg-3);
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

    &:hover {
        color: var(--color-sig-fg-3);
        background-color: var(--color-sig-bg-4);
        border-top: 1px solid var(--color-sig-bg-5);
        border-left: 1px solid var(--color-sig-bg-5);
        border-right: 1px solid var(--color-sig-bg-1);
        border-bottom: 1px solid var(--color-sig-bg-1);
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
</style>

<script>
module.exports = {
    name: "login",
    data: () => ({
        liveAccessToken: ""
    }),
    created () {
        this.connect()
        window.addEventListener("hashchange", () => {
            this.connect()
        }, false)
    },
    methods: {
        updateHash () {
            window.location.hash = this.liveAccessToken
        },
        connect () {
            if (!window.location.hash)
                return

            const liveAccessToken = window.location.hash.substring(1)
            const match = liveAccessToken.match(/^(.+?)-([^-]+)-([^-]+)$/)
            if (match === null) {
                this.$info.setMessage("Error: Invalid access token format")
                return
            }

            const [, channel, token1, token2] = match
            this.huds.channel = channel
            const client = this.huds.initClient(token1, token2)
            client.on("connect", () => {
                this.$info.setMessage("Status: Connected")
                this.$status.setConnectionEstablished()
                this.huds.beginAttendance()
            })
            client.on("error", (err) => {
                this.$info.setMessage("Status: Error")
                console.error(err)
                this.client.end()
            })
            client.on("reconnect", () => {
                this.$info.setMessage("Status: Reconnect")
            })
            client.on("message", (topic, message) => {
                message = JSON.parse(message.toString())
                console.log(message)
                if (typeof message.event !== "string" && message.event === "")
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
        }
    }
}
</script>

