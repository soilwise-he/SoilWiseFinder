import { Close } from '@mui/icons-material';
import { Box, IconButton, Modal as MUIModal } from '@mui/material';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

const StyledModal = styled(Box)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: 80vh;
    background-color: white;
    border: 2px solid var(--mui-palette-secondary-main);
    box-shadow: 24;
    padding: 20px;
    overflow: scroll;

    h1 {
        margin-bottom: 0px;
    }

    button {
        float: right;
    }
    
    &::-webkit-scrollbar {
        width: 0;
        background: transparent;
    }
    &::-webkit-scrollbar-thumb {
        background: #FF0000;
    }
};`;

const Modal = ({ title, open, setOpen, children }) => {
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <MUIModal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <StyledModal>
                <IconButton onClick={handleClose}>
                    <Close />
                </IconButton>
                <h1 id="modal-title">{title}</h1>

                <div id="modal-description">{children}</div>
            </StyledModal>
        </MUIModal>
    );
};

Modal.propTypes = {
    title: PropTypes.string,
    open: PropTypes.bool,
    setOpen: PropTypes.func
};

export default Modal;
