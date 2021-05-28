# zeiq-base

## To publish

- `npm run bootstrap`
- `npm run build`
- `lerna version --force-publish`
- `lerna publish from-package --yes`

## To install and test package with NPM link

- Do `npm link` in package
- Then do `npm link @zeiq/core` in examples project

## Duplicate React bug

- run `npm link`in `/your-app/node_modules/react`. This should make the React's global link.
- run `npm link` react in `/your-ui-library`. This should make the library use the application’s React copy.
