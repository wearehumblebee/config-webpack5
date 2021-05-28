import type { Configuration } from 'webpack';
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import { merge } from 'webpack-merge';

import { getCoreConfiguration, CoreConfigurationOptions } from './core';

/**
 * there are no official typings for webpack-dev-server v4 as of today.
 * @warning those are provided as a best-effort only, based on the current CHANGELOG status
 *
 * @see https://github.com/webpack/webpack-dev-server/releases/tag/v4.0.0-beta.0
 */
export interface DevServerConfiguration_v4
  extends Omit<
    DevServerConfiguration,
    | 'allowedHosts'
    | 'after'
    | 'before'
    | 'clientOptions'
    | 'contentBase'
    | 'contentBasePublicPath'
    | 'disableHostCheck'
    | 'features'
    | 'filename'
    | 'fs'
    | 'hotOnly'
    | 'index'
    | 'inline'
    | 'lazy'
    | 'mimeTypes'
    | 'progress'
    | 'profile'
    | 'publicPath'
    | 'serveIndex'
    | 'serverSideRender'
    | 'setup'
    | 'socket'
    | 'sockHost'
    | 'sockPath'
    | 'sockPort'
    | 'staticOptions'
    | 'stats'
    | 'watchContentBase'
    | 'watchOptions'
    | 'writeToDisk'
  > {
  /** optional "client" options */
  client?: Record<string, unknown>;
  /** options forwarded to webpack-dev-middleware */
  devMiddleware?: Record<string, unknown>;
  /** optional list of allowed hosts (default to false, allowing all hosts) */
  firewall?: false | string[];
  /** define behavior for "static" folder(s) */
  static?:
    | false
    | string
    | {
        directory: string;
        /** static directory public path (not to be confused with devServer.dev.publicPath!) */
        publicPath: string | string[];
        /** optional options forwarded to serve-index */
        serveIndex: boolean | Record<string, unknown>;
        /** optional options forwarded to serve-static */
        staticOptions?: Record<string, unknown>;
        /** optional options forwarded to chokidar */
        watch: boolean | Record<string, unknown>;
      }[];
  /** default to "ws" (set to "sockjs" if you need to support legacy browsers such as IE11) */
  transportMode?: 'ws' | 'sockjs';
}

export interface DevelopmentConfiguration extends Configuration {
  devServer: DevServerConfiguration_v4;
}

export interface DevelopmentConfigurationOptions extends CoreConfigurationOptions {
  /** webpack-dev-server options */
  devServer?: DevServerConfiguration_v4;
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
