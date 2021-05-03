/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import Translate, { translate } from "@docusaurus/Translate";
import type { Props } from "@theme/BlogListPaginator";
import Paginator from "./Paginator";

function BlogListPaginator(props: Props): JSX.Element {
  const { metadata } = props;
  const { previousPage, nextPage } = metadata;

  return (
    <Paginator
      aria-label={translate({
        id: "theme.blog.paginator.navAriaLabel",
        message: "Blog list page navigation",
        description: "The ARIA label for the blog pagination",
      })}
    >
      <Paginator.PrevItem>
        {previousPage && (
          <Paginator.Link
            to={previousPage}
            title={
              <>
                {" "}
                &laquo;{" "}
                <Translate
                  id="theme.blog.paginator.newerEntries"
                  description="The label used to navigate to the newer blog posts page (previous page)"
                >
                  Newer Entries
                </Translate>
              </>
            }
          />
        )}
      </Paginator.PrevItem>
      <Paginator.NextItem>
        {nextPage && (
          <Paginator.Link
            to={nextPage}
            title={
              <>
                <Translate
                  id="theme.blog.paginator.olderEntries"
                  description="The label used to navigate to the older blog posts page (next page)"
                >
                  Older Entries
                </Translate>{" "}
                &raquo;
              </>
            }
          />
        )}
      </Paginator.NextItem>
    </Paginator>
  );
}

export default BlogListPaginator;
