export declare class Query {
    readonly query: any;
    constructor(query?: any);
    push(key: object | string, value?: any): this;
    toString(): string;
}
