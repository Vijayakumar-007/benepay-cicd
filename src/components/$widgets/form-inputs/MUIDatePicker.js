import React, { useState } from "react";
import { makeStyles } from '@material-ui/core';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const useStyles = makeStyles({
    root: {
        "& .MuiInputBase-root": {
            // border: 'none',
            // borderWidth: '0px',
            // borderBottom: '1px solid red',
            // outline: 'none',
          

            "& .MuiInputBase-input": {
                padding: 9,
            }, 
        }
    },
    
    bgColor: {
        "& .MuiInputBase-root": {
            backgroundColor:'#EDEDED',
        }
    }
});

export default function MUIDatePicker(props) {
    const classes = useStyles();

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    {...props}
                    
                 
                    slotProps={{ textField: { placeholder: props.placeholder, readOnly: props.disableEdit, error:false , variant: props.localVariant ? props.localVariant : "outlined",
                       
                            disableUnderline: props.localUnderline == false ? props.localUnderline : true 
                         

                    } }}
                    className={`${classes.root} ${props.disabled ? classes.bgColor : ''}`}
                />
            </LocalizationProvider>

            {!_.isEmpty(props.errors) && <ul className={'error-msg'} style={{ listStyle: "none", padding:0 }}>
                {props.errors.map((e, index) => <li className="error text-danger" key={index}>* {e}</li>)}
            </ul>}
        </>
    );
}