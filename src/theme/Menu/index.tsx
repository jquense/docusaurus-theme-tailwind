import clsx from "clsx";
import React from "react";

import styles from "./styles.module.css";

type MenuProps = React.ComponentProps<"ul">;

const Menu = React.forwardRef<HTMLUListElement, MenuProps>((props, ref) => {
  return (
    <ul
      {...props}
      ref={ref}
      className={clsx(
        props.className,
        styles.menu,
        "font-medium overflow-hidden"
      )}
      style={{
        transition: "height 150ms linear",
        ...props.style,
      }}
    />
  );
});

function MenuItem(props: React.ComponentProps<"li">) {
  return <li {...props} className={clsx("my-1", props.className)} />;
}

interface MenuLinkProps extends React.ComponentProps<"a"> {
  active?: boolean;
  sublist?: boolean;
  collapsed?: boolean;
  as?: React.ElementType;
  [props: string]: any;
}

function MenuLink({
  as: Tag = "a",
  sublist,
  collapsed,
  active,
  ...props
}: MenuLinkProps) {
  return (
    <Tag
      {...props}
      className={clsx(
        props.className,
        active ? "text-primary bg-overlay" : "text-gray-600",
        "flex justify-between",
        "hover:bg-overlay hover:no-underline rounded transition",
        styles.menuItem,
        sublist && styles.menuItemSublist,
        collapsed && styles.collapsed
      )}
    />
  );
}

export default Object.assign(Menu, {
  Item: MenuItem,
  Link: MenuLink,
});
