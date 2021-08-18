/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import DocPaginator from "@theme/DocPaginator";
import DocVersionBanner from "@theme/DocVersionBanner";
import Seo from "@theme/Seo";
import LastUpdated from "@theme/LastUpdated";
import type { Props } from "@theme/DocItem";
import TOC from "@theme/TOC";
import EditThisPage from "@theme/EditThisPage";

import clsx from "clsx";
import {
  useActivePlugin,
  useVersions,
  useActiveVersion,
} from "@theme/hooks/useDocs";

function DocItem(props: Props): JSX.Element {
  const { content: DocContent, versionMetadata } = props;
  const {
    metadata,
    frontMatter: {
      image,
      keywords,
      hide_title: hideTitle,
      hide_table_of_contents: hideTableOfContents,
    },
  } = DocContent;
  const {
    description,
    title,
    editUrl,
    lastUpdatedAt,
    formattedLastUpdatedAt,
    lastUpdatedBy,
  } = metadata;

  const { pluginId } = useActivePlugin({ failfast: true });
  const versions = useVersions(pluginId);
  const version = useActiveVersion(pluginId);

  // If site is not versioned or only one version is included
  // we don't show the version badge
  // See https://github.com/facebook/docusaurus/issues/3362
  const showVersionBadge = versions.length > 1;

  return (
    <>
      <Seo {...{ title, description, keywords, image }} />

      <div className="flex w-full">
        <div className={clsx("pr-4", !hideTableOfContents && "lg:w-3/4")}>
          <DocVersionBanner versionMetadata={versionMetadata} />
          <div className="mx-auto px-2">
            <article>
              {showVersionBadge && (
                <div>
                  <span className="text-sm rounded bg-emphasis-200 px-2 py-0.5 font-semibold">
                    Version: {version.label}
                  </span>
                </div>
              )}
              {!hideTitle && (
                <header>
                  <h1 className="text-5xl leading-relaxed mb-4 font-bold">
                    {title}
                  </h1>
                </header>
              )}
              <div className="markdown prose prose-primary">
                <DocContent />
              </div>
            </article>
            {(editUrl || lastUpdatedAt || lastUpdatedBy) && (
              <div className="my-20">
                <div className="row">
                  <div className="col">
                    {editUrl && <EditThisPage editUrl={editUrl} />}
                  </div>
                  {(lastUpdatedAt || lastUpdatedBy) && (
                    <LastUpdated
                      lastUpdatedAt={lastUpdatedAt}
                      formattedLastUpdatedAt={formattedLastUpdatedAt}
                      lastUpdatedBy={lastUpdatedBy}
                    />
                  )}
                </div>
              </div>
            )}
            <div className="my-10">
              <DocPaginator metadata={metadata} />
            </div>
          </div>
        </div>
        {!hideTableOfContents && DocContent.toc && (
          <div className="lg:w-1/3 lg:pl-4">
            <TOC toc={DocContent.toc} />
          </div>
        )}
      </div>
    </>
  );
}

export default DocItem;
