import {
  Box,
  Button,
  Container,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import axios from "axios";
import { URL_USER_DELETE_SVC, URL_USER_EDITPASSWORD_SVC } from "../configs/user-service";
import { useNavigate } from "react-router-dom";
import { STATUS_CODE_DATABASE_ERROR, STATUS_CODE_FAIL, STATUS_CODE_SUCCESS } from "../constants";
import { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { SettingsInputSvideoRounded } from "@material-ui/icons";

const themeLight = createTheme({
  palette: {
    background: {
      default: "#ffffff",
    },
  },
});

function ProfilePage(props) {
  const { username, password, user, setUser, setPassword } = props;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMsg, setDialogMsg] = useState("");
  const [isDeleteClicked, setIsDeleteClicked] = useState(false);
  const [isChangePasswordClicked, setIsChangePasswordClicked] = useState(false);
  const [changedPassword, setChangedPassword] = useState("");
  const [deleteAccountPassword, setDeleteAccountPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");
  const navigate = useNavigate();

  //hardcoded for now, need to change to dynamic later

  const showDeleteFieldHandler = () => {
    isDeleteClicked ? setIsDeleteClicked(false) : setIsDeleteClicked(true);
  };

  const handleDelete = (event) => {
    event.preventDefault();
    setActionConfirmationDialog("Are you sure you want to delete your account?");
  };

  const confirmDelete = async () => {
    if (deleteAccountPassword) {
      const res = await axios.delete(URL_USER_DELETE_SVC, { data: {user: user, password: deleteAccountPassword} }).catch((err) => {
        if (err.response.status === STATUS_CODE_DATABASE_ERROR) {
          setErrorDialog("Server error, Please try again later.");
        } else if (err.response.status === STATUS_CODE_FAIL) {
          setErrorDialog("Wrong password, please enter correct password.");
        } else {
          setErrorDialog("Please try again later.");
        }
      });
      setIsDeleteClicked(false);
      if (res && res.status === STATUS_CODE_SUCCESS) {
        setSuccessDialog("Account successfully deleted");
        setUser("")
        setIsDialogOpen(false);
        navigate("/login", { replace: true });
      }
    } else {
      setErrorDialog("Incorrect password. Please try again.");
    }
    setIsDeleteClicked(false);
  };

  const cancelDialog = async () => {
    setIsDeleteClicked(false);
    setIsDialogOpen(false);
  };

  //hardcoded for now, need to change to dynamic later
  const handleChangePassword = async () => {
    if (newPassword && reEnterPassword && newPassword === reEnterPassword) {
      const res = await axios
        .put(URL_USER_EDITPASSWORD_SVC, {
          oldPassword: oldPassword,
          newPassword: newPassword,
        })
        .catch((err) => {
          if (err.response.status === STATUS_CODE_DATABASE_ERROR) {
            setErrorDialog("Server error, Please try again later.");
          } else if (err.response.status === STATUS_CODE_FAIL) {
            setErrorDialog("Wrong password, please enter correct password.");
          } else {
            setErrorDialog("Please try again later.");
          }
        });
      if (res && res.status === STATUS_CODE_SUCCESS) {
        setSuccessDialog("Password successfully changed");
      }
    } else {
      setErrorDialog("Please ensure new password fields are identical");
    }
  };

  const showFieldsHandler = () => {
    isChangePasswordClicked ? setIsChangePasswordClicked(false) : setIsChangePasswordClicked(true);
  };

  const saltPassword = (e) => {
    let userNamePassword = props.username + e.target.value;
    let md5Hash = require("md5-hash");
    let saltedPassword = md5Hash.default(userNamePassword);
    return saltedPassword;
  };

  const saltPassword2 = (e) => {
    let userNamePassword = props.username + e;
    let md5Hash = require("md5-hash");
    let saltedPassword = md5Hash.default(userNamePassword);
    return saltedPassword;
  };

  const oldPasswordHandler = (e) => setOldPassword(e.target.value);

  const passwordHandler = (e) => setNewPassword(e.target.value);

  const reEnterPasswordHandler = (e) => setReEnterPassword(e.target.value);

  const deleteAccountPasswordHandler = (e) => {
    setDeleteAccountPassword(e.target.value);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const setErrorDialog = (msg) => {
    setIsDialogOpen(true);
    setDialogTitle("Error");
    setDialogMsg(msg);
  };

  const setSuccessDialog = (msg) => {
    setIsDialogOpen(true);
    setDialogTitle("Success");
    setDialogMsg(msg);
  };

  const setActionConfirmationDialog = (msg) => {
    setIsDialogOpen(true);
    setDialogTitle("Confirm");
    setDialogMsg(msg);
  };

  return (
    <div>
      <ThemeProvider theme={themeLight}>
        <Container className="mt-5" component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              bgcolor: "background.paper",
              boxShadow: 1,
              borderRadius: 2,
              p: 2,
              minHeight: 300,
              gap: 100,
              alignItems: "center",
            }}
          >
            <Stack spacing={5}>
              <Box sx={{ textAlign: "center" }}>
                <Typography component="h1" variant="h5">
                  Account Management
                </Typography>
              </Box>
              <Box
                component="form"
                noValidate
                sx={{
                  marginTop: 2,
                  display: "flex-left",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography component="h1" variant="h5"></Typography>
                <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={showFieldsHandler}>
                  Change Password
                </Button>
                {isChangePasswordClicked && (
                  <TextField
                    fullWidth
                    autoFocus
                    label="Enter old password"
                    variant="standard"
                    type="password"
                    onChange={oldPasswordHandler}
                  />
                )}
                {isChangePasswordClicked && (
                  <TextField
                    fullWidth
                    autoFocus
                    label="Enter new password"
                    variant="standard"
                    type="password"
                    onChange={passwordHandler}
                  />
                )}
                {isChangePasswordClicked && (
                  <TextField
                    fullWidth
                    autoFocus
                    label="Re-enter new password"
                    variant="standard"
                    type="password"
                    onChange={reEnterPasswordHandler}
                  />
                )}
                {isChangePasswordClicked && <Button onClick={handleChangePassword}>Change Password</Button>}
                <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={showDeleteFieldHandler}>
                  Delete Account
                </Button>
                {isDeleteClicked && (
                  <TextField
                    fullWidth
                    autoFocus
                    label="Enter password to delete account"
                    variant="standard"
                    type="password"
                    onChange={deleteAccountPasswordHandler}
                  />
                )}
                {isDeleteClicked && <Button onClick={handleDelete}>delete account</Button>}
                <div style={{ width: "400px" }}></div>
              </Box>
              <Dialog open={isDialogOpen} onClose={closeDialog}>
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogContent>
                  <DialogContentText>{dialogMsg}</DialogContentText>
                </DialogContent>
                <DialogActions>
                  {!isDeleteClicked && <Button onClick={closeDialog}>Done</Button>}
                  {isDeleteClicked && <Button onClick={confirmDelete}>Confirm</Button>}
                  {isDeleteClicked && <Button onClick={cancelDialog}>Cancel</Button>}
                </DialogActions>
              </Dialog>
            </Stack>
          </Box>
          <Box>
            <div style={{ height: "51vh" }}></div>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default ProfilePage;
