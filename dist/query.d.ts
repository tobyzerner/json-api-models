export declare class Query {
    readonly query: any;
    constructor(query?: any);
    append(key: string, value: any): this;
    append(values: object): this;
    set(key: string, value: any): this;
    set(values: object): this;
    delete(key: string): this;
    delete(keys: string[]): this;
    toString(): string;
}
