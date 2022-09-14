import { useState } from "react";
import { useNavigate } from "react-router-dom"
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
    SliderMarkLabel,
    TextField,
    Typography,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import {URL_USER_FINDUSER_SVC} from "../configs";
import {STATUS_CODE_SUCCESS} from "../constants";

function Copyright(props) {
  	return (
    	<Typography
      		variant="body2"
      		color="text.secondary"
      		align="center"
      		{...props}
    	>
    		{"Copyright © "}
			<Link
				color="inherit"
				href="https://github.com/CS3219-AY2223S1/cs3219-project-ay2223s1-g51"
			>
			Peerprep-G51
			</Link>
			{" "}{new Date().getFullYear()}{"."}
    	</Typography>
  	);
}

const themeLight = createTheme({
	palette: {
	  	background: {
			default: "#ffffff"
	 	}
	}
});

export default function Login() {
	const navigate = useNavigate();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [dialogTitle, setDialogTitle] = useState("")
    const [dialogMsg, setDialogMsg] = useState("")
	
	const handleLogin = async (event) => {
		event.preventDefault()
        const res = await axios.post(URL_USER_FINDUSER_SVC, { username, password })
			.catch((err) => {
				console.log(err)
				setErrorDialog('Wrong username or password. Please try again.')
            })

        if (res && res.status === STATUS_CODE_SUCCESS) {
			navigate("/home", { replace: true })
        }
    }

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
						PeerPrep Log in
					</Typography>
					<Box
						component="form"
						onSubmit={handleLogin}
						noValidate
						sx={{ mt: 1 }}
					>
						<TextField
							margin="normal"
							required
							fullWidth
							id="username"
							label="Username"
							name="username"
							autoComplete="username"
							value={username}
							autoFocus
							onChange={(e) => setUsername(e.target.value)}
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							value={password} 
							autoComplete="current-password"
							onChange={(e) => setPassword(e.target.value)}
						/>
						<FormControlLabel
							control={<Checkbox value="remember" color="primary" />}
							label="Remember me"
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
							onClick={handleLogin}
						>
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

				<Dialog
					open={isDialogOpen}
					onClose={closeDialog}
				>
					<DialogTitle>{dialogTitle}</DialogTitle>
					<DialogContent>
						<DialogContentText>{dialogMsg}</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={closeDialog}>OK</Button>
					</DialogActions>
				</Dialog>

				<Copyright sx={{ mt: 8, mb: 4 }} />
			</Container>
		</ThemeProvider>
	);
}
