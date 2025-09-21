/*
**  HUDS -- Head-Up-Display Server (HUDS)
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
*/

import * as Vite         from "vite"
import VuePlugin         from "@vitejs/plugin-vue"
import SVGPlugin         from "vite-svg-loader"
import I18NPlugin        from "@intlify/unplugin-vue-i18n/vite"
import { nodePolyfills } from "vite-plugin-node-polyfills"

export default Vite.defineConfig({
    base: "",
    assetsInclude: [ "app.yaml" ],
    plugins: [
        VuePlugin(),
        SVGPlugin(),
        I18NPlugin({
            strictMessage:   false,
            escapeHtml:      false,
            runtimeOnly:     true,
            compositionOnly: false,
            defaultSFCLang:  "yaml",
            globalSFCScope:  true
        }),
        nodePolyfills({
            globals: {
                Buffer: true,
                global: true
            },
            protocolImports: true
        })
    ],
    build: {
        outDir:                 "dist",
        assetsDir:              "",
        chunkSizeWarningLimit:  3000,
        assetsInlineLimit:      0,
        rollupOptions: {
            output: {
                entryFileNames: "[name].js",
                chunkFileNames: "[name]-[hash:8].js",
                assetFileNames: (assetInfo) => {
                    let spec = "asset-[name]-[hash:8].[ext]"
                    if (assetInfo.name === "app.yaml")
                        spec = "index.yaml"
                    return spec
                },
                manualChunks: (id) => {
                    if (id.includes("node_modules"))
                        return "vendor"
                }
            }
        }
    },
    server: {
        host: "0.0.0.0",
        port: 8080,
        cors: true
    },
    preview: {
        host: "0.0.0.0",
        port: 8080,
        cors: true
    }
})

