'use client';

import { ThemeProvider } from '@mui/material';

import muiTheme from 'src/style/theme';
import { StoreProvider } from 'src/context/store';
import GlobalStyle from 'src/style/globalStyle';

function MainLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css?family=Archivo:400,500,700&amp;display=swap"
                ></link>
            </head>
            <body>
                <ThemeProvider theme={muiTheme}>
                    <GlobalStyle standalone={true} />
                    <StoreProvider>{children}</StoreProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}

export default MainLayout;
