import { JsonApiResource, SchemaCollection } from './types';
import { Store } from './store.ts';

class ModelBase<
    Schema extends JsonApiResource = JsonApiResource,
    Schemas extends SchemaCollection = SchemaCollection,
> {
    public type: Schema['type'];
    public id: Schema['id'];
    public attributes: NonNullable<Schema['attributes']> = {};
    public relationships: NonNullable<Schema['relationships']> = {};
    public meta: Schema['meta'] = {};
    public links: Schema['links'] = {};

    constructor(
        data: Schema,
        protected store: Store<Schemas>,
    ) {
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
    public merge(
        data: Omit<JsonApiResource<Schema['type']>, 'type' | 'id'>,
    ): void {
        this.links = data.links ?? this.links;
        this.meta = data.meta ?? this.meta;

        if (data.attributes) {
            Object.assign(this.attributes, data.attributes);

            Object.keys(data.attributes).forEach((name) => {
                if (
                    Object.getOwnPropertyDescriptor(
                        Object.getPrototypeOf(this),
                        name,
                    ) ||
                    Object.getOwnPropertyDescriptor(this, name)
                ) {
                    return;
                }

                (this as any)[name] = null;

                Object.defineProperty(this, name, {
                    get: () => this.attributes[name],
                    configurable: true,
                    enumerable: true,
                });
            });
        }

        if (data.relationships) {
            Object.entries(data.relationships).forEach(
                ([name, relationship]) => {
                    this.relationships[name] = this.relationships[name] || {};

                    Object.assign(this.relationships[name], relationship);

                    if (
                        Object.getOwnPropertyDescriptor(
                            Object.getPrototypeOf(this),
                            name,
                        ) ||
                        Object.getOwnPropertyDescriptor(this, name)
                    ) {
                        return;
                    }

                    (this as any)[name] = null;

                    Object.defineProperty(this, name, {
                        get: () => this.getRelationship(name),
                        configurable: true,
                        enumerable: true,
                    });
                },
            );
        }
    }

    private getRelationship(name: string) {
        const data = this.relationships[name].data;

        // https://github.com/microsoft/TypeScript/issues/14107
        if (Array.isArray(data)) {
            return this.store.find(data);
        }

        if (data) {
            return this.store.find(data);
        }
    }
}

type ProxiedModel<
    Schema extends JsonApiResource,
    Schemas extends SchemaCollection,
> = Schema &
    Schema['attributes'] & {
        [Property in keyof NonNullable<Schema['relationships']>]?: NonNullable<
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
    ModelBase<Schema, Schemas> &
    ProxiedModel<Schema, Schemas>;

export const Model: new <
    Schema extends JsonApiResource = JsonApiResource,
    Schemas extends SchemaCollection = SchemaCollection,
>(
    data: JsonApiResource<Schema['type']>,
    store: Store<Schemas>,
) => Model<Schema, Schemas> = ModelBase as any;

export type ModelMap<Schemas extends SchemaCollection = SchemaCollection> = {
    [Type in keyof Schemas & string]?: new (
        data: JsonApiResource<Type>,
        store: Store<Schemas>,
    ) => Schemas[Type];
};

export type ModelForType<
    Type extends string,
    Schemas extends SchemaCollection,
> = Type extends keyof Schemas
    ? Schemas[Type] extends ModelBase<JsonApiResource<Type>, Schemas>
        ? Schemas[Type]
        : Model<JsonApiResource<Type>, Schemas>
    : Model<JsonApiResource<Type>, Schemas>;
