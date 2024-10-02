import { Model } from './model';
import {
    JsonApiDocument,
    JsonApiIdentifier,
    JsonApiResource,
    ModelForType,
    ModelMap,
    SchemaCollection,
} from './types';

export class Store<Schemas extends SchemaCollection = {}> {
    protected graph: { [type: string]: { [id: string]: any } } = {};

    public constructor(public models: ModelMap<Schemas> = {}) {}

    public find<Type extends (keyof Schemas & string) | (string & {})>(
        identifier: JsonApiIdentifier<Type> | null,
    ): ModelForType<Type, Schemas> | null;
    public find<Type extends (keyof Schemas & string) | (string & {})>(
        identifiers: JsonApiIdentifier<Type>[],
    ): ModelForType<Type, Schemas>[];
    public find<Type extends (keyof Schemas & string) | (string & {})>(
        type: Type,
        id: string,
    ): ModelForType<Type, Schemas> | null;
    public find<Type extends (keyof Schemas & string) | (string & {})>(
        a: JsonApiIdentifier<Type> | JsonApiIdentifier<Type>[] | Type | null,
        b?: string,
    ) {
        if (a === null) {
            return null;
        }

        if (Array.isArray(a)) {
            return a.map((identifier) => this.find(identifier));
        }

        if (typeof a === 'object') {
            return this.find(a.type, a.id);
        }

        if (b) {
            return this.graph[a]?.[b] || null;
        }

        return null;
    }

    public findAll<Type extends (keyof Schemas & string) | (string & {})>(
        type: Type,
    ): ModelForType<Type, Schemas>[] {
        if (!this.graph[type]) {
            return [];
        }

        return Object.keys(this.graph[type]).map((id) => this.graph[type][id]);
    }

    public sync<Type extends (keyof Schemas & string) | (string & {})>(
        document: JsonApiDocument<Type>,
    ): ModelForType<Type, Schemas> | ModelForType<Type, Schemas>[] | null {
        document.included?.map((resource) => this.syncResource(resource));

        if (Array.isArray(document.data)) {
            return document.data.map((resource) => this.syncResource(resource));
        }

        if (document.data) {
            return this.syncResource(document.data);
        }

        return null;
    }

    public syncResource<Type extends (keyof Schemas & string) | (string & {})>(
        data: JsonApiResource<Type>,
    ): ModelForType<Type, Schemas> {
        const { type, id } = data;

        this.graph[type] = this.graph[type] || {};

        if (this.graph[type][id]) {
            this.graph[type][id].merge(data);
        } else {
            this.graph[type][id] = this.createModel(data);
        }

        return this.graph[type][id];
    }

    public createModel<Type extends (keyof Schemas & string) | (string & {})>(
        data: JsonApiResource<Type>,
    ): ModelForType<Type, Schemas> {
        const ModelClass = this.models[data.type] || Model;

        return new Proxy(new ModelClass(data), {
            get: (target, prop, receiver) => {
                if (typeof prop === 'string') {
                    if (target.attributes?.[prop] !== undefined) {
                        return target.attributes[prop];
                    }
                    const data = target.relationships?.[prop]?.data;
                    if (data !== undefined) {
                        return Array.isArray(data)
                            ? this.find(data)
                            : this.find(data);
                    }
                }
                return Reflect.get(target, prop, receiver);
            },
        }) as ModelForType<Type, Schemas>;
    }

    public forget(data: JsonApiIdentifier): void {
        delete this.graph[data.type][data.id];
    }

    public reset(): void {
        this.graph = {};
    }
}
