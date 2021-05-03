// const path = require("path");

module.exports = () => {
  return {
    name: "webpack-plugin",
    configureWebpack() {
      return {
        resolve: {
          symlinks: false,
          alias: {
            react$: require.resolve("react"),
            "react/jsx-runtime": require.resolve("react/jsx-runtime"),
            "react-dom$": require.resolve("react-dom"),
            "react-dom/server": require.resolve("react-dom/server"),
          },
        },
      };
    },
  };
};
