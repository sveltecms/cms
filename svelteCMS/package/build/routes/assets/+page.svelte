<script lang="ts">
    const API_PATH = "/admin/api/assets"
    export let data:PageServerData
    import type { PageServerData } from "./$types"
    import type { FetchAssetsLoad,FetchAssetsRes,AssetData } from "$Types";
    import { page } from "$app/stores"
    import svelteCMS from "$svelteCMS";
    import SvelteHead from "@anthony809/svelte-head"
    import { wait,fetchPost } from "$Utilities"
    // Icons
    import PlusIcon from "$Icons/Plus.svelte";
    // Components
    import TitleButton from "$Comps/PageTitleButton.svelte";
    import FileUploader from "$Packages/fileUploader/FileUploader.svelte";
    import Assets from "$Comps/shared/assets/Assets.svelte"
    import Button from "$Comps/Button.svelte"
    import NoResult from "$Comps/NoResult.svelte";
    /** Load more assets */
    async function loadMoreAssets() {
        // Set loading more assets
        loading = true
        // Update page number
        pageNumber = pageNumber+1
        // Send api request
        const query = $page.url.searchParams.get("q")
        const filter = query ? { name:query } : null
        const apiLoad:FetchAssetsLoad = { filter:filter, count:svelteCMS.config.assetsPerPage,pageNumber }
        const apiResponse:FetchAssetsRes = await fetchPost("PATCH",API_PATH,apiLoad) 
        if(apiResponse.length>0){
            if(apiResponse.length<svelteCMS.config.assetsPerPage) resetStages()
            // Wait 500 milliseconds
            await wait(500)
            // Marge assets with response assets
            assets = [...assets,...apiResponse]
        }
        // Reset stages
        else await resetStages()
        // Remove loading more assets
        loading = false
    }
    /** Reset stages */
    async function resetStages(W:boolean=true){
        // Wait 500 milliseconds
        if(W) await wait(500)
        showLoadMoreBtn = false
        pageNumber = 1
    }
    // Variables 
    /** Indicate if file uploader is open or not */
    let isFileUploaderOpen:boolean = false
    let showLoadMoreBtn:boolean = data.assets.length >= svelteCMS.config.assetsPerPage
    let pageNumber = 1
    /** Indicate when loading more assets */
    let loading = false
    $: assets = data.assets
    $: query = $page.url.searchParams.get("q")
    $: title = query ? `Result for: ${query}` : "Assets"
    // Reset stages when page load or change path
    $: if(data.assets){
        isFileUploaderOpen = false
        pageNumber = 1
        showLoadMoreBtn = data.assets.length >= svelteCMS.config.assetsPerPage
    }
    const pageData = {
        appName:svelteCMS.site.name,
        favicon:svelteCMS.site.favicon,
        title:"Assets",
        description:svelteCMS.site.desc,
        backdrop:svelteCMS.site.backdrop
    }
</script>

<SvelteHead {...pageData}/>
<FileUploader allowSelection={false} bind:open={isFileUploaderOpen} on:select={()=>location.reload()}/>
{#if assets.length > 0}
    <TitleButton {title} on:click={()=>isFileUploaderOpen=true} icon={PlusIcon}/>
    <Assets {assets}/>
    {#if showLoadMoreBtn}
        <Button {loading} text="Load more" centerBtn={true} --width="fit-content" on:click={loadMoreAssets}/>
    {/if}
{:else}
    <NoResult title="No assets" subTitle="Please some assets" href="/admin/assets" hrefText="Add assets" on:click={()=>isFileUploaderOpen=true}/>
{/if}