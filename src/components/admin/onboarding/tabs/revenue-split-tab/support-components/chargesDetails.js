const { useState, useEffect } = require("react");

//Mui Components
// import { Box, Grid, Typography, FormGroup, FormControlLabel, InputLabel, FormControl, Checkbox, Card, Stack } from "@mui/material";
import { Box, Grid, Typography, FormGroup, FormControlLabel, FormControl, Checkbox, Card, Stack, FormHelperText, InputAdornment, CardContent } from "@material-ui/core";
// import { Autocomplete } from "@mui/material";
import { Autocomplete } from "@material-ui/lab";
import { BootstrapInputOld } from "../../../../../$widgets/form-inputs/BootstrapInputOld";
import { BootstrapLabel } from "components/$widgets/form-inputs/BootstrapLabel";
import { faDeleteLeft, faRecycle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Validator from "service/core/validator";
import TierInput from "./tierInput.js";
import SettlementAccountDetails from "./settlementAccountDetails.js";
import { BenepayUserService } from "service/api/benepay-user.service";
import { DashboardService } from "service/api/dashboard.service";

let DummySettlementAccountForPG = {
    "accountName": "Provider Dummy Account",
    "accountType": "Savings",
    "activeStatus": 1,
    "address1": "",
    "address2": "",
    "bankAccountNo": "XXXXXXXXXXX",
    "bankBranch": "XXXXXXXX",
    "bankName": "XXXXX Bank",
    "branchCode": "XXXXX",
    "city": "XXXXX",
    "country": "IND",
    "dateCreated": null,
    "dateModified": null,
    "fkmerchantId": null,
    "nameOnAccount": "NTT",
    "postCode": "2342",
    "primaryAccount": 1,
    "settlementCurrency": "INR",
    "settlementId": 1,
    "state": "TETRE",
    "swiftBic": "XXXXXXXXXXXX",
    "userCreated": null,
    "userModified": null
};

const ChargesDetails = ({ chargesList, providerList, index, entityList, selectedSplitType, selectedPaymentCurrency, tierDetailsList, referalPartnerSettlementList, selectedPaymentProvider, setSelectedPaymentProvider }) => {

    const [settlementAcList, setSettlementAcList] = useState([]);
    const [type, setType] = useState(chargesList[index].type);
    const [entity, setEntity] = useState(chargesList[index].entity ? chargesList[index].entity : []);
    const [settlementAc, setSettlementAc] = useState(chargesList[index].settlementAc);
    const [providerName, setProviderName] = useState(chargesList[index].providerName || "");
    const [splitValue, setSplitValue] = useState(chargesList[index].splitValue);
    const [tierList, setTierList] = useState(chargesList[index].tierList);
    const [isFirst, setIsFirst] = useState(true);
    const [paymentProviderList, setPaymentProviderList] = useState(providerList);

    useEffect(() => {
        updateCharge();
    }, [entity, settlementAc, providerName, splitValue, tierList]);

    useEffect(() => {
        let list = [];
        tierDetailsList.forEach((element, idx) => {
            if (tierList && tierList[idx]) {
                list.push(tierList[idx]);
            } else {
                list.push(parseFloat("0").toFixed(2));
            }
        });
        setTierList(list);
    }, [tierDetailsList, tierDetailsList.length])

    const updateCharge = () => {
        let actual = chargesList[index];

        actual.entity = entity;
        actual.settlementAc = settlementAc;
        actual.splitValue = splitValue;
        actual.tierList = tierList;
    }

    const autoFixDecimal = (decimal, amount) => {
        try {
            if (!Validator.isNotEmpty(amount)) {
                amount = 0;
            }

            if (Validator.isNotEmpty(amount)) {
                if (selectedSplitType.value == "P") {
                    amount = parseFloat(amount).toFixed(2);
                } else {
                    amount = parseFloat(amount).toFixed(decimal);
                }
            }

            return amount;
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Fetch payment ccy list
     * @param merchantId
     */
    const getMerchantSettlement = async (merchantId) => {
        if(type == "R"){
            setSettlementAcList(referalPartnerSettlementList && referalPartnerSettlementList.length != 0  ? referalPartnerSettlementList : []);
            if (referalPartnerSettlementList && referalPartnerSettlementList.length === 1) {
                setSettlementAc(referalPartnerSettlementList[0]);
            }
            return;
        };
        if (type == "PG") {
            setSettlementAcList([DummySettlementAccountForPG])
            setSettlementAc(DummySettlementAccountForPG)
            return;
        }
        const result = await DashboardService.getMerchantSettlement(merchantId);
        if (result) {
            setSettlementAcList(result.merchantSettlements);
            if (result && result.merchantSettlements && result.merchantSettlements.length === 1) {
                setSettlementAc(result.merchantSettlements[0]);
            }
        }
    }

    useEffect(() => {
        if (isFirst && settlementAc) {
            setIsFirst(false);
        } else {
            setSettlementAc(null);
        }
        if (entity && (entity.merchantId || entity.name)) {
            getMerchantSettlement(type == "PG" ? entity.name : entity.merchantId);
        }

        if(selectedPaymentProvider){
            if(type == "PG"){
                setProviderName(selectedPaymentProvider.name)
            }else{
                setProviderName(productNameByPaymentProvider(selectedPaymentProvider.name));
            }
        }else{ 
            setProviderName("")
        }

    }, [entity])

    useEffect(() => {
        if(selectedPaymentProvider && type == "PG"){
            setEntity(selectedPaymentProvider);
            setProviderName(selectedPaymentProvider.name)
        }

        if(selectedPaymentProvider && type != "PG"){
            setProviderName(productNameByPaymentProvider(selectedPaymentProvider.name));
        }

    }, [selectedPaymentProvider])

    const productNameByPaymentProvider = (val) => {
        console.log("entity", entity, "val", val);
        if(type == "PG"){
            return val; 
        }

        switch (val) {
            case 'NTT':
                return entity && entity.pgProductName ? entity.pgProductName.ntt : "";
                break;
        
            default:
                break;
        }

        return "";
    }

    return <>

        <Grid item xs={12} style={{ marginTop: "12px" }}>
            <Card style={{ boxShadow: '0 0 4px 4px rgba(0, 0, 0, 0.1)' }}>
                <CardContent>
                    <Grid container spacing={2} style={{ marginBottom: "12px" }}>
                        <Typography variant="h6" style={{ color: 'var(--primary-color)', paddingTop: '1%', marginLeft: '12px' }}>
                            {chargesList[index].name} Charges
                        </Typography>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                            <BootstrapLabel required shrink htmlFor="" style={{ whiteSpace: 'nowrap' }} >
                                Entity
                            </BootstrapLabel>
                            <Autocomplete
                                id="entity"
                                size="small"
                                disabled={type == "PG"}
                                options={type == "PG" ? (providerList || []) : (entityList || [])}
                                getOptionLabel={(option) => type == "PG" ? option.name : option.merchantName}
                                value={entity || null}
                                onChange={(e, newValue) => {
                                    setEntity(newValue);
                                    if(setSelectedPaymentProvider && type == "PG"){
                                        setSelectedPaymentProvider(newValue);
                                    }
                                    setProviderName(type == "PG" ? newValue && newValue.name ? newValue.name : "AVS" : newValue && newValue.state ? newValue.state : "")
                                }}
                                renderInput={(params) => (
                                    <BootstrapInputOld
                                        {...params}
                                        InputProps={{
                                            ...params.InputProps,
                                        }}
                                        value={entity && (type == "PG" ? entity.name : entity.merchantName)}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <BootstrapLabel required shrink htmlFor="" style={{ whiteSpace: 'nowrap' }} >
                                Settlement A/C
                            </BootstrapLabel>
                            <Autocomplete
                                id="settlementAc"
                                size="small"
                                options={settlementAcList || []}
                                getOptionLabel={(option) => option ? option.bankName : ""}
                                value={settlementAc || null}
                                onChange={(e, newValue) => { setSettlementAc(newValue) }}
                                renderInput={(params) => (
                                    <BootstrapInputOld
                                        {...params}
                                        InputProps={{
                                            ...params.InputProps,
                                        }}
                                        value={settlementAc && settlementAc.bankName}
                                    />
                                )}
                            />
                            <SettlementAccountDetails data={{ bank: settlementAc ? settlementAc.bankName : null, accNo: settlementAc ? settlementAc.bankAccountNo : null, ifsc: settlementAc ? settlementAc.swiftBic : null }} />
                        </Grid>
                        {selectedSplitType && selectedSplitType.value != "T" && <>
                            <Grid item xs={12} sm={6} md={3}>
                                <BootstrapLabel required shrink htmlFor="" style={{ whiteSpace: 'nowrap' }} >
                                    {selectedSplitType.value == "F" && "Amount"}
                                    {selectedSplitType.value == "P" && "% of Txn Amount"}
                                </BootstrapLabel>
                                <FormControl fullWidth>
                                    <BootstrapInputOld
                                        id="splitValue"
                                        value={splitValue}
                                        onChange={(e) => {
                                            setSplitValue(e.target.value.replace(/[^0-9.]/g, ''));
                                        }}
                                        onBlur={(e) => {
                                            e.persist();
                                            let amt = autoFixDecimal(selectedPaymentCurrency && selectedPaymentCurrency.decimal ? selectedPaymentCurrency.decimal : 2, splitValue);
                                            setSplitValue(amt);
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                        </>}
                        {selectedSplitType && selectedSplitType.value == "T" && <>
                            <Grid item xs={12} sm={6} md={3}>
                                <BootstrapLabel required shrink htmlFor="" style={{ whiteSpace: 'nowrap' }} >
                                    % of Txn Amount
                                </BootstrapLabel>
                                {tierDetailsList && tierDetailsList.length > 0 && tierDetailsList.map((e, i) => {
                                    return (<>
                                        <TierInput tierList={tierList} selectedPaymentCurrency={selectedPaymentCurrency} index={i} autoFixDecimal={autoFixDecimal} setTierToList={(data) => { tierList[i] = data; }} />
                                    </>)
                                })}
                            </Grid>
                        </>}
                        <Grid item xs={12} sm={6} md={3}>
                            <BootstrapLabel required shrink htmlFor="" style={{ whiteSpace: 'nowrap' }} >
                                Product Name (with provider)
                            </BootstrapLabel>
                            <FormControl fullWidth>
                                <BootstrapInputOld
                                    id="providerName"
                                    value={type == "PG" && selectedPaymentProvider ? productNameByPaymentProvider(selectedPaymentProvider.name) : providerName}
                                    disabled
                                    onChange={(e) => {
                                        setProviderName(providerName)
                                    }}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Grid>
    </>
}

export default ChargesDetails;