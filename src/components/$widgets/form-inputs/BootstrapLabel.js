/**
 * Common Input Label for the Benepay
 */
import { withStyles } from "@material-ui/styles";
import { InputLabel } from "@material-ui/core";

/** 
 * Boostrap Label designed for global use
 * Component inherited from the MUI Input Label component
 * 
 * @param props 
 * @returns 
 */
export const BootstrapLabel = withStyles((theme) => ({
    root: {
        fontSize: '20px !important',
        color: '#474747 !important',
        fontWeight: '450 !important'
    },
    asterisk: {
        color: '#db3131 !important',
    }
}))(InputLabel);
