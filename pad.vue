
<template>
    <section>
        <pad-widget-message></pad-widget-message>
        <pad-widget-vote></pad-widget-vote>
        <pad-widget-feedback></pad-widget-feedback>
        <pad-widget-feeling></pad-widget-feeling>
    </section>
</template>

<style lang="less" scoped>
</style>

<script>
module.exports = {
    name: "pad",
    components: {
        "pad-widget-message":  Vue.loadComponent("pad-widget-message.vue"),
        "pad-widget-vote":     Vue.loadComponent("pad-widget-vote.vue"),
        "pad-widget-feedback": Vue.loadComponent("pad-widget-feedback.vue"),
        "pad-widget-feeling":  Vue.loadComponent("pad-widget-feeling.vue")
    }
}
</script>

