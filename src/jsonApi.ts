export type TKeyValueObject = {
    [key: string]: any;
}

export interface IJsonApiDocument {
    data: IJsonApiResource | IJsonApiResource[];
    included?: IJsonApiResource[];
    meta?: TKeyValueObject;
    links?: TKeyValueObject;
}

export interface IJsonApiIdentifier {
    type: string;
    id: string;
}

export interface IJsonApiResource extends IJsonApiIdentifier {
    attributes?: TKeyValueObject;
    relationships?: IJsonApiRelationships;
    meta?: TKeyValueObject;
    links?: TKeyValueObject;
}

export interface IJsonApiRelationships {
    [relationName: string]: IJsonApiRelationship;
}

export interface IJsonApiRelationship {
    data?: IJsonApiIdentifier | IJsonApiIdentifier[];
    meta?: TKeyValueObject;
    links?: TKeyValueObject;
}
