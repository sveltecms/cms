<script lang="ts">
    export let data:LayoutServerData
    import "$StaticFiles/layout.css"
    // Types
    import type { LayoutServerData } from "./$types"
    // Other
    import { beforeNavigate } from "$app/navigation";
    import { PREV_PATH, ROUTES, USER } from "$Stores"
    // Packages
    import Toasts from "$Packages/svelteToasts/Toasts.svelte";
    // Components
    import Meta from "$Comps/Meta.svelte";
    import MainNav from "$Comps/core/nav/Nav.svelte";
    import TopNav from "$Comps/core/nav/topNav/TopNav.svelte";
    import Footer from "$Comps/core/footer/Footer.svelte";
    // Set stores
    ROUTES.set(data.routes)
    // Update previously path
    beforeNavigate(()=>PREV_PATH.set(location.pathname))
</script>

{#if data.user}
    <Toasts />
    <Meta />
    <div class="app">
        <MainNav />
        <div class="content">
            <TopNav />
            <main class="mainContent">
                <slot />
                <Footer />
            </main>
        </div>
    </div>
{:else}
    <slot />
{/if}

<style>
    .app{
        display: flex;
        justify-content: flex-end;
    }
    .content{
        display: flex;
        flex-direction: column;
        width: calc(100% - 140px);
        min-height: 100vh;
    }
    .mainContent{
        padding: 10px;
    }
    @media(max-width:700px){
        .content{ width: 100%; }
    }
</style>