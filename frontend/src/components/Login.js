import { useState } from "react";
import {
    Box,
    Button,
	Checkbox,
    Container,
    CssBaseline,
	FormControlLabel,
    Grid,
    Link,
    TextField,
    Typography,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

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
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	
	const handleLogin = (event) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		console.log({
			username: data.get("username"),
			password: data.get("password"),
		});
		//add login algo here
	};

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
				<Copyright sx={{ mt: 8, mb: 4 }} />
			</Container>
		</ThemeProvider>
	);
}
