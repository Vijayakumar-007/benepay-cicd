import React, { Component } from "react";
import "../home.scss";
import {
  ButtonPrimary,
  ButtonSecondary,
} from "../../$widgets/buttons/form-button";
import ReactPaginate from "react-paginate";
import {
  Backdrop,
  Box,
  Grid,
  Typography,
  NativeSelect,
  MenuItem,
  FormControl,
  Select,
  Button,
} from "@mui/material";
import { Autocomplete, TextField, InputBase } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DataGrid } from "@mui/x-data-grid";
import { DateFormat } from "../../../enum/common.enum";
import { TempStorage, USER_TYPE } from "../../../service/core/storage.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faXmark,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";
import CustomNoRowsOverlay from "./customNoRowsOverlay.v1";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import RefreshIcon from '@mui/icons-material/Refresh';
import { CircularProgress } from "@material-ui/core";
import Validator from "../../../service/core/validator";
import MUIDatePicker from "../../$widgets/form-inputs/MUIDatePicker";
import dayjs from "dayjs";
import { OnboardConstants, PrivilegeConstants } from "config/constants";
import PermissionGuard from "components/$widgets/permission/permissionGuard";

export function html() {
  const BootstrapInput = styled(InputBase)(({ theme }) => ({
    "label + &": {
      marginTop: theme.spacing(3),
    },
    "& .MuiInputBase-input": {
      borderRadius: 4,
      position: "relative",
      border: "1px solid #ced4da",
      minWidth: "100%",
      padding: "10px 26px 10px 5px",
    },
  }));

  const {
    refundModel,
    showValidationMsg,
    selectedOption,
    showFailureModal,
    paymentDetails,
    showProcessedTable,
    showRefundConfirmationModal,
    showCancellationModal,
    showConfirmationModal,
    showCancellationReason,
    paymentId,
    isError,
    selectedTransactionId,
    selectedStatus,
    selectedFinalDueAmount,
    selectedReceiptTimestamp,
    selectedDebtorName,
    selectedDebtorEmailId,
    selectedReasonForCharges,
    selectedCollectionRefNumber,
    selectedCollectionCurrency,
    selectedPaymentConfirmationId,
    selectedPaymentCurrency,
    selectedPaymentCompletionTimestamp,
    selectedPaymentDueDate,
    selectedPaymentLink,
    selectedCancelledTimestamp,
    selectedCardBrand,
    selectedCharges,
    selectedCreateTimeStamp,
    selectedFinalPaymentAmount,
    selectedPaymentMode,
    selectedReasonForCancellation,
    selectedPaymentExpiryDate,
    selectedReasonForCollection,
    selectedFailedAttempts,
    showRefundSuccessModal,
    status,
    apply1Click,
    apply2Click,
    list1Style,
    value,
    rejectedTableShow,
    totalPaymentsFound,
    paymentSettlementModel,
    loading,
    refundLoading,
    isRowVisible,
    selectedItem,
    currentIndex,
    cancellationReason,
    isCancellationProcessing,
    failedAttemptStartDate,
    failedAttemptEndDate,
    benepayPaymentRef,
    collectionReference,
    toAmount,
    fromAmount,
    failedTransactions,
    payerEmail,
    requestorTransactionId,
    settlementDate,
    refundCount,
    receiptStartDate,
    receiptEndDate,
    paymentStartDate,
    paymentEndDate,
    rejectedReceiptStartDate,
    rejectedReceiptEndDate,
    totalPages,
    totalFailedPages,
    totalFailedCount,
    copyText,
    showReminderModal,
    transactionIdForReminder,
    showCancellationSuccessModal,
    transactionDetailsModal,
    transactionPaymenButtonRules,
    searchedBenePayTransactionId,
    searchedRequestorTransactionId,
    payerName,
    collectionRef,
    cancellationFromDate,
    cancellationToDate,
    paidMinAmount,
    paidMaxAmount,
    parentTransactions,
    columns,
    transactionDetails,
    refundResponse,
    paymentDetailsOpen,
    faildTransactionMatched,
    failedTransactionsModal,
    showModal,
    merchantsList,
    mobileViewFilterModal,
    sortingType,
    sortingBy,
    pageNoForRedirect,
    pageNo,
    alreadyAppliedFilters,
    searchedPaymentResultList,
    isFirstTimeSearch,
    isDateFilter,
    isAmountFilter,
    refundSearchModel,
    refundedToPossibleValues,
    expandedRefundDeatil,
    expandedOriginalDeatils,
    refundSummaryList,
    refundColumns,
    totalCountRefundList,
    totalPagesRefund,
    appliedRefundListFilters,
    pageSize,
    referralPartners,
    subMerchantIds
  } = this.state;

  const { currencyList, updateDecimalInRule, updateFormField, autoFixDecimal, refundFormFields, handleRefundMinAmount, handleRefundMaxAmount, handlePaymentMinAmount, handlePaymentMaxAmount } = this.props;

  return (
    <>

      {loading && (
        <div id="semiTransparenDivTest">
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </div>
      )}
      <div
        style={{
          marginTop: "16px",
          paddingBottom: "32px",
          borderBottom: "1px solid #C5DCFC",
        }}
      >
        {/* Already Applied Filters */}
        {appliedRefundListFilters && appliedRefundListFilters.length > 0 && (
          <section
            style={{
              marginTop: "20px",
              width: "100%",
              background: "white",
              borderRadius: "4px",
              padding: "12px 16px",
            }}
          >
            <h2
              style={{
                fontSize: "var(--font-medium)",
                fontWeight: "var(--font-weight-medium)",
                color: "#495370",
                marginBottom: "8px",
              }}
            >
              Filters Applied
            </h2>
            <ul
              style={{
                listStyle: "none",
                padding: "0",
                width: "100%",
                margin: "0",
                display: "flex",
                flexWrap: "wrap",
                gap: "4px",
              }}
            >
              {appliedRefundListFilters.map((item) => (
                <li
                  key={item.title}
                  style={
                    item.value && item.value.length > 0
                      ? {
                        padding: "8px",
                        width: "auto",
                        background: "#F1F1F1",
                        padding: "8px",
                        marginRight: "8px",
                        borderRadius: "4px",
                      }
                      : { display: "none" }
                  }
                >
                  <label
                    key={`Basic-R-${item.title}`}
                    htmlFor={`Status-R-${item.title}`}
                    className="d-flex align-items-center"
                    style={{ display: "flex" }}
                  >
                    <span
                      style={{
                        fontSize: "var(--font-medium)",
                        fontWeight: "var(--font-weight-medium)",
                        color: "#495370",
                        marginRight: "8px",
                      }}
                    >
                      {item.title}{" "}
                      <span
                        style={{
                          fontSize: "var(--font-x-small)",
                          fontWeight: "600",
                        }}
                      >{`(${item.value})`}</span>
                    </span>
                    <FontAwesomeIcon
                      icon={faXmark}
                      color="#495370"
                      style={{
                        fontSize: "var(--font-x-medium)",
                        cursor: "pointer",
                      }}
                      onClick={item.onClick}
                    />
                  </label>
                </li>
              ))}
            </ul>
          </section>
        )}

        {refundSearchModel && (
          <>
            {/* Refund Search */}
            <Accordion
              expanded={this.state.expandedRefundDeatils === "panel4"}
              onChange={(e) => {
                if (this.state.expandedRefundDeatils === "panel4") {
                  this.setState({ expandedRefundDeatils: false });
                } else {
                  this.setState({ expandedRefundDeatils: "panel4" });
                }
              }}
              sx={{
                border: "none",
                outline: "none",
                boxShadow: "none",
                padding: "4px 8px",
                width: '100%',
              }}
            >
              <AccordionSummary
                expandIcon={
                  <ExpandMoreIcon style={{ color: "var(--mobileAccent)" }} />
                }
                aria-controls="panel4bh-content"
                id="panel4bh-header"
                sx={{
                  display:'flex',
                  width: '100%',
                  borderBottom: "1px solid var(--border)",
                  height: "36px",
                  minHeight: "auto !important",
                  padding: "0 !important",
                  margin: "0 !important",
                }}
              >
                <Typography
                  sx={{
                    width: "100%",
                    flexShrink: 0,
                    color: "var(--primary-color)",
                    fontWeight: "var(--font-weight-medium)",
                    fontSize: "var(--font-x-medium)",
                  }}
                >
                  Refund Transaction Details
                </Typography>
              </AccordionSummary>
              <AccordionDetails style={{ paddingLeft: "0" }}>
                {/* Refund Line 1 Search */}
                <Grid container mt={1} spacing={1}>
                  {(referralPartners.merchantType == OnboardConstants.ReferralMerchant || (this.state.subMerchantIds && this.state.subMerchantIds.length  >0))&& (
                    <Grid item xs={12} md={4} xl={2}>
                      <label
                        htmlFor="merchants"
                        className="py-1"
                        style={{
                          whiteSpace: "nowrap",
                          fontWeight: "var(--font-weight-normal)",
                          fontSize: "var(--font-x-medium)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        Merchants
                      </label>
                      <Autocomplete
                        disablePortal
                        id="merchantList"
                        options={merchantsList || []}
                        defaultValue={merchantsList != null && merchantsList.length > 0 ? 
                          this.state.merchantId ? 
                          {merchantId: this.state.merchantId, merchantName : this.state.merchantId} : merchantsList[0] : null}
                        onChange={this.getMerchantId}
                        value={
                          merchantsList
                            ? merchantsList.find(
                              (v) =>
                                v.merchantName === this.state.selectedMerchant
                            )
                            : null
                        }
                        getOptionLabel={(option) => `${option.merchantName}`}
                        renderInput={(params) => (
                          <TextField
                            className="form-control merchantListDropDown"
                            {...params}
                          />
                        )}
                      />
                    </Grid>
                  )}
                  <Grid item xs={12} md={4} xl={2}>
                    <label
                      htmlFor="refundTransactionId"
                      className="py-1"
                      style={{
                        whiteSpace: "nowrap",
                        fontWeight: "var(--font-weight-normal)",
                        fontSize: "var(--font-x-medium)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      BenePay Refund Txn Id
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={
                        this.state.refundSearchModel.refundTransactionId
                          ? this.state.refundSearchModel.refundTransactionId
                          : ""
                      }
                      onChange={(e) => {
                        let obj = refundSearchModel;
                        obj["refundTransactionId"] = e.target.value;
                        this.setState({ refundSearchModel: obj });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4} xl={2}>
                    <label
                      htmlFor="refundRequestorTransactionId"
                      className="py-1"
                      style={{
                        whiteSpace: "nowrap",
                        fontWeight: "var(--font-weight-normal)",
                        fontSize: "var(--font-x-medium)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Requestor Refund Id
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={
                        this.state.refundSearchModel
                          .refundRequestorTransactionId
                          ? this.state.refundSearchModel
                            .refundRequestorTransactionId
                          : ""
                      }
                      onChange={(e) => {
                        let obj = refundSearchModel;
                        obj["refundRequestorTransactionId"] = e.target.value;
                        this.setState({ refundSearchModel: obj });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4} xl={2}>
                    <label
                      htmlFor="reasonForRefund"
                      className="py-1"
                      style={{
                        whiteSpace: "nowrap",
                        fontWeight: "var(--font-weight-normal)",
                        fontSize: "var(--font-x-medium)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Reason for Refund
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={
                        this.state.refundSearchModel.refundReason
                          ? this.state.refundSearchModel.refundReason
                          : ""
                      }
                      onChange={(e) => {
                        let obj = refundSearchModel;
                        obj["refundReason"] = e.target.value;
                        this.setState({ refundSearchModel: obj });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4} xl={2}>
                    <label
                      htmlFor="refundedTO"
                      className="py-1"
                      style={{
                        whiteSpace: "nowrap",
                        fontWeight: "var(--font-weight-normal)",
                        fontSize: "var(--font-x-medium)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Refunded To
                    </label>
                    {/* <input type="text" className="form-control" value={payerName} onChange={(e) =>
          this.setState({ payerName: e.target.value })
        } /> */}
                    <FormControl className="form-control">
                      <Select
                        value={refundSearchModel.refundedTo}
                        onChange={(e) => {
                          let obj = refundSearchModel;
                          obj["refundedTo"] = e.target.value;
                          this.setState({ refundSearchModel: obj });
                        }}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        style={{ height: "100%", width: "100%" }}
                      >
                        <MenuItem value="">
                          Refunded To
                        </MenuItem>
                        <MenuItem value="Credit Card">Credit Card</MenuItem>
                        <MenuItem value="Debit Card">Debit Card</MenuItem>
                        <MenuItem value="UPI">UPI</MenuItem>
                        <MenuItem value="Net Banking">Net Banking</MenuItem>
                        <MenuItem value="Bank Account">Bank Account</MenuItem>
                      </Select>
                      {/* <FormHelperText>Without label</FormHelperText> */}
                    </FormControl>
                  </Grid>
                </Grid>

                {/* Refund Line 2 Search */}
                <Grid container mt={1} spacing={1} columnGap={1}>
                  <Grid item xs={10} md={4} xl={3}>
                    <label
                      htmlFor="refundDate"
                      className="py-1"
                      style={{
                        whiteSpace: "nowrap",
                        fontWeight: "var(--font-weight-normal)",
                        fontSize: "var(--font-x-medium)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Refund Date
                    </label>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <FormControl fullWidth>
                          <MUIDatePicker
                            disableFuture={true}
                            name="refundStartDate"
                            placeholder="From"
                            value={
                              this.state.refundSearchModel.refundStartDate
                                ? dayjs(this.state.refundSearchModel.refundStartDate)
                                : null
                            }
                            format={DateFormat.date}
                            onChange={(e) => {
                              let value = this.changeDateFormat(e);
                              this.setState((prevState) => ({
                                refundSearchModel: {
                                  ...prevState.refundSearchModel,
                                  refundStartDate: value,
                                },
                              }));
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={6}>
                        <FormControl fullWidth>
                          <MUIDatePicker
                            disableFuture={true}
                            name="refundEndDate"
                            placeholder="To"
                            value={
                              this.state.refundSearchModel.refundEndDate
                                ? dayjs(this.state.refundSearchModel.refundEndDate)
                                : null
                            }
                            format={DateFormat.date}
                            onChange={(e) => {
                              let value = this.changeDateFormat(e);
                              this.setState((prevState) => ({
                                refundSearchModel: {
                                  ...prevState.refundSearchModel,
                                  refundEndDate: value,
                                },
                              }));

                            }}
                            minDate={this.state.refundSearchModel.refundStartDate ? dayjs(this.state.refundSearchModel.refundStartDate) : null}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={10} md={4} xl={3}>
                    <label
                      htmlFor="refundedAmount"
                      className="py-1"
                      style={{
                        whiteSpace: "nowrap",
                        fontWeight: "var(--font-weight-normal)",
                        fontSize: "var(--font-x-medium)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Refunded Amount
                    </label>

                    <Grid container columnGap={1}>
                      <div style={{ width: "22%", marginTop: '12px', height: '25px' }}>
                        <NativeSelect
                          outlined={"true"}
                          onChange={(e) => {
                            let obj = this.state.refundSearchModel;
                            obj["refundCcy"] = e.target.value;
                            this.setState({ refundSearchModel: obj });
                          }}
                          value={refundSearchModel.refundCcy}
                          input={<BootstrapInput className="currency-control" />}
                        >
                          <option>CCY</option>
                          {currencyList &&
                            currencyList.map((team) => (
                              <option key={team.code} value={team.code}>
                                {team.code}
                              </option>
                            ))}
                        </NativeSelect>
                      </div>
                      <div
                        style={{
                          width: "74%",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{ display: "flex", flexDirection: "column", width: "49%" }}>
                          <input
                            min={1}
                            style={{ width: "100%" }}
                            type={Validator.isPositiveNumber}
                            placeholder="Min"
                            className="form-control"
                            value={this.state.refundBMinAmount}
                            onBlur={(e) => {

                              let obj = this.state.refundSearchModel;
                              obj["refundMinAmount"] = e.target.value;
                              this.setState({ refundSearchModel: obj, refundBMinAmount: e.target.value });

                              // Call the validation methods from props
                              updateDecimalInRule(this.state.refundSearchModel.refundCcy, 'refundMinAmount');
                              let amount = autoFixDecimal('refundMinAmount', e.target.value);
                              updateFormField('refundMinAmount', amount);
                              this.setState({ refundBMinAmount: amount });
                            }}
                            onChange={(e) => { handleRefundMinAmount(e); this.setState({ refundBMinAmount: e.target.value.replace(/[^0-9.]/g, '') }); }}

                          />
                          {refundFormFields.refundMinAmount && refundFormFields.refundMinAmount.errors.map((error, index) => (
                            <span key={index} className="error-message" style={{ color: 'red' }}  >
                              *{error}
                            </span>
                          ))}
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", width: "49%" }}>
                          <input
                            min={1}
                            style={{ width: "100%" }}
                            type={Validator.isPositiveNumber}
                            placeholder="Max"
                            className="form-control"
                            value={this.state.refundBMaxAmount}
                            onBlur={(e) => {

                              let obj = this.state.refundSearchModel;
                              obj["refundMaxAmount"] = e.target.value;
                              this.setState({ refundSearchModel: obj, refundBMaxAmount: e.target.value });

                              // Call the validation methods from props
                              updateDecimalInRule(this.state.refundSearchModel.refundCcy, 'refundMaxAmount');
                              let amount = autoFixDecimal('refundMaxAmount', e.target.value);
                              updateFormField('refundMaxAmount', amount);
                              this.setState({ refundBMaxAmount: amount });
                            }}
                            onChange={(e) => { handleRefundMaxAmount(e); this.setState({ refundBMaxAmount: e.target.value.replace(/[^0-9.]/g, '') }); }}

                          />
                          {refundFormFields.refundMaxAmount && refundFormFields.refundMaxAmount.errors.map((error, index) => (
                            <span key={index} className="error-message" style={{ color: 'red' }}  >
                              *{error}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Grid >
                  </Grid >
                </Grid >
              </AccordionDetails >
            </Accordion >

            {/* Original Search */}
            < Accordion
              expanded={this.state.expandedOriginalDeatils === "panel3"}
              onChange={(e) => {
                if (this.state.expandedOriginalDeatils === "panel3") {
                  this.setState({ expandedOriginalDeatils: false });
                } else {
                  this.setState({ expandedOriginalDeatils: "panel3" });
                }
              }
              }
              sx={{
                border: "none",
                outline: "none",
                boxShadow: "none",
                padding: "4px 8px",
                width: '100%'
              }}
            >
              <AccordionSummary
                expandIcon={
                  <ExpandMoreIcon style={{ color: "var(--mobileAccent)" }} />
                }
                aria-controls="panel3bh-original-content"
                id="panel3bh-original-header"
                sx={{
                  display:'flex',
                  width: '100%',
                  borderBottom: "1px solid var(--border)",
                  height: "36px",
                  minHeight: "auto !important",
                  padding: "0 !important",
                  margin: "0 !important",
                }}
              >
                <Typography
                  sx={{
                    width: "100%",
                    flexShrink: 0,
                    color: "var(--primary-color)",
                    fontWeight: "var(--font-weight-medium)",
                    fontSize: "var(--font-x-medium)",
                  }}
                >
                  Original Payment Transaction Details
                </Typography>
              </AccordionSummary>
              <AccordionDetails style={{ paddingLeft: "0" }}>
                {/* Original Line 1 Search */}
                <Grid container mt={1} spacing={1}>
                  <Grid item xs={12} md={4} xl={2}>
                    <label
                      htmlFor="benepayTransactionId"
                      className="py-1"
                      style={{
                        whiteSpace: "nowrap",
                        fontWeight: "var(--font-weight-normal)",
                        fontSize: "var(--font-x-medium)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      BenePay Transaction Id
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={
                        this.state.refundSearchModel.transactionId
                          ? this.state.refundSearchModel.transactionId
                          : ""
                      }
                      onChange={(e) => {
                        let obj = refundSearchModel;
                        obj["transactionId"] = e.target.value;
                        this.setState({ refundSearchModel: obj });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4} xl={2}>
                    <label
                      htmlFor="requestorTransactionId"
                      className="py-1"
                      style={{
                        whiteSpace: "nowrap",
                        fontWeight: "var(--font-weight-normal)",
                        fontSize: "var(--font-x-medium)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Requestor Transaction Id
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={
                        this.state.refundSearchModel.requestorTransactionId
                          ? this.state.refundSearchModel.requestorTransactionId
                          : ""
                      }
                      onChange={(e) => {
                        let obj = refundSearchModel;
                        obj["requestorTransactionId"] = e.target.value;
                        this.setState({ refundSearchModel: obj });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4} xl={2}>
                    <label
                      htmlFor="payerName"
                      className="py-1"
                      style={{
                        whiteSpace: "nowrap",
                        fontWeight: "var(--font-weight-normal)",
                        fontSize: "var(--font-x-medium)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Payer Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={
                        this.state.refundSearchModel.payerName
                          ? this.state.refundSearchModel.payerName
                          : ""
                      }
                      onChange={(e) => {
                        let obj = refundSearchModel;
                        obj["payerName"] = e.target.value;
                        this.setState({ refundSearchModel: obj });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4} xl={2}>
                    <label
                      htmlFor="payerEmail"
                      className="py-1"
                      style={{
                        whiteSpace: "nowrap",
                        fontWeight: "var(--font-weight-normal)",
                        fontSize: "var(--font-x-medium)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Payer Email
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={
                        this.state.refundSearchModel.payerEmail
                          ? this.state.refundSearchModel.payerEmail
                          : ""
                      }
                      onChange={(e) => {
                        let obj = refundSearchModel;
                        obj["payerEmail"] = e.target.value;
                        this.setState({ refundSearchModel: obj });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4} xl={2}>
                    <label
                      htmlFor="collectionRef"
                      className="py-1"
                      style={{
                        whiteSpace: "nowrap",
                        fontWeight: "var(--font-weight-normal)",
                        fontSize: "var(--font-x-medium)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Collection Reference
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={
                        this.state.refundSearchModel.collectionRef
                          ? this.state.refundSearchModel.collectionRef
                          : ""
                      }
                      onChange={(e) => {
                        let obj = refundSearchModel;
                        obj["collectionRef"] = e.target.value;
                        this.setState({ refundSearchModel: obj });
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Original Line 2 Search */}
                <Grid container mt={1} spacing={1} columnGap={1}>
                  <Grid item xs={10} md={4} xl={3}>
                    <label
                      htmlFor="createDate"
                      className="py-1"
                      style={{
                        whiteSpace: "nowrap",
                        fontWeight: "var(--font-weight-normal)",
                        fontSize: "var(--font-x-medium)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Create Date
                    </label>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <FormControl fullWidth>
                          <MUIDatePicker
                            disableFuture={true}
                            name="createStartDate"
                            placeholder="From"
                            value={
                              this.state.refundSearchModel.createStartDate
                                ? dayjs(this.state.refundSearchModel.createStartDate)
                                : null
                            }
                            format={DateFormat.date}
                            onChange={(e) => {
                              let value = this.changeDateFormat(e);
                              this.setState((prevState) => ({
                                refundSearchModel: {
                                  ...prevState.refundSearchModel,
                                  createStartDate: value,
                                },
                              }));
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={6}>
                        <FormControl fullWidth>
                          <MUIDatePicker
                            disableFuture={true}
                            name="createEndDate"
                            placeholder="To"
                            value={
                              this.state.refundSearchModel.createEndDate
                                ? dayjs(this.state.refundSearchModel.createEndDate)
                                : null
                            }
                            format={DateFormat.date}
                            onChange={(e) => {
                              let value = this.changeDateFormat(e);
                              this.setState((prevState) => ({
                                refundSearchModel: {
                                  ...prevState.refundSearchModel,
                                  createEndDate: value,
                                },
                              }));

                            }}
                            minDate={this.state.refundSearchModel.createStartDate
                              ? dayjs(this.state.refundSearchModel.createStartDate)
                              : null}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={10} md={4} xl={3}>
                    <label
                      htmlFor="createDate"
                      className="py-1"
                      style={{
                        whiteSpace: "nowrap",
                        fontWeight: "var(--font-weight-normal)",
                        fontSize: "var(--font-x-medium)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Payment Date
                    </label>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <FormControl fullWidth>
                          <MUIDatePicker
                            disableFuture={true}
                            name="paymentStartDate"
                            placeholder="From"
                            value={
                              this.state.refundSearchModel.paymentStartDate
                                ? dayjs(this.state.refundSearchModel.paymentStartDate)
                                : null
                            }
                            format={DateFormat.date}
                            onChange={(e) => {
                              let value = this.changeDateFormat(e);
                              this.setState((prevState) => ({
                                refundSearchModel: {
                                  ...prevState.refundSearchModel,
                                  paymentStartDate: value,
                                },
                              }));
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={6}>
                        <FormControl fullWidth>
                          <MUIDatePicker
                            disableFuture={true}
                            name="paymentEndDate"
                            placeholder="To"
                            value={
                              this.state.refundSearchModel.paymentEndDate
                                ? dayjs(this.state.refundSearchModel.paymentEndDate)
                                : null
                            }
                            format={DateFormat.date}
                            onChange={(e) => {
                              let value = this.changeDateFormat(e);
                              this.setState((prevState) => ({
                                refundSearchModel: {
                                  ...prevState.refundSearchModel,
                                  paymentEndDate: value,
                                },
                              }));

                            }}
                            minDate={this.state.refundSearchModel.paymentStartDate ? dayjs(this.state.refundSearchModel.paymentStartDate) : null}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={10} md={4} xl={3}>
                    <label
                      htmlFor="paymentAmount"
                      className="py-1"
                      style={{
                        whiteSpace: "nowrap",
                        fontWeight: "var(--font-weight-normal)",
                        fontSize: "var(--font-x-medium)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Payment Amount
                    </label>

                    <Grid container columnGap={1}>
                      <div style={{ width: "24%", marginTop: '11px', height: '25px' }}>
                        <NativeSelect
                          outlined={"true"}
                          onChange={(e) => {
                            let obj = this.state.refundSearchModel;
                            obj["paymentCcy"] = e.target.value;
                            this.setState({ refundSearchModel: obj });
                          }}
                          value={this.state.refundSearchModel.paymentCcy}
                          input={<BootstrapInput className="currency-control" />}
                        >
                          <option>CCY</option>
                          {currencyList &&
                            currencyList.map((team) => (
                              <option key={team.code} value={team.code}>
                                {team.code}
                              </option>
                            ))}
                        </NativeSelect>
                      </div>


                      <Grid item xl={3} lg={3} md={3} sm={3}>
                        <input
                          min={1}
                          style={{ width: "100%", height: '41px' }}
                          type={Validator.isPositiveNumber}
                          placeholder="Min"
                          className="form-control"
                          value={this.state.paymentBMinAmount}
                          onBlur={(e) => {

                            let obj = this.state.refundSearchModel;
                            obj["paymentMinAmount"] = e.target.value;
                            this.setState({ refundSearchModel: obj, paymentBMinAmount: "" });

                            // Call the validation methods from props
                            updateDecimalInRule(this.state.refundSearchModel.paymentCcy, 'paymentMinAmount');
                            let amount = autoFixDecimal('paymentMinAmount', e.target.value);
                            updateFormField('paymentMinAmount', amount);
                            this.setState({ paymentBMinAmount: amount });
                          }}
                          onChange={(e) => { handlePaymentMinAmount(e); this.setState({ paymentBMinAmount: e.target.value.replace(/[^0-9.]/g, '') }); }}

                        />
                        {refundFormFields.paymentMinAmount && refundFormFields.paymentMinAmount.errors.map((error, index) => (
                          <span key={index} className="error-message" style={{ color: 'red' }}  >
                            *{error}
                          </span>
                        ))}
                      </Grid>

                      <Grid item xl={3} lg={3} md={3} sm={3}>
                        <input
                          min={1}
                          style={{ width: "100%", height: '41px' }}
                          type={Validator.isPositiveNumber}
                          placeholder="Max"
                          className="form-control"
                          value={this.state.paymentBMaxAmount}
                          onBlur={(e) => {


                            let obj = this.state.refundSearchModel;
                            obj["paymentMaxAmount"] = e.target.value;
                            this.setState({ refundSearchModel: obj, paymentBMaxAmount: "" });

                            // Call the validation methods from props
                            updateDecimalInRule(this.state.refundSearchModel.refundCcy, 'paymentMaxAmount');
                            let amount = autoFixDecimal('paymentMaxAmount', e.target.value);
                            updateFormField('paymentMaxAmount', amount);
                            this.setState({ paymentBMaxAmount: amount });
                          }}
                          onChange={(e) => { handlePaymentMaxAmount(e); this.setState({ paymentBMaxAmount: e.target.value.replace(/[^0-9.]/g, '') }); }}

                        />
                        {refundFormFields.paymentMaxAmount && refundFormFields.paymentMaxAmount.errors.map((error, index) => (
                          <span key={index} className="error-message" style={{ color: 'red' }}  >
                            *{error}
                          </span>
                        ))}
                      </Grid>

                    </Grid >
                  </Grid >
                </Grid >
              </AccordionDetails >
            </Accordion >

            {/* Apply Btns */}
            < div
              className="d-flex justify-content-start"
              style={{ marginTop: "24px" }}
            >
              <span style={{ marginRight: "60px" }}>
                <button
                  onClick={this.handleRefundSearch}
                  style={{
                    padding: "8px 24px",
                    marginRight: "8px",
                    color: "white",
                    fontWeight: "var(--font-weight-normal)",
                    fontSize: "var(--font-x-medium)",
                    width: "154px",
                    background: "#6654C3",
                    outline: "none",
                    border: "none",
                    borderRadius: "4px",
                  }}
                >
                  Search
                </button>
                <button
                  onClick={this.clearRefundFilters}
                  style={{
                    padding: "8px 24px",
                    fontWeight: "var(--font-weight-normal)",
                    fontSize: "var(--font-x-medium)",
                    width: "154px",
                    background: "#C4CAD1",
                    outline: "none",
                    border: "none",
                    borderRadius: "4px",
                  }}
                >
                  Clear
                </button>
              </span>
            </div >
          </>
        )}

        {/* If result not found */}
        <div style={{ float: "left" }}>
          {this.state.noResultFound && (
            <span
              style={{
                float: "left",
                fontSize: "var(--font-small)",
                marginRight: "150px",
                color: "red",
                marginTop: "30px",
              }}
            >
              {"No Transactions matching Search Criteria"}
            </span>
          )}
        </div>
      </div >

      {/* REFUND TABLE */}
      {
        refundSummaryList && refundSummaryList.length > 0 ? (
          <>
            <div style={{ marginTop: "20px" }}>
              <Box sx={{ width: "100%", marginTop: "2%" }}>
                {/* Download */}
                <div style={{ display: "flex", justifyContent: "flex-end", columnGap: '10px' }}>
                  <PermissionGuard userPermission={PrivilegeConstants.EXPORT_REFUND}>
                    <button
                    onClick={this.downloadRefundTransactions}
                    type="button"
                    id="dropdownMenuButtonAmount"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      color: "#6654C3",
                      border: "none",
                      outline: "none",
                      background: "white",
                    }}
                  >
                    <button
                      variant="contained"
                      style={{
                        background: "#D9D9D9",
                        width: "34px",
                        height: "34px",
                        borderRadius: "10px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        outline: "none",
                        border: "none",
                      }}
                    >
                      <FontAwesomeIcon icon={faDownload} color="var(--primary-color)" />
                    </button>
                    <span
                      style={{
                        marginLeft: "12px",
                        fontSize: "var(--font-medium)",
                        fontWeight: "var(--font-weight-medium)",
                      }}
                    >
                      Export
                    </span>
                    </button>
                  </PermissionGuard>
                  <button
                    onClick={this.handleRefundSearch}
                    type="button"
                    id="dropdownMenuButtonAmount"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      color: "#6654C3",
                      border: "none",
                      outline: "none",
                      background: "white",
                    }}
                  >
                    <button
                      variant="contained"
                      style={{
                        background: "#D9D9D9",
                        width: "34px",
                        height: "34px",
                        borderRadius: "10px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        outline: "none",
                        border: "none",
                      }}
                    >
                      <RefreshIcon style={{ color: "var(--primary-color)" }} />
                    </button>
                    <span
                      style={{
                        marginLeft: "12px",
                        fontSize: "var(--font-medium)",
                        fontWeight: "var(--font-weight-medium)",
                      }}
                    >
                      Refresh
                    </span>
                  </button>
                </div>
                
                <div style={{width: '100%', height:'417px'}}>
                  <DataGrid
                    rows={refundSummaryList}
                    columns={refundColumns}
                    className="serachedPaymentResultGridPagination"
                    // onCellClick={this.handleCellClick}
                    rowHeight={72}
                    getRowId={(row) => row.refundTransactionId} // Use a field that uniquely identifies each row
                    onSortModelChange={this.sortRefundList}
                    disableColumnSelector={true}
                    disableColumnMenu={true}
                    disableRowSelectionOnClick
                    disableColumnFilter
                    slots={{
                      noRowsOverlay: CustomNoRowsOverlay,
                    }}
                    initialState={{
                      // pagination: {
                      //   paginationModel: {
                      //     pageSize: pageSize,
                      //   },
                      // },
                      sorting: {
                        sortModel: [{ field: sortingBy, sort: sortingType }],
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
                      '& .MuiDataGrid-virtualScroller::-webkit-scrollbar': {
                        width: '0.6em',
                        height: '0.6em',
                      },
                      '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-track': {
                        background: '#f1f1f1',
                      },
                      '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb': {
                        backgroundColor: '#9d83be',
                        borderRadius: '50px'
                      },
                    }}
                  />
                </div>

                {/* Pagination */}
                <div
                  id="PaginationWithDetails"
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "32px",
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid
                      item
                      xl={6}
                      lg={6}
                      md={6}
                      sm={6}
                      xs={6}
                      display="flex"
                      alignContent="center"
                      alignItems="center"
                    >
                      <Typography
                        variant="body1"
                        fontWeight={500}
                        style={{ color: "#6654C3", width: "100%" }}
                      >
                        Your search returned{" "}
                        {totalCountRefundList ? totalCountRefundList : 0} refund
                        requests
                      </Typography>
                    </Grid>
                  </Grid>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        background: "#F1F1F1",
                        height: "auto",
                        padding: "8px 16px",
                        borderRadius: "7px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <ReactPaginate
                          previousLabel={"<"}
                          nextLabel={">"}
                          breakLabel={"..."}
                          pageCount={this.state.totalPagesRefund}
                          marginPagesDisplayed={1}
                          pageRangeDisplayed={2}
                          onPageChange={this.handlePageChangeRefund}
                          containerClassName={
                            "pagination justify-content-end my-auto"
                          }
                          pageClassName={"page-item bg-transparent border-0"}
                          pageLinkClassName={
                            "page-link rounded-lg mx-1 bg-transparent border-0"
                          }
                          previousClassName={"page-item bg-transparent border-0"}
                          previousLinkClassName={
                            "page-link rounded-lg mr-2 bg-transparent border-0"
                          }
                          nextClassName={"page-item bg-transparent border-0"}
                          nextLinkClassName={
                            "page-link rounded-lg ml-2 bg-transparent border-0"
                          }
                          breakClassName={
                            "page-item rounded-lg mx-1 bg-transparent border-0"
                          }
                          breakLinkClassName={
                            "page-link rounded-lg bg-transparent border-0"
                          }
                          activeClassName={"active bg-primary rounded-lg"}
                          forcePage={this.state.initalPage}
                        />
                      </div>
                      <FormControl>
                        <div
                          style={{
                            display: "flex",
                            minWidth: "180px",
                            alignItems: "center",
                            marginLeft: "32px",
                          }}
                        >
                          <Typography
                            gap={2}
                            variant="body1"
                            fontWeight={500}
                            style={{ display: "inline" }}
                          >
                            <span
                              style={{
                                fontSize: "var(--font-x-small)",
                                fontWeight: "var(--font-weight-medium)",
                                color: "#6654C3",
                                marginRight: "5px",
                              }}
                            >
                              Rows Per Page
                            </span>
                          </Typography>
                          <Select
                            size="small"
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={this.state.pageSize}
                            onChange={this.handleRowsPerPageRefund}
                            sx={{ width: 72 }}
                          >
                            <MenuItem value={10} style={{ color: "#6654C3" }}>
                              <span style={{ color: "#6654C3" }}>10</span>
                            </MenuItem>
                            <MenuItem value={15} style={{ color: "#6654C3" }}>
                              <span style={{ color: "#6654C3" }}>15</span>
                            </MenuItem>
                            <MenuItem value={20} style={{ color: "#6654C3" }}>
                              <span style={{ color: "#6654C3" }}>20</span>
                            </MenuItem>
                          </Select>
                        </div>
                      </FormControl>
                      <div
                        style={{
                          display: "flex",
                          minWidth: "200px",
                          justifyContent: "center",
                          alignItems: "center",
                          marginLeft: "8px",
                        }}
                      >
                        <h5
                          style={{
                            fontSize: "var(--font-x-small)",
                            fontWeight: "var(--font-weight-medium)",
                            color: "#6654C3",
                            margin: "3px 5px 0px 0px",
                          }}
                        >
                          Go to Page
                        </h5>
                        <input
                          min={1}
                          max={this.state.totalPagesRefund}
                          style={{
                            width: "56px",
                            background: "white",
                            padding: "4px",
                            border: "1px solid #6654C3",
                            textAlign: "center",
                          }}
                          type="number"
                          placeholder={pageNo}
                          className="form-control"
                          value={this.state.pageNoForRedirect}
                          onChange={(e) =>
                            this.setState({
                              pageNoForRedirect: e.target.value.replace(/[^0-9.]/g, ''),
                            })
                          }
                        />
                        <button
                          onClick={() => {
                            this.handlePageChangeRefund({
                              selected: Number(pageNoForRedirect) - 1,
                            });
                          }}
                          style={{
                            fontSize: "var(--font-large)",
                            marginLeft: "4px",
                            fontWeight: "var(--font-weight-normal)",
                            background: "#00000000",
                            outline: "none",
                            border: "none",
                          }}
                        >
                          <span style={{ color: "#6654C3" }}>
                            <FontAwesomeIcon icon={faAnglesRight} />
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Box>
            </div>
          </>
        ) : (
          <>
            {!loading && (
              <>
                {isFirstTimeSearch ? (
                  <>
                    <div
                      style={{
                        marginTop: "20px",
                        height: "320px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <p>Search for results</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        marginTop: "20px",
                        height: "320px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <CustomNoRowsOverlay />
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )
      }
    </>
  );
}
