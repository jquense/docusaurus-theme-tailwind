/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import Layout from "@theme/Layout";
import BlogPostItem from "@theme/BlogPostItem";
import BlogPostPaginator from "@theme/BlogPostPaginator";
import type { Props } from "@theme/BlogPostPage";
import BlogSidebar from "@theme/BlogSidebar";
import TOC from "@theme/TOC";
import EditThisPage from "@theme/EditThisPage";
import { ThemeClassNames } from "@docusaurus/theme-common";

function BlogPostPage(props: Props): JSX.Element {
  const { content: BlogPostContents, sidebar } = props;
  const { frontMatter, metadata } = BlogPostContents;
  const { title, description, nextItem, prevItem, editUrl } = metadata;
  const { hide_table_of_contents: hideTableOfContents } = frontMatter;

  return (
    <Layout
      title={title}
      description={description}
      wrapperClassName={ThemeClassNames.wrapper.blogPages}
      pageClassName={ThemeClassNames.page.blogPostPage}
    >
      {BlogPostContents && (
        <div className="grid grid-cols-12 lg:container mx-auto my-8">
          <div className="col-span-3 px-4">
            <BlogSidebar sidebar={sidebar} />
          </div>
          <main className="lg:col-span-7 col-span-12 px-4 content">
            <BlogPostItem
              frontMatter={frontMatter}
              metadata={metadata}
              isBlogPostPage
            >
              <BlogPostContents />
            </BlogPostItem>
            <div>{editUrl && <EditThisPage editUrl={editUrl} />}</div>
            {(nextItem || prevItem) && (
              <div className="my-20">
                <BlogPostPaginator nextItem={nextItem} prevItem={prevItem} />
              </div>
            )}
          </main>
          {!hideTableOfContents && BlogPostContents.toc && (
            <TOC className="col-span-2" toc={BlogPostContents.toc} />
          )}
        </div>
      )}
    </Layout>
  );
}

export default BlogPostPage;
