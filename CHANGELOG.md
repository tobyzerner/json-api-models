# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0-beta.8] - 2024-12-09

### Fixed

-   Fix Schemas not being passed through to `Model.store`

## [0.2.0-beta.7] - 2024-12-07

### Fixed

-   Fix model typing

## [0.2.0-beta.6] - 2024-12-05

### Changed

-   Revert to non-proxy implementation of model fields

### Fixed

-   Make model relationship fields optional

## [0.2.0-beta.5] - 2024-10-02

### Fixed

-   Fix falsy attribute values not being returned

## [0.2.0-beta.4] - 2024-10-01

### Changed

-   Remove index signature from `Model`

## [0.2.0-beta.3] - 2024-09-03

### Added

-   Allow syncing `null` document data.
-   Add `exports` field to package.json.

## [0.2.0-beta.1] - 2024-05-14

### ⚠️ Breaking Changes

-   Rewrite TypeScript support to allow Intellisense based on JSON:API resource schema. For example:

    ```ts
    type UsersSchema = {
        type: 'users';
        id: string;
        attributes: {
            name: string;
        };
        relationships: {
            dog: { data?: { type: 'dogs'; id: string } | null };
        };
    };

    class User extends Model<UsersSchema> {}
    ```

    To type related resources, you can provide a collection of all models as the second generic.

    ```ts
    type DogsSchema = {
        // ...
    };

    type Schemas = {
        users: User;
        dogs: Dog;
    };

    class User extends Model<UsersSchema, Schemas> {}
    class Dog extends Model<DogsSchema, Schemas> {}
    ```

-   The `Store` now returns proxied `Model` instances to implement field getters, instead of `Model` depending on `Store` and defining getters for present fields.

-   Remove the `Query` helper. Use [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) instead.

-   Remove `Model` attribute casting functionality. Define getters instead:

    ```ts
    class User extends Model<UserSchema> {
        get createdAtDate() {
            return new Date(this.createdAt);
        }
    }
    ```

-   Remove the `Model.getAttribute()` and `Model.getRelationship()` methods.
-   Remove CJS and IIFE exports. Package is now only exported as an ES module.

## [0.1.0-beta.8] - 2022-06-05

### Added

-   Support model type inference:

    ```ts
    const store = new Store({ users: User });
    store.find('users', '1'); // User
    ```

### Removed

-   Remove the `Store.model` method. Models must now be defined when the Store is constructed.

## [0.1.0-beta.7] - 2021-09-01

### Fixed

-   Fix regression with attribute casting not handling dates correctly, and add more sophisticated handling of primitives, constructables, and callables.

## [0.1.0-beta.6] - 2021-09-01

### Fixed

-   Fix attribute cast type definition and invoke as function rather than with `new`.

## [0.1.0-beta.5] - 2021-08-31

### Added

-   Query: add `append`, `set`, and `delete` methods.
-   Export useful JSON:API types: `JsonApiDocument`, `JsonApiIdentifier`, `JsonApiResource`, `JsonApiRelationships`, and `JsonApiRelationship`.

### Removed

-   Query: remove `push` method.

## [0.1.0-beta.4] - 2021-05-26

### Fixed

-   Fix casts not working correctly.

## [0.1.0-beta.3] - 2021-05-26

### Added

-   Added ability to define typecasts for attributes on custom models.

### Changed

-   Change compilation target to `es2017` for `Object.entries` support.

## [0.1.0-beta.2] - 2021-01-17

-   Initial release

[unreleased]: https://github.com/tobyzerner/json-api-models/compare/v0.2.0-beta.8...HEAD
[0.2.0-beta.8]: https://github.com/tobyzerner/json-api-models/compare/v0.2.0-beta.7...v0.2.0-beta.8
[0.2.0-beta.7]: https://github.com/tobyzerner/json-api-models/compare/v0.2.0-beta.6...v0.2.0-beta.7
[0.2.0-beta.6]: https://github.com/tobyzerner/json-api-models/compare/v0.2.0-beta.5...v0.2.0-beta.6
[0.2.0-beta.5]: https://github.com/tobyzerner/json-api-models/compare/v0.2.0-beta.4...v0.2.0-beta.5
[0.2.0-beta.4]: https://github.com/tobyzerner/json-api-models/compare/v0.2.0-beta.3...v0.2.0-beta.4
[0.2.0-beta.3]: https://github.com/tobyzerner/json-api-models/compare/v0.2.0-beta.1...v0.2.0-beta.3
[0.2.0-beta.1]: https://github.com/tobyzerner/json-api-models/compare/v0.1.0-beta.8...v0.2.0-beta.1
[0.1.0-beta.8]: https://github.com/tobyzerner/json-api-models/compare/v0.1.0-beta.7...v0.1.0-beta.8
[0.1.0-beta.7]: https://github.com/tobyzerner/json-api-models/compare/v0.1.0-beta.6...v0.1.0-beta.7
[0.1.0-beta.6]: https://github.com/tobyzerner/json-api-models/compare/v0.1.0-beta.5...v0.1.0-beta.6
[0.1.0-beta.5]: https://github.com/tobyzerner/json-api-models/compare/v0.1.0-beta.4...v0.1.0-beta.5
[0.1.0-beta.4]: https://github.com/tobyzerner/json-api-models/compare/v0.1.0-beta.3...v0.1.0-beta.4
[0.1.0-beta.3]: https://github.com/tobyzerner/json-api-models/compare/v0.1.0-beta.1...v0.1.0-beta.3
