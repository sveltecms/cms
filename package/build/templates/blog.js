/** Authors route elements */
const authorsElements = [
    { title: "First name", ID: "firstName", type: "input", value: "" },
    { title: "Last name", ID: "lastName", type: "input", value: "" },
    { title: "Email", ID: "email", type: "input", value: "" },
    { title: "Profile image", ID: "image", type: "asset", value: undefined },
];
/** Authors route */
const authors = {
    title: "Authors",
    ID: "authors",
    searchAbleKey: "email",
    meta: { title: "Authors", description: "List of authors." },
    elements: authorsElements
};
/** Tags route elements */
const tagsElements = [
    { title: "Title", ID: "title", type: "input", value: "" },
    { title: "Slug", ID: "slug", type: "slug", value: "" },
];
/** Tags route */
const tags = {
    title: "Tags",
    ID: "tags",
    searchAbleKey: "slug",
    meta: { title: "Tags", description: "List of tags." },
    elements: tagsElements
};
/** Categories route elements */
const categoriesElements = [
    { title: "Title", ID: "title", type: "input", value: "" },
    { title: "Slug", ID: "slug", type: "slug", value: "" },
    { title: "Description", ID: "description", type: "input", value: "" },
];
/** Categories route */
const categories = {
    title: "Categories",
    ID: "categories",
    searchAbleKey: "slug",
    meta: { title: "Categories", description: "List of categories." },
    elements: categoriesElements
};
/** Blogs route elements */
const blogsElements = [
    { title: "Title", ID: "title", type: "input", value: "" },
    { title: "Slug", ID: "slug", type: "slug", value: "" },
    { title: "View count", ID: "views", type: "inputNumber", value: 1 },
    { title: "Content", ID: "content", type: "content", value: "" },
    // Linked routes
    { title: "Author", ID: "author", type: "linkToRoute", value: [], linkTo: "authors", linkedSearchableKey: "email" },
    { title: "Categories", ID: "categories", type: "linkToRoute", value: [], linkTo: "categories", linkedSearchableKey: "slug" },
    { title: "Tags", ID: "tags", type: "linkToRoute", value: [], linkTo: "tags", linkedSearchableKey: "slug" },
    { title: "Images", ID: "images", type: "assets", value: [] },
    // Right side content
    { title: "Created at", ID: "createdAt", type: "dateTime", value: new Date() },
    { title: "Updated at", ID: "updatedAt", type: "dateTime", value: new Date() },
    { title: "Thumbnail", ID: "thumbnail", type: "asset", value: undefined },
];
/** Blogs route */
const blogs = {
    title: "Blogs",
    ID: "blogs",
    searchAbleKey: "slug",
    meta: { title: "Blogs", description: "List of blogs." },
    elements: blogsElements
};
/** List of routes */
const routes = [blogs, tags, categories, authors];
/** Linked assets */
const linkedAssets = [
    { fromRouteID: "blogs", fromKey: "thumbnail", oneAsset: true },
    { fromRouteID: "blogs", fromKey: "images", oneAsset: false },
];
/** Linked routes */
const linkedRoutes = [
    { fromRouteID: "blogs", fromKey: "categories", toRouteID: "categories" },
    { fromRouteID: "blogs", fromKey: "tags", toRouteID: "tags" },
];
export { routes, linkedAssets, linkedRoutes };
