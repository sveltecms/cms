/** Elements types allow in route data */
export declare type ElementType = "slug" | "textArea" | "input" | "dateTime" | "inputNumber" | "asset" | "assets" | "content" | "linkToRoute" | "boolean";
/** Route element object data */
export declare type ElementData = {
    ID: string;
    title: string;
    type: ElementType;
    value: any;
    linkTo?: string;
    linkedSearchableKey?: string;
};
/** Data needed to create route */
export declare type RouteLoad = {
    ID: string;
    title: string;
    /** Key use to search route objects */
    searchAbleKey: string;
    elements: ElementData[];
    meta: {
        title: string;
        description: string;
    };
};
/** Data returned from route */
export interface RouteData extends RouteLoad {
    _id: any;
}
/** Data returned from route object */
export declare type RouteObjectData = {
    _id: any;
    [key: string]: any;
};
/** Data needed to create new linked route */
export declare type LinkedRouteLoad = {
    fromRouteID: string;
    toRouteID: string;
    fromKey: string;
};
/** Data returned from linked route */
export interface LinkedRouteData extends LinkedRouteLoad {
    _id: any;
}
