module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
          root: ["./food-scan-app"],
          alias: {
            "@app": "./food-scan-app/app",
            "@components": "./food-scan-app/components",
            "@constants": "./food-scan-app/constants",
            "@hooks": "./food-scan-app/hooks",
            "@navigation": "./food-scan-app/navigation",
            "@screens": "./food-scan-app/screens",
            "@services": "./food-scan-app/services",
            "@store": "./food-scan-app/store",
            "@app-types": "./food-scan-app/types",
            "@utils": "./food-scan-app/utils",
          },
        },
      ],
    ],
  };
};
