import {
  Box,
  Button,
  Container,
  CssBaseline,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const themeLight = createTheme({
  palette: {
    background: {
      default: "#e8ecfc",
    },
  },
});

function HomePage(props) {
  const { username } = props;

  return (
    <div>
      <ThemeProvider theme={themeLight}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              PeerPrep
            </Typography>
            <Box
              component="form"
              noValidate
              sx={{
                marginTop: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} href="/selectroom">
                Peer Prep!
              </Button>
              <div style={{ width: "400px" }}></div>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default HomePage;
