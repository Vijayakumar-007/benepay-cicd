/**
 * @author Anurag Pundir
 *
 */

import React from "react";
import {Grid,Button} from '@material-ui/core';
import Loader from 'components/$widgets/loader';
import { DataGrid } from '@mui/x-data-grid';
import { Pagination } from "config/constants";

export function html({
  result,
  columns,
  isLoading,
  setSelectedPaymentMethods,
  savePaymentMethods,
  selectedPaymentMethods,
  selectionModel,
  setSelectionModel

}) {


  return (
    <>
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <Loader loading={isLoading} />
      <Grid container>
        <Grid item xl={10} md={8} lg={8} sm={8}>
          <h1 style={{ color: 'var(--primary-color)', fontSize: '22px', fontFamily: 'sans-serif', marginTop: '15px' }}>Payments Method </h1>
        </Grid>
      </Grid>


     <div className="ag-theme-alpine" style={{ height: 600, width: '100%', marginTop: '2%', textAlign: 'center' }}>
          <DataGrid
            disableColumnSelector
            disableColumnMenu
            disableSelectionOnClick
            disableColumnFilter
            rows={result}
            columns={columns}
            selectionModel={selectionModel}
            isRowSelectable={() => false}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: Pagination.transactionPageSize,
                },
              },
            }}
          />
        </div>
    </div>

    <Grid container style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
    <Button
        variant="contained"
        style={{ width: 'auto', marginRight: '12px', textTransform: 'unset', background: "var(--primary-color)", color: 'white' }}
        onClick={savePaymentMethods}
    >
        Save
    </Button>
    <Button
        variant="contained"
        style={{ width: 'auto', textTransform: 'unset', background: "var(--primary-color)", color: 'white' }}
        onClick={() => {
          console.log("this is the setSelectedPaymentMethods :",selectedPaymentMethods);
          setSelectedPaymentMethods([]) }}
    >
        Clear
    </Button>
 </Grid>
 
</>
  );
}