import React from "react";
import './upload-settlement.scss'
import {
  Grid, CardContent, Card,
  Box,
} from "@mui/material";
import { ButtonPrimary, ButtonSecondary } from "../../$widgets/buttons/form-button";
import TitleBar from "../../title-bar/title-bar";
import DatePicker from "react-datepicker";
import GetAppIcon from "@material-ui/icons/GetApp";
import Paper from "@material-ui/core/Paper";
import TableScrollbar from 'react-table-scrollbar';
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import ReactPaginate from 'react-paginate';
import Add from '@material-ui/icons/Add'
import WarningIcon from '@material-ui/icons/Warning';;
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast'
import { DateFormat } from "../../../enum/common.enum";
import { BootstrapLabel } from "components/$widgets/form-inputs/BootstrapLabel";
import PermissionGuard from "components/$widgets/permission/permissionGuard";
import { DefaultDateFormat, PrivilegeConstants } from "config/constants";
import moment from "moment";

export function html() {
  const { loading,
    titleName,
    fromProviderStartDate,
    fromProviderEndDate,
    fromProviderSettlemntProvider,
    fromProviderMerchantName,
    fromProviderMerchantId,
    allProviders,
    allMerchants,
    generatedByBenepayStartDate,
    generatedByBenepayEndDate,
    generatedByBenepayMerchantName,
    generatedByBenepayMerchantId,
    searchedFromProviderResult,
    searchedGeneratedByBenepayResult,
    uploadedFileResult,
    uploadFileStatus,
    uploadNewSettlementDate,
    uploadNewSettlemntProvider,
    uploadNewMerchantName,
    uploadNewSettlemntFile,
    pageNo,
    pageSize,
    initalPage,
    totalPages,
    numPageShow,
    toastTitle,
    toastBody,
    toastShow
  } = this.state;

  const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: "#f9f9f9",
      color: "#000",
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);

  const StyledTableRow = withStyles((theme) => ({
    root: {
      "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);


  return (

    <div className="settlement-main">
      {loading && (
        <div id="semiTransparenDiv"></div>)}
      <Box mt={4}>
        <TitleBar
          className={"mt-1"}
          color="blue"
          ruleColor="blue"
          title={titleName}
        />
      </Box>

      {/* Toast */}
      <Toast style={{ minWidth: '100%' }} onClose={() => { this.setState({ toastShow: false }) }} show={this.state.toastShow} delay={10000} autohide>
        <Toast.Header className="text-white" style={{ backgroundColor: '#F6635C' }}>
          <WarningIcon />
          <strong className="h6 ml-4 mt-2 w-100">{this.state.toastTitle}</strong>
          {/* <small>11 mins ago</small> */}
        </Toast.Header>
        <Toast.Body>{this.state.toastBody}</Toast.Body>
      </Toast>

      <Box mt={1}>
        <Card className="pb-5 pt-2 px-3" style={{ overflow: 'visible' }}>
          <CardContent>

            {/* Tabs */}

            <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist" style={{ borderBottom: "1px solid #ddd", adding: "5px", width: "100%", marginTop: "-20px", paddingBottom: '20px', display: 'flex', justifyContent: 'flex-start', position: "relative" }}>
              <PermissionGuard userPermission={PrivilegeConstants.SETTLEMENT_REPORT_FROM_PROVIDER}>
                <li className="nav-item" role="presentation">
                  <a
                    style={{ padding: '8px 20px' }}
                    className="nav-link active"
                    onClick={this.fromProviderClick}
                    id="pills-from-provider-tab"
                    data-toggle="pill"
                    href="#pills-from-provider"
                    role="tab"
                    aria-controls="pills-from-provider"
                    aria-selected="true"
                  >
                    From Provider
                  </a>
                </li>
              </PermissionGuard>
              <PermissionGuard userPermission={PrivilegeConstants.SETTLEMENT_REPORT_GENERATED_BY_BENEPAY}>
                <li className="nav-item" role="presentation">
                  <a
                    style={{ padding: '8px 20px' }}
                    className="nav-link"
                    onClick={this.generatedByBenepayClick}
                    id="pills-generated-by-benepay-tab"
                    data-toggle="pill"
                    href="#pills-generated-by-benepay"
                    role="tab"
                    aria-controls="pills-generated-by-benepay"
                    aria-selected="true"
                  >
                    Generated By Benepay
                  </a>
                </li>
              </PermissionGuard>
              <PermissionGuard userPermission={PrivilegeConstants.UPLOAD_SETTLEMENT_REPORT}>
                <li className="nav-item" role="presentation" style={{ position: "absolute", top: 0, right: 0 }}>
                  <a
                    style={{ padding: '8px 20px' }}
                    className="nav-link bg-primary text-white rounded"
                    onClick={this.uploadNewClick}
                    id="pills-upload-new-tab"
                    data-toggle="pill"
                    href="#pills-upload-new"
                    role="tab"
                    aria-controls="pills-upload-new"
                    aria-selected="true"
                  >
                    <Add /> <span>Upload New</span>
                  </a>
                </li>
              </PermissionGuard>
            </ul>


            {/* Content */}
            <div className="tab-content" id="pills-tabContent">

              {/* From Provider */}
              {true && <>
                <div className="tab-pane fade show active" id="pills-from-provider" role="tabpanel" aria-labelledby="pills-from-provider-tab">
                  {/* Inputs */}
                  <div className="row justify-content-start">
                    <div className="col-3">
                      <label htmlFor="fromProviderSettlemntDate" className="h6 font-weight-normal mr-1">Settlement Date</label>
                      <div className="row justify-content-start mt-2">
                        <div className="col">
                          <DatePicker id="fromProviderSettlemntDate" className="w-100" maxDate={new Date(Date.now())} selected={fromProviderStartDate} placeholderText="From" dateFormat={DateFormat.datePickerDate} onChange={(date) => this.setState({ fromProviderStartDate: date })} />
                        </div>
                        <div className="col">
                          <DatePicker className="w-100" selected={fromProviderEndDate} maxDate={new Date(Date.now())} placeholderText="To" dateFormat={DateFormat.datePickerDate} onChange={(date) => this.setState({ fromProviderEndDate: date })} />
                          {/* dateFormat="yyyy-MM-dd"   */}
                        </div>
                      </div>
                    </div>
                    <div className="col-2">
                      <label htmlFor="fromProviderSettlemntProvider" className="h6 font-weight-normal mr-1">Settlement Provider</label>
                      <div className="d-flex mt-2">
                        <select
                          id="fromProviderSettlemntProvider"
                          className="form-control w-100"
                          selected={fromProviderSettlemntProvider}
                          placeholder="PayGlocal / Finaro"
                          onChange={(e) => this.setState({ fromProviderSettlemntProvider: e.target.value })}
                        >
                          <option value="">All</option>
                          {this.state.allProviders &&
                            this.state.allProviders.map((e) => (
                              (fromProviderSettlemntProvider === e) ?
                                <option key={e} value={e} selected>
                                  {e}
                                </option>
                                :
                                <option key={e} value={e}>
                                  {e}
                                </option>
                            ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-2">
                      <label htmlFor="fromProviderMerchantName" className="h6 font-weight-normal mr-1">Merchant Name</label>
                      <div className="d-flex mt-2">
                        <select
                          id="fromProviderMerchantName"
                          className="form-control w-100"
                          selected={fromProviderMerchantName}
                          placeholder="Merchant Name"
                          onChange={(e) => {
                            this.setState({ fromProviderMerchantName: e.target.value });
                            const merchantVal = this.state.allMerchants.find((option) => option.merchantName === e.target.value);
                            if (e.target.value !== "") {
                              this.setState({ fromProviderMerchantId: merchantVal.merchantId });
                            } else {
                              this.setState({ fromProviderMerchantId: null });
                            }
                          }
                          }
                        >
                          <option value="">All</option>
                          {this.state.allMerchants &&
                            this.state.allMerchants.map((merchant) => (
                              (fromProviderMerchantName === merchant.merchantName) ?
                                <option key={merchant.merchantId} value={merchant.merchantName} selected>
                                  {merchant.merchantName}
                                </option>
                                :
                                <option key={merchant.merchantId} value={merchant.merchantName}>
                                  {merchant.merchantName}
                                </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  {/* <div className="col-2">
                    <label htmlFor="fromProviderMerchantName" className="h6 font-weight-normal mr-1">Merchant Name</label>
                    <div className="d-flex mt-2">
                      <select
                        id="fromProviderMerchantName"
                        className="form-control w-100"
                        selected={fromProviderMerchantName}
                        placeholder="Merchant Name"
                        onChange={(e) => {
                          this.setState({ fromProviderMerchantName: e.target.value });
                          const merchantVal = this.state.allMerchants.find((option) => option.merchantName === e.target.value);
                          if (e.target.value !== "") {
                            this.setState({ fromProviderMerchantId: merchantVal.merchantId });
                          } else {
                            this.setState({ fromProviderMerchantId: null });
                          }
                        }
                        }
                      >
                        <option value="">All</option>
                        {this.state.allMerchants &&
                          this.state.allMerchants.map((merchant) => (
                            (fromProviderMerchantName === merchant.merchantName) ?
                              <option key={merchant.merchantId} value={merchant.merchantName} selected>
                                {merchant.merchantName}
                              </option>
                              :
                              <option key={merchant.merchantId} value={merchant.merchantName}>
                                {merchant.merchantName}
                              </option>
                          ))}
                      </select>
                    </div>
                  </div> */}
                </div>
              </>}

              {/* Generated By Benepay */}
              {true && <>
                <div className="tab-pane fade show" id="pills-generated-by-benepay" role="tabpanel" aria-labelledby="pills-generated-by-benepay-tab">
                  {/* Inputs */}
                  <div className="row justify-content-start">
                    <div className="col-3">
                      <label htmlFor="generatedByBenepaySettlemntDate" className="h6 font-weight-normal mr-1">Settlement Date</label>
                      <div className="row justify-content-start mt-2">
                        <div className="col">
                          <DatePicker id="generatedByBenepaySettlemntDate" className="w-100" maxDate={new Date(Date.now())} selected={generatedByBenepayStartDate} placeholderText="From" dateFormat={DateFormat.datePickerDate} onChange={(date) => this.setState({ generatedByBenepayStartDate: date })} />
                        </div>
                        <div className="col">
                          <DatePicker className="w-100" maxDate={new Date(Date.now())} selected={generatedByBenepayEndDate} placeholderText="To" dateFormat={DateFormat.datePickerDate} onChange={(date) => this.setState({ generatedByBenepayEndDate: date })} />
                          {/* dateFormat="yyyy-MM-dd"   */}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="col-2">
                    <label htmlFor="generatedByBenepayMerchantName" className="h6 font-weight-normal mr-1">Merchant Name</label>
                    <div className="d-flex mt-2">
                      <select
                        id="generatedByBenepayMerchantName"
                        className="form-control w-100"
                        selected={generatedByBenepayMerchantName}
                        placeholder="Merchant Name"
                        onChange={
                          (e) => {
                            this.setState({ generatedByBenepayMerchantName: e.target.value })
                            const merchantVal = this.state.allMerchants.find((option) => option.merchantName === e.target.value);
                            if (e.target.value !== "") {
                              this.setState({ generatedByBenepayMerchantId: merchantVal.merchantId });
                            } else {
                              this.setState({ generatedByBenepayMerchantId: null });
                            }
                          }
                        >
                          <option value="">All</option>
                          {this.state.allMerchants &&
                            this.state.allMerchants.map((merchant) => (
                              (generatedByBenepayMerchantName === merchant.merchantName) ?
                                <option key={merchant.merchantId} value={merchant.merchantName} selected>
                                  {merchant.merchantName}
                                </option>
                                :
                                <option key={merchant.merchantId} value={merchant.merchantName}>
                                  {merchant.merchantName}
                                </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  {/* Buttons */}
                  <div className="d-flex justify-content-start mt-5 mr-5">
                    <span style={{ marginRight: "60px" }}>
                      <ButtonPrimary
                        onClick={() => {
                          this.setState({ initalPage: 0 });
                          this.handleApplyGeneratedByBenepay(1);
                        }}
                      >
                        Search
                      </ButtonPrimary>
                      <ButtonSecondary
                        onClick={this.clearGeneratedByBenepay}
                        style={{ marginLeft: "5px" }}
                      >
                        Clear
                      </ButtonSecondary>
                    </span>
                  </div>
                </div>
              </>}

              {/* Upload New */}
              <PermissionGuard userPermission={PrivilegeConstants.UPLOAD_SETTLEMENT_REPORT}>
                <div className="tab-pane fade show" id="pills-upload-new" role="tabpanel" aria-labelledby="pills-upload-new-tab">
                  {(uploadFileStatus && uploadFileStatus === 'success') ?

                    // Success Page
                    <div>
                      <div>
                        <p className="mt-1 font-bold h4 text-primary" style={{ fontWeight: '600', color: '#13273F' }}>File Uploaded Successful!</p>
                      </div>
                      <div>
                        <p className="mt-4 font-normal h6 text-primary" style={{ fontWeight: '600', color: '#13273F' }}>Upload Summary</p>
                      </div>

                      <div className="overflow-x-hidden" width="100%" style={{ overflowX: "hidden", marginTop: '0.25rem' }}>
                        <TableContainer
                          component={Paper}
                          style={{ marginTop: "1rem" }}
                        >
                          {/* <TableScrollbar rows={12} className="scroll-bar"> */}
                          {uploadedFileResult && (
                            <TableScrollbar className="scroll-bar">
                              <Table
                                className="w-50"
                                style={{ minWidth: 700 }}
                                aria-label="customized table"
                              >
                                <TableBody>
                                  <StyledTableRow style={{ height: "40px" }}>
                                    <StyledTableCell align="left" style={{ width: '300px' }}>
                                      <span style={{ fontWeight: '500' }}>File Name</span>
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                      {this.state.uploadedFileResult.fileName}
                                    </StyledTableCell>
                                  </StyledTableRow>
                                  <StyledTableRow style={{ height: "40px" }}>
                                    <StyledTableCell align="left">
                                      <span style={{ fontWeight: '500' }}>Date File Uploaded</span>
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                    {moment(this.state.uploadedFileResult.uploadedAt).format(DefaultDateFormat.dateFormatddmmmyyyy)}
                                    </StyledTableCell>
                                  </StyledTableRow>
                                  <StyledTableRow style={{ height: "40px" }}>
                                    <StyledTableCell align="left">
                                      <span style={{ fontWeight: '500' }}>Settlement Date</span>
                                    </StyledTableCell>
                                    {/* <StyledTableCell align="left">
                                      {`${this.state.uploadedFileResult.settlementDate.dayOfMonth} ${this.state.uploadedFileResult.settlementDate.month.substring(0, 3)} ${this.state.uploadedFileResult.settlementDate.year}`}
                                    </StyledTableCell> */}
                                    <StyledTableCell align="left">
                                      {this.state.uploadedFileResult.settlementDate
                                        ? moment(
                                          `${this.state.uploadedFileResult.settlementDate.dayOfMonth} 
                                            ${this.state.uploadedFileResult.settlementDate.month} 
                                            ${this.state.uploadedFileResult.settlementDate.year}`,
                                          (DefaultDateFormat.dateFormatddmmmyyyywI) 
                                        ).format(DefaultDateFormat.dateFormatddmmmyyyy)
                                        : "-"}
                                    </StyledTableCell>
                                  </StyledTableRow>
                                  <StyledTableRow style={{ height: "40px" }}>
                                    <StyledTableCell align="left">
                                      <span style={{ fontWeight: '500' }}>Merchant Name</span>
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                      {this.state.uploadedFileResult.merchantName}
                                    </StyledTableCell>
                                  </StyledTableRow>
                                  <StyledTableRow style={{ height: "40px" }}>
                                    <StyledTableCell align="left">
                                      <span style={{ fontWeight: '500' }}>Total Records</span>
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                      {this.state.uploadedFileResult.totalRecords}
                                    </StyledTableCell>
                                  </StyledTableRow>
                                  <StyledTableRow style={{ height: "40px" }}>
                                    <StyledTableCell align="left">
                                      <span style={{ fontWeight: '500' }}>Total Payment Records</span>
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                      {this.state.uploadedFileResult.paymentTrxns}
                                    </StyledTableCell>
                                  </StyledTableRow>
                                  <StyledTableRow style={{ height: "40px" }}>
                                    <StyledTableCell align="left">
                                      <span style={{ fontWeight: '500' }}>Total Refund Records</span>
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                      {this.state.uploadedFileResult.refundTrxns}
                                    </StyledTableCell>
                                  </StyledTableRow>
                                  <StyledTableRow style={{ height: "40px" }}>
                                    <StyledTableCell align="left">
                                      <span style={{ fontWeight: '500' }}>Successfully Uploaded</span>
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                      {this.state.uploadedFileResult.successfulTrxns}
                                    </StyledTableCell>
                                  </StyledTableRow>
                                  <StyledTableRow style={{ height: "40px" }}>
                                    <StyledTableCell align="left">
                                      <span style={{ fontWeight: '500' }}>Failed Upload</span>
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                      {this.state.uploadedFileResult.failedTrxns}
                                    </StyledTableCell>
                                  </StyledTableRow>
                                  <StyledTableRow style={{ height: "40px" }}>
                                    <StyledTableCell align="left">
                                      <span style={{ fontWeight: '500' }}>Reconciled</span>
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                      {this.state.uploadedFileResult.reconciled}
                                    </StyledTableCell>
                                  </StyledTableRow>
                                  <StyledTableRow style={{ height: "40px" }}>
                                    <StyledTableCell align="left">
                                      <span style={{ fontWeight: '500' }}>Not Reconciled</span>
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                      {this.state.uploadedFileResult.notReconciled}
                                    </StyledTableCell>
                                  </StyledTableRow>
                                </TableBody>
                              </Table>
                            </TableScrollbar>
                          )}
                        </TableContainer>
                      </div>

                      <div style={{ marginTop: '30px' }}>
                        <ButtonPrimary
                          onClick={() => {
                            this.setState({ uploadFileStatus: null });
                          }}
                        >
                          upload Another File
                        </ButtonPrimary>
                        <ButtonSecondary
                          onClick={() => {
                            document.getElementById('pills-from-provider-tab').click();
                          }}
                          style={{ marginLeft: "5px" }}
                        >
                          Back To Search
                        </ButtonSecondary>
                      </div>

                    </div>

                    :

                    // Upload Page
                    <div>
                      <form className="my-form" encType="multipart/form" onSubmit={this.handleUploadFileSubmit}>

                        {/* Inputs */}
                        <div className="row justify-content-start">
                          <div className="col-2">
                            <BootstrapLabel htmlFor="uploadNewSettlemntProvider" shrink required >Settlement Date</BootstrapLabel>
                            <div className="mt-2">
                              <DatePicker id="uploadNewSettlementDate" className="w-100" selected={uploadNewSettlementDate} placeholderText="Settlement Date" dateFormat={DateFormat.datePickerDate} onChange={(date) => this.setState({ uploadNewSettlementDate: date })} />
                            </div>
                          </div>
                          <div className="col-2">
                            <BootstrapLabel htmlFor="uploadNewSettlemntProvider" shrink required >Settlement Provider</BootstrapLabel>
                            <div className="d-flex mt-2">
                              <select
                                id="uploadNewSettlemntProvider"
                                className="form-control w-100"
                                selected={uploadNewSettlemntProvider}
                                placeholder="PayGlocal / Finaro"
                                onChange={(e) => this.setState({ uploadNewSettlemntProvider: e.target.value })}
                              >
                                <option value="">All</option>
                                {this.state.allProviders &&
                                  this.state.allProviders.map((e) => (
                                    (uploadNewSettlemntProvider === e) ?
                                      <option key={e} value={e} selected>
                                        {e}
                                      </option>
                                      :
                                      <option key={e} value={e}>
                                        {e}
                                      </option>
                                  ))}
                              </select>
                            </div>
                          </div>
                          <div className="col-2">
                            <BootstrapLabel htmlFor="uploadNewSettlemntProvider" shrink required >Merchant Name</BootstrapLabel>
                            <div className="d-flex mt-2">
                              <select
                                id="uploadNewMerchantName"
                                className="form-control w-100"
                                selected={uploadNewMerchantName}
                                placeholder="Merchant Name"
                                onChange={(e) => this.setState({ uploadNewMerchantName: e.target.value })}
                              >
                                <option value="">All</option>
                                {this.state.allMerchants &&
                                  this.state.allMerchants.map((merchant) => (
                                    (uploadNewMerchantName === merchant.merchantName) ?
                                      <option key={merchant.merchantId} value={merchant.merchantId} selected>
                                        {merchant.merchantName}
                                      </option>
                                      :
                                      <option key={merchant.merchantId} value={merchant.merchantId}>
                                        {merchant.merchantName}
                                      </option>
                                  ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* File Upload */}
                        <div className="mt-6" style={{ width: '60%', marginTop: '40px' }}>
                          <label id="drop-area" htmlFor="fileElem" className="mt-6">
                            <label>
                              <i
                                className="fa fa-upload uploadIcon"
                                style={{ fontSize: "60px" }}
                              ></i>
                              <br />
                              <input
                                type="file"
                                name="settlementFile"
                                id="fileElem"
                                accept=".csv"
                                onChange={(e) => {
                                  this.handleUploadFileChange(e);
                                  e.target.value = "";
                                }}
                              // accept=".csv/*"
                              />
                              <b className="mt-3">Choose a file</b> or drag it here.
                              <p>{this.state.uploadNewFileName}</p>
                            </label>
                          </label>
                        </div>

                        {/* Buttons */}
                        <div className="d-flex justify-content-start mt-5 mr-5">
                          <span style={{ marginRight: "60px" }}>
                            <ButtonPrimary disabled={loading || !uploadNewSettlementDate || !uploadNewSettlemntFile || !uploadNewSettlemntProvider || !uploadNewMerchantName} >
                              <input type="submit" value={'Upload'} className="bg-transparent border-0 font-weight-bold text-white"></input>
                            </ButtonPrimary>
                            <ButtonSecondary
                              onClick={this.clearUploadFilePage}
                              style={{ marginLeft: "5px" }}
                            >
                              Clear
                            </ButtonSecondary>
                          </span>
                        </div>

                      </form>
                    </div>

                  }
                </div>
              </PermissionGuard>

            </div>

          </CardContent>
        </Card>
      </Box>

      {searchedFromProviderResult && (
        <PermissionGuard userPermission={PrivilegeConstants.SETTLEMENT_REPORT_FROM_PROVIDER}>
          <Box mt={1}>
          {/* Result */}
          {searchedFromProviderResult && searchedFromProviderResult.length > 0 ? (
            <div className="transactions-list my-4 overflow-x-hidden" width="100%" style={{ overflowX: "hidden" }}>
              <TableContainer
                component={Paper}
                style={{ marginTop: "1rem" }}
              >
                <TableScrollbar className="scroll-bar">
                  <Table
                    style={{ minWidth: 700 }}
                    aria-label="customized table"
                  >
                    <TableHead style={{ backgroundColor: "red" }}>
                      <TableRow style={{ top: "0" }}>
                        <StyledTableCell align="left">
                          Upload TimeStamp
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          Settlement Date
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Merchant
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Provider
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          File Name
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Total Records
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Payments
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Refunds
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Reconciled
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Download
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {searchedFromProviderResult &&
                        searchedFromProviderResult.map((e, i) => ( e !== null &&
                          <StyledTableRow key={i} style={{ height: "60px" }}>
                            <StyledTableCell align="left">
                              { e.uploadedAt != null ?
                               (e.uploadedAt)
                              : '-'}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {e.settlementDate != null ?
                                `${("0" + e.settlementDate.dayOfMonth).slice(-2)}/${("0" + e.settlementDate.monthValue).slice(-2)}/${e.settlementDate.year}`
                              :'-'}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {e.merchantName}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {e.settlementProvider}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {e.fileName}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {e.totalRecords}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {e.paymentTrxns}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {e.refundTrxns}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {e.reconciled}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              <span onClick={this.downloadFromSettlementFile} fileid={e.fileId} download="Sample Upload File" className="cursor-pointer"><GetAppIcon /></span>
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableScrollbar>
              </TableContainer>

              <ReactPaginate
                previousLabel={'<'}
                nextLabel={'>'}
                breakLabel={''}
                pageCount={this.state.totalPages}
                marginPagesDisplayed={0}
                pageRangeDisplayed={this.state.numPageShow}
                onPageChange={this.handlePaginateFromProvider}
                containerClassName={'pagination justify-content-center'}
                pageClassName={'page-item '}
                pageLinkClassName={'page-link rounded-circle mx-1 my-2'}
                previousClassName={'page-item'}
                previousLinkClassName={'page-link rounded-circle mx-1 my-2'}
                nextClassName={'page-item'}
                nextLinkClassName={'page-link rounded-circle mx-1 my-2'}
                breakClassName={'page-item'}
                breakLinkClassName={'page-link'}
                activeClassName={'active'}
                forcePage={this.state.initalPage}
              />

            </div>
          ) : (
            <div>
              <Paper
                className="d-flex justify-content-center align-items-center"
                elevation={2}
                style={{ height: "250px" }}
              >
                {" "}
                No Files Uploaded Yet
              </Paper>
            </div>
          )}
          </Box>
        </PermissionGuard>
      )}

      {searchedGeneratedByBenepayResult && (
        <PermissionGuard userPermission={PrivilegeConstants.SETTLEMENT_REPORT_GENERATED_BY_BENEPAY}>
          <Box mt={1}>
          {/* Result */}
          {searchedGeneratedByBenepayResult && searchedGeneratedByBenepayResult.length > 0 ? (
            <div className="transactions-list my-4 overflow-x-hidden" width="100%" style={{ overflowX: "hidden" }}>
              <TableContainer
                component={Paper}
                style={{ marginTop: "1rem" }}
              >
                <TableScrollbar className="scroll-bar">
                  <Table
                    style={{ minWidth: 700 }}
                    aria-label="customized table"
                  >
                    <TableHead style={{ backgroundColor: "red" }}>
                      <TableRow style={{ top: "0" }}>
                        <StyledTableCell align="left">
                          Generated On
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          Settlement Date
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          File Name
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Total Records
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Download
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {searchedGeneratedByBenepayResult &&
                        searchedGeneratedByBenepayResult.map((e, i) => (
                          <StyledTableRow key={i} style={{ height: "60px" }}>
                            <StyledTableCell align="left">
                              {e.generatedOn ? `${("0" + e.generatedOn.dayOfMonth).slice(-2)}/${("0" + e.generatedOn.monthValue).slice(-2)}/${e.generatedOn.year} ${e.generatedOn.hour}:${e.generatedOn.minute}:${e.generatedOn.second}` : '-'}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {e.settlementDate ? `${("0" + e.settlementDate.dayOfMonth).slice(-2)}/${("0" + e.settlementDate.monthValue).slice(-2)}/${e.settlementDate.year}` : '-'}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {e.fileName}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {e.totalRecords}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              <span onClick={this.downloadGeneratedByBenepayFile} fileid={e.fileId} download="Sample Upload File" className="cursor-pointer"><GetAppIcon /></span>
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableScrollbar>
              </TableContainer>

              <ReactPaginate
                previousLabel={'<'}
                nextLabel={'>'}
                breakLabel={''}
                pageCount={this.state.totalPages}
                marginPagesDisplayed={0}
                pageRangeDisplayed={this.state.numPageShow}
                onPageChange={this.handlePaginateGeneratedByBenepay}
                containerClassName={'pagination justify-content-center'}
                pageClassName={'page-item '}
                pageLinkClassName={'page-link rounded-circle mx-1 my-2'}
                previousClassName={'page-item'}
                previousLinkClassName={'page-link rounded-circle mx-1 my-2'}
                nextClassName={'page-item'}
                nextLinkClassName={'page-link rounded-circle mx-1 my-2'}
                breakClassName={'page-item'}
                breakLinkClassName={'page-link'}
                activeClassName={'active'}
                forcePage={this.state.initalPage}
              />

            </div>
          ) : (
            <div>
              <Paper
                className="d-flex justify-content-center align-items-center"
                elevation={2}
                style={{ height: "250px" }}
              >
                {" "}
                No Files Uploaded Yet
              </Paper>
            </div>
          )}
          </Box>
        </PermissionGuard>
      )}

    </div>
  );
}
