
<template>
    <section>
        <app-pad-message></app-pad-message>
        <app-pad-vote></app-pad-vote>
        <app-pad-feedback></app-pad-feedback>
        <app-pad-feeling></app-pad-feeling>
    </section>
</template>

<style lang="less" scoped>
</style>

<script>
module.exports = {
    name: "app-pad",
    components: {
        "app-pad-message":  Vue.loadComponent("app-pad-message.vue"),
        "app-pad-vote":     Vue.loadComponent("app-pad-vote.vue"),
        "app-pad-feedback": Vue.loadComponent("app-pad-feedback.vue"),
        "app-pad-feeling":  Vue.loadComponent("app-pad-feeling.vue")
    }
}
</script>

