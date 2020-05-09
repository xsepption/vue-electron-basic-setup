const path = require("path");

module.exports = {
  chainWebpack: config => {
    config
      .entry("app")
      .clear()
      .add(path.join(__dirname, "./src/renderer/main.js"))
      .end();

    config.resolve.alias
      .set("@", path.join(__dirname, "./src/renderer"))
  },
  outputDir: path.resolve(__dirname, "./dist/web"),
  publicPath: "./"
}