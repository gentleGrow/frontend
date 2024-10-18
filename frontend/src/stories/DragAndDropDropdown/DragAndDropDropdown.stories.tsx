"use client";

import { Meta, StoryObj } from "@storybook/react";

import { DragAndDropDropdown } from "@/shared";
import { useState } from "react";

const meta: Meta = {
  title: "React Components/DragAndDropDropdown",
  render: () => {
    const [allItems, setAllItems] = useState([
      {
        isRequired: true,
        isChecked: true,
        name: "Item 1",
      },
      {
        isRequired: true,
        isChecked: true,
        name: "Item 2",
      },
      {
        isRequired: false,
        isChecked: true,
        name: "Item 3",
      },
      {
        isRequired: false,
        isChecked: false,
        name: "Item 4",
      },
      {
        isRequired: false,
        isChecked: true,
        name: "Item 5",
      },
    ]);

    const handleCheckboxClicked = (name: string) => {
      const newFields = allItems.map((field) => {
        if (field.name === name) {
          return { ...field, isChecked: !field.isChecked };
        }
        return field;
      });
      setAllItems(newFields);
    };

    return (
      <DragAndDropDropdown
        items={allItems}
        onReorder={setAllItems}
        onCheckboxClicked={handleCheckboxClicked}
      />
    );
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof DragAndDropDropdown>;

export const DatePickerStory: Story = {
  render: () => {
    const [allItems, setAllItems] = useState([
      {
        isRequired: true,
        isChecked: true,
        name: "Item 1",
      },
      {
        isRequired: true,
        isChecked: true,
        name: "Item 2",
      },
      {
        isRequired: false,
        isChecked: true,
        name: "Item 3",
      },
      {
        isRequired: false,
        isChecked: false,
        name: "Item 4",
      },
      {
        isRequired: false,
        isChecked: true,
        name: "Item 5",
      },
    ]);

    const handleCheckboxClicked = (name: string) => {
      const newFields = allItems.map((field) => {
        if (field.name === name) {
          return { ...field, isChecked: !field.isChecked };
        }
        return field;
      });
      setAllItems(newFields);
    };
    return (
      <DragAndDropDropdown
        items={allItems}
        onReorder={setAllItems}
        onCheckboxClicked={handleCheckboxClicked}
      />
    );
  },
};
