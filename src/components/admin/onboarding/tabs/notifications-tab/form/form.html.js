import React, {Component} from "react";
import {Card,CardContent,Typography,Grid,Checkbox,Divider, FormControl} from "@material-ui/core";
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import Typography from "@mui/material/Typography";
// import Grid from "@mui/material/Grid";
// import Checkbox from "@mui/material/Checkbox";
import { BootstrapInputOld } from "../../../../../$widgets/form-inputs/BootstrapInputOld";
import MUIPhoneInput from "../../../../../$widgets/form-inputs/MUIPhoneInput";
import { BootstrapLabel } from "components/$widgets/form-inputs/BootstrapLabel";
import { AppCheckBox } from "components/$widgets/form-inputs";

export function html() {
    const {
        formFields,
        formKey,
        title,
        showMerchant
    } = this.state;

    return (
        <>
            <Typography variant="h6" style={{ paddingBottom: '1%', color:"var(--primary-color)" }}>
                {title}
            </Typography>

            <Card style={{ boxShadow: '0 0 4px 4px rgba(0, 0, 0, 0.1)', marginTop: '1%' }}>
                <CardContent>
                    {/* Notify Merchant */}
                    {
                    showMerchant && <Typography style={{fontSize:'17px',fontWeight:'bold',fontFamily:'sans-serif'}} >
                        Notify Merchant
                    </Typography>
                    }
                     
                    {
                    showMerchant && 
                        <>
                            <Grid container spacing={2} marginTop={1}>
                                <Grid item xs={4}>
                                    <Typography>
                                        <AppCheckBox
                                            label="via SMS"  
                                            checked={ (formFields.nmSMS.value == true) ? true : false }
                                            onClick={(e) => this.handleCheckBoxClick(e, 'nmSMS', 'smsNumber', 'smsCcyCode', formKey)}
                                        />
                                    </Typography>
                                </Grid>
                                <Grid item xs={7}>
                                    <BootstrapLabel shrink required={formFields.nmSMS.value ? true : false} htmlFor="">
                                        Mobile number for SMS Notification
                                    </BootstrapLabel>
                                    <FormControl fullWidth>
                                        <MUIPhoneInput
                                            id={`smsNumber${formKey}`}
                                            defaultCountry='in'
                                            countryCodeEditable={false}
                                            disableAreaCodes={true}
                                            rules={formFields.smsNumber.rule}
                                            errors={formFields.smsNumber.errors}
                                            value={formFields.smsNumber.value}
                                            onChange={(e, v) => {
                                                this.updateFormField("smsCcyCode", v.dialCode, false, formKey);
                                            }}
                                            onBlur={(e) => {
                                                let value = e.target.value;

                                                var cCode = formFields.smsCcyCode.value;
                                        
                                                this.handleMobileTabOut( "smsNumber", value, cCode, formKey );
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography>
                                        <AppCheckBox 
                                            label="via WhatsApp"
                                            checked={ (formFields.nmWApp.value == true) ? true : false }
                                            onClick={(e) => this.handleCheckBoxClick(e, 'nmWApp', 'wAppNumber', 'wAppCcyCode', formKey)}/>
                                        
                                    </Typography>
                                </Grid>
                                <Grid item xs={7}>
                                    <BootstrapLabel shrink htmlFor="" required={formFields.nmWApp.value ? true : false} style={{ whiteSpace: 'nowrap' }}>
                                        Mobile number for WhatsApp Notification
                                    </BootstrapLabel>
                                    <FormControl fullWidth>
                                        <MUIPhoneInput
                                            id={`wAppNumber${formKey}`}
                                            defaultCountry='in'
                                            countryCodeEditable={false}
                                            disableAreaCodes={true}
                                            rules={formFields.wAppNumber.rule}
                                            errors={formFields.wAppNumber.errors}
                                            value={formFields.wAppNumber.value}
                                            onChange={(e, v) => {
                                                this.updateFormField("wAppCcyCode", v.dialCode, true, formKey);
                                            }}
                                            onBlur={(e) => {
                                                let value = e.target.value;

                                                var cCode = formFields.wAppCcyCode.value;
                                        
                                                this.handleMobileTabOut( "wAppNumber", value, cCode, formKey );
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography>
                                        <AppCheckBox 
                                            label="via Email"
                                            checked={ (formFields.nmEmail.value == true) ? true : false }
                                            onClick={(e) => this.handleCheckBoxClick(e, 'nmEmail', 'emailIds', "", formKey)}/>
                                        
                                    </Typography>
                                </Grid>
                                <Grid item xs={7}>
                                    <BootstrapLabel shrink htmlFor="" required={formFields.nmEmail.value ? true : false}>
                                        Email id(s) for Payment Link
                                    </BootstrapLabel>
                                    <FormControl fullWidth>
                                        <BootstrapInputOld
                                            id={`emailId${formKey}`}
                                            multiline 
                                            rows={3}
                                            autoComplete="off"
                                            rules={formFields.emailIds.rule}
                                            errors={formFields.emailIds.errors}
                                            value={formFields.emailIds.value}
                                            onChange={(e) => {
                                                this.updateFormField("emailIds", e.target.value, true, formKey);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            
                            <Grid container spacing={2} marginTop={1}>
                                <Grid item xs={12}>
                                    <Divider dark style={{marginTop:"2%",marginBottom:"2%"}} />
                                </Grid>
                            </Grid>
                        </>
                    }

                    {/* Notify Payer */}
                    <Grid container spacing={2} marginTop={1}>
                        <Grid item xs={12}>
                            <Typography style={{fontSize:'17px',fontWeight:'bold',fontFamily:'sans-serif'}}>
                                Notify Payer
                            </Typography>
                            <Grid container spacing={1} marginTop={1}>
                                <Grid item xs={4}>
                                    <Typography>
                                        <AppCheckBox 
                                            label="via SMS"
                                            style={{ whiteSpace: 'nowrap' }} 
                                            checked={ (formFields.npSMS.value == true) ? true : false }
                                            onClick={(e) => this.handleCheckBoxClick(e, 'npSMS', "", "", formKey)}/>
                                        
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography>
                                        <AppCheckBox 
                                            label="via WhatsApp"
                                            style={{ whiteSpace: 'nowrap' }} 
                                            checked={ (formFields.npWApp.value == true) ? true : false }
                                            onClick={(e) => this.handleCheckBoxClick(e, 'npWApp', "", "", formKey)}/>
                                        
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography>
                                        <AppCheckBox 
                                            label="via Email"
                                            style={{ whiteSpace: 'nowrap' }} 
                                            checked={ (formFields.npEmail.value == true) ? true : false }
                                            onClick={(e) => this.handleCheckBoxClick(e, 'npEmail', "", "", formKey)}/>
                                        
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}


