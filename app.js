/*
**  HUDS -- Head-Up-Display Server (HUDS)
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
*/

import HUDS   from "./app-huds.js"
import global from "./app-global.js"

/*  main application  */
const App = class App {
    static main () {
        (async () => {
            /*  provide custom Vue loader  */
            Vue.load = (name) => {
                return window["vue3-sfc-loader"].loadModule(name, {
                    moduleCache: { vue: Vue, less },
                    getFile (url) {
                        return fetch(url).then((res) => res.ok ?
                            res.text() :
                            Promise.reject(Object.assign(new Error(`${url}: ${res.statusText}`), { res })))
                    },
                    addStyle (textContent) {
                        const style = Object.assign(document.createElement("style"), { textContent })
                        const ref = document.head.getElementsByTagName("style")[0] || null
                        document.head.insertBefore(style, ref)
                    },
                    log (type, ...args) {
                        console.log("vue3-sfc-loader", type, ...args)
                    },
                    additionalModuleHandlers: {
                        ".css": (source, path, options) =>
                            less.render(source, { globalVars: {} }).then((result) => result.css)
                    }
                })
            }
            Vue.loadComponent = (name) =>
                Vue.defineAsyncComponent(() => Vue.load(name))

            /*  initialize user interface  */
            const app = Vue.createApp({ components: { "app": Vue.loadComponent("app.vue") } })

            /*  add Vue tooltip plugin  */
            app.use(VueTippy.plugin, {
                defaultProps: {
                    touch: false,
                    allowHTML: true,
                    placement: "right",
                    theme: "translucent",
                    delay: [ 600, 50 ]
                }
            })

            /*  provide global properties  */
            app.config.globalProperties.$status = global.$status
            app.config.globalProperties.$info   = global.$info

            /*  provide global Vue "huds" property  */
            const huds = new HUDS()
            await huds.load("app.yaml")
            app.config.globalProperties.huds = huds

            /*  load program information  */
            const data = await fetch("package.json", {
                method: "GET",
                credentials: "same-origin"
            }).then((response) => response.text())
            app.config.globalProperties.pkg = JSON.parse(data)

            /*  ensure all fonts are loaded  */
            const fonts = [
                { family: "TypoPRO Source Sans Pro", spec: { weight: 300 } },
                { family: "TypoPRO Source Sans Pro", spec: { weight: 400 } },
                { family: "TypoPRO Source Sans Pro", spec: { weight: 700 } },
                { family: "TypoPRO Source Sans Pro", spec: { weight: 900 } }
            ]
            await Promise.all(fonts.map((font) => (new FontFaceObserver(font.family, font.spec)).load(null, 3000)))
                .catch(() => true)

            /*  finally mount user interface  */
            app.mount("#app")
        })().catch((err) => {
            console.error(`app: ERROR: top-level: ${err}`)
        })
    }
}

/*  bootstrap application  */
App.main()

