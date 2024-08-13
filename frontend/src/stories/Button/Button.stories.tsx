import React from 'react';
import { Button } from '@/app/shared/ui/button/Button';
import { colors } from '@/app/shared/ui/themes/variables/colors/scale';
import { useButton } from '@/app/shared/ui/button/hooks/useButton';
import { Text } from '@/app/shared/ui/layout/src';

export default {
  title: "React Components/Button",
  component: Button,
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
      options: Object.keys(colors),
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