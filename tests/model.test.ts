import { Model } from '../src';
import { dogDocument } from './payload';

describe('Model', () => {
    describe('constructor', () => {
        it('should assign given data', () => {
            const model = new Model(dogDocument.data);

            expect(model.type).toBe(dogDocument.data.type);
            expect(model.id).toBe(dogDocument.data.id);
            expect(model.attributes.name).toBe(
                dogDocument.data.attributes.name,
            );
        });
    });

    describe('identifier', () => {
        it('should return a resource identifier', () => {
            const model = new Model(dogDocument.data);

            expect(model.identifier()).toStrictEqual({
                type: dogDocument.data.type,
                id: dogDocument.data.id,
            });
        });
    });
});
