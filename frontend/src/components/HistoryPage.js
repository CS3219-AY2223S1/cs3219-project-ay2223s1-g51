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
  import { useState, useEffect } from "react";
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
    const [history, setHistory] = useState();

    useEffect(() => {
      try {
        const getHistory = async () => {
          // call api to get history
          // return await axios.get(URL_QUESTION_GETQUESTION_SVC + roomtype);
        };
        const res = getHistory();
        res.then((obj) => {
          setHistory(obj.data.resp.difficulty);
          // then pass history into each History Card below
        });
      } catch (err) {
        console.log(err);
      }
    }, []);
    
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
  