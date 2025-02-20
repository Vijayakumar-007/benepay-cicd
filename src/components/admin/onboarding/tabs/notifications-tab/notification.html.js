import React from "react";
import { withStyles } from "@material-ui/styles";
import {InputLabel, Typography, Grid} from '@material-ui/core';
import AlertDialog from "components/$widgets/alertDialog";
import Loader from "components/$widgets/loader";

//Form Component
import Notification from './form/form';

export function html() {

    const {
        ntnForms,
        ntnDatas,
        openBDdeletepopup,
        flagForClearValues,
        loading,
        fetchNtnloading,
    } = this.state;

    const BootstrapLabel = withStyles((theme) => ({
        root: {
            fontSize: '20px !important',
            color: '#474747 !important',
            fontWeight: '450 !important'
        },
    }))(InputLabel);

    return (
        <>
            <Loader loading={loading || fetchNtnloading}/>
            <Grid container spacing={5} marginBottom={1}>
                {
                    ntnForms.map((v, i) => {
                        return (
                            <Grid item xs={6} >
                                <Notification
                                    title={v.title}
                                    id={v.id}
                                    merchant={v.nm}
                                    ntnDatas={ntnDatas}
                                    resetFlags={this.resetFlags}
                                    prepareAPIResponse={this.prepareAPIResponse}
                                    setNtnExistingValues={this.setNtnExistingValues}
                                    flagForClearValues={flagForClearValues}
                                />
                            </Grid>
                        )
                    })
                }

                <AlertDialog
                    open={openBDdeletepopup}
                    cancelBtnLabel="Cancel"
                    confirmBtnLabel="Confirm"
                    confirmOnClick={this.deleteND}
                    cancelOnClick={() => this.setState({ openBDdeletepopup: false })}
                    cancelBtnDisabled = {loading}
                    confirmBtnDisabled = {loading}
                >
                    <Grid container style={{ width: '400px' }}>
                        <Grid item sx={12}>
                            <Typography style={{ color: 'black', fontSize: '20px', fontWeight: 'normal' }} noWrap>Are you sure you want to delete?</Typography>
                        </Grid>
                    </Grid>
                </AlertDialog>
            </Grid>
        </>
    );
}


