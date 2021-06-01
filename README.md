# @humblebee/config-wepback5

Centralized configuration for webpack v5

## Getting started

Install the packages from your favorite package manager

```bash
npm i -D webpack @humblebee/config-wepback5 # or yarn
```

This package provides a default centralised config for building web applications with webpack v5.

```js
// webpack.config.babel.js
import path from 'path';
import { getWebpack5FrontendConfiguration } from '@humblebee/config-webpack5';

// arbitrary
const BUILD_FOLDER = path.resolve(__dirname, 'dist');
const PUBLIC_FOLDER = path.resolve(__dirname, 'public');

const getWebpackConfiguration = (_env, args) => {
  const { mode } = args;

  switch (mode) {
    case 'development':
      return getWebpack5FrontendConfiguration(
        'development',
        {
          // options for the shared configuration
          buildFolder: BUILD_FOLDER,
          publicFolder: PUBLIC_FOLDER,
          htmlTemplate: path.resolve(PUBLIC_FOLDER, 'index.html'),
          // devServer: {
          //   // ...
          // }
        },
        {
          // options forwarded to the webpack configuration
          // add whatever you need
        },
      );
    case 'production':
      return getWebpack5FrontendConfiguration(
        'production',
        {
          // options for the shared configuration
          buildFolder: BUILD_FOLDER,
          publicFolder: PUBLIC_FOLDER,
          htmlTemplate: path.resolve(PUBLIC_FOLDER, 'index.html'),
          // imageminOptions: {},
          // subResourceIntegrityOptions: {},
          // hashedModuleIdsOptions: {},
        },
        {
          // options forwarded to the webpack configuration
          // add whatever you need
        },
      );
    default:
      throw new Error(`Unable to provide configuration for unknown environment: "${mode}"`);
  }
};
```
