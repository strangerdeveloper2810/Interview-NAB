import { defineConfig } from "@rspack/cli";
import rspack from "@rspack/core";
import { ModuleFederationPlugin } from "@module-federation/enhanced/rspack";

export default defineConfig({
  entry: "./src/index.tsx",
  output: {
    publicPath: "/",
    uniqueName: "shell",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  module: {
    parser: {
      "css/module": {
        namedExports: false,
      },
    },
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
      remotes: {
        dashboard: "dashboard@http://localhost:3001/mf-manifest.json",
        accounts: "accounts@http://localhost:3002/mf-manifest.json",
        transfer: "transfer@http://localhost:3003/mf-manifest.json",
        admin: "admin@http://localhost:3004/mf-manifest.json",
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: "^18.2.0",
        },
        "react-dom": {
          singleton: true,
          requiredVersion: "^18.2.0",
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
  experiments: {
    css: true,
  },
  devServer: {
    port: 3000,
    historyApiFallback: true,
    hot: true,
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:4000',
      },
    ],
  },
});
