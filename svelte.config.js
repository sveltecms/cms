import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),
    // Disable svelte warning
    onwarn:(warning, handler)=>{ if(warning.code.startsWith('a11y-')) return ; handler(warning); },
	kit: {
		adapter: adapter(),
        alias:{
            //<svelteCMSAlias>
            $svelteCMS:"src/admin/svelteCMS.ts",
            $Cms:"src/admin/cms/cms.server.ts",
            $Utilities:"src/admin/utilities",
            $Stores:"src/admin/stores.ts",
            $Database:"src/admin/db/mongo.server.ts",
            $Types:"src/admin/types",
            $Comps:"src/admin/components/",
            $Elements:"src/admin/elements/",
            $Icons:"src/admin/icons/",
            $Packages:"src/admin/packages/"
            //</svelteCMSAlias>
        }
	}
};

export default config;
 