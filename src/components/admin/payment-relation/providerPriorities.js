import { useEffect, useState } from "react";
import {Grid} from '@material-ui/core';
import { Autocomplete, TextField, InputAdornment, Button } from "@mui/material";

const ProviderPriorities = ({
    providersList,
    id,
    providerPriorities,
    setProviderPriorities,
    provider,
    priority,
    priorityList,
    indx,
    setIndx
}) => {

    const [selectedProvider, setProvider] = useState(provider);
    const [selectedPriority, setPriority] = useState(priority);

    useEffect(() => {
        setProvider(provider)
    }, [provider, indx])

    useEffect(() => {
        setPriority(priority)
    }, [priority, indx])

    const updateData = (selectedProvider, selectedPriority) => {
        let prev = providerPriorities;
        prev[id] = {provider: selectedProvider, priority: selectedPriority};

        setProviderPriorities(providerPriorities);
    }

    useEffect(() => {
        updateData(selectedProvider, selectedPriority);
    }, [selectedProvider, selectedPriority])

    return indx && <>
        <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
                <label
                    htmlFor=""
                    className="py-1"
                    style={{
                        whiteSpace: "nowrap",
                        fontWeight: "var(--font-weight-normal)",
                        fontSize: "var(--font-x-medium)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        marginLeft: '16px'
                    }}
                >
                    Provider {id + 1}
                </label>
            </Grid>
            <Grid item xs={12} md={3}>
                <Autocomplete
                    disablePortal
                    id="selectedProvider"
                    options={providersList.map((item) => item.paymentProviderName)}
                    getOptionLabel={(option) => option}
                    onChange={(event, newValue) => setProvider(newValue)}
                    value={selectedProvider}
                    renderInput={(params) => (
                        <TextField
                            className="form-control selectedProvider"
                            {...params}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        {selectedProvider && (
                                            <InputAdornment onClick={() => setProvider(null)}>
                                            </InputAdornment>
                                        )}
                                        {params.InputProps.endAdornment}
                                    </>
                                ),
                            }}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={12} md={3}>
                <Autocomplete
                    disablePortal
                    id="selectedPriority"
                    options={priorityList}
                    getOptionLabel={(option) => option}
                    onChange={(event, newValue) => setPriority(newValue)}
                    value={selectedPriority}
                    renderInput={(params) => (
                        <TextField
                            className="form-control selectedPriority"
                            {...params}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        {selectedPriority && (
                                            <InputAdornment onClick={() => setPriority(null)}>
                                            </InputAdornment>
                                        )}
                                        {params.InputProps.endAdornment}
                                    </>
                                ),
                            }}
                        />
                    )}
                />
            </Grid>
            {id != 0 && <>
                <Grid item xs={12} md={3}>
                    <Button onClick={() => {
                        let prev = [];
                        providerPriorities.map((data, index) => {
                            if(index !== id){
                                prev.push(data);
                            }
                        })
                        setProviderPriorities(prev);
                        setIndx(indx + 1);
                    }}>- Remove</Button>
                </Grid>
            </>}
        </Grid>
    </>
}

export default ProviderPriorities;