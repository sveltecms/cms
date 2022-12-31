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
    h1,h2,h3,h4,h5,h6{ color: var(--color); margin-bottom: 10px; }
    h1{ font-size: 42px; font-weight: 800; }
    h2{ font-size: 32px; font-weight: 700; }
    h3{ font-size: 25px; font-weight: 600; }
    h4{ font-size: 20px; font-weight: 400; }
    h5{ font-size: 18px; font-weight: 400; }
    h6{ font-size: 16px; font-weight: 400; }
</style>