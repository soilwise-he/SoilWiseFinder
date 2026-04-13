import { Paper } from '@mui/material';

const Footer = () => {
    return (
        <Paper variant="footer">
            <p>
                Copyright © 2023 - 2027 SoilWise HE. The project receives
                funding from the European Union's HORIZON Innovation Actions
                2022 under grant agreement No. 101112838.
            </p>
            <img src="/images/europeanunion.png" />
        </Paper>
    );
};

export default Footer;
