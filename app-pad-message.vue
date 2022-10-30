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
    <section class="app-pad-message">
        <h2 class="title" style="grid-area: title">
            MESSAGE
            <span v-show="$status.value.isMessagingDisabled" class="disabled">
                (temporarily disabled until current voting ends)
            </span>
            <span v-show="!$status.value.isMessagingDisabled && justSent" class="disabled">
                (temporarily disabled for throttling purposes)
            </span>
        </h2>
        <textarea v-model="text" class="text" rows="4"
            v-bind:disabled="$status.value.isMessagingDisabled || justSent"
            v-bind:placeholder="'Type a message to be send...'"
            v-on:keyup.escape="clearMessage()"
            v-tippy="{ placement: 'top', content: 'The message to be send<br/>anonymously to the live session.', trigger: $status.value.tippyTrigger }"
        ></textarea>
        <button class="clear"
            v-bind:disabled="!text || $status.value.isMessagingDisabled || justSent"
            v-tippy="{ placement: 'bottom', content: 'Clear the message.', trigger: $status.value.tippyTrigger }"
            @click="clearMessage">
            Clear <i class="icon fas fa-trash-alt"></i>
        </button>
        <button class="send"
            v-bind:disabled="!text || $status.value.isMessagingDisabled || justSent"
            v-tippy="{ placement: 'bottom', content: 'Send the message.', trigger: $status.value.tippyTrigger }"
            @click="sendMessage">
            Send <i class="icon fas fa-share"></i>
        </button>
    </section>
</template>

<style lang="less">
.app-pad-message {
    display: grid;
    grid-template:
        "title title"
        "message message"
        "clear send";
    grid-gap: 2px;
    .title {
        grid-area: title;
    }
    .clear {
        grid-area: clear;
    }
    .send {
        grid-area: send;
    }
    .disabled {
        font-size: 9pt;
        font-weight: 300;
        color: var(--color-acc-fg-3);
        margin-left: 4px;
    }
    textarea {
        grid-area: message;
        overflow: hidden;
        resize: none;
        font-size: 16pt;
        border: 0;
        background-color: var(--color-std-bg-2);
        border-top: 1px solid var(--color-std-bg-1);
        border-left: 1px solid var(--color-std-bg-1);
        border-right: 1px solid var(--color-std-bg-5);
        border-bottom: 1px solid var(--color-std-bg-5);
        padding: 4px 8px;
        position: relative;
        border-radius: 4px;
        &::placeholder {
            color: var(--color-std-fg-1);
            font-size: 10pt;
            font-weight: 300;
        }
        .hoverable &:hover:not(:disabled),
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
        &:disabled {
            cursor: not-allowed;
            color: var(--color-std-fg-0);
            background-color: var(--color-std-bg-3);
            border-top: 1px solid var(--color-std-bg-1);
            border-left: 1px solid var(--color-std-bg-1);
            border-right: 1px solid var(--color-std-bg-5);
            border-bottom: 1px solid var(--color-std-bg-5);
            &::placeholder {
                color: var(--color-std-fg-0);
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
        border-radius: 4px;
        padding: 8px 0;
        .hoverable &:hover:not(:disabled) {
            border: 0;
            outline: none;
            color: var(--color-acc-fg-5);
            background-color: var(--color-acc-bg-4);
            border-top: 1px solid var(--color-acc-bg-5);
            border-left: 1px solid var(--color-acc-bg-5);
            border-right: 1px solid var(--color-acc-bg-1);
            border-bottom: 1px solid var(--color-acc-bg-1);
            .icon {
                color: var(--color-acc-fg-5);
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
}
</style>

<script>
module.exports = {
    name: "app-pad-message",
    data: () => ({
        text: "",
        justSent: false
    }),
    methods: {
        sendMessage () {
            if (this.text && !this.$status.value.isMessagingDisabled) {
                this.huds.sendMessage(this.text)
                this.clearMessage()
                this.justSent = true
                setTimeout(() => {
                    this.justSent = false
                }, 15 * 1000)
            }
        },
        clearMessage () {
            this.text = ""
        }
    }
}
</script>

