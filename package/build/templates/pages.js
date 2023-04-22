/** Pages route elements */
const pagesElements = [
    { title: "Title", ID: "title", type: "input", value: "" },
    { title: "Slug", ID: "slug", type: "slug", value: "" },
    { title: "View count", ID: "views", type: "inputNumber", value: 1 },
    { title: "Content", ID: "content", type: "content", value: "" },
    // Right side content
    { title: "Updated at", ID: "updatedAt", type: "dateTime", value: new Date() },
];
/** Pages route */
const pages = {
    title: "Pages",
    ID: "pages",
    searchAbleKey: "slug",
    meta: { title: "Pages", description: "List of pages." },
    elements: pagesElements
};
/** List of routes */
const routes = [pages];
export { routes };
