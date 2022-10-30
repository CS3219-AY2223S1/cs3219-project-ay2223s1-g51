import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { URL_USER_LOGINUSER_SVC } from "../configs/user-service";
import { STATUS_CODE_SUCCESS } from "../constants";

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {"Copyright © "}
      <Link color="inherit" href="https://github.com/CS3219-AY2223S1/cs3219-project-ay2223s1-g51">
        Peerprep-G51
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const themeLight = createTheme({
  palette: {
    background: {
      default: "#ffffff",
    },
  },
});

export default function Login(props) {
  const navigate = useNavigate();
  const {username, password, token, user, setUsername, setPassword, setToken, setUser} = props
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMsg, setDialogMsg] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    const res = await axios.post(URL_USER_LOGINUSER_SVC, { username, password }).catch((err) => {
      console.log(err);
      setErrorDialog("Wrong username or password. Please try again.");
    });

    if (res && res.status === STATUS_CODE_SUCCESS) {
      setUsername(username);
      setPassword(password);
      //console.log(res.data.resp.obj)
	    const jwtToken = JSON.stringify(res.data.resp.obj.stsTokenManager.accessToken)
      const currUser = JSON.stringify(res.data.resp.obj)
      setUser(currUser)
	    setToken(jwtToken)
      setSuccessDialog("Successfully logged in!");
      navigate("/selectroom", { replace: true });
    }
  };

  const closeDialog = () => setIsDialogOpen(false);

  const setSuccessDialog = (msg) => {
    setIsDialogOpen(true);
    setDialogTitle("Success");
    setDialogMsg(msg);
  };

  const setErrorDialog = (msg) => {
    setIsDialogOpen(true);
    setDialogTitle("Error");
    setDialogMsg(msg);
  };

  const usernameHandler = (e) => {
    setUsername(e.target.value);
    setUsername(e.target.value);
  };

  const passwordHandler = (e) => {
    setPassword(e.target.value);
    setPassword(e.target.value);
  };

  return (
    <div className="background-img">
      <ThemeProvider theme={themeLight}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              bgcolor: "background.paper",
              boxShadow: 1,
              borderRadius: 2,
              p: 2,
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              PeerPrep Log in
            </Typography>
            <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Email"
                name="username"
                autoComplete="username"
                autoFocus
                onChange={usernameHandler}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={passwordHandler}
              />
              <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleLogin}>
                Log In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/signup" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>

          <Dialog open={isDialogOpen} onClose={closeDialog}>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogContent>
              <DialogContentText>{dialogMsg}</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeDialog}>OK</Button>
            </DialogActions>
          </Dialog>

          {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
        </Container>
      </ThemeProvider>
    </div>
  );
}
