<script lang="ts">
    import Styles from "./Styles.svelte";
    /** EditorJs data, bind will be synced at all time */
    export let editorJSData:any
    import config from "./static/config";
    import Loading from "./Loading.svelte";
    import { onMount, onDestroy } from "svelte";
    // Install api scripts when components mounts
    onMount(async ()=>{
        for(const scriptName of SCRIPTS){
            const apiElement = document.createElement("script")
            apiElement.setAttribute("src",`https://cdn.jsdelivr.net/npm/@editorjs/${scriptName}`)
            apiElement.setAttribute("script_id",scriptName)
            // Add script to head and api elements list
            document.head.append(apiElement)
            apiElementList.push(apiElement)
        }
        // Wait so it give time to add scripts to header
        await new Promise(r=>setTimeout(r,200))
        const editorConfig = {
            holder:"editor",
            placeholder:"Content...",
            minHeight:"auto",
            data: editorJSData ? editorJSData : undefined,
            tools:{
                // @ts-ignore
                header: { class: Header },
                // @ts-ignore
                list: { class: List },
                // @ts-ignore
                code: CodeTool,
                // @ts-ignore
                image: SimpleImage
            },
            onReady:()=>{ ready = true },
        }
        // @ts-ignore
        EditorJs = new EditorJS(editorConfig)
    })
    // Remove api scripts when component is destroyed
    onDestroy(()=>{
        for(const apiElement of apiElementList){ apiElement.remove() }
    })
    /** Sync editor data with binded value */
    async function syncValue(){
        if(ready){
            const editorData = await EditorJs.save()
            editorJSData = editorData
        }
    }
    // Vars
    let EditorJs:any
    let ready:boolean = false
    let apiElementList:HTMLScriptElement[] = []
    const SCRIPTS = [ 'editorjs@latest', 'header@latest', 'list@latest','code','simple-image@latest' ]
    const style = Object.entries(config).map(data=>`--${data[0]}:${data[1]};`).join("")
</script>

<Styles />
<!-- Show loading if editor is not ready to use -->
{#if !ready }
    <div class="loader" {style}>
        <Loading/>
    </div>
{/if}
<div id="editor" on:mouseleave={syncValue} class:ready {style}></div>

<style>
    #editor{
        background-color: var(--bg);
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 10px;
        margin-bottom: 10px;
        /* USE TO WAIT FOR EDITOR TO BE READY */
        max-height: 0px;
        opacity: 0%;
    }
    /* WHEN READY */
    #editor.ready{
        max-height: fit-content;
        opacity: 100%;
    }
</style>