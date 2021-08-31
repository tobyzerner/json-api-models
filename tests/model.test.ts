import { Model, Store } from '../src/index';
import { catWithFriendDocument, dogDocument } from './payload';
import { JsonApiIdentifier } from '../src/types';

describe('Model', () => {
    describe('constructor', () => {
        it('should assign given data', () => {
            const model = new Model(dogDocument.data, new Store());
            expect(model.type).toBe(dogDocument.data.type);
            expect(model.id).toBe(dogDocument.data.id);
            expect(model.attributes.name).toBe(dogDocument.data.attributes.name);
        });

        it('should define attribute getters', () => {
            const model = new Model(dogDocument.data, new Store());
            expect(model.name).toBe(dogDocument.data.attributes.name);
        });

        it('should define relationship getters', () => {
            const storeMock = {
                find(identifier: JsonApiIdentifier) {
                    return identifier;
                }
            };

            const model = new Model(catWithFriendDocument.data, storeMock as unknown as Store);
            expect(model.friend).toBe(catWithFriendDocument.data.relationships.friend.data);
        });
    });

    describe('identifier', () => {
        it('should return a resource identifier', () => {
            const model = new Model(dogDocument.data, new Store());
            expect(model.identifier()).toStrictEqual({ type: dogDocument.data.type, id: dogDocument.data.id });
        })
    });
});
