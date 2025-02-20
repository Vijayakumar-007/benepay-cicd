import React from 'react';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import Checkbox from "@mui/material/Checkbox";
import { BootstrapInput } from 'components/$widgets/form-inputs/BootstrapInput';
import MUIDatePicker from "components/$widgets/form-inputs/MUIDatePicker";
import { withStyles } from "@material-ui/styles";
import { InputLabel, Autocomplete } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { DateFormat } from 'enum/common.enum';
import dayjs from 'dayjs';
import { BootstrapLabel } from 'components/$widgets/form-inputs/BootstrapLabel';

export function html() {

    const { 
        formFields,
        onboardStatusOptions,
        currencyList
    } = this.state;
    
    const { provider } = this.props;
    
    const { providerEnabled, providerExpand } = this.state.formFields;
    
    return (
        <Accordion expanded={providerExpand.value}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon onClick={this.handleExpandAccordian} />}
                aria-controls="panel-content"
                id="panel-header"
            >
                <Checkbox
                    color="primary"
                    style={{ padding: '0px' }}
                    checked={providerEnabled.value}
                    onClick={(e) => this.handleProviderCheckBox(e.target.checked)}
                />
                <Typography variant="h6" paddingLeft={1}>Provider {provider.paymentProviderId} ({provider.paymentProviderName})</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container spacing={2} >

                    <Grid item xs={12}>
                        <Card style={{ boxShadow: '0 0 4px 4px rgba(0, 0, 0, 0.1)' }}>
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <BootstrapLabel shrink required = {providerEnabled.value} htmlFor="">
                                            Onboarding Status
                                        </BootstrapLabel>
                                        <FormControl fullWidth>
                                            <Autocomplete
                                                id="defaultCurrency"
                                                size="small"
                                                disabled={!providerEnabled.value}
                                                style={{ backgroundColor: providerEnabled.value ? '' : '#EDEDED' }}
                                                disablePortal
                                                options={onboardStatusOptions || []}
                                                getOptionLabel={(option) => option.description}
                                                value={onboardStatusOptions.find((v) => v.lookupCode === formFields.onboardingStatus.value) || null}
                                                onChange={(e, newValue) => this.updateFormField("onboardingStatus", (newValue ? newValue.lookupCode : null))}
                                                renderInput={(params) => (
                                                    <BootstrapInput
                                                        {...params}
                                                        InputProps={{
                                                            ...params.InputProps,
                                                        }}
                                                        rules={formFields.onboardingStatus.rules}
                                                        value={formFields.onboardingStatus.value}
                                                        errors={formFields.onboardingStatus.errors}
                                                        onBlur={() => this.collectProviderFormData("onboardingStatus")}
                                                    />
                                                )}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <BootstrapLabel shrink required = {providerEnabled.value} htmlFor="" style={{ whiteSpace: 'nowrap' }}>
                                            Onboarding Completion Date
                                        </BootstrapLabel>
                                        <FormControl fullWidth>
                                            <MUIDatePicker
                                                id="dateCompletedForOnboarding"
                                                disabled={!providerEnabled.value}
                                                format={DateFormat.date}
                                                placeholder="From"
                                                disablePast={true}
                                                rules={formFields.dateCompletedForOnboarding.rules}
                                                errors={formFields.dateCompletedForOnboarding.errors}
                                                value={formFields.dateCompletedForOnboarding.value ? dayjs(formFields.dateCompletedForOnboarding.value) : null}
                                                disableEdit={true}
                                                onChange={(e) => { this.handleDateFields(e, "dateCompletedForOnboarding") }}
                                                onBlur={() => this.collectProviderFormData("dateCompletedForOnboarding")}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <BootstrapLabel shrink required = {providerEnabled.value} htmlFor=""
                                            style={{ whiteSpace: 'nowrap' }}>
                                            Merchant id at Provider
                                        </BootstrapLabel>
                                        <FormControl fullWidth>
                                            <BootstrapInput
                                                id="merchantIdForProvider"
                                                disabled={!providerEnabled.value}
                                                style={{ backgroundColor: providerEnabled.value ? '' : '#EDEDED' }}
                                                value={formFields.merchantIdForProvider.value}
                                                rules={formFields.merchantIdForProvider.rules}
                                                errors={formFields.merchantIdForProvider.errors}
                                                onChange={(e) => {
                                                    this.updateFormField("merchantIdForProvider", e.target.value);
                                                }}
                                                onBlur={() => this.collectProviderFormData("merchantIdForProvider")}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={12}>
                                        <BootstrapLabel shrink htmlFor="" style={{ whiteSpace: 'nowrap' }}>
                                            Onboarding Notes
                                        </BootstrapLabel>
                                        <FormControl fullWidth>
                                            <BootstrapInput id="onboardingNotes"
                                                disabled={!providerEnabled.value}
                                                style={{ backgroundColor: providerEnabled.value ? '' : '#EDEDED' }}
                                                multiline rows={3}
                                                value={formFields.onboardingNotes.value}
                                                onChange={(e) => {
                                                    this.updateFormField("onboardingNotes", e.target.value);
                                                }}
                                                onBlur={() => this.collectProviderFormData("onboardingNotes")}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12}>
                                        <Typography variant="h6" style={{ color: 'var(--primary-color)', whiteSpace: 'nowrap' }}   >
                                            Settlement Details
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={4}>
                                        <BootstrapLabel shrink required = {providerEnabled.value} htmlFor=""
                                            style={{ whiteSpace: 'nowrap' }}>
                                            Settlement Currency
                                        </BootstrapLabel>
                                        <FormControl fullWidth>
                                            <Autocomplete
                                                id="settlementCurrency"
                                                size="small"
                                                disabled={!providerEnabled.value}
                                                style={{ backgroundColor: providerEnabled.value ? '' : '#EDEDED' }}
                                                disablePortal
                                                options={currencyList || []}
                                                getOptionLabel={(option) => `${option}`}
                                                value={formFields.settlementCurrency.value}
                                                onChange={(e, newValue) => this.updateFormField("settlementCurrency", (newValue ? newValue : null))}
                                                renderInput={(params) => (
                                                    <BootstrapInput
                                                        {...params}
                                                        InputProps={{
                                                            ...params.InputProps,
                                                        }}
                                                        rules={formFields.settlementCurrency.rules}
                                                        value={formFields.settlementCurrency.value}
                                                        errors={formFields.settlementCurrency.errors}
                                                    />
                                                )}
                                                onBlur={() => this.collectProviderFormData("settlementCurrency")}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <BootstrapLabel shrink required = {providerEnabled.value} htmlFor=""
                                            style={{ whiteSpace: 'nowrap' }}>
                                            Bank Account Number
                                        </BootstrapLabel>
                                        <FormControl fullWidth>
                                            <BootstrapInput
                                                id="bankAccountNumber"
                                                disabled={!providerEnabled.value}
                                                style={{ backgroundColor: providerEnabled.value ? '' : '#EDEDED' }}
                                                value={formFields.bankAccountNumber.value}
                                                rules={formFields.bankAccountNumber.rules}
                                                errors={formFields.bankAccountNumber.errors}
                                                onChange={(e) => {
                                                    this.updateFormField("bankAccountNumber", e.target.value);
                                                }}
                                                onBlur={() => this.collectProviderFormData("bankAccountNumber")}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <BootstrapLabel shrink required = {providerEnabled.value} htmlFor=""
                                            style={{ whiteSpace: 'nowrap' }}>
                                            Branch Code
                                        </BootstrapLabel>
                                        <FormControl fullWidth>
                                            <BootstrapInput
                                                id="branchCode"
                                                disabled={!providerEnabled.value}
                                                style={{ backgroundColor: providerEnabled.value ? '' : '#EDEDED' }}
                                                value={formFields.branchCode.value}
                                                rules={formFields.branchCode.rules}
                                                errors={formFields.branchCode.errors}
                                                onChange={(e) => {
                                                    this.updateFormField("branchCode", e.target.value);
                                                }}
                                                onBlur={() => this.collectProviderFormData("branchCode")}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <BootstrapLabel shrink required = {providerEnabled.value} htmlFor="" style={{ whiteSpace: 'nowrap' }}>
                                            Swift BIC
                                        </BootstrapLabel>
                                        <FormControl fullWidth>
                                            <BootstrapInput
                                                id="pglSwiftBic"
                                                disabled={!providerEnabled.value}
                                                style={{ backgroundColor: providerEnabled.value ? '' : '#EDEDED' }}
                                                value={formFields.swiftBic.value}
                                                rules={formFields.swiftBic.rules}
                                                errors={formFields.swiftBic.errors}
                                                onChange={(e) => {
                                                    this.updateFormField("swiftBic", e.target.value);
                                                }}
                                                onBlur={() => this.collectProviderFormData("swiftBic")}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <BootstrapLabel shrink required = {providerEnabled.value} htmlFor="" style={{ whiteSpace: 'nowrap' }}>
                                            Name Of Account
                                        </BootstrapLabel>
                                        <FormControl fullWidth>
                                            <BootstrapInput
                                                id="nameOfAccount"
                                                disabled={!providerEnabled.value}
                                                style={{ backgroundColor: providerEnabled.value ? '' : '#EDEDED' }}
                                                value={formFields.nameOfAccount.value}
                                                rules={formFields.nameOfAccount.rules}
                                                errors={formFields.nameOfAccount.errors}
                                                onChange={(e) => {
                                                    this.updateFormField("nameOfAccount", e.target.value);
                                                }}
                                                onBlur={() => this.collectProviderFormData("nameOfAccount")}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <BootstrapLabel shrink required = {providerEnabled.value} htmlFor="" style={{ whiteSpace: 'nowrap' }}>
                                            Type Of Account
                                        </BootstrapLabel>
                                        <FormControl fullWidth>
                                            <BootstrapInput
                                                id="typeOfAccount"
                                                disabled={!providerEnabled.value}
                                                style={{ backgroundColor: providerEnabled.value ? '' : '#EDEDED' }}
                                                value={formFields.typeOfAccount.value}
                                                rules={formFields.typeOfAccount.rules}
                                                errors={formFields.typeOfAccount.errors}
                                                onChange={(e) => {
                                                    this.updateFormField("typeOfAccount", e.target.value);
                                                }}
                                                onBlur={() => this.collectProviderFormData("typeOfAccount")}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={8}>
                                        <BootstrapLabel shrink required = {providerEnabled.value} htmlFor="" style={{ whiteSpace: 'nowrap' }}>
                                            Name Of Bank
                                        </BootstrapLabel>
                                        <FormControl fullWidth>
                                            <BootstrapInput
                                                id="nameOfBank"
                                                disabled={!providerEnabled.value}
                                                style={{ backgroundColor: providerEnabled.value ? '' : '#EDEDED' }}
                                                value={formFields.nameOfBank.value}
                                                rules={formFields.nameOfBank.rules}
                                                errors={formFields.nameOfBank.errors}
                                                onChange={(e) => {
                                                    this.updateFormField("nameOfBank", e.target.value);
                                                }}
                                                onBlur={() => this.collectProviderFormData("nameOfBank")}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <BootstrapLabel shrink required = {providerEnabled.value} htmlFor="" style={{ whiteSpace: 'nowrap' }}>
                                            Name Of Branch
                                        </BootstrapLabel>
                                        <FormControl fullWidth>
                                            <BootstrapInput
                                                id="nameOfBranch"
                                                disabled={!providerEnabled.value}
                                                style={{ backgroundColor: providerEnabled.value ? '' : '#EDEDED' }}
                                                value={formFields.nameOfBranch.value}
                                                rules={formFields.nameOfBranch.rules}
                                                errors={formFields.nameOfBranch.errors}
                                                onChange={(e) => {
                                                    this.updateFormField("nameOfBranch", e.target.value);
                                                }}
                                                onBlur={() => this.collectProviderFormData("nameOfBranch")}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </AccordionDetails>
        </Accordion>
    );
};



