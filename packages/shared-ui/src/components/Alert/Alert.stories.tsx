import type { Meta, StoryObj } from "@storybook/react";
import { Alert } from "./index";

const meta: Meta<typeof Alert> = {
  title: "Components/Alert",
  component: Alert,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "success", "warning", "error"],
    },
    title: {
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Info: Story = {
  args: {
    variant: "info",
    title: "Thông tin",
    children: "Đây là thông báo với thông tin hữu ích cho người dùng.",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    title: "Thành công!",
    children: "Giao dịch của bạn đã được thực hiện thành công.",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    title: "Cảnh báo",
    children: "Số dư tài khoản của bạn sắp hết. Vui lòng nạp thêm tiền.",
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    title: "Lỗi!",
    children: "Không thể thực hiện giao dịch. Vui lòng thử lại sau.",
  },
};

export const WithCloseButton: Story = {
  args: {
    variant: "info",
    title: "Có thể đóng",
    children: "Click vào nút X để đóng thông báo này.",
    onClose: () => alert("Alert closed!"),
  },
};

export const WithoutTitle: Story = {
  args: {
    variant: "success",
    children: "Đây là alert không có title, chỉ có nội dung.",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Alert variant="info" title="Info Alert">
        This is an informational message.
      </Alert>
      <Alert variant="success" title="Success Alert">
        Your action was successful!
      </Alert>
      <Alert variant="warning" title="Warning Alert">
        Please be careful with this action.
      </Alert>
      <Alert variant="error" title="Error Alert">
        Something went wrong. Please try again.
      </Alert>
    </div>
  ),
};
