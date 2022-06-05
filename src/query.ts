function fixedEncodeURIComponent(str: string): string {
    return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
        return '%' + c.charCodeAt(0).toString(16).toUpperCase();
    });
}

export class Query {
    public readonly query: any;

    public constructor(query: any = {}) {
        this.query = Object.assign({}, query);
    }

    public append(key: string, value: any): this;
    public append(values: object): this;
    public append(a: object | string, b?: any): this {
        if (typeof a === 'object') {
            Object.entries(a).map((entry) => this.append.apply(this, entry));
        } else {
            this.query[a] = (this.query[a] ? this.query[a] + ',' : '') + b;
        }

        return this;
    }

    public set(key: string, value: any): this;
    public set(values: object): this;
    public set(a: object | string, b?: any): this {
        if (typeof a === 'object') {
            Object.entries(a).map((entry) => this.set.apply(this, entry));
        } else {
            this.query[a] = b;
        }

        return this;
    }

    public delete(key: string): this;
    public delete(keys: string[]): this;
    public delete(a: string[] | string): this {
        if (Array.isArray(a)) {
            a.forEach((key) => this.delete(key));
        } else {
            delete this.query[a];
        }

        return this;
    }

    public toString(): string {
        return Object.entries<any>(this.query)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(
                ([k, v]) =>
                    fixedEncodeURIComponent(k) +
                    '=' +
                    fixedEncodeURIComponent(v)
            )
            .join('&');
    }
}
