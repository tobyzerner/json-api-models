import { JsonApiIdentifier, Model, Store } from '../src';
import { catWithFriendDocument, dogDocument } from './payload';

describe('Model', () => {
    describe('constructor', () => {
        it('should assign given data', () => {
            const model = new Model(dogDocument.data, new Store());
            expect(model.type).toBe(dogDocument.data.type);
            expect(model.id).toBe(dogDocument.data.id);
            expect(model.attributes.name).toBe(
                dogDocument.data.attributes.name
            );
        });

        it('should define attribute getters', () => {
            const model = new Model(dogDocument.data, new Store());
            expect(model.name).toBe(dogDocument.data.attributes.name);
        });

        it('should define relationship getters', () => {
            const storeMock = {
                find(identifier: JsonApiIdentifier) {
                    return identifier;
                },
            };

            const model = new Model(
                catWithFriendDocument.data,
                storeMock as unknown as Store
            );
            expect(model.friend).toBe(
                catWithFriendDocument.data.relationships.friend.data
            );
        });
    });

    describe('identifier', () => {
        it('should return a resource identifier', () => {
            const model = new Model(dogDocument.data, new Store());
            expect(model.identifier()).toStrictEqual({
                type: dogDocument.data.type,
                id: dogDocument.data.id,
            });
        });
    });

    describe('casts', () => {
        class Test {
            constructor(public value: string) {}
        }

        class User extends Model {
            protected casts = {
                string: String,
                boolean: Boolean,
                number: Number,
                date: Date,
                callable: (value: string) => value.toUpperCase(),
                constructable: Test,
            };
        }

        const user = new User(
            {
                type: 'users',
                id: '1',
                attributes: {
                    string: 123,
                    boolean: 'boolean',
                    number: '123',
                    date: '2020-01-01',
                    callable: 'value',
                    constructable: 'value',
                },
            },
            new Store()
        );

        it('should cast primitives', () => {
            expect(user.getAttribute('string')).toStrictEqual('123');
            expect(user.getAttribute('boolean')).toStrictEqual(true);
            expect(user.getAttribute('number')).toStrictEqual(123);
        });

        it('should cast dates', () => {
            expect(user.getAttribute('date')).toEqual(new Date('2020-01-01'));
        });

        it('should cast constructables', () => {
            const test = user.getAttribute('constructable');
            expect(test).toBeInstanceOf(Test);
            expect(test.value).toEqual('value');
        });

        it('should cast callables', () => {
            expect(user.getAttribute('callable')).toStrictEqual('VALUE');
        });
    });
});
