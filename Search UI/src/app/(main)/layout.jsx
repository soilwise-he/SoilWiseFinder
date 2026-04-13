'use client';

import { Container, Paper } from '@mui/material';

import 'src/style/resourceStyle.css';
import Header from 'src/components/MainLayout/Header';
import Footer from 'src/components/MainLayout/Footer';

function MainLayout({ children }) {
    return (
        <Paper variant="main">
            <Header />
            <Container variant="content">{children}</Container>
            <Footer />
        </Paper>
    );
}

export default MainLayout;
