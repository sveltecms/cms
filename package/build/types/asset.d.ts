/** Data need to upload new asset */
export declare type AssetLoad = {
    publicID: string;
    assetID: string;
    src: string;
    title: string;
    type: string;
    extension: string;
};
/** Data object from asset to upload new asset */
export interface AssetData extends AssetLoad {
    _id: any;
}
/** Data needed to create new linked asset */
export declare type LinkedAssetLoad = {
    fromRouteID: string;
    fromKey: string;
    oneAsset: boolean;
};
/** Data returned from linked asset */
export interface LinkedAssetData extends LinkedAssetLoad {
    _id: any;
}
