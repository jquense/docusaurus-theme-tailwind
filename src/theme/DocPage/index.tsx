/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { ReactNode, useState, useCallback } from "react";
import { MDXProvider } from "@mdx-js/react";

import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import renderRoutes from "@docusaurus/renderRoutes";
import type { PropVersionMetadata } from "@docusaurus/plugin-content-docs-types";
import Layout from "@theme/Layout";
import DocSidebar from "@theme/DocSidebar";
import MDXComponents from "@theme/MDXComponents";
import NotFound from "@theme/NotFound";
import type { DocumentRoute } from "@theme/DocItem";
import type { Props } from "@theme/DocPage";
import IconArrow from "@theme/IconArrow";
import { matchPath } from "@docusaurus/router";
import { translate } from "@docusaurus/Translate";

import clsx from "clsx";
import styles from "./styles.module.css";
import { ThemeClassNames, docVersionSearchTag } from "@docusaurus/theme-common";

type DocPageContentProps = {
  readonly currentDocRoute: DocumentRoute;
  readonly versionMetadata: PropVersionMetadata;
  readonly children: ReactNode;
};

function DocPageContent({
  currentDocRoute,
  versionMetadata,
  children,
}: DocPageContentProps): JSX.Element {
  const { siteConfig, isClient } = useDocusaurusContext();
  const {
    pluginId,
    permalinkToSidebar,
    docsSidebars,
    version,
  } = versionMetadata;
  const sidebarName = permalinkToSidebar[currentDocRoute.path];
  const sidebar = docsSidebars[sidebarName];

  const [hiddenSidebarContainer, setHiddenSidebarContainer] = useState(false);
  const [hiddenSidebar, setHiddenSidebar] = useState(false);
  const toggleSidebar = useCallback(() => {
    if (hiddenSidebar) {
      setHiddenSidebar(false);
    }

    setHiddenSidebarContainer(!hiddenSidebarContainer);
  }, [hiddenSidebar]);

  return (
    <Layout
      key={isClient}
      wrapperClassName={ThemeClassNames.wrapper.docPages}
      pageClassName={ThemeClassNames.page.docPage}
      searchMetadatas={{
        version,
        tag: docVersionSearchTag(pluginId, version),
      }}
    >
      <div className="grid auto-cols-auto w-full grid-flow-col">
        {sidebar && (
          <div
            data-doc-sidebar
            className={clsx(
              "lg:w-80 lg:-mt-16 lg:border-r border-gray-300 transition-width ease-in-out duration-200",
              hiddenSidebarContainer && "lg:w-8 cursor-pointer "
            )}
            onTransitionEnd={(e) => {
              if (!e.currentTarget.dataset.docSidebar) {
                return;
              }

              if (hiddenSidebarContainer) {
                setHiddenSidebar(true);
              }
            }}
            role="complementary"
          >
            <DocSidebar
              key={
                // Reset sidebar state on sidebar changes
                // See https://github.com/facebook/docusaurus/issues/3414
                sidebarName
              }
              sidebar={sidebar}
              path={currentDocRoute.path}
              sidebarCollapsible={
                siteConfig.themeConfig?.sidebarCollapsible ?? true
              }
              onCollapse={toggleSidebar}
              isHidden={hiddenSidebar}
            />

            {hiddenSidebar && (
              <div
                className="lg:flex lg:flex-col lg:max-h-screen lg:h-full sticky top-0 transition-opacity duration-75 items-center justify-center"
                title={translate({
                  id: "theme.docs.sidebar.expandButtonTitle",
                  message: "Expand sidebar",
                  description:
                    "The ARIA label and title attribute for expand button of doc sidebar",
                })}
                aria-label={translate({
                  id: "theme.docs.sidebar.expandButtonAriaLabel",
                  message: "Expand sidebar",
                  description:
                    "The ARIA label and title attribute for expand button of doc sidebar",
                })}
                tabIndex={0}
                role="button"
                onKeyDown={toggleSidebar}
                onClick={toggleSidebar}
              >
                <IconArrow className="transform rotate-0" />
              </div>
            )}
          </div>
        )}
        <main
          className={clsx(
            "flex w-full"
            // hiddenSidebarContainer || !sidebar && 'max-w-none'
          )}
        >
          <div
            className={clsx(
              "container padding-vert--lg",
              styles.docItemWrapper,
              {
                [styles.docItemWrapperEnhanced]: hiddenSidebarContainer,
              }
            )}
          >
            <MDXProvider components={MDXComponents}>{children}</MDXProvider>
          </div>
        </main>
      </div>
    </Layout>
  );
}

function DocPage(props: Props): JSX.Element {
  const {
    route: { routes: docRoutes },
    versionMetadata,
    location,
  } = props;
  const currentDocRoute = docRoutes.find((docRoute) =>
    matchPath(location.pathname, docRoute)
  );
  if (!currentDocRoute) {
    return <NotFound {...props} />;
  }
  return (
    <DocPageContent
      currentDocRoute={currentDocRoute}
      versionMetadata={versionMetadata}
    >
      {renderRoutes(docRoutes)}
    </DocPageContent>
  );
}

export default DocPage;