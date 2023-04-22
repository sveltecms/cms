<script lang="ts">
    export let text:string
</script>

<p>{@html text}</p>

<style>
    p{
        font-size: var(--pSize);
        font-weight: var(--pWeight);
        color: var(--pColor);
        margin-bottom: 10px;
    }
    :global(a){
        text-decoration: none;
        color: var(--linkColor);
    }
    :global(p .inline-code){
        background-color: var(--inlineCodeBg);
        color: var(--inlineCodeColor);
        font-size: var(--inlineCodeSize);
        font-weight: var(--inlineCodeWeight);
        padding: 5px;
        border-radius: 3px 5px;
    }
</style>