import { Model } from './model';
import { JsonApiDocument, JsonApiIdentifier, JsonApiResource } from './types';
interface Graph {
    [type: string]: {
        [id: string]: Model;
    };
}
declare type ModelConstructor = {
    new (data: JsonApiResource, store?: Store): Model;
};
interface ModelCollection {
    [type: string]: ModelConstructor;
}
export declare class Store {
    models: ModelCollection;
    protected graph: Graph;
    constructor(models?: ModelCollection);
    model(type: string, model: ModelConstructor): void;
    find(identifier: JsonApiIdentifier): Model;
    find(identifiers: JsonApiIdentifier[]): Model[];
    find(type: string, id: string): Model;
    findAll(type: string): Model[];
    sync(document: JsonApiDocument): Model | Model[];
    syncResource(data: JsonApiIdentifier): Model;
    private createModel;
    forget(data: JsonApiIdentifier): void;
    reset(): void;
}
export {};
