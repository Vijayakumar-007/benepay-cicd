import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import { Tabs, Tab, Stack, Box, FormLabel } from "@mui/material";
import CardTypeContainer from "./cardtype/container";
import { withStyles } from "@material-ui/styles";
import { ButtonPrimary, ButtonSecondary } from "components/$widgets/buttons/form-button";
import ConfirmDialog from "components/$widgets/dialog";
import InputLabel from "@material-ui/core/InputLabel";
import Provider from "./provider";
import { BootstrapLabel } from "components/$widgets/form-inputs/BootstrapLabel";

export function html() {
    const {
        selectedTab,
        cardTypesList,
        loading,
        cardType,
        openActivatepopup,
        openBDdeletepopup,
        paymentProviders
    } = this.state;

    const { merchantId } = this.props;

    return (
        <div>
            {loading && (<div id="semiTransparenDiv"></div>)}
            
            <Provider 
                paymentProviders={paymentProviders}
                storeProviderFormData={this.storeProviderFormData}
                getProviderFormData={this.getProviderFormData}
                updateProviderFormData={this.updateProviderFormData}
                getAllProviderFormData={this.getAllProviderFormData}
            />

            <Grid container spacing={5} >
                <Grid item xs={3}>
                    <Card style={{ boxShadow: '0 0 4px 4px rgba(0, 0, 0, 0.1)' }}>
                        <CardContent>
                            <FormLabel>Payment Methods</FormLabel>
                            <Tabs
                                orientation="vertical"
                                variant="scrollable"
                                value={this.state.selectedTab}
                                onChange={this.handleTabChange}
                            >
                                {cardTypesList.map((option, index) => (
                                    <Tab
                                        key={option.lookupCode}
                                        value={option.lookupCode}
                                        label={
                                            <Grid container alignItems="center" spacing={1}>
                                                <Grid item>
                                                    <Switch
                                                        checked={option.checked}
                                                        onChange={() => { this.handleCardOnChange(option.lookupCode) }}
                                                        color="var(--primary-color)"
                                                        inputProps={{ 'aria-label': 'controlled' }}
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    {option.description}
                                                </Grid>
                                            </Grid>
                                        }
                                        className={`tabStyle ${selectedTab === option.lookupCode ? 'selected-tab' : ''}`}
                                    />
                                ))}
                            </Tabs>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={9}>

                    {selectedTab && (
                        <CardTypeContainer
                            ref={(ref) => (this.callClear = ref)}
                            merchantId={merchantId}
                            cardType={cardType}
                            storeCardTypeValue={this.storeCardTypeValue}
                            getCardTypeData={this.getCardTypeData}
                            paymentProviders={paymentProviders}
                        />
                    )}

                </Grid>
            </Grid>
            <ConfirmDialog open={openActivatepopup} >
                <Box sx={{ width: 334, paddingLeft: '1%' }}>
                    <Grid container spacing={{ xs: 2, md: 3 }}>
                        <Grid xs={12} mt={1}>
                            <BootstrapLabel style={{ fontSize: '18px !important' }}>Do you want to activate this merchant?</BootstrapLabel>
                        </Grid>
                        <Grid xs={12} mt={4}>
                            <Stack spacing={{ xs: 1, sm: 1 }} direction="row" useFlexGap flexWrap="wrap">
                                <ButtonSecondary onClick={() => this.setState({ openActivatepopup: false })}>Cancel</ButtonSecondary>
                                <ButtonPrimary
                                disabled={this.state.providerEnabled===false}
                                 onClick={this.activateMerchant}>Confirm</ButtonPrimary>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </ConfirmDialog>

            <ConfirmDialog open={openBDdeletepopup} >
                <Box sx={{ width: 317, paddingLeft: '1%' }}>
                    <Grid container spacing={{ xs: 2, md: 3 }}>
                        <Grid xs={12} mt={1}>
                            <BootstrapLabel style={{ fontSize: '18px !important' }}>Are you sure you want to delete?</BootstrapLabel>
                        </Grid>
                        <Grid xs={12} mt={4}>
                            <Stack spacing={{ xs: 1, sm: 1 }} direction="row" useFlexGap flexWrap="wrap">
                                <ButtonSecondary onClick={() => this.setState({ openBDdeletepopup: false })}>Cancel</ButtonSecondary>
                                <ButtonPrimary onClick={this.deleteOTD}>Confirm</ButtonPrimary>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </ConfirmDialog>

        </div>
    );
}
