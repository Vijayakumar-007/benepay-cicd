import React from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import {withStyles} from "@material-ui/core";
import {font} from "../../../assets/js/dimensions";
import {colors} from "../../../assets/js/colors";
import {AppTextField} from "./index";

const AutoCompleteWithStyles = withStyles({
    root: {
        '& > .MuiFormLabel-root': {
            fontSize: `${font.$smaller} !important`,
            color: `${colors["$color-black"]}`
        },
        '& > .Mui-focused.MuiInputLabel-outlined': {
            // transform: 'translate(14px, 18px) scale(1)'
        },
        '& .MuiOutlinedInput-input.MuiOutlinedInput-input': {
            padding: '17.5px 14px'
        },
        '& .MuiInputBase-root': {
            fontSize: `${font.$smaller} !important`,
        },
        '& .MuiInputBase-input': {
            paddingTop: '12px'
        },
        '& .Mui-disabled.MuiInputBase-input': {
            color: `${colors["$color-black"]}`,
            cursor: "not-allowed"
        }
    },
})(Autocomplete)

export const AppAutocomplete = (props) => {
    return (
        <AutoCompleteWithStyles
            {...props}
            id="auto-highlight"
            autoHighlight
            renderInput={(params) => <AppTextField {...params}/>}
        />
    )
};
