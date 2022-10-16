
<template>
    <section class="app-pad-feeling">
        <h2 style="grid-area: title">FEELING</h2>
        <app-pad-feeling-challenge
            style="grid-area: challenge" class="slider"
            v-on:changed-value="(x) => sendFeeling(mood, x)"></app-pad-feeling-challenge>
        <app-pad-feeling-mood
            style="grid-area: mood" class="slider"
            v-on:changed-value="(x) => sendFeeling(x, challenge)"></app-pad-feeling-mood>
    </section>
</template>

<style lang="less">
.app-pad-feeling {
    display: grid;
    grid-template:
         "title title"
         "challenge mood";
    grid-gap: 2px;
    .slider {
        color: var(--color-std-fg-3);
        background-color: var(--color-std-bg-4);
        border-top: 1px solid var(--color-std-bg-5);
        border-left: 1px solid var(--color-std-bg-5);
        border-right: 1px solid var(--color-std-bg-1);
        border-bottom: 1px solid var(--color-std-bg-1);
        border-radius: 4px;
    }
}
</style>

<script>
let timer = null
module.exports = {
    name: "app-pad-feeling",
    components: {
        "app-pad-feeling-challenge": Vue.loadComponent("app-pad-feeling-challenge.vue"),
        "app-pad-feeling-mood":      Vue.loadComponent("app-pad-feeling-mood.vue")
    },
    data: () => ({
        mood:      3,
        challenge: 3
    }),
    created () {
        /*  regularly refresh feeling  */
        setInterval(() => {
            this.huds.sendFeeling(this.mood, this.challenge)
        }, 10 * 60 * 1000)
    },
    methods: {
        sendFeeling (mood, challenge) {
            let changed = false
            if (this.mood !== mood) {
                this.mood = mood
                changed = true
            }
            if (this.challenge !== challenge) {
                this.challenge = challenge
                changed = true
            }
            if (changed) {
                if (timer !== null)
                    clearTimeout(timer)
                timer = setTimeout(() => {
                    this.huds.sendFeeling(this.mood, this.challenge)
                    timer = null
                }, 1000)
            }
        }
    }
}
</script>

