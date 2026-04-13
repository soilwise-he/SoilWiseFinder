import { ThemeProvider } from '@mui/material';

import 'src/style/resourceStyle.css';
import muiTheme from 'src/style/theme';
import GlobalStyle from 'src/style/globalStyle';
import { StoreProvider } from 'src/context/store';

function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css?family=Inter:400,500,700&amp;display=swap"
                ></link>
            </head>
            <body>
                {' '}
                <ThemeProvider theme={muiTheme}>
                    <GlobalStyle />

                    <StoreProvider>{children}</StoreProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}

export default RootLayout;
