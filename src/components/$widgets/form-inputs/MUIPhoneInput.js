import React, { useState } from "react";
import FVS from "../../../service/core/validate.service";
import MuiPhoneNumber from "material-ui-phone-number";

/**
 * Wrapper component for the exisiting material phone number component
 * MUI mobile input field component
 * with the validation of the mobile number while user change
 * 
 * @author Muthukumaran
 * 
 * @param {*} props 
 * @returns 
 */
export default function MUIPhoneInput(props) {
    const [errors, setErrors] = useState([]);
    const { rules } = props;

    return (
        <>
            <MuiPhoneNumber
                {...props}
                variant= {props.localVariant ? props.localVariant : "outlined"}
                InputProps={{
                    disableUnderline: props.localUnderline == false ? props.localUnderline : true 
                  }}
                size="small"
                onChange={async (e, v) => {
                    setErrors([]);

                    if (typeof props.onChange == "function") {
                        await props.onChange(e, v);
                    }

                    // remove contry code to check mobile number non-empty
                    // var mobileNo = e.replace( "+" + v.dialCode, "" );

                    // if (mobileNo) {
                    //     const { errors } = await FVS.validate(rules, e);
                        
                    //     setErrors(errors);
                    // }
                }}
                onBlur={async (e) => {
                    e.persist();

                    if (typeof props.onBlur == "function") {
                        await props.onBlur(e);
                    }
                }}
            />
            
            {!_.isEmpty(errors) && <ul className={'error-msg'} style={{ listStyle: "none", padding: 0 }}>
                {errors.map((e, index) => <li className="error text-danger" key={index}>* {e}</li>)}
            </ul>}

            {(_.isEmpty(errors) && !_.isEmpty(props.errors)) && <ul className={'error-msg'} style={{ listStyle: "none", padding: 0 }}>
                {props.errors.map((e, index) => <li className="error text-danger" key={index}>* {e}</li>)}
            </ul>}
        </>
    );
}