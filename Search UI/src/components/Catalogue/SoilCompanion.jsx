'use client';

import { useState } from 'react';
import styled from '@emotion/styled';
import { Button, IconButton, TextField } from '@mui/material';
import { Clear } from '@mui/icons-material';

const QuestionBox = styled.div`
    width: calc(100% - 2px);
    border-radius: 100px;
    border: 1px solid var(--mui-palette-secondary-main);
    background-color: white;
    height: 54px;
    display: flex;
    align-items: stretch;
    margin-bottom: var(--mui-spacing-0);

    & .MuiInputBase-formControl {
        margin: auto;
    }

    .MuiInput-input {
        font-size: 18px !important;
    }

    @media only screen and (max-width: 600px) {
        .MuiInput-input {
            font-size: 14px !important;
        }
    }
`;
const CompanionIcon = styled.img`
    width: 45px;
    margin: auto 10px auto 12px;
    color: var(--mui-palette-secondary-main);

    @media only screen and (max-width: 600px) {
        margin: auto 5px auto 14px;
    }
`;
const SendButton = styled(Button)`
    min-width: 140px;
`;

const SoilCompanion = () => {
    const [question, setQuestion] = useState('');

    const handleKeyDown = event => {
        if (event.code === 'Enter') {
            if (event.target.tagName === 'INPUT') {
                handleSubmit();
            }
        }
    };

    const handleSubmit = () => {
        let url = 'https://soil-companion.containers.wur.nl/app/index.html';

        if (question != '') url += '?question=' + question;

        globalThis.open(encodeURI(url), '_blank');
    };

    return (
        <QuestionBox>
            <CompanionIcon
                alt="Soil companion"
                src="/images/soilwise-soil-companion-icon.png"
            />
            <TextField
                variant="standard"
                placeholder="Ask SoilWise Companion"
                fullWidth
                slotProps={{
                    input: {
                        disableUnderline: true,
                        style: { fontSize: '18px' }
                    }
                }}
                onChange={event => setQuestion(event.target.value)}
                onKeyDown={handleKeyDown}
                value={question}
                id="search-text"
            />
            {question !== '' && (
                <IconButton
                    color="secondary"
                    onClick={() => setQuestion('')}
                >
                    <Clear />
                </IconButton>
            )}
            <SendButton
                color="primary"
                variant="contained"
                onClick={handleSubmit}
                label="Send"
            >
                send
            </SendButton>
        </QuestionBox>
    );
};

export default SoilCompanion;
