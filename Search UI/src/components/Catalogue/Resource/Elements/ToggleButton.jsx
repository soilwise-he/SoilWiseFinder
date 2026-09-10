'use client';

import { useEffect, useState } from 'react';

const ToggleButton = ({ className }) => {
    const [isJavascriptEnabled, setIsJavascriptEnabled] = useState(false);
    const [label, setLabel] = useState('Show more');

    useEffect(() => {
        setIsJavascriptEnabled(true);
    }, []);

    const handleToggle = () => {
        Array.from(document.getElementsByClassName(className)).forEach(
            element => {
                element.classList.toggle('collapsed');
            }
        );
        setLabel(previous =>
            previous === 'Show more' ? 'Show less' : 'Show more'
        );
    };

    return (
        isJavascriptEnabled && (
            <button
                onClick={handleToggle}
                className={className + ' toggle-collapse collapsed'}
            >
                {label}
            </button>
        )
    );
};

export default ToggleButton;
