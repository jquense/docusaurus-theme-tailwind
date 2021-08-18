/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { ComponentType } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Link from "@docusaurus/Link";
import Translate from "@docusaurus/Translate";
import {
  useActivePlugin,
  useDocVersionSuggestions,
} from "@theme/hooks/useDocs";
import { useDocsPreferredVersion } from "@docusaurus/theme-common";

import type { Props } from "@theme/DocVersionBanner";

type BannerLabelComponentProps = {
  siteTitle: string;
  versionMetadata: Props["versionMetadata"];
};

function UnreleasedVersionLabel({
  siteTitle,
  versionMetadata,
}: BannerLabelComponentProps) {
  return (
    <Translate
      id="theme.docs.versions.unreleasedVersionLabel"
      description="The label used to tell the user that he's browsing an unreleased doc version"
      values={{
        siteTitle,
        versionLabel: <strong>{versionMetadata.label}</strong>,
      }}
    >
      {
        "This is unreleased documentation for {siteTitle} {versionLabel} version."
      }
    </Translate>
  );
}

function UnmaintainedVersionLabel({
  siteTitle,
  versionMetadata,
}: BannerLabelComponentProps) {
  return (
    <Translate
      id="theme.docs.versions.unmaintainedVersionLabel"
      description="The label used to tell the user that he's browsing an unmaintained doc version"
      values={{
        siteTitle,
        versionLabel: <strong>{versionMetadata.label}</strong>,
      }}
    >
      {
        "This is documentation for {siteTitle} {versionLabel}, which is no longer actively maintained."
      }
    </Translate>
  );
}

const BannerLabelComponents: Record<
  Exclude<Props["versionMetadata"]["banner"], "none">,
  ComponentType<BannerLabelComponentProps>
> = {
  unreleased: UnreleasedVersionLabel,
  unmaintained: UnmaintainedVersionLabel,
};

function BannerLabel(props: BannerLabelComponentProps) {
  const BannerLabelComponent =
    BannerLabelComponents[props.versionMetadata.banner];
  return <BannerLabelComponent {...props} />;
}

function LatestVersionSuggestionLabel({
  versionLabel,
  to,
  onClick,
}: {
  to: string;
  onClick: () => void;
  versionLabel: string;
}) {
  return (
    <Translate
      id="theme.docs.versions.latestVersionSuggestionLabel"
      description="The label userd to tell the user that he's browsing an unmaintained doc version"
      values={{
        versionLabel,
        latestVersionLink: (
          <strong>
            <Link
              to={to}
              onClick={onClick}
              className="text-white hover:white underline"
            >
              <Translate
                id="theme.docs.versions.latestVersionLinkLabel"
                description="The label used for the latest version suggestion link label"
              >
                latest version
              </Translate>
            </Link>
          </strong>
        ),
      }}
    >
      {
        "For up-to-date documentation, see the {latestVersionLink} ({versionLabel})."
      }
    </Translate>
  );
}

function DocVersionBannerEnabled({ versionMetadata }: Props): JSX.Element {
  const {
    siteConfig: { title: siteTitle },
  } = useDocusaurusContext();
  const { pluginId } = useActivePlugin({ failfast: true })!;

  const getVersionMainDoc = (version: any) =>
    version.docs.find((doc) => doc.id === version.mainDocId)!;

  const { savePreferredVersionName } = useDocsPreferredVersion(pluginId);

  const { latestDocSuggestion, latestVersionSuggestion } =
    useDocVersionSuggestions(pluginId);

  // try to link to same doc in latest version (not always possible)
  // fallback to main doc of latest version
  const latestVersionSuggestedDoc =
    latestDocSuggestion ?? getVersionMainDoc(latestVersionSuggestion);

  return (
    <div className="rounded-lg text-white bg-warning-500 mb-4 p-4" role="alert">
      <div>
        <BannerLabel siteTitle={siteTitle} versionMetadata={versionMetadata} />
      </div>
      <div className="mt-4">
        <LatestVersionSuggestionLabel
          versionLabel={latestVersionSuggestion.label}
          to={latestVersionSuggestedDoc.path}
          onClick={() => savePreferredVersionName(latestVersionSuggestion.name)}
        />
      </div>
    </div>
  );
}

function DocVersionBanner({ versionMetadata }: Props): JSX.Element {
  if (versionMetadata.banner === "none") {
    return <></>;
  } else {
    return <DocVersionBannerEnabled versionMetadata={versionMetadata} />;
  }
}

export default DocVersionBanner;
