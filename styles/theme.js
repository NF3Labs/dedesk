import { extendTheme, useColorModeValue } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const breakpoints = {
  base: "0em", // 0px
  sm: "30em", // ~480px. em is a relative unit and is dependant on the font-size.
  md: "48em", // ~768px
  lg: "62em", // ~992px
  xl: "80em", // ~1280px
  "2xl": "96em", // ~1536px
};

const theme = extendTheme({
  /* fonts: {
    body: `'Grandis', sans-serif`,
  }, */
  config,
  breakpoints,
  styles: {
    global: (props) => ({
      body: {
        bg: mode("#FFFFFF", "#0A0A0A")(props),
        color: mode("#000000", "#FFFFFF")(props),
      },
    }),
  },
  colors: {
    bg: {
      dark: "#0A0A0A",
      light: "#FFFFFF",
    },
    modal: {
      dark: "#0B0B0B",
      light: "#FFFFFF",
    },
    border: {
      dark: "#292929",
      light: "#d9d9d9",
    },
    lightBg: {
      dark: "#141414",
      light: "#F1F1F1",
    },
    surface: {
      dark: "#1F1F1F",
      light: "#F1F1F1",
    },
    content: {
      dark: "#858585",
      light: "#696869",
    },
    header: {
      dark: "#333333",
      light: "#BCBCBC",
    },
    input: {
      dark: "#ffffff",
      light: "#696869",
    },
    selecter: {
      dark: "#ffffff",
      light: "#000000",
    },
    bitcoin: "#FF6B00",
    whiter: "#FFFFFF",
    blacker: "#000000",
    grayer: "#3D3D3D",
    pinker: "#236AF2",
    whitePinker: "#FF80C1",
    greener: "#4ACB53",
    oranger: "#be0000",
    pinkerHover: "#236AF250",
    whiteHover: "#ffffffb0",
    bluer: "#1197E2",
    title: {
      dark: "#ffffff",
      light: "#000000",
    },
    titleHover: {
      dark: "#ffffff80",
      light: "#00000050",
    },
    placeholder: {
      dark: "#C4C4D4",
      light: "#BCBCBC",
    },
  },
  components: {
    Alert: {
      variants: {
        // define own toast variant
        toast: (props) => ({
          container: {
            border: mode("2px solid black", "2px solid white")(props),
            bg: mode("#FFFFFF", "#0A0A0A")(props),
          },
        }),
      },
    },
  },
});

export default theme;
