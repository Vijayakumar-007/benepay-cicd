import React, { useState, useEffect } from 'react';
import { Box, Grid, Autocomplete, Card, CardContent, Divider, Typography, Button } from '@mui/material';
import { BootstrapInputOld } from 'components/$widgets/form-inputs/BootstrapInputOld';
import { DashboardService } from 'service/api/dashboard.service';
import { SnapshotDataTable } from './snapshot-datatable';

import "./style.css";
import MUIDatePicker from 'components/$widgets/form-inputs/MUIDatePicker';
import moment from 'moment';
import { DefaultDateFormat } from 'config/constants';
import dayjs from 'dayjs';
import { DateFormat } from 'enum/common.enum';

// The SnapshotData component is responsible for displaying and managing the snapshot data
// for transactions, payments, and refunds. It includes filters for merchant selection and transaction ID.
const SnapshotDataPage = () => {
  // State to manage filter criteria for transactions, payments, and refunds.
  const [filters, setFilters] = useState({ tid: null, merchantId: "All" ,receiptStartDate: null, receiptEndDate: null });

  // State to manage the list of merchants available for selection.
  const [merchants, setMerchants] = useState([{ merchantId: "All", merchantName: "--Select Merchant--" }]);

  // Fetches the list of merchants from the DashboardService and updates the state.
  const getMerchants = async () => {
    const response = await DashboardService.getMerchantSummaryList();
    if (response && Object.keys(response).length !== 0) {
      const addOption = { merchantId: "All", merchantName: "--Select Merchant--" };
      response.merchantSummary = [addOption, ...response.merchantSummary];
      setMerchants(response.merchantSummary);
    }
  };

  // useEffect to fetch merchants when the component mounts.
  useEffect(() => {
    getMerchants();
  }, []);

  // Handles changes to the filter inputs and updates the state.
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // Handles changes to the merchant selection and updates the state.
  const handleMerchantOnChange = (e, newValue) => {
    console.log(newValue);
    setFilters({
      ...filters,
      ["merchantId"]: newValue.merchantId,
    });
  };

  const changeDateFormat = (event) => {
    let value = null;

    if (event != null) {
      value = moment(event.toDate()).format(DefaultDateFormat.dateFormatymd);
    }

    return value;
  };

  //Clear fillters
  const clearFillters = () =>{
    setFilters({tid: null, merchantId: "All" ,receiptStartDate: null, receiptEndDate: null});
  }


  return (
    <Box className="requestDump">
      
      <Grid item xs={12} md={12} sm={12} mt={1}>
        <Card>
          <CardContent>
            <Grid item xs={12} md={12} sm={12}>
              {/* Header Section */}
              <Box mb={2}>
                <Typography variant="h6" component="h6">
                  Benecollect Data Snapshot
                </Typography>
              </Box>

              <Divider sx={{ marginBottom: 2 }} />

              {/* Filters Section */}
              <Box mb={2}>
                <Typography>
                  Filters
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={12} sm={12}>
              {/* Filters Section */}
              <Grid container spacing={1}>

                <Grid item xs={3}>
                  {/* Autocomplete for selecting a merchant */}
                  <Grid
                    item
                    xs={12}
                    style={{ position: "relative" }}
                  >
                    <label
                      className="py-1"
                      style={{
                        fontWeight: "var(--font-weight-medium)",
                        fontSize: "var(--font-medium)",
                        color: "var(--primary-color)",
                      }}
                    >
                      Merchant Name
                    </label>
                  </Grid>
                  <Autocomplete
                    name="merchantId"
                    disableClearable={true}
                    
                    options={merchants || []}
                    onChange={handleMerchantOnChange}
                    value={
                      merchants ? merchants.find(
                        (v) => v.merchantId == filters.merchantId
                      ) : null
                    }
                    getOptionLabel={(option) => `${option.merchantName}`}
                    renderInput={(params) => (
                      <BootstrapInputOld {...params} />
                    )}
                  />
                </Grid>

                <Grid item xs={3}>
                  {/* Input for entering a transaction ID */}
                  <Grid
                    item
                    xs={3.2}
                    style={{ position: "relative" ,whiteSpace:'nowrap'}}
                  >
                    <label
                      className="py-1"
                      style={{
                        fontWeight: "var(--font-weight-medium)",
                        fontSize: "var(--font-medium)",
                        color: "var(--primary-color)",
                      }}
                    >
                      Transaction Id
                    </label>
                  </Grid>
                  <BootstrapInputOld
                    label=""
                    placeholder="Transaction Id"
                    name="tid"
                    value={filters.tid}
                    onChange={handleFilterChange}
                  />
                </Grid>

                {/* Date Range Filter (Generic for all sections) */}
                <Grid item xs={2}>
                  <Grid
                    item
                    xs={12}
                    style={{ position: "relative" }}
                  >
                    <label
                      className="py-1"
                      style={{
                        fontWeight: "var(--font-weight-medium)",
                        fontSize: "var(--font-medium)",
                        color: "var(--primary-color)",
                      }}
                    >
                      Create Date
                    </label>
                  </Grid>
                  <MUIDatePicker
                    disableFuture={true}
                    name="receiptStartDate"
                    placeholder="From"
                    value={filters.receiptStartDate ? dayjs(filters.receiptStartDate) : null}
                    format={DateFormat.date}
                    maxDate={filters.receiptEndDate ? dayjs(filters.receiptEndDate) : null}
                    onChange={(e) => {
                      let value = changeDateFormat(e);
                      setFilters({ ...filters, receiptStartDate: value });
                    }}
                  />
                </Grid>

                <Grid item xs={2} >
                  <Grid
                    item
                    xs={12}
                    style={{ position: "relative" }}
                  >
                    <label
                      className="py-1"
                      style={{
                        fontWeight: "var(--font-weight-medium)",
                        fontSize: "var(--font-medium)",
                        color: "var(--primary-color)",
                      }}
                    >
                      End Date
                    </label>
                  </Grid>
                  <MUIDatePicker
                    name="receiptEndDate"
                    disableFuture={true}
                    placeholder="To"
                    value={filters.receiptEndDate ? dayjs(filters.receiptEndDate) : null}
                    format={DateFormat.date}
                    minDate={filters.receiptStartDate ? dayjs(filters.receiptStartDate) : null}
                    onChange={(e) => {
                      let value = changeDateFormat(e);
                      setFilters({ ...filters, receiptEndDate: value });
                    }}
                  />
                </Grid>
                <Grid item xs={2} 
                  style={{
                    display:'flex',
                    alignItems:'end',
                    justifyContent:'center'
                  }}
                >
                  <Button style={{backgroundColor:"var(--primary-color)", textTransform:'none', color:'white', width:'70%'}}
                    onClick={clearFillters}
                  >
                    Clear
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={12} sm={12} mt={1}>
        <Card>
          <CardContent>
            <Grid item xs={12} md={12} sm={12}>
              <Typography variant="h6" component="h6">
                Payment Requests
              </Typography>
            </Grid>

            <Grid item xs={12} md={12} sm={12}>
              {/* SnapshotDataTable for displaying transaction requests */}
              <SnapshotDataTable filters={filters} table="requests" rowkey="transactionId" />
            </Grid>
          </CardContent>
        </Card>
      </Grid>
       <Grid item xs={12} md={12} sm={12} mt={1}>
        <Card>
          <CardContent>
            <Grid item xs={12} md={12} sm={12}>
              <Typography variant="h6" component="h6">
                Trace Entry
              </Typography>
            </Grid>

            <Grid item xs={12} md={12} sm={12}>
              {/* SnapshotDataTable for displaying trace Entry */}
              <SnapshotDataTable filters={filters} table="traceEntry" rowkey="traceId" />
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={12} sm={12} mt={1}>
        <Card>
          <CardContent>
            <Grid item xs={12} md={12} sm={12}>
              <Typography variant="h6" component="h6">
                Payments
              </Typography>
            </Grid>

            <Grid item xs={12} md={12} sm={12}>
              {/* SnapshotDataTable for displaying payment data */}
              <SnapshotDataTable filters={filters} table="payments" rowkey="paymentId" />
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={12} sm={12} mt={1}>
        <Card>
          <CardContent>
            <Grid item xs={12} md={12} sm={12}>
              <Typography variant="h6" component="h6">
                Refunds
              </Typography>
            </Grid>

            <Grid item xs={12} md={12} sm={12}>
              {/* SnapshotDataTable for displaying refund data */}
              <SnapshotDataTable filters={filters} table="refunds" rowkey="refundId"/>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={12} sm={12} mt={1}>
        <Card>
          <CardContent>
            <Grid item xs={12} md={12} sm={12}>
              <Typography variant="h6" component="h6">
                Settlements 
              </Typography>
            </Grid>

            <Grid item xs={12} md={12} sm={12}>
              {/* SnapshotDataTable for displaying trace Entry */}
              <SnapshotDataTable filters={filters} table="settlementsData" rowkey="priSettlementId" />
            </Grid>
          </CardContent>
        </Card>
      </Grid>

    </Box>
  );
};

export default SnapshotDataPage;