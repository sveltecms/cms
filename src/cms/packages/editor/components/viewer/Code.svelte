<script lang="ts">
    export let text:string
    import hljs from "highlight.js/lib/common"
    /** Copy code to clipboard*/
    async function copyToClipboard() {
        await navigator.clipboard.writeText(cleanText)
    }
    let cleanText = text.replace(/```\S+/g, '').trimStart()
    let lang = text.includes("```") ? text.trim().split("```")[1].split(" ")[0].trim() : ""
    let htmlCode = hljs.highlight(cleanText,{ language:lang||"html" }).value
</script>

<pre>
    <code class="language-{lang}">{@html htmlCode}</code>
    <span class="copy" on:click={copyToClipboard} on:keypress={copyToClipboard}>copy</span>
</pre>

<style>
    pre{
        background-color: var(--codeBg);
        color: var(--codeColor);
        font-size: var(--codeSize);
        font-weight: var(--codeWeight);
        overflow: hidden;
        margin-bottom: 10px;
        border-radius: 5px;
        padding: 10px;
        display: flex;
        align-items: center;
        position: relative;
        line-height: 20px;
    }
    .copy{
        background-color: var(--buttonBg);
        color: var(--buttonColor);
        cursor: pointer; 
        position: absolute;
        top: 0;
        right: 0;
        text-decoration: none;
        padding: 3px 5px;
        border-radius: 1px;
        font-size: 10px;
        font-weight: 300;
        margin-bottom: 5px;
        text-transform: uppercase;
    }
</style>