import React from 'react';
import { Backdrop, CircularProgress } from "@material-ui/core";

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }));
  
export default function Loader(props){
    const classes = useStyles();

    return (
        <>
            {props.loading && (
                <div>
                    <Backdrop className={classes.backdrop} open={true}>
                        <CircularProgress color="inherit" />
                    </Backdrop>
                </div>
            )}
        </>
    );
};