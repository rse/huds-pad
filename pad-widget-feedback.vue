
<template>
    <section id="feedback">
        <h2 id="title" style="grid-area: title">Feedback <span class="disabled" v-show="isFeedbackDisabled">(disabled)</span></h2>
        <button style="grid-area: button1"
            v-bind:disabled="isFeedbackDisabled"
            @click="sendFeedback('thumbsup')">
            <i class="icon fas fa-thumbs-up"></i>
            <span class="title">Show<br/>Consent</span>
        </button>
        <button style="grid-area: button2"
            v-bind:disabled="isFeedbackDisabled"
            @click="sendFeedback('thumbsdn')">
            <i class="icon fas fa-thumbs-down"></i>
            <span class="title">Show<br/>Refusal</span>
        </button>
        <button style="grid-area: button3"
            v-bind:disabled="isFeedbackDisabled"
            @click="sendFeedback('surprise')">
            <i class="icon fas fa-surprise"></i>
            <span class="title">Show<br/>Surprise</span>
        </button>
        <button style="grid-area: button4"
            v-bind:disabled="isFeedbackDisabled"
            @click="sendFeedback('smile')">
            <i class="icon fas fa-grin-wink"></i>
            <span class="title">Show<br/>Smile</span>
        </button>
        <button style="grid-area: button5"
            v-bind:disabled="isFeedbackDisabled"
            @click="sendFeedback('frown')">
            <i class="icon fas fa-angry"></i>
            <span class="title">Show<br/>Frown</span>
        </button>
        <button style="grid-area: button6"
            v-bind:disabled="isFeedbackDisabled"
            @click="sendFeedback('sadness')">
            <i class="icon fas fa-sad-tear"></i>
            <span class="title">Show<br/>Sadness</span>
        </button>
    </section>
</template>

<style lang="less" scoped>
#feedback {
    display: grid;
    grid-template:
         "title title title title title title"
         "button1 button2 button3 button4 button5 button6";
    grid-gap: 4px;
}

.disabled {
    font-size: 8pt;
    font-weight: 200;
    color: var(--color-acc-fg-3);
}

button {
    cursor: pointer;
    color: var(--color-std-fg-3);
    background-color: var(--color-std-bg-3);
    border-top: 1px solid var(--color-std-bg-5);
    border-left: 1px solid var(--color-std-bg-5);
    border-right: 1px solid var(--color-std-bg-1);
    border-bottom: 1px solid var(--color-std-bg-1);
    border-radius: 4px;
    font-size: 24pt;
    text-align: center;
    line-height: 0;
    padding-top: 8px;
    padding-bottom: 8px;
    padding-left: 0;
    padding-right: 0;

    .icon {
        width: 100%;
        padding-bottom: 3px;
    }

    .title {
        font-weight: 300;
        font-size: 7pt;
        text-align: center;
        line-height: 7pt;
    }

    &:hover {
        border: 0;
        outline: none;
        color: var(--color-sig-fg-5);
        background-color: var(--color-sig-bg-3);
        border-top: 1px solid var(--color-sig-bg-5);
        border-left: 1px solid var(--color-sig-bg-5);
        border-right: 1px solid var(--color-sig-bg-1);
        border-bottom: 1px solid var(--color-sig-bg-1);
    }

    &:disabled {
        cursor: not-allowed;
        color: var(--color-std-fg-0);
        background-color: var(--color-std-bg-3);
        border-top: 1px solid var(--color-std-bg-5);
        border-left: 1px solid var(--color-std-bg-5);
        border-right: 1px solid var(--color-std-bg-1);
        border-bottom: 1px solid var(--color-std-bg-1);

        .icon {
            color: var(--color-std-fg-0);
        }
    }
}
</style>

<script>
module.exports = {
    name: "pad-widget-feedback",
    data: () => ({
        isFeedbackDisabled: false
    }),
    methods: {
        sendFeedback (value) {
            if (this.isFeedbackDisabled)
                return
            this.isFeedbackDisabled = true
            this.huds.sendFeedback(value)
            setTimeout(() => {
                this.isFeedbackDisabled = false
            }, 30 * 1000)
        }
    }
}
</script>

