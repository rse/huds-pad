
<template>
    <div class="app-qrcode">
        <h2 class="title" style="grid-area: title">
            QRCODE
        </h2>
        <div class="qrcode">
            <canvas ref="qrcode" class="canvas"></canvas>
            <div class="url">{{ url }}</div>
        </div>
    </div>
</template>

<style lang="less">
.app-qrcode {
    display: grid;
    grid-template:
        "title"
        "qrcode";
    grid-gap: 2px;
    .qrcode {
        background-color: var(--color-std-bg-2);
        border-top: 1px solid var(--color-std-bg-1);
        border-left: 1px solid var(--color-std-bg-1);
        border-right: 1px solid var(--color-std-bg-5);
        border-bottom: 1px solid var(--color-std-bg-5);
        border-radius: 4px;
        width: 100%;
        text-align: center;
        .url {
            margin-top: -10px;
            margin-bottom: 20px;
            color: var(--color-acc-fg-5);
        }
    }
}
</style>

<script>
module.exports = {
    name: "app-qrcode",
    data: () => ({
        url: window.location.href
    }),
    created () {
        window.addEventListener("hashchange", () => {
            this.url = window.location.href
        }, false)
    },
    mounted () {
        QRCode.toCanvas(this.$refs.qrcode, window.location.href, {
            errorCorrectionLevel: "M",
            width: Math.min(350, window.innerWidth - 25),
            color: {
                dark:  "#ffffffff",
                light: "#00000000"
            }
        }, () => {})
    }
}
</script>

