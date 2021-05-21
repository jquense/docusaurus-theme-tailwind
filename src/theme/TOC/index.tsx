/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import clsx from "clsx";
import useTOCHighlight from "@theme/hooks/useTOCHighlight";
import type { TOCProps } from "@theme/TOC";
import { TOCItem } from "@docusaurus/types";

const LINK_CLASS_NAME = "text-gray-400 hover:text-primary hover:no-underline";
const ACTIVE_LINK_CLASS_NAME = "text-primary hover:no-underline";
const TOP_OFFSET = 100;

function Headings({
  toc,
  isChild,
}: {
  toc: readonly TOCItem[];
  isChild?: boolean;
}) {
  if (!toc.length) {
    return null;
  }
  return (
    <ul className={isChild ? "" : "pl-2 pt-2 text-sm border-l border-gray-300"}>
      {toc.map((heading) => (
        <li key={heading.id} className="m-2">
          <a
            href={`#${heading.id}`}
            className={LINK_CLASS_NAME}
            // Developer provided the HTML, so assume it's safe.
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: heading.value }}
          />
          <Headings isChild toc={heading.children} />
        </li>
      ))}
    </ul>
  );
}

function TOC({ toc }: TOCProps): JSX.Element {
  useTOCHighlight(LINK_CLASS_NAME, ACTIVE_LINK_CLASS_NAME, TOP_OFFSET);
  return (
    <div
      className={clsx(
        "max-w-full-navbar sticky top-full-navbar overflow-y-auto lg:block hidden",
        "thin-scrollbar"
      )}
    >
      <Headings toc={toc} />
    </div>
  );
}

export default TOC;
