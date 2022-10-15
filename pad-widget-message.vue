
<template>
    <section id="message">
        <h2 id="title">Message</h2>
        <textarea id="text" v-model="text"
            rows="5"
            v-bind:disabled="$status.value.isMessagingDisabled"
            v-bind:placeholder="'Type a message...'"
            v-on:keyup.escape="clearMessage()"
        ></textarea>
        <button id="clear"
            v-bind:disabled="!text || $status.value.isMessagingDisabled"
            @click="clearMessage">
            Clear message <i class="icon fas fa-trash-alt"></i>
        </button>
        <button id="send"
            v-bind:disabled="!text || $status.value.isMessagingDisabled"
            @click="sendMessage">
            Send message <i class="icon fas fa-share"></i>
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

textarea {
    grid-area: message;
    overflow: hidden;
    resize: none;
    font-size: 12pt;
    border: 0;
    background-color: var(--color-std-bg-3);
    border-top: 1px solid var(--color-std-bg-1);
    border-left: 1px solid var(--color-std-bg-1);
    border-right: 1px solid var(--color-std-bg-5);
    border-bottom: 1px solid var(--color-std-bg-5);
    padding: 4px 10px 4px 10px;
    position: relative;
   
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
    background-color: var(--color-std-bg-3);
    border-top: 1px solid var(--color-std-bg-5);
    border-left: 1px solid var(--color-std-bg-5);
    border-right: 1px solid var(--color-std-bg-1);
    border-bottom: 1px solid var(--color-std-bg-1);
    font-size: 14pt;
    line-height: 18pt;
    text-align: center;

    &:hover {
        border: 0;
        outline: none;
        color: var(--color-sig-fg-5);
        background-color: var(--color-sig-bg-3);
        border-top: 1px solid var(--color-sig-bg-1);
        border-left: 1px solid var(--color-sig-bg-1);
        border-right: 1px solid var(--color-sig-bg-5);
        border-bottom: 1px solid var(--color-sig-bg-5);
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

