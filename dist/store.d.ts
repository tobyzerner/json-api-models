import { Model } from './model';
import { JsonApiDocument, JsonApiIdentifier, JsonApiResource } from './types';
declare type Graph = {
    [type: string]: {
        [id: string]: any;
    };
};
export declare type ModelConstructor<Type extends string> = {
    new (data: JsonApiResource<Type>, store: Store): Model<Type>;
};
export declare type ModelCollection<Models> = {
    [Type in keyof Models & string]: ModelConstructor<Type>;
} & {
    '*'?: ModelConstructor<any>;
};
export declare type ModelForType<Type extends string, Models extends ModelCollection<Models>> = Type extends keyof Models ? InstanceType<Models[Type]> : Model;
export declare class Store<Models extends ModelCollection<Models> = any> {
    models: Models;
    protected graph: Graph;
    constructor(models?: Models);
    find<Type extends string>(identifier: JsonApiIdentifier<Type>): ModelForType<Type, Models> | null;
    find<Type extends string>(identifiers: JsonApiIdentifier<Type>[]): ModelForType<Type, Models>[];
    find<Type extends string>(type: Type, id: string): ModelForType<Type, Models> | null;
    findAll<Type extends string>(type: Type): ModelForType<Type, Models>[];
    sync<Type extends string>(document: JsonApiDocument<Type>): ModelForType<Type, Models> | ModelForType<Type, Models>[] | null;
    syncResource<Type extends string>(data: JsonApiResource<Type>): ModelForType<Type, Models>;
    protected createModel<Type extends string>(data: JsonApiResource<Type>): ModelForType<Type, Models>;
    forget(data: JsonApiIdentifier): void;
    reset(): void;
}
export {};
