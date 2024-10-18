import React from "react";
import { CheckBox } from "@/shared";

export default {
  title: "React Components/CheckBox",
  component: CheckBox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export const CheckBoxStory = {
  render: () => {
    const [isChecked, setIsChecked] = React.useState(false);

    return (
      <CheckBox checked={isChecked} onChange={() => setIsChecked(!isChecked)} />
    );
  },
};

export const DisabledCheckBox = {
  render: () => {
    return <CheckBox checked={true} readOnly disabled={true} />;
  },
};
