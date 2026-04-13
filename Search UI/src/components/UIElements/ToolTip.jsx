'use client';

import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';

const Tooltip = dynamic(() => import('@mui/material/Tooltip'), { ssr: false });

const ToolTip = ({ title, children, ...props }) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        let timer;

        if (open) {
            timer = setTimeout(() => {
                setOpen(false);
            }, 2000);
        }

        return () => clearTimeout(timer);
    }, [open]);

    return (
        <Tooltip
            title={title}
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            {...props}
        >
            {children}
        </Tooltip>
    );
};

ToolTip.propTypes = {
    title: PropTypes.string
};

export default ToolTip;
