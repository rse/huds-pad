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
    <main ref="main" v-bind:class="{ hoverable: hoverable }">
        <app-head></app-head>
        <app-info></app-info>
        <app-about  v-show="$global.value.showabout"></app-about>
        <app-qrcode v-show="$global.value.showqrcode"></app-qrcode>
        <app-pad    v-show=" $global.value.connected"></app-pad>
        <app-login  v-show="!$global.value.connected"></app-login>
    </main>
</template>

<style lang="less">
main {
    margin: 0 auto;
    padding: 0 10px;
    max-width: 480px;
    min-height: 100vh;
    background-color: var(--color-std-bg-3);
}
@media only screen and (min-width: 480px) {
    main {
        border-left:  1px solid var(--color-std-bg-5);
        border-right: 1px solid var(--color-std-bg-0);
    }
}
</style>

<script>
module.exports = {
    name: "app",
    components: {
        "app-head":   Vue.loadComponent("app-head.vue"),
        "app-about":  Vue.loadComponent("app-about.vue"),
        "app-qrcode": Vue.loadComponent("app-qrcode.vue"),
        "app-pad":    Vue.loadComponent("app-pad.vue"),
        "app-login":  Vue.loadComponent("app-login.vue"),
        "app-info":   Vue.loadComponent("app-info.vue")
    },
    data: () => ({
        hoverable: false
    }),
    mounted () {
        /*  avoid distracting :hover on touch devices  */
        let lastTouchTime = 0
        document.addEventListener("touchstart", () => {
            lastTouchTime = new Date()
            this.hoverable = false
        }, true)
        document.addEventListener("mousemove", () => {
            if (new Date() - lastTouchTime < 500)
                return
            this.hoverable = true
        }, true)

        /*  prevent rubberband effect on app swipes in iOS Safari  */
        window.allowTouchMove = (el) => {
            el.addEventListener("touchmove", (ev) => {
                ev._allowTouchMove = true
            })
        }
        document.body.addEventListener("touchmove", (ev) => {
            if (!ev._allowTouchMove && window.innerHeight === this.$refs.main.clientHeight)
                ev.preventDefault()
        }, { passive: false })

        /*  observe network connectivity  */
        this.$global.setOnline(navigator.onLine)
        window.addEventListener("offline", (ev) => {
            this.$global.setOnline(false)
        })
        window.addEventListener("online", (ev) => {
            this.$global.setOnline(true)
            this.huds.refreshAttendance()
        })
    }
}
</script>

