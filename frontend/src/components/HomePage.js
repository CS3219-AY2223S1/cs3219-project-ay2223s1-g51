import {
    Box,
    Button,
    Container,
    CssBaseline,
    Typography,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles"

const themeLight = createTheme({
	palette: {
	    background: {
	    	default: "#ffffff"
    	}
    }
});

function HomePage(props) {

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
                        Welcome to PeerPrep!
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
                                Start PeerPrep
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