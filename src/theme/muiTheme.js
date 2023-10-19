import { createTheme } from "@mui/material";
import Color from "./theme";

const muiTheme = createTheme({
  palette: {
    primary: {
      main: Color.primaryColorGreen,
    },
    secondary: {
      main: Color.primaryColorLight,
    },
  },
  typography: {
    fontFamily: "Montserrat, sans-serif",
  },
});

export default muiTheme;
