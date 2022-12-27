<script lang="ts">
    export let text:string
</script>

<pre>{@html text}</pre>

<style>
    pre{
        margin-bottom: 10px;
        border-radius: 5px;
        padding: 10px;
        font-size: 12px;
        font-weight: 100;
        color: var(--color);
        background-color: var(--bg);
    }
</style>