import { AppBar, Toolbar, IconButton, Typography, Stack, Button } from "@mui/material";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React, { useEffect, useState } from "react";

const NavBar = (props) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("");
    const [dialogMsg, setDialogMsg] = useState("");
    const [isRefresh, setIsRefresh] = useState(false);
    
    const closeDialog = () => setIsDialogOpen(false);

    const setLogoutDialog = (msg) => {
        setIsDialogOpen(true);
        setDialogTitle('Logout');
        setDialogMsg(msg);
    }

    const logoutHandler = () => {
        setLogoutDialog("Are you sure you want to logout?");
    }

    useEffect(() => {
        
    }, [isRefresh]);

    return (
        <AppBar position='static'>
            <Toolbar>
                <IconButton size='large' edge= 'start' color='inherit' aria-label='logo'>
                    
                </IconButton>
                <Typography variant='h6' component='div' sx={{ flexGrow: 1}}>
                    PEERPREP
                </Typography>
                <Stack direction='row' spacing={2}>
                    {window.location.pathname != "/login" && window.location.pathname != "/signup" && 
                        <Button color='inherit' href="/home">Home</Button>
                    }
                    {window.location.pathname != "/login" && window.location.pathname != "/signup" && 
                        <Button color='inherit' href="/profile">Profile</Button>
                    }
                    {window.location.pathname != "/login" && window.location.pathname != "/signup" && 
                       <Button color='inherit' onClick={logoutHandler}>Logout</Button>
                    }
                </Stack>
            </Toolbar>
            <Dialog
                open={isDialogOpen}
                onClose={closeDialog}
            >
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{dialogMsg}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button href="/login">Log out</Button>
                    <Button onClick={closeDialog}>cancel</Button>
                </DialogActions>
            </Dialog>
        </AppBar>
    )
}

export default NavBar;