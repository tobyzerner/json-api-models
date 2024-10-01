import { JsonApiResource, ModelForType, SchemaCollection } from './types';

type PartialJsonApiResource<T extends JsonApiResource> = {
    [P in keyof T]?: Partial<T[P]>;
};

class ModelBase<Schema extends JsonApiResource = JsonApiResource> {
    public type: Schema['type'];
    public id: Schema['id'];
    public attributes: NonNullable<Schema['attributes']> = {};
    public relationships: NonNullable<Schema['relationships']> = {};
    public meta: Schema['meta'] = {};
    public links: Schema['links'] = {};

    constructor(data: Schema) {
        this.type = data.type;
        this.id = data.id;

        this.merge(data);
    }

    /**
     * Make a resource identifier object for this model.
     */
    public identifier() {
        return {
            id: this.id,
            type: this.type,
        };
    }

    /**
     * Merge new JSON:API resource data into the model.
     */
    public merge(data: PartialJsonApiResource<Schema>): void {
        this.links = data.links ?? this.links;
        this.meta = data.meta ?? this.meta;

        if (data.attributes) {
            Object.assign(this.attributes, data.attributes);
        }

        if (data.relationships) {
            Object.entries(data.relationships).forEach(
                ([name, relationship]) => {
                    this.relationships[name] = this.relationships[name] || {};
                    Object.assign(this.relationships[name], relationship);
                },
            );
        }
    }
}

type ProxiedModel<
    Schema extends JsonApiResource,
    Schemas extends Record<string, JsonApiResource>,
> = Schema &
    Schema['attributes'] & {
        [Property in keyof NonNullable<Schema['relationships']>]: NonNullable<
            NonNullable<Schema['relationships']>[Property]
        > extends { data?: infer Data }
            ? Data extends { type: infer RelatedType extends string }
                ? ModelForType<RelatedType, Schemas> | undefined
                : Data extends { type: infer RelatedType extends string }[]
                  ? ModelForType<RelatedType, Schemas>[]
                  : null
            : never;
    };

export type Model<
    Schema extends JsonApiResource = JsonApiResource,
    Schemas extends SchemaCollection = SchemaCollection,
> = JsonApiResource<Schema['type']> &
    ModelBase<Schema> &
    ProxiedModel<Schema, Schemas>;

export const Model: new <
    Schema extends JsonApiResource = JsonApiResource,
    Schemas extends SchemaCollection = SchemaCollection,
>(
    data: JsonApiResource<Schema['type']>,
) => Model<Schema, Schemas> = ModelBase as any;
