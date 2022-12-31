<script lang="ts">
    /** Date saved from editorJs just the way it was */
    export let data:EditorJsData
    import config from "./static/config";
    // TYPES
    import type { EditorJsData } from "./static/types"
    // COMPONENTS
    import Paragraph from "./viewer/Paragraph.svelte";
    import Header from "./viewer/Header.svelte";
    import Code from "./viewer/Code.svelte";
    import List from "./viewer/List.svelte";
    import Image from "./viewer/Image.svelte";
    const style = Object.entries(config).map(data=>`--${data[0]}:${data[1]};`).join("")
</script>

<div class="content" {style}>
    {#each data.blocks as block (block.id)}
        {#if block.type === "paragraph" }
            <Paragraph text={block.data.text} />
        {:else if block.type === "header" }
            <Header {...block.data} />
        {:else if block.type === "code" }
            <Code text={block.data.code} />
        {:else if block.type === "list" }
            <List data={block.data} />
        {:else if block.type === "image" }
            <Image image={block.data} />
        {/if}
    {/each}
</div>

<style>
    .content{
        display: flex;
        flex-direction: column;
        border-radius: 5px;
        background-color: var(--antiBodyBg);
    }
</style>