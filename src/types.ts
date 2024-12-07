export interface JsonApiDocument<Type extends string = string> {
    data: JsonApiResource<Type> | JsonApiResource<Type>[] | null;
    included?: JsonApiResource[];
    meta?: Record<string, any>;
    links?: Record<string, any>;
}

export interface JsonApiIdentifier<Type extends string = string> {
    type: Type;
    id: string;
}

export interface JsonApiResource<Type extends string = string>
    extends JsonApiIdentifier<Type> {
    attributes?: Record<string, any>;
    relationships?: JsonApiRelationships;
    meta?: Record<string, any>;
    links?: Record<string, any>;
}

export type JsonApiRelationships = Record<string, JsonApiRelationship>;

export interface JsonApiRelationship<Type extends string = string> {
    data?: JsonApiIdentifier<Type> | JsonApiIdentifier<Type>[] | null;
    meta?: Record<string, any>;
    links?: Record<string, any>;
}

export interface JsonApiRelationshipToOne<Type extends string = string>
    extends JsonApiRelationship<Type> {
    data?: JsonApiIdentifier<Type> | null;
}

export interface JsonApiRelationshipToMany<Type extends string = string>
    extends JsonApiRelationship<Type> {
    data?: JsonApiIdentifier<Type>[];
}

export type SchemaCollection = { [Type in string]: JsonApiResource<Type> };
