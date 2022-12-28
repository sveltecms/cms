<script lang="ts">
    import PageTitleLink from "$Comps/PageTitleLink.svelte";
    import ToggleSwitch from "$Comps/ToggleSwitch.svelte";
    import Setting from "$Comps/settings/Setting.svelte";
    import { page } from "$app/stores";
    import type { UserData } from "$Types";
    let user:UserData = $page.data.user
</script>

<PageTitleLink title={user.firstName} href="/auth/logout" linkText="Logout" disabledPreload={true}/>
<Setting text="Soon to be added">
    <ToggleSwitch checked={false} />
</Setting>