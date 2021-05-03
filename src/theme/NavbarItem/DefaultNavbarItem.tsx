/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
// @ts-ignore
import { useLocation } from "@docusaurus/router";
import { isSamePath } from "@docusaurus/theme-common";
import type {
  NavLinkProps,
  DesktopOrMobileNavBarItemProps,
  Props,
} from "@theme/NavbarItem/DefaultNavbarItem";
import Menu from "../Menu";
import styles from "./styles.module.css";

function NavLink({
  activeBasePath,
  activeBaseRegex,
  to,
  href,
  label,
  activeClassName = "!text-primary",
  prependBaseUrlToHref,
  ...props
}: NavLinkProps) {
  // TODO all this seems hacky
  // {to: 'version'} should probably be forbidden, in favor of {to: '/version'}
  const toUrl = useBaseUrl(to);
  const activeBaseUrl = useBaseUrl(activeBasePath);
  const normalizedHref = useBaseUrl(href, { forcePrependBaseUrl: true });

  return (
    <Link
      {...(href
        ? {
            href: prependBaseUrlToHref ? normalizedHref : href,
          }
        : {
            isNavLink: true,
            activeClassName,
            to: toUrl,
            ...(activeBasePath || activeBaseRegex
              ? {
                  isActive: (_match, location) =>
                    activeBaseRegex
                      ? new RegExp(activeBaseRegex).test(location.pathname)
                      : location.pathname.startsWith(activeBaseUrl),
                }
              : null),
          })}
      {...props}
    >
      {label}
    </Link>
  );
}

function NavItemDesktop({
  items,
  position,
  className,
  ...props
}: DesktopOrMobileNavBarItemProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownMenuRef = useRef<HTMLUListElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!dropdownRef.current || dropdownRef.current.contains(event.target)) {
        return;
      }

      setShowDropdown(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [dropdownRef]);

  const navItemClassNames = "hidden lg:inline-block";
  const navLinkClassNames = (extraClassName?: string, isDropdownItem = false) =>
    clsx(
      "text-inherit hover:no-underline",
      !isDropdownItem
        ? `${navItemClassNames} font-medium relative py-1 px-4 hover:text-primary transition-colors duration-200`
        : "rounded text-sm block px-2 py-1 nowrap hover:bg-overlay transition",

      extraClassName
    );

  if (!items) {
    return <NavLink className={navLinkClassNames(className)} {...props} />;
  }

  return (
    <div
      ref={dropdownRef}
      className={clsx(navItemClassNames, "relative align-top group")}
    >
      <NavLink
        className={clsx(navLinkClassNames(className), styles.dropdownToggle)}
        {...props}
        onClick={props.to ? undefined : (e) => e.preventDefault()}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            setShowDropdown(!showDropdown);
          }
        }}
      >
        {props.children ?? props.label}
      </NavLink>
      <ul
        ref={dropdownMenuRef}
        style={{
          transitionTimingFunction: "cubic-bezier(0.24, 0.22, 0.015, 1.56)",
        }}
        className={clsx(
          "bg-surface min-w-40 p-2 rounded-lg transform scale-90 transition absolute top-full shadow-lg",
          "group-hover:scale-100 group-hover:opacity-100 group-hover:visible",
          showDropdown ? "scale-100" : "opacity-0 invisible",
          position === "left" && "left-0",
          position === "right" && "right-0"
        )}
      >
        {items.map(
          ({ className: childItemClassName, ...childItemProps }, i) => (
            <li key={i}>
              <NavLink
                onKeyDown={(e) => {
                  if (i === items.length - 1 && e.key === "Tab") {
                    e.preventDefault();

                    setShowDropdown(false);

                    const nextNavbarItem = (dropdownRef.current as HTMLElement)
                      .nextElementSibling;

                    if (nextNavbarItem) {
                      (nextNavbarItem as HTMLElement).focus();
                    }
                  }
                }}
                activeClassName="!text-primary bg-overlay"
                className={navLinkClassNames(childItemClassName, true)}
                {...childItemProps}
              />
            </li>
          )
        )}
      </ul>
    </div>
  );
}

function NavItemMobile({
  items,
  className,
  position: _position, // Need to destructure position from props so that it doesn't get passed on.
  ...props
}: DesktopOrMobileNavBarItemProps) {
  const menuListRef = useRef<HTMLUListElement>(null);
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(
    () => !items?.some((item) => isSamePath(item.to, pathname)) ?? true
  );

  // const navLinkClassNames = (extraClassName?: string, isSubList = false) =>
  //   clsx(
  //     "text-gray-600 flex justify-between",
  //     "hover:bg-overlay hover:no-underline rounded transition",
  //     styles.menuItem,
  //     isSubList && styles.menuItemSublist,
  //     collapsed && styles.collapsed,
  //     extraClassName
  //   );

  if (!items) {
    return (
      <Menu.Item>
        <Menu.Link
          as={NavLink}
          collapsed={collapsed}
          className={className}
          {...props}
        />
      </Menu.Item>
    );
  }

  const menuListHeight = menuListRef.current?.scrollHeight
    ? `${menuListRef.current?.scrollHeight}px`
    : undefined;

  return (
    <Menu.Item>
      <Menu.Link
        as={NavLink}
        role="button"
        sublist
        collapsed={collapsed}
        className={className}
        {...props}
        onClick={(e) => {
          e.preventDefault();
          setCollapsed((state) => !state);
        }}
      >
        {props.children ?? props.label}
      </Menu.Link>
      <Menu
        ref={menuListRef}
        style={{
          transition: "height 150ms linear",
          height: !collapsed ? menuListHeight : 0,
        }}
      >
        {items.map(
          ({ className: childItemClassName, ...childItemProps }, i) => (
            <Menu.Item key={i}>
              <Menu.Link
                as={NavLink}
                activeClassName="!text-primary bg-overlay"
                collapsed={collapsed}
                className={childItemClassName}
                {...childItemProps}
                onClick={props.onClick}
              />
            </Menu.Item>
          )
        )}
      </Menu>
    </Menu.Item>
  );
}

function DefaultNavbarItem({ mobile = false, ...props }: Props): JSX.Element {
  const Comp = mobile ? NavItemMobile : NavItemDesktop;
  return <Comp {...props} />;
}

export default DefaultNavbarItem;
