// @ts-check
/** @typedef { import("../src/admin/types/index").RouteLoad } RouteLoad */

/** @type { RouteLoad } */
export const pagesRouteData = {
    title: "pages",
    ID: "pages",
    includeCategories: "no",
    includeTags: "no",
    meta: {
        title: "Pages",
        description: "All pages"
    },
    elements: [
        {
            ID:"title",
            name:"Page title",
            type:"input",
            value:""
        },
        {
            ID:"slug",
            name:"Page slug",
            type:"slug",
            value:""
        },
        {
            ID:"content",
            name:"Content",
            type:"content",
            value:undefined
        },
    ]
}

/** @type { RouteLoad } */
export const postsRouteData = {
    title: "posts",
    ID: "posts",
    includeCategories: "yes",
    includeTags: "yes",
    meta: {
        title: "Posts",
        description: "All posts"
    },
    elements: [
        {
            ID:"title",
            name:"Post title",
            type:"input",
            value:""
        },
        {
            ID:"slug",
            name:"Post slug",
            type:"slug",
            value:""
        },
        {
            ID:"content",
            name:"Content",
            type:"content",
            value:undefined
        },
        {
            ID:"thumbnail",
            name:"Thumbnail",
            type:"image",
            value:undefined
        },
    ]
}