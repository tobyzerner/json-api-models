import { Store } from './store';
import { IJsonApiIdentifier, IJsonApiRelationships, IJsonApiResource, TKeyValueObject } from './jsonApi';
export declare class Model implements IJsonApiResource {
    protected store: Store;
    type: string;
    id: string;
    attributes: TKeyValueObject;
    relationships: IJsonApiRelationships;
    meta: TKeyValueObject;
    links: TKeyValueObject;
    [field: string]: any;
    constructor(data: IJsonApiResource, store: Store);
    /**
     * Make a resource identifier object for this model.
     */
    identifier(): IJsonApiIdentifier;
    /**
     * Merge new JSON:API resource data into the model.
     */
    merge(data: IJsonApiResource): void;
}
