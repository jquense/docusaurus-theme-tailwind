/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import Translate, { translate } from "@docusaurus/Translate";

import type { Props } from "@theme/BlogPostPaginator";
import Paginator from "./Paginator";

function BlogPostPaginator(props: Props): JSX.Element {
  const { nextItem, prevItem } = props;

  return (
    <Paginator
      aria-label={translate({
        id: "theme.blog.post.paginator.navAriaLabel",
        message: "Blog post page navigation",
        description: "The ARIA label for the blog posts pagination",
      })}
    >
      <Paginator.PrevItem>
        {prevItem && (
          <Paginator.Link
            to={prevItem.permalink}
            subtitle={
              <Translate
                id="theme.blog.post.paginator.newerPost"
                description="The blog post button label to navigate to the newer/previous post"
              >
                Newer Post
              </Translate>
            }
            title={<>&laquo; {prevItem.title}</>}
          />
        )}
      </Paginator.PrevItem>
      <Paginator.NextItem>
        {nextItem && (
          <Paginator.Link
            to={nextItem.permalink}
            title={<>{nextItem.title} &raquo;</>}
            subtitle={
              <Translate
                id="theme.blog.post.paginator.olderPost"
                description="The blog post button label to navigate to the older/next post"
              >
                Older Post
              </Translate>
            }
          />
        )}
      </Paginator.NextItem>
    </Paginator>
  );
}

export default BlogPostPaginator;
