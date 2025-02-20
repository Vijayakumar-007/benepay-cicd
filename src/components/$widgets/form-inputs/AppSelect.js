import {withStyles} from "@material-ui/core";
import {font} from "../../../assets/js/dimensions";
import {colors} from "../../../assets/js/colors";
import React, {useState} from "react";
import {styles} from "./form-input-styles";
import FormControl from "@material-ui/core/FormControl";
import clsx from "clsx";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {AppTooltip, AppTooltipForSelect} from "../tooltip";
import {AppHelpIcon} from "../icons/app-icons";
import {bool, number} from "prop-types";

const FormControlWithStyles = withStyles({
    root: {
        fontSize: `18px !important`,
        height: 44,
        padding: 10,
        // paddingTop: 0,
        border: `2px solid #d2c6c6`
    },
})(FormControl);

const AppMenuItem = withStyles({
    root: {
        fontSize: 14,
        height: '40px',
        // padding: '0 0 0 0'
    }
})(MenuItem);

const SelectWithStyles = withStyles({
    root: {
        padding: '0 0 0 0'
    }
})(Select);

export const AppSelect = (props) => {
    const {options, tooltip, placeholder, className, defaultValue, fullwidth, selectClassName, name, onChange, value, minWidth, label, disabled, displayEmpty} = props;
    const selectProps = {name, onChange, value, disabled, displayEmpty};

    const inputLabel = React.useRef(null);
    const [labelWidth, setLabelWidth] = React.useState(0);
    const [open, setOpen] = useState(false);

    // React.useEffect(() => {
    //     setLabelWidth(inputLabel.current.offsetWidth);
    // }, []);


    const classes = styles();
    return (
        <FormControlWithStyles fullWidth={fullwidth}
                     style={{minWidth: minWidth || '100px'}}
                     className={clsx(classes.noFocus, className)}>
            {label && <InputLabel ref={inputLabel} id="select-outlined-label">
                {label}
            </InputLabel>}
            <SelectWithStyles labelId="select-outlined-label"
                    autoComplete={'off'}
                              className={selectClassName}
                    id="demo-simple-select-outlined"
                    labelWidth={labelWidth}
                              disableUnderline
                    {...selectProps}>
                {placeholder && <AppMenuItem value={defaultValue || ""}>{placeholder}</AppMenuItem>}
                {
                    options.map(option => {
                        return (
                            <AppMenuItem key={option.text + option.value}
                                         value={option.value}>{option.text}</AppMenuItem>
                        )
                    })
                }
            </SelectWithStyles>

            <div className={`${open && 'backdrop'}`} onClick={() => setOpen(!open)}/>

            {tooltip && <AppTooltipForSelect
                open={open}
                outside={props.tooltipoutside ? 1 : 0}
                title={tooltip}>
                <AppHelpIcon onClick={() => {
                    setOpen(!open);
                }}/>
            </AppTooltipForSelect>}
        </FormControlWithStyles>
    )
};
