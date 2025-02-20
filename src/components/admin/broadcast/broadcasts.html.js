import * as React from "react";
import "./broadcasts.scss";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import {
    Button, Collapse, Box, Grid, Typography, Autocomplete, InputLabel,
    FormControl, InputAdornment, Container
} from "@mui/material";
import { ButtonPrimary, ButtonSecondary } from "../../$widgets/buttons/form-button";
import ConfirmDialog from "../../$widgets/dialog";
import { withStyles } from "@material-ui/styles";
import MUIDatePicker from "../../$widgets/form-inputs/MUIDatePicker";
import { BootstrapInput } from "../../$widgets/form-inputs/BootstrapInput";
import { DateFormat } from "../../../enum/common.enum";
import dayjs from "dayjs";
import TitleBar from "../../title-bar/title-bar";
import { BootstrapLabel } from "components/$widgets/form-inputs/BootstrapLabel";
import PermissionGuard from "components/$widgets/permission/permissionGuard";
import { PrivilegeConstants } from "config/constants";

export function html() {
    const {
        loading, titleName, openCreateNewBroadcastDiv, hideAddNewBtn,
        msgHistoryColumns, merchantsList, msgHistoryRows, severityOptions, formFields
    } = this.state;

    const CharacterCounter = (props) => {

        const remainingChars = props.maxLength - props.value.length;

        return (
            <p style={{ paddingTop: props.paddingTop }}>
                {remainingChars}/{props.maxLength}
            </p>
        );
    }

    return (
        <div id="desktopScreen" className={"home-main position-relative"}>
            {loading && <div id="semiTransparenDiv"></div>}

            {true && (
                <Box sx={{ flexGrow: 1, paddingLeft: 2, paddingRight: 2 }}>
                    <Grid container>
                <Grid item xs={12}>
                    <TitleBar
                    className={"mt-3"}
                    color="blue"
                    ruleColor="blue"
                    title={titleName}
                    />
                    
                    <PermissionGuard userPermission={PrivilegeConstants.CREATE_NEW_BRODCAST}>
                        <Box
                        display="flex"
                        justifyContent="flex-end"
                        alignItems="flex-end"
                        marginTop="-55px"
                        >
                            <Button variant="outlined" onClick={this.createNewBroadcast}>+ Create New</Button>
                        </Box>
                    </PermissionGuard>
                </Grid>
                </Grid>

                    <Collapse in={openCreateNewBroadcastDiv}>
                        <Box mt={3}>
                            <Grid container columnGap={3} rowGap={2}>
                                <Grid item xl={2.5} lg={2.5} md={3} sm={8} xs={10}>
                                    <BootstrapLabel shrink required htmlFor="Merchant">Merchant</BootstrapLabel>
                                    <Autocomplete
                                        multiple
                                        fullWidth
                                        disableClearable
                                        freeSolo
                                        id="allMerchantName"
                                        size="small"
                                        open={this.state.openAutocomplete}
                                        onBlur={this.handleInputBlur}
                                        onFocus={this.handleInputFocus}
                                        options={merchantsList || []}
                                        getOptionLabel={(option) => `${option.merchantName}`}
                                        onChange={(e, newValue) => this.getMerchantIds(e, newValue)}
                                        value={formFields.selectedMerchant.value || []}
                                        getOptionDisabled={(option) => !!option.disabled}
                                        isOptionEqualToValue={(option, value) => option.merchantName === value.merchantName}
                                        renderInput={(params) => (
                                            <BootstrapInput
                                                {...params}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    disableUnderline: true,
                                                    type: 'search',
                                                }}
                                                placeholder="All/Name of Merchant"
                                                rules={formFields.selectedMerchant.rules}
                                                value={formFields.selectedMerchant.value}
                                                errors={formFields.selectedMerchant.errors}
                                                onBlur={(e) => { }}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xl={2.5} lg={2.5} md={3} sm={8} xs={10}>
                                    <BootstrapLabel shrink required htmlFor="Merchant">Severity</BootstrapLabel>
                                    <Autocomplete
                                        disablePortal
                                        fullWidth
                                        freeSolo
                                        disableClearable
                                        id="severity"
                                        size="small"
                                        value={formFields.severity.value}
                                        options={severityOptions || []}
                                        getOptionLabel={(option) => option.label || ""}
                                        onChange={(e, newValue) => {
                                            this.updateFormField("severity", newValue);
                                        }}
                                        renderInput={(params) => (
                                            <BootstrapInput
                                                {...params}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    disableUnderline: true,
                                                    type: 'search',
                                                }}
                                                placeholder="Severity"
                                                rules={formFields.severity.rules}
                                                value={formFields.severity.value}
                                                errors={formFields.severity.errors}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xl={2.5} lg={2.5} md={3} sm={8} xs={10}>
                                    <BootstrapLabel shrink required htmlFor="showUntil">Show Until</BootstrapLabel>
                                    <FormControl fullWidth>
                                        <MUIDatePicker
                                            disablePast={true}
                                            name="showUntil"
                                            placeholder="Show until date"
                                            rules={formFields.showUntil.rules}
                                            errors={formFields.showUntil.errors}
                                            value={formFields.showUntil.value ? dayjs(formFields.showUntil.value) : null}
                                            format={DateFormat.date}
                                            onChange={(e) => {
                                                let value = this.changeDateFormat(e);
                                                this.updateFormField("showUntil", value);
                                            }}
                                            sx={{
                                                "& .MuiInputBase-root": {
                                                    "& .MuiInputBase-input": {
                                                        backgroundColor: 'white'
                                                    },
                                                }
                                            }}
                                            onBlur={(e) => { }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Box>

                        <Box mt={5}>
                            <Grid container columnGap={2} >
                                <Grid item xl={5.2} lg={5.2} md={5.2} sm={8} xs={10}>
                                    <BootstrapLabel shrink required htmlFor="messageSubject">Message Subject</BootstrapLabel>
                                    <FormControl fullWidth>
                                        <BootstrapInput
                                            id="messageSubject"
                                            autoComplete="off"
                                            placeholder="Message Subject"
                                            rules={formFields.messageSubject.rules}
                                            value={formFields.messageSubject.value}
                                            errors={formFields.messageSubject.errors}
                                            onChange={(e) => {
                                                const inputValue = e.target.value.slice(0, 70);
                                                this.updateFormField("messageSubject", inputValue);
                                            }}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <CharacterCounter
                                                            value={formFields.messageSubject.value}
                                                            maxLength={70}
                                                            paddingTop={'18px'}
                                                        />
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Box>

                        <Box mt={2}>
                            <Grid container columnGap={2} >
                                <Grid item xl={5.2} lg={5.2} md={5.2} sm={8} xs={10}>
                                    <BootstrapLabel shrink required htmlFor="messageBody">Message Body</BootstrapLabel>
                                    <FormControl fullWidth>
                                        <BootstrapInput
                                            id="messageBody"
                                            autoComplete="off"
                                            multiline
                                            rows={5}
                                            placeholder="Message Body"
                                            rules={formFields.messageBody.rules}
                                            value={formFields.messageBody.value}
                                            errors={formFields.messageBody.errors}
                                            maxLength={500}
                                            onChange={(e) => {
                                                const inputValue = e.target.value.slice(0, 500);
                                                this.updateFormField("messageBody", inputValue);
                                            }}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <CharacterCounter
                                                            value={formFields.messageBody.value}
                                                            maxLength={500}
                                                            paddingTop={'110px'}
                                                        />
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Box>

                        <Box mt={5}>
                            <Grid container columnGap={8} rowGap={2}>
                                <Grid item xl={2} lg={2} md={2} sm={8} xs={10}>
                                    <ButtonPrimary fullWidth className="submitBtnStyle"
                                        sx={{ backgroundColor: '#264d73' }}
                                        onClick={async () => {
                                            this.saveMessage();
                                        }}
                                    >
                                        Submit
                                    </ButtonPrimary>
                                </Grid>
                                <Grid item xl={2} lg={2} md={2} sm={8} xs={10}>
                                    <ButtonSecondary fullWidth className="cancelBtnStyle"
                                        onClick={() => this.cancelBroadcastCreation()}
                                    >
                                        Cancel
                                    </ButtonSecondary>
                                </Grid>
                            </Grid>
                        </Box>
                    </Collapse>

                    <Box mt={5} sx={{ width: '100%' }}>
                        {hideAddNewBtn ?
                            <Typography sx={{ color: '#264d73', paddingBottom: 1, marginTop: 3, fontWeight: 500 }}>Message History</Typography>
                            : <></>
                        }
                        <DataGrid
                            rows={msgHistoryRows}
                            columns={msgHistoryColumns}
                            getRowId={(row) => row.messageId}
                            pageSizeOptions={[5]}
                            getRowHeight={() => 'auto'}
                            onCellClick={this.handleRowClick}
                            disableRowSelectionOnClick
                            className="messageHistoryDataGrid"
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        pageSize: 10,
                                    },
                                },
                            }}
                            sx={{
                                [`& .${gridClasses.cell}`]: {
                                    py: 1,
                                },
                            }}
                        />
                    </Box>

                    {this.state.showDeletionModal && (
                        <ConfirmDialog title="Warning" open={true} setOpen={true}>
                            <Typography style={{marginBottom:20}}>
                                Are you sure want to delete the broadcast ?
                            </Typography>

                            <ButtonPrimary
                                style={{ backgroundColor: '#346799', color: 'white' }}
                                onClick={() => this.handleBroadcastDelete(this.state.messageIdToDelete)}
                            >
                                Confirm
                            </ButtonPrimary>

                            <ButtonSecondary
                                style={{ marginLeft: "5px", backgroundColor: 'gray', color: 'white' }}
                                onClick={this.handleModalClose}
                            >
                                Cancel
                            </ButtonSecondary>
                        </ConfirmDialog>
                    )}
                </Box>
            )}
        </div>
    );
}
