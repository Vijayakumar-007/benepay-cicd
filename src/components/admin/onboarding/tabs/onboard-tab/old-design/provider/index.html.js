import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import { Tabs, Tab, FormControlLabel, RadioGroup, Radio, FormControl,FormLabel, Switch, InputLabel, Select, MenuItem } from "@mui/material";
import { BootstrapInput } from "components/$widgets/form-inputs/BootstrapInput";
import { BootstrapLabel } from "components/$widgets/form-inputs/BootstrapLabel";

export function html() {
    const {
        selectedProvider,
        loading,
        formFields
    } = this.state;

    const { merchantId, paymentProviders } = this.props;

    return (
        <div>
            {loading && (<div id="semiTransparenDiv"></div>)}
            
            <Grid container spacing={5} mb={5}>
                <Grid item xs={3}>
                    <Card style={{ boxShadow: '0 0 4px 4px rgba(0, 0, 0, 0.1)' }}>
                        <CardContent>
                            <FormLabel>Payment Providers</FormLabel>
                            {/* <RadioGroup defaultChecked={selectedProvider}>
                                <Tabs orientation="vertical"
                                    variant="scrollable"
                                    value={selectedProvider}
                                    onChange={this.handleTabChange}>
                                    {paymentProviders.map((provider, index) => (
                                        <Tab
                                            key={provider.paymentProviderId}
                                            value={provider.paymentProviderId}
                                            label={
                                                <Grid container alignItems="center" spacing={1}>
                                                    <Grid item>
                                                        <FormControlLabel value={provider.paymentProviderId} control={<Radio />}/>
                                                    </Grid>
                                                    <Grid item>{provider.paymentProviderName}</Grid>
                                                </Grid>
                                            }
                                            className={`tabStyle ${selectedProvider === provider.paymentProviderId ? 'selected-tab' : ''}`}
                                        />
                                    ))}
                                </Tabs>
                            </RadioGroup> */}
                            <Tabs orientation="vertical"
                                variant="scrollable"
                                value={selectedProvider}
                                onChange={this.handleTabChange}>
                                {paymentProviders.map((provider, index) => (
                                    <Tab
                                        key={provider.paymentProviderId}
                                        value={provider.paymentProviderId}
                                        label={
                                            <Grid container alignItems="center" spacing={1}>
                                                <Grid item>
                                                    <Switch checked={true}/>
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
                                    <Grid item xs={12} sm={12} md={4}>
                                        <BootstrapLabel shrink>Priority</BootstrapLabel>
                                        <FormControl fullWidth>
                                            <BootstrapInput 
                                                select
                                                value={formFields.priority.value}
                                                errors={formFields.priority.errors}
                                                onChange={(e) => {
                                                    this.updateFormField("priority", e.target.value);
                                                    this.changeProvidersPriority(e.target.value, selectedProvider);
                                                }}>
                                                <MenuItem value={1}>High</MenuItem>
                                                <MenuItem value={0}>Low</MenuItem>
                                            </BootstrapInput>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={4}>
                                        <BootstrapLabel shrink>Provider Merchant ID</BootstrapLabel>
                                        <FormControl fullWidth>
                                            <BootstrapInput
                                                value={formFields.providerMerchantId.value}
                                                errors={formFields.providerMerchantId.errors}
                                                onChange={(e) => {
                                                    this.updateFormField("providerMerchantId", e.target.value);
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={4}>
                                        <BootstrapLabel shrink>Skin Code</BootstrapLabel>
                                        <FormControl fullWidth>
                                            <BootstrapInput
                                                value={formFields.skinCode.value}
                                                errors={formFields.skinCode.errors}
                                                onChange={(e) => {
                                                    this.updateFormField("skinCode", e.target.value);
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={4}>
                                        <BootstrapLabel shrink>Signature Key</BootstrapLabel>
                                        <FormControl fullWidth>
                                            <BootstrapInput
                                                value={formFields.signKey.value}
                                                errors={formFields.signKey.errors}
                                                onChange={(e) => {
                                                    this.updateFormField("signKey", e.target.value);
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={8}>
                                        <BootstrapLabel shrink>Callback URL</BootstrapLabel>
                                        <FormControl fullWidth>
                                            <BootstrapInput
                                                value={formFields.returnUrl.value}
                                                errors={formFields.returnUrl.errors}
                                                onChange={(e) => {
                                                    this.updateFormField("returnUrl", e.target.value);
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    )}

                </Grid>
            </Grid>
        </div>
    );
}
