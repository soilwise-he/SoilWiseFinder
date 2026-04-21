'use client';

import { css, Global } from '@emotion/react';

const GlobalStyle = ({ standalone }) => {
    return (
        <Global
            styles={css`
                body {
                    ${standalone ? '' : 'background-color: #f8f7fa'};
                    color: #333;
                    font-family:
                        ${standalone ? 'Archivo' : 'Inter'}, sans-serif;
                    font-size: ${standalone ? '18px' : '14px'};
                    font-weight: 500;
                    margin: 0;
                    ${standalone ? 'width: fit-content' : ''};
                }

                div {
                    color: #333;
                }

                h1 {
                    font-size: 28px;
                    font-weight: 600;
                    line-height: 36px;
                    margin-bottom: 1.5em;
                    text-align: left;
                    color: #557237;
                }

                h2 {
                    font-size: 20px;
                    font-weight: 600;
                    line-height: 26px;
                    margin-bottom: 0.5em;
                    text-align: left;
                    color: #523627;
                }

                p {
                    font-size: 14px;
                    font-weight: 500;
                    line-height: 20px;
                    text-align: left;
                }

                a {
                    text-decoration: none;
                    color: #713824;

                    &:hover {
                        color: #557237;
                    }
                }

                .ol-map {
                    width: 100%;
                    height: 100%;
                    position: relative;

                    &.simple {
                        max-width: 100px;
                    }

                    .ol-viewport {
                        position: absolute !important;
                        border-radius: var(--mui-shape-borderRadius-0);

                        .search {
                            bottom: 150px;
                        }
                    }
                }

                .ol-dragbox {
                    background-color: rgba(255, 255, 255, 0.4) !important;
                    border: 2px solid var(--mui-palette-primary-main) !important;
                    z-index: 9999 !important;
                }

                .ol-zoom,
                .max-zoom {
                    position: relative;
                    float: right;

                    button {
                        font-size: 1.2rem;
                        border: none;
                        padding: 3px;
                        display: block;
                        width: 28px;
                        height: 28px;
                        border-radius: var(--mui-shape-borderRadius-0);
                        border: 1px solid var(--mui-palette-grey-300);
                        background: white;
                        box-sizing: border-box;
                        cursor: pointer;
                        text-align: center;

                        &:hover {
                            background-color: var(--mui-palette-primary-main);
                            color: white;
                        }
                    }
                }

                .ol-zoom {
                    top: 12px;
                    right: 12px;

                    button {
                        &:not(:last-child) {
                            border-bottom-left-radius: 0;
                            border-bottom-right-radius: 0;
                            border-bottom: none;
                        }

                        &:not(:first-child) {
                            border-top: none;
                            border-top-left-radius: 0;
                            border-top-right-radius: 0;
                            position: relative;
                            height: 31px;
                            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjePDgwX8ACOQDoNsk0PMAAAAASUVORK5CYII=);
                            background-position: 4px top;
                            background-repeat: no-repeat;
                            background-size: 20px 1px;
                        }

                        &:focus {
                            outline: none;
                        }
                    }
                }
                .max-zoom {
                    top: 70px;
                    right: -16px;
                }
                .max-zoom-label {
                    background-repeat: no-repeat;
                    background-size: contain;
                    width: calc(100% - 4px);
                    height: calc(100% - 4px);
                    margin: 2px;
                    display: block;
                    background-image: url(/images/icons/refresh-extent-black.png);
                }
                button:hover .max-zoom-label {
                    background-image: url(/images/icons/refresh-extent-white.png);
                }
            `}
        />
    );
};

export default GlobalStyle;
