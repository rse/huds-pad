<!--
**
**  HUDS - Head-Up-Display Server (HUDS)
**  Copyright (c) 2022-2024 Dr. Ralf S. Engelschall <rse@engelschall.com>
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
    <div class="app"
        v-bind:class="{
            dark:  $global.value.theme === 'dark',
            light: $global.value.theme === 'light' }">
        <main ref="main" v-bind:class="{ hoverable: hoverable }">
            <app-head></app-head>
            <app-info   v-show="settings.opts.ui.info"></app-info>
            <app-about  v-show="settings.opts.ui.about && $global.value.showabout"></app-about>
            <app-qrcode v-show="settings.opts.ui.qrcode && $global.value.showqrcode"></app-qrcode>
            <app-config v-show="settings.opts.ui.config && $global.value.showconfig"></app-config>
            <app-pad    v-show=" $global.value.connected"></app-pad>
            <app-login  v-show="!$global.value.connected"></app-login>
        </main>
    </div>
</template>

<style lang="stylus">
.app
    margin: 0
    padding: 0
    width: 100%
    height: 100%
    font-family: "TypoPRO Source Sans Pro", sans-serif
    background-color: var(--color-std-bg-1)
    color: var(--color-std-fg-3)
    font-weight: normal
    user-select: none

    main
        margin: 0 auto
        padding: 0 10px
        max-width: 480px
        min-height: 100vh
        background-color: var(--color-std-bg-3)

@media only screen and (min-width: 480px)
    .app
        main
            border-left:  1px solid var(--color-std-bg-5)
            border-right: 1px solid var(--color-std-bg-0)
</style>

<script setup lang="ts">
import { defineComponent } from "vue"
import AppHead             from "./app-head.vue"
import AppAbout            from "./app-about.vue"
import AppQRCode           from "./app-qrcode.vue"
import AppConfig           from "./app-config.vue"
import AppPad              from "./app-pad.vue"
import AppLogin            from "./app-login.vue"
import AppInfo             from "./app-info.vue"
</script>

<script lang="ts">
export default defineComponent({
    name: "app",
    components: {
        "app-head":   AppHead,
        "app-about":  AppAbout,
        "app-qrcode": AppQRCode,
        "app-config": AppConfig,
        "app-pad":    AppPad,
        "app-login":  AppLogin,
        "app-info":   AppInfo
    },
    data: () => ({
        hoverable: false
    }),
    created () {
        /*  prevent rubberband effect on app swipes in iOS Safari  */
        (window as any).allowTouchMove = (el: HTMLElement) => {
            el.addEventListener("touchmove", (ev: Event) => {
                (ev as any)._allowTouchMove = true
            })
        }
    },
    mounted () {
        /*  avoid distracting :hover on touch devices  */
        let lastTouchTime = 0
        document.addEventListener("touchstart", () => {
            lastTouchTime = Date.now()
            this.hoverable = false
        }, true)
        document.addEventListener("mousemove", () => {
            if (Date.now() - lastTouchTime < 500)
                return
            this.hoverable = true
        }, true)

        /*  prevent rubberband effect on app swipes in iOS Safari  */
        document.body.addEventListener("touchmove", (ev: Event) => {
            if (!(ev as any)._allowTouchMove && window.innerHeight === (this.$refs.main as HTMLElement).clientHeight)
                ev.preventDefault()
        }, { passive: false })

        /*  observe network connectivity  */
        this.$global.setOnline(navigator.onLine)
        window.addEventListener("offline", (ev: Event) => {
            this.$global.setOnline(false)
        })
        window.addEventListener("online", (ev: Event) => {
            this.$global.setOnline(true)
            this.huds.refreshAttendance()
        })
    }
})
</script>

