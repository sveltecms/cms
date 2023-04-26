<script lang="ts">
    export let data:PageData
    import type { PageData } from "./$types";
    // cms comps and utils
    import MetaData from "cms/components/shared/MetaData.svelte"
    import EditorViewer from "cms/packages/editor/EditorViewer.svelte"
</script>

<MetaData title="Documentation"/>
<EditorViewer data={data.page.content}/>