import { Meta, StoryObj } from "@storybook/react";

import { DatePicker } from "@/shared";
import { useState } from "react";

const meta: Meta = {
  title: "React Components/DatePicker",
  render: () => {
    const [date, setDate] = useState<Date | null>(null);

    return <DatePicker date={date} onChange={setDate} />;
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof DatePicker>;

export const DatePickerStory: Story = {
  render: () => {
    const [date, setDate] = useState<Date | null>(null);

    return <DatePicker date={date} onChange={setDate} />;
  },
};
