import { Box, Button, Container, CssBaseline, Grid, TextField, Typography, Stack } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import HistoryCard from "./HistoryCard";
import { URL_GETHISTORY_SVC } from "../configs/history-service";

const themeLight = createTheme({
  palette: {
    background: {
      default: "#ffffff",
    },
  },
});

function HistoryPage(props) {
  const [history, setHistory] = useState([]);
  const { username } = props;

  useEffect(() => {
    try {
      const getHistory = async () => {
        console.log(URL_GETHISTORY_SVC + username);
        return await axios.get(URL_GETHISTORY_SVC + username);
      };
      const res = getHistory();
      res.then((obj) => {
        console.log(obj.data.resp);
        setHistory(obj.data.resp);
        // then pass history into each History Card below
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <div>
      <ThemeProvider theme={themeLight}>
        <Grid container spacing={10} alignItems="center" justifyContent="center" style={{ minHeight: "90vh" }}>
          <Grid item xs={10}></Grid>
          <Grid item xs={10}>
            <Typography component="h1" variant="h5">
              Practice History
            </Typography>
          </Grid>
          {history.map((item) => (
            <HistoryCard
              username={item.username}
              buddy={item.buddy}
              question={item.question}
              progress={item.progress}
              date={item.date}
            ></HistoryCard>
          ))}
        </Grid>
      </ThemeProvider>
    </div>
  );
}

export default HistoryPage;
