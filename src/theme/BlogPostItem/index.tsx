/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import { MDXProvider } from "@mdx-js/react";
import Translate, { translate } from "@docusaurus/Translate";
import Link from "@docusaurus/Link";
import MDXComponents from "@theme/MDXComponents";
import Seo from "@theme/Seo";
import type { Props } from "@theme/BlogPostItem";

import { usePluralForm } from "@docusaurus/theme-common";

// Very simple pluralization: probably good enough for now
function useReadingTimePlural() {
  const { selectMessage } = usePluralForm();
  return (readingTimeFloat: number) => {
    const readingTime = Math.ceil(readingTimeFloat);
    return selectMessage(
      readingTime,
      translate(
        {
          id: "theme.blog.post.readingTime.plurals",
          description:
            'Pluralized label for "{readingTime} min read". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',
          message: "One min read|{readingTime} min read",
        },
        { readingTime }
      )
    );
  };
}

function BlogPostItem(props: Props): JSX.Element {
  const readingTimePlural = useReadingTimePlural();
  const {
    children,
    frontMatter,
    metadata,
    truncated,
    isBlogPostPage = false,
  } = props;
  const { date, formattedDate, permalink, tags, readingTime } = metadata;
  const { author, title, image, keywords } = frontMatter;

  const authorURL = frontMatter.author_url || frontMatter.authorURL;
  const authorTitle = frontMatter.author_title || frontMatter.authorTitle;
  const authorImageURL =
    frontMatter.author_image_url || frontMatter.authorImageURL;

  const renderPostHeader = () => {
    const TitleHeading = isBlogPostPage ? "h1" : "h2";

    return (
      <header>
        <TitleHeading className={"mb-2 text-5xl font-semibold"}>
          {isBlogPostPage ? title : <Link to={permalink}>{title}</Link>}
        </TitleHeading>
        <div className="my-4">
          <time dateTime={date} className="text-sm">
            {formattedDate}
            {readingTime && (
              <>
                {" · "}
                {readingTimePlural(readingTime)}
              </>
            )}
          </time>
        </div>
        <div className="flex my-4 space-x-4">
          {authorImageURL && (
            <Link
              className="block rounded-full w-12 h-12 overflow-hidden"
              href={authorURL}
            >
              <img src={authorImageURL} alt={author} />
            </Link>
          )}
          <div className="flex flex-col justify-center">
            {author && (
              <>
                <h4 className="font-semibold text-primary">
                  <Link href={authorURL}>{author}</Link>
                </h4>
                <small>{authorTitle}</small>
              </>
            )}
          </div>
        </div>
      </header>
    );
  };

  return (
    <>
      <Seo {...{ keywords, image }} />

      <article className={!isBlogPostPage ? "mb-20" : undefined}>
        {renderPostHeader()}
        <div className="markdown prose prose-primary">
          <MDXProvider components={MDXComponents}>{children}</MDXProvider>
        </div>
        {(tags.length > 0 || truncated) && (
          <footer className="flex justify-between my-10">
            {tags.length > 0 && (
              <div className="">
                <strong>
                  <Translate
                    id="theme.tags.tagsListLabel"
                    description="The label alongside a tag list"
                  >
                    Tags:
                  </Translate>
                </strong>
                {tags.map(({ label, permalink: tagPermalink }) => (
                  <Link key={tagPermalink} className="mx-2" to={tagPermalink}>
                    {label}
                  </Link>
                ))}
              </div>
            )}
            {truncated && (
              <div className="ml-8  text-right">
                <Link
                  to={metadata.permalink}
                  aria-label={`Read more about ${title}`}
                >
                  <strong>
                    <Translate
                      id="theme.blog.post.readMore"
                      description="The label used in blog post item excerpts to link to full blog posts"
                    >
                      Read More
                    </Translate>
                  </strong>
                </Link>
              </div>
            )}
          </footer>
        )}
      </article>
    </>
  );
}

export default BlogPostItem;
