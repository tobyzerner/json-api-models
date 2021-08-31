export declare type KeyValueObject = {
    [key: string]: any;
};
export interface JsonApiDocument {
    data: JsonApiResource | JsonApiResource[];
    included?: JsonApiResource[];
    meta?: KeyValueObject;
    links?: KeyValueObject;
}
export interface JsonApiIdentifier {
    type: string;
    id: string;
}
export interface JsonApiResource extends JsonApiIdentifier {
    attributes?: KeyValueObject;
    relationships?: JsonApiRelationships;
    meta?: KeyValueObject;
    links?: KeyValueObject;
}
export interface JsonApiRelationships {
    [relationName: string]: JsonApiRelationship;
}
export interface JsonApiRelationship {
    data?: JsonApiIdentifier | JsonApiIdentifier[];
    meta?: KeyValueObject;
    links?: KeyValueObject;
}
