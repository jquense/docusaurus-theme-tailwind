/* eslint-disable @typescript-eslint/no-use-before-define */
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState, useCallback, useEffect, useRef, memo } from "react";
import clsx from "clsx";
import { useThemeConfig, isSamePath } from "@docusaurus/theme-common";
import useUserPreferencesContext from "@theme/hooks/useUserPreferencesContext";
import useLockBodyScroll from "@theme/hooks/useLockBodyScroll";
import useWindowSize, { windowSizes } from "@theme/hooks/useWindowSize";
import useScrollPosition from "@theme/hooks/useScrollPosition";
import Link from "@docusaurus/Link";
import isInternalUrl from "@docusaurus/isInternalUrl";
import type { Props } from "@theme/DocSidebar";
import Logo from "@theme/Logo";
import IconArrow from "@theme/IconArrow";
import IconMenu from "@theme/IconMenu";
import { translate } from "@docusaurus/Translate";

import styles from "./styles.module.css";
import Menu from "../Menu";

const MOBILE_TOGGLE_SIZE = 24;

function usePrevious(value) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

const isActiveSidebarItem = (item, activePath) => {
  if (item.type === "link") {
    return isSamePath(item.href, activePath);
  }
  if (item.type === "category") {
    return item.items.some((subItem) =>
      isActiveSidebarItem(subItem, activePath)
    );
  }
  return false;
};

// Optimize sidebar at each "level"
// TODO this item should probably not receive the "activePath" props
// TODO this triggers whole sidebar re-renders on navigation
const DocSidebarItems = memo(function DocSidebarItems({
  items,
  ...props
}: any): JSX.Element {
  return items.map((item, index) => (
    <DocSidebarItem
      key={index} // sidebar is static, the index does not change
      item={item}
      {...props}
    />
  ));
});

function DocSidebarItem(props): JSX.Element {
  switch (props.item.type) {
    case "category":
      return <DocSidebarItemCategory {...props} />;
    case "link":
    default:
      return <DocSidebarItemLink {...props} />;
  }
}

function DocSidebarItemCategory({
  item,
  onItemClick,
  collapsible,
  activePath,
  ...props
}) {
  const { items, label } = item;

  const isActive = isActiveSidebarItem(item, activePath);
  const wasActive = usePrevious(isActive);

  // active categories are always initialized as expanded
  // the default (item.collapsed) is only used for non-active categories
  const [collapsed, setCollapsed] = useState(() => {
    if (!collapsible) {
      return false;
    }
    return isActive ? false : item.collapsed;
  });

  const menuListRef = useRef<HTMLUListElement>(null);
  const [menuListHeight, setMenuListHeight] = useState<string | undefined>(
    undefined
  );
  const handleMenuListHeight = (calc = true) => {
    setMenuListHeight(
      calc ? `${menuListRef.current?.scrollHeight}px` : undefined
    );
  };

  // If we navigate to a category, it should automatically expand itself
  useEffect(() => {
    const justBecameActive = isActive && !wasActive;
    if (justBecameActive && collapsed) {
      setCollapsed(false);
    }
  }, [isActive, wasActive, collapsed]);

  const handleItemClick = useCallback(
    (e) => {
      e.preventDefault();

      if (!menuListHeight) {
        handleMenuListHeight();
      }

      setTimeout(() => setCollapsed((state) => !state), 100);
    },
    [menuListHeight]
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <Menu.Item>
      <Menu.Link
        sublist={collapsible}
        collapsed={collapsed}
        active={collapsible && isActive}
        className={clsx(!collapsible && styles.menuLinkText)}
        onClick={collapsible ? handleItemClick : undefined}
        href={collapsible ? "#!" : undefined}
        {...props}
      >
        {label}
      </Menu.Link>
      <Menu
        ref={menuListRef}
        style={{
          height: !collapsed ? menuListHeight : 0,
        }}
        onTransitionEnd={() => {
          if (!collapsed) {
            handleMenuListHeight(false);
          }
        }}
      >
        <DocSidebarItems
          items={items}
          tabIndex={collapsed ? "-1" : "0"}
          onItemClick={onItemClick}
          collapsible={collapsible}
          activePath={activePath}
        />
      </Menu>
    </Menu.Item>
  );
}

function DocSidebarItemLink({
  item,
  onItemClick,
  activePath,
  collapsible: _collapsible,
  ...props
}) {
  const { href, label } = item;
  const isActive = isActiveSidebarItem(item, activePath);
  console.log("a", isActive);
  return (
    <Menu.Item className="menu__list-item" key={label}>
      <Menu.Link
        as={Link}
        active={isActive}
        className={clsx(!isInternalUrl(href) && styles.menuLinkExternal)}
        to={href}
        {...(isInternalUrl(href) && {
          isNavLink: true,
          exact: true,
          onClick: onItemClick,
        })}
        {...props}
      >
        {label}
      </Menu.Link>
    </Menu.Item>
  );
}

function useShowAnnouncementBar() {
  const { isAnnouncementBarClosed } = useUserPreferencesContext();
  const [showAnnouncementBar, setShowAnnouncementBar] = useState(
    !isAnnouncementBarClosed
  );
  useScrollPosition(({ scrollY }) => {
    if (!isAnnouncementBarClosed) {
      setShowAnnouncementBar(scrollY === 0);
    }
  });
  return showAnnouncementBar;
}

function useResponsiveSidebar() {
  const [showResponsiveSidebar, setShowResponsiveSidebar] = useState(false);
  useLockBodyScroll(showResponsiveSidebar);

  const windowSize = useWindowSize();
  useEffect(() => {
    if (windowSize === windowSizes.desktop) {
      setShowResponsiveSidebar(false);
    }
  }, [windowSize]);

  const closeResponsiveSidebar = useCallback(
    (e) => {
      e.target.blur();
      setShowResponsiveSidebar(false);
    },
    [setShowResponsiveSidebar]
  );

  const toggleResponsiveSidebar = useCallback(() => {
    setShowResponsiveSidebar((value) => !value);
  }, [setShowResponsiveSidebar]);

  return {
    showResponsiveSidebar,
    closeResponsiveSidebar,
    toggleResponsiveSidebar,
  };
}

function HideableSidebarButton({ onClick }) {
  return (
    <button
      type="button"
      title={translate({
        id: "theme.docs.sidebar.collapseButtonTitle",
        message: "Collapse sidebar",
        description: "The title attribute for collapse button of doc sidebar",
      })}
      aria-label={translate({
        id: "theme.docs.sidebar.collapseButtonAriaLabel",
        message: "Collapse sidebar",
        description: "The title attribute for collapse button of doc sidebar",
      })}
      className={clsx(
        "flex items-center h-10 justify-center border border-gray-300  hover:bg-gray-300 active:bg-gray-400 px-5 py-1 transition duration-300",
        "sticky bottom-0 lg:block hidden"
      )}
      onClick={onClick}
    >
      <IconArrow className="transform rotate-180 inline-block" />
    </button>
  );
}

function ResponsiveSidebarButton({ responsiveSidebarOpened, onClick }) {
  return (
    <button
      aria-label={
        responsiveSidebarOpened
          ? translate({
              id: "theme.docs.sidebar.responsiveCloseButtonLabel",
              message: "Close menu",
              description:
                "The ARIA label for close button of mobile doc sidebar",
            })
          : translate({
              id: "theme.docs.sidebar.responsiveOpenButtonLabel",
              message: "Open menu",
              description:
                "The ARIA label for open button of mobile doc sidebar",
            })
      }
      aria-haspopup="true"
      className={clsx(
        "lg:hidden fixed right-4 bottom-8 z-30",
        "inline-flex items-center bg-gray-200 hover:bg-gray-300 active:bg-gray-400 px-5 py-1 rounded transition duration-300"
      )}
      type="button"
      onClick={onClick}
    >
      {responsiveSidebarOpened ? (
        <span
          className={clsx(
            "inline-flex items-center justify-center",
            "h-6 w-6 text-2xl leading-tight"
          )}
        >
          &times;
        </span>
      ) : (
        <IconMenu
          className={"align-middle"}
          height={MOBILE_TOGGLE_SIZE}
          width={MOBILE_TOGGLE_SIZE}
        />
      )}
    </button>
  );
}

function DocSidebar({
  path,
  sidebar,
  sidebarCollapsible = true,
  onCollapse,
  isHidden,
}: Props): JSX.Element | null {
  const showAnnouncementBar = useShowAnnouncementBar();
  const {
    navbar: { hideOnScroll },
    hideableSidebar,
  } = useThemeConfig();
  const { isAnnouncementBarClosed } = useUserPreferencesContext();

  const {
    showResponsiveSidebar,
    closeResponsiveSidebar,
    toggleResponsiveSidebar,
  } = useResponsiveSidebar();

  return (
    <div
      className={clsx(
        "lg:w-80 lg:flex lg:flex-col lg:max-h-screen sticky top-0 transition-visibility duration-75",
        !hideOnScroll && "pt-16",
        isHidden ? "overflow-hidden invisible opacity-0 h-0" : "lg:h-full"
      )}
    >
      {hideOnScroll && (
        <Logo tabIndex={-1} className="flex items-center mx-4 h-16" />
      )}
      <div
        className={clsx(
          "thin-scrollbar overflow-y-auto",
          "flex-grow p-2",
          showResponsiveSidebar &&
            "inset-0 fixed p-4 z-40 overscroll-contain bg-surface",
          {
            [styles.menuWithAnnouncementBar]:
              !isAnnouncementBarClosed && showAnnouncementBar,
          }
        )}
      >
        <ResponsiveSidebarButton
          responsiveSidebarOpened={showResponsiveSidebar}
          onClick={toggleResponsiveSidebar}
        />
        <Menu className={clsx(!showResponsiveSidebar && "hidden lg:block")}>
          <DocSidebarItems
            items={sidebar}
            onItemClick={closeResponsiveSidebar}
            collapsible={sidebarCollapsible}
            activePath={path}
          />
        </Menu>
      </div>
      {hideableSidebar && <HideableSidebarButton onClick={onCollapse} />}
    </div>
  );
}

export default DocSidebar;
