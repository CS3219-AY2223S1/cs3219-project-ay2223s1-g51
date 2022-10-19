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
import { createTheme, ThemeProvider } from '@mui/material/styles'
import {useState} from "react";
import axios from "axios";
import {URL_USER_SVC} from "../configs";
import {STATUS_CODE_CONFLICT, STATUS_CODE_CREATED, STATUS_CODE_FAIL} from "../constants";

const theme = createTheme();

function SignupPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [dialogTitle, setDialogTitle] = useState("")
    const [dialogMsg, setDialogMsg] = useState("")
    const [isSignupSuccess, setIsSignupSuccess] = useState(false)

    const handleSignup = async () => {
        setIsSignupSuccess(false)
        const res = await axios.post(URL_USER_SVC, { username, password })
            .catch((err) => {
                if (err.response.status === STATUS_CODE_CONFLICT) { //duplicate username detected, Error code: 409
                    setErrorDialog("This username already exists");
                } else if (err.response.status === STATUS_CODE_FAIL) {
                    setErrorDialog("Username format invalid, please use email format");
                } else {
                    setErrorDialog('Please try again later')
                }
            })
        if (res && res.status === STATUS_CODE_CREATED) {
            setSuccessDialog('Account successfully created')
            setIsSignupSuccess(true)
        }
    }

    // Will change to edit password method provided by firebase
    // const passwordHandler = (e) => {
	// 	var userNamePassword = username + e.target.value
    //     var md5Hash = require("md5-hash")
    //     var saltedPassword = md5Hash.default(userNamePassword)
	// 	setPassword(saltedPassword)
	// }

    const closeDialog = () => setIsDialogOpen(false)

    const setSuccessDialog = (msg) => {
        setIsDialogOpen(true)
        setDialogTitle('Success')
        setDialogMsg(msg)
    }

    const setErrorDialog = (msg) => {
        setIsDialogOpen(true)
        setDialogTitle('Error')
        setDialogMsg(msg)
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">Sign Up</Typography>
                    <Box component="form" noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Username"
                            variant="standard"
                            onChange={(e) => setUsername(e.target.value)}
                            sx={{marginBottom: "1rem"}}
                            autoFocus
                            />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Password"
                            variant="standard"
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{marginBottom: "2rem"}}
                            />
                        
                        <Box display={"flex"} flexDirection={"column"} justifyContent={"flex-end"}>
                            <Button 
                                variant="contained" 
                                sx={{ mt: 3, mb: 2 }}
                                onClick={handleSignup}>
                                    Sign up
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link href="/login" variant="body2">
                                        {"Have an account? Log in"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>

                    <Dialog
                        open={isDialogOpen}
                        onClose={closeDialog}
                    >
                        <DialogTitle>{dialogTitle}</DialogTitle>
                        <DialogContent>
                            <DialogContentText>{dialogMsg}</DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            {isSignupSuccess
                                ? <Button href="/login">Log in</Button>
                                : <Button onClick={closeDialog}>Done</Button>
                            }
                        </DialogActions>
                    </Dialog>
                </Box>
            </Container>
        </ThemeProvider>
    )
}

export default SignupPage;
