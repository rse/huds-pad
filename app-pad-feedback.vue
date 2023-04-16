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
    <section class="app-pad-feedback">
        <h2 style="grid-area: title">
            {{ $t("feedback.feedback-label") }}
            <span v-show="isFeedbackDisabled" class="disabled">
                {{ $t("feedback.disabled-label") }}
            </span>
        </h2>
        <button style="grid-area: button1"
            v-bind:disabled="isFeedbackDisabled"
            v-tippy="{ placement: 'top', content: $t('feedback.consent-hint'), trigger: $global.value.tippyTrigger }"
            @click="sendFeedback('thumbsup')">
            <i class="icon positive fas fa-thumbs-up"></i>
            <span class="title positive">{{ $t("feedback.consent-label") }}</span>
        </button>
        <button style="grid-area: button2"
            v-bind:disabled="isFeedbackDisabled"
            v-tippy="{ placement: 'top', content: $t('feedback.refusal-hint'), trigger: $global.value.tippyTrigger }"
            @click="sendFeedback('thumbsdn')">
            <i class="icon fas fa-thumbs-down"></i>
            <span class="title">{{ $t("feedback.refusal-label") }}</span>
        </button>
        <button style="grid-area: button3"
            v-bind:disabled="isFeedbackDisabled"
            v-tippy="{ placement: 'top', content: $t('feedback.surprise-hint'), trigger: $global.value.tippyTrigger }"
            @click="sendFeedback('surprise')">
            <i class="icon positive fas fa-surprise"></i>
            <span class="title positive">{{ $t("feedback.surprise-label") }}</span>
        </button>
        <button style="grid-area: button4"
            v-bind:disabled="isFeedbackDisabled"
            v-tippy="{ placement: 'top', content: $t('feedback.smile-hint'), trigger: $global.value.tippyTrigger }"
            @click="sendFeedback('smile')">
            <i class="icon positive fas fa-grin-wink"></i>
            <span class="title positive">{{ $t("feedback.smile-label") }}</span>
        </button>
        <button style="grid-area: button5"
            v-bind:disabled="isFeedbackDisabled"
            v-tippy="{ placement: 'top', content: $t('feedback.frown-hint'), trigger: $global.value.tippyTrigger }"
            @click="sendFeedback('frown')">
            <i class="icon fas fa-angry"></i>
            <span class="title">{{ $t("feedback.frown-label") }}</span>
        </button>
        <button style="grid-area: button6"
            v-bind:disabled="isFeedbackDisabled"
            v-tippy="{ placement: 'top', content: $t('feedback.sadness-hint'), trigger: $global.value.tippyTrigger }"
            @click="sendFeedback('sadness')">
            <i class="icon fas fa-sad-tear"></i>
            <span class="title">{{ $t("feedback.sadness-label") }}</span>
        </button>
    </section>
</template>

<i18n lang="yaml">
en:
    feedback:
        feedback-label:    FEEDBACK
        disabled-label:    (temporarily disabled for throttling reasons)
        consent-label:     Consent
        consent-hint:      Indicate your consent with<br/>the current content.
        refusal-label:     Refusal
        refusal-hint:      Indicate your refusal with<br/>the current content.
        surprise-label:    Surprise
        surprise-hint:     Indicate your surprise with<br/>the current content.
        smile-label:       Smile
        smile-hint:        Indicate your smile with<br/>the current content.
        frown-label:       Frown
        frown-hint:        Indicate your frown with<br/>the current content.
        sadness-label:     Sadness
        sadness-hint:      Indicate your sadness with<br/>the current content.
de:
    feedback:
        feedback-label:    RÜCKMELDUNG
        disabled-label:    (vorläufig gesperrt aus Drosselungsgründen)
        consent-label:     Zustimmung
        consent-hint:      Zeige deine Zustimmung<br/>zum actuellen Inhalt.
        refusal-label:     Ablehnung
        refusal-hint:      Zeige deine Ablehnung<br/>zum aktuellen Inhalt.
        surprise-label:    Überraschung
        surprise-hint:     Zeige deine Überraschung<br/>zum aktuellen Inhalt.
        smile-label:       Lächeln
        smile-hint:        Zeige dein Lächeln<br/>zum aktuellen Inhalt.
        frown-label:       Stirnrunzeln
        frown-hint:        Zeige dein Stirnrunzeln<br/>zum aktuellen Inhalt.
        sadness-label:     Traurigkeit
        sadness-hint:      Zeige deine Traurigkeit<br/>zum aktuellen Inhalt.
</i18n>


<style lang="stylus">
.app-pad-feedback
    display: grid
    grid-template: "title title title title title title" "button1 button2 button3 button4 button5 button6"
    grid-template-columns: repeat(6, minmax(45px, 1fr))
    grid-gap: 2px
    .disabled
        font-size: 9pt
        font-weight: 300
        color: var(--color-acc-fg-3)
        margin-left: 4px
    button
        cursor: pointer
        color: var(--color-std-fg-3)
        background-color: var(--color-std-bg-4)
        border-top: 1px solid var(--color-std-bg-5)
        border-left: 1px solid var(--color-std-bg-5)
        border-right: 1px solid var(--color-std-bg-1)
        border-bottom: 1px solid var(--color-std-bg-1)
        border-radius: 4px
        font-size: 22pt
        text-align: center
        line-height: 0
        padding: 8px 0
        .icon
            width: 100%
            padding-bottom: 6px
            &.positive
                color: var(--color-acc-fg-3)
        .title
            font-weight: normal
            font-size: 8pt
            text-align: center
            line-height: 8pt
            &.positive
                color: var(--color-acc-fg-3)
        .hoverable &:hover:not(:disabled)
            border: 0
            outline: none
            color: var(--color-acc-fg-5)
            background-color: var(--color-acc-bg-3)
            border-top: 1px solid var(--color-acc-bg-5)
            border-left: 1px solid var(--color-acc-bg-5)
            border-right: 1px solid var(--color-acc-bg-1)
            border-bottom: 1px solid var(--color-acc-bg-1)
        &:disabled
            cursor: not-allowed
            color: var(--color-std-fg-0)
            background-color: var(--color-std-bg-3)
            border-top: 1px solid var(--color-std-bg-5)
            border-left: 1px solid var(--color-std-bg-5)
            border-right: 1px solid var(--color-std-bg-1)
            border-bottom: 1px solid var(--color-std-bg-1)
            .icon
                color: var(--color-std-fg-0)
                &.positive
                    color: var(--color-acc-fg-0)
            .title
                color: var(--color-std-fg-0)
                &.positive
                    color: var(--color-acc-fg-0)
</style>

<script setup lang="ts">
import { defineComponent } from "vue"
</script>

<script lang="ts">
export default defineComponent({
    name: "app-pad-feedback",
    data: () => ({
        isFeedbackDisabled: false
    }),
    methods: {
        sendFeedback (value: string) {
            if (this.isFeedbackDisabled)
                return
            this.isFeedbackDisabled = true
            this.huds.sendFeedback(value)
            setTimeout(() => {
                this.isFeedbackDisabled = false
            }, 30 * 1000)
        }
    }
})
</script>

