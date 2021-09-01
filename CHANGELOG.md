# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0-beta.7] - 2021-09-01
### Fixed
- Fix regression with attribute casting not handling dates correctly, and add more sophisticated handling of primitives, constructables, and callables.

## [0.1.0-beta.6] - 2021-09-01
### Fixed
- Fix attribute cast type definition and invoke as function rather than with `new`.

## [0.1.0-beta.5] - 2021-08-31
### Added
- Query: add `append`, `set`, and `delete` methods.
- Export useful JSON:API types: `JsonApiDocument`, `JsonApiIdentifier`, `JsonApiResource`, `JsonApiRelationships`, and `JsonApiRelationship`.

### Removed
- Query: remove `push` method.

## [0.1.0-beta.4] - 2021-05-26
### Fixed
- Fix casts not working correctly.

## [0.1.0-beta.3] - 2021-05-26
### Added
- Added ability to define typecasts for attributes on custom models.

### Changed
- Change compilation target to `es2017` for `Object.entries` support.

## [0.1.0-beta.2] - 2021-01-17
- Initial release

[Unreleased]: https://github.com/tobyzerner/json-api-models/compare/v0.1.0-beta.7...HEAD
[0.1.0-beta.7]: https://github.com/tobyzerner/json-api-models/compare/v0.1.0-beta.6...v0.1.0-beta.7
[0.1.0-beta.6]: https://github.com/tobyzerner/json-api-models/compare/v0.1.0-beta.5...v0.1.0-beta.6
[0.1.0-beta.5]: https://github.com/tobyzerner/json-api-models/compare/v0.1.0-beta.4...v0.1.0-beta.5
[0.1.0-beta.4]: https://github.com/tobyzerner/json-api-models/compare/v0.1.0-beta.3...v0.1.0-beta.4
[0.1.0-beta.3]: https://github.com/tobyzerner/json-api-models/compare/v0.1.0-beta.1...v0.1.0-beta.3
