import {
    Box,
    Button,
    Container,
    CssBaseline,
    Grid,
    TextField,
    Typography,
    Stack,
  } from "@mui/material";
  import axios from "axios";
  import { URL_USER_DELETE_SVC, URL_USER_EDITPASSWORD_SVC } from "../configs";
  import { STATUS_CODE_DATABASE_ERROR, STATUS_CODE_SUCCESS } from "../constants";
  import { useState } from "react";
  import { createTheme, ThemeProvider } from "@mui/material/styles";
  import HistoryCard from "./HistoryCard";
  
  const themeLight = createTheme({
    palette: {
      background: {
        default: "#ffffff",
      },
    },
  });
  
  function HistoryPage(props) {
    const [username, setUsername] = useState("");

  
    return (
      <div>
        <ThemeProvider theme={themeLight}>
          <Grid container spacing={10} alignItems="center" justifyContent="center" style={{ minHeight:"90vh"}}>
            <Grid item xs={10}></Grid>
            <Grid item xs={10}>
              <Typography component="h1" variant="h5">
                Practice History
              </Typography>
            </Grid>
            <HistoryCard></HistoryCard>
            <HistoryCard></HistoryCard>
            <HistoryCard></HistoryCard>
          </Grid>
      </ThemeProvider>
      </div>
    );
  }
  
  export default HistoryPage;
  