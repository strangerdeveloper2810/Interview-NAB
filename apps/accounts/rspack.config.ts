import { defineConfig } from "@rspack/cli";
import rspack from "@rspack/core";
import { ModuleFederationPlugin } from "@module-federation/enhanced/rspack";

export default defineConfig({
  entry: "./src/index.tsx",
  output: {
    publicPath: "auto",
    uniqueName: "accounts",
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
      name: "accounts",
      exposes: {
        "./AccountsPage": "./src/pages/Accounts/Accounts.tsx",
        "./AccountDetailPage": "./src/pages/AccountDetail/AccountDetail.tsx",
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
    port: 3002,
    historyApiFallback: true,
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
});
