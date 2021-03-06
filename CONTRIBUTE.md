## Contribute

#### Dev

Run microbundle in watch mode

```
yarn run dev
```

#### Build

Build the library

```
yarn run build
```

#### Test

Run the tests

```
yarn run test
```

## Commit

After adding files to be commited, run `yarn cz` (instead of `git commit`) to get prompted by commitizen: commit messages should respect a convention that semantic-release will use to determine the version to release and generate the changelog.

## Release

The release process is automated with GitHub Actions, using [semantic-release](https://github.com/semantic-release/semantic-release/blob/master/docs/recipes/github-actions.md)

Commit messages must follow [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) (commitlint will refuse them otherwise)
