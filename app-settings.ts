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

import URI          from "urijs"
import jsYAML       from "js-yaml"
import objectPath   from "object-path"
import mergeOptions from "merge-options"
import * as arktype from "arktype"

export const opts = arktype.type({
    huds: {
        api:        "'mqtt'|'rest'",
        url:        /^(?:http|ws)s?:\/\/.+/,
        peer:       "string"
    },
    ui: {
        theme:      "string",
        language:   "string",
        hints:      "boolean",
        debug:      "boolean",
        title1:     "string",
        title2:     "string",
        title:      "boolean",
        about:      "boolean",
        info:       "boolean",
        attendees:  "boolean",
        traffic:    "boolean",
        online:     "boolean",
        qrcode:     "boolean",
        config:     "boolean",
        theming:    "boolean",
        token:      "boolean",
        connect:    "boolean",
        slogan:     "boolean",
        disconnect: "boolean",
        name:       "boolean",
        message:    "boolean",
        vote:       "boolean",
        feedback:   "boolean",
        feeling:    "boolean",
        anonymous:  "boolean"
    }
})

export default class Settings {
    public  args:        string[]
    private argsDefault: string[]
    public  opts:        typeof opts.infer
    private optsDefault: typeof opts.infer

    constructor () {
        /*  initialize arguments  */
        this.argsDefault = []
        this.args = this.argsDefault

        /*  initialize settings  */
        const { data, problems } = opts({
            huds: {
                api:        "mqtt",
                url:        "wss://pad.huds.io/mqtt/",
                peer:       "live-sender"
            },
            ui: {
                theme:      "dark",
                language:   "en",
                hints:      true,
                debug:      false,
                title1:     "HUDS",
                title2:     "Pad",
                title:      true,
                about:      true,
                info:       true,
                attendees:  true,
                traffic:    true,
                online:     true,
                qrcode:     true,
                config:     true,
                theming:    true,
                token:      true,
                connect:    true,
                slogan:     true,
                disconnect: true,
                name:       true,
                message:    true,
                vote:       true,
                feedback:   true,
                feeling:    true,
                anonymous:  true
            }
        })
        if (!data)
            throw new Error(`failed to create settings options default: ${problems.summary}`)
        this.optsDefault = data
        this.opts = this.optsDefault
    }

    /*  initialize settings  */
    async init () {
        /*  load persistent settings  */
        const url = new URL("app.yaml", import.meta.url).href
        const yaml = await fetch(url, {
            method: "GET",
            credentials: "same-origin"
        }).then((response) => response.text())
        const { data: data2, problems: problems2 } = opts(jsYAML.load(yaml))
        if (!data2)
            throw new Error(`failed to create load setting options: ${problems2.summary}`)

        /*  merge options  */
        this.optsDefault = mergeOptions(this.optsDefault, data2)

        /*  initially create final options  */
        this.importFromHash()
    }

    /*  import settings from URL hash  */
    importFromHash () {
        /*  override settings with URL parameters  */
        const url = new URI(new URI(window.location.href).hash().replace(/^#/, ""))
        this.args = url.segment()
        this.opts = mergeOptions(this.optsDefault, {})
        const params = Object.fromEntries(Object.entries(url.search(true)).map(([ key, val ]) => {
            if      (val === null)                     val = true
            else if (val === "true"  || val === "yes") val = true
            else if (val === "false" || val === "no")  val = false
            let m
            if ((m = key.match(/^!(.+)$/)) !== null) {
                key = m[1]
                val = !val
            }
            return [ key, val ]
        }))
        for (const [ key, val ] of Object.entries(params)) {
            if (!objectPath.has(this.opts, key))
                throw new Error(`invalid settings options path "${key}"`)
            objectPath.set(this.opts, key, val)
        }

        /*  optionally automatically determine HUDS URL  */
        if (this.opts.huds.url === "auto") {
            const url2 = url.clone().search("").hash("")
            if (this.opts.huds.api === "mqtt") {
                if (url2.protocol() === "http")
                    url2.protocol("ws")
                else if (url2.protocol() === "https")
                    url2.protocol("wss")
                url2.pathname("/mqtt/")
            }
            else if (this.opts.huds.api === "rest")
                url2.pathname("/api/")
            this.opts.huds.url = url2.toString()
        }
    }

    /*  export settings to URL hash  */
    exportToHash () {
        const url = new URI("")
        url.path(this.args.join("/"))
        const walk = (out: any, def: any, obj: any, prefix: string) => {
            for (const key of Object.keys(obj)) {
                if (typeof obj[key] === "object")
                    walk(out, def[key], obj[key], `${prefix}${key}.`)
                else {
                    const valDef = def[key]
                    let val = obj[key]
                    if (val !== valDef) {
                        if (typeof val === "boolean" && val)
                            val = null
                        else if (typeof val === "boolean" && !val) {
                            val = null
                            prefix = `!${prefix}`
                        }
                        else
                            val = val.toString()
                        out[`${prefix}${key}`] = val
                    }
                }
            }
            return out
        }
        url.search(walk([], this.optsDefault, this.opts, ""))
        window.location.hash = url.toString()
    }
}

