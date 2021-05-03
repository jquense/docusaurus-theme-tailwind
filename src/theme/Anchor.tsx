import clsx from "clsx";
import React from "react";

const Anchor = React.forwardRef<HTMLAnchorElement>(
  (props: React.ComponentProps<"a">, ref) => {
    return (
      <a
        ref={ref}
        {...props}
        className={clsx(props.className, "text-primary hover:underline")}
      />
    );
  }
);

export default Anchor;
