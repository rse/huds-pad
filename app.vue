
<template>
    <main>
        <app-head v-bind:show-disconnect="$status.value.connected"></app-head>
        <app-pad v-if="$status.value.connected"></app-pad>
        <app-login v-else></app-login>
        <app-info></app-info>
    </main>
</template>

<style lang="less" scoped>
    main {
        margin: 0 auto;
        padding: 0 10px;
        max-width: 500px;
        min-height: 100vh;
        background: var(--color-std-bg-3);
    }
    @media only screen and (orientation: landscape) {
        main {
            border-left:  1px solid var(--color-std-bg-5);
            border-right: 1px solid var(--color-std-bg-0);
        }
    }
</style>

<script>
    module.exports = {
        name: "index",
        components: {
            "app-head":  Vue.loadComponent("app-head.vue"),
            "app-pad":   Vue.loadComponent("app-pad.vue"),
            "app-login": Vue.loadComponent("app-login.vue"),
            "app-info":  Vue.loadComponent("app-info.vue")
        }
    }
</script>

