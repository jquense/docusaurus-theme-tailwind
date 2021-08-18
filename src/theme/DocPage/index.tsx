/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ReactNode, useState, useCallback } from "react";
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
// @ts-expect-error
import { matchPath } from "@docusaurus/router";
import { translate } from "@docusaurus/Translate";

import clsx from "clsx";
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
  const { pluginId, docsSidebars, version } = versionMetadata;
  const sidebarName = currentDocRoute.sidebar;
  const sidebar = sidebarName && docsSidebars[sidebarName];

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
      <div className="w-full flex">
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
                className="lg:flex lg:flex-col lg:max-h-screen lg:h-full sticky top-0 transition-opacity duration-75 items-center justify-center "
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
        <main className={clsx("flex w-full")}>
          <div className={clsx("lg:container mx-auto px-4 py-8")}>
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
      {renderRoutes(docRoutes, { versionMetadata })}
    </DocPageContent>
  );
}

export default DocPage;
