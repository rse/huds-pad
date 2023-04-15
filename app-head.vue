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
    <div class="app-pad-head">
        <div class="left">
            <button v-show="settings.opts.ui.disconnect && $global.value.connected" @click="disconnect()"
                v-tippy="{ placement: 'bottom', content: 'Disconnect connection<br/>with the live session.', trigger: $global.value.tippyTrigger }">
                <i class="icon fas fa-arrow-alt-circle-left"></i>
            </button>
            <div v-show="settings.opts.ui.attendees && $global.value.connected && $global.value.clients > 0" class="attendees"
                v-tippy="{ placement: 'bottom', content: 'Indicator for active application<br/>connections at HUDS.', trigger: $global.value.tippyTrigger }">
                <i class="icon fas fa-users"></i>
                {{ $global.value.clients }}
            </div>
        </div>
        <div class="title">
            <h1 ref="h1" @click="$global.toggleAbout()" v-show="settings.opts.ui.title"
                v-tippy="{ placement: 'bottom', content: settings.opts.ui.about ? 'Toggle the information<br/>about this application.' : '', trigger: $global.value.tippyTrigger }">
                <span class="title1">{{ settings.opts.ui.title1 }}</span>
                <span class="title2">{{ settings.opts.ui.title2 }}</span>
            </h1>
        </div>
        <div class="right">
            <div class="traffic" @click="$global.toggleLogTraffic()" v-show="settings.opts.ui.traffic"
                v-tippy="{ placement: 'bottom', content: 'Indicator and debug toggle<br/>for HUDS network traffic.', trigger: $global.value.tippyTrigger }">
                <div v-show="!$global.value.logTraffic" v-bind:class="{ active: $global.value.activeTraffic }">
                    <i class="icon fa-solid fa-circle"></i>
                </div>
                <div v-show="$global.value.logTraffic" v-bind:class="{ active: $global.value.activeTraffic }">
                    <i class="icon fa-solid fa-circle-stop"></i>
                </div>
            </div>
            <div class="online" v-show="settings.opts.ui.online"
                v-tippy="{ placement: 'bottom', content: 'Indicator for network<br/>online status.', trigger: $global.value.tippyTrigger }">
                <div v-show="$global.value.online">
                    <i class="icon yes fa-solid fa-plug-circle-check"></i>
                </div>
                <div v-show="!$global.value.online">
                    <i class="icon no fa-solid fa-plug-circle-xmark"></i>
                </div>
            </div>
            <button class="qrcode" @click="$global.toggleQRCode()" v-show="settings.opts.ui.qrcode"
                v-tippy="{ placement: 'bottom', content: 'Show a QR code for the<br/>easy transitioning to a</br>mobile device.', trigger: $global.value.tippyTrigger }">
                <div v-bind:class="{ active: $global.value.showqrcode }">
                    <i class="icon fas fa-qrcode"></i>
                </div>
            </button>
            <button class="theming" @click="toggleTheme()" v-show="settings.opts.ui.theming"
                v-tippy="{ placement: 'bottom', content: 'Toggle user interface between<br/>dark and light theme.' }">
                <div class="theme">
                    <i class="icon theming fa-solid fa-paint-roller"></i>
                </div>
            </button>
            <button class="hints" @click="$global.toggleHints()" v-show="settings.opts.ui.hints"
                v-tippy="{ placement: 'bottom', content: 'Indicator and toggle for hint<br/>popups on user interface controls.' }">
                <div v-bind:class="{ active: $global.value.showhints }">
                    <i class="icon fa-solid fa-circle-info"></i>
                </div>
            </button>
        </div>
    </div>
</template>

<style lang="stylus">
.app-pad-head
    padding-top: 8px
    display: flex
    flex-direction: row
    button
        line-height: 12pt
        background: none
        cursor: pointer
        border: 0
        .icon
            display: inline-block
            color: var(--color-std-fg-1)
            font-size: 16pt
            width: 20px
            text-align: center
        .hoverable &:hover
            border: 0
            outline: none
            color: var(--color-acc-fg-5)
            .icon
                color: var(--color-acc-fg-1)
    .left
        width: 130px
        display: flex
        flex-direction: row
        justify-content: flex-start
        align-items: center
        height: 32px
    .title
        flex-grow: 1
        perspective: 300px
        h1
            transform-origin: 50% 50%
            transform-style:  preserve-3d
            line-height: 0
            margin-top: 14px
            margin-bottom: 12px
            text-align: center
            .title1
                font-weight: 900
                letter-spacing: -1px
                padding-left: 4px
                padding-right: 4px
    .right
        width: 130px
        display: flex
        flex-direction: row
        justify-content: flex-end
        height: 32px
    .attendees
        padding-left: 2px
        color: var(--color-std-fg-3)
        font-size: 12pt
        .icon
            font-size: 80%
            color: var(--color-std-fg-1)
    .online .icon
        display: inline-block
        font-size: 12pt
        width: 18px
        text-align: center
        position: relative
        padding-right: 2px
        top: 5px
        &.yes
            color: var(--color-std-fg-1)
        &.no
            color: var(--color-sig-fg-1)
    .traffic .icon
        display: inline-block
        font-size: 10pt
        width: 18px
        text-align: center
        position: relative
        top: 5px
        color: var(--color-std-fg-1)
    .traffic .active .icon
        color: var(--color-acc-fg-1)
    .qrcode .icon
        width: 16px
    .theming .icon
        width: 16px
    .hints .icon
        width: 16px
    main:not(.hoverable) & .hints
        display: none
    .hints .active .icon
        color: var(--color-acc-fg-1)
    .qrcode .active .icon
        color: var(--color-acc-fg-1)
</style>

<script setup lang="ts">
import { defineComponent } from "vue"
import anime from "animejs"
</script>

<script lang="ts">
let i = 0
export default defineComponent({
    name: "app-head",
    mounted () {
        /*  animate the title initially and then every 5 minutes  */
        setTimeout( () => { this.animate() },      4 * 1000)
        setInterval(() => { this.animate() }, 5 * 60 * 1000)
    },
    methods: {
        disconnect () {
            this.huds.endAttendance()
            this.huds.once("close", () => {
                this.$global.clearMessage()
                this.$global.clearError()
            })
            this.huds.disconnect()
        },
        animate () {
            const tl = anime.timeline({
                targets:  (this.$refs.h1 as HTMLElement),
                duration: 2000,
                easing:   "easeInOutQuad"
            })
            if (i++ % 2 === 0)
                /*  rotate around the X-axis  */
                tl.add({ rotateX: [ 0, 360 ] })
            else
                /*  rotate around the Y-axis  */
                tl.add({ rotateY: [ 0, 360 ] })
        },
        toggleTheme () {
            this.settings.opts.ui.theme =
                this.settings.opts.ui.theme !== "dark" ? "dark" : "light"
            this.$global.setTheme(this.settings.opts.ui.theme)
            this.settings.exportToHash()
        }
    }
})
</script>

