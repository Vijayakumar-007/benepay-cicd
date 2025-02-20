import {Tooltip, withStyles} from "@material-ui/core";
import React from 'react';
import {font} from "../../assets/js/dimensions";
import * as PropTypes from "prop-types";
import {colors} from "../../assets/js/colors";

const defaultStyles = {
    tooltip: {
        fontSize: '0.9rem',
        background: '#fff',
        color: '#000',
        // textTransform: 'capitalize',
        fontFamily: 'Helvetica',
        padding: 12,
        // border: '1px solid #cdcdcd',
        boxShadow: '0 1px 1px rgba(0,0,0,0.15), 0 2px 2px rgba(0,0,0,0.15), 0 4px 4px rgba(0,0,0,0.15), 0 8px 8px rgba(0,0,0,0.15)'
    }
};

const AppTooltipForTextField = withStyles({
    ...defaultStyles
})((props) => <Tooltip
    // leaveDelay={500000}
    placement={'top'}
    style={{marginRight: props.outside ? -56 : 0}}
    arrow={true}
    {...props}
/>);

const AppTooltipForSelect = withStyles({
    ...defaultStyles
})((props) => <AppTooltipForTextField
    style={{marginRight: props.outside ? -56 : 22, marginTop: -11}}
    {...props}
/>);

AppTooltipForTextField.propTypes = {
    outside: PropTypes.any,
};

export {
    AppTooltipForTextField, AppTooltipForSelect
};
