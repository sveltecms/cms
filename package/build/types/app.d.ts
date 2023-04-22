export declare type App = {
    _id: string;
    site: AppSite;
    config: AppConfig;
};
export declare type AppConfig = {
    assetsPerSearch: number;
    assetsPerPage: number;
    usersPerPage: number;
    routesPerPage: number;
    objectsPerPage: number;
    routesLinkedPerPage: number;
    allowNewUser: boolean;
    cmsPath: string;
};
export declare type AppSite = {
    name: string;
    title: string;
    description: string;
    socialMedias: AppSiteSocialMedias;
    baseUrl: string;
};
export declare type AppSiteSocialMedias = {
    twitter: string;
    instagram: string;
};
