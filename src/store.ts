import { Model } from './model';
import {
    JsonApiDocument,
    JsonApiIdentifier,
    JsonApiResource,
} from './types';

interface Graph {
    [type: string]: {
        [id: string]: Model;
    };
}

type ModelConstructor = { new(data: JsonApiResource, store?: Store): Model };

interface ModelCollection {
    [type: string]: ModelConstructor;
}

export class Store {
    protected graph: Graph = {};

    public constructor(public models: ModelCollection = {}) {}

    public model(type: string, model: ModelConstructor): void {
        this.models[type] = model;
    }

    public find(identifier: JsonApiIdentifier): Model;
    public find(identifiers: JsonApiIdentifier[]): Model[];
    public find(type: string, id: string): Model;
    public find(a: JsonApiIdentifier | JsonApiIdentifier[] | string, b?: string) {
        if (a === null) {
            return null;
        }

        if (Array.isArray(a)) {
            return a.map((identifier: JsonApiIdentifier) => this.find(identifier));
        }

        if (typeof a === 'object') {
            return this.find(a.type, a.id);
        }

        return (this.graph[a] && this.graph[a][b]) || null;
    }

    public findAll(type: string): Model[] {
        if (! this.graph[type]) {
            return [];
        }

        return Object.keys(this.graph[type])
            .map(id => this.graph[type][id]);
    }

    public sync(document: JsonApiDocument): Model | Model[] {
        const syncResource = this.syncResource.bind(this);

        if ('included' in document) {
            document.included.map(syncResource);
        }

        return Array.isArray(document.data) ? document.data.map(syncResource) : syncResource(document.data);
    }

    public syncResource(data: JsonApiIdentifier): Model {
        const { type, id } = data;

        this.graph[type] = this.graph[type] || {};

        if (this.graph[type][id]) {
            this.graph[type][id].merge(data);
        } else {
            this.graph[type][id] = this.createModel(data);
        }

        return this.graph[type][id];
    }

    private createModel(data: JsonApiIdentifier): Model {
        const ModelClass = this.models[data.type] || this.models['*'] || Model;

        return new ModelClass(data, this);
    }

    public forget(data: JsonApiIdentifier): void {
        delete this.graph[data.type][data.id];
    }

    public reset(): void {
        this.graph = {};
    }
}
