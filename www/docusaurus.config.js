// const isProd = process.env.NODE_ENV === "production";

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: "My Site",
  tagline: "Dinosaurs are cool",
  url: "https://your-docusaurus-test-site.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "facebook", // Usually your GitHub org/user name.
  projectName: "docusaurus", // Usually your repo name.
  themeConfig: {
    hideableSidebar: true,
    // announcementBar: {
    //   id: "support_us", // Any value that will identify this message.
    //   content:
    //     'We are looking to revamp our docs, please fill <a target="_blank" rel="noopener noreferrer" href="#">this survey</a>',
    //   // backgroundColor: "#fafbfc", // Defaults to `#fff`.
    //   // textColor: "#091E42", // Defaults to `#000`.
    //   isCloseable: false, // Defaults to `true`.
    // },
    navbar: {
      title: "My Site",
      logo: {
        alt: "My Site Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          type: "doc",
          docId: "intro",
          position: "left",
          label: "Tutorial",
        },
        { to: "/blog", label: "Blog", position: "left" },
        {
          type: "docsVersionDropdown",
          position: "right",
          dropdownActiveClassDisabled: true,
        },
        {
          href: "https://github.com/facebook/docusaurus",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Tutorial",
              to: "/docs/intro",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Stack Overflow",
              href: "https://stackoverflow.com/questions/tagged/docusaurus",
            },
            {
              label: "Discord",
              href: "https://discordapp.com/invite/docusaurus",
            },
            {
              label: "Twitter",
              href: "https://twitter.com/docusaurus",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Blog",
              to: "/blog",
            },
            {
              label: "GitHub",
              href: "https://github.com/facebook/docusaurus",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
    },
  },
  // presets: [require.resolve("@docusaurus/preset-classic")],
  themes: [
    [
      require.resolve("../"),
      {
        customCss: require.resolve("./src/css/custom.css"),
      },
    ],

    // algolia && require.resolve("@docusaurus/theme-search-algolia"),
  ],
  plugins: [
    require.resolve("./plugins/webpack"),
    [
      require.resolve("@docusaurus/plugin-content-docs"),
      {
        sidebarPath: require.resolve("./sidebars.js"),
        // Please change this to your repo.
        editUrl: "https://github.com/facebook/docusaurus/edit/master/website/",
      },
    ],
    [
      require.resolve("@docusaurus/plugin-content-blog"),
      {
        showReadingTime: true,
        // Please change this to your repo.
        editUrl:
          "https://github.com/facebook/docusaurus/edit/master/website/blog/",
      },
    ],
    require.resolve("@docusaurus/plugin-content-pages"),

    // debug && require.resolve("@docusaurus/plugin-debug"),
    // isProd && gtag && require.resolve("@docusaurus/plugin-google-gtag"),
    // isProd &&
    //   opts.sitemap !== false && [
    //     require.resolve("@docusaurus/plugin-sitemap"),
    //     opts.sitemap,
    //   ],
  ],
};
