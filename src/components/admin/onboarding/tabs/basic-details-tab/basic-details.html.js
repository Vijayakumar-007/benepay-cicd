import React from "react";
import {Card,CardContent,Typography,Grid,Checkbox,FormControl} from "@material-ui/core";
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import Typography from "@mui/material/Typography";
// import Grid from "@mui/material/Grid";
// import Checkbox from "@mui/material/Checkbox";
// import FormControl from "@mui/material/FormControl";
import { BootstrapInputOld } from "../../../../$widgets/form-inputs/BootstrapInputOld";
import { withStyles } from "@material-ui/styles";
import { FormControlLabel, InputLabel } from '@material-ui/core';
import MUIPhoneInput from "../../../../$widgets/form-inputs/MUIPhoneInput";
// import { Tabs, Tab, Autocomplete, Box, Stack } from '@mui/material';
import { Tabs, Tab, Box, Stack } from '@material-ui/core';
import {  Autocomplete } from '@material-ui/lab';
import "./basic-details.scss"
import AlertDialog from "components/$widgets/alertDialog";
import Loader from "components/$widgets/loader";
import Validator from "service/core/validator";
import { BootstrapLabel } from "components/$widgets/form-inputs/BootstrapLabel";
import { AppCheckBox } from "components/$widgets/form-inputs";
import { OnboardConstants } from "config/constants";
import  AddIndustry  from  "./support-component/addIndustry.js";


export function html() {
    const {
        value,
        selectedTab,
        formData,
        formFields,
        loading,
        merchantNamePrefix,
        merchantCountry,
        merchantTypeOptions,
        merchantIndustryList,
        openBDdeletepopup,
        parentMerchantList,
        referralPartners,
        fetchBDloading,
        disableDeleteConfirmBtn,
        showAddIndustry,
    } = this.state;

    


    return (
        <div>
            <Loader loading={loading || fetchBDloading} />
            <Loader loading={this.state.loadingForParentList} />
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Card style={{ boxShadow: '0 0 4px 4px rgba(0, 0, 0, 0.1)' }}>
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <BootstrapLabel required shrink  htmlFor="" style={{ whiteSpace: 'nowrap' }} >
                                        Customer Type
                                    </BootstrapLabel>
                                    <Autocomplete
                                        id="merchant-type"
                                        size="small"
                                        options={merchantTypeOptions || []}
                                        getOptionLabel={(option) => option.description}
                                        value={merchantTypeOptions.find((v) => v.lookupCode === formFields.merchantType.value) || null}
                                        onChange={(e, newValue) => this.updateFormField("merchantType", (newValue ? newValue.lookupCode : null))}
                                        renderInput={(params) => (
                                            <BootstrapInputOld
                                                {...params}
                                                InputProps={{
                                                    ...params.InputProps,
                                                }}
                                                rules={formFields.merchantType.rules}
                                                value={formFields.merchantType.value}
                                                errors={formFields.merchantType.errors}
                                            />
                                        )}
                                        disabled={this.state.formFields.activeStatus.value == OnboardConstants.ActiveStatus}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <BootstrapLabel shrink required htmlFor="">
                                        Customer name
                                    </BootstrapLabel>
                                    <FormControl fullWidth>
                                        <BootstrapInputOld
                                            id="merchant-name"
                                            value={formFields.merchantName.value}
                                            errors={formFields.merchantName.errors}
                                            onChange={(e) => {
                                                this.updateFormField("merchantName", e.target.value);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <BootstrapLabel shrink required htmlFor="" style={{ whiteSpace: 'nowrap' }} >
                                        Country
                                    </BootstrapLabel>
                                    <Autocomplete
                                        // disablePortal
                                        size="small"
                                        id="country"
                                        options={merchantCountry || []}
                                        getOptionLabel={(option) => option.description}
                                        value={merchantCountry.find((v) => v.lookupCode === formFields.country.value) || null}
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
                                

                                <Grid item xs={6} sm={6} md={3}>
                                    <BootstrapLabel shrink required htmlFor="" style={{ whiteSpace: 'nowrap' }}>
                                        Industry  
                                    </BootstrapLabel>
                                    <FormControl fullWidth>
                                        <Autocomplete
                                            id="industry"
                                            size="small"
                                            options={[{ lookupCode: 'add-industry', description: ''}, ...merchantIndustryList ]}
                                            renderOption={this.renderOption}
                                            getOptionLabel={(option) => option.description}
                                            value={merchantIndustryList.find((v) => v.lookupCode === formFields.industry.value && v.lookupCode !== 'add-industry') || null}
                                            onChange ={ (e, newValue) => {
                                                this.handleIndustryChange(e, newValue)
                                            }}
                                            renderInput={(params) => (
                                                <BootstrapInputOld
                                                    {...params}
                                                    InputProps={{
                                                        ...params.InputProps,
                                                    }}
                                                    rules={formFields.industry.rules}
                                                    value={formFields.industry.value != 'add-industry' ? formFields.industry.value: "" }
                                                    errors={formFields.industry.errors}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                     {showAddIndustry && (
                                     <AddIndustry 
                                     getMerchantIndustrys={this.getMerchantIndustrys}
                                     enable={true}
                                     handleOnClose = {() => this.setState({ showAddIndustry: false })}
                                       />
                                      )}
                                </Grid>

                                <Grid item xs={12} sm={6} md={12}>
                                    <Grid container spacing={2} >
                                        <Grid item xs={6} sm={6} md={3}>
                                            <BootstrapLabel shrink required htmlFor="" style={{ whiteSpace: 'nowrap' }}>
                                                Registration No
                                            </BootstrapLabel>
                                            <FormControl fullWidth>
                                                <BootstrapInputOld
                                                    id="registrationNo"
                                                    value={formFields.registrationNo.value}
                                                    errors={formFields.registrationNo.errors}
                                                    onChange={(e) => {
                                                        this.updateFormField("registrationNo", e.target.value);
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <BootstrapLabel shrink required htmlFor="">
                                                Merchant short name
                                            </BootstrapLabel>
                                            <FormControl fullWidth>
                                                <BootstrapInputOld
                                                    id="merchant-short-name"
                                                    value={formFields.merchantShortName.value}
                                                    errors={formFields.merchantShortName.errors}
                                                    onChange={(e) => {
                                                        this.updateFormField("merchantShortName", e.target.value);
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        {(this.state.formFields.merchantType.value !== "4") && (
                                            <Grid item xs={6} sm={6} md={3}>
                                                <BootstrapLabel shrink htmlFor="" style={{ whiteSpace: 'nowrap' }}>
                                                    Parent customer
                                                </BootstrapLabel>
                                                <FormControl fullWidth>
                                                    <Autocomplete
                                                        id="parentCustomer"
                                                        size="small"
                                                        options={parentMerchantList || []}
                                                        getOptionLabel={(option) => option.merchantId}
                                                        value={parentMerchantList.find((v) => v.merchantId === formFields.parentCustomer.value) || null}
                                                        onChange={(e, newValue) => this.updateFormField("parentCustomer", (newValue ? newValue.merchantId : null))}
                                                        renderInput={(params) => (
                                                            <BootstrapInputOld
                                                                {...params}
                                                                InputProps={{
                                                                    ...params.InputProps,
                                                                }}
                                                                value={formFields.parentCustomer.value}
                                                            />
                                                        )}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        )}
                                        {(this.state.formFields.merchantType.value !== "4") && (
                                            <Grid item xs={6} sm={6} md={3}>
                                                <BootstrapLabel shrink htmlFor="" style={{ whiteSpace: 'nowrap' }}>
                                                    Referred by
                                                </BootstrapLabel>
                                                <FormControl fullWidth>
                                                    <Autocomplete
                                                        id="referralPartner"
                                                        size="small"
                                                        options={referralPartners || []}
                                                        getOptionLabel={(option) => option.merchantId}
                                                        value={referralPartners.find((v) => v.merchantId === formFields.referralPartner.value) || null}
                                                        onChange={(e, newValue) => this.updateFormField("referralPartner", (newValue ? newValue.merchantId : null))}
                                                        renderInput={(params) => (
                                                            <BootstrapInputOld
                                                                {...params}
                                                                InputProps={{
                                                                    ...params.InputProps,
                                                                }}
                                                                // rules={formFields.referralPartner.rules}
                                                                value={formFields.referralPartner.value}
                                                            // errors={formFields.referralPartner.errors}
                                                            />
                                                        )}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        )}
                                       
                                    </Grid>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid>
                <Tabs
                    TabIndicatorProps={{style: {background:'var(--primary-color)'}}}
                    value={selectedTab}
                    onChange={this.handleTabChange}
                    variant="fullWidth"
                    style={{ justifyContent: 'center', justifyItems: 'center', display: 'flex', overflowY: 'auto', marginTop: '16px' }}
                >
                    <Tab
                        label="Address"
                        className={`tabStyle ${selectedTab === 0 ? 'selected-tab' : ''}`}

                    />
                    <Tab
                        label="Contact"
                        className={`tabStyle ${selectedTab === 0 ? 'selected-tab' : ''}`}
                    />

                </Tabs>
                {/* Tab Content */}
                {selectedTab === 0 && (
                    <div>
                        <Typography variant="h6" style={{ color: 'var(--primary-color)', paddingTop: '1%' }}>
                            Trading Address
                        </Typography>
                        <Grid container spacing={2} >

                            <Grid item xs={12}>
                                <Card style={{ boxShadow: '0 0 4px 4px rgba(0, 0, 0, 0.1)' }}>
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <BootstrapLabel shrink required htmlFor="">
                                                    Address Line1
                                                </BootstrapLabel>
                                                <FormControl fullWidth>
                                                    <BootstrapInputOld
                                                        id="tradingAddressLine1"
                                                        value={formFields.tradingAddressLine1.value}
                                                        errors={formFields.tradingAddressLine1.errors}
                                                        onChange={(e) => {
                                                            this.updateFormField("tradingAddressLine1", e.target.value);
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <BootstrapLabel shrink htmlFor="">
                                                    Address Line2
                                                </BootstrapLabel>
                                                <FormControl fullWidth>
                                                    <BootstrapInputOld
                                                        id="tradingAddressLine2"
                                                        value={formFields.tradingAddressLine2.value}
                                                        onChange={(e) => {
                                                            this.updateFormField("tradingAddressLine2", e.target.value);
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <BootstrapLabel shrink required htmlFor=""
                                                    style={{ whiteSpace: 'nowrap' }}>
                                                    Town/City
                                                </BootstrapLabel>
                                                <FormControl fullWidth>
                                                    <BootstrapInputOld
                                                        id="townOrCity"
                                                        value={formFields.townOrCity.value}
                                                        errors={formFields.townOrCity.errors}
                                                        onChange={(e) => {
                                                            this.updateFormField("townOrCity", e.target.value);
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={12}>
                                                <Grid container spacing={2} >
                                                    <Grid item xs={4} sm={6} md={3}>
                                                        <BootstrapLabel shrink required htmlFor="" style={{ whiteSpace: 'nowrap' }}>
                                                            Post Code
                                                        </BootstrapLabel>
                                                        <FormControl fullWidth>
                                                            <BootstrapInputOld
                                                                id="postCode"
                                                                value={formFields.postCode.value}
                                                                errors={formFields.postCode.errors}
                                                                onChange={(e) => {
                                                                    e.preventDefault();
                                                                    
                                                                    this.updateFormField("postCode", e.target.value.replace(/[^a-zA-Z0-9]/g, ''));
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={4} sm={6} md={3}>
                                                        <BootstrapLabel shrink htmlFor="" style={{ whiteSpace: 'nowrap' }}>
                                                            State/County
                                                        </BootstrapLabel>
                                                        <FormControl fullWidth>
                                                            <BootstrapInputOld
                                                                id="stateOrCounty"
                                                                value={formFields.stateOrCounty.value}
                                                                errors={formFields.stateOrCounty.errors}
                                                                onChange={(e) => {
                                                                    this.updateFormField("stateOrCounty", e.target.value);
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={4} sm={6} md={3}>
                                                        <BootstrapLabel shrink required htmlFor="" style={{ whiteSpace: 'nowrap' }}>
                                                            Country
                                                        </BootstrapLabel>
                                                        <Autocomplete
                                                            // disablePortal
                                                            size="small"
                                                            id="countryForTradingAddress"
                                                            options={merchantCountry || []}
                                                            getOptionLabel={(option) => option.description}
                                                            value={merchantCountry.find((v) => v.lookupCode === formFields.countryForTradingAddress.value) || null}
                                                            onChange={(e, newValue) => this.updateFormField("countryForTradingAddress", (newValue ? newValue.lookupCode : null))}
                                                            renderInput={(params) => (
                                                                <BootstrapInputOld
                                                                    {...params}
                                                                    InputProps={{
                                                                        ...params.InputProps,
                                                                    }}
                                                                    rules={formFields.countryForTradingAddress.rules}
                                                                    value={formFields.countryForTradingAddress.value}
                                                                    errors={formFields.countryForTradingAddress.errors}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Grid>

                                            <Grid item xs={12} sm={6} md={3}>
                                                <BootstrapLabel shrink htmlFor="" style={{ whiteSpace: 'nowrap' }}>
                                                    Phone Number
                                                </BootstrapLabel>
                                                <FormControl fullWidth>
                                                    <MUIPhoneInput
                                                        id="mobileForTradingAddress"
                                                        defaultCountry='in'
                                                        countryCodeEditable={false}
                                                        disableAreaCodes={true}
                                                        rules={formFields.mobileForTradingAddress.rules}
                                                        value={formFields.mobileForTradingAddress.value}
                                                        errors={formFields.mobileForTradingAddress.errors}
                                                        onChange={(e, v) => {
                                                            console.log(v);
                                                            this.updateFormField("mobileCountryCodeForTradingAddress", v.dialCode, false);
                                                        }}
                                                        onBlur={(e) => {
                                                            let value = e.target.value;

                                                            var cCode = formFields.mobileCountryCodeForTradingAddress.value;

                                                            this.handleMobileTabOut( "mobileForTradingAddress", value, cCode );
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>

                                            <Grid item xs={12} sm={6} md={12}>
                                                <Typography variant="h6" style={{ color: 'var(--primary-color)', paddingTop: '1%' }}>
                                                    Registered Address
                                                </Typography>
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <AppCheckBox
                                                        checked={this.state.sameAsTradingAddress}
                                                        onClick={this.handleCheckboxChange}
                                                        name="sameAsTradingAddress"
                                                        label="Same as Trading Address"
                                                    />
                                                </Grid>
                                                {!this.state.sameAsTradingAddress && (
                                                    <Grid item xs={12}>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} sm={6} md={3}>
                                                                <BootstrapLabel shrink required htmlFor="">
                                                                    Address Line1
                                                                </BootstrapLabel>
                                                                <FormControl fullWidth>
                                                                    <BootstrapInputOld
                                                                        id="regAddressLine1"
                                                                        value={formFields.regAddressLine1.value}
                                                                        errors={formFields.regAddressLine1.errors}
                                                                        onChange={(e) => {
                                                                            this.updateFormField("regAddressLine1", e.target.value);
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6} md={3}>
                                                                <BootstrapLabel shrink htmlFor="">
                                                                    Address Line2
                                                                </BootstrapLabel>
                                                                <FormControl fullWidth>
                                                                    <BootstrapInputOld
                                                                        id="regAddressLine2"
                                                                        value={formFields.regAddressLine2.value}
                                                                        errors={formFields.regAddressLine2.errors}
                                                                        onChange={(e) => {
                                                                            this.updateFormField("regAddressLine2", e.target.value);
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6} md={3}>
                                                                <BootstrapLabel shrink required htmlFor=""
                                                                    style={{ whiteSpace: 'nowrap' }}>
                                                                    Town/City
                                                                </BootstrapLabel>
                                                                <FormControl fullWidth>
                                                                    <BootstrapInputOld
                                                                        id="townOrCityForRegAddress"
                                                                        value={formFields.townOrCityForRegAddress.value}
                                                                        errors={formFields.townOrCityForRegAddress.errors}
                                                                        onChange={(e) => {
                                                                            this.updateFormField("townOrCityForRegAddress", e.target.value);
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6} md={12}>
                                                                <Grid container spacing={2} >
                                                                    <Grid item xs={4} sm={6} md={3}>
                                                                        <BootstrapLabel shrink required htmlFor="" style={{ whiteSpace: 'nowrap' }}>
                                                                            Post Code
                                                                        </BootstrapLabel>
                                                                        <FormControl fullWidth>
                                                                            <BootstrapInputOld
                                                                                type={Validator.isPositiveNumber}
                                                                                id="postCodeForRegAddress"
                                                                                value={formFields.postCodeForRegAddress.value}
                                                                                errors={formFields.postCodeForRegAddress.errors}
                                                                                onChange={(e) => {
                                                                                    this.updateFormField("postCodeForRegAddress", e.target.value.replace(/[^a-zA-Z0-9]/g, ''));
                                                                                }}
                                                                            />
                                                                        </FormControl>
                                                                    </Grid>
                                                                    <Grid item xs={4} sm={6} md={3}>
                                                                        <BootstrapLabel shrink htmlFor="" style={{ whiteSpace: 'nowrap' }}>
                                                                            State/Country
                                                                        </BootstrapLabel>
                                                                        <FormControl fullWidth>
                                                                            <BootstrapInputOld
                                                                                id="stateOrCountryForRegAddress"
                                                                                value={formFields.stateOrCountryForRegAddress.value}
                                                                                errors={formFields.stateOrCountryForRegAddress.errors}
                                                                                onChange={(e) => {
                                                                                    this.updateFormField("stateOrCountryForRegAddress", e.target.value);
                                                                                }}
                                                                            />
                                                                        </FormControl>
                                                                    </Grid>
                                                                    <Grid item xs={4} sm={6} md={3}>
                                                                        <BootstrapLabel shrink required htmlFor="" style={{ whiteSpace: 'nowrap' }}>
                                                                            Country
                                                                        </BootstrapLabel>
                                                                        <Autocomplete
                                                                            // disablePortal
                                                                            size="small"
                                                                            id="countryForRegAddress"
                                                                            options={merchantCountry || []}
                                                                            getOptionLabel={(option) => option.description}
                                                                            value={merchantCountry.find((v) => v.lookupCode === formFields.countryForRegAddress.value) || null}
                                                                            onChange={(e, newValue) => this.updateFormField("countryForRegAddress", (newValue ? newValue.lookupCode : null))}
                                                                            renderInput={(params) => (
                                                                                <BootstrapInputOld
                                                                                    {...params}
                                                                                    InputProps={{
                                                                                        ...params.InputProps,
                                                                                    }}
                                                                                    rules={formFields.countryForRegAddress.rules}
                                                                                    value={formFields.countryForRegAddress.value}
                                                                                    errors={formFields.countryForRegAddress.errors}
                                                                                />
                                                                            )}
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>

                                                            <Grid item xs={12} sm={6} md={3}>
                                                                <BootstrapLabel shrink htmlFor="" style={{ whiteSpace: 'nowrap' }}>
                                                                    Phone Number
                                                                </BootstrapLabel>
                                                                <FormControl fullWidth>
                                                                    <MUIPhoneInput
                                                                        id="mobileForRegAddress"
                                                                        defaultCountry='in'
                                                                        countryCodeEditable={false}
                                                                        disableAreaCodes={true}
                                                                        value={formFields.mobileForRegAddress.value}
                                                                        rules={formFields.mobileForRegAddress.rules}
                                                                        errors={formFields.mobileForRegAddress.errors}
                                                                        onChange={(e, v) => {
                                                                            this.updateFormField("mobileCountryCodeForRegAddress", v.dialCode, false);
                                                                        }}
                                                                        onBlur={(e) => {
                                                                            let value = e.target.value;

                                                                            var cCode = formFields.mobileCountryCodeForRegAddress.value;

                                                                            this.handleMobileTabOut( "mobileForRegAddress", value, cCode );
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                )}
                                            </Grid>

                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </div>
                )}
                {selectedTab === 1 && (
                    <div>
                        <Typography variant="h6" style={{ color: 'var(--primary-color)', paddingTop: '1%' }}>
                            Primary Contact
                        </Typography>
                        <Grid container spacing={2} >

                            <Grid item xs={12}>
                                <Card style={{ boxShadow: '0 0 4px 4px rgba(0, 0, 0, 0.1)' }}>
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <BootstrapLabel shrink htmlFor="">
                                                    Prefix
                                                </BootstrapLabel>

                                                <Autocomplete
                                                    id="prefixForPrimaryContact"
                                                    size="small"
                                                    options={merchantNamePrefix || []}
                                                    getOptionLabel={(option) => option.lookupCode}
                                                    value={merchantNamePrefix.find((v) => v.lookupCode === formFields.prefixForPrimaryContact.value)}
                                                    onChange={(e, newValue) => this.updateFormField("prefixForPrimaryContact", (newValue ? newValue.lookupCode : null))}
                                                    renderInput={(params) => (
                                                        <BootstrapInputOld
                                                            {...params}
                                                            InputProps={{
                                                                ...params.InputProps,
                                                            }}
                                                            value={formFields.prefixForPrimaryContact.value}
                                                            errors={formFields.prefixForPrimaryContact.errors}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <BootstrapLabel shrink htmlFor="">
                                                    First Name
                                                </BootstrapLabel>
                                                <FormControl fullWidth>
                                                    <BootstrapInputOld
                                                        id="firstNameForPrimaryContact"
                                                        value={formFields.firstNameForPrimaryContact.value}
                                                        errors={formFields.firstNameForPrimaryContact.errors}
                                                        onChange={(e) => {
                                                            this.updateFormField("firstNameForPrimaryContact", e.target.value);
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <BootstrapLabel shrink htmlFor=""
                                                    style={{ whiteSpace: 'nowrap' }}>
                                                    Surname
                                                </BootstrapLabel>
                                                <FormControl fullWidth>
                                                    <BootstrapInputOld
                                                        id="surnameForPrimaryContact"
                                                        value={formFields.surnameForPrimaryContact.value}
                                                        errors={formFields.surnameForPrimaryContact.errors}
                                                        onChange={(e) => {
                                                            this.updateFormField("surnameForPrimaryContact", e.target.value);
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={12}>
                                                <Grid container spacing={2} >
                                                    <Grid item xs={4} sm={6} md={3}>
                                                        <BootstrapLabel shrink htmlFor="" style={{ whiteSpace: 'nowrap' }}>
                                                            Email
                                                        </BootstrapLabel>
                                                        <FormControl fullWidth>
                                                            <BootstrapInputOld
                                                                id="emailForPrimaryContact"
                                                                value={formFields.emailForPrimaryContact.value}
                                                                errors={formFields.emailForPrimaryContact.errors}
                                                                onChange={(e) => {
                                                                    this.updateFormField("emailForPrimaryContact", e.target.value);
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={4} sm={6} md={3}>
                                                        <BootstrapLabel shrink htmlFor="" style={{ whiteSpace: 'nowrap' }}>
                                                            Designation
                                                        </BootstrapLabel>
                                                        <FormControl fullWidth>
                                                            <BootstrapInputOld
                                                                id="designationForPrimaryContact"
                                                                value={formFields.designationForPrimaryContact.value}
                                                                errors={formFields.designationForPrimaryContact.errors}
                                                                onChange={(e) => {
                                                                    this.updateFormField("designationForPrimaryContact", e.target.value);
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={4} sm={6} md={3}>
                                                        <BootstrapLabel shrink htmlFor="" style={{ whiteSpace: 'nowrap' }}>
                                                            Mobile Number
                                                        </BootstrapLabel>
                                                        <FormControl fullWidth>
                                                            <MUIPhoneInput
                                                                defaultCountry='in'
                                                                id="mobileForPrimaryContact"
                                                                countryCodeEditable={false}
                                                                disableAreaCodes={true}
                                                                value={formFields.mobileForPrimaryContact.value}
                                                                rules={formFields.mobileForPrimaryContact.rules}
                                                                errors={formFields.mobileForPrimaryContact.errors}
                                                                onChange={(e, v) => {
                                                                    this.updateFormField("mobileCountryForPrimaryContact", v.dialCode, false);
                                                                }}
                                                                onBlur={(e) => {
                                                                    let value = e.target.value;

                                                                    var cCode = formFields.mobileCountryForPrimaryContact.value;

                                                                    this.handleMobileTabOut( "mobileForPrimaryContact", value, cCode );
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        <Typography variant="h6" style={{ color: 'var(--primary-color)', paddingTop: '1%' }}>
                            Secondary Contact
                        </Typography>
                        <Grid container spacing={2} >

                            <Grid item xs={12}>
                                <Card style={{ boxShadow: '0 0 4px 4px rgba(0, 0, 0, 0.1)' }}>
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6} md={3} >
                                                <BootstrapLabel shrink htmlFor="">
                                                    Prefix
                                                </BootstrapLabel>
                                                <Autocomplete
                                                    id="prefixForSecondaryContact"
                                                    size="small"
                                                    options={merchantNamePrefix || []}
                                                    getOptionLabel={(option) => option.lookupCode}
                                                    value={merchantNamePrefix.find((v) => v.lookupCode === formFields.prefixForSecondaryContact.value)}
                                                    onChange={(e, newValue) => this.updateFormField("prefixForSecondaryContact", (newValue ? newValue.lookupCode : null))}
                                                    renderInput={(params) => (
                                                        <BootstrapInputOld
                                                            {...params}
                                                            InputProps={{
                                                                ...params.InputProps,
                                                            }}
                                                            value={formFields.prefixForSecondaryContact.value}
                                                            errors={formFields.prefixForSecondaryContact.errors}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <BootstrapLabel shrink htmlFor="">
                                                    First Name
                                                </BootstrapLabel>
                                                <FormControl fullWidth>
                                                    <BootstrapInputOld
                                                        id="firstNameForSecondaryContact"
                                                        value={formFields.firstNameForSecondaryContact.value}
                                                        errors={formFields.firstNameForSecondaryContact.errors}
                                                        onChange={(e) => {
                                                            this.updateFormField("firstNameForSecondaryContact", e.target.value);
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <BootstrapLabel shrink htmlFor=""
                                                    style={{ whiteSpace: 'nowrap' }}>
                                                    Surname
                                                </BootstrapLabel>
                                                <FormControl fullWidth>
                                                    <BootstrapInputOld
                                                        id="surNameForSecondaryContact"
                                                        value={formFields.surNameForSecondaryContact.value}
                                                        errors={formFields.surNameForSecondaryContact.errors}
                                                        onChange={(e) => {
                                                            this.updateFormField("surNameForSecondaryContact", e.target.value);
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={12}>
                                                <Grid container spacing={2} >
                                                    <Grid item xs={4} sm={6} md={3}>
                                                        <BootstrapLabel shrink htmlFor="" style={{ whiteSpace: 'nowrap' }}>
                                                            Email
                                                        </BootstrapLabel>
                                                        <FormControl fullWidth>
                                                            <BootstrapInputOld
                                                                id="emailForSecondaryContact"
                                                                value={formFields.emailForSecondaryContact.value}
                                                                errors={formFields.emailForSecondaryContact.errors}
                                                                onChange={(e) => {
                                                                    this.updateFormField("emailForSecondaryContact", e.target.value);
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={4} sm={6} md={3}>
                                                        <BootstrapLabel shrink htmlFor="" style={{ whiteSpace: 'nowrap' }}>
                                                            Designation
                                                        </BootstrapLabel>
                                                        <FormControl fullWidth>
                                                            <BootstrapInputOld
                                                                id="designationForSecondaryContact"
                                                                value={formFields.designationForSecondaryContact.value}
                                                                errors={formFields.designationForSecondaryContact.errors}
                                                                onChange={(e) => {
                                                                    this.updateFormField("designationForSecondaryContact", e.target.value);
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={4} sm={6} md={3}>
                                                        <BootstrapLabel shrink htmlFor="" style={{ whiteSpace: 'nowrap' }}>
                                                            Mobile Number
                                                        </BootstrapLabel>
                                                        <FormControl fullWidth>
                                                            <MUIPhoneInput
                                                                defaultCountry='in'
                                                                id="mobileForSecondaryContact"
                                                                countryCodeEditable={false}
                                                                disableAreaCodes={true}
                                                                value={formFields.mobileForSecondaryContact.value}
                                                                rules={formFields.mobileForSecondaryContact.rules}
                                                                errors={formFields.mobileForSecondaryContact.errors}
                                                                onChange={(e, v) => {
                                                                    this.updateFormField("mobileCountryForSecondaryContact", v.dialCode, false);
                                                                }}
                                                                onBlur={(e) => {
                                                                    let value = e.target.value;

                                                                    var cCode = formFields.mobileCountryForSecondaryContact.value;
                                                            
                                                                    this.handleMobileTabOut( "mobileForSecondaryContact", value, cCode );
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </div>
                )}
            </Grid>

            <AlertDialog
                open={openBDdeletepopup}
                cancelBtnLabel="Cancel"
                confirmBtnLabel="Confirm"
                confirmOnClick={this.deleteBD}
                cancelOnClick={() => this.setState({ openBDdeletepopup: false })}
                cancelBtnDisabled = {disableDeleteConfirmBtn}
                confirmBtnDisabled = {disableDeleteConfirmBtn}
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
