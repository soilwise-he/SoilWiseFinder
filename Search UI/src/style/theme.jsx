'use client';

import { createTheme } from '@mui/material/styles';

const muiTheme = createTheme({
    cssVariables: true,
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 768,
            lg: 1025,
            xl: 1536
        }
    },
    palette: {
        primary: {
            main: '#557237'
        },
        secondary: {
            main: '#523627'
        }
    },
    typography: {
        fontFamily: [
            'Roboto',
            '-apple-system',
            'BlinkMacSystemFont',
            "'Segoe UI'",
            "'Helvetica Neue'",
            'Arial',
            'sans-serif',
            "'Apple Color Emoji'",
            "'Segoe UI Emoji'",
            "'Segoe UI Symbol'"
        ].join(','),
        fontSize: 14
    },
    spacing: [12, 24, 48, 60, 100],
    shape: {
        borderRadius: ['4px', '12px', '20px']
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    variants: [
                        {
                            props: { variant: 'main' },
                            style: {
                                backgroundImage:
                                    'url(/images/soil-pattern.png)',
                                backgroundColor: 'rgba(255,255,255,0.7)',
                                backgroundBlendMode: 'lighten'
                            }
                        },
                        {
                            props: { variant: 'header' },
                            style: {
                                height: '60px',
                                backgroundColor: '#523627',
                                borderRadius: '0px',
                                display: 'flex',
                                gap: '30px',
                                alignItems: 'center',
                                paddingLeft: '30px'
                            }
                        },
                        {
                            props: { variant: 'footer' },
                            style: {
                                height: '140px',
                                background: `top url('/images/soil-footer.png')`,
                                borderRadius: '0px',
                                display: 'flex',
                                gap: '10px',
                                justifyContent: 'center',
                                '& p': {
                                    marginTop: '115px',
                                    fontSize: '0.7rem',
                                    lineHeight: '0.8rem',
                                    color: '#fffa'
                                },
                                '& img': {
                                    marginTop: '112px',
                                    maxWidth: '1rem',
                                    maxHeight: '1rem'
                                }
                            }
                        }
                    ]
                }
            }
        },
        MuiContainer: {
            styleOverrides: {
                root: {
                    maxWidth: '1200px !important',
                    variants: [
                        {
                            props: { variant: 'content' },
                            style: {
                                maxWidth: 'calc(100vw - 30px) !important',
                                minHeight: 'calc(100vh - 220px)',
                                margin: '50px auto',
                                padding: '0px 20px !important',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '20px'
                            }
                        },
                        {
                            props: { variant: 'box' },
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                border: '2px solid #523627',
                                borderRadius: '10px',
                                padding: '15px',
                                width: '100%',
                                alignItems: 'flex-start',
                                backgroundColor: 'white',
                                '& h1': {
                                    marginTop: '0px'
                                }
                            }
                        },
                        {
                            props: { variant: 'column' },
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                padding: '25px',
                                alignItems: 'center'
                            }
                        },
                        {
                            props: { variant: 'row' },
                            style: {
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                padding: '25px',
                                alignItems: 'center'
                            }
                        }
                    ]
                }
            }
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    variants: [
                        {
                            props: { variant: 'image' },
                            style: {
                                '& img': {
                                    margin: '10px',
                                    maxHeight: '30px'
                                }
                            }
                        }
                    ]
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    '&.Mui-focusVisible': {
                        border: `1px solid var(--mui-palette-grey-600)`
                    },
                    variants: [
                        {
                            props: { variant: 'contained' },
                            style: {
                                border: '2px solid var(--mui-palette-secondary-main)',
                                textTransform: 'none',
                                fontSize: '18px',
                                borderRadius: '50px',
                                padding: '10px 50px'
                            }
                        }
                    ]
                }
            }
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    borderRadius: 'var(--mui-shape-borderRadius-0)',
                    fontSize: '12px'
                }
            }
        },
        MuiPopper: {
            styleOverrides: {
                root: {
                    '& .MuiPaper-root': {
                        width: 'fit-content'
                    }
                }
            }
        }
    }
});

export default muiTheme;
