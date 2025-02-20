import React from "react";
// import { Typography, CardContent, Card, Stack, Grid, Box } from "@mui/material";
import { Typography, CardContent, Card, Stack, Grid, Box } from "@material-ui/core";
import { InputLabel } from '@material-ui/core';
import AlertDialog from "components/$widgets/alertDialog";
import Loader from "components/$widgets/loader";
import FancyFileInput from "components/$widgets/form-inputs/fancy-file-input";

//Icon
import {
    faCloudArrowUp
} from "@fortawesome/free-solid-svg-icons";

export function html() {
    const { selectedFile, imagePreview, openLogodeletepopup, loading } = this.state;

    return (
        <div className={'-main'}>
            <Loader loading={loading}/>
            <Card>
                <CardContent >
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1 }}>

                        <div style={{ flex: 1, marginRight: '20px' }}>

                            {imagePreview && <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', marginBottom: '1rem', height: '20rem', width: '20rem ' }} />}
                            {!selectedFile && (
                                <FancyFileInput onDropFile ={this.handleFileChange} icon={faCloudArrowUp}>
                                    <p style={{ fontSize: "var(--font-small)", marginBottom: '4px', color: 'var(--prime-color)' }}>
                                        Click or Drag & Drop your logo here
                                    </p>
                                    <p style={{ fontSize: "var(--font-small)", color: 'var(--prime-color)' }}>
                                        *Logo should be in jpeg, jpg, heic, heif, png formats.
                                    </p>
                                </FancyFileInput>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <AlertDialog
                open={openLogodeletepopup}
                cancelBtnLabel="Cancel"
                confirmBtnLabel="Confirm"
                confirmOnClick={this.handleDeleteLogo}
                cancelOnClick={() => this.setState({ openLogodeletepopup: false })}
                cancelBtnDisabled = {loading}
                confirmBtnDisabled = {loading}
            >
                <Grid container style={{ width: '400px' }}>
                    <Grid item sx={12}>
                        <Typography style={{ color: 'black', fontSize: '20px', fontWeight: 'normal' }} noWrap>Are you sure you want to delete?</Typography>
                    </Grid>
                </Grid>
            </AlertDialog>
        </div>
    );
}
