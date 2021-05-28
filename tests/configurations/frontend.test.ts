import path from 'path';
import { Configuration } from 'webpack';

import { getWebpack5FrontendConfiguration } from 'src';

describe('configurations > frontend', () => {
  it('provides a default development configuration', () => {
    const configuration = getWebpack5FrontendConfiguration('development');

    expect(configuration).toHaveProperty('mode', 'development');
    expect(configuration).toHaveProperty('devServer');
  });

  it('provides a default production configuration', () => {
    const configuration = getWebpack5FrontendConfiguration('production', {
      dotenvPluginOptions: {
        path: path.resolve(__dirname, '.env.test'),
      },
    });

    expect(configuration).toHaveProperty('mode', 'production');
    // Quite arbitrary indeed
    expect(configuration).toHaveProperty('performance');
  });

  it('can be extended', () => {
    const entry: Configuration['entry'] = 'whatever.js';
    const output: Configuration['output'] = {
      chunkFilename: '[chunkhash].js',
      clean: true,
      crossOriginLoading: 'use-credentials',
      filename: '[contenthash].js?v=[fullhash]',
      path: './dist',
      publicPath: '/',
    };
    const optimization: Configuration['optimization'] = {
      emitOnErrors: false,
      moduleIds: 'size',
      splitChunks: {
        // You will probably need to adjust this strategy to your needs
        chunks: 'all',
        cacheGroups: {
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            chunks: 'all'
          },
        }
      }
    };
    const performance: Configuration['performance'] = {
      maxEntrypointSize: 56000,
      maxAssetSize: 56000,
      hints: 'error',
    };

    const configuration = getWebpack5FrontendConfiguration(
      'production',
      {
        buildFolder: 'tmp',
        publicFolder: 'public',
        htmlTemplate: 'index.html',
        dotenvPluginOptions: {
          path: path.resolve(__dirname, '.env.test'),
        },
      },
      {
        entry,
        output,
        optimization,
        performance
      },
    );

    expect(configuration).toMatchObject({
      entry,
      output,
      optimization,
      performance
    });
  });
});
