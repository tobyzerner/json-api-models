import { Model, Store } from '../src';
import { catWithFriendDocument, dogDocument, dogsDocument } from './payload';

const store = new Store();

describe('Store', () => {
    afterEach(() => {
        store.reset();
    });

    describe('find', () => {
        it('should work with a type and an id', () => {
            store.sync(dogDocument);
            const model = store.find('dogs', '1');
            expect(model).toBeInstanceOf(Model);
        });

        it('should work with a resource identifier', () => {
            store.sync(dogDocument);
            const model = store.find({ type: 'dogs', id: '1' });
            expect(model).toBeInstanceOf(Model);
        });

        it('should work with an array of resource identifiers', () => {
            store.sync(dogsDocument);
            const models = store.find([
                { type: 'dogs', id: '1' },
                { type: 'dogs', id: '2' },
            ]);
            expect(models).toBeInstanceOf(Array);
            expect(models).toHaveLength(2);
            expect(models[0]).toBeInstanceOf(Model);
            expect(models[1]).toBeInstanceOf(Model);
        });

        it('should return null if resource does not exist', () => {
            expect(store.find('dogs', '1')).toBeNull();
        });
    });

    describe('findAll', () => {
        it('should return an Array', () => {
            store.sync(dogsDocument);
            const models = store.findAll('dogs');
            expect(models).toBeInstanceOf(Array);
            expect(models).toHaveLength(2);
        });
    });

    describe('constructor', () => {
        it('should allow using custom models', () => {
            const Dog = class extends Model {};
            const store = new Store({ dogs: Dog });
            store.sync(dogDocument);
            const model = store.find('dogs', '1');
            expect(model).toBeInstanceOf(Dog);
        });
    });

    describe('sync', () => {
        it('should sync included data', () => {
            store.sync(catWithFriendDocument);
            const model = store.find('dogs', '1');
            expect(model).toBeInstanceOf(Model);
        });

        it('should proxy models to allow quick attribute and related resource access', () => {
            const model = store.sync(catWithFriendDocument) as Model;
            expect(model.friend).toMatchObject(
                catWithFriendDocument.data.relationships.friend.data,
            );
            expect(model.friend.name).toBe(
                catWithFriendDocument.included[0].attributes.name,
            );
        });
    });

    describe('forget', () => {
        it('should forget a model', () => {
            store.sync(dogDocument);
            store.forget(dogDocument.data);
            expect(store.find('dog', '1')).toBeNull();
        });
    });
});
