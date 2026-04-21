'use client';

import { Container, Paper } from '@mui/material';
import Script from 'next/script';
import { ThemeProvider } from '@mui/material';

import muiTheme from 'src/style/theme';
import GlobalStyle from 'src/style/globalStyle';
import { StoreProvider } from 'src/context/store';
import 'src/style/resourceStyle.css';
import Header from 'src/components/MainLayout/Header';
import Footer from 'src/components/MainLayout/Footer';

function MainLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css?family=Inter:400,500,700&amp;display=swap"
                ></link>
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css?family=Roboto:400,500,700&amp;display=swap"
                ></link>
                <Script
                    id="hotjar"
                    strategy="afterInteractive"
                >
                    {`
                        (function(h,o,t,j,a,r){
                        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                        h._hjSettings={hjid:6687679,hjsv:6};
                        a=o.getElementsByTagName('head')[0];
                        r=o.createElement('script');r.async=1;
                        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                        a.appendChild(r);
                        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
                    `}
                </Script>
            </head>
            <body>
                <ThemeProvider theme={muiTheme}>
                    <GlobalStyle />

                    <StoreProvider>
                        <Paper variant="main">
                            <Header />
                            <Container variant="content">{children}</Container>
                            <Footer />
                        </Paper>
                    </StoreProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}

export default MainLayout;
