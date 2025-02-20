import React from "react";
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import Grid from "@mui/material/Grid";
// import { Tabs, Tab, FormControl, FormLabel, Switch, MenuItem, Typography } from "@mui/material";
import { Tabs, Tab, FormControl, FormLabel, Switch, MenuItem, Typography ,Grid ,CardContent ,Card } from "@material-ui/core";
import { BootstrapInputOld } from "components/$widgets/form-inputs/BootstrapInputOld";
import { BootstrapLabel } from "components/$widgets/form-inputs/BootstrapLabel";
import AlertDialog from "components/$widgets/alertDialog";
import { withStyles } from '@material-ui/core/styles';
import { Alert ,AlertTitle} from "@material-ui/lab";

export function html() {
    const {
        selectedProvider,
        loading,
        formFields,
        paymentProviders,
        activeProviderEnabled,
        openInactivePopup,
        disableInactivePopupConfirmBtn,
    } = this.state;

    const { } = this.props;

    // set custom color background when disabled
    const getDisabledStyle = () => {
        return { background: activeProviderEnabled ? '' : '#EDEDED' };
    }

    // set field disable based on condition
    const disableField = () => {
        return !activeProviderEnabled;
    }

    const CustomSwitch = withStyles({
        switchBase: {
          color: '#3D70B2', // Customize the color here
          '&$checked': {
            color: '#3D70B2', // Customize the color when checked
          },
          '&$checked + $track': {
            backgroundColor: '#3D70B2', // Customize the track color when checked
          },
        },
        checked: {},
        track: {},
    })(Switch);


    
    return (
        <div>
            {loading && (<div id="semiTransparenDiv"></div>)}

            <Grid container spacing={5} mb={5}>
                <Grid item xs={3}>
                    <Card style={{ boxShadow: '0 0 4px 4px rgba(0, 0, 0, 0.1)' }}>
                        <CardContent>
                            <FormLabel style={{color:'var(--primary-color)'}}>Payment Providers </FormLabel>
                            <Tabs
                                // textColor='primary'
                                style={{color:'#rgba(0, 0, 0, 0.54)'}}
                                indicatorColor="primary"
                                orientation="vertical"
                                variant="scrollable"
                                value={selectedProvider}
                                onChange={this.handleProviderChange}>
                                {paymentProviders.map((provider, index) => (
                                    <Tab
                                        key={provider.paymentProviderId}
                                        value={provider.paymentProviderId}
                                        label={
                                            <Grid container alignItems="center" spacing={1}>
                                                <Grid item>
                                                    <CustomSwitch
                                                        checked={provider.checked ? provider.checked : false} style={{color:"var(--primary-color)"}} 
                                                        onChange={(event) => { this.handleActivateProvider(event, provider.paymentProviderId) }}
                                                    />
                                                </Grid>
                                                <Grid item>{provider.paymentProviderName}</Grid>
                                            </Grid>
                                        }
                                        className={`tabStyle ${selectedProvider === provider.paymentProviderId ? 'selected-tab' : ''}`}
                                    />
                                ))}
                            </Tabs>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={9}>

                    {selectedProvider && (
                        <Card style={{ boxShadow: '0 0 4px 4px rgba(0, 0, 0, 0.1)', height: "100%" }}>
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={12} md={3}>
                                        <BootstrapLabel shrink>Priority Order (1 Highest)</BootstrapLabel>
                                        <FormControl fullWidth>
                                            <BootstrapInputOld
                                                select
                                                disabled={disableField()}
                                                style={getDisabledStyle()}
                                                value={formFields.priority.value}
                                                errors={formFields.priority.errors}
                                                onChange={(e) => {
                                                    this.updateFormField("priority", e.target.value);
                                                    this.changeProvidersPriority(e.target.value, selectedProvider);
                                                }}>
                                                <MenuItem value={0}>Choose Priority</MenuItem>
                                                {paymentProviders.map((i,v) => {
                                                    return <MenuItem value={v+1}> {v+1}</MenuItem>;
                                                })}
                                            </BootstrapInputOld>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={3}>
                                        <BootstrapLabel shrink>Provider Merchant ID</BootstrapLabel>
                                        <FormControl fullWidth>
                                            <BootstrapInputOld
                                                disabled={disableField()}
                                                style={getDisabledStyle()}
                                                value={formFields.providerMerchantId.value}
                                                errors={formFields.providerMerchantId.errors}
                                                onChange={(e) => {
                                                    this.updateFormField("providerMerchantId", e.target.value);
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={3}>
                                        <BootstrapLabel shrink>Skin Code</BootstrapLabel>
                                        <FormControl fullWidth>
                                            <BootstrapInputOld
                                                disabled={disableField()}
                                                style={getDisabledStyle()}
                                                value={formFields.skinCode.value}
                                                errors={formFields.skinCode.errors}
                                                onChange={(e) => {
                                                    this.updateFormField("skinCode", e.target.value);
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={3}>
                                        <BootstrapLabel shrink>Signature Key</BootstrapLabel>
                                        <FormControl fullWidth>
                                            <BootstrapInputOld
                                                disabled={disableField()}
                                                style={getDisabledStyle()}
                                                value={formFields.signKey.value}
                                                errors={formFields.signKey.errors}
                                                onChange={(e) => {
                                                    this.updateFormField("signKey", e.target.value);
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    {/* <Grid item xs={12} sm={12} md={8}>
                                        <BootstrapLabel shrink>Callback URL</BootstrapLabel>
                                        <FormControl fullWidth>
                                            <BootstrapInputOld
                                                disabled={disableField()}
                                                style={getDisabledStyle()}
                                                value={formFields.returnUrl.value}
                                                errors={formFields.returnUrl.errors}
                                                onChange={(e) => {
                                                    this.updateFormField("returnUrl", e.target.value);
                                                }}
                                            />
                                        </FormControl>
                                    </Grid> */}
                                    <Grid item xs={12} sm={12} md={12}>
                                      
                                        <FormControl fullWidth>
                                        <Alert severity="info">
                                            <AlertTitle>Note</AlertTitle>
                                            {this.getProviderMessages(selectedProvider)}
                                        </Alert>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    )}

                </Grid>
            </Grid>

            <AlertDialog
                open={openInactivePopup}
                title="Confirm"
                cancelBtnLabel="Cancel"
                confirmBtnLabel="Confirm"
                confirmOnClick={this.inactivateProvider}
                cancelOnClick={() => this.setState({ openInactivePopup: false })}
                cancelBtnDisabled = {disableInactivePopupConfirmBtn}
                confirmBtnDisabled = {disableInactivePopupConfirmBtn}
            >
                <Grid container style={{ width: '500px' }}>
                    <Grid item sx={12}>
                        <Typography style={{ color: 'black' }}>
                            You are trying to disable the payment provider. It will remove the active payment provider and underlying payment method values. Do you want to continue ?
                        </Typography>
                    </Grid>
                </Grid>
            </AlertDialog>
        </div>
    );
}
