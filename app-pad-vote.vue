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
    <section class="app-pad-vote">
        <h2 class="title" style="grid-area: title">
            {{ $t("vote.vote-label") }}
            <span v-show="$global.value.isVotingDisabled && votingChoice === ''" class="disabled">
                {{ $t("vote.until-new-label") }}
            </span>
            <span v-show="$global.value.isVotingDisabled && votingChoice !== ''" class="disabled">
                {{ $t("vote.until-end-label") }}
            </span>
        </h2>
        <button style="grid-area: button1"
            v-bind:class="{ active: votingChoice === '1' }"
            v-bind:disabled="$global.value.isVotingDisabled || $global.value.votingType !== 'quiz'"
            v-tippy="{ placement: 'top', content: $t('vote.answer-hint', { num: 1 }), trigger: $global.value.tippyTrigger }"
            @click="vote('1')">
            1
        </button>
        <button style="grid-area: button2"
            v-bind:class="{ active: votingChoice === '2' }"
            v-bind:disabled="$global.value.isVotingDisabled || $global.value.votingType !== 'quiz'"
            v-tippy="{ placement: 'top', content: $t('vote.answer-hint', { num: 2 }), trigger: $global.value.tippyTrigger }"
            @click="vote('2')">
            2
        </button>
        <button style="grid-area: button3"
            v-bind:class="{ active: votingChoice === '3' }"
            v-bind:disabled="$global.value.isVotingDisabled || $global.value.votingType !== 'quiz'"
            v-tippy="{ placement: 'top', content: $t('vote.answer-hint', { num: 3 }), trigger: $global.value.tippyTrigger }"
            @click="vote('3')">
            3
        </button>
        <button style="grid-area: button4"
            v-bind:class="{ active: votingChoice === '4' }"
            v-bind:disabled="$global.value.isVotingDisabled || $global.value.votingType !== 'quiz'"
            v-tippy="{ placement: 'top', content: $t('vote.answer-hint', { num: 4 }), trigger: $global.value.tippyTrigger }"
            @click="vote('4')">
            4
        </button>
        <button style="grid-area: button5"
            v-bind:class="{ active: votingChoice === '5' }"
            v-bind:disabled="$global.value.isVotingDisabled || $global.value.votingType !== 'quiz'"
            v-tippy="{ placement: 'top', content: $t('vote.answer-hint', { num: 5 }), trigger: $global.value.tippyTrigger }"
            @click="vote('5')">
            5
        </button>
        <button style="grid-area: button6"
            v-bind:class="{ active: votingChoice === '6' }"
            v-bind:disabled="$global.value.isVotingDisabled || $global.value.votingType !== 'quiz'"
            v-tippy="{ placement: 'top', content: $t('vote.answer-hint', { num: 6 }), trigger: $global.value.tippyTrigger }"
            @click="vote('6')">
            6
        </button>
        <button style="grid-area: button7"
            v-bind:class="{ active: votingChoice === '7' }"
            v-bind:disabled="$global.value.isVotingDisabled || $global.value.votingType !== 'quiz'"
            v-tippy="{ placement: 'top', content: $t('vote.answer-hint', { num: 7 }), trigger: $global.value.tippyTrigger }"
            @click="vote('7')">
            7
        </button>
        <button style="grid-area: button8"
            v-bind:class="{ active: votingChoice === '8' }"
            v-bind:disabled="$global.value.isVotingDisabled || $global.value.votingType !== 'quiz'"
            v-tippy="{ placement: 'top', content: $t('vote.answer-hint', { num: 8 }), trigger: $global.value.tippyTrigger }"
            @click="vote('8')">
            8
        </button>
        <button style="grid-area: button9"
            v-bind:class="{ active: votingChoice === '9' }"
            v-bind:disabled="$global.value.isVotingDisabled || $global.value.votingType !== 'quiz'"
            v-tippy="{ placement: 'top', content: $t('vote.answer-hint', { num: 9 }), trigger: $global.value.tippyTrigger }"
            @click="vote('9')">
            9
        </button>
        <button style="grid-area: choose1" class="choice"
            v-bind:class="{ active: votingChoice === 'yes' }"
            v-bind:disabled="$global.value.isVotingDisabled || $global.value.votingType !== 'judge'"
            v-tippy="{ placement: 'bottom', content: $t('vote.answer-yes-hint'), trigger: $global.value.tippyTrigger }"
            @click="vote('yes')">
            {{ $t("vote.answer-yes-label") }} <span class="icon"><i class="fas fa-thumbs-up"></i></span>
        </button>
        <button style="grid-area: choose2" class="choice"
            v-bind:class="{ active: votingChoice === 'no' }"
            v-bind:disabled="$global.value.isVotingDisabled || $global.value.votingType !== 'judge'"
            v-tippy="{ placement: 'bottom', content: $t('vote.answer-no-hint'), trigger: $global.value.tippyTrigger }"
            @click="vote('no')">
            {{ $t("vote.answer-no-label") }} <span class="icon"><i class="fas fa-thumbs-down"></i></span>
        </button>
        <button style="grid-area: abstain" class="abstain"
            v-bind:class="{ active: votingChoice === 'abstain' }"
            v-bind:disabled="$global.value.isVotingDisabled"
            v-tippy="{ placement: 'bottom', content: $t('vote.answer-abstain-hint'), trigger: $global.value.tippyTrigger }"
            @click="vote('abstain')">
            {{ $t("vote.answer-abstain-label") }} <span class="icon"><i class="fas fa-ban"></i></span>
        </button>
    </section>
</template>

<i18n lang="yaml">
en:
    vote:
        vote-label:            VOTE
        until-new-label:       (temporarily disabled until new voting starts)
        until-end-label:       (temporarily disabled until current voting ends)
        answer-hint:           "Vote for answer #{num}<br/>(one attempt only)."
        answer-yes-label:      YES
        answer-yes-hint:       Vote with a YES answer<br/>(one attempt only).
        answer-no-label:       NO
        answer-no-hint:        Vote with a NO answer<br/>(one attempt only).
        answer-abstain-label:  Abstain
        answer-abstain-hint:   Indicate your abstain<br/>from the voting<br/>(one attempt only).
de:
    vote:
        vote-label:            ABSTIMMUNG
        until-new-label:       (vorläufig gesperrt bis eine neue Abstimmung startet)
        until-end-label:       (vorläufig gesperrt bis die aktuelle Abstimmung endet)
        answer-hint:           "Stimme für Antwort #{num}<br/>(nur ein Versuch)."
        answer-yes-label:      JA
        answer-yes-hint:       Stimme mit einer JA-Antwort<br/>(nur ein Versuch).
        answer-no-label:       NEIN
        answer-no-hint:        Stimme mit einer NEIN-Antwort<br/>(nur ein Versuch).
        answer-abstain-label:  Enthalten
        answer-abstain-hint:   Zeige deine Enthaltung<br/>von der Abstimmung<br/>(nur ein Versuch).
</i18n>

<style lang="stylus">
.app-pad-vote
    display: grid
    grid-template: "title title title" "button1 button2 button3" "button4 button5 button6" "button7 button8 button9" "choose1 choose2 abstain"
    grid-template-columns: repeat(3, 1fr)
    grid-gap: 2px
    .disabled
        font-size: 9pt
        font-weight: 300
        color: var(--color-acc-fg-3)
        margin-left: 4px
    button
        cursor: pointer
        color: var(--color-std-fg-3) !important
        background-color: var(--color-std-bg-4)
        border-top: 1px solid var(--color-std-bg-5)
        border-left: 1px solid var(--color-std-bg-5)
        border-right: 1px solid var(--color-std-bg-1)
        border-bottom: 1px solid var(--color-std-bg-1)
        border-radius: 4px
        font-size: 22pt
        font-weight: 900
        line-height: 18pt
        text-align: center
        padding-top: 8px
        padding-bottom: 8px
        &.choice
            color: var(--color-std-fg-1)
            font-weight: bold
            font-size: 14pt
            .icon
                padding-left: 8px
                color: var(--color-std-fg-1)
        &.abstain
            color: var(--color-std-fg-1)
            font-weight: normal
            font-size: 14pt
            .icon
                padding-left: 8px
                color: var(--color-std-fg-1)
        .hoverable &:hover:not(:disabled)
            border: 0
            outline: none
            color: var(--color-acc-fg-5) !important
            background-color: var(--color-acc-bg-3)
            border-top: 1px solid var(--color-acc-bg-5)
            border-left: 1px solid var(--color-acc-bg-5)
            border-right: 1px solid var(--color-acc-bg-1)
            border-bottom: 1px solid var(--color-acc-bg-1)
            .icon
                color: var(--color-acc-fg-5) !important
        &:disabled
            cursor: not-allowed
            color: var(--color-std-fg-0) !important
            background-color: var(--color-std-bg-3)
            border-top: 1px solid var(--color-std-bg-5)
            border-left: 1px solid var(--color-std-bg-5)
            border-right: 1px solid var(--color-std-bg-1)
            border-bottom: 1px solid var(--color-std-bg-1)
            .icon
                color: var(--color-std-fg-0) !important
        &.active
            border: 0
            outline: none
            color: var(--color-acc-fg-5) !important
            background-color: var(--color-acc-bg-3)
            border-top: 1px solid var(--color-acc-bg-5)
            border-left: 1px solid var(--color-acc-bg-5)
            border-right: 1px solid var(--color-acc-bg-1)
            border-bottom: 1px solid var(--color-acc-bg-1)
            .icon
                color: var(--color-acc-fg-5) !important
</style>

<script setup lang="ts">
import { defineComponent } from "vue"
</script>

<script lang="ts">
export default defineComponent({
    name: "app-pad-vote",
    data: () => ({
        votingChoice: ""
    }),
    created () {
        this.$watch("$global.value.clearVoting", () => {
            this.votingChoice = ""
        })
    },
    methods: {
        vote (value: string) {
            this.huds.sendMessage(value)
            this.$global.disabledVoting(true)
            setTimeout(() => { this.votingChoice = value }, 100)
        }
    }
})
</script>

