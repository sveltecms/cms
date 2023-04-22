<script lang="ts">
    export let text:string
    export let level:number
</script>

{#if level===1}
    <h1>{@html text}</h1>
{:else if level===2}
    <h2>{@html text}</h2>
{:else if level===3}
    <h3>{@html text}</h3>
{:else if level===4}
    <h4>{@html text}</h4>
{:else if level===5}
    <h5>{@html text}</h5>
{:else if level===6}
    <h6>{@html text}</h6>
{/if}

<style>
    h1,h2,h3,h4,h5,h6{ margin-bottom: 10px; }
    h1{ color: var(--h1Color); font-size: var(--h1Size); font-weight: var(--h1Weight); }
    h2{ color: var(--h2Color); font-size: var(--h2Size); font-weight: var(--h2Weight); }
    h3{ color: var(--h3Color); font-size: var(--h3Size); font-weight: var(--h3Weight); }
    h4{ color: var(--h4Color); font-size: var(--h4Size); font-weight: var(--h4Weight); }
    h5{ color: var(--h5Color); font-size: var(--h5Size); font-weight: var(--h5Weight); }
    h6{ color: var(--h6Color); font-size: var(--h6Size); font-weight: var(--h6Weight); }
</style>