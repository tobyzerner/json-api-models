export class Query {
    private readonly query: any;

    public constructor(query: any = {}) {
        this.query = Object.assign({}, query);
    }

    public push(key: object | string, value?: any): this {
        if (typeof key === 'object') {
            Object.entries(key).map(entry => this.push.apply(this, entry));
        } else if (this.appendable(key)) {
            this.query[key] = (this.query[key] ? this.query[key] + ',' : '') + value;
        } else {
            this.query[key] = value;
        }

        return this;
    }

    private appendable(key: string): boolean {
        return key === 'include' || /fields\[[^\]]+]/i.test(key);
    }

    public toString(): string {
        return Object.entries<any>(this.query)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(v))
            .join('&');
    }
}
