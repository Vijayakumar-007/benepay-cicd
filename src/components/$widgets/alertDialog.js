import * as React from 'react';

import { DialogTitle, DialogContentText, DialogContent, DialogActions, Dialog, Button } from '@material-ui/core';
import { CircularProgress } from '@material-ui/core';
import { color } from '@amcharts/amcharts4/core';

export default function AlertDialog(props) {

  const styles = {
    confirmBtn:{
      backgroundColor: 'var(--primary-color)',
      color:'white',
      textTransform: 'unset',
    },
    cancelBtn:{
      backgroundColor: "rgb(141 145 148)",
      color:'white',
      textTransform: 'unset'
    },
    loadingCircle:{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white'
    }
  }

  return (
    <React.Fragment>
      <Dialog
        open={props.open}
        maxWidth={props.maxWidth ? props.maxWidth : false}
        keepMounted
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {
          (props.title) ?
            <DialogTitle id="alert-dialog-title">
              {props.title}
            </DialogTitle>
            :
            <></>
        }
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.children}
          </DialogContentText>
        </DialogContent>
        {
          (props.cancelBtnLabel || props.confirmBtnLabel) ?
            <DialogActions sx={{ padding: '15px' }}>
              {props.cancelBtnLabel ?
                <Button
                  variant="contained"
                  disabled={props.cancelBtnDisabled ? props.cancelBtnDisabled : false}
                  style={styles.cancelBtn}
                  onClick={props.cancelOnClick}
                >
                  {props.cancelBtnLabel}
                </Button>
                : ''
              }

              {props.confirmBtnLabel ?
                <Button
                  variant="contained"
                  disabled={props.confirmBtnDisabled ? props.confirmBtnDisabled : false}
                  style={styles.confirmBtn}
                  onClick={props.confirmOnClick}
                >
                  {props.confirmBtnDisabled ?
                    <div style={styles.loadingCircle}>
                      <CircularProgress size={15} color='white' />&ensp;Loading...
                    </div>
                    : props.confirmBtnLabel
                  }
                </Button> : ''
              }
            </DialogActions>
            :
            <></>

        }
      </Dialog>
    </React.Fragment>
  );
}
