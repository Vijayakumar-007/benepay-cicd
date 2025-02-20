import { Grid, FormControl, Button, TextField } from '@material-ui/core';
import { BootstrapLabel } from 'components/$widgets/form-inputs/BootstrapLabel';
import { BootstrapInputOld } from 'components/$widgets/form-inputs/BootstrapInputOld';
import Autocomplete from "@material-ui/lab/Autocomplete";
import Loader from 'components/$widgets/loader';

export function html() {

    const { 
        formFields, 
        providers, 
        currencies, 
        accountTypes,
        loading,
        loadingForFormSubmit,
    } = this.state;
        
    return (
    <Grid container spacing={3} >

        <Loader loading={loading || loadingForFormSubmit} />

        <Grid item xs={12} md={12} sm={12} lg={8}>
            <Grid container spacing={3}>
                {/* Provider Dropdown */}
                <Grid item xs={4}>
                    <BootstrapLabel shrink required>Provider</BootstrapLabel>
                    <FormControl fullWidth>
                        <Autocomplete
                            size="small"
                            id="currency"
                            disableClearable={true}
                            options={providers ? providers : []}
                            getOptionLabel={(option) => option.paymentProviderName}
                            value={providers.find((v) => v.paymentProviderId == formFields.provider.value) || null}
                            style={{width: "50% !important"}}
                            onChange={(e, v) => this.handleInputChange('provider', v.paymentProviderId)}
                            renderInput={(params) => (
                                <BootstrapInputOld
                                    autoComplete="off"
                                    fullWidth
                                    variant="outlined"
                                    {...params}
                                    InputProps={{
                                        ...params.InputProps,
                                        disableUnderline: true
                                    }}
                                    value={formFields.provider && formFields.provider.value}
                                    errors={formFields.provider.errors}
                                />
                            )}
                        />
                    </FormControl>
                </Grid>

                {/* Currency Dropdown */}
                <Grid item xs={4}>
                    <BootstrapLabel shrink required>Account Currency</BootstrapLabel>
                    <FormControl fullWidth>
                        <Autocomplete
                            size="small"
                            id="currency"
                            disableClearable={true}
                            options={currencies ? currencies : []}
                            value={ formFields.currency && formFields.currency.value != null ? formFields.currency.value : ''}
                            style={{width: "50% !important"}}
                            onChange={(e, v) => this.handleInputChange('currency', v)}
                            renderInput={(params) => (
                                <BootstrapInputOld
                                    fullWidth
                                    autoComplete="off"
                                    variant="outlined"
                                    {...params}
                                    InputProps={{
                                        ...params.InputProps,
                                        disableUnderline: true
                                    }}
                                    value={formFields.currency && formFields.currency.value}
                                    errors={formFields.currency && formFields.currency.errors}
                                />
                            )}
                        />
                    </FormControl>
                </Grid>

                {/* Account Type Dropdown */}
                <Grid item xs={4}>
                    <BootstrapLabel shrink required>Type of Account</BootstrapLabel>
                    <FormControl fullWidth>
                        <Autocomplete
                            size="small"
                            id="currency"
                            disableClearable={true}
                            options={accountTypes ? accountTypes : []}
                            getOptionLabel={(option) => option.description}
                            value={accountTypes.find((v) => v.lookupCode == formFields.accountType.value) || null}
                            style={{width: "50% !important"}}
                            onChange={(e, v) => this.handleInputChange('accountType', v.lookupCode)}
                            renderInput={(params) => (
                                <BootstrapInputOld
                                    fullWidth
                                    autoComplete="off"
                                    variant="outlined"
                                    {...params}
                                    InputProps={{
                                        ...params.InputProps,
                                        disableUnderline: true
                                    }}
                                    value={formFields.accountType && formFields.accountType.value}
                                    errors={formFields.accountType && formFields.accountType.errors}
                                />
                            )}
                        />
                    </FormControl>
                </Grid>

                {/* Holder Name */}
                <Grid item xs={4}>
                    <BootstrapLabel shrink required>Account Holder Name</BootstrapLabel>
                    <FormControl fullWidth>
                        <BootstrapInputOld
                            autoComplete="off"
                            value={formFields.accountName.value}
                            errors={formFields.accountName.errors}
                            onChange={(e) => this.handleInputChange('accountName', e.target.value)}
                        />
                    </FormControl>
                </Grid>

                {/* Bank Name */}
                <Grid item xs={4}>
                    <BootstrapLabel shrink required>Bank Name</BootstrapLabel>
                    <FormControl fullWidth>
                        <BootstrapInputOld
                            autoComplete="off"
                            value={formFields.bankName.value}
                            errors={formFields.bankName.errors}
                            onChange={(e) => this.handleInputChange('bankName', e.target.value)}
                        />
                    </FormControl>
                </Grid>

                {/* Bank Address */}
                <Grid item xs={4}>
                    <BootstrapLabel shrink required>Bank Address</BootstrapLabel>
                    <FormControl fullWidth>
                        <BootstrapInputOld
                            rows={3}
                            autoComplete="off"
                            value={formFields.bankAddress.value}
                            errors={formFields.bankAddress.errors}
                            onChange={(e) => this.handleInputChange('bankAddress', e.target.value)}
                            style={{ width: '100%' }}
                        />
                    </FormControl>
                </Grid>

                {/* Dynamic Fields */}
                {formFields.virtualAccounts.map((account, index) => (

                    <Grid item sm={6}>
                        <Grid item xs={12} sm={6}>
                            <h4>{account.vname} Details</h4>
                        </Grid>

                        <Grid item xs={12} key={index}>
                            <BootstrapLabel shrink style={{ marginTop: "5%" }}>Bank Account Number</BootstrapLabel>
                            <FormControl fullWidth>
                                <BootstrapInputOld
                                    autoComplete="off"
                                    value={account.account}
                                    onChange={(e) => this.handleInputChange(`account-${index}`, e.target.value)}
                                />
                            </FormControl>
                            <BootstrapLabel shrink style={{ marginTop: "5%" }}>ABA Routing Number</BootstrapLabel>
                            <FormControl fullWidth>
                                <BootstrapInputOld
                                    autoComplete="off"
                                    value={account.routing}
                                    onChange={(e) => this.handleInputChange(`routing-${index}`, e.target.value)}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                ))}
            </Grid>
        </Grid>
    </Grid>
    );
}