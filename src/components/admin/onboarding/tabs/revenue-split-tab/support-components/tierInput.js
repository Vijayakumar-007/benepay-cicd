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

const TierInput = ({ tierList, index, autoFixDecimal, setTierToList, selectedPaymentCurrency, isMerchantSplit }) => {

    const [value, setValue ] = useState(tierList[index]);
    const [decimal, setDecimal] = useState(selectedPaymentCurrency && selectedPaymentCurrency.decimal ? selectedPaymentCurrency.decimal : 2);

    useEffect(() => {
        setDecimal(selectedPaymentCurrency && selectedPaymentCurrency.decimal ? selectedPaymentCurrency.decimal : 2)
    }, [selectedPaymentCurrency])

    useEffect(() => {
        if(value){
            setTierToList(parseFloat(value).toFixed(decimal));
        }else if(isMerchantSplit){
            setTierToList(parseFloat("0.00").toFixed(decimal));
        }
    }, [value])

    useEffect(() => {
        if(tierList && tierList.length > index){
            setValue(tierList[index]);
        }
    }, [tierList, tierList.length])

    return <>
        <Grid container spacing={2} xs={12}>
            <Grid item xs={3}>
                <BootstrapLabel shrink htmlFor="" style={{ whiteSpace: 'nowrap', marginTop: '10px' }} >
                    Tier {index + 1}
                </BootstrapLabel>
            </Grid>
            <Grid item xs={6}>
                <FormControl fullWidth>
                    <BootstrapInputOld
                        id="tier"
                        value={value || "0.00"}
                        onChange={(e) => {
                            setValue(e.target.value.replace(/[^0-9.]/g, ''));
                        }}
                        onBlur={(e) => {
                            setValue(parseFloat(value).toFixed(decimal));
                        }}
                    />
                </FormControl>
            </Grid>
        </Grid>
    </>
}

export default TierInput;