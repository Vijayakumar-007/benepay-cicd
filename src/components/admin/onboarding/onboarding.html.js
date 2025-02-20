import * as React from 'react';
import { BootstrapInput } from 'components/$widgets/form-inputs/BootstrapInput';
// import { Button, Tabs, Tab, CardContent, Typography, Grid } from "@mui/material";
import { Button, Tabs, Tab, CardContent, Typography, Grid } from "@material-ui/core";
import { FormControl } from '@material-ui/core';

//Components
import { BootstrapInputOld } from 'components/$widgets/form-inputs/BootstrapInputOld';

//Onboarding screens
import BasicDetails from './tabs/basic-details-tab/basic-details';
import Logo from './tabs/logo-tab/logo';
import ServicePreference from './tabs/service-preference-tab/service-preference';
import Notification from './tabs/notifications-tab/notification';
import OnboardTab from './tabs/onboard-tab/tab-container';
import Settlement from './tabs/settlement-accounts';
import RevenueSplit from './tabs/revenue-split-tab/revenue-split';
import PaymentMethod from './tabs/payment-methods-tab/payment-method'

//Constants
import { OnboardConstants } from 'config/constants';
import VirtualAccount from './tabs/virtual-accounts/virtual-account';

/**
 * @author Ragavan
 * 
 * Handle the all onboarding components here.
 */

export function html() {

    const {
        selectedTab,
        saveBasicDetails,
        saveMerchantLogo,
        saveServicePreference,
        saveNotification,
        saveOnboard,
        formFields,
        deleteMerchantLogo,
        getBDPreValue,
        getServiceAndPrefePreValue,
        getLogo,
        getNotificationPreValue,
        deleteServiceAndPreference,
        getOnboardingPreValue,
        deleteMerchantBD,
        deleteMerchantND,
        activateMerchant,
        deleteOnboardDetails,
        merchanBDSaveStatus,
        finalButtonConfig,
        merchantActiveStatus,
    } = this.state;

    const { history } = this.props;

    return (
        <>
            <Tabs
                // textColor='primary'
                TabIndicatorProps={{style: {background:'var(--primary-color)'}}}
                value={selectedTab}
                onChange={this.handleTabChange}
                variant="fullWidth"
                style={{ justifyContent: 'center', justifyItems: 'center', display: 'flex', overflowY: 'auto', marginTop: '16px' ,color:'var(--primary-color)' }}
            >
                <Tab
                    label={OnboardConstants.basicDetailsTabLabel}
                    value={OnboardConstants.basicDetailsTabVal}
                    className={`tabStyle ${selectedTab === OnboardConstants.basicDetailsTabVal ? 'selected-tab' : ''}`}

                />
                    
                <Tab
                    label={OnboardConstants.logoTabLabel}
                    value={OnboardConstants.logoTabVal}
                    className={`tabStyle ${selectedTab === OnboardConstants.logoTabVal ? 'selected-tab' : ''}`}
                /> 
                {this.state.selectedMerchantType !== "4" && (
                <Tab
                    label={OnboardConstants.spTabLabel}
                    value={OnboardConstants.spTabVal}
                    className={`tabStyle ${selectedTab === OnboardConstants.spTabVal ? 'selected-tab' : ''}`}
                />
                )}
                {this.state.selectedMerchantType !== "4" && (
                <Tab
                    label={OnboardConstants.notificationTabLabel}
                    value={OnboardConstants.notificationsTabVal}
                    className={`tabStyle ${selectedTab === OnboardConstants.notificationsTabVal ? 'selected-tab' : ''}`}
                />
                )}
                <Tab
                    label={OnboardConstants.settlementTabLabel}
                    value={OnboardConstants.settlementTabVal}
                    className={`tabStyle ${selectedTab === OnboardConstants.settlementTabVal ? 'selected-tab' : ''}`}
                />
                { (this.state.selectedMerchantType !== "4" && this.state.transactionModeBothSelected) && (
                <Tab
                    label={OnboardConstants.virtualACTabLabel}
                    value={OnboardConstants.virtualACTabVal}
                    className={`tabStyle ${selectedTab === OnboardConstants.virtualACTabVal ? 'selected-tab' : ''}`}
                />
                )}
                {this.state.selectedMerchantType !== "4" && (
                <Tab
                    label={OnboardConstants.onboardTabLabel}
                    value={OnboardConstants.onboardTabVal}
                    className={`tabStyle ${selectedTab === OnboardConstants.onboardTabVal ? 'selected-tab' : ''}`}
                />
                )}
                
                {this.state.selectedMerchantType !== "4" && (
                <Tab
                    label={OnboardConstants.revenueTabLabel}
                    value={OnboardConstants.revenueTabVal}
                    className={`tabStyle ${selectedTab === OnboardConstants.revenueTabVal ? 'selected-tab' : ''}`}
                />
                )}

                <Tab
                    label={OnboardConstants.paymentMethodLabel}
                    value={OnboardConstants.paymentMethodTabValue}
                    className={`tabStyle ${selectedTab === OnboardConstants.paymentMethodTabValue ? 'selected-tab' : ''}`}
                />
                
            </Tabs>
            <div>
                <hr className='divider' style={{ border: '1px solid var(--primary-color)', width: '100%', margin: 'unset' }} />
            </div>

            <Grid container style={{marginTop:'1%'}} paddingLeft={2}>
                <Grid item xs={3} style={{display:"flex",flexDirection:"row"}}>
                <Typography style={{ color: 'rgb(84 84 84)', fontSize: '20px', fontWeight: '600', whiteSpace:'nowrap', marginRight:"2%"}}>

                {`${formFields.merchantId.value && !merchanBDSaveStatus ? "Customer Id - " : "Customer Id * -"}${this.state.selectedMerchantType === "4" && !merchanBDSaveStatus ? " RP" : ""}`}
                
                 </Typography>
                    {formFields.merchantId.value && merchanBDSaveStatus ?
                        (
                        <Typography style={{ color: 'rgb(84 84 84)', fontSize: '20px', fontWeight: '600' }}>{formFields.merchantId.value}</Typography>
                    )
                        : (
                            <FormControl fullWidth>
                                <BootstrapInputOld
                                    id="merchant-Id"
                                    value={formFields.merchantId.value}
                                    rules={formFields.merchantId.rules}
                                    errors={formFields.merchantId.errors}
                                    onChange={(e) => {
                                        this.updateFormField("merchantId", e.target.value);
                                    }}
                                    onBlur={(e) => { this.updateFormField("merchantId", e.target.value); this.validateMerchantIdIsUnique(); }}
                                />
                            </FormControl>
                        )
                    }

                </Grid>
            </Grid>

            <CardContent style={{paddingLeft:'0px',paddingRight:'0px'}}>

                {selectedTab === OnboardConstants.basicDetailsTabVal && (
                    <BasicDetails
                        ref={(ref) => {
                            var strValue = "refTo" + OnboardConstants.basicDetailsTabVal;
                            return this[strValue] = ref;
                        }}
                        merchantId={formFields.merchantId.value}
                        saveBD={saveBasicDetails}
                        saveCallback={this.saveCallback}
                        getPreValue={getBDPreValue}
                        getPreValueCallback={this.getPreValueCallback}
                        saveResponse={this.saveResponse}
                        deleteMerchantBD={deleteMerchantBD}
                        deleteCallback={this.deleteCallBack}
                        resetBtnConfigFlag={this.resetBtnConfigFlag}
                        getMerchantTypeForTabChange={this.handleMerchantTypeChange}
                        merchantActiveStatus={this.state.merchantActiveStatus}
                        

                    />
                )}
                {selectedTab === OnboardConstants.logoTabVal && (
                    <Logo
                        ref={(ref) => {
                            var strValue = "refTo" + OnboardConstants.logoTabVal;
                            return this[strValue] = ref;
                        }}
                        merchantId={formFields.merchantId.value}
                        saveImg={saveMerchantLogo}
                        saveImgCallback={this.saveCallback}
                        imgSaveResponse={this.saveResponse}
                        deleteLogo={deleteMerchantLogo}
                        deleteImgCallback={this.deleteCallBack}
                        getPreValueOfLogo={getLogo}
                        getPreValueCallback={this.getPreValueCallback}
                        resetBtnConfigFlag={this.resetBtnConfigFlag}
                    />
                )}
                {selectedTab === OnboardConstants.spTabVal && (
                    <ServicePreference
                        ref={(ref) => {
                            var strValue = "refTo" + OnboardConstants.spTabVal;
                            return this[strValue] = ref;
                        }}
                        merchantId={formFields.merchantId.value}
                        getSPPreValue={getServiceAndPrefePreValue}
                        getSPPreValueCallback={this.getPreValueCallback}
                        saveSP={saveServicePreference}
                        saveSPCallback={this.saveCallback}
                        sPSaveResponse={this.saveResponse}
                        delete={deleteServiceAndPreference}
                        spDeleteCallback={this.deleteCallBack}
                        resetBtnConfigFlag={this.resetBtnConfigFlag}
                        merchantActiveStatus={this.state.merchantActiveStatus}
                        onTransactionModeChange={this.handleTransactionModeChange}
                    />
                )}

                {selectedTab === OnboardConstants.notificationsTabVal && (
                    <Notification
                        ref={(ref) => {
                            var strValue = "refTo" + OnboardConstants.notificationsTabVal;
                            return this[strValue] = ref;
                        }}
                        merchantId={formFields.merchantId.value}
                        saveNtn={saveNotification}
                        saveNtnCallback={this.saveCallback}
                        notificationSaveResponse={this.saveResponse}
                        getNotificationPreValue={getNotificationPreValue}
                        getPreValueCallback={this.getPreValueCallback}
                        deleteMerchantND={deleteMerchantND}
                        nddeleteCallback={this.deleteCallBack}
                        resetBtnConfigFlag={this.resetBtnConfigFlag}
                    />
                )}
                
                {selectedTab === OnboardConstants.settlementTabVal && (
                    <Settlement
                        merchantId={formFields.merchantId.value}
                    />
                )}

                {selectedTab === OnboardConstants.onboardTabVal && (
                    <OnboardTab
                        ref={(ref) => {
                            var strValue = "refTo" + OnboardConstants.onboardTabVal;
                            return this[strValue] = ref;
                        }}
                        merchantId={formFields.merchantId.value}
                        saveOnBoard={saveOnboard}
                        saveMerchantOnboardingCallback={this.saveCallback}
                        saveResForMerchantOnboarding={this.saveResponse}
                        getValue={getOnboardingPreValue}
                        getPreValueCallback={this.getPreValueCallback}
                        activateMerchant={activateMerchant}
                        activateMerchantCallBack={this.activateCallBack}
                        deleteOnboardOTD={deleteOnboardDetails}
                        obdeleteCallback={this.deleteCallBack}
                        resetBtnConfigFlag={this.resetBtnConfigFlag}
                        history={history}
                        merchantActiveStatus={merchantActiveStatus}
                    />
                )}
                {/* Revenue Split Screens */}
                {selectedTab === OnboardConstants.revenueTabVal && (
                    <RevenueSplit
                        ref={(ref) => {
                            var strValue = "refTo" + OnboardConstants.onboardTabVal;
                            return this[strValue] = ref;
                        }}
                        merchantId={formFields.merchantId.value}
                        saveOnBoard={saveOnboard}
                        saveMerchantOnboardingCallback={this.saveCallback}
                        saveResForMerchantOnboarding={this.saveResponse}
                        getValue={getOnboardingPreValue}
                        getPreValueCallback={this.getPreValueCallback}
                        activateMerchant={activateMerchant}
                        activateMerchantCallBack={this.activateCallBack}
                        deleteOnboardOTD={deleteOnboardDetails}
                        obdeleteCallback={this.deleteCallBack}
                        resetBtnConfigFlag={this.resetBtnConfigFlag}
                        history={history}
                    />
                )}

                {selectedTab === "virtualAccount" && (
                    <VirtualAccount
                        ref={(ref) => {
                            var strValue = "refToVirtualAccount";
                            return this[strValue] = ref;
                        }}
                        merchantId={formFields.merchantId.value}
                        saveVA={this.state.saveVA}
                        saveCallback={this.saveCallback}
                    />
                )}
                
                {selectedTab === OnboardConstants.paymentMethodTabValue && (
                    <PaymentMethod
                        merchantId={formFields.merchantId.value}
                    />
                    )}

                <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Grid container spacing={2}>
                        {
                            finalButtonConfig[selectedTab] && finalButtonConfig[selectedTab].length > 0 ? (
                                finalButtonConfig[selectedTab].map((button, index) => (
                                    button.label && button.onClick ?
                                        <Grid item xl={4} lg={4} md={4} sm={4} xs={12} key={index}>
                                            <Button
                                                variant="contained"
                                                style={{ width:'56%', textTransform: 'unset' ,background:"var(--primary-color)",color:'white'}}
                                                onClick={button.onClick}
                                            >
                                                {button.label}
                                            </Button>
                                        </Grid>
                                    :''
                                ))
                            ) : ""
                        }
                    </Grid>
                </div>

            </CardContent>
        </ >
    );
}
