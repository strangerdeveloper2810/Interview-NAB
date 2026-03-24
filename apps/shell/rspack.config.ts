import { defineConfig } from "@rspack/cli";
import rspack from "@rspack/core";
import { ModuleFederationPlugin } from "@module-federation/enhanced/rspack";

export default defineConfig({
  entry: "./src/index.tsx",
  output: {
    publicPath: "auto",
    uniqueName: "shell",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.(tsx?|jsx?)$/,
        use: {
          loader: "builtin:swc-loader",
          options: {
            jsc: {
              parser: {
                syntax: "typescript",
                tsx: true,
              },
              transform: {
                react: {
                  runtime: "automatic",
                },
              },
            },
          },
        },
      },
      {
        test: /\.module\.scss$/,
        use: ["sass-loader"],
        type: "css/module",
      },
      {
        test: /\.scss$/,
        exclude: /\.module\.scss$/,
        use: ["sass-loader"],
        type: "css",
      },
    ],
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: "./index.html",
    }),
    new ModuleFederationPlugin({
      name: "shell",
      remotes: {},
      shared: {
        react: {
          singleton: true,
          eager: true,
        },
        "react-dom": {
          singleton: true,
          eager: true,
        },
        "react-router": {
          singleton: true,
        },
        zustand: {
          singleton: true,
        },
      },
    }),
  ],
  devServer: {
    port: 3000,
    historyApiFallback: true,
    hot: true,
  },
});
