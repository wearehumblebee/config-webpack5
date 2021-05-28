import {
  DevelopmentConfiguration as webpack5_DevelopmentFrontendConfiguration,
  ProductionConfiguration as webpack5_ProductionFrontendConfiguration,
  getWebpackConfiguration as getWebpack5FrontendConfiguration,
} from './configurations/frontend';

export type { webpack5_DevelopmentFrontendConfiguration, webpack5_ProductionFrontendConfiguration };

export {
  // webpack
  getWebpack5FrontendConfiguration,
};
