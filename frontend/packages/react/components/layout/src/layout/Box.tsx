import * as React from "react";
import { BoxProps } from "./types";
import { clsx } from 'clsx';
import { StyleSprinkles } from "../core/style.css";
import { extractSprinkleProps } from "../utils/properties";
import { vars } from "@gaemi-school/themes";
 
const Box = (props: BoxProps, ref: React.Ref<HTMLElement>) => {
  const { as = "div", color, background, children } = props;

  return React.createElement(
    as,
    {
      ...props,
      ref,
      className: clsx([
        StyleSprinkles(extractSprinkleProps(props, Array.from(StyleSprinkles.properties))),
        props.className,
      ]),
      style: {
        color: vars.colors.$scale?.[color]?.[70] ?? color,
        background: vars.colors.$scale?.[background]?.[10] ?? background,
        ...props.style,
      },
    },
    children,
  );
}

const _Box = React.forwardRef(Box);
export { _Box as Box };