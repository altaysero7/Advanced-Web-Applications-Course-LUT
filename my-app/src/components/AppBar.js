// Referencing week 11 lecture slides and source code
// Referencing https://react.i18next.com/latest/using-with-hook
// Referencing https://mui.com/material-ui/react-app-bar/
// Referencing https://mui.com/material-ui/guides/routing/#button

import React, { Suspense } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function ButtonAppBar() {
    const { t, i18n } = useTranslation();
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Button component={Link} to="/" color="inherit">{t("Home")}</Button>
                    <Button component={Link} to="/about" color="inherit">{t("About")}</Button>
                    <Box sx={{ flexGrow: 1 }}></Box> {/* This Box pushes the following elements to the right side of the toolbar */}
                    <Button onClick={() => changeLanguage("fi")} color="inherit" id="fi">FI</Button>
                    <Button onClick={() => changeLanguage("en")} color="inherit" id="en">EN</Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

// i18n translations might still be loaded by the http backend
// using react's Suspense
export default function App() {
    return (
        <Suspense fallback="loading">
            <ButtonAppBar />
        </Suspense>
    );
}