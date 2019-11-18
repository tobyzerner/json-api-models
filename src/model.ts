import { Store } from './store';
import {
    IJsonApiIdentifier,
    IJsonApiRelationships,
    IJsonApiResource, TKeyValueObject
} from './jsonApi';

export class Model implements IJsonApiResource {
    public type: string;
    public id: string;
    public attributes: TKeyValueObject = {};
    public relationships: IJsonApiRelationships = {};
    public meta: TKeyValueObject = {};
    public links: TKeyValueObject = {};

    [field: string]: any;

    constructor(data: IJsonApiResource, protected store: Store) {
        this.merge(data);
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
                Object.defineProperty(this, name, {
                    configurable: true,
                    get: () => this.attributes[name],
                });
            });
        }

        if ('relationships' in data) {
            for (const [name, relationship] of Object.entries(data.relationships)) {
                this.relationships[name] = this.relationships[name] || {};

                Object.assign(this.relationships[name], relationship);

                Object.defineProperty(this, name, {
                    configurable: true,
                    get: () => this.store.find(this.relationships[name].data as IJsonApiIdentifier),
                });
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
