import React from "react";
import {  Typography ,Grid } from "@material-ui/core";
// import Grid from "@mui/material/Grid";
// import { Typography } from "@mui/material";
import PaymentProvider from "../payment-providers";
import PaymentMethod from "../payment-methods";
import AlertDialog from "components/$widgets/alertDialog";
import Loader from "components/$widgets/loader";

export function html() {
    const {
        paymentProviders,
        paymentMethods,
        settlementCurrency,
        currencyList,
        onboardStatusOptions,
        loading,
        providerEnabled,
        providerFormData,
        paymentMethodFormData,
        activeProviderId,
        openActivatePopup,
        openDeletePopup,
        resetFormFields,
        pmInactivateStatus,
        openErrorActivatePopop,
        errorMessage,
        paymentMethodInvalid,
        merchantId,
        ActMhtconfirmBtnDisable,
        merchantActiveStatus,
        merchantParameterList,
        flagSaveProviderParameters,
    } = this.state;

    return (
        <div>
            <Loader loading={loading} />

            <PaymentProvider
                paymentProviders={paymentProviders}
                updateProviderEnabled={this.updateProviderEnabled}
                updateActiveProviderId={this.updateActiveProviderId}
                setProviderFormData={this.setProviderFormData}
                getProviderFormData={this.getProviderFormData}
                getAllProviderFormData={this.getAllProviderFormData}
                updateProviderFormData={this.updateProviderFormData}
                providerFormData={providerFormData}
                inactivateProviderAndMethod={this.inactivateProviderAndMethod}
                resetFormFields={resetFormFields}
                resetClearFormFlag={this.resetClearFormFlag}
                updatePaymentMethodFormData={this.updatePaymentMethodFormData}
                resetProvider={this.resetProvider}
                merchantActiveStatus={merchantActiveStatus}
                merchantParameterList={merchantParameterList}
                flagSaveProviderParameters={flagSaveProviderParameters}
                resetFlags={this.resetFlags}
            />

            <PaymentMethod
                paymentMethods={paymentMethods}
                merchantId={merchantId}
                settlementCurrency={settlementCurrency}
                currencyList={currencyList}
                onboardStatusOptions={onboardStatusOptions}
                providerEnabled={providerEnabled}
                providerId={activeProviderId}
                paymentMethodFormData={paymentMethodFormData}
                setPaymentMethodFormData={this.setPaymentMethodFormData}
                getPaymentMethodFormData={this.getPaymentMethodFormData}
                getAllPaymentMethodFormData={this.getAllPaymentMethodFormData}
                inactivateProviderAndMethod={this.inactivateProviderAndMethod}
                resetFormFields={resetFormFields}
                resetClearFormFlag={this.resetClearFormFlag}
                updatePaymentMethodFormData={this.updatePaymentMethodFormData}
                resetProvider={this.resetProvider}
                paymentMethodInvalid={paymentMethodInvalid}
                updatePaymentMethodInvalid={this.updatePaymentMethodInvalid}
            />
            
            {/* Activate merchant popup */}
            <AlertDialog
                open={openActivatePopup}
                cancelBtnLabel="Cancel"
                confirmBtnLabel="Confirm"
                confirmBtnDisabled={ActMhtconfirmBtnDisable}
                cancelBtnDisabled={ActMhtconfirmBtnDisable}
                confirmOnClick={this.activateMerchant}
                cancelOnClick={() => this.setState({ openActivatePopup: false })}
            >
                <Grid container style={{ width: '350px' }}>
                    <Grid item sx={12}>
                        <Typography sx={{ color: 'black' }} noWrap>Do you want to activate this merchant?</Typography>
                    </Grid>
                </Grid>
            </AlertDialog>

            {/* Delete popup */}
            <AlertDialog
                open={openDeletePopup}
                cancelBtnLabel="Cancel"
                confirmBtnLabel="Confirm"
                confirmOnClick={this.deleteOnboardData}
                cancelOnClick={() => this.setState({ openDeletePopup: false })}
            >
                <Typography sx={{ color: 'black' }} noWrap>Are you sure you want to delete, All the payment providers and methods?</Typography>
            </AlertDialog>

            {/* Error message popup */}
            <AlertDialog
                open={openErrorActivatePopop}
                title="Note"
                confirmBtnLabel="Ok"
                confirmOnClick={() => this.setState({ openErrorActivatePopop: false , openActivatePopup: false })}
            >
                <Typography sx={{ color: 'black' }} noWrap> Required fields in following tabs need to be provided.</Typography>
                    {this.state.errorMessage && this.state.errorMessage.map((str, index) => (
                        <Typography key={index} sx={{ color: 'black' }} noWrap>{str.trim()}</Typography>
                    ))}
            </AlertDialog>
        </div>
    );
}
