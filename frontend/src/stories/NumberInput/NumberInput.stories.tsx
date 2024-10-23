import { Meta, StoryObj } from "@storybook/react";
import NumberInput from "@/shared/ui/NumberInput";
import { useState } from "react";

const meta: Meta = {
  title: "React Components/NumberInput",
  component: NumberInput,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
    },
  },
};
export default meta;

type Story = StoryObj<typeof NumberInput>;

export const NumberInputStory: Story = {
  render: () => {
    const [value, setValue] = useState<number>();
    return <NumberInput value={value} onChange={setValue} />;
  },
};

export const AmountInputStory: Story = {
  render: () => {
    const [value, setValue] = useState<number>();
    return <NumberInput value={value} onChange={setValue} type="amount" />;
  },
};

export const PriceInputStory: Story = {
  render: () => {
    const [value, setValue] = useState<number>();
    const [usValue, setUsValue] = useState<number>();

    return (
      <div className="flex flex-col gap-4">
        <div className={"flex flex-col gap-3"}>
          <h2>원화</h2>
          <NumberInput
            region={"KRW"}
            value={value}
            placeholder={"₩ 0"}
            onChange={setValue}
            type="price"
          />
        </div>
        <div className={"flex flex-col gap-3"}>
          <h2>달러</h2>
          <NumberInput
            region={"USD"}
            placeholder={"$ 0"}
            value={usValue}
            onChange={setUsValue}
            type="price"
          />
        </div>
      </div>
    );
  },
};

export const AutoFillRatioInputStory: Story = {
  render: () => {
    const [value, setValue] = useState<number | undefined>(10);

    const variants =
      Number(value) > 0
        ? "increase"
        : Number(value) < 0
          ? "decrease"
          : "default";

    return (
      <NumberInput
        value={value}
        onChange={setValue}
        type="ratio"
        autoFill={true}
        placeholder={"자동 계산 필드입니다."}
        variants={variants}
      />
    );
  },
};

export const AutoFillPriceInputStory: Story = {
  render: () => {
    const [value, setValue] = useState<number | undefined>(1000);
    return (
      <NumberInput
        value={value}
        onChange={setValue}
        type="price"
        autoFill={true}
        placeholder={"자동 계산 필드입니다."}
        variants={"default"}
      />
    );
  },
};

export const AutoFillNoCreditInputStory: Story = {
  render: () => {
    const [value, setValue] = useState<number | undefined>(undefined);
    return (
      <NumberInput
        value={value}
        onChange={setValue}
        type="amount"
        autoFill={true}
        placeholder={"배당금이 없는 종목이에요."}
      />
    );
  },
};
