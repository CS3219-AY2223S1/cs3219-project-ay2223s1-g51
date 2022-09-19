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
    Grid,
    Link,
    TextField,
    Typography,
} from "@mui/material";
import axios from "axios";
import { URL_USER_DELETE_SVC, URL_USER_EDITPASSWORD_SVC } from "../configs";
import { STATUS_CODE_DATABASE_ERROR, STATUS_CODE_SUCCESS } from "../constants";
import { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles"

const themeLight = createTheme({
	palette: {
	    background: {
	    	default: "#ffffff"
    	}
    }
});

function HomePage(props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("");
    const [dialogMsg, setDialogMsg] = useState("");
    const [isDelete, setIsDelete] = useState(false);
    const [changedPassword, setChangedPassword] = useState("");


    //hardcoded for now, need to change to dynamic later
    const handleDelete = async () => {
        const res = await axios.delete(URL_USER_DELETE_SVC + props.username).catch((err) => {
            if (err.response.status === STATUS_CODE_DATABASE_ERROR) {
                setErrorDialog("Server error, Please try again later.");
            } else {
                setErrorDialog("Please try again later.");
            }
        });

        if (res && res.status === STATUS_CODE_SUCCESS) {
            setSuccessDialog("Account successfully deleted");
            setIsDelete(true);
        }
    };

    //hardcoded for now, need to change to dynamic later
    const handleChangePassword = async () => {
        const res = await axios
            .put(URL_USER_EDITPASSWORD_SVC, {
                username: props.username,
                password: changedPassword,
            })
            .catch((err) => {
                if (err.response.status === STATUS_CODE_DATABASE_ERROR) {
                    setErrorDialog("Server error, Please try again later.");
                } else {
                    setErrorDialog("Please try again later.");
                }
            });
        if (res && res.status === STATUS_CODE_SUCCESS) {
            setSuccessDialog("Password successfully changed");
        }
    };

    const passwordHandler = (e) => {
		var userNamePassword = props.username + e.target.value
        var md5Hash = require("md5-hash")
        var saltedPassword = md5Hash.default(userNamePassword)
		props.setPassword(saltedPassword)
		setChangedPassword(saltedPassword)
	}

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

    const openPeerPrepRoomHandler = () => {
        window.location.href = 'http://localhost:8001/index.html'
    }

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
                        // onSubmit={handleLogin}
                        noValidate
                        sx={{
                            marginTop: 2,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={openPeerPrepRoomHandler}
                        >
                            Start PeerPrep !
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={handleDelete}
                            href="/login"
                        >
                            Delete Account
                        </Button>
                        <TextField
                            fullWidth
                            autoFocus
                            label="New Password"
                            variant="standard"
                            type="password"
                            onChange={passwordHandler}
                        />
                        <Button onClick={handleChangePassword}>Change Password</Button>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            href="/login"
                        >
                            Logout
                        </Button>
                        <div style={{width:"400px"}}></div>
                    </Box>
                    </Box>
                </Container>
            </ThemeProvider>
        </div>
    );
}

export default HomePage;