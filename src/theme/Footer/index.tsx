/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import clsx from "clsx";

import Link from "@docusaurus/Link";
import { FooterLinkItem, useThemeConfig } from "@docusaurus/theme-common";
import useBaseUrl from "@docusaurus/useBaseUrl";
import ThemedImage, { Props as ThemedImageProps } from "@theme/ThemedImage";

function FooterLink({
  to,
  href,
  label,
  prependBaseUrlToHref,
  ...props
}: FooterLinkItem) {
  const toUrl = useBaseUrl(to);
  const normalizedHref = useBaseUrl(href, { forcePrependBaseUrl: true });

  return (
    <Link
      className="leading-8 text-inherit hover:text-primary hover:underline transition"
      {...(href
        ? {
            href: prependBaseUrlToHref ? normalizedHref : href,
          }
        : {
            to: toUrl,
          })}
      {...props}
    >
      {label}
    </Link>
  );
}

const FooterLogo = ({
  sources,
  alt,
}: Pick<ThemedImageProps, "sources" | "alt">) => (
  <ThemedImage className="footer__logo" alt={alt} sources={sources} />
);

function Footer(): JSX.Element | null {
  const { footer } = useThemeConfig();

  const { copyright, links = [], logo = {} } = footer || {};
  const sources = {
    light: useBaseUrl(logo.src),
    dark: useBaseUrl(logo.srcDark || logo.src),
  };

  if (!footer) {
    return null;
  }

  return (
    <footer
      className={clsx(
        "py-8",
        footer.style === "dark"
          ? "bg-emphasis-700 text-white"
          : "bg-emphasis-100"
      )}
    >
      <div className="container mx-auto">
        {links && links.length > 0 && (
          <div className="flex mb-4 flex-col lg:flex-row w-full">
            {links.map((linkItem, i) => (
              <div key={i} className="flex-grow px-4 mb-12 lg:mb-0">
                {linkItem.title != null ? (
                  <h4 className="font-semibold mb-4">{linkItem.title}</h4>
                ) : null}
                {linkItem.items != null &&
                Array.isArray(linkItem.items) &&
                linkItem.items.length > 0 ? (
                  <ul>
                    {linkItem.items.map((item, key) =>
                      item.html ? (
                        <li
                          key={key}
                          // Developer provided the HTML, so assume it's safe.
                          // eslint-disable-next-line react/no-danger
                          dangerouslySetInnerHTML={{
                            __html: item.html,
                          }}
                        />
                      ) : (
                        <li key={item.href || item.to}>
                          <FooterLink {...item} />
                        </li>
                      )
                    )}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        )}
        {(logo || copyright) && (
          <div className="text-center">
            {logo && (logo.src || logo.srcDark) && (
              <div className="mb-2">
                {logo.href ? (
                  <Link
                    href={logo.href}
                    className="opacity-50 transition-opacity duration-300"
                  >
                    <FooterLogo alt={logo.alt} sources={sources} />
                  </Link>
                ) : (
                  <FooterLogo alt={logo.alt} sources={sources} />
                )}
              </div>
            )}
            {copyright ? (
              <div
                // Developer provided the HTML, so assume it's safe.
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: copyright,
                }}
              />
            ) : null}
          </div>
        )}
      </div>
    </footer>
  );
}

export default Footer;
