import * as React from "react";
import { forwardRef, Ref } from "react";
import { textStyle } from "./style.css";
import { HeadingProps } from "./types";
import { clsx } from "clsx";
import { extractSprinkleProps } from "../utils/properties";
import { BaseStyle, StyleSprinkles } from "../../style.css";
import { Color, colors } from "../../../themes/variables/colors/scale";

const Heading = (props: HeadingProps, ref: Ref<HTMLElement>) => {
  const { as = "h1", fontSize, background, color = "gray", children } = props;
  const backgroundColor = colors[color as Color]?.[70];
  const colorStyle = colors[color as Color]?.[10];
  return React.createElement(
    as,
    {
      ...props,
      ref,
      className: clsx([
        BaseStyle,
        StyleSprinkles(
          extractSprinkleProps(props, Array.from(StyleSprinkles.properties)),
        ),
        textStyle({
          fontSize,
        }),
        props.className,
      ]),
      style: {
        color: colorStyle,
        background:backgroundColor,
        ...props.style,
      },
    },
    children,
  );
};

const _Heading = forwardRef(Heading);
export { _Heading as Heading };
