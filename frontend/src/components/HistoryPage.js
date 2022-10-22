import axios from "axios";
import { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { URL_GETHISTORY_SVC } from "../configs/history-service";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <div>
      <ThemeProvider theme={themeLight}>
        <div className={"m-5"}>
          <h2>History</h2>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell align="left">Buddy</TableCell>
                  <TableCell align="left">Question</TableCell>
                  <TableCell align="left">Progress</TableCell>
                  <TableCell align="left">Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.length == 0 && <TableRow
                    key="no-history-found"
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      No history found
                    </TableCell>
                    <TableCell align="left">No history found</TableCell>
                    <TableCell align="left">No history found</TableCell>
                    <TableCell align="left">No history found</TableCell>
                    <TableCell align="left">No history found</TableCell>
                  </TableRow>}
                {history.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.username}
                    </TableCell>
                    <TableCell align="left">{row.buddy ? row.buddy : "None"} {' '}</TableCell>
                    <TableCell align="left">{row.question}</TableCell>
                    <TableCell align="left">{row.progress}</TableCell>
                    <TableCell align="left">{row.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </ThemeProvider>
    </div>
  );
}

export default HistoryPage;
