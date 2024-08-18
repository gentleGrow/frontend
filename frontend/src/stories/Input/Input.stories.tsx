import React from "react";
import { Input, InputGroup, InputLeftAddon } from "@/shared/ui/input";
import "@/shared/ui/input/style.css";

export default {
  title: "React Components/Input",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export const InputStory = {
  render: () => <Input placeholder="gaemi" />,
};

export const InputGroupStory = {
  render: () => (
    <InputGroup size="lg" color="green">
      <InputLeftAddon>$</InputLeftAddon>
      <Input placeholder="gaemi" />
    </InputGroup>
  ),
};
