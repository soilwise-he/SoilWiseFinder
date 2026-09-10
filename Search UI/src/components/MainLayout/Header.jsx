import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Link, Paper } from '@mui/material';

import { paths } from 'src/services/settings';
import { store } from 'src/context/store';

const MenuItems = styled.div`
    display: flex;
    gap: var(--mui-spacing-1);
`;

const MenuLink = styled.a`
    font-size: 1rem;
    color: white;
    text-decoration: none;
    text-transform: uppercase;
`;

const Header = () => {
    const { environment } = store();
    const [showCatalogueHome, setShowCatalogueHome] = useState(null);

    useEffect(() => {
        if (!environment) return;

        setShowCatalogueHome(environment.NEXT_PUBLIC_SHOW_MENU !== 'false');
    }, [environment]);

    return (
        <Paper variant="header">
            <Link
                href="https://soilwise-he.eu/"
                variant="image"
                target="_blank"
            >
                <img src="/images/soilwise-white-logo.png" />
            </Link>
            <MenuItems>
                {showCatalogueHome && (
                    <MenuLink
                        href={paths.catalogueHome}
                        variant="image"
                    >
                        home
                    </MenuLink>
                )}
                <MenuLink href={paths.catalogueSearch}>search</MenuLink>
            </MenuItems>
        </Paper>
    );
};

export default Header;
