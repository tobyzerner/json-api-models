import { Model } from './model';
import {
    IJsonApiDocument,
    IJsonApiIdentifier,
    IJsonApiResource,
} from './jsonApi';

interface Graph {
    [type: string]: {
        [id: string]: Model;
    };
}

type ModelConstructor = { new(data: IJsonApiResource, store?: Store): Model };

interface ModelCollection {
    [type: string]: ModelConstructor;
}

export class Store {
    protected graph: Graph = {};

    public constructor(public models: ModelCollection = {}) {}

    public model(type: string, model: ModelConstructor): void {
        this.models[type] = model;
    }

    public find(identifier: IJsonApiIdentifier): Model;
    public find(identifiers: IJsonApiIdentifier[]): Model[];
    public find(type: string, id: string): Model;
    public find(a: IJsonApiIdentifier | IJsonApiIdentifier[] | string, b?: string) {
        if (a === null) {
            return null;
        }

        if (Array.isArray(a)) {
            return a.map((identifier: IJsonApiIdentifier) => this.find(identifier));
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

    public sync(document: IJsonApiDocument): Model | Model[] {
        const syncResource = this.syncResource.bind(this);

        if ('included' in document) {
            document.included.map(syncResource);
        }

        return Array.isArray(document.data) ? document.data.map(syncResource) : syncResource(document.data);
    }

    public syncResource(data: IJsonApiIdentifier): Model {
        const { type, id } = data;

        this.graph[type] = this.graph[type] || {};

        if (this.graph[type][id]) {
            this.graph[type][id].merge(data);
        } else {
            this.graph[type][id] = this.createModel(data);
        }

        return this.graph[type][id];
    }

    private createModel(data: IJsonApiIdentifier): Model {
        const ModelClass = this.models[data.type] || this.models['*'] || Model;

        return new ModelClass(data, this);
    }

    public forget(data: IJsonApiIdentifier): void {
        delete this.graph[data.type][data.id];
    }

    public reset(): void {
        this.graph = {};
    }
}
