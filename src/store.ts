import { Model } from './model';
import { JsonApiDocument, JsonApiIdentifier, JsonApiResource } from './types';

type Graph = {
    [type: string]: {
        [id: string]: any;
    };
};

export type ModelConstructor<Type extends string> = {
    new (data: JsonApiResource<Type>, store: Store): Model<Type>;
};

export type ModelCollection<Models> = {
    [Type in keyof Models & string]: ModelConstructor<Type>;
} & { '*'?: ModelConstructor<any> };

export type ModelForType<
    Type extends string,
    Models extends ModelCollection<Models>
> = Type extends keyof Models ? InstanceType<Models[Type]> : Model;

export class Store<Models extends ModelCollection<Models> = any> {
    protected graph: Graph = {};

    public constructor(public models: Models = {} as Models) {}

    public find<Type extends string>(
        identifier: JsonApiIdentifier<Type>
    ): ModelForType<Type, Models> | null;
    public find<Type extends string>(
        identifiers: JsonApiIdentifier<Type>[]
    ): ModelForType<Type, Models>[];
    public find<Type extends string>(
        type: Type,
        id: string
    ): ModelForType<Type, Models> | null;
    public find<Type extends string>(
        a: JsonApiIdentifier<Type> | JsonApiIdentifier<Type>[] | string,
        b?: string
    ) {
        if (a === null) {
            return null;
        }

        if (Array.isArray(a)) {
            return a.map((identifier: JsonApiIdentifier<Type>) =>
                this.find(identifier)
            );
        }

        if (typeof a === 'object') {
            return this.find(a.type, a.id);
        }

        return (this.graph[a] && this.graph[a][b]) || null;
    }

    public findAll<Type extends string>(
        type: Type
    ): ModelForType<Type, Models>[] {
        if (!this.graph[type]) {
            return [];
        }

        return Object.keys(this.graph[type]).map((id) => this.graph[type][id]);
    }

    public sync<Type extends string>(
        document: JsonApiDocument<Type>
    ): ModelForType<Type, Models> | ModelForType<Type, Models>[] | null {
        const syncResource = this.syncResource.bind(this);

        if ('included' in document) {
            document.included.map(syncResource);
        }

        return Array.isArray(document.data)
            ? document.data.map(syncResource)
            : syncResource(document.data);
    }

    public syncResource<Type extends string>(
        data: JsonApiResource<Type>
    ): ModelForType<Type, Models> {
        const { type, id } = data;

        this.graph[type] = this.graph[type] || {};

        if (this.graph[type][id]) {
            this.graph[type][id].merge(data);
        } else {
            this.graph[type][id] = this.createModel(data);
        }

        return this.graph[type][id];
    }

    protected createModel<Type extends string>(
        data: JsonApiResource<Type>
    ): ModelForType<Type, Models> {
        const ModelClass =
            this.models[data.type as keyof Models] || this.models['*'] || Model;

        return new ModelClass(data, this) as ModelForType<Type, Models>;
    }

    public forget(data: JsonApiIdentifier): void {
        delete this.graph[data.type][data.id];
    }

    public reset(): void {
        this.graph = {};
    }
}
