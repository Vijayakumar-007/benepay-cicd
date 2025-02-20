import React from "react";

//Mui Components
// import { Box, Grid, Typography, FormGroup, FormControlLabel, InputLabel, FormControl, Checkbox, Card, Stack } from "@mui/material";
import { Box, Grid, Typography, FormGroup, FormControlLabel, FormControl, Checkbox, Card, Stack ,FormHelperText, InputAdornment} from "@material-ui/core";
// import { Autocomplete } from "@mui/material";
import { Autocomplete } from "@material-ui/lab";
import { BootstrapInputOld } from "../../../../$widgets/form-inputs/BootstrapInputOld";
import MUIPhoneInput from "../../../../$widgets/form-inputs/MUIPhoneInput";
import AlertDialog from "components/$widgets/alertDialog";
import Loader from "components/$widgets/loader";
import { BootstrapLabel } from "components/$widgets/form-inputs/BootstrapLabel";
import { AppCheckBox } from "components/$widgets/form-inputs";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { ErrorAlert } from "components/$widgets/messages/error-alert";

//Styles
import "./service-preference.scss";
import { OnboardConstants, manualPay, messages } from "config/constants";
import { style } from "dom-helpers";

export function html() {

    const {
        keyCurrencies,
        withoutKeyCurrenciesList,
        keyCurrenciesList,
        otherCurrencies,
        invoicesSubscription,
        autoGenerateUnpaidInvoice,
        autoGeneratePaidInvoice,
        allCurrency,
        loading,
        formFields,
        openBDdeletepopup,
        onlinePaymentSubcription,
        transactionCreationMode,
        merchantEncKey,
        showEncKey,
        openTxnModeValidationPopup,
        openTxnModeDisablePopup,
        AlertMsg,
        loaderForTxnModeInactiveProcess,
        fetchSPloading,
        merchantTimeZone,
        seamlessPayment
    } = this.state;

    const { } = this.props;

    return (
        <Box component="div">
            <Loader loading={loading || fetchSPloading} />
            <Grid container>
                <Grid item xs={12}>
                    <Typography variant="body1" fontWeight={500} style={{ color: 'rgb(13, 90, 183)' }}>
                        Preferences
                    </Typography>
                </Grid>
                <Grid item xs={12} style={{ marginTop: "1" }}>
                    <Box style={{ display: "flex" }}>
                        <Grid container>
                            <Grid item xl={2} lg={2} md={3} sm={12} xs={12} className="inlineCenter">
                                <Typography variant="body1">
                                    Payment Request Initiation
                                </Typography>
                            </Grid>

                        <Grid item xl={10} lg={10} md={9} sm={12} xs={12}>
                                <FormControl style={{ m: 1 }} component="fieldset" variant="standard">
                                    <FormGroup style={{ display: "flex", flexDirection: "row" }}>
                                    {transactionCreationMode
                                            .filter(mode => mode.lookupCode !== OnboardConstants.ViaGenericQRCode && mode.lookupCode !== OnboardConstants.ViaUPIQRCode) 
                                        .map(mode => (
                                            <AppCheckBox
                                                key={mode.lookupCode}
                                                label={mode.description}
                                                checked={this.state.selectedRequestInitiationModes.some(item => item.lookupCode === mode.lookupCode && item.checked)}
                                                onClick={(e) => this.handleCheckBoxEvent(e, null, mode)}
                                                name="paymentRequestInitiation"
                                                color="primary"
                                            />
                                        ))}
                                </FormGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>

                <Grid item xs={12} style={{ marginTop: "0.5%" }}>
                    <Box style={{ display: "flex" }}>
                        <Grid container>
                            <Grid item xl={2} lg={2} md={3} sm={12} xs={12} className="inlineCenter">
                                <Typography variant="body1">
                                    Refunds
                                </Typography>
                            </Grid>

                    <Grid item xl={10} lg={10} md={9} sm={12} xs={12}>
                        <FormControl style={{ m: 1 }} component="fieldset" variant="standard">
                            <FormGroup style={{ display: "flex", flexDirection: "row", columnGap: 2 }}>

                                {transactionCreationMode
                                    .filter(mode => mode.lookupCode !== OnboardConstants.ViaDRM 
                                        && mode.lookupCode !==OnboardConstants.ViaGenericQRCode 
                                        && mode.lookupCode !==OnboardConstants.ViaUPIQRCode 
                                        && mode.lookupCode !==OnboardConstants.RefundViaApi 
                                        && mode.lookupCode !==OnboardConstants.ViaCustomPay 
                                    ) 
                                    .map(mode => (
                                        <AppCheckBox
                                            key={mode.lookupCode}
                                            label={mode.description}
                                            checked={this.state.selectedRefundModes.some(item => item.lookupCode === mode.lookupCode && item.checked)}
                                            onClick={(e) => this.handleCheckBoxEvent(e, null, mode)}
                                            name="refunds"
                                            color="primary"
                                        />
                                    ))}
                            </FormGroup>
                        </FormControl>
                    </Grid>
                        </Grid>
                    </Box>
                </Grid>

                <Grid item xs={12} style={{ marginTop: "0.5%" }}>
                    <Box style={{ display: "flex" }}>
                        <Grid container>
                            <Grid item xl={2} lg={2} md={3} sm={12} xs={12} className="inlineCenter">
                                <Typography variant="body1">
                                    Cancellations
                                </Typography>
                            </Grid>

                            <Grid item xl={10} lg={10} md={9} sm={12} xs={12}>
                                <FormControl style={{ m: 1 }} component="fieldset" variant="standard">
                                    <FormGroup style={{ display: "flex", flexDirection: "row", columnGap: 58 }}>
                                        {transactionCreationMode
                                            .filter(mode => mode.lookupCode !== OnboardConstants.ViaDRM && 
                                                mode.lookupCode !==OnboardConstants.ViaGenericQRCode 
                                                && mode.lookupCode !==OnboardConstants.ViaUPIQRCode 
                                                && mode.lookupCode !== OnboardConstants.ViaFileUpload
                                                && mode.lookupCode !== OnboardConstants.ViaCustomPay
                                            ) // Add this line to filter out "DRM"
                                            .map(mode => (
                                                <AppCheckBox
                                                    key={mode.lookupCode}
                                                    label={mode.lookupCode === OnboardConstants.ViaApi ? OnboardConstants.CancellationViaApiLabel : mode.description}
                                                    checked={this.state.selectedCancellationModes.some(item => item.lookupCode === mode.lookupCode && item.checked)}
                                                    onClick={(e) => this.handleCheckBoxEvent(e, null, mode)}
                                                    name="cancellations"
                                                    color="primary"
                                                />
                                            ))}
                                    </FormGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid> 
                <Grid item xs={12} style={{ marginTop: "0.5%" }}>
                    <Box style={{ display: "flex" }}>
                        <Grid container>
                            <Grid item xl={2} lg={2} md={3} sm={12} xs={12} className="inlineCenter">
                                <Typography variant="body1">
                                    Generate QR Code
                                </Typography>
                            </Grid>

                            <Grid item xl={10} lg={10} md={9} sm={12} xs={12}>
                                <FormControl style={{ m: 1 }} component="fieldset" variant="standard">
                                    <FormGroup style={{ display: "flex", flexDirection: "row", columnGap: 19 }}>
                                        {transactionCreationMode
                                            .filter(mode => mode.lookupCode !== OnboardConstants.ViaDRM 
                                                && mode.lookupCode !== OnboardConstants.ViaFileUpload 
                                                && mode.lookupCode != OnboardConstants.ViaScreen 
                                                && mode.lookupCode != OnboardConstants.ViaApi 
                                                && mode.lookupCode != OnboardConstants.ViaCustomPay 
                                            ) 
                                            .map(mode => (
                                                <AppCheckBox
                                                    key={mode.lookupCode}
                                                    label={mode.description}
                                                    checked={this.state.selectedGenerateQRCode.some(item => item.lookupCode === mode.lookupCode && item.checked)}
                                                    onClick={(e) => this.handleCheckBoxEvent(e, null, mode)}
                                                    name="generateQRCode"
                                                    color="primary"
                                                />
                                            ))}
                                    </FormGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid> 

                <Grid item xs={12} style={{ marginTop: "0.5%" }}>
                    <Box style={{ display: "flex" }}>
                        <Grid container>
                            <Grid item xl={2} lg={2} md={3} sm={12} xs={12} className="inlineCenter">
                                <Typography variant="body1">
                                    Transaction Mode
                                </Typography>
                            </Grid>

                            <Grid item xl={10} lg={10} md={9} sm={12} xs={12}>
                                <FormControl style={{ m: 1 }} component="fieldset" variant="standard">
                                    <FormGroup style={{ display: "flex", flexDirection: "row", columnGap: 2 }}>
                                        <AppCheckBox 
                                            checked={formFields.digitalPayment.value} 
                                            onClick={(e) => this.handleTransactionModeOnClick('digitalPayment', e.target.checked, false)} 
                                            name="digitalPayment" color="primary" label="Digital"
                                            value={formFields.digitalPayment.value}
                                            rules={formFields.digitalPayment.rules}
                                        />
                                    </FormGroup>
                                </FormControl>
                                <FormControl style={{ marginLeft:'10px'}} component="fieldset" variant="standard">
                                    <FormGroup style={{ display: "flex", flexDirection: "row", columnGap: 2, marginLeft:55}}>
                                        <AppCheckBox 
                                            checked={formFields.manualPayment.value} 
                                            onClick={(e) => this.handleTransactionModeOnClick('manualPayment', e.target.checked, false)}
                                            name="manualPayment" color="primary" label="Manual"
                                            value={formFields.manualPayment.value}
                                            rules={formFields.manualPayment.rules}
                                        />
                                    </FormGroup>
                                </FormControl>
                                
                                <ErrorAlert errors={formFields.digitalPayment.errors} style={{paddingLeft:'18px'}}/>
                                
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>

                <Grid item xs={12} style={{ marginTop: "0.5%" }}>
                    <Box style={{ display: "flex" }}>
                        <Grid container>
                            <Grid item xl={2} lg={2} md={3} sm={12} xs={12} className="inlineCenter">
                                <Typography variant="body1">
                                Allow Partial Payment
                                </Typography>
                            </Grid>

                            <Grid item xl={10} lg={10} md={9} sm={12} xs={12}>
                                <FormControl style={{ m: 1 }} component="fieldset" variant="standard">
                                    <FormGroup style={{ display: "flex", flexDirection: "row", columnGap: 2 }}>
                                        <AppCheckBox  checked={(formFields.allowPartialPayments.value)} onClick={(e) => this.updateFormField('allowPartialPayments', e.target.checked)} name="allowPartialPayments" color="primary"/>
                                    </FormGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                
                {(this.state.isApiChecked ?
                    <Grid item xs={12} style={{ marginTop: "0.5%" }}>
                        <Box style={{ display: "flex" }}>
                            <Grid container>
                                <Grid item xl={2} lg={2} md={3} sm={12} xs={12} className="inlineCenter">
                                    <Typography variant="body1">
                                        Skip Benepay payer page
                                    </Typography>
                                </Grid>

                                <Grid item xl={10} lg={10} md={9} sm={12} xs={12}>
                                    <FormControl style={{ m: 1 }} component="fieldset" variant="standard">
                                        <FormGroup style={{ display: "flex", flexDirection: "row", columnGap: 2 }}>
                                            <AppCheckBox checked={(this.state.isApiChecked && formFields.skipBenepayPayerPage.value)} onClick={(e) => this.updateFormField('skipBenepayPayerPage', e.target.checked)} name="skipBenepayPayerPage" color="primary" />
                                        </FormGroup>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                : "")}

                <Grid item xs={12} style={{ marginTop: "0.5%" }}>
                    <Box style={{ display: "flex" }}>
                        <Grid container>
                            <Grid item xl={2} lg={2} md={3} sm={12} xs={12} className="inlineCenter">
                                <Typography variant="body1">
                                Auto Requestor Transaction ID
                                </Typography>
                            </Grid>

                            <Grid item xl={10} lg={10} md={9} sm={12} xs={12}>
                                <FormControl style={{ m: 1 }} component="fieldset" variant="standard">
                                    <FormGroup style={{ display: "flex", flexDirection: "row", columnGap: 2 }}>
                                        <AppCheckBox  checked={(formFields.autoReqTnxId.value==1)} onClick={(e) => this.updateFormField('autoReqTnxId', e.target.checked)} name="autoReqTnxId" color="primary"/>
                                    </FormGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
             
                <Grid item xs={12} style={{ marginTop: "0.5%" }}>
                    <Box style={{ display: "flex" }}>
                        <Grid container>
                            <Grid item xl={2} lg={2} md={3} sm={12} xs={12} className="inlineCenter">
                                <Typography variant="body1">
                                Disable Charges and Reason for Charges
                                </Typography>
                            </Grid>

                            <Grid item xl={10} lg={10} md={9} sm={12} xs={12}>
                                <FormControl style={{ m: 1 }} component="fieldset" variant="standard">
                                    <FormGroup style={{ display: "flex", flexDirection: "row", columnGap: 2 }}>
                                        <AppCheckBox  checked={(formFields.disableChargeOrReason.value==1)} onClick={(e) => this.updateFormField('disableChargeOrReason', e.target.checked)} name="disableChargeOrReason" color="primary"/>
                                    </FormGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                {/* <Grid item xs={12} style={{ marginTop: "0.5%" }}>
                    <Box style={{ display: "flex" }}>
                        <Grid container>
                            <Grid item xl={2} lg={2} md={3} sm={12} xs={12} className="inlineCenter">
                                <Typography variant="body1">
                                Disable Total Amount
                                </Typography>
                            </Grid>

                            <Grid item xl={10} lg={10} md={9} sm={12} xs={12}>
                                <FormControl style={{ m: 1 }} component="fieldset" variant="standard">
                                    <FormGroup style={{ display: "flex", flexDirection: "row", columnGap: 2 }}>
                                        <AppCheckBox  checked={(formFields.disableTotalAmount.value==1)} onClick={(e) => this.updateFormField('disableTotalAmount', e.target.checked)} name="disableTotalAmount" color="primary"/>
                                    </FormGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid> */}
                <Grid item xs={12} style={{ marginTop: "0.5%" }}>
                    <Box style={{ display: "flex" }}>
                        <Grid container>
                            <Grid item xl={2} lg={2} md={3} sm={12} xs={12} className="inlineCenter">
                                <Typography variant="body1">
                                Shorten Transaction ID
                                </Typography>
                            </Grid>

                            <Grid item xl={10} lg={10} md={9} sm={12} xs={12}>
                                <FormControl style={{ m: 1 }} component="fieldset" variant="standard">
                                    <FormGroup style={{ display: "flex", flexDirection: "row", columnGap: 2 }}>
                                        <AppCheckBox  checked={(formFields.shortTnxId.value==1)} onClick={(e) => this.updateFormField('shortTnxId', e.target.checked)} name="shortTnxId" color="primary"/>
                                    </FormGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>

                <Grid item xs={12} style={{ marginTop: "0.5%" }}>
                    <Box style={{ display: "flex" }}>
                        <Grid container>
                            <Grid item xl={2} lg={2} md={3} sm={12} xs={12} className="inlineCenter">
                                <Typography variant="body1">
                                    Invoices Subscription
                                </Typography>
                            </Grid>

                            <Grid item xl={10} lg={10} md={9} sm={12} xs={12}>
                                <FormControl style={{ m: 1 }} component="fieldset" variant="standard">
                                    <FormGroup style={{ display: "flex", flexDirection: "row", columnGap: 2 }}>
                                        <AppCheckBox checked={invoicesSubscription} onClick={this.handleCheckBoxEvent} name="invoicesSubscription"  color="primary" />
                                    </FormGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>

                {invoicesSubscription ?
                    <Grid item xs={12} style={{ marginTop: ".5%" }}>
                        <Box style={{ display: "flex" }}>
                            <Grid container>
                                <Grid item xl={2} lg={2} md={3} sm={12} xs={12} className="inlineCenter">
                                    <Typography variant="body1">
                                        Automatically generate and <br />
                                        send invoice to payers
                                    </Typography>
                                </Grid>

                                <Grid item xl={10} lg={10} md={9} sm={12} xs={12}>
                                    <FormControl style={{ m: 1 }} component="fieldset" variant="standard">
                                        <FormGroup style={{ display: "flex", flexDirection: "row", columnGap: 2 }}>
                                            <AppCheckBox label="Unpaid Invoice" checked={autoGenerateUnpaidInvoice} onClick={this.handleCheckBoxEvent} name="autoGenerateUnpaidInvoice"  color="primary"/>
                                            <AppCheckBox label="Paid Invoice" checked={autoGeneratePaidInvoice} onClick={this.handleCheckBoxEvent} name="autoGeneratePaidInvoice"  color="primary"/>
                                        </FormGroup>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    : ''}
            </Grid>

            <Grid item xs={12} style={{ marginTop: "0.5%" }}>
                <Box style={{ display: "flex" }}>
                    <Grid container>
                        <Grid item xl={2} lg={2} md={3} sm={12} xs={12} className="inlineCenter">
                            <Typography variant="body1">
                                Seamless Payment
                            </Typography>
                        </Grid>

                        <Grid item xl={10} lg={10} md={9} sm={12} xs={12}>
                            <FormControl style={{ m: 1 }} component="fieldset" variant="standard">
                                <FormGroup style={{ display: "flex", flexDirection: "row", columnGap: 2 }}>
                                    <AppCheckBox checked={seamlessPayment} onClick={this.handleCheckBoxEvent} name="seamlessPayment" color="primary" />
                                </FormGroup>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>

            <Grid item xs={12} style={{ marginTop: "0.5%" }}>
                <Grid container>
                    {(formFields.skipBenepayPayerPage.value === true && this.state.isApiChecked === true) || this.state.isRealtimeApiCHecked == true ?
                        <Grid item xl={4} lg={4} md={12} sm={6} xs={12} style={{ marginTop: ".5%" }}>
                            <BootstrapLabel shrink required htmlFor="returnUrl">Merchant's Return Url</BootstrapLabel>
                            <FormControl style={{ width: '60%' }}>
                                <BootstrapInputOld
                                    id="returnUrl"
                                    value={formFields.returnUrl.value}
                                    rules={formFields.returnUrl.rules ? formFields.returnUrl.rules : null}
                                    errors={formFields.returnUrl.errors ? formFields.returnUrl.errors : null}
                                    onChange={(e) => { this.updateFormField("returnUrl", e.target.value) }}
                                />
                            </FormControl>
                        </Grid>
                        : ''}
                    {(this.state.isApiChecked === true || this.state.isRealtimeApiCHecked == true) && merchantEncKey ?
                        <Grid item xl={4} lg={4} md={12} sm={6} xs={12} style={{ marginTop: ".5%" }}>
                            <BootstrapLabel shrink htmlFor="merchantEncKey">Merchant's Encryption Key</BootstrapLabel>
                            <FormControl style={{ width: '60%' }}>
                                <BootstrapInputOld
                                    type={showEncKey ? "text" : "password"}
                                    id="merchantEncKey"
                                    value={merchantEncKey}
                                    onChange={(e) => { this.updateFormField("returnUrl", e.target.value) }}
                                    InputProps={{
                                        readOnly: true,
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle Enc Key visibility"
                                                    onClick={this.toggleEncKeyVisibility}
                                                >
                                                    {showEncKey ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => {
                                                        this.handleCopyClick(
                                                            merchantEncKey
                                                        );
                                                    }}
                                                >
                                                    <ContentCopyIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        : ''}
                </Grid>
                {/* : ''} */}
            </Grid>

                

            <Grid container style={{ marginTop: "1%" }} spacing={2}>
                <Grid item xs={12}>
                    <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <BootstrapLabel shrink  htmlFor="merchantCallbackUrl">Merchant's Callback Url</BootstrapLabel>
                        <FormControl style={{ width: '60%' }}>
                            <BootstrapInputOld

                                id="merchantCallbackUrl"
                                value={formFields.merchantCallbackUrl.value}
                                rules={formFields.merchantCallbackUrl.rules}
                                errors={formFields.merchantCallbackUrl.errors}
                                onChange={(e) => { this.updateFormField("merchantCallbackUrl", e.target.value) }}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                            <BootstrapLabel shrink required htmlFor="paymentDefaultDueDate">Payment Default Due Date (No of calendar days)</BootstrapLabel>
                            <FormControl style={{ width: '60%' }}>
                                <BootstrapInputOld
                                
                                    id="paymentDefaultDueDate"
                                    value={formFields.paymentDefaultDueDate.value}
                                    rules={formFields.paymentDefaultDueDate.rules}
                                    errors={formFields.paymentDefaultDueDate.errors}
                                    onChange={(e) => { this.updateFormField("paymentDefaultDueDate", e.target.value.replace(/[^0-9.]/g, '')) }}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                            <BootstrapLabel shrink required htmlFor="expiry-date">Expiry Date after due date (no of calendar days)</BootstrapLabel>
                            <FormControl style={{ width: '60%' }}>
                                <BootstrapInputOld
                                    id="expiryDate"
                                    rules={formFields.expiryDate.rules}
                                    errors={formFields.expiryDate.errors}
                                    value={formFields.expiryDate.value}
                                    onChange={(e) => { this.updateFormField("expiryDate", e.target.value.replace(/[^0-9.]/g, '')) }}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} style={{ marginTop: "1" }}>
                    <Grid container>
                        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                            <BootstrapLabel shrink htmlFor="default-email-id">Default Email id for notifications</BootstrapLabel>
                            <FormControl style={{ width: '60%' }}>
                                <BootstrapInputOld
                                    id="emailId"
                                    rules={formFields.emailId.rules}
                                    errors={formFields.emailId.errors}
                                    value={formFields.emailId.value}
                                    onChange={(e) => { this.updateFormField("emailId", e.target.value) }}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                            <BootstrapLabel shrink htmlFor="mobileNo">Default mobile no for SMS notifications</BootstrapLabel>
                            <FormControl style={{ minWidth: '60%' }}>
                                <MUIPhoneInput
                                    id="mobileNoForSMS"
                                    defaultCountry="in"
                                    countryCodeEditable={false}
                                    disableAreaCodes={true}
                                    rules={formFields.mobileNoForSMS.rules}
                                    value={formFields.mobileNoForSMS.value}
                                    errors={formFields.mobileNoForSMS.errors}
                                    onChange={(e, v) => {
                                        this.updateFormField("SMSMobileNoCountryCode", v.dialCode, false);
                                    }}
                                    onBlur={(e) => {
                                        let value = e.target.value;

                                        var cCode = formFields.SMSMobileNoCountryCode.value;
                                
                                        this.handleMobileTabOut( "mobileNoForSMS", value, cCode );
                                    }}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} style={{ marginTop: "1" }}>
                    <Grid container>
                        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                            <BootstrapLabel shrink htmlFor="default-due-date">Default mobile no for Whatsapp notifications</BootstrapLabel>
                            <FormControl style={{ minWidth: '60%' }}>
                                <MUIPhoneInput
                                    id="mobileNoForWhatsApp"
                                    defaultCountry="in"
                                    countryCodeEditable={false}
                                    disableAreaCodes={true}
                                    rules={formFields.mobileNoForWhatsApp.rules}
                                    value={formFields.mobileNoForWhatsApp.value}
                                    errors={formFields.mobileNoForWhatsApp.errors}
                                    onChange={(e, v) => {
                                        this.updateFormField("WhatAppMobileNoCountryCode", v.dialCode, false);
                                    }}
                                    onBlur={(e) => {
                                        let value = e.target.value;

                                        var cCode = formFields.WhatAppMobileNoCountryCode.value;
                                
                                        this.handleMobileTabOut( "mobileNoForWhatsApp", value, cCode );
                                    }}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                            <BootstrapLabel shrink required htmlFor="reminderFrequency">Reminder frequency (no of calendar days)</BootstrapLabel>
                            <FormControl style={{ width: '60%' }}>
                                <BootstrapInputOld
                                    id="reminderFrequency"
                                    rules={formFields.reminderFrequency.rules}
                                    errors={formFields.reminderFrequency.errors}
                                    value={formFields.reminderFrequency.value}
                                    onChange={(e) => { this.updateFormField("reminderFrequency", e.target.value.replace(/[^0-9.]/g, '')) }}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <BootstrapLabel shrink required htmlFor="" >Default/Settlement Currency</BootstrapLabel>
                    <FormControl style={{ minWidth: '61%' }}>
                        <Autocomplete
                            size="small"
                            id="defaultCurrency"
                            disablePortal
                            options={allCurrency.map((option) => option)}
                            getOptionLabel={(option) => `${option}`}
                            value={formFields.defaultCurrency.value}
                            onChange={(e, newValue) => this.updateFormField("defaultCurrency", (newValue ? newValue : null))}
                            renderInput={(params) => (
                                <BootstrapInputOld
                                    {...params}
                                    InputProps={{
                                        ...params.InputProps,
                                    }}
                                    rules={formFields.defaultCurrency.rules}
                                    value={formFields.defaultCurrency.value}
                                    errors={formFields.defaultCurrency.errors}
                                />
                            )}
                        />
                    </FormControl>
                </Grid>
                <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <BootstrapLabel shrink required htmlFor="" >Default Time Zone</BootstrapLabel>
                    <FormControl style={{ minWidth: '61%' }}>
                        <Autocomplete
                            size="small"
                            id="merchantTimeZone"
                            disablePortal
                            options={merchantTimeZone}
                            value={formFields.merchantTimeZone.value}
                            onChange={(e, newValue) => this.updateFormField("merchantTimeZone", (newValue ? newValue : null))}
                            renderInput={(params) => (
                                <BootstrapInputOld
                                    {...params}
                                    InputProps={{
                                        ...params.InputProps,
                                    }}
                                    rules={formFields.merchantTimeZone.rules}
                                    value={formFields.merchantTimeZone.value}
                                    errors={formFields.merchantTimeZone.errors}
                                />
                            )}
                        />
                    </FormControl>
                </Grid>
            </Grid>

            <Grid container style={{ marginTop: "1%" }}>
                <Grid item xs={12}>
                    <Typography variant="body1" fontWeight={500} style={{ color: 'rgb(13, 90, 183)' }}>
                        Allowed Invoice / Payment Request Currencies
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <FormControl component="fieldset" variant="standard">
                        <FormGroup style={{ display: "flex", flexDirection: "row" }}>
                            <AppCheckBox label="Key Currencies" checked={keyCurrencies} onClick={this.handleCheckBoxEvent} name="keyCurrencies" color="primary" />
                        </FormGroup>
                    </FormControl>
                </Grid>

                <Card style={{ width: '100%', paddingLeft: '1%', boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 4px 4px' }}>
                    <Grid container>
                        {keyCurrenciesList.map((currency, index) => (
                            <Grid item xl={0.8} lg={1} md={2} sm={3} xs={3} key={index}>
                                <FormControl component="fieldset" variant="standard">
                                    <FormGroup style={{ display: "flex", flexDirection: "column" }}>
                                        <AppCheckBox
                                            label={currency.name}
                                            checked={currency.checked}
                                            onClick={(e) => this.handleCheckBoxEvent(e, currency, null)}
                                            name={currency.name}
                                            color="primary"
                                        />
                                    </FormGroup>
                                </FormControl>
                            </Grid>
                        ))}
                    </Grid>
                </Card>

                <Grid item xs={12} style={{marginTop:"2%"}}>
                    <FormControl component="fieldset" variant="standard">
                        <FormGroup style={{ display: "flex", flexDirection: "row" }}>
                            <AppCheckBox label="Other Currencies" checked={otherCurrencies} onClick={this.handleCheckBoxEvent} name="otherCurrencies"  color="primary"/>
                        </FormGroup>
                    </FormControl>
                </Grid>


                <Card style={{ width: '100%', paddingLeft: '1%', boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 4px 4px' }}>
                    <Grid container>
                        {withoutKeyCurrenciesList.map((currency, index) => (
                            <Grid item xl={0.8} lg={1} md={2} sm={3} xs={3} key={index}>
                                <FormControl component="fieldset" variant="standard">
                                    <FormGroup style={{ display: "flex", flexDirection: "column" }}>
                                        <AppCheckBox
                                            label={currency.name}
                                            checked={currency.checked}
                                            onClick={(e) => this.handleCheckBoxEvent(e, currency, null)}
                                            name={index.name}
                                            color="primary"

                                        />
                                    </FormGroup>
                                </FormControl>
                            </Grid>
                        ))}
                    </Grid>
                </Card>
            </Grid>
            
            {/* Alert for delete preference */}
            <AlertDialog
                open={openBDdeletepopup}
                cancelBtnLabel="Cancel"
                confirmBtnLabel="Confirm"
                confirmOnClick={this.deletePreference}
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

            {/* Alert for changing the priority of provider */}
            {/* And also used to inactive the transaction mode and providers(payment gateway) */}
            <AlertDialog
                open={openTxnModeValidationPopup || openTxnModeDisablePopup}
                confirmBtnDisabled={loaderForTxnModeInactiveProcess}
                cancelBtnLabel="Cancel"
                confirmBtnLabel={openTxnModeDisablePopup && AlertMsg != messages.defaultErrorMsg ? "Confirm" : ""}
                confirmOnClick={ openTxnModeDisablePopup && AlertMsg != messages.defaultErrorMsg ? this.deActivateTxnModeAndProviders :
                    () => this.setState({ openTxnModeValidationPopup: false, openTxnModeDisablePopup: false })
                }
                cancelOnClick={() => this.setState({ openTxnModeValidationPopup: false, openTxnModeDisablePopup: false })}
            >
                <Grid container style={{ width: '700px' }}>
                    <Grid item sx={12}>
                        <Typography style={{ color: 'black', fontSize: '20px', fontWeight: 'normal' }}>
                            {AlertMsg}
                        </Typography>
                    </Grid>
                </Grid>
            </AlertDialog>
        </Box >

    );
}
