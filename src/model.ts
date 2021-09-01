import { Store } from './store';
import {
    JsonApiIdentifier,
    JsonApiRelationships,
    JsonApiResource, KeyValueObject
} from './types';

export type CastAttributes = {
    [key: string]: StringConstructor | NumberConstructor | BooleanConstructor | ((value: any) => any) | (new(value: any) => any);
}

function isConstructor(obj: any): obj is (new(value: any) => any) {
    return !! obj.prototype && !! obj.prototype.constructor.name;
}

export class Model implements JsonApiResource {
    public type: string;
    public id: string;
    public attributes: KeyValueObject = {};
    public relationships: JsonApiRelationships = {};
    public meta: KeyValueObject = {};
    public links: KeyValueObject = {};

    protected casts: CastAttributes = {};

    [field: string]: any;

    constructor(data: JsonApiResource, protected store: Store) {
        this.merge(data);
    }

    public getAttribute(name: string): any {
        const value = this.attributes[name];
        const cast = this.casts[name];

        if (cast && value !== null && value !== undefined) {
            if (cast === String || cast === Number || cast === Boolean || ! isConstructor(cast)) {
                return (cast as any)(value);
            }

            return new cast(value);
        }

        return value;
    }

    public getRelationship(name: string): any {
        return this.store.find(this.relationships[name].data as JsonApiIdentifier);
    }

    /**
     * Make a resource identifier object for this model.
     */
    identifier(): JsonApiIdentifier {
        return {
            id: this.id,
            type: this.type
        };
    }

    /**
     * Merge new JSON:API resource data into the model.
     */
    merge(data: JsonApiResource): void {
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
