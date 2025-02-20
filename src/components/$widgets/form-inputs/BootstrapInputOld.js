import React, { Fragment, useState, useEffect } from "react";
import { TextField } from "@material-ui/core";
import _ from 'lodash';

import FVS from "../../../service/core/validate.service";

/**
 * Common Input for the Benepay
 */

/**
 * Wrapper component for the MUI Textfield component
 * Boostrap Input field design for global use
 * 
 * @param props 
 * @returns 
 */
export function BootstrapInputOld(props) {
    const [errors, setErrors] = useState([]);
    const { rules } = props;

    useEffect(() => {
        setErrors([]);
    }, [props.errors]);

    const handleBlur = async (e) => {
        e.persist();

        const { errors, valid } = await FVS.validate(rules, e.target.value);

        e.errors = errors;
        e.valid = valid;

        setErrors(errors);
    }
    
    return <Fragment>
        <TextField fullWidth
            variant="outlined"
            size="small"
            InputProps={{ disableUnderline: true }}
            {...props}
            onChange={async (e) => {
                setErrors([]);

                if (typeof props.onChange == "function") {
                    await props.onChange(e);
                }
            }}
            onBlur={ async (e) => {
                if (typeof props.onBlur == "function") {
                    await props.onBlur(e);
                } else {
                    await handleBlur(e);
                }
            }}

        />
        
        {!_.isEmpty(errors) && <ul className={'error-msg'} style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {errors.map((e, index) => <li className="error text-danger" key={index}>* {e}</li>)}
        </ul>}

        {(_.isEmpty(errors) && !_.isEmpty(props.errors)) && <ul className={'error-msg'} style={{ listStyle: "none", padding: 0,  margin: 0 }}>
            {props.errors.map((e, index) => <li className="error text-danger" key={index}>* {e}</li>)}
        </ul>}
    </Fragment>
}
