import React from "react";
import { Typography } from "@material-ui/core";

export function ErrorAlert(props) {

    return (
        <>
            {!_.isEmpty(props.errors) ?
                <Typography style={props.style}>
                    {(!_.isEmpty(props.errors)) && 
                    <ul className={'error-msg'} style={{ listStyle: "none", padding: 0 }}>
                        {props.errors.map((e, index) => <li className="error text-danger" key={index}>* {e}</li>)}
                    </ul>}
                </Typography>
            :''}
        </>
    );
}