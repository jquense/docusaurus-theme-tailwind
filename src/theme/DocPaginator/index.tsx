/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import Link from "@docusaurus/Link";
import Translate, { translate } from "@docusaurus/Translate";
import type { Props } from "@theme/DocPaginator";
import Paginator from "../Paginator";

function DocPaginator(props: Props): JSX.Element {
  const { metadata } = props;

  return (
    <Paginator
      aria-label={translate({
        id: "theme.docs.paginator.navAriaLabel",
        message: "Docs pages navigation",
        description: "The ARIA label for the docs pagination",
      })}
    >
      <Paginator.PrevItem>
        {metadata.previous && (
          <Paginator.Link
            to={metadata.previous.permalink}
            subtitle={
              <Translate
                id="theme.docs.paginator.previous"
                description="The label used to navigate to the previous doc"
              >
                Previous
              </Translate>
            }
            title={<>&laquo; {metadata.previous.title}</>}
          />
        )}
      </Paginator.PrevItem>
      <Paginator.NextItem>
        {metadata.next && (
          <Paginator.Link
            to={metadata.next.permalink}
            subtitle={
              <Translate
                id="theme.docs.paginator.next"
                description="The label used to navigate to the next doc"
              >
                Next
              </Translate>
            }
            title={<>{metadata.next.title} &raquo;</>}
          />
        )}
      </Paginator.NextItem>
    </Paginator>
  );
}

export default DocPaginator;
