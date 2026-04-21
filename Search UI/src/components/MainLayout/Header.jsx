import styled from '@emotion/styled';
import { Link, Paper } from '@mui/material';

import { paths } from 'src/services/settings';

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
                <MenuLink
                    href={paths.catalogueHome}
                    variant="image"
                >
                    home
                </MenuLink>
                <MenuLink href={paths.catalogueSearch}>search</MenuLink>
            </MenuItems>
        </Paper>
    );
};

export default Header;
