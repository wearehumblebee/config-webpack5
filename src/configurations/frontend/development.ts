import type { Configuration } from 'webpack';
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import { merge } from 'webpack-merge';

import { getCoreConfiguration, CoreConfigurationOptions } from './core';

export interface DevelopmentConfiguration extends Configuration {
  devServer: DevServerConfiguration;
}

export interface DevelopmentConfigurationOptions extends CoreConfigurationOptions {
  /** webpack-dev-server options */
  devServer?: DevServerConfiguration;
  /** A developer tool to enhance debugging (sourcemaps) */
  devtool?: Configuration['devtool'];
  /** define resources crossorigin policy (default to "anonymous") */
  crossOriginLoading?: false | 'anonymous' | 'use-credentials';
}

/**
 * Development config based on webpack-dev-server
 * @see https://webpack.js.org/guides/development/
 *
 * Hot Module Reloading is supported, but local cache will prevent it to work with renamed/deleted files
 * This should be fixed in the next major version of webpack (v5) which is currently in beta
 * @see https://github.com/webpack/webpack/issues/5523
 */
export const getDevelopmentConfiguration = ({
  crossOriginLoading = 'anonymous',
  devtool = 'cheap-module-source-map',
  devServer = {
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    host: 'localhost',
    port: new Date().getFullYear(),
  },
  ...options
}: DevelopmentConfigurationOptions): DevelopmentConfiguration =>
  merge(getCoreConfiguration(options), {
    mode: 'development',
    /**
     * Control over build process output
     * @see https://webpack.js.org/configuration/output/
     */
    output: {
      chunkFilename: '[name].chunk.js',
      clean: true,
      crossOriginLoading,
      filename: '[name].js',
      path: options.buildFolder,
      publicPath: '/',
    },
    /**
     * Control source maps generation
     * Feel free to change that to your needs!
     * @see https://webpack.js.org/configuration/devtool/
     */
    devtool,
    /**
     * Webpack Dev Server
     * @see https://webpack.js.org/configuration/dev-server/
     */
    devServer,
    plugins: [],
    /**
     * Webpack optimisation: do not loose yourself in there, this is just the development config
     * @see https://webpack.js.org/configuration/optimization/
     */
    optimization: {
      /** https://webpack.js.org/configuration/optimization/#optimizationemitonerrors */
      emitOnErrors: false,
      /** https://webpack.js.org/configuration/optimization/#optimizationminimize */
      minimize: false,
      /** https://webpack.js.org/configuration/optimization/#optimizationmoduleids */
      moduleIds: 'named',
    },
    /**
     * Webpack performance: in development mode, bundles are non-minified
     * @see https://webpack.js.org/configuration/performance/
     *
     * You can still refer to it as a vague indicator
     */
    performance: {
      hints: 'warning',
    },
  }) as DevelopmentConfiguration;
