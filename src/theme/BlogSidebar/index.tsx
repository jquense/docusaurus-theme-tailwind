/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import type { Props } from "@theme/BlogSidebar";
import styles from "./styles.module.css";

export default function BlogSidebar({
  sidebar,
  className,
}: Props & { className?: string }): JSX.Element | null {
  if (sidebar.items.length === 0) {
    return null;
  }
  return (
    <div
      className={clsx(
        className,
        styles.sidebar,
        "hidden lg:block overflow-y-auto sticky top-16"
      )}
    >
      <h3 className="mb-2 font-semibold">{sidebar.title}</h3>
      <ul className="overlow-y-auto">
        {sidebar.items.map((item) => {
          return (
            <li key={item.permalink} className="my-3">
              <Link
                isNavLink
                to={item.permalink}
                className="text-inherit hover:no-underline hover:text-primary transition-colors duration-300 text-sm"
                activeClassName="text-primary"
              >
                {item.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
