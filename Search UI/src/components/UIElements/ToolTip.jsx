'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const Tooltip = dynamic(() => import('@mui/material/Tooltip'), { ssr: false });

const ToolTip = ({ title, children, ...props }) => {
    const [open, setOpen] = useState(false);

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

export default ToolTip;
