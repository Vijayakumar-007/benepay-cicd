import React from 'react';
import dayjs from 'dayjs';
// import { Tab, Tabs, Card, CardContent, Typography, FormControl, FormLabel, Grid, Autocomplete, Switch } from '@mui/material';
import { Tab, Tabs, Card, CardContent, Typography, FormControl, FormLabel, Grid, Switch } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { BootstrapInputOld } from 'components/$widgets/form-inputs/BootstrapInputOld';
import MUIDatePicker from "components/$widgets/form-inputs/MUIDatePicker";
import { BootstrapLabel } from 'components/$widgets/form-inputs/BootstrapLabel';
import { DateFormat } from 'enum/common.enum';
import AlertDialog from 'components/$widgets/alertDialog';
import { withStyles } from '@material-ui/core/styles';

export function html() {

    const {
        paymentMethods,
        onboardStatusOptions,
        disabledConfirmBtn,
        formFields,
        selectedPM,
        activePMEnabled,
        showInactivationPopup,
        settlementAcList,
    } = this.state;

    const { provider, providerEnabled } = this.props;

    const { } = this.state.formFields;

    // set custom color background when disabled
    const getDisabledStyle = () => {
        return { background: disableField() ? '#EDEDED' : '' };
    }

    // set field disable based on condition
    const disableField = () => {
        return !(providerEnabled && activePMEnabled);
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
        <Grid container spacing={5}>
            {/* payment methods listing */}
            <Grid item xs={3}>
                <Card style={{ boxShadow: '0 0 4px 4px rgba(0, 0, 0, 0.1)' }}>
                    <CardContent>
                        <FormLabel style={{ color: 'var(--primary-color)' }}>Payment Methods </FormLabel>
                        <Tabs
                            // textColor='primary'
                            style={{ color: '#rgba(0, 0, 0, 0.54)' }}
                            indicatorColor="primary"
                            orientation="vertical"
                            variant="scrollable"
                            value={selectedPM}
                            onChange={this.handlePMChange}
                        >
                            {paymentMethods.map((option, index) => (
                                <Tab
                                    key={option.lookupCode}
                                    value={option.lookupCode}
                                    label={
                                        <Grid container alignItems="center" spacing={1}>
                                            <Grid item>
                                                <CustomSwitch
                                                    checked={option.checked ? option.checked : false}
                                                    onChange={(event) => { this.handleActivatePM(event, option.lookupCode) }}
                                                    style={{ color: "var(--primary-color)" }}
                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                />
                                            </Grid>
                                            <Grid item style={{ maxWidth: "70%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                <span title={option.description}>{option.description}</span>
                                            </Grid>
                                        </Grid>
                                    }
                                    className={`tabStyle ${selectedPM === option.lookupCode ? 'selected-tab' : ''}`}
                                />
                            ))}
                        </Tabs>
                    </CardContent>
                </Card>
            </Grid>

            {/* Settlement field */}
            <Grid item xs={9}>
                {selectedPM && (
                    <Card style={{ boxShadow: '0 0 4px 4px rgba(0, 0, 0, 0.1)', height: '100%' }}>
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                                    <Grid container spacing={2}>
                                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                            <BootstrapLabel shrink required={!disableField()} htmlFor="">
                                                Onboarding Status
                                            </BootstrapLabel>
                                            <FormControl fullWidth>
                                                <Autocomplete
                                                    id="defaultCurrency"
                                                    size="small"
                                                    disabled={disableField()}
                                                    style={getDisabledStyle()}
                                                    disablePortal
                                                    options={onboardStatusOptions || []}
                                                    getOptionLabel={(option) => option.description}
                                                    value={onboardStatusOptions.find((v) => v.lookupCode === formFields.onboardingStatus.value) || null}
                                                    onChange={(e, newValue) => this.updateFormField("onboardingStatus", (newValue ? newValue.lookupCode : null))}
                                                    renderInput={(params) => (
                                                        <BootstrapInputOld
                                                            {...params}
                                                            InputProps={{
                                                                ...params.InputProps,
                                                            }}
                                                            rules={formFields.onboardingStatus.rules}
                                                            value={formFields.onboardingStatus.value}
                                                            errors={formFields.onboardingStatus.errors}
                                                            onBlur={() => this.collectFormData("onboardingStatus")}
                                                        />
                                                    )}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                            <BootstrapLabel shrink required={!disableField()} htmlFor="" style={{ whiteSpace: 'nowrap' }}>
                                                Onboarding Start Date
                                            </BootstrapLabel>
                                            <FormControl fullWidth>
                                                <MUIDatePicker
                                                    id="dateOnboardingCommenced"
                                                    disabled={disableField()}
                                                    format={DateFormat.date}
                                                    placeholder="From"
                                                    disablePast={true}
                                                    rules={formFields.dateOnboardingCommenced.rules}
                                                    errors={formFields.dateOnboardingCommenced.errors}
                                                    value={formFields.dateOnboardingCommenced.value ? dayjs(formFields.dateOnboardingCommenced.value) : null}
                                                    disableEdit={false}
                                                    onChange={(e) => { this.handleDateFields(e, "dateOnboardingCommenced") }}
                                                    onBlur={() => this.collectFormData("dateOnboardingCommenced")}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                            <BootstrapLabel shrink htmlFor="" style={{ whiteSpace: 'nowrap' }}>
                                                Onboarding Completion Date
                                            </BootstrapLabel>
                                            <FormControl fullWidth>
                                                <MUIDatePicker
                                                    id="dateCompletedForOnboarding"
                                                    disabled={disableField()}
                                                    format={DateFormat.date}
                                                    placeholder="From"
                                                    disablePast={true}
                                                    // rules={formFields.dateCompletedForOnboarding.rules}
                                                    // errors={formFields.dateCompletedForOnboarding.errors}
                                                    value={formFields.dateCompletedForOnboarding.value ? dayjs(formFields.dateCompletedForOnboarding.value) : null}
                                                    disableEdit={false}
                                                    onChange={(e) => { this.handleDateFields(e, "dateCompletedForOnboarding") }}
                                                    onBlur={() => this.collectFormData("dateCompletedForOnboarding")}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item xl={8} lg={8} md={8} sm={8} xs={8}>
                                    <Grid container spacing={2}>
                                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                            <BootstrapLabel shrink htmlFor="" style={{ whiteSpace: 'nowrap' }}>
                                                Onboarding Notes
                                            </BootstrapLabel>
                                            <FormControl fullWidth>
                                                <BootstrapInputOld id="onboardingNotes"
                                                    disabled={disableField()}
                                                    style={getDisabledStyle()}
                                                    multiline rows={5}
                                                    value={formFields.onboardingNotes.value}
                                                    onChange={(e) => {
                                                        this.updateFormField("onboardingNotes", e.target.value);
                                                    }}
                                                    onBlur={() => this.collectFormData("onboardingNotes")}
                                                />
                                            </FormControl>
                                        </Grid>

                                        <Grid item xl={6} lg={6} md={6} sm={6} xs={6} style={{marginTop:'1%'}}>
                                            <BootstrapLabel shrink required={!disableField()} htmlFor="" style={{ whiteSpace: 'nowrap' }}>
                                                Settlement Ac
                                            </BootstrapLabel>
                                            <FormControl fullWidth>
                                                <Autocomplete
                                                    id="settlementAc"
                                                    size="small"
                                                    disabled={disableField()}
                                                    style={getDisabledStyle()}
                                                    disablePortal
                                                    options={settlementAcList || []}
                                                    getOptionLabel={(option) => option.accountName}
                                                    value={settlementAcList.find((v) => v.settlementId === formFields.fksettlementId.value) || null}
                                                    onChange={(e, newValue) => this.updateFormField("fksettlementId", (newValue ? newValue.settlementId : null))}
                                                    renderInput={(params) => (
                                                        <BootstrapInputOld
                                                            {...params}
                                                            InputProps={{
                                                                ...params.InputProps,
                                                            }}
                                                            rules={formFields.fksettlementId.rules}
                                                            value={formFields.fksettlementId.value}
                                                            errors={formFields.fksettlementId.errors}
                                                            onBlur={() => this.collectFormData("fksettlementId")}
                                                        />
                                                    )}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>

                        </CardContent>
                    </Card>
                )}
            </Grid>

            <AlertDialog
                open={showInactivationPopup}
                title="Confirm"
                cancelBtnLabel="Cancel"
                confirmBtnLabel="Confirm"
                confirmOnClick={this.inactivatePM}
                cancelOnClick={() => this.setState({ showInactivationPopup: false })}
                confirmBtnDisabled={disabledConfirmBtn}
                cancelBtnDisabled={disabledConfirmBtn}
            >
                <Grid container style={{ width: '500px' }}>
                    <Grid item sx={12}>
                        <Typography style={{ color: 'black' }}>
                            You are trying to disable the payment method. It will remove the active payment method values. Do you want to continue ?
                        </Typography>
                    </Grid>
                </Grid>
            </AlertDialog>
        </Grid>
    );
};
