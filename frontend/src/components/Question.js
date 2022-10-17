import {
    Box,
    Button,
    Container,
    CssBaseline,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export default function Question(props) {
    return (
        <Container component="main">
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    backgroundColor: '#1e1e1e',
                    color: 'white',
                    overflow: 'auto',
                    width: '500px'
                }}
            >
                <Typography component="h1" variant="h5">
                    Question
                    1. Two sum
                </Typography>
                <Box
                    noValidate
                    sx={{
                        marginTop: 2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}
                    height="70vh"
                >
                    <div style={{}}>
                        <Button variant="contained" sx={{ mt: 3, mb: 2 }} href="/selectroom">
                            Next
                        </Button>
                        {" "}
                        <Button variant="contained" sx={{ mt: 3, mb: 2 }} href="/selectroom">
                            Prev
                        </Button>
                    </div>
                    <div style={{ width: "400px" }}></div>
                </Box>
            </Box>
        </Container>
    );
}
