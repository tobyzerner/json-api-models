import { Query } from '../src/query';

describe('Query', () => {
    describe('constructor', () => {
        it('should accept a map', () => {
            const query = new Query({
                one: 'value',
                two: 'value',
            });
            expect(query.toString()).toBe('one=value&two=value');
        });
    });

    describe('append', () => {
        it('should accept a key and a value', () => {
            const query = new Query();
            query.append('foo', 'bar');
            expect(query.toString()).toBe('foo=bar');
        });

        it('should accept a map', () => {
            const query = new Query();
            query.append({
                one: 'value',
                two: 'value',
            });
            expect(query.toString()).toBe('one=value&two=value');
        });

        it('should append to existing values', () => {
            const query = new Query({
                foo: 'bar',
            });
            query.append('foo', 'appended');
            expect(query.toString()).toBe('foo=bar%2Cappended');
        });
    });

    describe('set', () => {
        it('should accept a key and a value', () => {
            const query = new Query();
            query.set('foo', 'bar');
            expect(query.toString()).toBe('foo=bar');
        });

        it('should accept a map', () => {
            const query = new Query();
            query.set({
                one: 'value',
                two: 'value',
            });
            expect(query.toString()).toBe('one=value&two=value');
        });

        it('should replace existing values', () => {
            const query = new Query({
                foo: 'bar',
            });
            query.set('foo', 'replaced');
            expect(query.toString()).toBe('foo=replaced');
        });
    });

    describe('delete', () => {
        it('should accept a key', () => {
            const query = new Query({
                foo: 'bar'
            });
            query.delete('foo');
            expect(query.toString()).toBe('');
        });

        it('should accept an array of keys', () => {
            const query = new Query({
                one: 'value',
                two: 'value',
            });
            query.delete(['one', 'two']);
            expect(query.toString()).toBe('');
        });
    });

    describe('toString', () => {
        it('should sort keys', () => {
            const query = new Query({
                c: 'foo',
                a: 'foo',
            });
            query.append('b', 'foo');
            expect(query.toString()).toBe('a=foo&b=foo&c=foo');
        });

        it('should properly encode parameters', () => {
            const query = new Query({
                'filter[q]': '&',
            });
            expect(query.toString()).toBe('filter%5Bq%5D=%26');
        });
    });
});
