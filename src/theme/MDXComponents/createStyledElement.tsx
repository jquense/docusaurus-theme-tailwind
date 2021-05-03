import clsx from "clsx";
import React from "react";

type ElementType<
  E extends keyof JSX.IntrinsicElements
> = JSX.IntrinsicElements[E] extends React.DetailedHTMLProps<
  React.HTMLAttributes<infer T>,
  infer T
>
  ? T
  : never;

function createStyledElement<
  E extends keyof JSX.IntrinsicElements,
  R = ElementType<E>
>(tag: E, className: string) {
  const Component = React.forwardRef<R>(
    (props: React.ComponentProps<E>, ref) => {
      const Tag: any = tag;
      return (
        <Tag
          {...props}
          ref={ref}
          className={clsx(props.className, className)}
        />
      );
    }
  );
  Component.displayName = tag.toUpperCase();
  return Component;
}

export default createStyledElement;
