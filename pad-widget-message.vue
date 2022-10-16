
<template>
    <section id="message">
        <h2 id="title" style="grid-area: title">
            MESSAGE
            <span class="disabled" v-show="$status.value.isMessagingDisabled">(disabled)</span>
        </h2>
        <textarea id="text" v-model="text"
            rows="3"
            v-bind:disabled="$status.value.isMessagingDisabled"
            v-bind:placeholder="'Type a message to be send to the audience...'"
            v-on:keyup.escape="clearMessage()"
        ></textarea>
        <button id="clear"
            v-bind:disabled="!text || $status.value.isMessagingDisabled"
            @click="clearMessage">
            Clear <i class="icon fas fa-trash-alt"></i>
        </button>
        <button id="send"
            v-bind:disabled="!text || $status.value.isMessagingDisabled"
            @click="sendMessage">
            Send <i class="icon fas fa-share"></i>
        </button>
    </section>
</template>

<style lang="less" scoped>
#message {
    display: grid;
    grid-template:
        "title title"
        "message message"
        "clear send";
    grid-gap: 4px;
}

#title {
    grid-area: title;
}

#clear {
    grid-area: clear;
}

#send {
    grid-area: send;
}

.disabled {
    font-size: 8pt;
    font-weight: 200;
    color: var(--color-sig-fg-2);
    margin-left: 4px;
}

textarea {
    grid-area: message;
    overflow: hidden;
    resize: none;
    font-size: 14pt;
    border: 0;
    background-color: var(--color-std-bg-3);
    border-top: 1px solid var(--color-std-bg-1);
    border-left: 1px solid var(--color-std-bg-1);
    border-right: 1px solid var(--color-std-bg-5);
    border-bottom: 1px solid var(--color-std-bg-5);
    padding: 4px 8px 4px 8px;
    position: relative;
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

    &:disabled {
        cursor: not-allowed;
        color: var(--color-std-fg-0);
        background-color: var(--color-std-bg-3);
        border-top: 1px solid var(--color-std-bg-5);
        border-left: 1px solid var(--color-std-bg-5);
        border-right: 1px solid var(--color-std-bg-1);
        border-bottom: 1px solid var(--color-std-bg-1);

        &::placeholder {
            color: var(--color-std-fg-0);
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
    font-size: 12pt;
    line-height: 18pt;
    text-align: center;
    border-radius: 4px;
    padding: 8px 0 8px 0;

    &:hover {
        border: 0;
        outline: none;
        color: var(--color-sig-fg-5);
        background-color: var(--color-sig-bg-3);
        border-top: 1px solid var(--color-sig-bg-5);
        border-left: 1px solid var(--color-sig-bg-5);
        border-right: 1px solid var(--color-sig-bg-1);
        border-bottom: 1px solid var(--color-sig-bg-1);
        .icon {
            color: var(--color-sig-fg-5);
        }
    }

    &:disabled {
        cursor: not-allowed;
        color: var(--color-std-fg-0);
        background-color: var(--color-std-bg-3);
        border-top: 1px solid var(--color-std-bg-5);
        border-left: 1px solid var(--color-std-bg-5);
        border-right: 1px solid var(--color-std-bg-1);
        border-bottom: 1px solid var(--color-std-bg-1);
        .icon {
            color: var(--color-std-fg-0);
        }
    }
    .icon {
        margin-left: 8px;
    }
}
</style>

<script>
module.exports = {
    name: "pad-widget-message",
    data: () => ({
        text: ""
    }),
    methods: {
        sendMessage () {
            if (this.text && !this.$status.value.isMessagingDisabled) {
                this.huds.sendMessage(this.text)
                this.clearMessage()
            }
        },
        clearMessage () {
            this.text = ""
        }
    }
}
</script>

