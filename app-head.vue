
<template>
    <div class="app-pad-head">
        <div class="back">
            <button v-show="$status.value.connected" @click="disconnect()">
                <i class="icon fas fa-arrow-alt-circle-left"></i><br>
            </button>
        </div>
        <h1>
            <span class="title1">HUDS</span>
            <span class="title2">Pad</span>
        </h1>
        <div class="qrcode">
            <button @click="$status.toggleQRCode()">
                <i class="icon fas fa-qrcode"></i><br>
            </button>
        </div>
    </div>
</template>

<style lang="less">
.app-pad-head {
    padding-top: 8px;
    display: flex;
    flex-direction: row;
    button {
        line-height: 12pt;
        background: none;
        cursor: pointer;
        border: 0;
        .icon {
            display: inline-block;
            color: var(--color-std-fg-1);
            font-size: 18pt;
            width: 25px;
            text-align: center;
        }
        .hoverable &:hover {
            border: 0;
            outline: none;
            color: var(--color-acc-fg-5);
            .icon {
                color: var(--color-acc-fg-1);
            }
        }
    }
    .back {
        width: 40px;
    }
    h1 {
        line-height: 0;
        margin-top: 12px;
        margin-bottom: 12px;
        text-align: center;
        flex-grow: 1;
        .title1 {
            font-weight: 900;
            letter-spacing: -1px;
            padding-left: 4px;
            padding-right: 2px;
        }
    }
}
</style>

<script>
module.exports = {
    name: "app-head",
    methods: {
        disconnect () {
            this.huds.endAttendance()
            this.huds.client.once("close", () => {
                this.$info.clearMessage()
                this.$info.clearError()
            })
            this.huds.disconnect()
        }
    }
}
</script>

