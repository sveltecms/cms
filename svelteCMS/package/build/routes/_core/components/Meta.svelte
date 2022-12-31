<script lang="ts">
    export let title:string = ''
    export let description:string = ''
    export let backdrop:string = ''
    export let ogType:string = 'website'
    export let ogLocate:string = 'en_US'
    // Get config
    import svelteCMS from "$svelteCMS";
    import { page } from '$app/stores';
    // Default backdrop image
    const defaultBackdrop = "/admin/backdrop.png"
    /** Current page title */
    $: pageTitle = title ? title : svelteCMS.title
    /** Current page description */
    $: pageDesc = description ? description : svelteCMS.desc
    /** Page backdrop image src */
    $: backdropSrc = backdrop ? backdrop : defaultBackdrop
</script>

<svelte:head>
    <title>{pageTitle} | {svelteCMS.name}</title>
    <link rel="icon" type="image/png" href={svelteCMS.favicon}>
    <meta name="description" content="{pageDesc}" />
    <meta name="keywords" content="{svelteCMS.keywords.join(', ')}" />
    <meta property="og:site_name" content="{svelteCMS.name}"/>
    <meta property="og:locale" content="{ogLocate}"/>
    <meta property="og:type" content="{ogType}"/>
    <meta property="og:title" content="{pageTitle} | {svelteCMS.name}"/>
    <meta property="og:description" content="{pageDesc}" />
    <meta property="og:url" content={$page.url.href}/>
    <meta property="og:image" content="{backdropSrc}"/>
    <meta property="og:image:secure_url" content="{backdrop}"/>
    <meta property="twitter:card" content="summary"/>
    <meta property="twitter:title" content="{pageTitle} | {svelteCMS.name}"/>
    <meta property="twitter:description" content="{pageDesc}"/>
</svelte:head>