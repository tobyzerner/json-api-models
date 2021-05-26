import { Store } from './store';
import {
    IJsonApiIdentifier,
    IJsonApiRelationships,
    IJsonApiResource, TKeyValueObject
} from './jsonApi';

export type TCastAttributes = {
    [key: string]: FunctionConstructor;
}

export class Model implements IJsonApiResource {
    public type: string;
    public id: string;
    public attributes: TKeyValueObject = {};
    public relationships: IJsonApiRelationships = {};
    public meta: TKeyValueObject = {};
    public links: TKeyValueObject = {};

    protected casts: TCastAttributes = {};

    [field: string]: any;

    constructor(data: IJsonApiResource, protected store: Store) {
        this.merge(data);
    }

    public getAttribute(name: string): any {
        const value = this.attributes[name];
        const cast = this.casts[name];

        if (cast && value !== null && value !== undefined) {
            return new cast(value);
        }

        return value;
    }

    public getRelationship(name: string): any {
        return this.store.find(this.relationships[name].data as IJsonApiIdentifier);
    }

    /**
     * Make a resource identifier object for this model.
     */
    identifier(): IJsonApiIdentifier {
        return {
            id: this.id,
            type: this.type
        };
    }

    /**
     * Merge new JSON:API resource data into the model.
     */
    merge(data: IJsonApiResource): void {
        if ('type' in data) {
            this.type = data.type;
        }

        if ('id' in data) {
            this.id = data.id;
        }

        if ('attributes' in data) {
            Object.assign(this.attributes, data.attributes);

            Object.keys(data.attributes).forEach(name => {
                if (! Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this), name)) {
                    Object.defineProperty(this, name, {
                        configurable: true,
                        get: () => this.getAttribute(name),
                    });
                }
            });
        }

        if ('relationships' in data) {
            for (const [name, relationship] of Object.entries(data.relationships)) {
                this.relationships[name] = this.relationships[name] || {};

                Object.assign(this.relationships[name], relationship);

                if (! Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this), name)) {
                    Object.defineProperty(this, name, {
                        configurable: true,
                        get: () => this.getRelationship(name),
                    });
                }
            }
        }

        if ('links' in data) {
            this.links = data.links;
        }

        if ('meta' in data) {
            this.meta = data.meta;
        }
    }
}
