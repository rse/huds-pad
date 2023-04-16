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
        <h2 style="grid-area: title">{{ $t("feeling.feeling-label") }}</h2>
        <app-pad-slider
            style="grid-area: challenge" class="slider"
            v-bind:title="$t('feeling.challenge-label')"
            v-bind:left="$t('feeling.challenge-sub-label')"
            v-bind:right="$t('feeling.challenge-over-label')"
            v-tippy="{ placement: 'top', content: $t('feeling.challenge-hint'), trigger: $global.value.tippyTrigger }"
            v-on:changed-value="(x) => sendFeeling(mood, x)"></app-pad-slider>
        <app-pad-slider
            style="grid-area: mood" class="slider"
            v-bind:title="$t('feeling.mood-label')"
            v-bind:left="$t('feeling.mood-tired-label')"
            v-bind:right="$t('feeling.mood-fresh-label')"
            v-tippy="{ placement: 'top', content: $t('feeling.mood-hint'), trigger: $global.value.tippyTrigger }"
            v-on:changed-value="(x) => sendFeeling(x, challenge)"></app-pad-slider>
    </section>
</template>

<i18n lang="yaml">
en:
    feeling:
        feeling-label:         FEELING
        challenge-label:       CHALLENGE
        challenge-hint:        Indicate your challenge with<br/>the current content.
        challenge-sub-label:   sub
        challenge-over-label:  over
        mood-label:            MOOD
        mood-hint:             Indicate your mood at<br/>the current time.
        mood-tired-label:      tired
        mood-fresh-label:      fresh
de:
    feeling:
        feeling-label:         BEFINDEN
        challenge-label:       FORDERUNG
        challenge-hint:        Zeige deine Forderung durch<br/>den aktuellen Inhalt.
        challenge-sub-label:   unter
        challenge-over-label:  über
        mood-label:            STIMMUNG
        mood-hint:             Zeige deine Stimmung zum<br/>aktuellen Zeitpunkt.
        mood-tired-label:      müde
        mood-fresh-label:      frisch
</i18n>

<style lang="stylus">
.app-pad-feeling
    display: grid
    grid-template: "title title" "challenge mood"
    grid-gap: 2px
    .slider
        color: var(--color-std-fg-3)
        background-color: var(--color-std-bg-4)
        border-top: 1px solid var(--color-std-bg-5)
        border-left: 1px solid var(--color-std-bg-5)
        border-right: 1px solid var(--color-std-bg-1)
        border-bottom: 1px solid var(--color-std-bg-1)
        border-radius: 4px
</style>

<script setup lang="ts">
import { defineComponent } from "vue"
import AppPadSlider from "./app-pad-slider.vue"
</script>

<script lang="ts">
let timer: ReturnType<typeof setTimeout> | null = null
export default defineComponent({
    name: "app-pad-feeling",
    components: {
        "app-pad-slider": AppPadSlider
    },
    data: () => ({
        mood:      3,
        challenge: 3
    }),
    created () {
        /*  regularly refresh feeling  */
        this.$global.value.feelingRefreshInterval = setInterval(() => {
            if (this.huds?.isConnected())
                this.huds.sendFeeling(this.mood, this.challenge)
        }, 10 * 60 * 1000)
    },
    methods: {
        sendFeeling (mood: number, challenge: number) {
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
})
</script>

