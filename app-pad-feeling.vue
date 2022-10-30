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
    <section class="app-pad-feeling">
        <h2 style="grid-area: title">FEELING</h2>
        <app-pad-slider
            style="grid-area: challenge" class="slider"
            title="CHALLENGE" left="sub" right="over"
            v-tippy="{ placement: 'top', content: 'Indicate your challenge with<br/>the current session content.', trigger: $status.value.tippyTrigger }"
            v-on:changed-value="(x) => sendFeeling(mood, x)"></app-pad-slider>
        <app-pad-slider
            style="grid-area: mood" class="slider"
            title="MOOD" left="tired" right="excited"
            v-tippy="{ placement: 'top', content: 'Indicate your mood at<br/>the current time.', trigger: $status.value.tippyTrigger }"
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
        this.$status.feelingRefreshInterval = setInterval(() => {
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

