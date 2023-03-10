// import type { AssetData,UserLoad } from "$Types"

const assetDefault = {
    _id: "000000000000000000000000",
    name: "No image",
    path: "no-image.jpeg",
    type: "image",
    extension: "jpeg"
}

export const defaultAsset = {
    _id: "000000000000000000000000",
    name: "No image",
    path: "no-image.jpeg",
    type: "image",
    extension: "jpeg"
}

export const defaultUser = {
    _id: "000000000000000000000000",
    firstName: "cms",
    lastName: "root",
    email: "root@sveltecms.dev",
    password: "",
    image: {...defaultAsset,_id:defaultAsset['_id'].toString()},
    verified: false,
    role: "root",
    sessions:{ }
}

/** All information about svelteCMS */
export default {
    site:{
        name: 'SvelteCMS',
        title: 'All in one cms',
        desc: 'A simple svelte kit cms for all your needs.',
        logo: '/admin/logo.png',
        favicon: '/admin/favicon.png',
        backdrop: '/admin/backdrop.png',
    },
    name: 'SvelteCMS',
    title: 'All in one cms',
    desc: 'A simple svelte kit cms for all your needs.',
    domain: 'http://localhost:5173',
    domainUrl:"https://sveltecms.dev/",
    logo: '/admin/logo.png',
    favicon: '/admin/favicon.png',
    backdrop: '/admin/backdrop.png',
    keywords: [ 'stock', 'market' ],
    socialMedias: { twitter: 'sveltejs' },
    /** Urls */
    urlBases:{
        api:"/admin/api",
        assets:"/admin/api/assets"
    },
    config:{
        /** Assets per page */
        assetsPerPage:2,
        /** Users per page */
        usersPerPage:2,
        /** Routes per page */
        routesPerPage:2,
        /** Assets per page */
        objectsPerPage:2,
        /** Tags per page */
        tagsPerPage:2,
        /** Categories per page */
        categoriesPerPage:2,
    },
    collections:{
        /** Assets linked to element,categories and other */
        assets:"__assets",
        sessions:"__sessions",
        users:"__users",
        routes:"__routes",
        linkedAssets:"__linked_assets",
        linkedCategories:"__linked_categories",
        linkedTags:"__linked_tags",
        baseCategories:"__categories",
        baseTags:"__tags",
    },
    diskPaths:{
        /** Disk path where assets will be storage */
        assets: ".svelteCMS/assets",
    },
    paths:{
        /** Disk path where assets will be storage */
        assets: ".svelteCMS/assets",
    },
    viewPaths:{
        /** Disk path where assets will be storage */
        assets: "/admin/api/assets",
    },
    defaults:{
        // Default image when no image available
        asset:assetDefault
    }
}

