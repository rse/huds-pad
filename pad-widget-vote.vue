
<template>
    <section id="vote">
        <h2 id="title" style="grid-area: title">Vote</h2>
        <button style="grid-area: button1"
            v-bind:disabled="$status.value.isVotingDisabled"
            @click="vote('1')">
            1
        </button>
        <button style="grid-area: button2"
            v-bind:disabled="$status.value.isVotingDisabled"
            @click="vote('2')">
            2
        </button>
        <button style="grid-area: button3"
            v-bind:disabled="$status.value.isVotingDisabled"
            @click="vote('3')">
            3
        </button>
        <button style="grid-area: button4"
            v-bind:disabled="$status.value.isVotingDisabled"
            @click="vote('4')">
            4
        </button>
        <button style="grid-area: button5"
            v-bind:disabled="$status.value.isVotingDisabled"
            @click="vote('5')">
            5
        </button>
        <button style="grid-area: button6"
            v-bind:disabled="$status.value.isVotingDisabled"
            @click="vote('6')">
            6
        </button>
        <button style="grid-area: button7"
            v-bind:disabled="$status.value.isVotingDisabled"
            @click="vote('7')">
            7
        </button>
        <button style="grid-area: button8"
            v-bind:disabled="$status.value.isVotingDisabled"
            @click="vote('8')">
            8
        </button>
        <button style="grid-area: button9"
            v-bind:disabled="$status.value.isVotingDisabled"
            @click="vote('9')">
            9
        </button>
        <button style="grid-area: abstain" class="abstain"
            v-bind:disabled="$status.value.isVotingDisabled"
            @click="vote('abstain')">
            Abstain <span class="icon"><i class="fas fa-ban"></i></span>
        </button>
    </section>
</template>

<style lang="less" scoped>
#vote {
    display: grid;
    grid-template:
        "title title title"
        "button1 button2 button3"
        "button4 button5 button6"
        "button7 button8 button9"
        "abstain abstain abstain";
    grid-gap: 4px;
}

button {
    cursor: pointer;
    color: var(--color-std-fg-3) !important;
    background-color: var(--color-std-bg-3);
    border-top: 1px solid var(--color-std-bg-5);
    border-left: 1px solid var(--color-std-bg-5);
    border-right: 1px solid var(--color-std-bg-1);
    border-bottom: 1px solid var(--color-std-bg-1);
    border-radius: 4px;
    font-size: 22pt;
    font-weight: bold;
    line-height: 18pt;
    text-align: center;
    padding-top: 16px;
    padding-bottom: 16px;

    &.abstain {
        color: var(--color-std-fg-1);
        font-weight: normal;
        font-size: 14pt;
        .icon {
            font-size: 75%;
            padding-left: 8px;
            color: var(--color-std-fg-1);
        }
    }

    &:hover {
        border: 0;
        outline: none;
        color: var(--color-sig-fg-5) !important;
        background-color: var(--color-sig-bg-3);
        border-top: 1px solid var(--color-sig-bg-5);
        border-left: 1px solid var(--color-sig-bg-5);
        border-right: 1px solid var(--color-sig-bg-1);
        border-bottom: 1px solid var(--color-sig-bg-1);
        .icon {
            color: var(--color-sig-fg-5) !important;
        }
    }

    &:disabled {
        cursor: not-allowed;
        color: var(--color-std-fg-0) !important;
        background-color: var(--color-std-bg-3);
        border-top: 1px solid var(--color-std-bg-5);
        border-left: 1px solid var(--color-std-bg-5);
        border-right: 1px solid var(--color-std-bg-1);
        border-bottom: 1px solid var(--color-std-bg-1);
        .icon {
            color: var(--color-std-fg-0) !important;
        }
    }
}
</style>

<script>
module.exports = {
    name: "pad-widget-vote",
    methods: {
        vote (value) {
            this.huds.sendMessage(value)
        }
    }
}
</script>

