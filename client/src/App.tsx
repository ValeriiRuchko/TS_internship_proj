import "./styles/App.css";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import { SignInPage } from "./pages/SignInPage";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  // to know what page we need to render and to have consistent layout
  const currLocation = useLocation();

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box className="App">
        {currLocation.pathname === "/" ? <SignInPage /> : <Outlet />}
      </Box>
    </ThemeProvider>
  );
}

export default App;
