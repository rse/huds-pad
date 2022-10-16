
<template>
    <section class="app-pad-feeling">
        <h2 style="grid-area: title">FEELING</h2>
        <app-pad-slider
            style="grid-area: challenge" class="slider"
            title="CHALLENGE" left="sub" right="over"
            v-on:changed-value="(x) => sendFeeling(mood, x)"></app-pad-slider>
        <app-pad-slider
            style="grid-area: mood" class="slider"
            title="MOOD" left="tired" right="excited"
            v-on:changed-value="(x) => sendFeeling(x, challenge)"></app-pad-slider>
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
        "app-pad-slider": Vue.loadComponent("app-pad-slider.vue")
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

