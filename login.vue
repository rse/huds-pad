
<template>
    <div id="login">
        <span style="grid-area: label">
            <i style="grid-area: icon" class="icon fas fa-key"></i> LiVE Access Token:
        </span>
        <input v-model="liveAccessToken"
            style="grid-area: input"
            type="text"
            placeholder="Enter your LiVE access token..."
            v-on:keyup.enter="updateHash"
            @input="$info.clearMessage()">
        <button style="grid-area: connect"
            v-bind:disabled="!liveAccessToken"
            @click="updateHash">
            CONNECT <i class="fas fa-arrow-alt-circle-right"></i>
        </button>
    </div>
</template>

<style lang="less" scoped>
#login {
    display: grid;
    grid-template: 'label' 'input' 'connect';
    grid-gap: 4px;
}

h1 {
    line-height: 0;
}

input {
    resize: none;
    font-size: 12pt;
    border: 0;
    background-color: var(--color-std-bg-3);
    border-top: 1px solid var(--color-std-bg-1);
    border-left: 1px solid var(--color-std-bg-1);
    border-right: 1px solid var(--color-std-bg-5);
    border-bottom: 1px solid var(--color-std-bg-5);
    padding: 4px 10px 4px 10px;

    &::placeholder {
        color: var(--color-std-fg-1);
        font-size: 10pt;
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
    background-color: var(--color-std-bg-3);
    border-top: 1px solid var(--color-std-bg-5);
    border-left: 1px solid var(--color-std-bg-5);
    border-right: 1px solid var(--color-std-bg-1);
    border-bottom: 1px solid var(--color-std-bg-1);
    font-size: 14pt;
    line-height: 18pt;
    text-align: center;

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
            if (window.location.hash)
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
                if (typeof message.event !== "string" && message.event === "")
                    return
                if (message.event === "votes.toggle") {
                    this.$status.toggleDisableMessaging()
                    this.$status.toggleDisableVoting()
                }
            })
        }
    }
}
</script>

