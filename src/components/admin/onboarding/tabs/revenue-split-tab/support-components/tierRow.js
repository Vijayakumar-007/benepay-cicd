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
import _ from "lodash";

const TierRow = ({
    paymentCurrencyList,
    tierDetailsList,
    index,
    setTierDetailsList,
    deleteTier,
    selectedPaymentCurrency
}) => {

    const [selectedCcy, setSelectedCcy] = useState(selectedPaymentCurrency)
    const [minAmount, setMinAmount] = useState(tierDetailsList[index].minAmt);
    const [maxAmount, setMaxAmount] = useState(isNaN(parseFloat(tierDetailsList[index].maxAmt)) ? parseFloat('0.00') : parseFloat(tierDetailsList[index].maxAmt));
    const [maxErrors, setMaxError] = useState([]);
    const [ccyError, setCcyError] = useState([]);

    // useEffect(() => {
    //     // checkAndSetValues();
    // }, [minAmount, maxAmount, selectedCcy])

    useEffect(() => {
        setSelectedCcy(selectedPaymentCurrency);
        setMaxAmount(isNaN(parseFloat(maxAmount).toFixed(selectedCcy ? selectedCcy.decimal : 2)) ? '0.00' : parseFloat(maxAmount).toFixed(selectedCcy ? selectedCcy.decimal : 2));
        setMinAmount(parseFloat(minAmount).toFixed(selectedCcy ? selectedCcy.decimal : 2));
    }, [selectedPaymentCurrency]);

    const checkAndSetValues = () => {
        let decimal = selectedCcy && selectedCcy.decimal ? selectedCcy.decimal : 2;
        setCcyError([]);
        let val = parseFloat(autoFixDecimal(decimal, minAmount)) >= parseFloat(autoFixDecimal(decimal, maxAmount));
        if (val) {
            setMaxError(["Max Amount should be greater than min amount"]);
            changeList("Max Amount should be greater than min amount")
        } else {
            setMaxError([]);
            changeList(null);
        }
    }

    useEffect(() => {
        setValues();
        
    }, [JSON.stringify(tierDetailsList)])

    const setValues = () => {
        setSelectedCcy(selectedCcy),
        setMaxAmount(parseFloat(tierDetailsList[index].maxAmt).toFixed(selectedCcy ? selectedCcy.decimal : 2));
        setMinAmount(parseFloat(tierDetailsList[index].minAmt).toFixed(selectedCcy ? selectedCcy.decimal : 2));
    }

    const autoFixDecimal = (decimal, amount) => {
        try {

            if (!Validator.isNotEmpty(amount)) {
                amount = 0;
            }

            if (Validator.isNotEmpty(amount)) {
                amount = parseFloat(amount).toFixed(decimal);
            }

            return amount;
        } catch (error) {
            console.error(error);
        }
    }

    const changeList = (error) => {
        let newArr = tierDetailsList;
        newArr[index].ccy = selectedCcy;
        newArr[index].minAmt = minAmount;
        newArr[index].maxAmt = maxAmount.length == 0 ? '0.00' : maxAmount;
        newArr[index].err = error;

        if (newArr[index + 1]) {
            newArr[index + 1].minAmt = maxAmount;
        }

        setTierDetailsList(tierDetailsList);
    }

    return <>
        {tierDetailsList && <>
            <Grid container spacing={2} xs={10}>
                <Grid item md={1} style={{ alignItems: 'center', justifyContent: 'flex-start', display: 'flex', height: 'fit-content', marginTop: '10px' }}>
                    <BootstrapLabel shrink htmlFor="" style={{ whiteSpace: 'nowrap' }}>
                        Tier {index + 1}
                    </BootstrapLabel>
                </Grid>
                {/* <Grid item xs={12} sm={6} md={3}>
                <Autocomplete
                    id="payment-currency"
                    size="small"
                    options={paymentCurrencyList || []}
                    getOptionLabel={(option) => option.code}
                    value={selectedCcy || null}
                    onChange={(e, newValue) => { setSelectedCcy(newValue); }}
                    renderInput={(params) => (
                        <BootstrapInputOld
                            {...params}
                            InputProps={{
                                ...params.InputProps,
                            }}
                            errors={ccyError}
                            value={selectedCcy && selectedCcy.code}
                        />
                    )}
                />
            </Grid> */}
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth>
                        <BootstrapInputOld
                            id="minAmount"
                            value={minAmount}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth>
                        <BootstrapInputOld
                            id="maxAmount"
                            value={maxAmount}
                            errors={maxErrors}
                            onChange={(e) => {
                                setMaxAmount(e.target.value.replace(/[^0-9.]/g, ''));
                            }}
                            onBlur={(e) => {
                                e.persist();
                                if(maxAmount.length == 0){
                                    setMaxAmount('0.00');
                                    checkAndSetValues();
                                    return;
                                }
                                let amt = autoFixDecimal(selectedCcy ? selectedCcy.decimal : 2, maxAmount);
                                setMaxAmount(amt);
                                checkAndSetValues();
                            }}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    {index != 0 && <>
                        <a style={{ alignItems: 'center', justifyContent: 'flex-start', display: 'flex', padding: '10px 16px', background: '#CC0000', width: "fit-content", borderRadius: "12px", cursor: 'pointer' }} onClick={() => { deleteTier(index); }}>
                            <FontAwesomeIcon icon={faTrash} style={{ color: 'white', marginRight: '12px' }} /> <span style={{ fontSize: 'var(--font-small)', fontWeight: '500', color: 'white' }}>Delete</span>
                        </a>
                    </>}
                </Grid>
            </Grid>
        </>}
    </>
}

export default TierRow;