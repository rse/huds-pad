<!--
**
**  HUDS - Head-Up-Display Server (HUDS)
**  Copyright (c) 2022-2025 Dr. Ralf S. Engelschall <rse@engelschall.com>
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
            {{ t("message.message-label") }}
            <span v-show="$global.value.isMessagingDisabled" class="disabled">
                {{ t("message.until-end-label") }}
            </span>
            <span v-show="!$global.value.isMessagingDisabled && justSent" class="disabled">
                {{ t("message.throttled-label") }}
            </span>
        </h2>
        <input v-show="settings.opts.ui.name"
            style="grid-area: name"
            v-model="name"
            type="text"
            v-bind:placeholder="settings.opts.ui.anonymous ? t('message.name-opt-placeholder') : t('message.name-req-placeholder')"
            v-tippy="{ placement: 'top', content: settings.opts.ui.anonymous ? t('message.name-opt-hint') : t('message.name-req-hint'), trigger: $global.value.tippyTrigger }"/>
        <textarea v-model="text" class="text" rows="4"
            style="grid-area: message"
            v-bind:placeholder="t('message.text-placeholder')"
            v-on:keyup.escape="clearMessage()"
            v-tippy="{ placement: 'top', content: t('message.text-hint'), trigger: $global.value.tippyTrigger }"
        ></textarea>
        <div class="buttons" style="grid-area: buttons">
            <button class="raisehand" v-if="settings.opts.ui.raise"
                v-bind:disabled="!name || justRaised"
                v-bind:class="{ active: raisedHand }"
                v-tippy="{ placement: 'bottom', content: t('message.raisehand-hint'), trigger: $global.value.tippyTrigger }"
                @click="raiseHand">
                {{ t("message.raisehand-button") }} <i class="icon fas fa-hand"></i>
            </button>
            <button class="clear"
                v-bind:disabled="!text"
                v-tippy="{ placement: 'bottom', content: t('message.clear-hint'), trigger: $global.value.tippyTrigger }"
                @click="clearMessage">
                {{ t("message.clear-button") }} <i class="icon fas fa-trash-alt"></i>
            </button>
            <button class="send" v-if="settings.opts.ui.send"
                v-bind:disabled="(!name && !settings.opts.ui.anonymous) || !text || $global.value.isMessagingDisabled || justSent"
                v-tippy="{ placement: 'bottom', content: t('message.send-hint'), trigger: $global.value.tippyTrigger }"
                @click="sendMessage">
                {{ t("message.send-button") }} <i class="icon fas fa-share"></i>
            </button>
        </div>
    </section>
</template>

<i18n lang="yaml">
en:
    message:
        message-label:        MESSAGE
        until-end-label:      (temporarily disabled until current voting ends)
        throttled-label:      (temporarily disabled for throttling purposes)
        name-opt-placeholder: Type your name (optional)...
        name-req-placeholder: Type your name (required)...
        name-opt-hint:        Your name for messages<br/>(just keep blank for anonymity).
        name-req-hint:        Your name for messages.
        text-placeholder:     Type your message...
        text-hint:            Your message to be send<br/>(under name or anonymously).
        raisehand-button:     Raise
        raisehand-hint:       Raise your hand.
        clear-button:         Clear
        clear-hint:           Clearing the message.
        send-button:          Send
        send-hint:            Sending the message.
de:
    message:
        message-label:        NACHRICHT
        until-end-label:      (vorläufig gesperrt bis zum Ende der Abstimmung)
        throttled-label:      (vorläufig gesperrt aus Drosselungsgründen)
        name-opt-placeholder: Gib deinen Namen ein (optional)...
        name-req-placeholder: Gib deinen Namen ein (erforderlich)...
        name-opt-hint:        Dein Name für Nachrichten<br/>(einfach leer lassen für Anonymität).
        name-req-hint:        Dein Name für Nachrichten.
        text-placeholder:     Gib deine Nachricht ein...
        text-hint:            Deine Nachricht, die gesendet wird<br/>(unter Namen oder anonym).
        raisehand-button:     Heben
        raisehand-hint:       Hebe deine Hand.
        clear-button:         Löschen
        clear-hint:           Löschen der Nachricht.
        send-button:          Senden
        send-hint:            Senden der Nachricht.
</i18n>

<style lang="stylus">
.app-pad-message
    display: grid
    grid-template: "title" "name" "message" "buttons"
    gap: 2px
    .buttons
        display: flex
        flex-direction: row
        justify-content: center
        align-items: center
        button
            flex: 1
    .disabled
        font-size: 9pt
        font-weight: 300
        color: var(--color-acc-fg-3)
        margin-left: 4px
    textarea
        grid-area: message
        overflow: hidden
        resize: none
        font-size: 14pt
        line-height: 110%
        border: 0
        background-color: var(--color-std-bg-2)
        border-top: 1px solid var(--color-std-bg-1)
        border-left: 1px solid var(--color-std-bg-1)
        border-right: 1px solid var(--color-std-bg-5)
        border-bottom: 1px solid var(--color-std-bg-5)
        padding: 4px 8px
        position: relative
        border-radius: 4px
        &::placeholder
            color: var(--color-std-fg-1)
            font-size: 10pt
            font-weight: 300
        .hoverable &:hover:not(:disabled),
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
        &:disabled
            cursor: not-allowed
            color: var(--color-std-fg-0)
            background-color: var(--color-std-bg-3)
            border-top: 1px solid var(--color-std-bg-1)
            border-left: 1px solid var(--color-std-bg-1)
            border-right: 1px solid var(--color-std-bg-5)
            border-bottom: 1px solid var(--color-std-bg-5)
            &::placeholder
                color: var(--color-std-fg-0)
    input
        resize: none
        font-size: 14pt
        border: 0
        background-color: var(--color-std-bg-2)
        border-top: 1px solid var(--color-std-bg-1)
        border-left: 1px solid var(--color-std-bg-1)
        border-right: 1px solid var(--color-std-bg-5)
        border-bottom: 1px solid var(--color-std-bg-5)
        padding: 4px 8px
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
        border-radius: 4px
        padding: 8px 0
        .hoverable &:hover:not(:disabled)
            border: 0
            outline: none
            color: var(--color-acc-fg-5)
            background-color: var(--color-acc-bg-4)
            border-top: 1px solid var(--color-acc-bg-5)
            border-left: 1px solid var(--color-acc-bg-5)
            border-right: 1px solid var(--color-acc-bg-1)
            border-bottom: 1px solid var(--color-acc-bg-1)
            .icon
                color: var(--color-acc-fg-5)
        &:disabled
            cursor: not-allowed
            color: var(--color-std-fg-0)
            background-color: var(--color-std-bg-3)
            border-top: 1px solid var(--color-std-bg-5)
            border-left: 1px solid var(--color-std-bg-5)
            border-right: 1px solid var(--color-std-bg-1)
            border-bottom: 1px solid var(--color-std-bg-1)
            .icon
                color: var(--color-std-fg-0)
        .icon
            margin-left: 8px
        &.active
            border: 0
            outline: none
            color: var(--color-acc-fg-5) !important
            background-color: var(--color-acc-bg-3)
            border-top: 1px solid var(--color-acc-bg-5)
            border-left: 1px solid var(--color-acc-bg-5)
            border-right: 1px solid var(--color-acc-bg-1)
            border-bottom: 1px solid var(--color-acc-bg-1)
            .icon
                color: var(--color-acc-fg-5) !important
</style>

<script setup lang="ts">
import { defineComponent } from "vue"
import { useI18n } from "vue-i18n"
const { t } = useI18n()
</script>

<script lang="ts">
export default defineComponent({
    name: "app-pad-message",
    data: () => ({
        text: "",
        name: "",
        raisedHand: false,
        justSent: false,
        justRaised: false
    }),
    mounted () {
        window.addEventListener("message", (ev) => {
            let matched = false
            for (const origin of (this.settings?.opts?.custom?.origins ?? "").split(/\s+/)) {
                if (ev.origin === origin) {
                    matched = true
                    break
                }
            }
            if (!matched)
                return
            if (typeof ev.data === "object"
                && ev.data.cmd === "set-message-name"
                && typeof ev.data.name === "string")
                this.name = ev.data.name
        }, false)
        this.$watch("$global.value.raisedhand", () => {
            if (!this.$global.value.raisedhand) {
                this.raisedHand = false
                this.justRaised = true
                setTimeout(() => {
                    this.justRaised = false
                }, 10 * 1000)
            }
        })
    },
    methods: {
        raiseHand () {
            if (this.name !== "") {
                this.raisedHand = !this.raisedHand
                if (this.raisedHand)
                    this.$global.value.raisedhand = true
                this.huds.raiseHand(this.name, this.text, this.raisedHand)
                this.clearMessage()
                if (!this.raisedHand) {
                    this.justRaised = true
                    setTimeout(() => {
                        this.justRaised = false
                    }, 10 * 1000)
                }
            }
        },
        sendMessage () {
            if (this.text && !this.$global.value.isMessagingDisabled) {
                this.huds.sendMessage(this.text, this.name !== "" ? this.name : "Anonymous Attendee")
                this.clearMessage()
                this.justSent = true
                setTimeout(() => {
                    this.justSent = false
                }, 10 * 1000)
            }
        },
        clearMessage () {
            this.text = ""
        }
    }
})
</script>

