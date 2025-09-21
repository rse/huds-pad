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

import pluginJs      from "@eslint/js"
import pluginStd     from "neostandard"
import pluginN       from "eslint-plugin-n"
import pluginImport  from "eslint-plugin-import"
import pluginPromise from "eslint-plugin-promise"
import pluginVue     from "eslint-plugin-vue"
import pluginTS      from "typescript-eslint"
import globals       from "globals"
import parserTS      from "@typescript-eslint/parser"
import parserVue     from "vue-eslint-parser"

export default [
    pluginJs.configs.recommended,
    ...pluginTS.configs.strict,
    ...pluginTS.configs.stylistic,
    ...pluginStd({
        ignores: pluginStd.resolveIgnoresFromGitignore()
    }),
    ...pluginVue.configs["flat/recommended"],
    {
        plugins: {
            "n":       pluginN,
            "import":  pluginImport,
            "promise": pluginPromise
        },
        files:   [ "**/*.vue", "**/*.ts" ],
        ignores: [ "dist/" ],
        languageOptions: {
            ecmaVersion: 2024,
            sourceType:  "module",
            parser: parserVue,
            parserOptions: {
                parser: parserTS,
                extraFileExtensions: [],
                ecmaFeatures: {
                    jsx: false
                }
            },
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.commonjs,
                ...globals.worker,
                ...globals.serviceworker,
                "BufferEncoding": "readonly"
            }
        },
        rules: {
            "curly":                                              "off",
            "require-atomic-updates":                             "off",
            "dot-notation":                                       "off",
            "no-labels":                                          "off",
            "no-useless-constructor":                             "off",
            "no-dupe-class-members":                              "off",
            "valid-typeof":                                       "off",
            "no-void":                                            "off",

            "@stylistic/indent":                                  [ "error", 4, { SwitchCase: 1 } ],
            "@stylistic/linebreak-style":                         [ "error", "unix" ],
            "@stylistic/semi":                                    [ "error", "never" ],
            "@stylistic/operator-linebreak":                      [ "error", "after", { overrides: { "&&": "before", "||": "before", ":": "after" } } ],
            "@stylistic/brace-style":                             [ "error", "stroustrup", { allowSingleLine: true } ],
            "@stylistic/quotes":                                  [ "error", "double" ],

            "@stylistic/no-multi-spaces":                         "off",
            "@stylistic/no-multiple-empty-lines":                 "off",
            "@stylistic/key-spacing":                             "off",
            "@stylistic/object-property-newline":                 "off",
            "@stylistic/space-in-parens":                         "off",
            "@stylistic/array-bracket-spacing":                   "off",
            "@stylistic/lines-between-class-members":             "off",
            "@stylistic/multiline-ternary":                       "off",
            "@stylistic/quote-props":                             "off",

            "vue/html-indent":                                    "off",
            "vue/v-bind-style":                                   [ "error", "longform" ],
            "vue/max-attributes-per-line":                        "off",
            "vue/html-self-closing":                              "off",
            "vue/no-multi-spaces":                                "off",
            "vue/html-closing-bracket-newline":                   "off",
            "vue/html-closing-bracket-spacing":                   "off",
            "vue/singleline-html-element-content-newline":        "off",
            "vue/no-v-html":                                      "off",
            "vue/v-on-style":                                     "off",
            "vue/component-tags-order":                           "off",
            "vue/first-attribute-linebreak":                      "off",
            "vue/attributes-order":                               "off",
            "vue/component-definition-name-casing":               "off",
            "vue/block-order":                                    "off",

            "@typescript-eslint/no-empty-function":               "off",
            "@typescript-eslint/no-explicit-any":                 "off",
            "@typescript-eslint/no-unused-vars":                  "off",
            "@typescript-eslint/ban-ts-comment":                  "off",
            "@typescript-eslint/no-this-alias":                   "off",
            "@typescript-eslint/no-non-null-assertion":           "off",
            "@typescript-eslint/consistent-type-definitions":     "off",
            "@typescript-eslint/array-type":                      "off",
            "@typescript-eslint/no-extraneous-class":             "off",
            "@typescript-eslint/consistent-indexed-object-style": "off",
            "@typescript-eslint/adjacent-overload-signatures":    "off"
        }
    }
]

