# json-api-models

**A lightweight layer for working with [JSON:API](http://jsonapi.org) data on the client-side.**

```
npm install json-api-models --save
```

```ts
import { Store } from 'json-api-models';

const models = new Store();

// Sync a JSON:API response document to the store
models.sync({
    data: {
        type: 'humans',
        id: '1',
        attributes: { name: 'Toby' },
        relationships: {
            dog: { data: { type: 'dogs', id: '1' }}
        }
    },
    included: [{
        type: 'dogs',
        id: '1',
        attributes: { name: 'Rosie' }
    }]
});

// Resource data is transformed into easy-to-consume models
const human = models.find('humans', '1');
human.name // Toby
human.dog // { type: 'dogs', id: '1', name: 'Rosie' }
```

### Syncing JSON:API Data

Use the `sync` method to load your JSON:API response document into the store. Both the primary `data` and any `included` resources will be synced. The return value will be a model, or an array of models, corresponding to the primary data.

```ts
const model = models.sync(document);
```

If any of the synced resources already exist within the store, the new data will be **merged** into the old model. The model instance will not change so references to it throughout your application will remain intact.

You can also sync an individual resource using the `syncResource` method:

```ts
const model = models.syncResource({
    type: 'users',
    id: '1',
    attributes: { name: 'Toby' }
});
```

### Retrieving Models

Specific models can be retrieved from the store using the `find` method. Pass it a type and an ID, a resource identifier object, or an array of resource identifier objects:

```ts
const model = models.find('users', '1');
const model = models.find({ type: 'users', id: '1' });
const models = models.find([
    { type: 'users', id: '1' },
    { type: 'users', id: '2' }
]);
```

Retrieve all of the models of a given type using the `findAll` method:

```ts
const models = models.findAll('users');
```

### Working with Models

Models are a *superset* of JSON:API resource objects, meaning they contain all of the members you would expect (`type`, `id`, `attributes`, `relationships`, `meta`, `links`) plus some additional functionality.

Getters are automatically defined for all fields, allowing you to easily access their contents. Relationship fields are automatically resolved to their related models (if present within the store):

```ts
model.name // => model.attributes.name
model.dog // => models.find(model.relationships.dog.data)
```

To easily retrieve a resource identifier object for the model, the `identifier` method is available. This is useful when constructing relationships in JSON:API request documents.

```ts
model.identifier() // { type: 'users', id: '1' }
```

### Forgetting Models

Remove a model from the store using the `forget` method, which accepts a resource identifier object. This means you can pass a model directly into it:

```ts
models.forget(user);
```

### Custom Models

You can define custom model classes to add your own functionality. Custom models must extend the `Model` base class. This is useful if you wish to add any custom getters or methods to models for a specific resource type, and also to define types for each resource field:

```ts
import { Model } from 'json-api-models';

class User extends Model {
    public name: string;
    public age: number;
    
    get firstName() {
        return this.name.split(' ')[0];
    }
}
```

Register your custom models with the store either during construction, or with the `model` method:

```ts
const models = new Store({
    'users': User
});

// or
models.model('users', User);
```

### API Consumption Tips

This library is completely unopinionated about how you interact with your JSON:API. It merely gives you an easy way to work with the resulting JSON:API data. An example integration with `fetch` is demonstrated below:

```ts
const models = new Store();

function api(url, options = {}) {
    options.headers = options.headers || {};
    options.headers['Accept'] = 'application/vnd.api+json';

    if (options.body) {
        options.body = JSON.stringify(options.body);
        options.headers['Content-Type'] = 'application/vnd.api+json';
    }

    return fetch('http://example.org/api/' + url, options)
    	.then(response => {
        	if (response.status === 204) {
                return { response };
            } else {
                const document = await response.json();
                const data = models.sync(document);
                return { response, document, data };
            }
    	});
}

api('users/1').then(({ data }) => {
    console.log(data.name);
});
```

When constructing API requests, remember that JSON:API resource objects contain `links` that can be used instead of rebuilding the URL. Also, models contain an `identifier` method that can be used to spread the `type` and `id` members into the document `data` (required by the specification). Here is an example of a request to update a resource:

```ts
const user = models.find('users', '1');

api(user.links.self, {
    method: 'PATCH',
    body: {
        data: {
            ...user.identifier(),
            attributes: { name: 'Changed' }
        }
    }
});
```

### Building Queries

Building query strings for your JSON:API requests can be tedious, and sometimes they may need to be constructed dynamically with merge logic for certain parameters. The `Query` class takes care of this:

```ts
import { Query } from 'json-api-models';

const query = new Query({
    'include': 'foo',
    'fields[users]': 'name',
});

query.add('include', 'bar');
query.add('fields[users]', 'age');

query.toString() // include=foo,bar&fields[users]=name,age
```

## Contributing

Feel free to send pull requests or create issues if you come across problems or have great ideas.

## License

This code is published under the [The MIT License](LICENSE). This means you can do almost anything with it, as long as the copyright notice and the accompanying license file is left intact.
