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

