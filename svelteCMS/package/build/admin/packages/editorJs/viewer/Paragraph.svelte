<script lang="ts">
    export let text:string
</script>

<p>{@html text}</p>

<style>
    p{
        font-size: 15px;
        font-weight: 300;
        color: var(--color);
        margin-bottom: 10px;
    }
</style>