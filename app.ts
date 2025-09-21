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

/* eslint @typescript-eslint/triple-slash-reference: off */
/// <reference path="./app.d.ts" />

/*  import external dependencies (code)  */
import * as Vue         from "vue"
import VueTippy         from "vue-tippy"
import * as VueI18N     from "vue-i18n"
import FontFaceObserver from "fontfaceobserver"

/*  import external dependencies (style)  */
import                       "tippy.js/dist/tippy.css"
import                       "tippy.js/dist/svg-arrow.css"
import                       "tippy.js/themes/translucent.css"
import                       "typopro-web/web/TypoPRO-SourceSansPro/TypoPRO-SourceSansPro-Light.css"
import                       "typopro-web/web/TypoPRO-SourceSansPro/TypoPRO-SourceSansPro-Regular.css"
import                       "typopro-web/web/TypoPRO-SourceSansPro/TypoPRO-SourceSansPro-Bold.css"
import                       "typopro-web/web/TypoPRO-SourceSansPro/TypoPRO-SourceSansPro-Black.css"
import                       "@fortawesome/fontawesome-free/js/all.min.js"
import                       "@fortawesome/fontawesome-free/css/all.min.css"

/*  import internal dependencies (code)  */
import App              from "./app.vue"
import Settings         from "./app-settings"
import HUDS             from "./app-huds"
import global           from "./app-global"
import pkg              from "./package.json"

/*  import internal dependencies (style)  */
import                       "./app.styl"

document.addEventListener("DOMContentLoaded", (ev: Event) => {
    (async () => {
        /*  initialize user interface  */
        const app = Vue.createApp(App)

        /*  add Vue tooltip plugin  */
        app.use(VueTippy, {
            defaultProps: {
                touch: false,
                allowHTML: true,
                placement: "right",
                theme: "translucent",
                delay: [ 600, 50 ],
                appendTo: () => document.getElementsByClassName("app")[0]
            }
        })

        /*  provide Vue "settings" property  */
        const settings = new Settings()
        await settings.init()
        settings.importFromLocalStorage()
        settings.importFromHash()
        settings.exportToLocalStorage()
        settings.exportToHash()
        app.config.globalProperties.settings = settings

        /*  optionally inject custom CSS/JS  */
        if (settings.opts.custom.css) {
            const head = document.getElementsByTagName("head")[0]
            const link = document.createElement("link")
            link.rel   = "stylesheet"
            link.type  = "text/css"
            link.href  = "app.css"
            head.appendChild(link)
        }
        if (settings.opts.custom.js) {
            const head   = document.getElementsByTagName("head")[0]
            const script = document.createElement("script")
            script.type  = "text/javascript"
            script.src   = "app.js"
            head.appendChild(script)
        }

        /*  provide Vue "$global" property  */
        global.setPkg(pkg)
        global.setTheme(settings.opts.ui.theme)
        global.setHints(settings.opts.ui.hints)
        global.setDebug(settings.opts.ui.debug)
        app.config.globalProperties.$global = global

        /*  provide Vue "huds" property  */
        const huds = new HUDS(settings.opts.huds)
        app.config.globalProperties.huds = huds

        /*  add Vue I18N plugin  */
        app.use(VueI18N.createI18n({
            locale: settings.opts.ui.language,
            fallbackLocale: "en",
            messages: { "en": {}, "de": {} }
        }))

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
        app.mount("body")
    })().catch((err) => {
        console.error(`HUDS Pad: ERROR: top-level: ${err}`)
    })
})

