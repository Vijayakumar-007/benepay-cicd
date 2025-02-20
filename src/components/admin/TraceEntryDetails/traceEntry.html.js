/**
 * @author Anurag Pundir
 *
 */

import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import "./traceEntry.scss";
import { Grid,FormControl} from '@material-ui/core';
import Loader from 'components/$widgets/loader';
import Pagination from '../merchants/pagination';
import { TextField } from '@mui/material';
import {
  ButtonPrimary,
  ButtonSecondary,
} from "../../$widgets/buttons/form-button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DateFormat } from "../../../enum/common.enum";
import { Autocomplete } from '@material-ui/lab';

export function html({
  traceId,
  transactionId,
  startDate,
  endDate,
  paymentStatus,
  merchant,
  transactionType,
  setMerchant,
  setTransactionType,
  setPaymentStatus,
  setTraceId,
  setTransactionId,
  setStartDate,
  setEndDate,
  merchantList,
  result,
  columns,
  prepareResult,
  rowsWithId,
  isLoading,
  clearSearchFields
}) {
  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <Loader loading={isLoading} />
      <Grid container>
        <Grid item xl={10} md={8} lg={8} sm={8}>
          <h1 style={{ color: 'var(--primary-color)', fontSize: '22px', fontFamily: 'sans-serif', marginTop: '15px' }}>TraceEntry Details</h1>
        </Grid>
      </Grid>
      <hr className='divider' style={{ border: '0.1px solid #2f7fe3', width: '100%', opacity: '30%' }} />
      <Grid container mt={1} spacing={2} style={{ width: '75%', marginBottom: "4px", paddingLeft: '2px' }}>
        <Grid item xs={12} md={3} xl={2}>
          <label htmlFor="traceId" style={{ fontWeight: "500" }}>Trace Id</label>
          <input
            type="text"
            className="form-control"
            value={traceId}
            onChange={(e) => {
              setTraceId(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} md={3} xl={2}>
          <label htmlFor="transactionId" style={{ fontWeight: "500" }}>Transaction Id</label>
          <input
            type="text"
            className="form-control"
            value={transactionId}
            onChange={(e) => {
              setTransactionId(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} md={3} xl={2}>
          <label htmlFor="startDate" style={{ fontWeight: "500" }}>Start Date</label>
          <DatePicker
            style={{ width: "100%" }}
            selected={startDate}
            placeholderText={
              DateFormat.datePickerDate
            }
            dateFormat={DateFormat.datePickerDate}
            onChange={(date) =>
              setStartDate(date)
            }
          />
        </Grid>
        <Grid item xs={12} md={3} xl={2}>
          <label htmlFor="endDate" style={{ fontWeight: "500" }}>End Date</label>
          <DatePicker
            style={{ width: "100%" }}
            selected={endDate}
            placeholderText={
              DateFormat.datePickerDate
            }
            dateFormat={DateFormat.datePickerDate}
            onChange={(date) =>
              setEndDate(date)
            }
          />
        </Grid>
        <Grid item xs={12} md={3} xl={2}>
          <label htmlFor="Payment Status" style={{ fontWeight: "500" }}>Paymetn Status</label>
          <input
            type="text"
            className="form-control"
            value={paymentStatus}
            onChange={(e) => {
              setPaymentStatus(e.target.value);
            }}
          />
        </Grid>

        <Grid item xs={12} md={3} xl={2}>
          <label htmlFor="Payment Status" style={{ fontWeight: "500" }}>
            Merchant Id
          </label>
          <FormControl fullWidth>
            <Autocomplete
              id="merchantId"
              size="small"
              options={merchantList} 
              getOptionLabel={(option) => option} // Since merchantList contains strings (merchant IDs), the label is the option itself
              value={merchantList.find((v) => v === merchant) || null} // Set the current value based on selected merchant
              onChange={(e, newValue) => {
                setMerchant(newValue); // Update state when the merchant is selected
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  size="small"
                  variant="outlined"
                />
              )}
            />
          </FormControl>
        </Grid>


        <Grid item xs={12} md={3} xl={2}>
          <label htmlFor="Transaction Type" style={{ fontWeight: "500" }}>Transaction Type</label>
          <input
            type="text"
            className="form-control"
            value={transactionType}
            onChange={(e) => {
              setTransactionType(e.target.value);
            }}
          />
        </Grid>

      </Grid>
      <Grid item xs={12} md={6} xl={4} style={{ position: "relative", marginTop: "38px" }}>
        <span>
          {/* <ButtonPrimary
            onClick={prepareResult}
            style={{ marginLeft: "5px", padding: "1%" }}
          >
            Search
          </ButtonPrimary> */}
          <ButtonSecondary
            onClick={clearSearchFields}
            style={{ marginLeft: "5px", padding: "1%" }}
          >
            Clear
          </ButtonSecondary>
        </span>
      </Grid>
      <div className="ag-theme-alpine" style={{ height: 600, width: '100%', marginTop: '3%', textAlign: 'center' }}>
        <DataGrid
          disableColumnSelector
          disableColumnMenu
          disableSelectionOnClick
          disableColumnFilter
          rows={result}
          columns={columns} />
      </div>
      {/* <Pagination rowsWithId={dummyData}  */}
      {/* setSelectedRowsWithId={(value) => {this.setState({selectedRowsWithId : value})}  } */}
      {/* /> */}
    </div>
  );
}
