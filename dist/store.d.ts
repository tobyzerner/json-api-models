import { Model } from './model';
import { IJsonApiDocument, IJsonApiIdentifier, IJsonApiResource } from './jsonApi';
interface Graph {
    [type: string]: {
        [id: string]: Model;
    };
}
declare type ModelConstructor = {
    new (data: IJsonApiResource, store?: Store): Model;
};
interface ModelCollection {
    [type: string]: ModelConstructor;
}
export declare class Store {
    models: ModelCollection;
    protected graph: Graph;
    constructor(models?: ModelCollection);
    model(type: string, model: ModelConstructor): void;
    find(identifier: IJsonApiIdentifier): Model;
    find(identifiers: IJsonApiIdentifier[]): Model[];
    find(type: string, id: string): Model;
    findAll(type: string): Model[];
    sync(document: IJsonApiDocument): Model | Model[];
    syncResource(data: IJsonApiIdentifier): Model;
    private createModel;
    forget(data: IJsonApiIdentifier): void;
    reset(): void;
}
export {};
