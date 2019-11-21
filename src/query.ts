function fixedEncodeURIComponent(str: string): string {
    return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
        return '%' + c.charCodeAt(0).toString(16).toUpperCase();
    });
}

function appendable(key: string): boolean {
    return key === 'include' || /fields\[[^\]]+]/i.test(key);
}

export class Query {
    private readonly query: any;

    public constructor(query: any = {}) {
        this.query = Object.assign({}, query);
    }

    public push(key: object | string, value?: any): this {
        if (typeof key === 'object') {
            Object.entries(key).map(entry => this.push.apply(this, entry));
        } else if (appendable(key)) {
            this.query[key] = (this.query[key] ? this.query[key] + ',' : '') + value;
        } else {
            this.query[key] = value;
        }

        return this;
    }

    public toString(): string {
        return Object.entries<any>(this.query)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([k, v]) => fixedEncodeURIComponent(k) + '=' + fixedEncodeURIComponent(v))
            .join('&');
    }
}
