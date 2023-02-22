<script lang="ts">
    import Layout from "./Layout.svelte";
    import { page } from "$app/stores";
    // Check if pathname is admin route
    $: isAdminRoute = $page.url.pathname.includes("/admin")
</script>

{#if isAdminRoute}
    <slot />
{:else}
    <Layout>
        <slot />
    </Layout>
{/if}