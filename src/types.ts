export type KeyValueObject = {
    [key: string]: any;
}

export interface JsonApiDocument<Type extends string = string> {
    data: JsonApiResource<Type> | JsonApiResource<Type>[];
    included?: JsonApiResource[];
    meta?: KeyValueObject;
    links?: KeyValueObject;
}

export interface JsonApiIdentifier<Type extends string = string> {
    type: Type;
    id: string;
}

export interface JsonApiResource<Type extends string = string> extends JsonApiIdentifier<Type> {
    attributes?: KeyValueObject;
    relationships?: JsonApiRelationships;
    meta?: KeyValueObject;
    links?: KeyValueObject;
}

export interface JsonApiRelationships {
    [relationName: string]: JsonApiRelationship;
}

export interface JsonApiRelationship<Type extends string = string> {
    data?: JsonApiIdentifier<Type> | JsonApiIdentifier<Type>[] | null;
    meta?: KeyValueObject;
    links?: KeyValueObject;
}

export interface JsonApiRelationshipToOne<Type extends string = string> extends JsonApiRelationship<Type> {
    data?: JsonApiIdentifier<Type> | null;
}

export interface JsonApiRelationshipToMany<Type extends string = string> extends JsonApiRelationship<Type> {
    data?: JsonApiIdentifier<Type>[];
}
