<script lang="ts">
    import PageTitleLink from "$Comps/PageTitleButton.svelte";
    import ToggleSwitch from "$Comps/ToggleSwitch.svelte";
    import Setting from "$Comps/settings/Setting.svelte";
    import { page } from "$app/stores";
    import type { UserData } from "$Types";
    let user:UserData = $page.data.user
</script>

<PageTitleLink title={user.firstName} btnText="Logout" on:click={()=>location.href = "/admin/auth/logout"}/>
<Setting text="Soon to be added">
    <ToggleSwitch checked={false} />
</Setting>