import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import "./merchant.scss";
import { Box, Button, Card, Grid, Typography } from '@material-ui/core';
import Loader from 'components/$widgets/loader';
import GetAppIcon from '@material-ui/icons/GetApp';
import AddIcon from '@material-ui/icons/Add';
import Pagination from './pagination';
import {
  ButtonPrimary,
  ButtonSecondary,
} from "../../$widgets/buttons/form-button";
import PermissionGuard from 'components/$widgets/permission/permissionGuard';
import { PrivilegeConstants } from 'config/constants';
import ConfirmDialog from 'components/$widgets/dialog';
import { BootstrapLabel } from 'components/$widgets/form-inputs/BootstrapLabel';
import { Stack } from '@mui/material';
import AlertDialog from 'components/$widgets/alertDialog';

export function html() {
  const { columns, rowsWithId, isLoading, loading, pageSize, openActivatepopup, openDeActivatepopup, disableDeactivateBtns, disableActivateBtns,errorMessage ,openErrorActivatePopop} = this.state;

  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>

      <Loader loading={loading} />

      <div>
        <Grid container>
          <Grid item xl={10} md={8} lg={8} sm={8}>
            <h1 style={{ color: 'var(--primary-color)', fontSize: '22px', fontFamily: 'sans-serif', margin: '0' }}>Merchant Summary</h1>
          </Grid>

          <Grid item xl={2} md={4} lg={4} sm={4} style={{ textAlign: 'right' }}>
            <Button className='downloadButton' variant="outlined" onClick={this.handleDownloadClick} style={{ margin: '1%', background: 'var(--primary-color)', color: "var(--light-color)" }}>
              <GetAppIcon></GetAppIcon> Export
            </Button>
            <PermissionGuard userPermission={PrivilegeConstants.ADD_MERCHANT}>
              <Button className='downloadButton' variant="outlined" onClick={this.navigateToOnboarding} style={{ margin: '1%', background: 'var(--secondary-color)', color: "var(--light-color)" }}>
                <AddIcon></AddIcon> Add
              </Button>
            </PermissionGuard>
          </Grid>
        </Grid>

        <div>
          <hr className='divider' style={{ border: '1px solid var(--primary-color)', width: '100%' }} />
        </div>

        <PermissionGuard userPermission={PrivilegeConstants.MERCHANT_SUMMARY_LIST}>
          <Grid container mt={1} spacing={2} style={{ width: '75%', marginBottom: "4px", paddingLeft: '2px' }}>
            <Grid item xs={12} md={3} xl={2}>
              <label
                htmlFor="merchantId"
                className="py-1"
                style={{ fontWeight: "500" }}
              >
                Merchant Id
              </label>
              <input
                type="text"
                className="form-control"
                value={this.state.merchantIdSearch}
                onChange={async (e) => {
                  await this.setState({
                    merchantIdSearch: e.target.value,
                  });
                  this.searchWithTheFields();
                }}
              />
            </Grid>
            <Grid item xs={12} md={3} xl={2}>
              <label
                htmlFor="merchantName"
                className="py-1"
                style={{ fontWeight: "500" }}
              >
                Merchant Name
              </label>
              <input
                type="text"
                className="form-control"
                value={this.state.merchantName}
                onChange={async (e) => {
                  await this.setState({
                    merchantName: e.target.value,
                  })
                  this.searchWithTheFields();
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={4} style={{ position: "relative", marginTop: "38px" }}>
              <span>
                {/* <ButtonPrimary
                onClick={this.searchWithTheFields}
                style={{ marginLeft: "5px", padding: "1%" }}
              >
                Apply
              </ButtonPrimary> */}
                <ButtonSecondary
                  onClick={() => { this.setState({ merchantEmail: "", merchantName: "", merchantIdSearch: "", rowsWithId: this.state.rowsWithIdALL, filterApplied:false }) }}
                  style={{ marginLeft: "5px", padding: "1%" }}
                >
                  Clear
                </ButtonSecondary>
              </span>
            </Grid>
          </Grid>
          {this.state.selectedRowsWithId && <>
            <div style={{ width: '100%', height: '100%', minHeight: '200px' }}>
              <DataGrid
                rows={this.state.selectedRowsWithId}
                columns={columns}
                className="custom-data-grid serachedPaymentResultGridPagination"
                pagination={false}
                // initialState={{
                //   pagination: {
                //     paginationModel: { page: 0, pageSize: 10 },
                //   },
                // }}
                loading={isLoading}
                // pageSizeOptions={[{ value: rowsWithId.length, label: 'All' }, 5, 10]}
                // rowsPerPageOptions={[5, 10,]}
                disableColumnMenu
                disableColumnFilter
                disableRowSelectionOnClick
                getRowId={(row) => row.id}

              />
            </div>
          </>}

          <AlertDialog
            open={openActivatepopup}
            cancelBtnLabel="Cancel"
            confirmBtnLabel="Confirm"
            confirmOnClick={this.confirmActivateMerchant}
            cancelOnClick={() => this.setState({ openActivatepopup: false })}
            cancelBtnDisabled={disableActivateBtns}
            confirmBtnDisabled={disableActivateBtns}
          >
            <Grid container >
              <Grid item sx={12}>
                <Typography style={{ color: 'black', fontSize: '20px', fontWeight: 'normal' }} noWrap>Are you sure want to activate this merchant?</Typography>
              </Grid>
            </Grid>
          </AlertDialog>

          <AlertDialog
            open={openDeActivatepopup}
            cancelBtnLabel="Cancel"
            confirmBtnLabel="Confirm"
            confirmOnClick={this.confirmDeActivateMerchant}
            cancelOnClick={() => this.setState({ openDeActivatepopup: false })}
            cancelBtnDisabled={disableDeactivateBtns}
            confirmBtnDisabled={disableDeactivateBtns}
          >
            <Grid container >
              <Grid item sx={12}>
                <Typography style={{ color: 'black', fontSize: '20px', fontWeight: 'normal' }} noWrap>Are you sure  want to de-activate this merchant?</Typography>
              </Grid>
            </Grid>
          </AlertDialog>

          <AlertDialog
            open={openErrorActivatePopop}
            title="Note"
            confirmBtnLabel="Ok"
            confirmOnClick={() => this.setState({ openActivatepopup: false, disableActivateBtns: false, openErrorActivatePopop: false })}
          >
            <Typography sx={{ color: 'black' }} noWrap> Required fields in following tabs need to be provided.</Typography>
            {this.state.errorMessage && this.state.errorMessage.map((str, index) => (
              <Typography key={index} sx={{ color: 'black' }} noWrap>{str.trim()}</Typography>
            ))}
          </AlertDialog>
          
          <Pagination rowsWithId={rowsWithId} setSelectedRowsWithId={(value) => { this.setState({ selectedRowsWithId: value }) }} filterApplied={this.state.filterApplied}/>
        </PermissionGuard>
      </div>
    </div >
  );
}
