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
        <Container component="main" width="200px" maxWidth="xs">
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    background: 'black',
                    color: 'white',
                    overflow: 'auto'
                }}
            >
                <Typography component="h1" variant="h5">
                    Question/n
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
                    height="85vh"
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
