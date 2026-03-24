import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./index";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "success", "warning", "error", "info"],
    },
    size: {
      control: "select",
      options: ["sm", "md"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: "Default",
  },
};

export const Success: Story = {
  args: {
    children: "Thành công",
    variant: "success",
  },
};

export const Warning: Story = {
  args: {
    children: "Đang xử lý",
    variant: "warning",
  },
};

export const Error: Story = {
  args: {
    children: "Thất bại",
    variant: "error",
  },
};

export const Info: Story = {
  args: {
    children: "Thông tin",
    variant: "info",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
      <Badge variant="default">Default</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
      <Badge size="sm" variant="success">Small</Badge>
      <Badge size="md" variant="success">Medium</Badge>
    </div>
  ),
};
