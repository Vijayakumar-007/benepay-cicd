import React from "react";

//Mui Components
// import { Box, Grid, Typography, FormGroup, FormControlLabel, InputLabel, FormControl, Checkbox, Card, Stack } from "@mui/material";
import { Box, Grid, Typography, FormGroup, FormControlLabel, FormControl, Checkbox, Card, Stack, FormHelperText, InputAdornment, CardContent, Button } from "@material-ui/core";
// import { Autocomplete } from "@mui/material";
import { Autocomplete } from "@material-ui/lab";
import { BootstrapInputOld } from "../../../../$widgets/form-inputs/BootstrapInputOld";
import MUIPhoneInput from "../../../../$widgets/form-inputs/MUIPhoneInput";
import AlertDialog from "components/$widgets/alertDialog";
import Loader from "components/$widgets/loader";
import { BootstrapLabel } from "components/$widgets/form-inputs/BootstrapLabel";
import { AppCheckBox } from "components/$widgets/form-inputs";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Validator from "service/core/validator";
import { DataGrid } from "@mui/x-data-grid";

//Styles
import "./revenue-split.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSquareFull, faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import TierRow from "./support-components/tierRow.js";
import ChargesDetails from "./support-components/chargesDetails.js";
import MerchantSplit from "./support-components/merchantSplit.js";
import SplitList from "./support-components/splitList.js";

export function html() {

    const {
        loading,
        paymentMethodsList,
        selectedPaymentMethod,
        splitTypeList,
        selectedSplitType,
        paymentProviderList,
        selectedPaymentProvider,
        paymentCurrencyList,
        selectedPaymentCurrency,
        splitName,
        tierDetailsList,
        rerender,
        chargesList,
        merchantSplitList,
        screenType,
        currentSplit,
        entityList,
        splitList,
        columns,
        referalParternerMerchant,
        referalPartnerSettlementList,
        parentMerchant,
        parentSettlementList,
        childMerchantListWithSettlement,
        referChildMerchantListWithSettlement
    } = this.state;

    const { } = this.props;

    return (

        <Box component="div">
            <Loader loading={loading} />
            {this.state.screenType == "list" && <>
                <Grid container spacing={2} xs={12} style={{ alignItems: 'center', justifyContent: 'flex-end', display: 'flex', color: '#6654C3', marginBottom: '12px' }}>
                    <button onClick={() => { this.setState({ screenType: "add" }) }} style={{ border: '0', outline: '0', background: '#00000000', cursor: 'pointer', width: 'fit-content', height: 'fit-content' }}>
                        <a style={{ alignItems: 'center', justifyContent: 'flex-start', display: 'flex', padding: '4px 0px', width: "fit-content", borderRadius: "12px", cursor: 'pointer' }}>
                            <FontAwesomeIcon icon={faSquarePlus} style={{ color: '#6654C3', marginRight: '18px' }} /> <span style={{ fontSize: 'var(--font-small)', fontWeight: '500', color: '#6654C3' }}>Add New Split</span>
                        </a>
                    </button>
                </Grid>
                {this.state.splitList && <>
                    <DataGrid
                        rows={this.state.splitList}
                        columns={this.state.columns}
                        className="serachedPaymentResultGridPagination"
                        getRowId={(row) => row.merchantSplitId} // Use a field that uniquely identifies each row
                        disableColumnSelector={true}
                        disableRowSelectionOnClick
                        disableColumnFilter
                        rowsPerPage={10}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 10,
                                },
                            },
                        }}
                        sx={{
                            "& .MuiDataGrid-row:hover": {
                                backgroundColor: "#1976d233",
                                cursor: "pointer",
                            },
                        }}
                    />
                </>}
            </>}
            {this.state.screenType != "list" && <>
                <Grid container>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Card style={{ boxShadow: '0 0 4px 4px rgba(0, 0, 0, 0.1)' }}>
                                <CardContent>
                                    <Grid container spacing={2} style={{ marginBottom: "8px" }}>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <BootstrapLabel shrink htmlFor="">
                                                Split Name
                                            </BootstrapLabel>
                                            <FormControl fullWidth>
                                                <BootstrapInputOld
                                                    id="split-name"
                                                    value={splitName}
                                                    onChange={(e) => {
                                                        this.setState({ splitName: e.target.value })
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <BootstrapLabel required shrink htmlFor="" style={{ whiteSpace: 'nowrap' }} >
                                                Payment Method
                                            </BootstrapLabel>
                                            <Autocomplete
                                                id="payment-method"
                                                size="small"
                                                options={paymentMethodsList || []}
                                                getOptionLabel={(option) => option.name}
                                                value={selectedPaymentMethod || null}
                                                onChange={(e, newValue) => { this.setState({ selectedPaymentMethod: newValue }); this.getPaymentProviderList(newValue.name); }}
                                                renderInput={(params) => (
                                                    <BootstrapInputOld
                                                        {...params}
                                                        InputProps={{
                                                            ...params.InputProps,
                                                        }}
                                                        value={selectedPaymentMethod && selectedPaymentMethod.name}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <BootstrapLabel required shrink htmlFor="" style={{ whiteSpace: 'nowrap' }} >
                                                Payment Provider
                                            </BootstrapLabel>
                                            <Autocomplete
                                                id="payment-providers"
                                                size="small"
                                                options={paymentProviderList || []}
                                                getOptionLabel={(option) => option.name}
                                                value={selectedPaymentProvider || null}
                                                onChange={(e, newValue) => { this.setState({ selectedPaymentProvider: newValue });
                                                //  this.getPaymentMethodList(newValue.name);
                                                 }}
                                                renderInput={(params) => (
                                                    <BootstrapInputOld
                                                        {...params}
                                                        InputProps={{
                                                            ...params.InputProps,
                                                        }}
                                                        value={selectedPaymentProvider && selectedPaymentProvider.name}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <BootstrapLabel required shrink htmlFor="" style={{ whiteSpace: 'nowrap' }} >
                                                Split Type
                                            </BootstrapLabel>
                                            <Autocomplete
                                                id="split-type"
                                                size="small"
                                                options={splitTypeList || []}
                                                getOptionLabel={(option) => option.name}
                                                value={selectedSplitType || null}
                                                onChange={(e, newValue) => { this.setState({ selectedSplitType: newValue }) }}
                                                renderInput={(params) => (
                                                    <BootstrapInputOld
                                                        {...params}
                                                        InputProps={{
                                                            ...params.InputProps,
                                                        }}
                                                        value={selectedSplitType && selectedSplitType.name}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <BootstrapLabel required shrink htmlFor="" style={{ whiteSpace: 'nowrap' }} >
                                                Payment Currency
                                            </BootstrapLabel>
                                            <Autocomplete
                                                id="payment-currency"
                                                size="small"
                                                options={paymentCurrencyList || []}
                                                getOptionLabel={(option) => option.code}
                                                value={selectedPaymentCurrency || null}
                                                onChange={(e, newValue) => { this.setState({ selectedPaymentCurrency: newValue }) }}
                                                renderInput={(params) => (
                                                    <BootstrapInputOld
                                                        {...params}
                                                        InputProps={{
                                                            ...params.InputProps,
                                                        }}
                                                        value={selectedPaymentCurrency && selectedPaymentCurrency.code}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>

                {selectedSplitType && selectedSplitType.value == "T" && rerender > 0 && tierDetailsList && tierDetailsList.length > 0 && <>
                    <Grid container style={{ marginTop: '12px' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Card style={{ boxShadow: '0 0 4px 4px rgba(0, 0, 0, 0.1)' }}>
                                    <CardContent>
                                        <Grid container spacing={2} xs={12} style={{ alignItems: 'center', justifyContent: 'flex-end', display: 'flex', color: '#6654C3' }}>
                                            <button onClick={this.addNewTier} style={{ border: '0', outline: '0', background: '#00000000', cursor: 'pointer', width: 'fit-content', height: 'fit-content' }}>
                                                <a style={{ alignItems: 'center', justifyContent: 'flex-start', display: 'flex', padding: '4px 0px', width: "fit-content", borderRadius: "12px", cursor: 'pointer' }}>
                                                    <FontAwesomeIcon icon={faSquarePlus} style={{ color: '#6654C3', marginRight: '18px' }} /> <span style={{ fontSize: 'var(--font-small)', fontWeight: '500', color: '#6654C3' }}>Add New Tier</span>
                                                </a>
                                            </button>
                                        </Grid>
                                        <Grid container spacing={2} xs={10}>
                                            <Grid item md={1} style={{ alignItems: 'center', justifyContent: 'flex-start', display: 'flex' }}>
                                                <BootstrapLabel shrink htmlFor="" style={{ whiteSpace: 'nowrap' }} >
                                                    Tier
                                                </BootstrapLabel>
                                            </Grid>
                                            {/* <Grid item xs={12} sm={6} md={3}>
                                                <BootstrapLabel shrink htmlFor="" style={{ whiteSpace: 'nowrap' }} >
                                                    Currency
                                                </BootstrapLabel>
                                            </Grid> */}
                                            <Grid item xs={12} sm={6} md={3}>
                                                <BootstrapLabel shrink htmlFor="" style={{ whiteSpace: 'nowrap' }} >
                                                    Min Amount
                                                </BootstrapLabel>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <BootstrapLabel shrink htmlFor="" style={{ whiteSpace: 'nowrap' }} >
                                                    Max Amount
                                                </BootstrapLabel>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={2}>
                                                <BootstrapLabel shrink htmlFor="" style={{ whiteSpace: 'nowrap' }} >
                                                    Action
                                                </BootstrapLabel>
                                            </Grid>
                                        </Grid>
                                        {tierDetailsList.map((value, index) => {
                                            return (<>
                                                <TierRow selectedPaymentCurrency={selectedPaymentCurrency} paymentCurrencyList={paymentCurrencyList} tierDetailsList={tierDetailsList} index={index} deleteTier={this.deleteTier} setTierDetailsList={(data) => { this.setState({ tierDetailsList: data }) }} />
                                            </>)
                                        })}
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                </>}

                {chargesList.map((e, index) => {
                    return (<>
                        <ChargesDetails index={index} providerList={this.state.paymentProviderList} entityList={e.type == "R" ? (this.state.referalParternerMerchant ? [this.state.referalParternerMerchant] : []) : this.state.entityList} chargesList={chargesList} selectedSplitType={selectedSplitType} selectedPaymentCurrency={selectedPaymentCurrency} tierDetailsList={tierDetailsList} referalPartnerSettlementList={referalPartnerSettlementList} selectedPaymentProvider={selectedPaymentProvider} setSelectedPaymentProvider={(val) => {this.setState({selectedPaymentProvider: val})}} />
                    </>)
                })}

                {merchantSplitList && merchantSplitList.length > 0 && <>
                    <Grid item xs={12} style={{ marginTop: "12px" }}>
                        <Card style={{ boxShadow: '0 0 4px 4px rgba(0, 0, 0, 0.1)' }}>
                            <CardContent>
                                <Grid container spacing={2} style={{ marginBottom: "12px", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="h6" style={{ color: 'var(--primary-color)', paddingTop: '1%', marginLeft: '12px' }}>
                                        Merchant Split
                                    </Typography>
                                    {/* <Grid container spacing={2} xs={12} style={{ alignItems: 'center', justifyContent: 'flex-end', display: 'flex', color: '#6654C3' }}> */}
                                    <button onClick={this.addNewMerchantSplit} style={{ border: '0', outline: '0', background: '#00000000', cursor: 'pointer', width: 'fit-content', height: 'fit-content' }}>
                                        <a style={{ alignItems: 'center', justifyContent: 'flex-start', display: 'flex', padding: '4px 0px', width: "fit-content", borderRadius: "12px", cursor: 'pointer' }}>
                                            <FontAwesomeIcon icon={faSquarePlus} style={{ color: '#6654C3', marginRight: '18px' }} /> <span style={{ fontSize: 'var(--font-small)', fontWeight: '500', color: '#6654C3' }}>Add New Merchant Split</span>
                                        </a>
                                    </button>
                                    {/* </Grid> */}
                                </Grid>
                                {merchantSplitList.map((data, index) => {
                                    return (<>
                                        <MerchantSplit merchantSplitList={merchantSplitList} activeMerchantId={this.state.merchantId} index={index} selectedSplitType={selectedSplitType} selectedPaymentCurrency={selectedPaymentCurrency} tierDetailsList={tierDetailsList} deleteMerchantSplit={(data) => { this.deleteMerchantSplit(data) }}  parentMerchant={parentMerchant} parentSettlementList={parentSettlementList} childMerchantListWithSettlement = {childMerchantListWithSettlement} referChildMerchantListWithSettlement = {referChildMerchantListWithSettlement} selectedPaymentProvider={selectedPaymentProvider} />
                                    </>)
                                })}
                            </CardContent>
                        </Card>
                    </Grid>
                </>}

                <Grid container style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <Button
                        variant="contained"
                        style={{ width: 'auto', marginRight: '12px', textTransform: 'unset', background: "var(--primary-color)", color: 'white' }}
                        onClick={() => this.state.currentSplit ? this.updateMerchantSplit() : this.createMerchantSplit()}
                    >
                        Save
                    </Button>
                    <Button
                        variant="contained"
                        style={{ width: 'auto', textTransform: 'unset', background: "var(--primary-color)", color: 'white' }}
                        onClick={() => { this.setFormToDefault(); this.setState({ screenType: 'list' }) }}
                    >
                        Cancel
                    </Button>
                </Grid>
                {/* <button onClick={this.createMerchantSplit}>Apply</button> */}

            </>}
        </Box >
    );
}
