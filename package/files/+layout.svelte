<script lang="ts">
    import AppLayout from "./AppLayout.svelte";
    import { page } from "$app/stores";
    $: isAdminRoute = $page.url.pathname.startsWith("/admin")
</script>

{#if isAdminRoute}
    <slot />
{:else}
    <AppLayout>
        <slot />
    </AppLayout>
{/if}