import type { Meta, StoryObj } from "@storybook/react";
import AppButton from "./AppButton";

const meta: Meta<typeof AppButton> = {
    title: "UI/AppButton",
    component: AppButton,
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
    },
    argTypes: {
        variant: {
            control: "select",
            options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
        },
        size: {
            control: "select",
            options: ["default", "sm", "lg", "icon"],
        },
        label: { control: "text" },
    },
};

export default meta;
type Story = StoryObj<typeof AppButton>;

// Primary button
export const Primary: Story = {
    args: {
        label: "Primary Button",
        variant: "default",
    },
};

// Secondary button
export const Secondary: Story = {
    args: {
        label: "Secondary Button",
        variant: "secondary",
    },
};

// Outline button
export const Outline: Story = {
    args: {
        label: "Outline Button",
        variant: "outline",
    },
};

// Ghost button
export const Ghost: Story = {
    args: {
        label: "Ghost Button",
        variant: "ghost",
    },
};
