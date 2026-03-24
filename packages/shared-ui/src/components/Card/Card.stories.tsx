import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardHeader, CardContent } from "./index";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outlined"],
    },
    padding: {
      control: "select",
      options: ["none", "sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <h3>Card Title</h3>
      </CardHeader>
      <CardContent>
        <p>This is the card content. It can contain any React components.</p>
      </CardContent>
    </Card>
  ),
};

export const Outlined: Story = {
  render: () => (
    <Card variant="outlined">
      <CardHeader>
        <h3>Outlined Card</h3>
      </CardHeader>
      <CardContent>
        <p>This card has a subtle border instead of a shadow.</p>
      </CardContent>
    </Card>
  ),
};

export const WithDifferentPadding: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
      <Card padding="sm" style={{ width: 200 }}>
        <CardContent>Small padding</CardContent>
      </Card>
      <Card padding="md" style={{ width: 200 }}>
        <CardContent>Medium padding</CardContent>
      </Card>
      <Card padding="lg" style={{ width: 200 }}>
        <CardContent>Large padding</CardContent>
      </Card>
    </div>
  ),
};
