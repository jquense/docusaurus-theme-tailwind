const colors = require("tailwindcss/colors");

const purge = [`${__dirname}/theme/**/*.{js,jsx,ts,tsx}`];

const siteDir = process.env.DOCUSAURUS_SITE_DIR;
if (siteDir) {
  purge.push(`${siteDir}/blog/**/*.{js,jsx,ts,tsx,mdx}`);
  purge.push(`${siteDir}/docs/**/*.{js,jsx,ts,tsx,mdx}`);
  purge.push(`${siteDir}/src/**/*.{js,jsx,ts,tsx,mdx}`);
}
console.log(process.env.NODE_ENV);
module.exports = {
  purge,
  mode: "jit",
  darkMode: false, // or 'media' or 'class'
  theme: {
    menu: {
      // color: t('colors')
      sublistIcon:
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24"><path fill="rgba(0,0,0,0.5)" d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"></path></svg>',
    },

    extend: {
      minWidth: (t) => t("width"),
      transitionProperty: {
        width: "width",
        visibility: "opacity, visibility",
        DEFAULT:
          "background-color, border-color, color, fill, stroke, opacity, visibility, box-shadow, transform, filter, backdrop-filter",
      },
      colors: {
        primary: {
          DEFAULT: colors.blue["500"],
          ...colors.blue,
        },
        surface: colors.white,
        emphasis: colors.gray,
        warning: colors.orange,
        info: colors.cyan,
        danger: colors.red,
        overlay: "rgba(0, 0, 0, 0.05)",
        inherit: "inherit",
      },

      typography: {
        DEFAULT: {
          css: {
            a: {
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
              },
            },
            strong: {
              color: "unset",
            },
          },
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
