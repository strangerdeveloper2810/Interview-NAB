import type { Preview } from "@storybook/react";
import "./preview.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#f8fafc" },
        { name: "dark", value: "#0f172a" },
        { name: "white", value: "#ffffff" },
      ],
    },
  },
};

export default preview;
