import React from "react";
import "./home.scss";
import {
  ButtonPrimary,
  ButtonSecondary,
} from "../$widgets/buttons/form-button";
import ReactPaginate from "react-paginate";
import { CircularProgress } from "@material-ui/core";
import {
  Card,
  Container,
  CardContent,
  Box,
  Grid,
  Chip,
  Typography,
  NativeSelect,
  MenuItem,
  InputBase,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableContainer,
  Paper,
  FormControl,
  Button,
  Select,
} from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { styled } from "@mui/material/styles";
import ConfirmDialog from "../$widgets/dialog";
import {
  Backdrop,
  Autocomplete,
  IconButton,
  Divider,
  TextField,
  Slide,
  CardHeader,
  CardActions,
  InputLabel,
} from "@mui/material";
import moment from "moment";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CloseIcon from "@material-ui/icons/Close";
import SearchIcon from "@material-ui/icons/SearchOutlined";
import { DataGrid } from "@mui/x-data-grid";
import { Close, CheckCircleOutline } from "@mui/icons-material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { DateFormat } from "../../enum/common.enum";
import { InputGroup, Form as bForm } from "react-bootstrap";
import { nodeName } from "jquery";
import { position } from "dom-helpers/query";
import MUIDatePicker from "../$widgets/form-inputs/MUIDatePicker";
import TitleBar from "../title-bar/title-bar";
import { TempStorage, USER_TYPE } from "../../service/core/storage.service";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import UndoIcon from "@material-ui/icons/Replay";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import NotificationsIcon from "@material-ui/icons/Notifications";
import CancelIcon from "@material-ui/icons/Cancel";
import dayjs from "dayjs";
import { PictureAsPdf } from "@material-ui/icons";

export function html() {
  const BootstrapInput = styled(InputBase)(({ theme }) => ({
    "label + &": {
      marginTop: theme.spacing(3),
    },
    "& .MuiInputBase-input": {
      borderRadius: 4,
      position: "relative",
      border: "1px solid #ced4da",
      fontSize: 14,
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
  } = this.state;

  const {} = this.props;

  const selectionRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  };

  return (
    <>
      <div id="desktopScreen" className={"home-main position-relative"}>
        {loading && <div id="semiTransparenDiv"></div>}

        {true && (
          <Box mt={1}>
            {/* Modify the heading with adding a button for single payment transaction */}
            <Grid container>
              <Grid item xs={12}>
                <TitleBar
                  className={"mt-3"}
                  color="blue"
                  ruleColor="blue"
                  title={"Transaction Summary"}
                />

                <Box
                  display="flex"
                  justifyContent="flex-end"
                  alignItems="flex-end"
                  marginTop="-55px"
                >
                  <Button
                    variant="outlined"
                    onClick={() => {
                      this.navigateToNewPayment();
                    }}
                  >
                    + Create New
                  </Button>
                </Box>
              </Grid>
            </Grid>

            <Box mt={3}>
              <Card className="pb-5 pt-2 px-3">
                <CardContent>
                  <ul
                    style={{
                      borderBottom: "1px solid #ddd",
                      padding: "5px",
                      width: "100%",
                      marginTop: "-20px",
                      paddingBottom: "20px",
                      display: "flex",
                      justifyContent: "flex-start",
                    }}
                    className="nav nav-pills mb-3"
                    id="pills-tab"
                    role="tablist"
                  >
                    <li className="nav-item" role="presentation">
                      <a
                        style={{ padding: "8px 20px" }}
                        className="nav-link active"
                        onClick={this.processedClick}
                        id="pills-processed-by-benepay-tab"
                        data-toggle="pill"
                        href="#pills-processed-by-benepay"
                        role="tab"
                        aria-controls="pills-home"
                        aria-selected="true"
                      >
                        Transactions
                      </a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a
                        style={{ padding: "8px 20px" }}
                        className="nav-link"
                        onClick={this.failedPaymentNavigationHandler}
                        id="pills-processed-by-benepay-tab"
                        data-toggle="pill"
                        href="#pills-failed-payment-attempts"
                        role="tab"
                        aria-controls="pills-failed-payments"
                        aria-selected="true"
                      >
                        Failed Payment Attempts
                      </a>
                    </li>
                    {/* <li className="nav-item" role="presentation">
                      <a
                        style={{
                          padding: '8px 20px',
                          marginLeft: "2px",
                        }}
                        className="nav-link"
                        onClick={this.rejectedClick}
                        id="pills-profile-tab"
                        data-toggle="pill"
                        href="#pills-profile"
                        role="tab"
                        aria-controls="pills-profile"
                        aria-selected="false"
                      >
                       Rejected Files
                      </a>
                    </li> */}
                  </ul>

                  <div className="tab-content" id="pills-tabContent">
                    <div
                      className="tab-pane fade show active"
                      id="pills-processed-by-benepay"
                      role="tabpanel"
                      aria-labelledby="pills-processed-by-benepay-tab"
                    >
                      <div className="">
                        <span
                          className="mb-2"
                          style={{
                            marginTop: "10px",
                            position: "relative",
                            bottom: "8px",
                          }}
                        ></span>
                        {false && (
                          <div className="status-">
                            <ul
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                listStyleType: "none",
                                marginLeft: "80px",
                              }}
                            >
                              {status.map((item) => (
                                <li className="pr-2" key={item.text}>
                                  <label
                                    key={item.text}
                                    className="d-flex align-items-center cursor-pointer"
                                  >
                                    <input
                                      checked={item.isChecked}
                                      style={{
                                        margin: "2px",
                                        borderRadius: "4px",
                                        height: "15px",
                                        width: "15px",
                                        cursor: "pointer",
                                        marginRight: "5px",
                                      }}
                                      type="checkbox"
                                      name={item.value}
                                      value={item}
                                      onChange={this.handleStatusChange}
                                    />
                                    {item.text}
                                  </label>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {false && (
                        <Grid container style={{ marginTop: "-30px" }}>
                          <Grid item xs={3} md={7}>
                            <Grid container>
                              <Grid item xs={3}>
                                <p className="mb-0 h-100 d-flex align-items-center">
                                  Create Date
                                </p>
                              </Grid>
                              <Grid item xs={3} md={8}>
                                <Grid container>
                                  <Grid item xs={12} md={5}>
                                    <DatePicker
                                      style={{ width: "100%" }}
                                      selected={receiptStartDate}
                                      placeholderText={
                                        DateFormat.datePickerDate
                                      }
                                      dateFormat={DateFormat.datePickerDate}
                                      onChange={(date) =>
                                        this.setState({
                                          receiptStartDate: date,
                                        })
                                      }
                                    />
                                  </Grid>

                                  <Grid
                                    item
                                    xs={12}
                                    md={5}
                                    className="mt-3 mt-md-0 ml-md-2"
                                  >
                                    <DatePicker
                                      style={{ width: "100%" }}
                                      selected={receiptEndDate}
                                      placeholderText={
                                        DateFormat.datePickerDate
                                      }
                                      dateFormat={DateFormat.datePickerDate}
                                      onChange={(date) =>
                                        this.setState({
                                          receiptEndDate: date,
                                        })
                                      }
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>

                            <Grid container className="mt-4">
                              <Grid item xs={3}>
                                <p className="mb-0 h-100 d-flex align-items-center">
                                  Payment Date
                                </p>
                              </Grid>
                              <Grid item xs={7} md={8}>
                                <Grid container>
                                  <Grid item xs={12} md={5}>
                                    <DatePicker
                                      style={{ width: "100%" }}
                                      selected={paymentStartDate}
                                      placeholderText={
                                        DateFormat.datePickerDate
                                      }
                                      dateFormat={DateFormat.datePickerDate}
                                      onChange={(date) =>
                                        this.setState({
                                          paymentStartDate: date,
                                        })
                                      }
                                    />
                                  </Grid>

                                  <Grid
                                    item
                                    xs={12}
                                    md={5}
                                    className="mt-3 mt-md-0 ml-md-2"
                                  >
                                    <DatePicker
                                      style={{ width: "100%" }}
                                      selected={paymentEndDate}
                                      placeholderText={
                                        DateFormat.datePickerDate
                                      }
                                      dateFormat={DateFormat.datePickerDate}
                                      onChange={(date) =>
                                        this.setState({
                                          paymentEndDate: date,
                                        })
                                      }
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>

                            <Grid container className="mt-4">
                              <Grid item xs={3}>
                                <p className="mb-0 h-100 d-flex align-items-center">
                                  Instructed Amount
                                </p>
                              </Grid>
                              <Grid item xs={7} md={8}>
                                <Grid container className="ml-2 ml-md-0">
                                  <Grid item xs={12} md={2}>
                                    <NativeSelect
                                      outlined={"true"}
                                      onChange={(e) =>
                                        this.setState({
                                          instructedAmountCcy: e.target.value,
                                        })
                                      }
                                      value={this.state.instructedAmountCcy}
                                      input={<BootstrapInput />}
                                    >
                                      <option>-Ccy-</option>
                                      {this.state.currencyList &&
                                        this.state.currencyList.map((team) => (
                                          <option key={team} value={team}>
                                            {team}
                                          </option>
                                        ))}
                                    </NativeSelect>
                                  </Grid>

                                  <Grid
                                    item
                                    xs={12}
                                    md={4}
                                    className="mt-3 mt-md-0 ml-md-2"
                                  >
                                    <input
                                      type="number"
                                      placeholder="Min"
                                      className="form-control"
                                      value={this.state.instructedAmountMin}
                                      onChange={(e) =>
                                        this.setState({
                                          instructedAmountMin: e.target.value,
                                        })
                                      }
                                    />
                                  </Grid>
                                  <Grid
                                    item
                                    xs={12}
                                    md={4}
                                    className="mt-3 mt-md-0 ml-md-2"
                                  >
                                    <input
                                      type="number"
                                      placeholder="Max"
                                      className="form-control"
                                      value={this.state.instructedAmountMax}
                                      onChange={(e) =>
                                        this.setState({
                                          instructedAmountMax: e.target.value,
                                        })
                                      }
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>

                            <Grid container className="mt-4">
                              <Grid item xs={3}>
                                <p className="mb-0 h-100 d-flex align-items-center">
                                  Payment Amount
                                </p>
                              </Grid>
                              <Grid item xs={7} md={8}>
                                <Grid container className="ml-2 ml-md-0">
                                  <Grid item xs={12} md={2}>
                                    <NativeSelect
                                      outlined={"true"}
                                      onChange={(e) =>
                                        this.setState({
                                          paymentAmountCcy: e.target.value,
                                        })
                                      }
                                      value={this.state.paymentAmountCcy}
                                      input={<BootstrapInput />}
                                    >
                                      <option>-Ccy-</option>
                                      {this.state.currencyList &&
                                        this.state.currencyList.map((team) => (
                                          <option key={team} value={team}>
                                            {team}
                                          </option>
                                        ))}
                                    </NativeSelect>
                                  </Grid>

                                  <Grid
                                    item
                                    xs={12}
                                    md={4}
                                    className="mt-3 mt-md-0 ml-md-2"
                                  >
                                    <input
                                      type="number"
                                      placeholder="Min"
                                      className="form-control"
                                      value={this.state.paymentAmountMin}
                                      onChange={(e) =>
                                        this.setState({
                                          paymentAmountMin: e.target.value,
                                        })
                                      }
                                    />
                                  </Grid>
                                  <Grid
                                    item
                                    xs={12}
                                    md={4}
                                    className="mt-3 mt-md-0 ml-md-2"
                                  >
                                    <input
                                      type="number"
                                      placeholder="Max"
                                      className="form-control"
                                      value={this.state.paymentAmountMax}
                                      onChange={(e) =>
                                        this.setState({
                                          paymentAmountMax: e.target.value,
                                        })
                                      }
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>

                          <Grid item xs={12} md={4} className="mt-3 mt-md-0">
                            <Grid container>
                              <Grid item xs={4}>
                                <p className="mb-0 h-100 d-flex align-items-center">
                                  Payer Name
                                </p>
                              </Grid>
                              <Grid item xs={7} className="ml-2 ml-md-0">
                                <input
                                  type="text"
                                  className="form-control"
                                  value={this.state.payerName}
                                  onChange={(e) =>
                                    this.setState({ payerName: e.target.value })
                                  }
                                />
                              </Grid>
                            </Grid>

                            <Grid container className="mt-4">
                              <Grid item xs={4}>
                                <p className="mb-0 h-100 d-flex align-items-center">
                                  Collection Ref
                                </p>
                              </Grid>
                              <Grid item xs={7} className="ml-2 ml-md-0">
                                <input
                                  type="text"
                                  className="form-control"
                                  value={this.state.collectionRef}
                                  onChange={(e) =>
                                    this.setState({
                                      collectionRef: e.target.value,
                                    })
                                  }
                                />
                              </Grid>
                            </Grid>

                            <Grid container className="mt-4">
                              <Grid item xs={4}>
                                <p className="mb-0 h-100 d-flex align-items-center">
                                  Requestor Transaction Id
                                </p>
                              </Grid>
                              <Grid item xs={7} className="ml-2 ml-md-0">
                                <input
                                  type="text"
                                  className="form-control"
                                  value={this.state.requestorTransactionId}
                                  onChange={(e) =>
                                    this.setState({
                                      requestorTransactionId: e.target.value,
                                    })
                                  }
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      )}

                      <div className="transaction-status">
                        <div className="mb-2">
                          <label
                            htmlFor="status"
                            style={{ fontSize: "16px", fontWeight: "500" }}
                          >
                            Transaction Status
                          </label>
                        </div>
                        <ul
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            listStyleType: "none",
                            paddingLeft: 0,
                          }}
                        >
                          {status.map((item) => (
                            <li className="pr-2" key={item.text}>
                              <label
                                key={item.text}
                                className="d-flex align-items-center cursor-pointer"
                              >
                                <input
                                  checked={item.isChecked}
                                  style={{
                                    margin: "2px",
                                    borderRadius: "4px",
                                    height: "15px",
                                    width: "15px",
                                    cursor: "pointer",
                                    marginRight: "5px",
                                  }}
                                  type="checkbox"
                                  name={item.value}
                                  value={item}
                                  onChange={this.handleStatusChange}
                                />
                                {item.text}
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/**
                       * Start of @author ragavan
                       * Modification of transaction search screen
                       */}
                      <Grid container mt={1} spacing={2}>
                        {TempStorage.loginUserRole === USER_TYPE.ADMIN_USER && (
                          <Grid item xs={12} md={4} xl={2}>
                            <label
                              htmlFor="merchants"
                              className="py-1"
                              style={{ fontWeight: "500" }}
                            >
                              Merchants
                            </label>
                            <Autocomplete
                              disablePortal
                              id="merchantList"
                              options={merchantsList || []}
                              onChange={this.getMerchantId}
                              value={
                                merchantsList
                                  ? merchantsList.find(
                                      (v) =>
                                        v.merchantName ===
                                        this.state.selectedMerchant
                                    )
                                  : null
                              }
                              getOptionLabel={(option) =>
                                `${option.merchantName}`
                              }
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
                            htmlFor="benePayTransactionId"
                            className="py-1"
                            style={{ fontWeight: "500" }}
                          >
                            BenePay Transaction Id
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={searchedBenePayTransactionId}
                            onChange={(e) =>
                              this.setState({
                                searchedBenePayTransactionId: e.target.value,
                              })
                            }
                          />
                        </Grid>
                        <Grid item xs={12} md={4} xl={2}>
                          <label
                            htmlFor="requestorTransactionId"
                            className="py-1"
                            style={{ fontWeight: "500" }}
                          >
                            Requestor Transaction Id
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={searchedRequestorTransactionId}
                            onChange={(e) =>
                              this.setState({
                                searchedRequestorTransactionId: e.target.value,
                              })
                            }
                          />
                        </Grid>
                        <Grid item xs={12} md={4} xl={2}>
                          <label
                            htmlFor="PayerEmail"
                            className="py-1"
                            style={{ fontWeight: "500" }}
                          >
                            Payer Email
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={payerEmail}
                            onChange={(e) =>
                              this.setState({ payerEmail: e.target.value })
                            }
                          />
                        </Grid>
                        <Grid item xs={12} md={4} xl={2}>
                          <label
                            htmlFor="PayerName"
                            className="py-1"
                            style={{ fontWeight: "500" }}
                          >
                            Payer Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={payerName}
                            onChange={(e) =>
                              this.setState({ payerName: e.target.value })
                            }
                          />
                        </Grid>

                        {!(
                          TempStorage.loginUserRole === USER_TYPE.ADMIN_USER
                        ) && (
                          <Grid item xs={12} md={4} xl={2}>
                            <label
                              htmlFor="collectionReference"
                              className="py-1"
                              style={{ fontWeight: "500" }}
                            >
                              Collection Reference
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={collectionRef}
                              onChange={(e) =>
                                this.setState({ collectionRef: e.target.value })
                              }
                            />
                          </Grid>
                        )}
                      </Grid>

                      <Grid
                        container
                        className="mt-4"
                        columnGap={3}
                        rowGap={2}
                        columns={{ xs: 4, md: 12 }}
                      >
                        <Grid item xs={3.2}>
                          <label className="py-1" style={{ fontWeight: "500" }}>
                            Create Date
                          </label>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <FormControl fullWidth>
                                <MUIDatePicker
                                  name="CreatedStartDate"
                                  placeholder="From"
                                  value={
                                    receiptStartDate
                                      ? dayjs(receiptStartDate)
                                      : null
                                  }
                                  format={DateFormat.date}
                                  onChange={(e) => {
                                    let value = this.changeDateFormat(e);
                                    this.setState({ receiptStartDate: value });
                                  }}
                                />
                              </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                              <FormControl fullWidth>
                                <MUIDatePicker
                                  name="CreatedEndDate"
                                  placeholder="To"
                                  value={
                                    receiptEndDate
                                      ? dayjs(receiptEndDate)
                                      : null
                                  }
                                  format={DateFormat.date}
                                  onChange={(e) => {
                                    let value = this.changeDateFormat(e);
                                    this.setState({ receiptEndDate: value });
                                  }}
                                />
                              </FormControl>
                            </Grid>
                          </Grid>
                        </Grid>

                        <Grid item xs={3.2}>
                          <label className="py-1" style={{ fontWeight: "500" }}>
                            Payment Date
                          </label>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <FormControl fullWidth>
                                <MUIDatePicker
                                  name="PaymentStartDate"
                                  placeholder="From"
                                  value={
                                    paymentStartDate
                                      ? dayjs(paymentStartDate)
                                      : null
                                  }
                                  format={DateFormat.date}
                                  onChange={(e) => {
                                    let value = this.changeDateFormat(e);
                                    this.setState({ paymentStartDate: value });
                                  }}
                                />
                              </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                              <FormControl fullWidth>
                                <MUIDatePicker
                                  name="PaymentEndDate"
                                  placeholder="To"
                                  value={
                                    paymentEndDate
                                      ? dayjs(paymentEndDate)
                                      : null
                                  }
                                  format={DateFormat.date}
                                  onChange={(e) => {
                                    let value = this.changeDateFormat(e);
                                    this.setState({ paymentEndDate: value });
                                  }}
                                />
                              </FormControl>
                            </Grid>
                          </Grid>
                        </Grid>

                        <Grid item xs={3.2}>
                          <label className="py-1" style={{ fontWeight: "500" }}>
                            Cancellation Date
                          </label>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <FormControl fullWidth>
                                <MUIDatePicker
                                  name="cancellationFromDate"
                                  placeholder="From"
                                  value={
                                    cancellationFromDate
                                      ? dayjs(cancellationFromDate)
                                      : null
                                  }
                                  format={DateFormat.date}
                                  onChange={(e) => {
                                    let value = this.changeDateFormat(e);
                                    this.setState({
                                      cancellationFromDate: value,
                                    });
                                  }}
                                />
                              </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                              <FormControl fullWidth>
                                <MUIDatePicker
                                  name="cancellationToDate"
                                  placeholder="To"
                                  value={
                                    cancellationToDate
                                      ? dayjs(cancellationToDate)
                                      : null
                                  }
                                  format={DateFormat.date}
                                  onChange={(e) => {
                                    let value = this.changeDateFormat(e);
                                    this.setState({
                                      cancellationToDate: value,
                                    });
                                  }}
                                />
                              </FormControl>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid
                        container
                        className="mt-1"
                        spacing={3}
                        columns={{ xs: 4, md: 12 }}
                      >
                        <Grid item xs={4}>
                          <label
                            htmlFor="requestedAmount"
                            className="py-1"
                            style={{ fontWeight: "500" }}
                          >
                            Requested Amount
                          </label>
                          <Grid container spacing={1} rowGap={2}>
                            <Grid item xs={4}>
                              <select
                                id="requestedCcySelect"
                                className="form-control"
                                onChange={(e) =>
                                  this.setState({
                                    requestedCcy:
                                      e.target.value != "Currency"
                                        ? e.target.value
                                        : null,
                                  })
                                }
                              >
                                <option>Currency</option>
                                {this.state.currencyList &&
                                  this.state.currencyList.map((currency) => (
                                    <option key={currency} value={currency}>
                                      {currency}
                                    </option>
                                  ))}
                              </select>
                            </Grid>
                            <Grid item xs={4}>
                              <input
                                type="number"
                                placeholder="From"
                                className="form-control"
                                value={this.state.requestedMinAmount}
                                onChange={(e) =>
                                  this.setState({
                                    requestedMinAmount: e.target.value,
                                  })
                                }
                              />
                            </Grid>
                            <Grid item xs={4}>
                              <input
                                type="number"
                                placeholder="To"
                                className="form-control"
                                value={this.state.requestedMaxAmount}
                                onChange={(e) =>
                                  this.setState({
                                    requestedMaxAmount: e.target.value,
                                  })
                                }
                              />
                            </Grid>
                          </Grid>
                        </Grid>

                        <Grid item xs={4}>
                          <label
                            htmlFor="paidAmount"
                            className="py-1"
                            style={{ fontWeight: "500" }}
                          >
                            Paid Amount
                          </label>
                          <Grid container spacing={1} rowGap={2}>
                            <Grid item xs={4}>
                              <select
                                id="paidCcySelect"
                                className="form-control"
                                onChange={(e) =>
                                  this.setState({
                                    paidCcy:
                                      e.target.value != "Currency"
                                        ? e.target.value
                                        : null,
                                  })
                                }
                              >
                                <option>Currency</option>
                                {this.state.currencyList &&
                                  this.state.currencyList.map((currency) => (
                                    <option key={currency} value={currency}>
                                      {currency}
                                    </option>
                                  ))}
                              </select>
                            </Grid>
                            <Grid item xs={4}>
                              <input
                                type="number"
                                placeholder="From"
                                className="form-control"
                                value={paidMinAmount}
                                onChange={(e) =>
                                  this.setState({
                                    paidMinAmount: e.target.value,
                                  })
                                }
                              />
                            </Grid>
                            <Grid item xs={4}>
                              <input
                                type="number"
                                placeholder="To"
                                className="form-control"
                                value={paidMaxAmount}
                                onChange={(e) =>
                                  this.setState({
                                    paidMaxAmount: e.target.value,
                                  })
                                }
                              />
                            </Grid>
                          </Grid>
                        </Grid>

                        {TempStorage.loginUserRole === USER_TYPE.ADMIN_USER && (
                          <Grid item xs={12} md={2} xl={2}>
                            <label
                              htmlFor="collectionReference"
                              className="py-1"
                              style={{ fontWeight: "500" }}
                            >
                              Collection Reference
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={collectionRef}
                              onChange={(e) =>
                                this.setState({ collectionRef: e.target.value })
                              }
                            />
                          </Grid>
                        )}
                      </Grid>
                      {/* End of author ragavan */}

                      <div className="d-flex justify-content-start mt-5">
                        <span style={{ marginRight: "60px" }}>
                          <ButtonPrimary
                            onClick={this.handleApplyClickPaymentSettlement}
                            style={{ marginLeft: "5px", padding: "1%" }}
                          >
                            Apply
                          </ButtonPrimary>
                          <ButtonSecondary
                            onClick={this.clearProcessedDetails}
                            style={{ marginLeft: "5px", padding: "1%" }}
                          >
                            Clear
                          </ButtonSecondary>
                        </span>
                      </div>
                      <div style={{ float: "left" }}>
                        {this.state.noResultFound && (
                          <span
                            style={{
                              float: "left",
                              fontSize: "15px",
                              marginRight: "150px",
                              color: "red",
                              marginTop: "30px",
                            }}
                          >
                            {"No Transactions matching Search Criteria"}
                          </span>
                        )}
                      </div>
                    </div>
                    <div
                      id="pills-failed-payment-attempts"
                      className="tab-pane fade show"
                      role="tabpanel"
                      aria-labelledby="pills-payments-failed-attempts-tab"
                    >
                      <Grid item xs={3} md={12}>
                        <Grid container>
                          <Grid item xs={3} md={12}>
                            <Grid container>
                              <Grid item xs={12} md={4} lg={3}>
                                <label htmlFor="PayerEmail" className="py-1">
                                  Payer Email
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={payerEmail}
                                  onChange={(e) =>
                                    this.setState({
                                      payerEmail: e.target.value,
                                    })
                                  }
                                />
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                md={4}
                                lg={4}
                                className="mt-3 mt-md-0 ml-md-3"
                              >
                                <label htmlFor="PayerEmail" className="py-1">
                                  Date of Attempt{" "}
                                </label>
                                <div className="d-flex">
                                  <DatePicker
                                    style={{ width: "100%" }}
                                    selected={failedAttemptStartDate}
                                    placeholderText="From"
                                    dateFormat={DateFormat.datePickerDate}
                                    onChange={(date) =>
                                      this.setState({
                                        failedAttemptStartDate: date,
                                      })
                                    }
                                  />
                                  <label
                                    htmlFor="PayerEmail"
                                    className="py-1"
                                  ></label>
                                  <DatePicker
                                    style={{ width: "100%" }}
                                    selected={failedAttemptEndDate}
                                    placeholderText="To"
                                    dateFormat={DateFormat.datePickerDate}
                                    onChange={(date) =>
                                      this.setState({
                                        failedAttemptEndDate: date,
                                      })
                                    }
                                  />
                                </div>
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                md={4}
                                lg={4}
                                className="mt-3 mt-md-0 ml-md-3"
                              >
                                <label htmlFor="PayerEmail" className="py-1">
                                  Amount
                                </label>
                                <div className="d-flex">
                                  <select
                                    className="form-control"
                                    value={this.state.instructedAmountCcy}
                                    onChange={(e) =>
                                      this.setState({
                                        instructedCcy: e.target.value,
                                      })
                                    }
                                  >
                                    <option value="All">All</option>
                                    {this.state.currencyList &&
                                      this.state.currencyList.map((team) => (
                                        <option key={team} value={team}>
                                          {team}
                                        </option>
                                      ))}
                                  </select>
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="From"
                                    onChange={(e) =>
                                      this.setState({
                                        fromAmount: e.target.value,
                                      })
                                    }
                                    value={fromAmount}
                                  />
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="To"
                                    onChange={(e) =>
                                      this.setState({
                                        toAmount: e.target.value,
                                      })
                                    }
                                    value={toAmount}
                                  />
                                </div>
                              </Grid>
                            </Grid>
                            <Grid container className="my-md-3">
                              <Grid
                                item
                                xs={12}
                                md={4}
                                lg={3}
                                className="mr-md-3"
                              >
                                <label htmlFor="PayerEmail" className="py-1">
                                  Collection Reference
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={collectionReference}
                                  onChange={(e) =>
                                    this.setState({
                                      collectionReference: e.target.value,
                                    })
                                  }
                                />
                              </Grid>
                              <Grid item xs={12} md={4} lg={3}>
                                <label
                                  htmlFor="benepayPaymentRef"
                                  className="py-1"
                                >
                                  Benepay Payment Ref
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={benepayPaymentRef}
                                  onChange={(e) =>
                                    this.setState({
                                      benepayPaymentRef: e.target.value,
                                    })
                                  }
                                />
                              </Grid>
                            </Grid>
                            <Grid container className="my-4">
                              <div
                                style={{ float: "left" }}
                                className="rejected-benepay-action-items my-4"
                              >
                                <span>
                                  <ButtonPrimary
                                    onClick={
                                      this.applyFailedTransactionHandleClick
                                    }
                                  >
                                    Apply
                                  </ButtonPrimary>
                                  <ButtonSecondary
                                    onClick={this.clearFailedTransactionForm}
                                    style={{ marginLeft: "25px" }}
                                  >
                                    Clear
                                  </ButtonSecondary>
                                </span>
                              </div>
                            </Grid>
                            <hr
                              style={{ height: "1px", backgroundColor: "#ddd" }}
                            />
                            {failedTransactions &&
                              failedTransactions.length > 0 && (
                                <div>
                                  <div className="row">
                                    <div className="search-records">
                                      <span
                                        style={{
                                          float: "left",
                                          fontSize: "14px",
                                          marginRight: "150px",
                                          color: "blue",
                                        }}
                                      >
                                        Your Search returned{" "}
                                        {this.state.totalFailedCount} failed
                                        payment attempts
                                      </span>
                                    </div>
                                    <div className="download-csv">
                                      <ButtonPrimary
                                        onClick={
                                          this.downloadFailedTransactionsCSV
                                        }
                                      >
                                        Download as CSV
                                      </ButtonPrimary>
                                    </div>
                                  </div>
                                  <div
                                    className="error-attempts-table mt-3 table-responsive"
                                    style={{
                                      maxWidth: "100%",
                                      overflowX: "auto",
                                    }}
                                  >
                                    <table className=" table-bordered w-auto mw-100 failure-attempts-table">
                                      <thead>
                                        <tr>
                                          <th
                                            scope="col"
                                            style={{
                                              cursor: "pointer",
                                              minWidth: "117px",
                                            }}
                                            onClick={() => {
                                              this.sortingData(
                                                "creationDate",
                                                "Failed"
                                              );
                                            }}
                                          >
                                            Timestamp
                                            {
                                              <button
                                                className={`${
                                                  this.state.coltype ===
                                                    "creationDate" &&
                                                  this.state.order === "ascn"
                                                    ? "sort-button"
                                                    : "sort-button sort-reverse"
                                                }`}
                                              >
                                                ▲
                                              </button>
                                            }
                                          </th>
                                          <th
                                            scope="col"
                                            style={{
                                              cursor: "pointer",
                                              minWidth: "170px",
                                            }}
                                            onClick={() => {
                                              this.sortingData(
                                                "collectionReferenceNo",
                                                "Failed"
                                              );
                                            }}
                                          >
                                            Collection Reference
                                            {
                                              <button
                                                className={`${
                                                  this.state.coltype ===
                                                    "collectionReferenceNo" &&
                                                  this.state.order === "ascn"
                                                    ? "sort-button"
                                                    : "sort-button sort-reverse"
                                                }`}
                                              >
                                                ▲
                                              </button>
                                            }
                                          </th>
                                          <th
                                            scope="col"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => {
                                              this.sortingData(
                                                "debtorEmailId",
                                                "Failed"
                                              );
                                            }}
                                          >
                                            Payer Email
                                            {
                                              <button
                                                className={`${
                                                  this.state.coltype ===
                                                    "debtorEmailId" &&
                                                  this.state.order === "ascn"
                                                    ? "sort-button"
                                                    : "sort-button sort-reverse"
                                                }`}
                                              >
                                                ▲
                                              </button>
                                            }
                                          </th>
                                          <th
                                            scope="col"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => {
                                              this.sortingData(
                                                "pgStatus",
                                                "Failed"
                                              );
                                            }}
                                          >
                                            Status
                                            {
                                              <button
                                                className={`${
                                                  this.state.coltype ===
                                                    "pgStatus" &&
                                                  this.state.order === "ascn"
                                                    ? "sort-button"
                                                    : "sort-button sort-reverse"
                                                }`}
                                              >
                                                ▲
                                              </button>
                                            }
                                          </th>
                                          <th
                                            scope="col"
                                            style={{
                                              cursor: "pointer",
                                              minWidth: "98px",
                                            }}
                                            onClick={() => {
                                              this.sortingData(
                                                "dueAmount",
                                                "Failed"
                                              );
                                            }}
                                          >
                                            Amount
                                            {
                                              <button
                                                className={`${
                                                  this.state.coltype ===
                                                    "dueAmount" &&
                                                  this.state.order === "ascn"
                                                    ? "sort-button"
                                                    : "sort-button sort-reverse"
                                                }`}
                                              >
                                                ▲
                                              </button>
                                            }
                                          </th>
                                          <th scope="col">Bene Id</th>
                                          <th
                                            scope="col"
                                            style={{ width: "250px" }}
                                          >
                                            BenePay Payment Ref
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {failedTransactions.map((ft, index) => (
                                          <tr key={index}>
                                            <td>
                                              {" "}
                                              {moment(ft.creationDate).format(
                                                DateFormat.date
                                              )}{" "}
                                              <br />{" "}
                                              {moment(ft.creationDate).format(
                                                DateFormat.time
                                              )}
                                            </td>
                                            <td style={{ width: "50px" }}>
                                              {ft.collectionReferenceNo}
                                            </td>
                                            <td>{ft.debtorEmailId}</td>
                                            <td>
                                              <span className="pgStatus">
                                                {this.humanize(ft.pgStatus)}
                                              </span>
                                            </td>
                                            <td>{ft.dueAmount}</td>
                                            <td
                                              className="d-flex justify-content-between align-items-center"
                                              style={{
                                                height: "61px",
                                                minWidth: "170px",
                                                position: "relative",
                                              }}
                                            >
                                              {ft.beneId}
                                              {this.state.showCopiedMsg &&
                                                this.state.refundIndex ===
                                                  index &&
                                                this.state.copiedId ===
                                                  ft.beneId && (
                                                  <span
                                                    id="copied1"
                                                    style={{
                                                      position: "absolute",
                                                      fontSize: "13px",
                                                      color:
                                                        "rgb(222, 213, 213)",
                                                      backgroundColor:
                                                        "rgb(52, 47, 47)",
                                                      padding: "3px",
                                                      margin:
                                                        "-43px 0px 0px 170px",
                                                      borderRadius:
                                                        "7px 7px 7px 7px",
                                                    }}
                                                  >
                                                    {"Copied!"}
                                                  </span>
                                                )}

                                              <span title="copy">
                                                <FileCopyOutlinedIcon
                                                  id="copiedIcon"
                                                  color="primary"
                                                  style={{
                                                    fontSize: 14,
                                                    cursor: "pointer",
                                                  }}
                                                  onClick={() =>
                                                    this.copyRequestedId(
                                                      ft.beneId,
                                                      index
                                                    )
                                                  }
                                                />
                                              </span>
                                            </td>
                                            <td
                                              style={{
                                                whiteSpace: "nowrap",
                                                position: "relative",
                                              }}
                                            >
                                              {" "}
                                              {ft.transactionId}
                                              {this.state.showCopiedMsg &&
                                                this.state.refundIndex ===
                                                  index &&
                                                this.state.copiedId ===
                                                  ft.transactionId && (
                                                  <span
                                                    id="copied1"
                                                    style={{
                                                      position: "absolute",
                                                      fontSize: "13px",
                                                      color:
                                                        "rgb(222, 213, 213)",
                                                      backgroundColor:
                                                        "rgb(52, 47, 47)",
                                                      padding: "3px",
                                                      margin:
                                                        "-28px 0px 0px -27px",
                                                      borderRadius:
                                                        "7px 7px 7px 7px",
                                                    }}
                                                  >
                                                    {"Copied!"}
                                                  </span>
                                                )}
                                              <span title="copy">
                                                <FileCopyOutlinedIcon
                                                  id="copiedIcon"
                                                  color="primary"
                                                  style={{
                                                    fontSize: 14,
                                                    cursor: "pointer",
                                                  }}
                                                  onClick={() =>
                                                    this.copyRequestedId(
                                                      ft.transactionId,
                                                      index
                                                    )
                                                  }
                                                />
                                              </span>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              )}
                            {failedTransactions &&
                              failedTransactions.length === 0 && (
                                <p style={{ fontSize: "22px" }}>
                                  No Results Found
                                </p>
                              )}
                          </Grid>
                        </Grid>
                      </Grid>
                    </div>

                    {/* <div
                    className="tab-pane fade m-3"
                    id="pills-profile"
                    role="tabpanel"
                    aria-labelledby="pills-profile-tab"
                  >
                    {apply2Click && (
                      <Grid container className="mb-3">
                        <Grid item xs={2}>
                          <p className="mb-0 h-100 d-flex align-items-center">
                            Create Date
                          </p>
                        </Grid>
                        <Grid item xs={5} className={"my-4"} style={{ display: 'flex' }}>

                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <input
                              style={{ height: "40px", padding: "5px" }}
                              type="date"
                              onChange={(e) =>
                                this.setState({
                                  rejectedReceiptStartDate: e.target.value,
                                })
                              }
                              value={this.state.rejectedReceiptStartDate}
                            />
                          </LocalizationProvider>
                          <DatePicker style={{ width: '90%', paddingRight: '10px' }} selected={rejectedReceiptStartDate} placeholderText="From" dateFormat="dd-MMM-yyyy" onChange={(date) =>
                            this.setState({
                              rejectedReceiptStartDate: date,
                            })
                          } />

                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <input
                              style={{
                                marginLeft: "2px",
                                height: "40px",
                                padding: "5px",
                              }}
                              type="date"
                              onChange={(e) =>
                                this.setState({
                                  rejectedReceiptEndDate: e.target.value,
                                })
                              }
                              value={this.state.rejectedReceiptEndDate}
                            />
                          </LocalizationProvider>
                          <DatePicker style={{ width: '90%', paddingLeft: '10px' }} selected={rejectedReceiptEndDate} placeholderText="To" dateFormat="dd-MMM-yyyy" onChange={(date) =>
                            this.setState({
                              rejectedReceiptEndDate: date,
                            })
                          } />
                        </Grid>

                        <Grid container>
                          <div
                            style={{ float: "left" }}
                            className="rejected-benepay-action-items mt-4"
                          >
                            {this.state.noRejectedResultFound && (
                              <span
                                style={{
                                  float: "left",
                                  fontSize: "14px",
                                  marginRight: "150px",
                                  color: "red",
                                }}
                              >
                                {"No Transactions matching Search Criteria"}
                              </span>
                            )}
                            {this.state.showValidationMsg && (
                              <span
                                style={{
                                  float: "left",
                                  fontSize: "10px",
                                  marginRight: "150px",
                                  color: "red",
                                }}
                              >
                                {"Please fill Receipt start and end dates"}
                              </span>
                            )}
                          </div>
                        </Grid>

                        <Grid container>
                          <div
                            style={{ float: "right" }}
                            className="rejected-benepay-action-items mt-4"
                          >
                            <span>
                              <ButtonPrimary onClick={this.rejectedApply}>
                                Apply
                              </ButtonPrimary>
                              <ButtonSecondary
                                onClick={this.rejectedClear}
                                style={{ marginLeft: "5px" }}
                              >
                                Clear
                              </ButtonSecondary>
                            </span>
                          </div>
                        </Grid>
                      </Grid>
                    )}
                  </div> */}
                  </div>
                </CardContent>
              </Card>
            </Box>
          </Box>
        )}

        {showProcessedTable && !this.state.validationFailed && (
          <div className="mt-4">
            <Box sx={{ width: "100%", marginTop: "2%" }}>
              <Grid container spacing={2}>
                <FormControl sx={{ paddingBottom: 1, paddingLeft: 2 }}>
                  <Typography
                    gap={2}
                    variant="body1"
                    fontSize={17}
                    fontWeight={500}
                    style={{ display: "inline" }}
                  >
                    Rows Per Page
                  </Typography>
                  <Select
                    size="small"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={this.state.pageSize}
                    onChange={this.handleRowsPerPage}
                    sx={{ width: 150 }}
                  >
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={15}>15</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                  </Select>
                </FormControl>

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
                    fontSize={17}
                    style={{ color: "blue" }}
                  >
                    Your Search Returned{" "}
                    {totalPaymentsFound ? totalPaymentsFound : 0} Payments
                  </Typography>
                </Grid>
              </Grid>

              {/**
               * @author Ragavan
               * Changed the normal table as a Datagrid - Start
               */}
              <DataGrid
                rows={parentTransactions}
                columns={columns}
                className="serachedPaymentResultGridPagination"
                onCellClick={this.handleCellClick}
                getRowId={(row) => row.transactionId} // Use a field that uniquely identifies each row
                onSortModelChange={this.sortTransaction}
                disableColumnSelector={true}
                disableRowSelectionOnClick
                disableColumnFilter
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: this.state.pageSize,
                    },
                  },
                  sorting: {
                    sortModel: [{ field: sortingBy, sort: sortingType }],
                  },
                }}
                sx={{
                  "& .MuiDataGrid-row:hover": {
                    backgroundColor: "#1976d233",
                    cursor: "pointer",
                  },
                }}
              />

              <Grid container>
                <Grid
                  item
                  xs={6.5}
                  display="flex"
                  justifyContent="end"
                  alignItems="center"
                  paddingTop={2}
                >
                  {(apply2Click || apply1Click) &&
                    !this.state.rejectedFilePagination && (
                      <ReactPaginate
                        previousLabel={"<"}
                        nextLabel={">"}
                        breakLabel={""}
                        pageCount={this.state.totalPages}
                        marginPagesDisplayed={0}
                        pageRangeDisplayed={3}
                        onPageChange={this.handlePageChange}
                        containerClassName={"pagination justify-content-center"}
                        pageClassName={"page-item "}
                        pageLinkClassName={"page-link rounded-circle mx-1 my-2"}
                        previousClassName={"page-item"}
                        previousLinkClassName={
                          "page-link rounded-circle mx-1 my-2"
                        }
                        nextClassName={"page-item"}
                        nextLinkClassName={"page-link rounded-circle mx-1 my-2"}
                        breakClassName={"page-item rounded-circle mx-1 my-2"}
                        breakLinkClassName={"page-link rounded-circle"}
                        activeClassName={"active"}
                        forcePage={this.state.initalPage}
                      />
                    )}

                  {/* {(failedTransactions && failedTransactions.length > 0 && !this.state.rejectedFilePagination) && (
                    <ReactPaginate
                      previousLabel={'<'}
                      nextLabel={'>'}
                      breakLabel={''}
                      pageCount={this.state.totalFailedPages}
                      marginPagesDisplayed={0}
                      pageRangeDisplayed={3}
                      onPageChange={this.handlePageChangeFailedTransaction}
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
                      forcePage={this.state.initalPageFailed}
                    />
                  )} */}
                </Grid>

                <Grid
                  item
                  xs={5.5}
                  display="flex"
                  justifyContent="end"
                  alignItems="center"
                >
                  <ButtonPrimary
                    size={"small"}
                    variant="contained"
                    onClick={this.downloadTransactions}
                    style={{
                      background: "#264d73",
                      textTransform: "capitalize",
                    }}
                  >
                    Download as CSV
                  </ButtonPrimary>
                </Grid>
              </Grid>

              {/*
              I have used this single ConfirmDialog for two purposes
              1. Transaction cancellation popup
              2. Cancellation success message popup */}
              {showCancellationModal && !this.state.isDeviceMobile && (
                <ConfirmDialog open={true} setOpen={true}>
                  <Container maxWidth="sm">
                    <Grid container rowSpacing={1}>
                      <Grid item xs={10}>
                        {showCancellationSuccessModal ? (
                          <>
                            <Typography
                              variant="body1"
                              fontSize={20}
                              fontWeight={600}
                              style={{ color: "#0D5AB7" }}
                            >
                              <CheckCircleOutline
                                color="success"
                                fontSize="large"
                              />
                              &ensp; Transaction Successfully Cancelled
                            </Typography>
                          </>
                        ) : (
                          <>
                            <Typography
                              variant="body1"
                              fontSize={20}
                              fontWeight={600}
                              style={{ color: "#0D5AB7" }}
                            >
                              Cancel Transaction
                            </Typography>
                          </>
                        )}
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        style={{ display: "flex", justifyContent: "end" }}
                      >
                        <IconButton
                          size="medium"
                          onClick={() =>
                            this.setState({
                              showCancellationModal: false,
                              showCancellationSuccessModal: false,
                              cancellationReason: "",
                              transactionDetailsModal: false,
                            })
                          }
                        >
                          <Close />
                        </IconButton>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography
                          gap={2}
                          variant="body1"
                          fontSize={17}
                          fontWeight={500}
                          style={{ color: "#878787", display: "inline" }}
                        >
                          BenePay Transaction Id:&nbsp;
                        </Typography>
                        <Typography
                          gap={2}
                          variant="body1"
                          fontSize={17}
                          style={{
                            color: "rgb(106 158 222)",
                            display: "inline",
                          }}
                        >
                          {selectedTransactionId}&ensp;
                          <IconButton
                            aria-label="Duplicate"
                            onClick={() => {
                              this.handleCopyClick(selectedTransactionId);
                            }}
                          >
                            <FileCopyOutlinedIcon
                              style={{ color: "rgb(106 158 222)" }}
                            />
                          </IconButton>
                        </Typography>
                      </Grid>
                    </Grid>
                  </Container>

                  <Divider
                    variant="middle"
                    style={{ marginTop: "3%", borderWidth: "1px" }}
                  />

                  <Container maxWidth="sm">
                    <Grid container rowSpacing={2} marginTop={2}>
                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          fontSize={15}
                          fontWeight={400}
                        >
                          Amount
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          fontSize={15}
                          fontWeight={400}
                        >
                          {selectedCollectionCurrency +
                            " " +
                            selectedFinalDueAmount}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          fontSize={15}
                          fontWeight={400}
                        >
                          Status
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        {this.getStatusChip(selectedStatus)}
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          fontSize={15}
                          fontWeight={400}
                        >
                          Creation Timestamp
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          fontSize={15}
                          fontWeight={400}
                        >
                          {moment(selectedReceiptTimestamp).format(
                            DateFormat.dateTime
                          )}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          fontSize={15}
                          fontWeight={400}
                        >
                          Payer
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          fontSize={15}
                          fontWeight={400}
                        >
                          {selectedDebtorName}
                        </Typography>
                        <Typography
                          variant="body1"
                          fontSize={15}
                          fontWeight={400}
                        >
                          {selectedDebtorEmailId}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          fontSize={15}
                          fontWeight={400}
                        >
                          Collection Reference
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          fontSize={15}
                          fontWeight={400}
                        >
                          {selectedCollectionRefNumber}
                        </Typography>
                      </Grid>

                      {showCancellationSuccessModal ? (
                        <>
                          <Grid item xs={6}>
                            <Typography
                              variant="body1"
                              fontSize={15}
                              fontWeight={400}
                            >
                              Reason for Cancellation
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="body1"
                              fontSize={15}
                              fontWeight={400}
                            >
                              {cancellationReason}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} mt={4}>
                            {/* <Typography>
                              Note: An email has been sent to{" "}
                              {selectedDebtorEmailId} with information about the
                              cancellation
                            </Typography> */}
                            <Typography>
                              Note: The notification has been sent to{" "}
                              payer with information about the
                              cancellation.
                            </Typography>
                          </Grid>
                        </>
                      ) : (
                        <>
                          <Grid item xs={6}>
                            <Typography
                              variant="body1"
                              fontSize={15}
                              fontWeight={400}
                            >
                              Description
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="body1"
                              fontSize={15}
                              fontWeight={400}
                            >
                              {selectedReasonForCharges}
                            </Typography>
                          </Grid>

                          <Grid item xs={12}>
                            <Typography
                              variant="body1"
                              fontWeight={500}
                              style={{ color: "gray" }}
                            >
                              Enter Reason for Cancellation
                            </Typography>
                            <textarea
                              rows="3"
                              cols="50"
                              className="transactionCancellation"
                              onChange={(e) =>
                                this.setState({
                                  cancellationReason: e.target.value,
                                })
                              }
                              value={cancellationReason}
                            ></textarea>
                          </Grid>

                          <Grid item xs={12}>
                            <Typography
                              variant="body1"
                              fontWeight={500}
                              style={{ color: "gray" }}
                            >
                              Suggested Reasons
                            </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <span
                              className="suggestedReason"
                              onClick={() =>
                                this.setState({
                                  cancellationReason: "Already Paid",
                                })
                              }
                            >
                              Already Paid
                            </span>
                          </Grid>
                          <Grid item xs={4}>
                            <span
                              className="suggestedReason"
                              onClick={() =>
                                this.setState({
                                  cancellationReason:
                                    "Incorrectly sent earlier",
                                })
                              }
                            >
                              Incorrectly sent earlier
                            </span>
                          </Grid>
                          <Grid item xs={12}>
                            <span
                              className="suggestedReason"
                              onClick={() =>
                                this.setState({
                                  cancellationReason:
                                    "Payer requested cancellation",
                                })
                              }
                            >
                              Payer requested cancellation
                            </span>
                          </Grid>
                          <Grid item xs={12}>
                            <span
                              className="suggestedReason"
                              onClick={() =>
                                this.setState({
                                  cancellationReason: "Amount changed",
                                })
                              }
                            >
                              Amount changed
                            </span>
                          </Grid>

                          <Grid item xs={6} mt={2}>
                            <Button
                              variant="contained"
                              style={{
                                backgroundColor: "#346799",
                                width: "70%",
                              }}
                              onClick={this.submitCancellationRequest}
                              disabled={!cancellationReason || loading}
                            >
                              Confirm
                            </Button>
                          </Grid>
                          <Grid item xs={6} mt={2}>
                            <Button
                              variant="contained"
                              style={{ backgroundColor: "gray", width: "70%" }}
                              onClick={() =>
                                this.setState({ showCancellationModal: false })
                              }
                            >
                              Cancel
                            </Button>
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </Container>
                </ConfirmDialog>
              )}

              {/**
               * Transaction Details popup modal
               * */}
              {transactionDetailsModal && !this.state.isDeviceMobile && (
                <ConfirmDialog open={true} setOpen={true}>
                  <Container maxWidth="sm">
                    <Grid container rowSpacing={1}>
                      <Grid item xs={10}>
                        <>
                          <Typography
                            variant="body1"
                            fontSize={20}
                            fontWeight={600}
                            style={{ color: "#0D5AB7" }}
                          >
                            Transaction Details for
                          </Typography>
                        </>
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        style={{ display: "flex", justifyContent: "end" }}
                      >
                        <IconButton
                          size="medium"
                          onClick={() =>
                            this.setState({
                              transactionDetailsModal: false,
                            })
                          }
                        >
                          <Close />
                        </IconButton>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography
                          gap={2}
                          variant="body1"
                          fontSize={17}
                          fontWeight={500}
                          style={{ color: "#878787", display: "inline" }}
                        >
                          BenePay Transaction Id:&nbsp;
                        </Typography>
                        <Typography
                          gap={2}
                          variant="body1"
                          fontSize={17}
                          style={{
                            color: "rgb(106 158 222)",
                            display: "inline",
                          }}
                        >
                          {selectedTransactionId}&ensp;
                          <IconButton
                            aria-label="Duplicate"
                            onClick={() => {
                              this.handleCopyClick(selectedTransactionId);
                            }}
                          >
                            <FileCopyOutlinedIcon
                              style={{ color: "rgb(106 158 222)" }}
                            />
                          </IconButton>
                        </Typography>
                      </Grid>
                    </Grid>
                  </Container>

                  <Divider
                    variant="middle"
                    style={{ marginTop: "3%", borderWidth: "1px" }}
                  />

                  <Container maxWidth="sm">
                    <Grid container rowSpacing={2} marginTop={2}>
                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          fontSize={15}
                          fontWeight={400}
                        >
                          Transaction Status
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        {this.getStatusChip(selectedStatus)}
                      </Grid>

                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          fontSize={15}
                          fontWeight={400}
                        >
                          Create Timestamp
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          fontSize={15}
                          fontWeight={400}
                        >
                          {moment(selectedCreateTimeStamp).format(
                            DateFormat.dateTime
                          )}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          fontSize={15}
                          fontWeight={400}
                        >
                          Payer Name
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          fontSize={15}
                          fontWeight={400}
                        >
                          {selectedDebtorName}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          fontSize={15}
                          fontWeight={400}
                        >
                          Payer Email
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          fontSize={15}
                          fontWeight={400}
                        >
                          {selectedDebtorEmailId}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          fontSize={15}
                          fontWeight={400}
                        >
                          Due Date
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          fontSize={15}
                          fontWeight={400}
                        >
                          {moment(selectedPaymentDueDate).format(
                            DateFormat.date
                          )}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          fontSize={15}
                          fontWeight={400}
                        >
                          Collection Reference
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          fontSize={15}
                          fontWeight={400}
                        >
                          {selectedCollectionRefNumber}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          fontSize={15}
                          fontWeight={400}
                        >
                          Description
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          fontSize={15}
                          fontWeight={400}
                        >
                          {selectedReasonForCollection}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          fontSize={15}
                          fontWeight={400}
                        >
                          Charges/Taxes
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          fontSize={15}
                          fontWeight={400}
                        >
                          {selectedCollectionCurrency +
                            " " +
                            (selectedCharges !== null ? selectedCharges : 0)}
                        </Typography>
                      </Grid>

                      {selectedStatus == "PAID" ||
                      selectedStatus == "SETTLED" ? (
                        <>
                          <Grid item xs={6}>
                            <Typography
                              variant="body1"
                              fontSize={15}
                              fontWeight={400}
                            >
                              Payment Id
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="body1"
                              fontSize={15}
                              fontWeight={400}
                            >
                              {selectedTransactionId}
                            </Typography>
                          </Grid>
                        </>
                      ) : (
                        ""
                      )}

                      {selectedStatus == "SETTLED" ? (
                        ""
                      ) : (
                        <>
                          <Grid item xs={6}>
                            <Typography
                              variant="body1"
                              fontSize={15}
                              fontWeight={400}
                            >
                              Requested Amount
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="body1"
                              fontSize={15}
                              fontWeight={400}
                            >
                              {selectedCollectionCurrency +
                                " " +
                                selectedFinalDueAmount}
                            </Typography>
                          </Grid>
                        </>
                      )}

                      {selectedStatus == "AWAITING_PAYMENT" ||
                      selectedStatus == "CANCELLED" ||
                      selectedStatus == "EXPIRED" ? (
                        ""
                      ) : (
                        <>
                          <Grid item xs={6}>
                            <Typography
                              variant="body1"
                              fontSize={15}
                              fontWeight={400}
                            >
                              Payment Confirmation Id
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="body1"
                              noWrap
                              fontSize={15}
                              fontWeight={400}
                            >
                              {selectedPaymentConfirmationId}
                            </Typography>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography
                              variant="body1"
                              fontSize={15}
                              fontWeight={400}
                            >
                              Paid Amount
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="body1"
                              fontSize={15}
                              fontWeight={400}
                            >
                              {selectedPaymentCurrency +
                                " " +
                                selectedFinalPaymentAmount}
                            </Typography>
                          </Grid>
                        </>
                      )}
                      {selectedStatus == "PARTIALLY_REFUNDED" ||
                      selectedStatus == "FULLY_REFUNDED" ||
                      selectedStatus == "REFUNDED" ||
                      selectedStatus == "CANCELLED" ||
                      selectedStatus == "EXPIRED" ? (
                        ""
                      ) : (
                        <>
                          <Grid item xs={6}>
                            <Typography
                              variant="body1"
                              fontSize={15}
                              fontWeight={400}
                            >
                              Payment Link
                            </Typography>
                          </Grid>
                          <Grid item xs={5}>
                            <Typography
                              gap={2}
                              noWrap={true}
                              variant="body1"
                              fontSize={15}
                              style={{ color: "rgb(106 158 222)" }}
                            >
                              {selectedPaymentLink} &ensp;
                            </Typography>
                          </Grid>
                          <Grid item xs={1}>
                            <IconButton
                              aria-label="Duplicate"
                              style={{ padding: "0" }}
                              onClick={() => {
                                this.handleCopyClick(selectedPaymentLink);
                              }}
                            >
                              <FileCopyOutlinedIcon
                                style={{ color: "rgb(106 158 222)" }}
                              />
                            </IconButton>
                          </Grid>
                        </>
                      )}
                      {selectedStatus == "AWAITING_PAYMENT" ||
                      selectedStatus == "CANCELLED" ||
                      selectedStatus == "EXPIRED" ? (
                        ""
                      ) : (
                        <>
                          <Grid item xs={6}>
                            <Typography
                              variant="body1"
                              fontSize={15}
                              fontWeight={400}
                            >
                              Payment Method
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="body1"
                              fontSize={15}
                              fontWeight={400}
                            >
                              {selectedCardBrand !== null &&
                              selectedCardBrand !== ""
                                ? selectedCardBrand + " " + selectedPaymentMode
                                : selectedPaymentMode}
                            </Typography>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography
                              variant="body1"
                              fontSize={15}
                              fontWeight={400}
                            >
                              Paid Timestamp
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="body1"
                              fontSize={15}
                              fontWeight={400}
                            >
                              {moment(
                                selectedPaymentCompletionTimestamp
                              ).format(DateFormat.dateTime)}
                            </Typography>
                          </Grid>
                        </>
                      )}
                      {selectedStatus == "CANCELLED" ? (
                        <>
                          <Grid item xs={6}>
                            <Typography
                              variant="body1"
                              fontSize={15}
                              fontWeight={400}
                            >
                              Cancelled Timestamp
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="body1"
                              fontSize={15}
                              fontWeight={400}
                            >
                              {moment(selectedCancelledTimestamp).format(
                                DateFormat.dateTime
                              )}
                            </Typography>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography
                              variant="body1"
                              fontSize={15}
                              fontWeight={400}
                            >
                              Cancellation Notes
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="body1"
                              fontSize={15}
                              fontWeight={400}
                            >
                              {selectedReasonForCancellation}
                            </Typography>
                          </Grid>
                        </>
                      ) : (
                        ""
                      )}
                      {selectedStatus == "CANCELLED" ||
                      selectedStatus == "REFUNDED" ||
                      selectedStatus == "FULLY_REFUNDED" ||
                      selectedStatus == "PARTIALLY_REFUNDED" ||
                      selectedStatus == "SETTLED" ? (
                        ""
                      ) : (
                        <>
                          <Grid item xs={6}>
                            <Typography
                              variant="body1"
                              fontSize={15}
                              fontWeight={400}
                            >
                              Expiry Date
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="body1"
                              fontSize={15}
                              fontWeight={400}
                            >
                              {moment(selectedPaymentExpiryDate).format(
                                DateFormat.date
                              )}
                            </Typography>
                          </Grid>
                        </>
                      )}
                      {selectedStatus == "PAID" ||
                      selectedStatus == "CANCELLED" ||
                      selectedStatus == "EXPIRED" ? (
                        ""
                      ) : (
                        <>
                          <Grid item xs={6}>
                            <Typography
                              variant="body1"
                              fontSize={15}
                              fontWeight={400}
                            >
                              Payments
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="body1"
                              fontSize={15}
                              fontWeight={400}
                              style={
                                selectedPaymentConfirmationId !== null &&
                                selectedPaymentConfirmationId !== ""
                                  ? {
                                      textDecoration: "underline",
                                      cursor: "pointer",
                                      color: "blue",
                                    }
                                  : {}
                              }
                              onClick={() => {
                                selectedPaymentConfirmationId !== null &&
                                selectedPaymentConfirmationId !== ""
                                  ? this.getPaymentDetails(
                                      selectedTransactionId
                                    )
                                  : "";
                              }}
                            >
                              {selectedPaymentConfirmationId !== null &&
                              selectedPaymentConfirmationId !== ""
                                ? 1
                                : 0}
                            </Typography>
                          </Grid>
                        </>
                      )}
                      {selectedStatus == "REFUNDED" ||
                      selectedStatus == "FULLY_REFUNDED" ||
                      selectedStatus == "PARTIALLY_REFUNDED" ? (
                        <>
                          <Grid item xs={6}>
                            <Typography
                              variant="body1"
                              fontSize={15}
                              fontWeight={400}
                            >
                              Refunds
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="body1"
                              fontSize={15}
                              fontWeight={400}
                            >
                              {this.getRefundsCount(
                                selectedTransactionId,
                                selectedStatus
                              )}
                            </Typography>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography
                              variant="body1"
                              fontSize={15}
                              fontWeight={400}
                            >
                              Refunded Amount
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="body1"
                              fontSize={15}
                              fontWeight={400}
                            >
                              {this.getRefundsCount(
                                selectedTransactionId,
                                selectedStatus
                              ) !== 0
                                ? selectedFinalPaymentAmount
                                : "-"}
                            </Typography>
                          </Grid>
                        </>
                      ) : (
                        ""
                      )}

                      {selectedFailedAttempts > 0 ? (
                        <>
                          <Grid item xs={6}>
                            <Typography
                              variant="body1"
                              fontSize={15}
                              fontWeight={400}
                            >
                              Failed Attempts
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="body1"
                              fontSize={15}
                              fontWeight={400}
                            >
                              {selectedFailedAttempts}
                            </Typography>
                          </Grid>
                        </>
                      ) : (
                        ""
                      )}

                      {selectedStatus == "REFUNDED" ||
                      selectedStatus == "FULLY_REFUNDED" ||
                      selectedStatus == "PARTIALLY_REFUNDED" ||
                      selectedStatus == "SETTLED" ? (
                        ""
                      ) : (
                        <>
                          <Grid item xs={6}>
                            <Typography
                              variant="body1"
                              fontSize={15}
                              fontWeight={400}
                            >
                              Invoice
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Chip
                              sx={{ padding: 1 }}
                              icon={<PictureAsPdf />}
                              label="Click here to download Invoice"
                              clickable
                              color="primary"
                              onClick={() =>
                                this.handleGenerateInvoice(
                                  selectedTransactionId
                                )
                              }
                            />
                          </Grid>
                        </>
                      )}

                      <Grid
                        container
                        rowGap={4}
                        columns={{ xs: 4, sm: 8, md: 12 }}
                        mt={5}
                      >
                        <Grid item xs={4}>
                          <Button
                            variant="contained"
                            className="paymentDetailsActionButtons"
                            disabled={
                              transactionPaymenButtonRules.disableViewPaymentDetails
                            }
                            onClick={() => {
                              this.getPaymentDetails(selectedTransactionId);
                            }}
                          >
                            View Payment Details
                          </Button>
                        </Grid>
                        <Grid item xs={4}>
                          <Button
                            variant="contained"
                            className="paymentDetailsActionButtons"
                            disabled={
                              transactionPaymenButtonRules.disableViewFailedAttempts ||
                              selectedFailedAttempts == 0
                            }
                            onClick={this.handleFailedTransactions}
                          >
                            View Failed Attempts
                          </Button>
                        </Grid>
                        <Grid item xs={4}>
                          <Button
                            variant="contained"
                            className="paymentDetailsActionButtons"
                            disabled={
                              transactionPaymenButtonRules.disableViewRefundDetails
                            }
                            onClick={() => {
                              this.handleRefundDetails(
                                this.state.transactionParams
                              );
                            }}
                          >
                            View Refund Details
                          </Button>
                        </Grid>

                        <Grid item xs={4}>
                          {/**
                           * Now I am temporarily disabled
                           * If add any condition use the condition "disabled={transactionPaymenButtonRules.disableDuplicate}"
                           */}
                          <Button
                            variant="contained"
                            className="paymentDetailsActionButtons"
                            disabled
                          >
                            Duplicate
                          </Button>
                        </Grid>
                        <Grid item xs={4}>
                          <Button
                            variant="contained"
                            className="paymentDetailsActionButtons"
                            disabled={
                              transactionPaymenButtonRules.disableIssueRefund
                            }
                            onClick={(e) => {
                              this.selectedItem = transactionDetails;
                              this.refundClick(e, transactionDetails);
                            }}
                          >
                            Issue Refund
                          </Button>
                        </Grid>
                        <Grid item xs={4}>
                          <Button
                            variant="contained"
                            className="paymentDetailsActionButtons"
                            disabled={
                              transactionPaymenButtonRules.disableCancelTransaction
                            }
                            onClick={(e) => {
                              this.refundClick(e, transactionDetails);
                            }}
                          >
                            Cancel Transaction
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Container>
                </ConfirmDialog>
              )}
              {/**
               * @author Ragavan
               * Changed the normal table as a Datagrid - End
               */}

              {/* Reminder Modal */}
              {showReminderModal && (
                <ConfirmDialog
                  id="confirmDialogModal"
                  title="Warning"
                  open={true}
                  setOpen={true}
                  dialogPadding={0}
                >
                  <b>Send Payment Reminder</b>
                  <br />
                  <br />

                  <p>
                    A reminder will be sent to the payer. Please confirm
                  </p>

                  <ButtonSecondary
                    onClick={() => this.setState({ showReminderModal: false })}
                    className="buttonSecondary"
                  >
                    Cancel
                  </ButtonSecondary>
                  <ButtonPrimary
                    className="buttonPrimary ml-1"
                    onClick={() => {
                      this.sendReminder();
                      this.setState({
                        showReminderModal: false,
                      });
                    }}
                  >
                    Send Reminder
                  </ButtonPrimary>
                </ConfirmDialog>
              )}
            </Box>

            <TableContainer component={Paper} className="mt-4">
              {/**
               * @author Muthukumar
               * Refund Confirmation modal
               */}

              {/**
               * @author Ragavan
               * I am changed the UI Bootstrap to MUI components
               */}
              {showRefundConfirmationModal && !this.state.isDeviceMobile && (
                <ConfirmDialog
                  style={{ width: "2800px" }}
                  title="Warning"
                  open={true}
                >
                  <Container maxWidth="sm">
                    <Grid container rowSpacing={1}>
                      <Grid item xs={10}>
                        <>
                          <Typography
                            variant="body1"
                            fontSize={20}
                            fontWeight={600}
                            style={{ color: "#0D5AB7" }}
                          >
                            Issue Refund for
                          </Typography>
                        </>
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        style={{ display: "flex", justifyContent: "end" }}
                      >
                        <IconButton size="medium" onClick={this.cancelRefund}>
                          <Close />
                        </IconButton>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography
                          gap={2}
                          variant="body1"
                          fontSize={17}
                          fontWeight={500}
                          style={{ color: "#878787", display: "inline" }}
                        >
                          BenePay Transaction Id:&nbsp;
                        </Typography>
                        <Typography
                          gap={2}
                          variant="body1"
                          fontSize={17}
                          style={{
                            color: "rgb(106 158 222)",
                            display: "inline",
                          }}
                        >
                          {this.selectedItem.transactionId}&ensp;
                          <IconButton
                            aria-label="Duplicate"
                            onClick={() => {
                              this.handleCopyClick(
                                this.selectedItem.transactionId
                              );
                            }}
                          >
                            <FileCopyOutlinedIcon
                              style={{ color: "rgb(106 158 222)" }}
                            />
                          </IconButton>
                        </Typography>
                      </Grid>
                    </Grid>
                  </Container>

                  <Divider
                    variant="middle"
                    style={{ marginTop: "3%", borderWidth: "1px" }}
                  />

                  <Container maxWidth="sm">
                    <Grid container rowSpacing={3} marginTop={2}>
                      <Grid item xs={12}>
                        <Typography>Select Refund Type</Typography>

                        <FormControl>
                          <Select
                            aria-label="Select an Option"
                            value={this.state.selectedOption}
                            onChange={this.handleOnChange}
                            style={{ height: "35px", width: "250px" }}
                          >
                            <MenuItem value="Full Refund">
                              Fully Refund
                            </MenuItem>
                            <MenuItem value="Partial Refund">
                              Partial Refund
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography>Refund Amount</Typography>

                        <InputGroup>
                          <InputGroup.Text>
                            {this.state.refundCcy}
                          </InputGroup.Text>
                          <bForm.Control
                            disabled={
                              this.state.selectedOption == "Full Refund"
                            }
                            style={{ maxWidth: "198px" }}
                            onChange={this.handleRefundAmountChange}
                            value={this.state.refundAmount}
                          />
                        </InputGroup>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography>Reason For Refund</Typography>

                        <textarea
                          rows="3"
                          style={{ width: "250px" }}
                          className="transactionCancellation"
                          placeholder={"Enter reason for refund"}
                          onChange={this.handleRefundReason}
                          value={this.state.refundReason}
                        ></textarea>
                      </Grid>

                      <Grid item xs={6} mt={3}>
                        <Button
                          variant="contained"
                          style={{ backgroundColor: "#346799", width: "70%" }}
                          onClick={this.confirmRefund}
                          disabled={refundLoading}
                        >
                          Confirm
                        </Button>
                      </Grid>
                      <Grid item xs={6} mt={3}>
                        <Button
                          variant="contained"
                          style={{ backgroundColor: "gray", width: "70%" }}
                          onClick={this.cancelRefund}
                          disabled={refundLoading}
                        >
                          Cancel
                        </Button>
                      </Grid>
                    </Grid>
                  </Container>

                  <Backdrop
                    sx={{
                      color: "#fff",
                      zIndex: (theme) => theme.zIndex.drawer + 1,
                    }}
                    open={refundLoading}
                    onClick={this.handleClose}
                  >
                    <CircularProgress color="inherit" />
                  </Backdrop>
                </ConfirmDialog>
              )}

              {/**
               * @author Muthukumar
               * Refund success modal
               */}

              {/**
               * @author Ragavan
               * I am changed the UI Bootstrap to MUI components
               */}
              {showRefundSuccessModal && !this.state.isDeviceMobile && (
                <ConfirmDialog open={true} setOpen={true}>
                  <Container maxWidth="sm">
                    <Grid container rowSpacing={1}>
                      <Grid item xs={11}>
                        <Typography
                          variant="body1"
                          fontSize={20}
                          fontWeight={600}
                          style={{ color: "#0D5AB7" }}
                        >
                          <CheckCircleOutline
                            color="success"
                            fontSize="large"
                          />
                          &ensp;Refund Successful For
                        </Typography>
                      </Grid>
                      <Grid item xs={1}>
                        <IconButton
                          aria-label="Close"
                          onClick={this.confirmBack}
                        >
                          <Close />
                        </IconButton>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography
                          gap={2}
                          variant="body1"
                          fontSize={17}
                          fontWeight={500}
                          style={{ color: "#878787", display: "inline" }}
                        >
                          BenePay Transaction Id:&nbsp;
                        </Typography>
                        <Typography
                          gap={2}
                          variant="body1"
                          fontSize={17}
                          style={{
                            color: "rgb(106 158 222)",
                            display: "inline",
                          }}
                        >
                          {refundResponse.pgData.merchantTxnId}&ensp;
                          <IconButton
                            aria-label="Duplicate"
                            onClick={() => {
                              this.handleCopyClick(
                                refundResponse.pgData.merchantTxnId
                              );
                            }}
                          >
                            <FileCopyOutlinedIcon
                              style={{ color: "rgb(106 158 222)" }}
                            />
                          </IconButton>
                        </Typography>
                      </Grid>
                    </Grid>
                  </Container>

                  <Divider
                    variant="middle"
                    style={{ marginTop: "3%", borderWidth: "1px" }}
                  />

                  <Container maxWidth="sm">
                    <Grid container rowSpacing={2} marginTop={2}>
                      <Grid item xs={5}>
                        <Typography fontSize={15}>Refund Id</Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography
                          fontSize={15}
                          sx={{
                            color: "rgb(106 158 222)",
                            display: "inline",
                            mr: 1,
                          }}
                        >
                          {refundResponse.transactionId}
                        </Typography>
                        <IconButton
                          style={{ padding: "0px" }}
                          onClick={() =>
                            this.handleCopyClick(refundResponse.transactionId)
                          }
                        >
                          <FileCopyOutlinedIcon
                            style={{ color: "rgb(106 158 222)" }}
                          />
                        </IconButton>
                      </Grid>

                      <Grid item xs={5}>
                        <Typography>Refund Amount</Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography>
                          {refundResponse.pgData.refundAmount}
                        </Typography>
                      </Grid>

                      <Grid item xs={5}>
                        <Typography>Refunded to</Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography>{refundResponse.debtorName}</Typography>
                        <Typography>{refundResponse.debtorEmailId}</Typography>
                        <Typography>
                          {refundResponse.cardBrand !== null
                            ? refundResponse.cardBrand +
                              " " +
                              refundResponse.paymentMode
                            : refundResponse.paymentMode}
                        </Typography>
                      </Grid>

                      <Grid item xs={5}>
                        <Typography>Refund Type</Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography>
                          {refundResponse.refundType === "F"
                            ? "Full"
                            : refundResponse.refundType === "P"
                            ? "Partially"
                            : ""}
                        </Typography>
                      </Grid>

                      <Grid item xs={5}>
                        <Typography>Refund Timestamp</Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography>
                          {refundResponse.refundAttemptTimestamp !== null
                            ? moment(
                                refundResponse.refundAttemptTimestamp
                              ).format(DateFormat.dateTime)
                            : ""}
                        </Typography>
                      </Grid>

                      <Grid item xs={5}>
                        <Typography>Refund Status</Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography>
                          {this.getStatusChip(refundResponse.status)}
                        </Typography>
                      </Grid>

                      <Grid item xs={5}>
                        <Typography>Refund Notes</Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography>
                          {refundResponse.refundReason !== null
                            ? refundResponse.refundReason
                            : ""}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Container>
                </ConfirmDialog>
              )}

              {/**
               * @author Bharath
               * Refund Failure Modal
               * */}
              {showFailureModal && !this.state.isDeviceMobile && (
                <ConfirmDialog title="Warning" open={true} setOpen={true}>
                  <Container maxWidth="sm">
                    <Grid container rowSpacing={3}>
                      <Grid item xs={11}>
                        <Typography
                          variant="body1"
                          fontSize={20}
                          fontWeight={600}
                          style={{ color: "#0D5AB7" }}
                        >
                          <HighlightOffIcon color="error" fontSize="large" />
                          &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;Refund Failed For
                        </Typography>
                      </Grid>
                      <Grid item xs={1}>
                        <IconButton
                          aria-label="close"
                          onClick={this.handlePaymentDetailsClose}
                        >
                          <CloseIcon />
                        </IconButton>
                      </Grid>

                      <Grid item xs={5}>
                        <Typography fontSize={15}>
                          BenePay Transaction Id
                        </Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography
                          fontSize={15}
                          sx={{
                            color: "rgb(106 158 222)",
                            display: "inline",
                            mr: 1,
                          }}
                        >
                          {refundResponse.pgData.merchantTxnId}
                        </Typography>
                        <IconButton
                          style={{ padding: "0px" }}
                          onClick={() =>
                            this.handleCopyClick(
                              refundResponse.pgData.merchantTxnId
                            )
                          }
                        >
                          <FileCopyOutlinedIcon
                            style={{ color: "rgb(106 158 222)" }}
                          />
                        </IconButton>
                      </Grid>

                      <Grid item xs={5}>
                        <Typography fontSize={15}>Failure Reason</Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography
                          fontSize={15}
                          sx={{ display: "inline", mr: 1 }}
                        >
                          {
                            refundResponse.refundReason.errors[0]
                              .errorDescription
                          }
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography fontSize={15}>Trace Id</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography fontSize={15}>
                          {refundResponse.traceId}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography fontSize={15}>Refund Amount</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography fontSize={15}>
                          {refundResponse.pgData.refundCurrency}
                          &nbsp;&nbsp;&nbsp;{refundResponse.pgData.refundAmount}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography fontSize={15}>Payer Name</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography fontSize={15}>
                          {refundResponse.debtorName}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography fontSize={15}>Payer Email</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography fontSize={15}>
                          {refundResponse.debtorEmailId}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography fontSize={15}>Payment Method</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography fontSize={15}>
                          {refundResponse.cardBrand !== null
                            ? refundResponse.cardBrand +
                              " " +
                              refundResponse.paymentMode
                            : refundResponse.paymentMode}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography fontSize={15}>Refund Type</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography fontSize={15}>
                          {refundResponse.refundType === "F"
                            ? "Full"
                            : refundResponse.refundType === "P"
                            ? "Partially"
                            : "Error"}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography fontSize={15}>
                          Refund Attempt Timestamp
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography fontSize={15}>
                          {refundResponse.refundAttemptTimestamp !== null
                            ? moment(
                                refundResponse.refundAttemptTimestamp
                              ).format(DateFormat.dateTime)
                            : ""}
                        </Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography color={"red"}>
                          We seem to be experiencing some technical issues at
                          the moment. Please retry after sometime. if the issue
                          persists, please contact BenePay.
                        </Typography>
                      </Grid>
                    </Grid>
                  </Container>
                </ConfirmDialog>
              )}
            </TableContainer>
          </div>
        )}

        {paymentSettlementModel && (
          <ConfirmDialog
            style={{ width: "200px" }}
            title="Warning"
            open={true}
            setOpen={true}
          >
            <b>Settlement Request</b>
            <br />
            <br />

            <Grid container>
              <Grid item xs={3}>
                <p className="mb-0 h-100 d-flex align-items-center">
                  Settlement Date
                </p>
              </Grid>
              <Grid item xs={3} md={8}>
                <Grid container>
                  <Grid item xs={12} md={5}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <input
                        style={{
                          marginLeft: "2px",
                          height: "40px",
                          padding: "5px",
                        }}
                        type="date"
                        onChange={(e) =>
                          this.setState({ settlementDate: e.target.value })
                        }
                        value={this.state.settlementDate}
                      />
                    </LocalizationProvider>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <div className="mt-4">
              <ButtonPrimary
                onClick={this.downloadSettlementFile}
                disabled={loading || !settlementDate}
              >
                Confirm
              </ButtonPrimary>
              <ButtonPrimary
                onClick={this.cancelSettlement}
                style={{ marginLeft: "5px" }}
                disabled={loading}
              >
                Cancel
              </ButtonPrimary>
            </div>
          </ConfirmDialog>
        )}

        {this.state.rejectedTableShow && (
          <div className="mt-4 ">
            {/* <div className="row ">
            <div className="search-records">
              <spans
                style={{
                  float: "left",
                  fontSize: "14px",
                  marginRight: "150px",
                  color: "blue",
                }}
              >
                Your Search returned {this.state.serachedRejectedPaymentResultList.length} Rejected transactions
              </spans>
            </div>
            <div className="download-csv">
              <ButtonPrimary onClick={this.downloadTransactions}>
                Download as CSV
              </ButtonPrimary>
            </div>
          </div> */}
            <TableContainer component={Paper} className="mt-4">
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{ cursor: "pointer", textAlign: "center" }}
                      onClick={() => {
                        this.sortingData("receivedDate", "Reject");
                      }}
                    >
                      Create Timestamp
                      {
                        <button
                          className={`${
                            this.state.coltype === "receivedDate" &&
                            this.state.order === "ascn"
                              ? "sort-button"
                              : "sort-button sort-reverse"
                          }`}
                        >
                          ▲
                        </button>
                      }
                    </TableCell>
                    <TableCell
                      align="right"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        this.sortingData("errorCode", "Reject");
                      }}
                    >
                      Error Code
                      {
                        <button
                          className={`${
                            this.state.coltype === "errorCode" &&
                            this.state.order === "ascn"
                              ? "sort-button"
                              : "sort-button sort-reverse"
                          }`}
                        >
                          ▲
                        </button>
                      }
                    </TableCell>
                    <TableCell align="right">Error Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.serachedRejectedPaymentResultList.map(
                    (item, index) => (
                      <TableRow key={index}>
                        <TableCell className={"p-0"}>
                          {moment(item?.receivedDate).format(DateFormat.date)}{" "}
                          <br />{" "}
                          {moment(item?.receivedDate).format(DateFormat.time)}
                        </TableCell>
                        <TableCell align="right">{item?.errorCode}</TableCell>
                        <TableCell align="right">{item?.errorDesc}</TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
      </div>

      <div id="mobileScreen" className={"position-relative"}>
        {/* Loading */}
        {loading && <div id="semiTransparenDiv"></div>}
        {/* Search Bar */}
        <div id="searchBarMobile" className="w-100 px-2 mt-3">
          <div className="d-flex w-100 pl-2 overflow-hidden">
            <input
              placeholder="Search By Requestor Transaction Id"
              className="py-2 w-100 bg-transparent text-xs outline-none border-none"
              value={this.state.searchedRequestorTransactionId}
              onChange={(e) =>
                this.setState({
                  searchedRequestorTransactionId: e.target.value,
                })
              }
            ></input>
            <div
              className="bg-primary d-flex justify-content-center align-items-center px-2"
              onClick={() => {
                this.handleApplyClickPaymentSettlement();
              }}
            >
              <SearchIcon className="text-white" />
            </div>
          </div>
        </div>
        {/* Filters */}
        <div className="w-100 px-2 py-2 mb-2 mt-1 d-flex justify-content-between">
          <div className="d-flex">
            {/* Status Filter */}
            <div className="dropdown mr-1">
              <button
                id="statusDropDown"
                onClick={() => {
                  document
                    .getElementById("statusMenu")
                    .classList.toggle("d-block");
                  document
                    .getElementById("creationDateMenu")
                    .classList.remove("d-block");
                }}
                className="dropdown-toggle px-3 py-1 bg-transparent text-md"
              >
                Status
              </button>
              <ul
                id="statusMenu"
                className="dropdown-menu py-0 overflow-hidden"
              >
                <li className="w-100 bg-primary text-white avoidToggle d-flex justify-content-between align-items-center py-1 px-1">
                  <h6 className="text-center avoidToggle my-auto text-xs">
                    Status
                  </h6>
                  <CloseIcon />
                </li>
                {status.map((item) => (
                  <li className="px-1 mb-1" key={item.text}>
                    <label
                      key={item.text}
                      className="d-flex align-items-center cursor-pointer avoidToggle"
                    >
                      <input
                        checked={item.isChecked}
                        className="avoidToggle status-menu-option-mobile"
                        type="checkbox"
                        name={item.value}
                        value={item}
                        onChange={this.handleStatusChange}
                      />
                      {item.text}
                    </label>
                  </li>
                ))}
                <li className="w-100 px-2 py-1 avoidToggle">
                  <button
                    className="btn w-100 bg-primary text-white text-center avoidToggle rounded py-1"
                    onClick={() => {
                      document
                        .getElementById("statusMenu")
                        .classList.remove("d-block");
                      this.handleApplyClickPaymentSettlement();
                    }}
                    style={{ outline: "none" }}
                  >
                    Apply
                  </button>
                </li>
              </ul>
            </div>
            {/* Creation Date Filter */}
            <div className="dropdown mx-1">
              <button
                id="creationDateDropDown"
                onClick={() => {
                  document
                    .getElementById("creationDateMenu")
                    .classList.toggle("d-block");
                  document
                    .getElementById("statusMenu")
                    .classList.remove("d-block");
                }}
                className="dropdown-toggle px-3 py-1 bg-transparent text-md text-xs"
              >
                Creation Date
              </button>
              <ul id="creationDateMenu" className="dropdown-menu py-0">
                <li className="w-100 bg-primary text-white avoidToggle d-flex justify-content-between align-items-center py-1 px-1">
                  <h6 className="text-center avoidToggle my-auto">
                    Creation Date
                  </h6>
                  <CloseIcon />
                </li>
                <li className="my-1 px-1">
                  <label className="avoidToggle mb-1 ml-1">Start Date</label>
                  {/**
                   * @author Ragavan
                   * Changed the DatePicker to an MUIDatePicker
                   * For 'receiptStartDate' and 'receiptEndDate' fields are not working
                   * Because the Date Process is different
                   */}
                  <MUIDatePicker
                    name="receiptStartDate"
                    id="receiptStartDate"
                    className="avoidToggle mb-1 w-100"
                    placeholder={DateFormat.date}
                    value={receiptStartDate ? dayjs(receiptStartDate) : null}
                    format={DateFormat.date}
                    onChange={(e) => {
                      let value = this.changeDateFormat(e);
                      this.setState({ receiptStartDate: value });
                    }}
                  />
                </li>
                <li className="my-1 px-1">
                  <label className="mb-1 ml-1">End Date</label>
                  <MUIDatePicker
                    name="CreatedEndDate"
                    id="receiptEndDate"
                    className="avoidToggle mb-1 w-100"
                    placeholder={DateFormat.date}
                    value={receiptEndDate ? dayjs(receiptEndDate) : null}
                    format={DateFormat.date}
                    onChange={(e) => {
                      let value = this.changeDateFormat(e);
                      this.setState({ receiptEndDate: value });
                    }}
                  />
                </li>
                <li className="w-100 px-2 py-1 avoidToggle">
                  <button
                    className="btn w-100 bg-primary text-white text-center avoidToggle rounded py-1 outline-none"
                    onClick={() => {
                      document
                        .getElementById("creationDateMenu")
                        .classList.toggle("d-block");
                      this.handleApplyClickPaymentSettlement();
                    }}
                  >
                    Apply
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <button
            className="dropdown-toggle px-3 py-1 bg-transparent text-md text-xs"
            id="filterDropDown"
            onClick={this.openMobileViewFilter}
          >
            More Filters
          </button>
        </div>

        {/* Filter Menu */}
        <Slide
          direction="left"
          in={mobileViewFilterModal}
          mountOnEnter
          unmountOnExit
        >
          <Card
            sx={{
              position: "absolute",
              width: "100%",
              top: "0",
              zIndex: 10,
              overflow: "unset",
            }}
          >
            <ul className="p-0">
              <li className="bg-primary text-white avoidToggle d-flex justify-content-between align-items-center py-3 px-4">
                <h6 className="text-center avoidToggle my-auto d-flex align-items-center">
                  <CloseIcon
                    className="mr-2"
                    onClick={() => {
                      this.setState({ mobileViewFilterModal: false });
                    }}
                  />
                  Filters
                </h6>
                <button
                  className="d-flex align-items-center m-0 p-0 bg-transparent text-white outline-none border-none"
                  onClick={() => {
                    this.clearProcessedDetails();
                    this.setState({ mobileViewFilterModal: false });
                    this.handleApplyClickPaymentSettlement();
                  }}
                >
                  Clear
                </button>
              </li>

              <li className="text-white avoidToggle d-flex justify-content-between align-items-center py-2 px-4 bg-mobile-secondary">
                <label htmlFor="benePayTransactionId">
                  BenePay Transaction Id
                </label>
              </li>
              <li className="avoidToggle d-flex justify-content-center align-items-center py-2 px-4">
                <input
                  type="text"
                  placeholder="BenePay Transaction Id"
                  className="form-control"
                  value={searchedBenePayTransactionId}
                  onChange={(e) =>
                    this.setState({
                      searchedBenePayTransactionId: e.target.value,
                    })
                  }
                />
              </li>

              <li className="text-white avoidToggle d-flex justify-content-between align-items-center py-2 px-4 mt-3 bg-mobile-secondary">
                <label htmlFor="requestorTransactionId">
                  Requestor Transaction Id
                </label>
              </li>
              <li className="avoidToggle d-flex justify-content-center align-items-center py-2 px-4">
                <input
                  type="text"
                  placeholder="Requestor Transaction Id"
                  className="form-control"
                  value={searchedRequestorTransactionId}
                  onChange={(e) =>
                    this.setState({
                      searchedRequestorTransactionId: e.target.value,
                    })
                  }
                />
              </li>

              <li className="text-white avoidToggle d-flex justify-content-between align-items-center py-2 px-4 mt-3 bg-mobile-secondary">
                <label htmlFor="payerEmail">Payer Email</label>
              </li>
              <li className="avoidToggle d-flex justify-content-center align-items-center py-2 px-4">
                <input
                  type="text"
                  placeholder="Payer Email"
                  className="form-control"
                  value={payerEmail}
                  onChange={(e) =>
                    this.setState({ payerEmail: e.target.value })
                  }
                />
              </li>

              <li className="text-white avoidToggle d-flex justify-content-between align-items-center py-2 px-4 mt-3 bg-mobile-secondary">
                <label htmlFor="payerName" className="avoidToggle">
                  Payer Name
                </label>
              </li>
              <li className="avoidToggle d-flex justify-content-center align-items-center py-2 px-4">
                <div className="d-flex justify-content-start align-items-center w-100 avoidToggle">
                  <input
                    id="payerName"
                    type="text"
                    className="form-control w-100 avoidToggle"
                    placeholder="Payer Name"
                    value={this.state.payerName}
                    onChange={(e) =>
                      this.setState({ payerName: e.target.value })
                    }
                  />
                </div>
              </li>
              <li className="text-white avoidToggle d-flex justify-content-between align-items-center py-2 px-4 mt-3 bg-mobile-secondary">
                <label htmlFor="collectionReference" className="avoidToggle">
                  Collection Reference
                </label>
              </li>
              <li className="avoidToggle d-flex justify-content-center align-items-center py-2 px-4">
                <input
                  id="collectionReference"
                  type="text"
                  className="form-control w-100 avoidToggle"
                  placeholder="Collection Reference"
                  value={this.state.collectionRef}
                  onChange={(e) =>
                    this.setState({ collectionRef: e.target.value })
                  }
                />
              </li>

              <li className="text-white avoidToggle d-flex justify-content-between align-items-center py-2 px-4 mt-3 bg-mobile-secondary">
                <label htmlFor="paymentDate" className="avoidToggle">
                  Payment Date
                </label>
              </li>
              <li className="avoidToggle d-flex justify-content-center align-items-center py-2 px-4">
                <MUIDatePicker
                  name="PaymentStartDate"
                  placeholder="From"
                  className="form-control avoidToggle"
                  value={paymentStartDate ? dayjs(paymentStartDate) : null}
                  format={DateFormat.date}
                  onChange={(e) => {
                    let value = this.changeDateFormat(e);
                    this.setState({ paymentStartDate: value });
                  }}
                />
                &ensp;
                <MUIDatePicker
                  name="PaymentEndDate"
                  placeholder="To"
                  className="form-control avoidToggle"
                  value={paymentEndDate ? dayjs(paymentEndDate) : null}
                  format={DateFormat.date}
                  onChange={(e) => {
                    let value = this.changeDateFormat(e);
                    this.setState({ paymentEndDate: value });
                  }}
                />
              </li>

              <li className="text-white avoidToggle d-flex justify-content-between align-items-center py-2 px-4 mt-3 bg-mobile-secondary">
                <label htmlFor="cancellationDate" className="avoidToggle">
                  Cancellation Date
                </label>
              </li>
              <li className="avoidToggle d-flex justify-content-center align-items-center py-2 px-4">
                <MUIDatePicker
                  name="cancellationFromDate"
                  placeholder="From"
                  className="form-control w-40 avoidToggle"
                  value={
                    cancellationFromDate ? dayjs(cancellationFromDate) : null
                  }
                  format={DateFormat.date}
                  onChange={(e) => {
                    let value = this.changeDateFormat(e);
                    this.setState({ cancellationFromDate: value });
                  }}
                />
                &ensp;
                <MUIDatePicker
                  name="cancellationToDate"
                  placeholder="To"
                  className="form-control w-50 avoidToggle"
                  value={cancellationToDate ? dayjs(cancellationToDate) : null}
                  format={DateFormat.date}
                  onChange={(e) => {
                    let value = this.changeDateFormat(e);
                    this.setState({ cancellationToDate: value });
                  }}
                />
              </li>

              <li className="text-white avoidToggle d-flex justify-content-between align-items-center py-2 px-4 mt-3 bg-mobile-secondary">
                <label htmlFor="requestedAmount" className="avoidToggle">
                  Requested Amount
                </label>
              </li>
              <li className="avoidToggle d-flex justify-content-center align-items-center py-2 px-4">
                <div className="d-flex justify-content-start align-items-center avoidToggle">
                  <select
                    className="form-control ccy-input w-33 avoidToggle"
                    id="instructedAmount"
                    onChange={(e) =>
                      this.setState({
                        requestedCcy: e.target.value,
                      })
                    }
                  >
                    <option className="w-100 avoidToggle">Currency</option>
                    {this.state.currencyList &&
                      this.state.currencyList.map((currency) => (
                        <option
                          key={currency}
                          value={currency}
                          className="w-100 avoidToggle"
                        >
                          {currency}
                        </option>
                      ))}
                  </select>
                  <input
                    type="text"
                    placeholder="From"
                    className="form-control search-input w-33 avoidToggle"
                    value={this.state.instructedAmountMin}
                    onChange={(e) =>
                      this.setState({
                        requestedMinAmount: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="To"
                    className="form-control search-input w-33 avoidToggle"
                    value={this.state.instructedAmountMax}
                    onChange={(e) =>
                      this.setState({
                        requestedMaxAmount: e.target.value,
                      })
                    }
                  />
                </div>
              </li>

              <li className="text-white avoidToggle d-flex justify-content-between align-items-center py-2 px-4 mt-3 bg-mobile-secondary">
                <label htmlFor="paidAmount" className="avoidToggle">
                  Paid Amount
                </label>
              </li>
              <li className="avoidToggle d-flex justify-content-center align-items-center py-2 px-4">
                <div className="d-flex justify-content-start align-items-center avoidToggle">
                  <select
                    id="paidCcySelect"
                    className="form-control ccy-input w-33 avoidToggle"
                    onChange={(e) =>
                      this.setState({
                        paidCcy:
                          e.target.value != "Currency" ? e.target.value : null,
                      })
                    }
                  >
                    <option className="w-100 avoidToggle">Currency</option>
                    {this.state.currencyList &&
                      this.state.currencyList.map((currency) => (
                        <option
                          key={currency}
                          value={currency}
                          className="w-100 avoidToggle"
                        >
                          {currency}
                        </option>
                      ))}
                  </select>
                  <input
                    type="number"
                    placeholder="From"
                    className="form-control search-input w-33 avoidToggle"
                    value={paidMinAmount}
                    onChange={(e) =>
                      this.setState({
                        paidMinAmount: e.target.value,
                      })
                    }
                  />
                  <input
                    type="number"
                    placeholder="To"
                    className="form-control search-input w-33 avoidToggle"
                    value={paidMaxAmount}
                    onChange={(e) =>
                      this.setState({
                        paidMaxAmount: e.target.value,
                      })
                    }
                  />
                </div>
              </li>

              {TempStorage.loginUserRole === USER_TYPE.ADMIN_USER && (
                <>
                  <li className="text-white avoidToggle d-flex justify-content-between align-items-center py-2 px-4 mt-3 bg-mobile-secondary">
                    <label
                      htmlFor="collectionReference"
                      className="avoidToggle"
                    >
                      Merchants
                    </label>
                  </li>
                  <li className="avoidToggle merchantListInMobileView d-flex justify-content-center align-items-center py-2 px-4">
                    <Autocomplete
                      disablePortal
                      id="merchantList"
                      fullWidth
                      options={merchantsList || []}
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
                          className="merchantListInMobileView"
                          {...params}
                        />
                      )}
                    />
                  </li>
                </>
              )}

              <li
                className="bg-primary text-white avoidToggle d-flex justify-content-center align-items-center py-3 px-4 mt-4"
                onClick={() => {
                  this.setState({ mobileViewFilterModal: false });
                  this.handleApplyClickPaymentSettlement();
                }}
              >
                <h5 className="btn text-center text-white p-0 m-0 my-auto d-flex align-items-center">
                  Apply
                </h5>
              </li>
            </ul>
          </Card>
        </Slide>

        {showProcessedTable && !this.state.validationFailed && (
          <div className="mt-2 w-100">
            <div id="mobileResultTable" className="w-100 h-full">
              {parentTransactions &&
                parentTransactions.length !== 0 &&
                parentTransactions.map((item, index) => (
                  <React.Fragment key={index + item.transactionId}>
                    {item.transactionType.toUpperCase() === "PAYMENT" &&
                      (item.status === "AWAITING_PAYMENT" ||
                        item.status === "PAID" ||
                        item.status === "PARTIALLY_REFUNDED" ||
                        item.status === "FULLY_REFUNDED" ||
                        item.status.toUpperCase() === "EXPIRED" ||
                        item.status.toUpperCase() === "CANCELLED" ||
                        item.status === "REFUNDED") && (
                        <div className="px-2 mb-2">
                          <div className="mb-2 text-xs">
                            {moment(item?.receiptTimestamp).format(
                              "DD MMM YYYY"
                            )}{" "}
                            {moment(item?.receiptTimestamp).format("HH:mm:ss")}
                          </div>
                          <div className="w-100 d-flex justify-content-between align-items-center px-1 border-mobile-bottom">
                            <div className="d-flex justify-content-start align-items-center">
                              {/* <div onClick={() => this.setRowVisibility(item, index)}>
                                    {item.transactionType.toUpperCase() ==="PAYMENT" && item.paymentAttempts === 0 
                                    ? <AccountBalanceWalletIcon className="icon-color"/>
                                    : <UndoIcon className="icon-color"/>}
                                  </div> */}
                              <div className="ml-1">
                                <h6 className="mb-2 text-xs text-primary">
                                  {item?.debtorName}
                                </h6>
                                <h6 className="text-xs-extra">
                                  {item?.status}
                                </h6>
                              </div>
                            </div>
                            <div className="d-flex justify-content-end align-items-start">
                              <div>
                                <h6 className="mb-2 text-align-right text-xs text-primary">
                                  {item?.collectionCurrency}{" "}
                                  {item?.finalDueAmount}
                                </h6>
                                <h6 className="text-xs-extra text-align-right">
                                  {item?.collectionReferenceNumber}
                                </h6>
                              </div>
                              <div className="ml-2 position-relative overflow-visible">
                                <div className="dropdown">
                                  <MoreVertIcon
                                    className="icon-color"
                                    type="button"
                                    id="transactionMenuBtn"
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                  />
                                  <div
                                    id="mobileActionIcons"
                                    className="dropdown-menu"
                                    aria-labelledby="transactionMenuBtn"
                                  >
                                    {item.status === "AWAITING_PAYMENT" ? (
                                      <a
                                        className="dropdown-item"
                                        onClick={() => {
                                          const textField =
                                            document.createElement("textarea");
                                          textField.innerText = item.paymentURL;
                                          document.body.appendChild(textField);
                                          textField.select();
                                          textField.setSelectionRange(0, 99999);
                                          document.execCommand("copy");
                                          textField.remove();
                                          toast.success(
                                            "Payment Link Copied to Clipboard"
                                          );
                                        }}
                                      >
                                        <FileCopyIcon className="copyIcon actionIconsMobile" />{" "}
                                        Copy Payment Link
                                      </a>
                                    ) : (
                                      ""
                                    )}
                                    {item.status === "AWAITING_PAYMENT" ? (
                                      <a
                                        className="dropdown-item"
                                        onClick={(e) =>
                                          this.refundClick(e, item)
                                        }
                                      >
                                        <CancelIcon className="actionIconsMobile cancelIcon" />{" "}
                                        Cancel Transaction
                                      </a>
                                    ) : (
                                      ""
                                    )}
                                    {item.status === "PAID" ||
                                    item.status === "SETTLED" ||
                                    item.status === "REFUNDED" ? (
                                      <a
                                        className="dropdown-item"
                                        onClick={(e) =>
                                          this.refundClick(e, item)
                                        }
                                      >
                                        <UndoIcon className="actionIconsMobile refundIcon" />{" "}
                                        Issue Refund
                                      </a>
                                    ) : (
                                      ""
                                    )}
                                    {item.status === "AWAITING_PAYMENT" ? (
                                      <a
                                        className="dropdown-item"
                                        onClick={() => {
                                          this.setState({
                                            showReminderModal: true,
                                            transactionIdForReminder:
                                              item?.transactionId,
                                          });
                                        }}
                                      >
                                        <NotificationsIcon className="actionIconsMobile notificationIcon" />{" "}
                                        Send Payment Reminder
                                      </a>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    {/* TODO: Need to move in seprate component
                      {selectedItem.isRowVisible && item.parentTransactionId !== null && item.parentTransactionId === selectedItem.transactionId && selectedItem.paymentAttempts > 0 && (
                          <div className="px-3 py-2" style={{backgroundColor: '#E0E0E0'}}>
                            <div className="py-2">{moment(item?.receiptTimestamp).format('DD MMM YYYY')} {moment(item?.receiptTimestamp).format('HH:mm:ss')}</div>
                            <div className="w-100 d-flex justify-content-between align-items-center px-1" style={{borderBottom: '1px solid #E0E0E0'}}>
                              <div className="d-flex justify-content-start align-items-center">
                                <div onClick={() => this.setRowVisibility(item, index)}>
                                  <AccountBalanceWalletIcon style={{color: '#4C73AE'}}/>
                                </div>
                                <div className="ml-3">
                                  <h6 className="mb-2">{item?.debtorName}</h6>
                                  <h6 className="text-xs">{item?.status}</h6>
                                </div>
                              </div>
                              <div className="d-flex justify-content-end align-items-start">
                                <div>
                                  <h6 className="mb-2" style={{textAlign: 'right'}}>{item?.collectionCurrency} {item?.finalDueAmount}</h6>
                                  <h6 className="text-xs" style={{textAlign: 'right'}}>{item?.collectionReferenceNumber}</h6>
                                </div>
                              </div>
                            </div>
                          </div>
                        )} */}
                  </React.Fragment>
                ))}

              {parentTransactions && parentTransactions.length !== 0 && (
                <div>
                  <ReactPaginate
                    previousLabel={"<"}
                    nextLabel={">"}
                    breakLabel={""}
                    pageCount={this.state.totalPages}
                    marginPagesDisplayed={0}
                    pageRangeDisplayed={3}
                    onPageChange={this.handlePageChange}
                    containerClassName={"pagination justify-content-center"}
                    pageClassName={"page-item "}
                    pageLinkClassName={"page-link rounded-circle mx-1 my-2"}
                    previousClassName={"page-item"}
                    previousLinkClassName={"page-link rounded-circle mx-1 my-2"}
                    nextClassName={"page-item"}
                    nextLinkClassName={"page-link rounded-circle mx-1 my-2"}
                    breakClassName={"page-item"}
                    breakLinkClassName={"page-link"}
                    activeClassName={"active"}
                    forcePage={this.state.initalPage}
                  />
                </div>
              )}

              {this.state.serachedPaymentResultList &&
                this.state.serachedPaymentResultList.length === 0 && (
                  <div>
                    <h6 className="text-align-center my-5">
                      No Transactions Found
                    </h6>
                  </div>
                )}
            </div>

            {showModal && this.state.isDeviceMobile && (
              <ConfirmDialog
                title="Warning"
                open={true}
                setOpen={true}
                isDeviceMobile={true}
                className="font-poppins dialog-width-mobile"
              >
                <h5 className="mb-4">Refund Request</h5>
                <span>
                  <h6 className="mb-2 font-weight-normal">
                    Select Refund Type Mobile{" "}
                  </h6>
                  <input
                    disabled={this.state.paymentAttempts > 0 ? true : false}
                    type="radio"
                    value="Full Refund"
                    id="fullRefund"
                    onChange={this.handleOnChange}
                    name="refundType"
                    checked={selectedOption === "Full Refund"}
                  />
                  <label htmlFor="fullRefund" className="ml-1 text-xs">
                    Full Refund
                  </label>
                  <input
                    className="ml-2"
                    type="radio"
                    value="Partial Refund"
                    id="partialRefund"
                    onChange={this.handleOnChange}
                    name="refundType"
                    checked={selectedOption === "Partial Refund"}
                  />
                  <label htmlFor="partialRefund" className="ml-1 text-xs">
                    Partial Refund
                  </label>
                </span>
                <br />
                <br />

                <div className="row ml-0">
                  <h6 className="font-weight-normal refund-amount-mobile">
                    Refund Amount
                  </h6>
                  <br />
                  <TextField
                    size="small"
                    disabled={true}
                    onChange={this.handleRefundCcyChange}
                    value={this.state.refundCcy}
                    className="ml-2 refund-amount-ccy-mobile"
                  ></TextField>
                  <TextField
                    type={"number"}
                    label="Amount"
                    size="small"
                    disabled={
                      this.state.selectedOption === "Full Refund" ? true : false
                    }
                    className="ml-1 pl-1 refund-amount-change-mobile"
                    onChange={this.handleRefundAmountChange}
                    value={this.state.refundAmount}
                  ></TextField>
                </div>
                <br />
                <span>
                  <h6 className="mb-2 font-weight-normal">
                    {" "}
                    Reason For Refund
                  </h6>
                  <textarea
                    className="refund-reason-mobile"
                    placeholder={"Enter reason for refund"}
                    onChange={this.handleRefundReason}
                    value={this.state.refundReason}
                  ></textarea>
                </span>
                <br />

                <Backdrop
                  sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                  }}
                  open={refundLoading}
                  onClick={this.handleClose}
                >
                  <CircularProgress color="inherit" />
                </Backdrop>

                <ButtonPrimary
                  onClick={this.confirmRefund}
                  disabled={refundLoading}
                  className="w-100 mt-1"
                >
                  Confirm
                </ButtonPrimary>
                <button
                  onClick={this.cancelRefund}
                  className="close-btn-dialog-mobile"
                  disabled={refundLoading}
                >
                  <CloseIcon />
                </button>
              </ConfirmDialog>
            )}

            {showCancellationModal && this.state.isDeviceMobile && (
              <ConfirmDialog
                title="Warning"
                open={true}
                setOpen={true}
                dialogPadding={0}
                className="dialog-width-mobile"
              >
                <h5 className="mb-4">Cancellation Request</h5>

                <h6 className="font-weight-normal">
                  Do you really want to Cancel this payment request
                </h6>

                <button
                  onClick={() =>
                    this.setState({ showCancellationModal: false })
                  }
                  className="close-btn-dialog-mobile"
                  disabled={refundLoading}
                >
                  <CloseIcon />
                </button>
                <ButtonPrimary
                  className="w-100 mt-1"
                  onClick={() =>
                    this.setState({
                      showCancellationModal: false,
                      showCancellationReason: true,
                    })
                  }
                >
                  Yes
                </ButtonPrimary>
              </ConfirmDialog>
            )}

            {/* Reminder Modal */}
            {showReminderModal && this.state.isDeviceMobile && (
              <ConfirmDialog
                id="confirmDialogModal"
                title="Warning"
                open={true}
                setOpen={true}
                dialogPadding={0}
                className="dialog-width-mobile"
              >
                <h5 className="mb-4">Send Payment Reminder</h5>

                <h6 className="font-weight-normal">
                  A reminder will be sent to the payer. Please confirm
                </h6>

                <button
                  onClick={() => this.setState({ showReminderModal: false })}
                  className="close-btn-dialog-mobile"
                  disabled={refundLoading}
                >
                  <CloseIcon />
                </button>
                <ButtonPrimary
                  className="w-100 mt-1"
                  onClick={() => {
                    this.sendReminder();
                    this.setState({
                      showReminderModal: false,
                    });
                  }}
                >
                  Send Reminder
                </ButtonPrimary>
              </ConfirmDialog>
            )}

            {showCancellationReason && this.state.isDeviceMobile && (
              <ConfirmDialog
                className="dialog-width-mobile"
                title="Warning"
                open={true}
                setOpen={true}
                dialogPadding={0}
              >
                <h6>Reason for cancellation</h6>

                <Backdrop
                  sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                  }}
                  open={isCancellationProcessing}
                  onClick={this.handleClose}
                >
                  <CircularProgress color="inherit" />
                </Backdrop>

                <textarea
                  className="cancel-reason-mobile"
                  onChange={(e) =>
                    this.setState({ cancellationReason: e.target.value })
                  }
                  value={cancellationReason}
                ></textarea>

                <div className="suggested-reasons mt-2">
                  <span className="d-block py-2">
                    <h6 className="font-weight-normal">Suggested Reasons: </h6>
                  </span>
                  <div className="reasons">
                    <span
                      className="text-primary text-underline cursor-pointer text-xs"
                      onClick={() =>
                        this.setState({ cancellationReason: "Already Paid" })
                      }
                    >
                      Already Paid
                    </span>
                    <span
                      className="text-primary text-underline cursor-pointer ml-3 text-xs"
                      onClick={() =>
                        this.setState({
                          cancellationReason: "Incorrectly sent earlier",
                        })
                      }
                    >
                      Incorrectly sent earlier
                    </span>
                    <br />
                    <span
                      className="text-primary text-underline cursor-pointer text-xs"
                      onClick={() =>
                        this.setState({
                          cancellationReason: "Payer requested cancellation",
                        })
                      }
                    >
                      Payer requested cancellation
                    </span>
                    <span
                      className="ml-3 text-primary text-underline cursor-pointer text-xs"
                      onClick={() =>
                        this.setState({ cancellationReason: "Amount Charged" })
                      }
                    >
                      Amount Charged
                    </span>
                  </div>
                </div>

                <div className="d-flex justify-content-end">
                  <button
                    onClick={() =>
                      this.setState({
                        showCancellationReason: false,
                        cancellationReason: "",
                      })
                    }
                    className="close-btn-dialog-mobile"
                    disabled={refundLoading}
                  >
                    <CloseIcon />
                  </button>
                  <ButtonPrimary
                    className="w-100 mt-2 bg-primary text-white"
                    onClick={this.submitCancellationRequest}
                    disabled={!cancellationReason || loading}
                  >
                    <span className="text-white">Submit</span>
                  </ButtonPrimary>
                </div>
              </ConfirmDialog>
            )}

            {showConfirmationModal && this.state.isDeviceMobile && (
              <ConfirmDialog title="Warning" open={true} setOpen={true}>
                <h6 className="font-weight-normal">
                  Success!!! your refund has been successfully initiated
                </h6>
                <br />
                <ButtonPrimary
                  className="w-100 mt-2"
                  onClick={this.confirmBack}
                >
                  OK
                </ButtonPrimary>
              </ConfirmDialog>
            )}

            {showFailureModal && this.state.isDeviceMobile && (
              <ConfirmDialog title="Warning" open={true} setOpen={true}>
                <b>
                  {
                    "An error occurred during the refund operation, please contact <contact@benepay.io> quoting the error details below."
                  }
                </b>
                <br />
                <b>{this.state.errorDesc}</b>

                <br />
                <br />

                <ButtonPrimary
                  className="w-100 mt-2"
                  onClick={this.confirmBack}
                >
                  OK
                </ButtonPrimary>
              </ConfirmDialog>
            )}
          </div>
        )}
      </div>

      {/**
       * @author Bharath
       * Payment Details screen
       * */}
      {paymentDetailsOpen && !this.state.isDeviceMobile && (
        <ConfirmDialog title="Warning" open={true} setOpen={true}>
          <Container maxWidth="sm">
            <Grid container rowSpacing={3}>
              <Grid item xs={11}>
                <Typography
                  fontSize={20}
                  sx={{ color: "#0D5AB7", fontWeight: "bold" }}
                >
                  Payment Details for
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <IconButton
                  aria-label="close"
                  onClick={() => {
                    this.handlePaymentDetailsClose();
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Grid>

              <Grid item xs={5}>
                <Typography fontSize={15}>BenePay Transaction Id</Typography>
              </Grid>
              <Grid item xs={7}>
                <Typography
                  fontSize={15}
                  sx={{ color: "rgb(106 158 222)", display: "inline", mr: 1 }}
                >
                  {paymentDetails.requestorTransactionId}&ensp;
                </Typography>
                <IconButton
                  style={{ padding: "0px" }}
                  onClick={() =>
                    this.handleCopyClick(paymentDetails.requestorTransactionId)
                  }
                >
                  <FileCopyOutlinedIcon style={{ color: "rgb(106 158 222)" }} />
                </IconButton>
              </Grid>

              <Grid item xs={12} mt={2}>
                <Typography
                  fontSize={15}
                  sx={{ color: "rgb(106 158 222)", fontWeight: "bold" }}
                >
                  Payment 1 of 1
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography fontSize={15}>Payment Id</Typography>
              </Grid>
              <Grid item xs={5}>
                <Typography fontSize={15} noWrap>
                  {paymentDetails.requestorTransactionId}
                </Typography>
              </Grid>

              <Grid item xs={1}>
                <IconButton
                  style={{ padding: "0px" }}
                  onClick={() =>
                    this.handleCopyClick(paymentDetails.requestorTransactionId)
                  }
                >
                  <FileCopyOutlinedIcon style={{ color: "rgb(106 158 222)" }} />
                </IconButton>
              </Grid>

              <Grid item xs={6}>
                <Typography fontSize={15}>Payment Amount</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography fontSize={15}>
                  {paymentDetails.paymentCurrency +
                    " " +
                    paymentDetails.paymentAmount}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography fontSize={15}>Payment Status</Typography>
              </Grid>
              <Grid item xs={6}>
                {this.getStatusChip("SUCCESS")}
              </Grid>

              <Grid item xs={6}>
                <Typography fontSize={15}>Payment Method</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography fontSize={15}>
                  {paymentDetails.cardBrand + " " + paymentDetails.paymentMode}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography fontSize={15}>Payment Confirmation Id</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography fontSize={15}>
                  {paymentDetails.paymentConfirmationId}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography fontSize={15}>Payment Timestamp</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography fontSize={15}>
                  {moment(paymentDetails.paymentDate).format(
                    DateFormat.dateTime
                  )}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography fontSize={15}>Payer</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography fontSize={15}>
                  {paymentDetails.debtorName}
                </Typography>
                <Typography fontSize={15}>
                  {paymentDetails.debtorEmailId}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography fontSize={15}>Collection Reference</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography fontSize={15}>
                  {paymentDetails.collectionReferenceNumber}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography fontSize={15}>Description</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography fontSize={15}>
                  {paymentDetails.reasonForCollection}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography fontSize={15}>Charges/Taxes</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography fontSize={15}>
                  {paymentDetails.collectionAmountCurrency +
                    " " +
                    (paymentDetails.charges != null
                      ? paymentDetails.charges
                      : "0")}
                </Typography>
              </Grid>
              {selectedStatus !== "SETTLED" && (
                <Grid item xs={6}>
                  <ButtonSecondary
                    onClick={(e) => {
                      this.selectedItem = transactionDetails;
                      this.refundClick(e, transactionDetails);
                    }}
                  >
                    Issue refund
                  </ButtonSecondary>
                </Grid>
              )}
            </Grid>
          </Container>
        </ConfirmDialog>
      )}

      {/**
       * @author Muthukumar
       * Transaction Refund Details Modal
       */}
      {/**
       * @author Ragavan
       * I am changed the UI Bootstrap to MUI components
       * Correct the fields base on the jira Description
       */}
      {refundModel && !this.state.isDeviceMobile && (
        <ConfirmDialog style={{ width: "2800px" }} title="Warning" open={true}>
          <Container maxWidth="sm">
            <Grid container rowSpacing={1}>
              <Grid item xs={10}>
                <>
                  <Typography
                    variant="body1"
                    fontSize={20}
                    fontWeight={600}
                    style={{ color: "#0D5AB7" }}
                  >
                    Refund Details
                  </Typography>
                </>
              </Grid>
              <Grid
                item
                xs={2}
                style={{ display: "flex", justifyContent: "end" }}
              >
                <IconButton
                  size="medium"
                  onClick={() => {
                    this.handlePaymentDetailsClose();
                  }}
                >
                  <Close />
                </IconButton>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  gap={2}
                  variant="body1"
                  fontSize={17}
                  fontWeight={500}
                  style={{ color: "#878787", display: "inline" }}
                >
                  BenePay Transaction Id:&nbsp;
                </Typography>
                <Typography
                  gap={2}
                  variant="body1"
                  fontSize={17}
                  style={{ color: "rgb(106 158 222)", display: "inline" }}
                >
                  {this.state.refundSelected.transactionId}&ensp;
                  <IconButton
                    aria-label="Duplicate"
                    onClick={() => {
                      this.handleCopyClick(
                        this.state.refundSelected.transactionId
                      );
                    }}
                  >
                    <FileCopyOutlinedIcon
                      style={{ color: "rgb(106 158 222)" }}
                    />
                  </IconButton>
                </Typography>
              </Grid>
            </Grid>
          </Container>

          {this.state.refundDetails.map((item, index) => (
            <>
              <Divider
                variant="middle"
                style={{ marginTop: "3%", borderWidth: "1px" }}
              />

              <Container maxWidth="sm">
                <Grid container rowSpacing={2}>
                  <Grid item xs={12} mt={2}>
                    <Typography
                      fontSize={15}
                      sx={{ color: "rgb(106 158 222)", fontWeight: "bold" }}
                    >
                      Payemnt {index + 1} of {this.state.refundDetails.length}
                    </Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography fontSize={15}>Refund Id</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography fontSize={15}>
                      {item.transactionId}&ensp;
                      <IconButton
                        aria-label="Duplicate"
                        onClick={() => {
                          this.handleCopyClick(item.transactionId);
                        }}
                      >
                        <FileCopyOutlinedIcon
                          style={{ color: "rgb(106 158 222)" }}
                        />
                      </IconButton>
                    </Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography fontSize={15}>Refund Amount</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography fontSize={15}>
                      {item.paymentCurrency} {item.finalPaymentAmount}
                    </Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography fontSize={15}>Refunded to</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography fontSize={15}>{item.debtorName}</Typography>
                    <Typography fontSize={15}>{item.debtorEmailId}</Typography>
                    <Typography fontSize={15}>
                      {item.cardBrand !== null
                        ? item.cardBrand + " " + item.paymentMode
                        : item.paymentMode}
                    </Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography fontSize={15}>Refund Type</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography fontSize={15}>
                      {item.refundType == "F"
                        ? "Full"
                        : item.refundType == "P"
                        ? "Partial"
                        : "Error"}
                    </Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography fontSize={15}>Refund status</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography fontSize={15}>
                      {this.getStatusChip(item.status)}
                    </Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography fontSize={15}>Refund Timestamp</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography fontSize={15}>
                      {moment(item.createTimeStamp).format(DateFormat.dateTime)}
                    </Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography fontSize={15}>Refund notes</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography fontSize={15}>
                      {item.reasonForCollection}
                    </Typography>
                  </Grid>
                </Grid>
              </Container>
            </>
          ))}
        </ConfirmDialog>
      )}

      {/**
       * @author Ragavan
       * Payment Faild attempts Details
       */}
      {failedTransactionsModal == true &&
        failedTransactions !== undefined &&
        failedTransactions !== null &&
        Object.keys(failedTransactions) !== 0 && (
          <ConfirmDialog title="Warning" open={true}>
            <Container maxWidth="sm">
              <Grid container rowSpacing={1}>
                <Grid item xs={10}>
                  <>
                    <Typography
                      variant="body1"
                      fontSize={20}
                      fontWeight={600}
                      style={{ color: "#0D5AB7" }}
                    >
                      Failed Attempts
                    </Typography>
                  </>
                </Grid>
                <Grid
                  item
                  xs={2}
                  style={{ display: "flex", justifyContent: "end" }}
                >
                  <IconButton
                    size="medium"
                    onClick={this.closeFaildTransactionModal}
                  >
                    <Close />
                  </IconButton>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    gap={2}
                    variant="body1"
                    fontSize={17}
                    fontWeight={500}
                    style={{ color: "#878787", display: "inline" }}
                  >
                    BenePay Transaction Id:&nbsp;
                  </Typography>
                  <Typography
                    gap={2}
                    variant="body1"
                    fontSize={17}
                    style={{ color: "rgb(106 158 222)", display: "inline" }}
                  >
                    {selectedTransactionId}&ensp;
                    <IconButton
                      aria-label="Duplicate"
                      onClick={() => {
                        this.handleCopyClick(selectedTransactionId);
                      }}
                    >
                      <FileCopyOutlinedIcon
                        style={{ color: "rgb(106 158 222)" }}
                      />
                    </IconButton>
                  </Typography>
                </Grid>
              </Grid>
            </Container>

            {faildTransactionMatched &&
              Object.values(failedTransactions).map((value) => (
                <>
                  {value.transactionId === selectedTransactionId && (
                    <>
                      <Divider
                        variant="middle"
                        style={{ marginTop: "3%", borderWidth: "1px" }}
                      />
                      <Container maxWidth="sm">
                        <Grid container rowSpacing={2} mt={2}>
                          <Grid item xs={6}>
                            <Typography fontSize={15}>Bene Id</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography fontSize={15}>
                              {value.beneId}
                            </Typography>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography fontSize={15}>Payer Name</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography fontSize={15}>
                              {value.debtorName}
                            </Typography>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography fontSize={15}>Payer Email</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography fontSize={15}>
                              {value.debtorEmailId}
                            </Typography>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography fontSize={15}>
                              Creation Timestamp
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography fontSize={15}>
                              {moment(value.creationDate).format(
                                DateFormat.dateTime
                              )}
                            </Typography>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography fontSize={15}>Amount</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography fontSize={15}>
                              {value.currency + " " + value.dueAmount}
                            </Typography>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography fontSize={15}>
                              Collection Reference
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography fontSize={15}>
                              {value.collectionReferenceNo}
                            </Typography>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography fontSize={15}>Status</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography fontSize={15}>
                              <Chip
                                label={value.pgStatus}
                                style={{
                                  backgroundColor: "#cccccc",
                                  color: "black",
                                  width: "146px",
                                  height: "30px",
                                }}
                              />
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography fontSize={15}>Reason</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography fontSize={15}>
                              {value.reason}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Container>
                    </>
                  )}
                </>
              ))}
          </ConfirmDialog>
        )}
    </>
  );
}
