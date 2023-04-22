import { writable } from "svelte/store"

const config = writable({
    // Colors
    pColor:"#dcdcdc",
    h1Color:"#dcdcdc",
    h2Color:"#dcdcdc",
    h3Color:"#dcdcdc",
    h4Color:"#dcdcdc",
    h5Color:"#dcdcdc",
    h6Color:"#dcdcdc",
    // Sizes
    pSize:"15px",
    h1Size:"40px",
    h2Size:"32px",
    h3Size:"26px",
    h4Size:"20px",
    h5Size:"20px",
    h6Size:"20px",
    // Weight
    pWeight:"200",
    h1Weight:"400",
    h2Weight:"400",
    h3Weight:"400",
    h4Weight:"400",
    h5Weight:"400",
    h6Weight:"400",
    // Other
    textWeight:"200",
    textSize:"15px",
    textColor:"#dcdcdc",
    linkColor:"#066a9b",
    // Code
    inlineCodeWeight:"100",
    inlineCodeSize:"12px",
    inlineCodeColor:"#fff",
    inlineCodeBg:"rgba(0,0,0,.4)",
    codeColor:"#80cfee",
    codeSize:"15px",
    codeWeight:"200",
    codeBg:"#12151b",
    codeKeyColor:"#b372a8",
    codeCommentColor:"#538b46",
    codeStringColor:"#B58672",
    codeFuncColor:"#dbdba6",
})


export function theme(){
    return `
    <style>
        pre code.hljs {
            display: block;
            overflow-x: auto;
            padding: 1em
        }
        code.hljs {
            padding: 3px 5px
        }
        .hljs {
            color: #adbac7;
            background: #22272e
        }
        .hljs-doctag,
        .hljs-keyword,
        .hljs-meta .hljs-keyword,
        .hljs-template-tag,
        .hljs-template-variable,
        .hljs-type,
        .hljs-variable.language_ {
            color: var(--codeKeyColor)
        }
        .hljs-title,
        .hljs-title.function_ {
            color: var(--codeFuncColor)
        }
        .hljs-title.class_,
        .hljs-title.class_.inherited__ {
            color: #47cead
        }
        .hljs-attr,
        .hljs-attribute,
        .hljs-literal,
        .hljs-meta,
        .hljs-number,
        .hljs-operator,
        .hljs-selector-attr,
        .hljs-selector-class,
        .hljs-selector-id,
        .hljs-variable {
            color: #6cb6ff
        }
        .hljs-meta .hljs-string,
        .hljs-regexp,
        .hljs-string {
            color: var(--codeStringColor)
        }
        .hljs-built_in,
        .hljs-symbol {
            color: var(--codeFuncColor)
        }
        .hljs-built_in{
            color: #47cead
        }
        .hljs-code,
        .hljs-comment,
        .hljs-formula {
            color: var(--codeCommentColor)
        }

        .hljs-name,
        .hljs-quote,
        .hljs-selector-pseudo,
        .hljs-selector-tag {
            color: #3382b1
        }

        .hljs-subst {
            color: #adbac7
        }

        .hljs-section {
            color: #316dca;
            font-weight: 700
        }

        .hljs-bullet {
            color: #eac55f
        }

        .hljs-emphasis {
            color: #adbac7;
            font-style: italic
        }

        .hljs-strong {
            color: #adbac7;
            font-weight: 700
        }

        .hljs-addition {
            color: #b4f1b4;
            background-color: #1b4721
        }

        .hljs-deletion {
            color: #ffd8d3;
            background-color: #78191b
        }
    </style>
    `
}
export default config