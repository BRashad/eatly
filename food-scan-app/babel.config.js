module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
          root: ["."],
          alias: {
            "@app": "./app",
            "@components": "./components",
            "@constants": "./constants",
            "@hooks": "./hooks",
            "@navigation": "./navigation",
            "@screens": "./screens",
            "@services": "./services",
            "@store": "./store",
            "@app-types": "./types",
            "@utils": "./utils",
          },
        },
      ],
    ],
  };
};
