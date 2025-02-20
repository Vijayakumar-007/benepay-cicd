import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import {ButtonPrimarySm, ButtonSecondarySm} from "./buttons/form-button";
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

const ConfirmDialog = (props) => {
    const {title, children, open, setOpen, onConfirm, maxWidth, dialogPadding , isDeviceMobile} = props;
    return (
        <Dialog
            open={open}
            maxWidth={maxWidth || 'sm'}
            aria-labelledby="confirm-dialog"
           
        >
            <DialogContent  style={{padding: (isDeviceMobile ? '10px' : '20px')}}>
                <div >
                    <div className="col-md-1 mr-4 px-0">
                    </div>
                    <div  style={{fontSize: "12px", padding: dialogPadding !== 0 ? (isDeviceMobile ? '5px' : '20px') : 0}}>{children}</div>
                </div>
            </DialogContent>
           
        </Dialog>
    );
};
export default ConfirmDialog;
