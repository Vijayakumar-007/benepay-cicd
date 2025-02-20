import React from 'react';

//MUI Components
import { Button, Grid, Typography, Divider, Collapse } from '@material-ui/core';
import { DataGrid } from "@mui/x-data-grid";
import Loader from 'components/$widgets/loader';

//MUI Icons
import { AddCircle } from '@material-ui/icons';

//Style
import "components/admin/onboarding/tabs/settlement-accounts/index.scss";

//Settlement Form
import SettlementForm from './form/settlement.form';

export function html() {
    const {
        columns,
        rows,
        openSettlementForm,
        loading,
        listingLoader,
        merchantId,
        selectedRowValue,
        flagForUpdateSettlement,
        countryList,
        flagForDeleteSettlement,
    } = this.state;

    const style = {
        title: {
            fontWeight: 'bold',
            fontSize: 'x-large',
            color: 'var(--primary-color)',
        },
        settlementButton: {
            color: 'white',
            backgroundColor: 'var(--primary-color)',
            transition: 'color 0.3s ease',
            textTransform: 'none',
            whiteSpace: 'nowrap',
            fontSize: '15px',
        },
        divider: {
            backgroundColor: 'var(--primary-color)',
            marginTop: '1%',
        }
    };

    return (
        <>
            <Loader loading={loading || listingLoader} />

            {/* Settlement Listing - start */}
            <Collapse in={!openSettlementForm}>
                <Grid container spacing={2}>
                    <Grid item xs={6}
                        style={{
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <Typography style={style.title}>
                            Settlement Accounts
                        </Typography>
                    </Grid>

                    <Grid item xs={6}
                        style={{
                            display: 'flex',
                            justifyContent: 'end'
                        }}
                    >
                        <Button
                            startIcon={<AddCircle />} variant="outlined"
                            className="settlementButton" style={style.settlementButton}
                            onClick={this.openForm}
                        >
                            Add New
                        </Button>
                    </Grid>

                    <Grid xs={12}>
                        <Divider style={style.divider} />
                    </Grid>

                    <Grid xs={12}>
                        <div style={{ height: '100%', minHeight:'165px', width: '100%' }}>
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                className="GridPagination settlementAccount"
                                rowHeight={72}
                                getRowHeight={(params) => {
                                    if(params && params.model && params.model.branchAddress){
                                        // Calculate height based on number of words
                                        const words = params.model.branchAddress.split(' ').length;
                                        //adjust this according to your font size and style
                                        if(words > 10){
                                            const averageWordWidth = 30;
                                            const numberOfLines = Math.ceil(words / (columns.length - 1)); // Assuming each line has equal number of words
                                            return numberOfLines * averageWordWidth;
                                        }
                                    }
                                }}
                                getRowId={(row) => row.settlementId}
                                disableColumnSelector={true}
                                disableColumnMenu={true}
                                disableRowSelectionOnClick
                                disableColumnFilter
                                initialState={{
                                    pagination: {
                                        paginationModel: {
                                            pageSize: 6,
                                        },
                                    },
                                }}
                                sx={{
                                    border: 0,
                                    boxShadow: 0,
                                    width: "100%",
                                    "& .MuiDataGrid-row:hover": {
                                        backgroundColor: "#1976d233",
                                        cursor: "pointer",
                                        overflow: "visible !important",
                                        zIndex: "50",
                                    },
                                }}
                            />
                        </div>
                    </Grid>
                </Grid>
            </Collapse>
            {/* Settlement Listing - end */}

            {/* Settlement Form - start */}
            <Collapse in={openSettlementForm}>
                <SettlementForm
                    closeForm={this.closeForm}
                    openForm={this.openForm}
                    merchantId={merchantId}
                    updateSettlementDetail={selectedRowValue}
                    flagForUpdateSettlement={flagForUpdateSettlement}
                    flagForDeleteSettlement={flagForDeleteSettlement}
                    handleFlags={this.updateFlags}
                    countryList={countryList}
                    settlementAcList={rows}
                    fetchSettlementAcList={this.fetchSettlementAcList}
                />
            </Collapse>
            {/* Settlement Form - end */}
        </>
    );
}