import {
  AppBar,
  Toolbar,
  Typography,
  Stack,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { URL_USER_LOGOUTUSER_SVC } from "../configs/user-service";
import { STATUS_CODE_SUCCESS } from "../constants";

const NavBar = (props) => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMsg, setDialogMsg] = useState("");
  const { isLogin, setIsLogin } = props;

  const closeDialog = () => setIsDialogOpen(false);

  const setLogoutDialog = (msg) => {
    setIsDialogOpen(true);
    setDialogTitle("Logout");
    setDialogMsg(msg);
  };

  const setErrorDialog = (msg) => {
    setIsDialogOpen(true);
    setDialogTitle("Error");
    setDialogMsg(msg);
  };

  const handleLogout = async () => {
    const res = await axios.post(URL_USER_LOGOUTUSER_SVC).catch((err) => {
      console.log(err);
      setErrorDialog("Failed to logout, please try again later");
    });
    if (res && res.status === STATUS_CODE_SUCCESS) {
      window.location = "http://localhost:3000/login";
    }
  };

  const homeHandler = () => {
    navigate("/selectroom", { replace: true });
  };

  const profileHandler = () => {
    navigate("/profile", { replace: true });
  };

  const historyHandler = () => {
    navigate("/history", { replace: true });
  };

  const logoutHandler = () => {
    setLogoutDialog("Are you sure you want to logout?");
  };

  return (
    <AppBar position="static" style={{ background: "#667aff" }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          PEERPREP
        </Typography>
        {isLogin && (
          <Stack direction="row" spacing={2}>
            <Button color="inherit" onClick={homeHandler}>
              Home
            </Button>
            <Button color="inherit" onClick={profileHandler}>
              Profile
            </Button>
            <Button color="inherit" onClick={historyHandler}>
              History
            </Button>
            <Button color="inherit" onClick={logoutHandler}>
              Logout
            </Button>
          </Stack>
        )}
      </Toolbar>
      <Dialog open={isDialogOpen} onClose={closeDialog}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogMsg}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogout}>Log out</Button>
          <Button onClick={closeDialog}>cancel</Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default NavBar;
