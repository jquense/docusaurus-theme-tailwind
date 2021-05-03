/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { DocusaurusContext, Plugin } from "@docusaurus/types";
import { ThemeConfig } from "@docusaurus/theme-common";
import { getTranslationFiles, translateThemeConfig } from "./translations";
import path from "path";
import Module from "module";
// import postcss, { Root as PostCssRoot } from "postcss";
import { readDefaultCodeTranslationMessages } from "@docusaurus/utils";

const createRequire = Module.createRequire || Module.createRequireFromPath;
const requireFromDocusaurusCore = createRequire(
  require.resolve("@docusaurus/core/package.json")
);
const ContextReplacementPlugin = requireFromDocusaurusCore(
  "webpack/lib/ContextReplacementPlugin"
);

// Need to be inlined to prevent dark mode FOUC
// Make sure that the 'storageKey' is the same as the one in `/theme/hooks/useTheme.js`
const storageKey = "theme";
const noFlashColorMode = ({ defaultMode, respectPrefersColorScheme }) => {
  return `(function() {
  var defaultMode = '${defaultMode}';
  var respectPrefersColorScheme = ${respectPrefersColorScheme};

  function setDataThemeAttribute(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  function getStoredTheme() {
    var theme = null;
    try {
      theme = localStorage.getItem('${storageKey}');
    } catch (err) {}
    return theme;
  }

  var storedTheme = getStoredTheme();
  if (storedTheme !== null) {
    setDataThemeAttribute(storedTheme);
  } else {
    if (
      respectPrefersColorScheme &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      setDataThemeAttribute('dark');
    } else if (
      respectPrefersColorScheme &&
      window.matchMedia('(prefers-color-scheme: light)').matches
    ) {
      setDataThemeAttribute('light');
    } else {
      setDataThemeAttribute(defaultMode === 'dark' ? 'dark' : 'light');
    }
  }
})();`;
};

type PluginOptions = {
  customCss?: string;
  tailwindConfig: any;
};

export default function docusaurusThemeClassic(
  context: DocusaurusContext & { siteDir: string }, // TODO: LoadContext is missing some of properties
  options: PluginOptions
): Plugin<void> {
  const {
    siteDir,
    siteConfig: { themeConfig: roughlyTypedThemeConfig },
    i18n: { currentLocale, localeConfigs },
  } = context;
  const themeConfig = (roughlyTypedThemeConfig || {}) as ThemeConfig;
  const { colorMode, prism: { additionalLanguages = [] } = {} } = themeConfig;
  const { customCss, tailwindConfig } = options || {};
  // const { direction } = localeConfigs[currentLocale];

  process.env.DOCUSAURUS_SITE_DIR = siteDir;

  return {
    name: "docusaurus-theme-classic",

    /*
    Does not seem needed: webpack can already hot reload theme files
    getPathsToWatch() {
      return [
        path.join(__dirname, '..', 'lib'),
        path.join(__dirname, '..', 'lib-next'),
      ];
    },
     */

    getThemePath() {
      return path.join(__dirname, "..", "lib", "theme");
    },

    getTypeScriptThemePath() {
      return path.resolve(__dirname, "..", "src", "theme");
    },

    getTranslationFiles: async () => getTranslationFiles({ themeConfig }),
    translateThemeConfig,

    getDefaultCodeTranslationMessages: () => {
      return readDefaultCodeTranslationMessages({
        dirPath: path.resolve(__dirname, "..", "codeTranslations"),
        locale: currentLocale,
      });
    },

    getClientModules() {
      const modules = [
        require.resolve("./styles.css"),
        path.resolve(__dirname, "./prism-include-languages"),
      ];

      if (customCss) {
        if (Array.isArray(customCss)) {
          modules.push(...customCss);
        } else {
          modules.push(customCss);
        }
      }

      return modules;
    },

    configureWebpack() {
      const prismLanguages = additionalLanguages
        .map((lang) => `prism-${lang}`)
        .join("|");

      // See https://github.com/facebook/docusaurus/pull/3382
      const useDocsWarningFilter = (warning: string) =>
        warning.includes("Can't resolve '@theme-init/hooks/useDocs");

      return {
        stats: {
          warningsFilter: useDocsWarningFilter,
        },
        plugins: [
          new ContextReplacementPlugin(
            /prismjs[\\/]components$/,
            new RegExp(`^./(${prismLanguages})$`)
          ),
        ],
      };
    },

    configurePostCss(postCssOptions) {
      postCssOptions.plugins.unshift(
        // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
        require("tailwindcss")(
          tailwindConfig || require.resolve("./tailwind-preset.js")
        )
      );

      return postCssOptions;
    },

    injectHtmlTags() {
      return {
        preBodyTags: [
          {
            tagName: "script",
            attributes: {
              type: "text/javascript",
            },
            innerHTML: noFlashColorMode(colorMode),
          },
        ],
      };
    },
  };
}

const swizzleAllowedComponents = [
  "CodeBlock",
  "DocSidebar",
  "Footer",
  "NotFound",
  "SearchBar",
  "IconArrow",
  "IconEdit",
  "IconMenu",
  "hooks/useTheme",
  "prism-include-languages",
];

export function getSwizzleComponentList(): string[] {
  return swizzleAllowedComponents;
}

export { validateThemeConfig } from "./validateThemeConfig";
