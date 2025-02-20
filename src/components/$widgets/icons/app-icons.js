import React from 'react';
import {withStyles} from "@material-ui/core";
import HelpIcon from "@material-ui/icons/Help";
import VideocamIcon from '@material-ui/icons/Videocam';
import {colors} from "../../../assets/js/colors";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import PaymentIcon from '@material-ui/icons/Payment';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

function VideoIcon() {
    return <VideocamIcon style={{
        width: "32px",
        height: "32px",
        padding: "6px",
        borderRadius: '50%',
        color: "white",
        marginRight: "10px",
        background: colors["$color-blue"]
    }}
    />
}

const AppHelpIcon = withStyles({
    root: {
        position: 'absolute',
        right: '10px',
        top: '18px',
        color: colors["$color-blue"],
        fontSize: '1.6rem'
    }
})(HelpIcon);

const arrowStyles = {
    root: {
        color: colors["$color-blue"],
        fontSize: '2.0rem'
    }
}
const AppDownArrow = withStyles({
    ...arrowStyles
})(KeyboardArrowDownIcon);

const AppUpArrow = withStyles({
    ...arrowStyles
})(KeyboardArrowUpIcon);

const AppMenuIcon = withStyles({
    root: {
        color: colors["$color-black"],
        fontSize: '2.0rem'
    }
})(MenuIcon);

const AppAccountIcon = withStyles({
    root: {
        color: '#000',
        fontSize: '2.0rem'
    }
})(AccountCircleIcon);

const AppPaymentIcon = withStyles({
    root: {
        color: colors["$color-blue"],
        fontSize: '2.0rem'
    }
})(PaymentIcon);

const AppExitIcon = withStyles({
    root: {
        color: colors["$color-blue"],
        fontSize: '2.0rem'
    }
})(ExitToAppIcon);

export {
    VideoIcon,
    AppHelpIcon,
    AppDownArrow,
    AppUpArrow,
    AppMenuIcon,
    AppAccountIcon,
    AppPaymentIcon,
    AppExitIcon
};
