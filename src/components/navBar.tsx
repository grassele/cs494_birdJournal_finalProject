'use client';
import {
    AppBar,
    Box,
    Toolbar,
    Container,
    Button,
    ClickAwayListener,
    Grow,
    MenuItem,
    MenuList,
    Paper,
    Popper,
} from "@mui/material";

import Link from 'next/link';
import { googleSignIn, logOut, useUserContext } from "@/context/userContext";
import { useEffect, useState } from "react";
import React from "react";


export default function NavBar() {

    const user = useUserContext();
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const anchorRef = React.useRef<HTMLButtonElement>(null);

    useEffect(() => {
        setMenuOpen(false);
    }, [])

    return (
        <header>
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'left' }}>
                                <Link href='/' passHref>
                                    <Button sx={{ my: 2, color: 'white', display: 'block' }}>
                                        My Birds
                                    </Button>
                                </Link>
                                <Link href='/checklist' passHref>
                                    <Button sx={{ my: 2, color: 'white', display: 'block' }}>
                                        Checklist
                                    </Button>
                                </Link>
                                <Link href='/explore' passHref>
                                    <Button sx={{ my: 2, color: 'white', display: 'block' }}>
                                        Explore
                                    </Button>
                                </Link>
                            </Box>
                            {user
                                ?
                                <Container style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                                    <Button
                                        ref={anchorRef}
                                        id="composition-button"
                                        aria-controls={menuOpen ? 'composition-menu' : undefined}
                                        aria-expanded={menuOpen ? 'true' : undefined}
                                        aria-haspopup="true"
                                        onClick={() => setMenuOpen(!menuOpen)}
                                    >
                                        <img style={{ borderRadius: '50%', width: 50, height: 50 }} src={user.photoURL!} />
                                    </Button>
                                    <Popper
                                        open={menuOpen}
                                        anchorEl={anchorRef.current}
                                        role={undefined}
                                        placement="bottom-start"
                                        transition
                                        disablePortal
                                    >
                                        {({ TransitionProps, placement }) => (
                                            <Grow
                                                {...TransitionProps}
                                                style={{
                                                    transformOrigin:
                                                        placement === 'bottom-start' ? 'left top' : 'left bottom',
                                                }}
                                            >
                                                <Paper>
                                                    <ClickAwayListener onClickAway={() => setMenuOpen(false)}>
                                                        <MenuList
                                                            autoFocusItem={menuOpen}
                                                            id="composition-menu"
                                                            aria-labelledby="composition-button"
                                                        >
                                                            <MenuItem onClick={logOut}>Logout</MenuItem>
                                                        </MenuList>
                                                    </ClickAwayListener>
                                                </Paper>
                                            </Grow>
                                        )}
                                    </Popper>
                                </Container>
                                :
                                <Button onClick={googleSignIn} sx={{ my: 2, color: 'white', display: 'block' }}>
                                    Login
                                </Button>}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </header>
    )
}