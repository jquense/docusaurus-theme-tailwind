/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useCallback, useState, useEffect } from "react";
import clsx from "clsx";

import SearchBar from "@theme/SearchBar";
import Toggle from "@theme/Toggle";
import useThemeContext from "@theme/hooks/useThemeContext";
import { useThemeConfig } from "@docusaurus/theme-common";
import useHideableNavbar from "@theme/hooks/useHideableNavbar";
import useLockBodyScroll from "@theme/hooks/useLockBodyScroll";
import useWindowSize, { windowSizes } from "@theme/hooks/useWindowSize";
import NavbarItem from "@theme/NavbarItem";
import Logo from "@theme/Logo";
import IconMenu from "@theme/IconMenu";

import Menu from "../Menu";

// retrocompatible with v1
const DefaultNavItemPosition = "right";

// If split links by left/right
// if position is unspecified, fallback to right (as v1)
function splitNavItemsByPosition(items) {
  const leftItems = items.filter(
    (item) => (item.position ?? DefaultNavItemPosition) === "left"
  );
  const rightItems = items.filter(
    (item) => (item.position ?? DefaultNavItemPosition) === "right"
  );
  return {
    leftItems,
    rightItems,
  };
}

function Navbar(): JSX.Element {
  const {
    navbar: { items, hideOnScroll },
    colorMode: { disableSwitch: disableColorModeSwitch },
  } = useThemeConfig();
  const [sidebarShown, setSidebarShown] = useState(false);
  const { isDarkTheme, setLightTheme, setDarkTheme } = useThemeContext();
  const { navbarRef, isNavbarVisible } = useHideableNavbar(hideOnScroll);

  useLockBodyScroll(sidebarShown);

  const showSidebar = useCallback(() => {
    setSidebarShown(true);
  }, [setSidebarShown]);
  const hideSidebar = useCallback(() => {
    setSidebarShown(false);
  }, [setSidebarShown]);

  const onToggleChange = useCallback(
    (e) => (e.target.checked ? setDarkTheme() : setLightTheme()),
    [setLightTheme, setDarkTheme]
  );

  const windowSize = useWindowSize();

  useEffect(() => {
    if (windowSize === windowSizes.desktop) {
      setSidebarShown(false);
    }
  }, [windowSize]);

  const hasSearchNavbarItem = items.some((item) => item.type === "search");
  const { leftItems, rightItems } = splitNavItemsByPosition(items);

  return (
    <nav
      ref={navbarRef}
      className={clsx(
        "sticky top-0 flex shadow-md z-30 h-16 w-full px-4 py-2 bg-surface",
        hideOnScroll && "transform duration-100",
        hideOnScroll && !isNavbarVisible && "-translate-y-16"
      )}
    >
      <div className="w-full flex flex-wrap justify-between items-stretch">
        <div className="items-center flex flex-grow-1">
          {items != null && items.length !== 0 && (
            <button
              aria-label="Navigation bar toggle"
              className="mr-2 lg:hidden"
              type="button"
              tabIndex={0}
              onClick={showSidebar}
              onKeyDown={showSidebar}
            >
              <IconMenu />
            </button>
          )}
          <Logo
            className="h-8 flex items-center font-medium mr-5 min-w-0"
            imageClassName="mr-2 h-full"
            titleClassName="flex truncate"
          />
          {leftItems.map((item, i) => (
            <NavbarItem {...item} key={i} />
          ))}
        </div>
        <div className="flex flex-grow-0 flex-shrink-0 justify-end items-center">
          {rightItems.map((item, i) => (
            <NavbarItem {...item} key={i} />
          ))}
          {!disableColorModeSwitch && (
            <Toggle
              className="hidden lg:block"
              checked={isDarkTheme}
              onChange={onToggleChange}
            />
          )}
          {!hasSearchNavbarItem && <SearchBar />}
        </div>
      </div>
      <div
        role="presentation"
        className={clsx(
          "bg-black bg-opacity-60 fixed inset-0 transition-all duration-1000 ease-in-out z-40",
          sidebarShown ? "opacity-1" : "opacity-0 invisible"
        )}
        onClick={hideSidebar}
      />
      <div
        className={clsx(
          "bg-surface fixed top-0 left-0 bottom-0 z-40 w-10/12",
          "transition-all duration-300 ease-in-out transform",
          sidebarShown ? "opacity-1" : "opacity-0 invisible -translate-x-full"
        )}
      >
        <div className="flex shadow-md h-16 w-full px-4 py-2 items-center">
          <Logo
            className="h-8 flex items-center font-medium mr-5 min-w-0"
            imageClassName="mr-2 h-full"
            titleClassName="flex truncate"
            onClick={hideSidebar}
          />
          {!disableColorModeSwitch && sidebarShown && (
            <Toggle checked={isDarkTheme} onChange={onToggleChange} />
          )}
        </div>

        <Menu>
          {items.map((item, i) => (
            <NavbarItem
              mobile
              {...(item as any)} // TODO fix typing
              onClick={hideSidebar}
              key={i}
            />
          ))}
        </Menu>
      </div>
    </nav>
  );
}

export default Navbar;
