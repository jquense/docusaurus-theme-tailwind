/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import DocPaginator from "@theme/DocPaginator";
import DocVersionSuggestions from "@theme/DocVersionSuggestions";
import Seo from "@theme/Seo";
import LastUpdated from "@theme/LastUpdated";
import type { Props } from "@theme/DocItem";
import TOC from "@theme/TOC";
import EditThisPage from "@theme/EditThisPage";

import clsx from "clsx";
import styles from "./styles.module.css";
import {
  useActivePlugin,
  useVersions,
  useActiveVersion,
} from "@theme/hooks/useDocs";

function DocItem(props: Props): JSX.Element {
  const { content: DocContent } = props;
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
          <DocVersionSuggestions />
          <div className={styles.docItemContainer}>
            <article>
              {showVersionBadge && (
                <div>
                  <span className="badge badge--secondary">
                    Version: {version.label}
                  </span>
                </div>
              )}
              {!hideTitle && (
                <header>
                  <h1 className={styles.docTitle}>{title}</h1>
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
