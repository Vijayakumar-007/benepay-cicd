import {Input, withStyles} from "@material-ui/core";
import {font} from "../../../assets/js/dimensions";
import {colors} from "../../../assets/js/colors";
import TextField from "@material-ui/core/TextField";
import React, {Fragment, useState} from "react";
import FVS from "../../../service/core/form-validator";
import {AppTooltip, AppTooltipForTextField} from "../tooltip";
import {AppHelpIcon} from '../icons/app-icons';
import _ from 'lodash';
import SearchIcon from "@material-ui/icons/Search";

const TextFieldWithStyles = withStyles({
    root: {
        '& > .MuiFormLabel-root': {
            fontSize: `10px !important`,
            color: `${colors["$color-black"]}`
        },
        '& > .Mui-focused.MuiInputLabel-outlined': {
            // transform: 'translate(14px, 18px) scale(1)'
        },
        '& .MuiOutlinedInput-input.MuiOutlinedInput-input': {
            padding: '17.5px 14px'
        },
        '& .MuiInputBase-root': {
            fontSize: `10px !important`,
        },
        '& .MuiInputBase-input': {
            paddingTop: '12px'
        },
        '& .Mui-disabled.MuiInputBase-input': {
            color: `${colors["$color-black"]}`,
            cursor: "not-allowed"
        }
    },
})((props) => <TextField {...props} autoComplete={'off'} spellCheck={false}/>);

export function AppTextFieldOld(props) {
    const [errors, setErrors] = useState([]);
    const [open, setOpen] = useState(false);
    const {validationrules, tooltip, onChange, onBlur, validatefromdb} = props;
    return <Fragment>
        <TextFieldWithStyles fullWidth
                             {...props}
                             onBlur={async (e) => {
                                 const {errors, valid} = await FVS.validateField(validationrules, e, validatefromdb);
                                 e.errors = errors;
                                 e.valid = valid;
                                 setErrors(errors);
                                 if (onBlur) {
                                     onBlur(e);
                                 }
                                 if (onChange) {
                                     onChange(e)
                                 }
                             }}
        />

        {tooltip && <AppTooltipForTextField
            open={open}
            outside={props.tooltipoutside ? 1 : 0}
            title={tooltip}>
            <AppHelpIcon onClick={() => setOpen(!open)}/>
        </AppTooltipForTextField>}

        <div className={`${open && 'backdrop'}`} onClick={() => setOpen(!open)}/>

        {!_.isEmpty(errors) && <ul className={'error-msg'} style={{listStyle: "none"}}>
            {errors.map((e, index) => <li className="error text-danger" key={index}>* {e}</li>)}
        </ul>}
    </Fragment>
}

const SearchFieldWithStyles = withStyles({
    root: {
        '& > .MuiFormLabel-root': {
            fontSize: `15px !important`,
            color: `${colors["$color-black"]}`,
        },
        '& .MuiInputBase-root': {
            fontSize: `15px !important`,
            borderRadius: "50px !important"
        }
    },
})(TextFieldWithStyles);

const AppTextFieldWithStyles = withStyles({
    root: {
        fontSize: `15px !important`,
        height: 44,
        padding: 10,
        // paddingTop: 0,
        border: `2px solid #d2c6c6`,
        // textTransform: 'uppercase'
    },
    input: {
        padding: 0,
        '&:before, &:after': {
            display: 'none !important'
        },
        // textTransform: 'uppercase'


    }
})((props) => (
    <Input {...props} autoComplete={'off'} spellCheck={false}></Input>
))

export function AppTextField(props) {
    const [errors, setErrors] = useState([]);
    const [open, setOpen] = useState(false);
    const {validationrules, tooltip, onChange, onBlur, validatefromdb, value} = props;
    return <Fragment>
        <AppTextFieldWithStyles fullWidth
                                disableUnderline
                             {...props}
                            placeholder={props.label}
                             onBlur={async (e) => {
                                 const {errors, valid} = await FVS.validateField(validationrules, e, validatefromdb);
                                 e.errors = errors;
                                 e.valid = valid;
                                 setErrors(errors);
                                 if (onBlur) {
                                     onBlur(e);
                                 }
                                 if (onChange) {
                                     onChange(e)
                                 }
                             }}
        />

        {tooltip && <AppTooltipForTextField
            open={open}
            outside={props.tooltipoutside ? 1 : 0}
            title={tooltip}>
            <AppHelpIcon style={{top: 10}} onClick={() => setOpen(!open)}/>
        </AppTooltipForTextField>}

        <div className={`${open && 'backdrop'}`} onClick={() => setOpen(!open)}/>

        {!_.isEmpty(errors) && <ul className={'error-msg'} style={{listStyle: "none"}}>
            {errors.map((e, index) => <li className="error text-danger" key={index}>* {e}</li>)}
        </ul>}
    </Fragment>
}

export function AppSearchField(props) {
    const [errors, setErrors] = useState([]);
    const {onChange, onBlur} = props;
    return <Fragment>
        <SearchFieldWithStyles fullWidth
                               {...props}
                               onBlur={async (e) => {
                                   setErrors(errors);
                                   if (onBlur) {
                                       onBlur(e);
                                   }
                                   if (onChange) {
                                       onChange(e)
                                   }
                               }}
        />

        {<SearchIcon style={{
            "position": "absolute",
            "right": "35px",
            "top": "143px"
        }}/>}

        {!_.isEmpty(errors) && <ul className={'error-msg'} style={{listStyle: "none"}}>
            {errors.map((e, index) => <li className="error text-danger" key={index}>* {e}</li>)}
        </ul>}
    </Fragment>
}



