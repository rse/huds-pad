
<template>
    <main ref="main" v-bind:class="{ hoverable: hoverable }">
        <app-head></app-head>
        <app-qrcode v-show="$status.value.showqrcode"></app-qrcode>
        <app-pad    v-show=" $status.value.connected"></app-pad>
        <app-login  v-show="!$status.value.connected"></app-login>
        <app-info></app-info>
    </main>
</template>

<style lang="less">
main {
    margin: 0 auto;
    padding: 0 10px;
    max-width: 480px;
    min-height: 100vh;
    background: var(--color-std-bg-3);
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
        "app-qrcode": Vue.loadComponent("app-qrcode.vue"),
        "app-pad":    Vue.loadComponent("app-pad.vue"),
        "app-login":  Vue.loadComponent("app-login.vue"),
        "app-info":   Vue.loadComponent("app-info.vue")
    },
    data: () => ({
        hoverable: false
    }),
    mounted () {
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
    }
}
</script>

