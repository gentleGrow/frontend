import React from 'react';
import "@gaemi-school/react-components-button/style.css";
import { Button as _Button } from "@gaemi-school/react-components-button";
import { vars } from "@gaemi-school/themes";
import "@gaemi-school/react-components-layout/style.css";
import { Text } from "@gaemi-school/react-components-layout";
import { useButton } from "@gaemi-school/react-hooks-button";

export default {
  title: "React Components/Button",
  component: _Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      options: ["xs", "sm", "md", "lg"],
      control: "select",
    },
    color: {
      options: Object.keys(vars.colors.$scale),
      control: "select",
    },
    variant: {
      options: ["solid", "outline", "ghost"],
      control: "select",
    },
  },
};

export const ButtonStory = {
  args: {
    size: "lg",
    children: "Button",
    variant: "outline",
    isDisabled: false,
    isLoading: false,
    leftIcon: "😀",
  },
};

export const TextButtonStory = {
  render: () => {
    const {
      buttonProps,
    } = useButton({
      elementType: "div",
      onClick: () => {
        console.log("ttt");
      },
    }); 

    return (
      <Text
        {...buttonProps}
        as="div"
        fontSize="md"
        color="green"
        style={{
          userSelect: "none",
          cursor: "pointer",
        }}
      >
        텍스트 버튼입니다.
      </Text>
    );
  }
};