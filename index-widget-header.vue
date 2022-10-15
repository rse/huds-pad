
<template>
    <div id="pad-widget-title">
        <button v-if="showDisconnect" @click="disconnect()">
            <i class="icon fas fa-arrow-alt-circle-left"></i><br>
        </button>
        <h1>Huds Pad</h1>
    </div>
</template>

<style lang="less" scoped>
#pad-widget-title {
    display: flex;
    flex-direction: row;
}

button {
    line-height: 12pt;
    background: none;
    cursor: pointer;
    border: 1px solid transparent;

    .icon {
        display: inline-block;
        font-size: 18pt;
        width: 25px;
        text-align: center;
    }

    &:hover, &:focus {
        border: 0;
        outline: none;
        color: var(--color-sig-fg-5);
        background-color: var(--color-sig-bg-3);
        border-top: 1px solid var(--color-sig-bg-1);
        border-left: 1px solid var(--color-sig-bg-1);
        border-right: 1px solid var(--color-sig-bg-5);
        border-bottom: 1px solid var(--color-sig-bg-5);
    }
}

h1 {
    line-height: 0;
}
</style>

<script>
module.exports = {
    name: "index-widget-header",
    props: [ "showDisconnect" ],
    methods: {
        disconnect () {
            this.huds.endAttendance()
            this.huds.client.on("close", () => {
                window.location.hash = ""
                this.$info.clearMessage()
                this.$status.setConnectionClosed()
            })
            this.huds.disconnect()
        }
    }
}
</script>

