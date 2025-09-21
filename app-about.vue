<!--
**
**  HUDS - Head-Up-Display Server (HUDS)
**  Copyright (c) 2022-2024 Dr. Ralf S. Engelschall <rse@engelschall.com>
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
    <div class="app-about">
        <h2 class="title" style="grid-area: title">
            {{ $t("about.about-label") }}
        </h2>
        <div class="about" v-html="$t('about.about-text', {
            version: $global.value.pkg.version, mode: env.MODE })">
        </div>
    </div>
</template>

<i18n lang="yaml">
en:
    about:
        about-label:         ABOUT
        about-text: |
            This is <a target="_blank" href="https://github.com/rse/huds-pad"><b>HUDS Pad</b></a>,
            version <b>{version}</b> ({mode}),
            the attendee client-side web application (for desktop and mobile devices) for interacting
            with a live session, leveraging
            <a target="_blank" href="https://engelschall.com">Dr. Ralf S. Engelschall</a>'s
            <a target="_blank" href="https://github.com/rse/huds">Head-Up-Display Server (HUDS)</a> and its
            <a target="_blank" href="https://github.com/rse/huds-hud-training">Training HUD</a>.
            <p>
            It allows attendees to anonymously send textual messages, give their vote on proposals,
            judgements and quizzes, send feedback with emojis, and share their feeling through
            challenge and mood indicators.
            </p>
de:
    about:
        about-label:         ÜBER
        about-text: |
            Dies ist <a target="_blank" href="https://github.com/rse/huds-pad"><b>HUDS Pad</b></a>,
            Version <b>{version}</b> ({mode}),
            die Client-seitige Web Anwendung (für Desktop und mobile Geräte) von Teilnehmern, um
            an einer Live-Session teilzunehmen, welche
            <a target="_blank" href="https://engelschall.com">Dr. Ralf S. Engelschall</a>'s
            <a target="_blank" href="https://github.com/rse/huds">Head-Up-Display Server (HUDS)</a> und sein
            <a target="_blank" href="https://github.com/rse/huds-hud-training">Training HUD</a> nutzt.
            <p>
            Es ermöglicht Teilnehmern, anonym Textnachrichten zu senden,
            ihre Stimme zu Vorschlägen, Beurteilungen und Quizze abzugeben,
            Feedback mit Emojis zu senden und ihre Gefühle durch
            Herausforderungs- und Stimmungs-Indikatoren zu teilen.
            </p>
</i18n>

<style lang="stylus">
.app-about
    display: grid
    grid-template: "title" "about"
    gap: 2px
    .about
        background-color:        var(--color-std-bg-2)
        border-top:    1px solid var(--color-std-bg-1)
        border-left:   1px solid var(--color-std-bg-1)
        border-right:  1px solid var(--color-std-bg-5)
        border-bottom: 1px solid var(--color-std-bg-5)
        border-radius: 4px
        width: calc(100% - 40px)
        padding: 20px
        font-size: 12pt
        line-height: 125%
        p
            margin: 0
            margin-top: 6px
            padding: 0
            text-indent: 30px
</style>

<script setup lang="ts">
import { defineComponent } from "vue"
</script>

<script lang="ts">
export default defineComponent({
    name: "app-about",
    data: () => ({
        env: import.meta.env
    })
})
</script>

