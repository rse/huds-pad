
<template>
    <div class="app-pad-head">
        <div class="back">
            <button v-show="$status.value.connected" @click="disconnect()">
                <i class="icon fas fa-arrow-alt-circle-left"></i><br>
            </button>
        </div>
        <h1><i class="icon fas fa-thumbs-up"></i> HUDS Pad</h1>
    </div>
</template>

<style lang="less" scoped>
.app-pad-head {
    margin-top: 8px;
    display: flex;
    flex-direction: row;
    button {
        line-height: 12pt;
        background: none;
        cursor: pointer;
        border: 1px solid transparent;
        .icon {
            display: inline-block;
            color: var(--color-std-fg-1);
            font-size: 18pt;
            width: 25px;
            text-align: center;
        }
        &:hover, &:focus {
            border: 0;
            outline: none;
            color: var(--color-sig-fg-5);
            background-color: var(--color-sig-bg-3);
            border-top: 1px solid var(--color-sig-bg-5);
            border-left: 1px solid var(--color-sig-bg-5);
            border-right: 1px solid var(--color-sig-bg-1);
            border-bottom: 1px solid var(--color-sig-bg-1);
            .icon {
                color: var(--color-sig-fg-1);
            }
        }
    }
    .back {
        width: 40px;
    }
    h1 {
        line-height: 0;
        margin-top: 2px;
        margin-bottom: 20px;
        text-align: center;
        flex-grow: 1;
        position: relative;
        left: -20px;
        .icon {
            display: inline-block;
            color: var(--color-std-fg-1);
            font-size: 16pt;
            margin-right: 8px;
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
                window.location.hash = ""
                this.$info.clearMessage()
            })
            this.huds.disconnect()
        }
    }
}
</script>

