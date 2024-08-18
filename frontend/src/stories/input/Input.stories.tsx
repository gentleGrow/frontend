import React from "react";
import { Input } from "@/shared/ui/input/Input";
import "@/shared/ui/input/style.css";

export default {
  title: "React Components/Input",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export const InputStory = {
  render: () => <Input placeholder="dd" />,
};
