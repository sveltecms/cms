<script lang="ts">
    type Data = {style:"unordered"|"ordered",items:string[]}
    export let data:Data
</script>

{#if data.style === "ordered"}
    <ol>
        {#each data.items as item}
            <li>{item}</li>
        {/each}
    </ol>
{:else if data.style === "unordered"}
    <ul>
        {#each data.items as item}
            <li>{item}</li>
        {/each}
    </ul>
{/if}

<style>
    ol,ul{
        color: var(--color);
        font-size: 15px;
        margin-left: 30px;
        margin-bottom: 10px;
    }
    li{ margin-bottom: 5px; }
</style>