const { useState, useEffect } = require("react");

//Mui Components
// import { Box, Grid, Typography, FormGroup, FormControlLabel, InputLabel, FormControl, Checkbox, Card, Stack } from "@mui/material";
import { Box, Grid, Typography, FormGroup, FormControlLabel, FormControl, Checkbox, Card, Stack, FormHelperText, InputAdornment, CardContent } from "@material-ui/core";
// import { Autocomplete } from "@mui/material";
import { Autocomplete } from "@material-ui/lab";
import { BootstrapInputOld } from "../../../../../$widgets/form-inputs/BootstrapInputOld";
import { BootstrapLabel } from "components/$widgets/form-inputs/BootstrapLabel";
import { faDeleteLeft, faRecycle, faSquarePlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Validator from "service/core/validator";

const SplitList = ({ }) => {

    return <>
        <Grid container spacing={2} xs={12} style={{ alignItems: 'center', justifyContent: 'flex-end', display: 'flex', color: '#6654C3' }}>
            <button onClick={() => {}} style={{ border: '0', outline: '0', background: '#00000000', cursor: 'pointer', width: 'fit-content', height: 'fit-content' }}>
                <a style={{ alignItems: 'center', justifyContent: 'flex-start', display: 'flex', padding: '4px 0px', width: "fit-content", borderRadius: "12px", cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={faSquarePlus} style={{ color: '#6654C3', marginRight: '18px' }} /> <span style={{ fontSize: 'var(--font-small)', fontWeight: '500', color: '#6654C3' }}>Add New Tier</span>
                </a>
            </button>
        </Grid>
    </>
}

export default SplitList;