import { Store } from './store';
import { JsonApiIdentifier, JsonApiRelationships, JsonApiResource, KeyValueObject } from './types';
export declare type CastAttributes = {
    [key: string]: StringConstructor | NumberConstructor | BooleanConstructor | ((value: any) => any) | (new (value: any) => any);
};
export declare class Model implements JsonApiResource {
    protected store: Store;
    type: string;
    id: string;
    attributes: KeyValueObject;
    relationships: JsonApiRelationships;
    meta: KeyValueObject;
    links: KeyValueObject;
    protected casts: CastAttributes;
    [field: string]: any;
    constructor(data: JsonApiResource, store: Store);
    getAttribute(name: string): any;
    getRelationship(name: string): any;
    /**
     * Make a resource identifier object for this model.
     */
    identifier(): JsonApiIdentifier;
    /**
     * Merge new JSON:API resource data into the model.
     */
    merge(data: JsonApiResource): void;
}
