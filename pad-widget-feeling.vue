
<template>
    <section class="feeling">
        <h2 style="grid-area: title">Feeling</h2>
        <pad-widget-challenge style="grid-area: challenge" class="slider" v-on:change="(x) => sendFeeling(mood, x)"></pad-widget-challenge>
        <pad-widget-mood      style="grid-area: mood"      class="slider" v-on:change="(x) => sendFeeling(x, challenge)"></pad-widget-mood>
    </section>
</template>

<style lang="less" scoped>
    .feeling {
        display: grid;
        grid-template:
             "title title"
             "challenge mood";
        grid-gap: 4px;
        .slider {
            color: var(--color-std-fg-3);
            background-color: var(--color-std-bg-3);
            border-top: 1px solid var(--color-std-bg-5);
            border-left: 1px solid var(--color-std-bg-5);
            border-right: 1px solid var(--color-std-bg-1);
            border-bottom: 1px solid var(--color-std-bg-1);
            border-radius: 4px;
        }
    }
</style>

<script>
module.exports = {
    name: "pad-widget-feeling",
    components: {
        "pad-widget-challenge": Vue.loadComponent("pad-widget-challenge.vue"),
        "pad-widget-mood":      Vue.loadComponent("pad-widget-mood.vue")
    },
    data: () => ({
        mood: 3,
        challenge: 3
    }),
    methods: {
        sendFeeling (mood, challenge) {
            this.mood = mood
            this.challenge = challenge
            this.huds.sendFeeling(mood, challenge)
        }
    }
}
</script>

