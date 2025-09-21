/*
**  HUDS -- Head-Up-Display Server (HUDS)
**  Copyright (c) 2022-2025 Dr. Ralf S. Engelschall <rse@engelschall.com>
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

/*  read original rules  */
const recommended = require("stylelint-stylus/recommended")
const standard    = require("stylelint-stylus/standard")

/*  mix standard over recommended manually  */
const mixed = {}
Object.assign(mixed, recommended)
Object.assign(mixed.rules, standard.rules)

/*  remove deprecated rules  */
const deprecated = [
    "at-rule-name-newline-after",
    "at-rule-name-space-after",
    "block-closing-brace-empty-line-before",
    "block-closing-brace-newline-after",
    "block-closing-brace-newline-before",
    "block-closing-brace-space-after",
    "block-closing-brace-space-before",
    "block-opening-brace-newline-after",
    "block-opening-brace-newline-before",
    "block-opening-brace-space-after",
    "block-opening-brace-space-before",
    "color-hex-case",
    "declaration-block-trailing-semicolon",
    "no-eol-whitespace",
    "number-leading-zero",
    "number-no-trailing-zeros",
    "selector-list-comma-newline-after",
    "selector-list-comma-newline-before",
    "selector-list-comma-space-after",
    "selector-list-comma-space-before",
    "selector-pseudo-class-case",
    "indentation"
]
for (const d of deprecated)
    delete mixed.rules[d]

/*  export as replacement configuration  */
module.exports = mixed

