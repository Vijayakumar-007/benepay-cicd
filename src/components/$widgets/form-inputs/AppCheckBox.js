import React, {Fragment, useState, useEffect} from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { withStyles, makeStyles } from '@material-ui/core/styles';

//Validation services
import FVS from 'service/core/validate.service';
import { List, ListItem } from "@material-ui/core";

const checkBoxStyles = theme => ({
    root: {
        '&$checked': {
            color: 'var(--primary-color)',
        },
    },
    checked: {},
});

const useStyles = makeStyles((theme) => ({
    root: {
        paddingTop:'0px',
        paddingBottom:'0px',
    },
    list:{
        paddingTop:'0px',
        paddingBottom:'0px',
    }
  }));
  

const CustomCheckbox = withStyles(checkBoxStyles)(Checkbox);

export function AppCheckBox(props) {
    const classes = useStyles();
    const [errors, setErrors] = useState([]);
    const { rules } = props;

    useEffect(() => {
        setErrors([]);
    }, [props.errors]);

    const handleBlur = async (e) => {
        e.persist();

        const { errors, valid } = await FVS.validate(rules, e.target.checked);

        e.errors = errors;
        e.valid = valid;

        setErrors(errors);
    }

    return (
        <List className={classes.root}>
            <ListItem className={classes.list}>
                <FormControlLabel
                    control={
                        <CustomCheckbox
                            value={props.value}
                            color={'primary'}
                            checked={props.checked}
                            name={props.name}
                            onClick={async (e) => {
                                setErrors([]);

                                if (typeof props.onClick == "function") {
                                    await props.onClick(e);
                                }
                            }}
                            onBlur={async (e) => {
                                if (typeof props.onBlur == "function") {
                                    await props.onBlur(e);
                                } else {
                                    await handleBlur(e);
                                }
                            }}
                        />
                    }
                    label={props.label}
                />
            </ListItem>
            
            {!_.isEmpty(props.errors) || !_.isEmpty(errors) ? 
                <ListItem className={classes.list}>
                    {!_.isEmpty(errors) && <ul className={'error-msg'} style={{ listStyle: "none", padding: 0 }}>
                        {errors.map((e, index) => <li className="error text-danger" key={index}>* {e}</li>)}
                    </ul>}

                    {(_.isEmpty(errors) && !_.isEmpty(props.errors)) && <ul className={'error-msg'} style={{ listStyle: "none", padding: 0 }}>
                        {props.errors.map((e, index) => <li className="error text-danger" key={index}>* {e}</li>)}
                    </ul>}
                </ListItem>
            :''}
        </List>
    );
}