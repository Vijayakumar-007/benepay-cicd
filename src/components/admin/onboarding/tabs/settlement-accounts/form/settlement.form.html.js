import React from 'react';

//MUI Components
import { Button, Grid, Typography, Divider, FormControl } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { BootstrapLabel } from 'components/$widgets/form-inputs/BootstrapLabel';
import { BootstrapInputOld } from 'components/$widgets/form-inputs/BootstrapInputOld';
import Loader from 'components/$widgets/loader';
import { AppCheckBox } from 'components/$widgets/form-inputs';
import AlertDialog from 'components/$widgets/alertDialog';

//Style
import "components/admin/onboarding/tabs/settlement-accounts/form/settlement.form.scss";

export function html() {
    const {
        loading,
        countryList,
        currencyList,
        formFields,
        openConfirmPopup,
        disableConfirmBtn,
        bankAccountTypes,
    } = this.state;

    const style = {
        title: {
            fontWeight: 'bold',
            fontSize: 'x-large',
            color: 'var(--primary-color)',
        },
        divider: {
            backgroundColor: 'var(--primary-color)',
            marginBottom: '1%',
        },
        settlementSaveButton: {
            color: 'white',
            backgroundColor: 'var(--primary-color)',
            textTransform: 'none',
            whiteSpace: 'nowrap',
            fontSize: '15px',
            width: '80%',
        },
        settlementCancelButton: {
            color: 'white',
            backgroundColor: '#7c7c7c',
            textTransform: 'none',
            whiteSpace: 'nowrap',
            fontSize: '15px',
            marginRight: '2%',
            width: '80%',
        },
    };

    return (
        <>
            <Loader loading={loading} />

            {/* Settlement Form - start */}
            <Grid container spacing={2}>
                <Grid item xs={12}
                    style={{
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <Typography style={style.title}>
                        Add Settlement A/C
                    </Typography>
                </Grid>

                <Grid xs={12}>
                    <Divider style={style.divider} />
                </Grid>

                <Grid item xl={2} lg={2} md={4} sm={10} xs={10}>
                    <BootstrapLabel shrink required>
                        Country
                    </BootstrapLabel>
                    <Autocomplete
                        size="small"
                        id="country"
                        options={countryList || []}
                        getOptionLabel={(option) => option.description}
                        value={countryList.find((v) => v.lookupCode === formFields.country.value) || null}
                        onChange={(e, newValue) => this.updateFormField("country", (newValue ? newValue.lookupCode : null))}
                        renderInput={(params) => (
                            <BootstrapInputOld
                                {...params}
                                InputProps={{
                                    ...params.InputProps,
                                }}
                                rules={formFields.country.rules}
                                value={formFields.country.value}
                                errors={formFields.country.errors}
                            />
                        )}
                    />
                </Grid>

                <Grid item xl={2} lg={2} md={4} sm={10} xs={10}>
                    <BootstrapLabel shrink required>
                        A/C ccy
                    </BootstrapLabel>
                    <Autocomplete
                        size="small"
                        id="acCurrency"
                        options={currencyList || []}
                        getOptionLabel={(option) => option.lookupCode}
                        value={currencyList.find((v) => v.lookupCode === formFields.acCurrency.value) || null}
                        onChange={(e, newValue) => this.updateFormField("acCurrency", (newValue ? newValue.lookupCode : null))}
                        renderInput={(params) => (
                            <BootstrapInputOld
                                {...params}
                                InputProps={{
                                    ...params.InputProps,
                                }}
                                rules={formFields.acCurrency.rules}
                                value={formFields.acCurrency.value}
                                errors={formFields.acCurrency.errors}
                            />
                        )}
                    />
                </Grid>

                <Grid item xl={2} lg={2} md={4} sm={10} xs={10}>
                    <BootstrapLabel shrink required style={{ width: '130%' }}>
                        Bank Account Number
                    </BootstrapLabel>
                    <FormControl fullWidth>
                        <BootstrapInputOld
                            id="bankAccountNumber"
                            value={formFields.bankAccountNumber.value}
                            rules={formFields.bankAccountNumber.rules}
                            errors={formFields.bankAccountNumber.errors}
                            onChange={(e) => {
                                this.updateFormField("bankAccountNumber", e.target.value);
                            }}
                        />
                    </FormControl>
                </Grid>

                <Grid item xl={3} lg={3} md={4} sm={10} xs={10}>
                    <BootstrapLabel shrink required>
                        Account Name
                    </BootstrapLabel>
                    <FormControl fullWidth>
                        <BootstrapInputOld
                            id="accountName"
                            value={formFields.accountName.value}
                            rules={formFields.accountName.rules}
                            errors={formFields.accountName.errors}
                            onChange={(e) => {
                                this.updateFormField("accountName", e.target.value);
                            }}
                            onBlur={(e) => this.accountNameIsUnique(e.target.value, 'accountName')}
                        />
                    </FormControl>
                </Grid>
                
                <Grid item xl={3} lg={3} md={4} sm={10} xs={10}>
                    <BootstrapLabel shrink required>
                        Account Holder Name
                    </BootstrapLabel>
                    <FormControl fullWidth>
                        <BootstrapInputOld
                            id="accountHolderName"
                            value={formFields.accountHolderName.value}
                            rules={formFields.accountHolderName.rules}
                            errors={formFields.accountHolderName.errors}
                            onChange={(e) => {
                                this.updateFormField("accountHolderName", e.target.value);
                            }}
                        />
                    </FormControl>
                </Grid>

                <Grid item xl={2} lg={2} md={4} sm={10} xs={10}>
                    <BootstrapLabel shrink required>
                        Branch Code
                    </BootstrapLabel>
                    <FormControl fullWidth>
                        <BootstrapInputOld
                            id="merchant-name"
                            value={formFields.branchCode.value}
                            rules={formFields.branchCode.rules}
                            errors={formFields.branchCode.errors}
                            onChange={(e) => {
                                this.updateFormField("branchCode", e.target.value);
                            }}
                        />
                    </FormControl>
                </Grid>

                <Grid item xl={2} lg={2} md={4} sm={10} xs={10}>
                    <BootstrapLabel shrink>
                        SWIFT BIC
                    </BootstrapLabel>
                    <FormControl fullWidth>
                        <BootstrapInputOld
                            id="merchant-name"
                            value={formFields.swiftBic.value}
                            onChange={(e) => {
                                this.updateFormField("swiftBic", e.target.value);
                            }}
                        />
                    </FormControl>
                </Grid>

                <Grid item xl={2} lg={2} md={4} sm={10} xs={10}>
                    <BootstrapLabel shrink required>
                        Name of Bank
                    </BootstrapLabel>
                    <FormControl fullWidth>
                        <BootstrapInputOld
                            id="merchant-name"
                            value={formFields.nameOfBank.value}
                            rules={formFields.nameOfBank.rules}
                            errors={formFields.nameOfBank.errors}
                            onChange={(e) => {
                                this.updateFormField("nameOfBank", e.target.value);
                            }}
                        />
                    </FormControl>
                </Grid>

                <Grid item xl={3} lg={3} md={4} sm={10} xs={10}>
                    <BootstrapLabel shrink required>
                        Type of Account
                    </BootstrapLabel>
                     <Autocomplete
                        size="small"
                        id="merchant-name"
                        options={bankAccountTypes || []}
                        getOptionLabel={(option) => option.description}
                        value={bankAccountTypes.find((v) => v.lookupCode === formFields.typeofAccount.value) || null}
                        onChange={(e, newValue) => this.updateFormField("typeofAccount", (newValue ? newValue.lookupCode : null))}
                        renderInput={(params) => (
                            <BootstrapInputOld
                                {...params}
                                InputProps={{
                                    ...params.InputProps,
                                }}
                                rules={formFields.typeofAccount.rules}
                                value={formFields.typeofAccount.value}
                                errors={formFields.typeofAccount.errors}
                            />
                        )}
                    />
                </Grid>

                <Grid item xl={3} lg={3} md={4} sm={10} xs={10}>
                    <BootstrapLabel shrink>
                        Branch Name
                    </BootstrapLabel>
                    <FormControl fullWidth>
                        <BootstrapInputOld
                            id="merchant-name"
                            value={formFields.branchName.value}
                            onChange={(e) => {
                                this.updateFormField("branchName", e.target.value);
                            }}
                        />
                    </FormControl>
                </Grid>

                <Grid item xl={3} lg={3} md={4} sm={10} xs={10}>
                    <BootstrapLabel shrink required>
                        Address Line1
                    </BootstrapLabel>
                    <FormControl fullWidth>
                        <BootstrapInputOld
                            id="address1"
                            value={formFields.address1.value}
                            rules={formFields.address1.rules}
                            errors={formFields.address1.errors}
                            onChange={(e) => {
                                this.updateFormField("address1", e.target.value);
                            }}
                        />
                    </FormControl>
                </Grid>

                <Grid item xl={3} lg={3} md={4} sm={10} xs={10}>
                    <BootstrapLabel shrink>
                        Address Line2
                    </BootstrapLabel>
                    <FormControl fullWidth>
                        <BootstrapInputOld
                            id="address2"
                            value={formFields.address2.value}
                            onChange={(e) => {
                                this.updateFormField("address2", e.target.value);
                            }}
                        />
                    </FormControl>
                </Grid>

                <Grid item xl={3} lg={3} md={4} sm={10} xs={10}>
                    <BootstrapLabel shrink required>
                        Town/City
                    </BootstrapLabel>
                    <FormControl fullWidth>
                        <BootstrapInputOld
                            id="city"
                            value={formFields.city.value}
                            rules={formFields.city.rules}
                            errors={formFields.city.errors}
                            onChange={(e) => {
                                this.updateFormField("city", e.target.value);
                            }}
                        />
                    </FormControl>
                </Grid>

                <Grid item xl={3} lg={3} md={4} sm={10} xs={10}>
                    <BootstrapLabel shrink>
                        State
                    </BootstrapLabel>
                    <FormControl fullWidth>
                        <BootstrapInputOld
                            id="state"
                            value={formFields.state.value}
                            onChange={(e) => {
                                this.updateFormField("state", e.target.value);
                            }}
                        />
                    </FormControl>
                </Grid>

                <Grid item xl={3} lg={3} md={4} sm={10} xs={10}>
                    <BootstrapLabel shrink required>
                        Post Code
                    </BootstrapLabel>
                    <FormControl fullWidth>
                        <BootstrapInputOld
                            id="postCode"
                            value={formFields.postCode.value}
                            rules={formFields.postCode.rules}
                            errors={formFields.postCode.errors}
                            onChange={(e) => {
                                this.updateFormField("postCode", e.target.value);
                            }}
                        />
                    </FormControl>
                </Grid>
            </Grid>

            <Grid container spacing={2} style={{ marginTop: '1%' }}>
                <Grid item xl={3} lg={3} md={4} sm={10} xs={10}
                    style={{
                        display: 'flex',
                        alignItems: 'end'
                    }}
                >
                    <AppCheckBox
                        id="defaultAccount"
                        label="Make this my default account"
                        checked={(formFields.defaultAccount.value)}
                        onClick={(e) => { this.updateFormField("defaultAccount", e.target.checked); }}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={2} style={{ marginTop: '2%', marginBottom:"9%" }}>
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <Button
                        variant="contained"
                        className='settlementCancelButton'
                        style={style.settlementCancelButton}
                        onClick={this.closeStlForm}
                    >
                        Cancel
                    </Button>
                </Grid>

                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <Button
                        variant="contained"
                        className="settlementSaveButton" style={style.settlementSaveButton}
                        onClick={this.saveSettlementACDetails}
                    >
                        Save
                    </Button>
                </Grid>
            </Grid>
            {/* Settlement Form - end */}

            <AlertDialog
                open={openConfirmPopup}
                cancelBtnLabel="Cancel"
                confirmBtnLabel="Confirm"
                cancelBtnDisabled={disableConfirmBtn}
                confirmBtnDisabled={disableConfirmBtn}
                confirmOnClick={this.deleteMerchantSettlement}
                cancelOnClick={() => this.setState({ openConfirmPopup: false })}
            >
                <Grid container style={{ width: '400px' }}>
                    <Grid item sx={12}>
                        <Typography style={{ color: 'black', fontSize: '20px', fontWeight: 'normal' }} noWrap>
                            Are you sure you want to delete this A/C ?
                        </Typography>
                    </Grid>
                </Grid>
            </AlertDialog>
        </>
    );
}