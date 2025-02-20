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
import SettlementAccountDetails from "./settlementAccountDetails";
import { DashboardService } from "service/api/dashboard.service";
import { data } from "jquery";

const MerchantSplit = ({ activeMerchantId, merchantSplitList, index, selectedSplitType, selectedPaymentCurrency, tierDetailsList, deleteMerchantSplit,
    parentMerchant,
    parentSettlementList,
    childMerchantListWithSettlement,
    referChildMerchantListWithSettlement,
    selectedPaymentProvider }) => {

    const [settlementAc, setSettlementAc] = useState(merchantSplitList[index].settlementAc);
    const [entity, setEntity] = useState(merchantSplitList[index].entity);
    const [providerName, setProviderName] = useState(merchantSplitList[index].providerName || "");
    const [splitValue, setSplitValue] = useState(merchantSplitList[index].splitValue);
    const [tierList, setTierList] = useState(merchantSplitList[index].tierList);
    const [settlementAcList, setSettlementAcList] = useState([]);
    const [error, setError] = useState(merchantSplitList[index].err);

    useEffect(() => {
        let list = [];
        tierDetailsList.forEach((element, idx) => {
            if (tierList && tierList[idx]) {
                list.push(tierList[idx]);
            } else {
                list.push("0.00");
            }
        });
        setTierList(list);
    }, [tierDetailsList, tierDetailsList.length])

    useEffect(() => {
        updateCharge();
    }, [settlementAc, providerName, splitValue, tierList, tierList.length, entity]);

    const updateCharge = () => {
        let actual = merchantSplitList[index];

        actual.settlementAc = settlementAc;
        actual.splitValue = splitValue;
        actual.tierList = tierList;
        actual.err = error;
        actual.entity = entity;
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
        const result = await DashboardService.getMerchantSettlement(merchantId);
        if (result) {
            setSettlementAcList(result.merchantSettlements);
            if (result && result.merchantSettlements.length === 1) {
                setSettlementAc(result.merchantSettlements[0]);
            }
        }
    }

    useEffect(() => {
        setSettlementInfo();
    }, [merchantSplitList, merchantSplitList.length, JSON.stringify(merchantSplitList), entity])

    let setSettlementInfo = () => {
        if (index == 0) {
            setEntity(parentMerchant);
            setSettlementAcList(parentSettlementList);
            if (parentSettlementList && parentSettlementList.length === 1) {
                setSettlementAc(parentSettlementList[0]);
            }
        } else {
            let settlementList = [];
            let alreadySelectedMerchantIds = [];

            merchantSplitList.forEach((element, index) => {
                if (index != 0 && element.entity) {
                    alreadySelectedMerchantIds.push(element.entity.merchantId);
                }
            });

            if (entity) {
                alreadySelectedMerchantIds.push(entity.merchantId);
            }

            referChildMerchantListWithSettlement.forEach(element => {
                if (!alreadySelectedMerchantIds.includes(element.merchant.merchantId)) {
                    element.settlementDetails.forEach(data => {
                        settlementList.push(data);
                    });
                }
            });
            setSettlementAcList(settlementList);
        }
    }

    let getMerchantIdBySettlementId = (id) => {
        referChildMerchantListWithSettlement.forEach(element => {
            element.settlementDetails.forEach(data => {
                if (data.settlementId == id) {
                    setEntity(element.merchant);
                    setSettlementInfo();
                    setProviderName(element.merchant.pgMerchantId)
                    return;
                }
            });
        })
    }

    useEffect(() => {
        console.log("TE~!", selectedPaymentProvider);
        if(selectedPaymentProvider){
            setProviderName(productNameByPaymentProvider(selectedPaymentProvider.name));
        }else{ 
            setProviderName("")
        }

    }, [entity])

    
    useEffect(() => {

        if(selectedPaymentProvider){
            setProviderName(productNameByPaymentProvider(selectedPaymentProvider.name));
        }

    }, [selectedPaymentProvider])

    const productNameByPaymentProvider = (val) => {
        console.log("entity", entity, "val", val);
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
        <Grid container spacing={2} style={{ marginBottom: merchantSplitList.length - 1 == index ? "0px" : "12px", borderBottom: merchantSplitList.length - 1 == index ? "none" : '1px solid #00000044' }}>
            <Grid item xs={12} sm={6} md={3}>
                <BootstrapLabel required shrink htmlFor="" style={{ whiteSpace: 'nowrap' }} >
                    Settlement A/C
                </BootstrapLabel>
                <Autocomplete
                    id="settlementAc"
                    size="small"
                    options={settlementAcList}
                    getOptionLabel={(option) => option.bankName}
                    value={settlementAc || null}
                    onChange={(e, newValue) => { setSettlementAc(newValue); getMerchantIdBySettlementId(newValue.settlementId); }}
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
                        % of Split
                    </BootstrapLabel>
                    <FormControl fullWidth>
                        <BootstrapInputOld
                            id="splitValue"
                            value={splitValue}
                            errors={error}
                            onChange={(e) => {
                                setSplitValue(e.target.value.replace(/[^0-9.]/g, ''));
                                if (parseFloat(e.target.value.replace(/[^0-9.]/g, '')) > parseFloat(100)) {
                                    setError(["% of split must be less than 100"])
                                } else {
                                    setError(null)
                                }
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
                        % of Split
                    </BootstrapLabel>
                    {tierDetailsList && tierDetailsList.length > 0 && tierDetailsList.map((e, i) => {
                        return (<>
                            <TierInput isMerchantSplit={true} tierList={tierList} index={i} autoFixDecimal={autoFixDecimal} setTierToList={(data) => { tierList[i] = data; }} />
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
                        value={providerName}
                        disabled
                        onChange={(e) => {
                            setProviderName(providerName)
                        }}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3} >
                {index != 0 && <>
                    <a style={{ alignItems: 'center', marginTop: '28px', justifyContent: 'flex-start', display: 'flex', padding: '10px 16px', background: '#CC0000', width: "fit-content", borderRadius: "12px", cursor: 'pointer' }} onClick={() => { deleteMerchantSplit(index); }}>
                        <FontAwesomeIcon icon={faTrash} style={{ color: 'white', marginRight: '12px' }} /> <span style={{ fontSize: 'var(--font-small)', fontWeight: '500', color: 'white' }}>Delete</span>
                    </a>
                </>}
            </Grid>
        </Grid>
    </>
}

export default MerchantSplit;