import type { Configuration } from 'webpack';
import { merge } from 'webpack-merge';

import CompressionPlugin from 'compression-webpack-plugin';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';
import type { PluginOptions as ImageMinimizerPluginOptions } from 'image-minimizer-webpack-plugin/types/index';
import TerserPlugin from 'terser-webpack-plugin';
import {
  SubresourceIntegrityPlugin,
  SubresourceIntegrityPluginOptions,
} from 'webpack-subresource-integrity';

import { getCoreConfiguration, CoreConfigurationOptions } from './core';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ProductionConfiguration extends Configuration {}

export interface ProductionConfigurationOptions extends CoreConfigurationOptions {
  /** override options forwarded to image-minimizer-webpack-plugin */
  imageMinimizerOptions?: ImageMinimizerPluginOptions<unknown, unknown>;
  /** @notice this plugin now recommends to not overrride the default settings (do it at your own risks) */
  subResourceIntegrityOptions?: SubresourceIntegrityPluginOptions;
}

/**
 * Production config: optimised for general performances
 * You might still need to adjust it before launching your application in production
 * @see https://webpack.js.org/guides/production/
 */
export const getProductionConfiguration = ({
  imageMinimizerOptions = {
    minimizer: {
      implementation: ImageMinimizerPlugin.imageminMinify,
      options: {
        // Lossless optimization with custom option
        // Feel free to experiment with options for better result for you
        plugins: [
          ['gifsicle', { interlaced: true }],
          ['jpegtran', { progressive: true }],
          ['optipng', { optimizationLevel: 5 }],
          [
            'svgo',
            {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                      removeViewBox: {
                        active: false,
                      },
                    },
                  },
                },
              ],
            },
          ],
        ],
      },
    },
  },
  // as per recommendation: https://github.com/waysact/webpack-subresource-integrity/blob/main/MIGRATE-v1-to-v5.md#new-usage-suggested-defaults-recommended
  subResourceIntegrityOptions = undefined,
  ...options
}: ProductionConfigurationOptions): ProductionConfiguration =>
  merge(getCoreConfiguration(options), {
    mode: 'production',
    /**
     * Control over build process output
     * @see https://webpack.js.org/configuration/output/
     */
    output: {
      chunkFilename: '[chunkhash].chunk.js?v=[fullhash]',
      clean: true,
      crossOriginLoading: 'anonymous',
      filename: '[contenthash].js?v=[fullhash]',
      path: options.buildFolder,
      publicPath: '/',
    },
    plugins: [
      /**
       * Local images optimisation
       * @see https://webpack.js.org/plugins/image-minimizer-webpack-plugin/
       *
       * NOTE: as much as possible, avoid bundling assets together with the app:
       * Serve them efficiently from a CDN if available
       */
      new ImageMinimizerPlugin(imageMinimizerOptions),
      /**
       * Build-time compression: will help with servers and/or CDN not providing runtime compression (if any?)
       * @see https://webpack.js.org/plugins/compression-webpack-plugin/
       */
      new CompressionPlugin({
        algorithm: 'gzip',
        compressionOptions: {
          level: 9,
        },
        deleteOriginalAssets: false,
        filename: '[path][base].gz[query]',
        minRatio: 0.8,
        test: /\.(js|css|html|txt|xml|json|md|ico|jpe?g|png|gif|webp|svg|woff2?|webapp|webmanifest)$/,
        threshold: 1024,
      }),
      new CompressionPlugin({
        /** https://webpack.js.org/plugins/compression-webpack-plugin/#using-brotli */
        algorithm: 'brotliCompress',
        compressionOptions: {
          level: 11,
        },
        deleteOriginalAssets: false,
        filename: '[path][base].br[query]',
        minRatio: 0.8,
        test: /\.(js|css|html|txt|xml|json|md|ico|jpe?g|png|gif|webp|svg|woff2?|webapp|webmanifest)$/,
        threshold: 1024,
      }),
      /**
       * Add SRI attributes to compiled scripts
       * @see https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity
       * @see https://caniuse.com/subresource-integrity
       *
       * NOTE: since CSS-in-JS libraries injects styles using inline <style> tags, the benefits of this pattern are a bit limited
       */
      new SubresourceIntegrityPlugin(subResourceIntegrityOptions),
    ],
    /**
     * Webpack optimisation control
     * @see https://webpack.js.org/configuration/optimization/
     */
    optimization: {
      /** https://webpack.js.org/configuration/optimization/#optimizationconcatenatemodules */
      concatenateModules: true,
      /** https://webpack.js.org/configuration/optimization/#optimizationsideeffects */
      sideEffects: true,
      /** https://webpack.js.org/configuration/optimization/#optimizationminimize */
      minimize: true,
      /** https://webpack.js.org/configuration/optimization/#optimizationminimizer */
      minimizer: [
        new TerserPlugin({
          /** https://github.com/webpack-contrib/terser-webpack-plugin#extractcomments */
          extractComments: 'some',
          parallel: true,
          terserOptions: {
            /** https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions */
            compress: {
              /** Dead code elimination */
              dead_code: true,
              /** Remove console in production */
              drop_console: true,
            },
            output: {
              /** https://github.com/webpack-contrib/terser-webpack-plugin#preserve-comments */
              comments: /@license/i,
            },
          },
        }),
      ],
      /** https://webpack.js.org/configuration/optimization/#optimizationmoduleids */
      moduleIds: 'deterministic',
      /** https://github.com/waysact/webpack-subresource-integrity/tree/main/webpack-subresource-integrity#caching */
      realContentHash: true,
    },
    /**
     * Specific performance thresholds
     * @see https://webpack.js.org/guides/build-performance/
     *
     * You can adjust that to your needs, just be a responsible developer
     */
    performance: {
      maxEntrypointSize: 128000,
      maxAssetSize: 128000,
      hints: 'warning',
    },
    /**
     * Stats configuration
     * @see https://webpack.js.org/configuration/stats/
     */
    stats: 'errors-warnings',
  });
