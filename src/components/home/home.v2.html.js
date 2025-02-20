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
  Radio,
  RadioGroup,
  FormControlLabel
} from "@mui/material";
import moment from "moment";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CloseIcon from "@material-ui/icons/Close";
import SearchIcon from "@material-ui/icons/SearchOutlined";
import { DataGrid } from "@mui/x-data-grid";
import { Close, CheckCircleOutline, Info } from "@mui/icons-material";
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
import RefreshIcon from '@mui/icons-material/Refresh';
import { link } from "react-router-dom"
import { BootstrapLabel } from "components/$widgets/form-inputs/BootstrapLabel";
import MUIPhoneInput from "../$widgets/form-inputs/MUIPhoneInput";
// import Backdrop from '@mui/material/Backdrop';
// import CircularProgress from '@mui/material/CircularProgress';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquarePlus,
  faFilter,
  faFilterCircleDollar,
  faDownload,
  faGear,
  faCalendar,
  faXmark,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";
import { a } from "aws-amplify";
import CustomNoRowsOverlay from "./support-components/customNoRowsOverlay.v1";
// import AmountFilter from "./support-components/AmountFilter";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RefundScreen from "./support-components/refundScreen-v1";
import Validator from "../../service/core/validator";
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { OnboardConstants, manualPay, PrivilegeConstants, QuickFilters } from "config/constants";
import QRCode from "qrcode.react";
import GetAppIcon from '@material-ui/icons/GetApp';
import PermissionGuard from "components/$widgets/permission/permissionGuard";
import { BootstrapInputOld } from "components/$widgets/form-inputs/BootstrapInputOld";
import { Alert ,AlertTitle} from "@material-ui/lab";
import _ from "lodash";
import FilterComponent from "./support-components/quickFilter";


export function html() {
  const {
    privileges,
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
    selectedAllowPartialPayment,
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
    selectedRefundCount,
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
    formFields,
    selectedRefundedAmount,
    selectedPaymentCount,
    allowPaymentByScreen,
    allowRefundByScreen,
    allowCancellationByScreen,
    isMarkAsPaidClicked,
    allowManualPay,
    selectedManualPaymentMode,
    referralPartners,
    refferredMerchants,
    qrString,
    qrImageUploadPath,
    transactionCreationMode,
    subMerchantIds,
    selectedDataMerchantId,
    loggedInMerchantID,
    mobileNumber,
    selectedIsFirc,
    allCurrency,
  } = this.state;

  const { } = this.props;

  const selectionRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  };

  const CustomWidthTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: 200,
    },
  });

  return (
    <>
      <div id="desktopScreen" className={"home-main position-relative"}>
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

        <section>
          <ul
            className="nav nav-pills"
            id="pills-tab"
            role="tablist"
            style={{
              borderBottom: "1px solid #B4D3FA",
              position: "relative",
              marginTop: "8px",
            }}
          >
            <PermissionGuard userPermission={PrivilegeConstants.TRANSACTION_SEARCH}>
            <li
              onClick={() => {
                this.setState({ initalPage: 0 });
                if (!this.state.parentTransactions) {
                  this.processedApply(1);
                }
              }}
              style={{
                fontSize: "var(--font-large)",
                fontWeight: "var(--font-weight-normal)",
                color: "var(--secondary-color)",
              }}
            >
              <a
                className="navItem active"
                style={{
                  display: "block",
                  minWidth: "120px",
                  paddingBottom: "8px",
                  marginRight: "2rem",
                  cursor: "pointer",
                }}
                id="pills-transactions-tab"
                data-toggle="pill"
                href="#pills-transactions"
                role="tab"
                aria-controls="pills-transactions"
                aria-selected="true"
              >
                Transactions
              </a>
            </li>
            </PermissionGuard>
            <PermissionGuard userPermission={PrivilegeConstants.REFUND_SEARCH}>        
            <li
              onClick={() => {
                // this.setState({ initalPage: 0 });
                // if (!this.state.refundSummaryList) {
                //   this.getRefundSearchResult(1);
                // }
              }}
              style={{
                fontSize: "var(--font-large)",
                fontWeight: "var(--font-weight-normal)",
                color: "var(--secondary-color)",
              }}
            >
              <a
                className="navItem"
                style={{
                  display: "block",
                  minWidth: "120px",
                  paddingBottom: "8px",
                  marginRight: "2rem",
                  cursor: "pointer",
                }}
                id="pills-refunds-tab"
                data-toggle="pill"
                href="#pills-refunds"
                role="tab"
                aria-controls="pills-refunds"
                aria-selected="false"
                onClick={() => { this.setState({ refundBtnClick: true }) }}
              >
                Refunds
              </a>
            </li>
            </PermissionGuard>
          </ul>
          <div className="tab-content" id="pills-tabContent">
          <PermissionGuard userPermission={PrivilegeConstants.TRANSACTION_SEARCH}>
            <div
              className="tab-pane fade show active"
              id="pills-transactions"
              role="tabpanel"
              aria-labelledby="pills-transactions-tab"
              style={{ width: "100%" }}
            >
              <div
                style={{
                  marginTop: "16px",
                  paddingBottom: "32px",
                  borderBottom: "1px solid #C5DCFC",
                }}
              >
                  <FilterComponent data={[
                    { name: QuickFilters.ALL, count: 0 },
                    { name: QuickFilters.UNPAID, count: 0 },
                    { name: QuickFilters.PAID, count: 0 },
                  ]}
                    handleApplyClickPaymentSettlement={this.handleApplyClickPaymentSettlement}
                    selectedStatuses={this.state.selectedStatuses}
                    receiptStartDate={this.state.receiptStartDate}
                    receiptEndDate={this.state.receiptEndDate}
                    paymentStartDate={this.state.paymentStartDate}
                    paymentEndDate={this.state.paymentEndDate}
                  />

                {/* Already Applied Filters */}
                {this.state.showFilterApplied && alreadyAppliedFilters &&
                  (alreadyAppliedFilters.statusFilters.isVisible ||
                    alreadyAppliedFilters.dateFilters.isVisible ||
                    alreadyAppliedFilters.amountFilters.isVisible ||
                    alreadyAppliedFilters.basicFilters.isVisible) && (
                    <>
                      <section
                        style={{
                          marginTop: "20px",
                          width: "100%",
                          background: "var(--light-color)",
                          borderRadius: "4px",
                          padding: "12px 16px",
                        }}
                      >
                        {/* Already Applied Status Filters */}
                        <h2
                          style={{
                            fontSize: "var(--font-medium)",
                            fontWeight: "var(--font-weight-medium)",
                            color: "var(--primary-color)",
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
                          {alreadyAppliedFilters.basicFilters &&
                            alreadyAppliedFilters.basicFilters.isVisible &&
                            alreadyAppliedFilters.basicFilters.data && (
                              <>
                                {alreadyAppliedFilters.basicFilters.data.map(
                                  (item) => (
                                    <li
                                      key={item.title}
                                      style={
                                        item.value && item.value.length > 0
                                          ? {
                                            padding: "8px",
                                            width: "auto",
                                            background: "white",
                                            padding: "8px",
                                            marginRight: "8px",
                                            borderRadius: "4px",
                                          }
                                          : { display: "none" }
                                      }
                                    >
                                      <label
                                        key={`Basic-${item.title}`}
                                        htmlFor={`Status-${item.title}`}
                                        className="d-flex align-items-center"
                                        style={{ display: "flex" }}
                                      >
                                        <span
                                          style={{
                                            fontSize: "var(--font-medium)",
                                            fontWeight:
                                              "var(--font-weight-medium)",
                                            color: "var(--primary-color)",
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
                                          color="var(--primary-color)"
                                          style={{
                                            fontSize: "var(--font-x-medium)",
                                            cursor: "pointer",
                                          }}
                                          onClick={() => {
                                            this.removeAlreadyPresentBasicStatus(
                                              item.title
                                            );
                                          }}
                                        />
                                      </label>
                                    </li>
                                  )
                                )}
                              </>
                            )}

                          {alreadyAppliedFilters.statusFilters &&
                            alreadyAppliedFilters.statusFilters.isVisible &&
                            alreadyAppliedFilters.statusFilters.data && (
                              <>
                                {/* <div style={{display: 'flex', alignItems: 'center', marginBottom: '8px'}}> */}
                                {/* <h5 style={{fontSize: 'var(--font-medium)', fontWeight: 'var(--font-weight-medium)', color: '#495370', margin: '0', minWidth: '160px'}}>Status Filters</h5> */}

                                {alreadyAppliedFilters.statusFilters.data.map(
                                  (item) => (
                                    <li
                                      key={item.text}
                                      style={{
                                        display: "flex",
                                        padding: "8px",
                                        width: "auto",
                                        background: "white",
                                        padding: "8px",
                                        marginRight: "8px",
                                        borderRadius: "4px",
                                      }}
                                    >
                                      <span
                                        style={{
                                          fontSize: "var(--font-medium)",
                                          fontWeight:
                                            "var(--font-weight-medium)",
                                          color: "var(--primary-color)",
                                          marginRight: "8px",
                                        }}
                                      >
                                        {item.text}
                                      </span>
                                      <label
                                        key={item.text}
                                        htmlFor={`Status-${item.text}`}
                                        className="d-flex align-items-center"
                                        style={{ display: "flex" }}
                                        onClick={(e) => {
                                          this.removeAlreadyPresentStatus(
                                            `${item.value}`
                                          );
                                        }}
                                      >
                                        <FontAwesomeIcon
                                          icon={faXmark}
                                          color="var(--primary-color)"
                                          style={{
                                            fontSize: "var(--font-x-medium)",
                                            cursor: "pointer",
                                          }}
                                        />
                                      </label>
                                    </li>
                                  )
                                )}

                                {/* </div> */}
                              </>
                            )}

                          {alreadyAppliedFilters.amountFilters &&
                            alreadyAppliedFilters.amountFilters.isVisible &&
                            alreadyAppliedFilters.amountFilters.data && (
                              <>
                                {/* <div style={{display: 'flex', alignItems: 'center', marginBottom: '8px'}}> */}
                                {/* <h5 style={{fontSize: 'var(--font-medium)', fontWeight: 'var(--font-weight-medium)', color: '#495370', margin: '0', minWidth: '160px'}}>Amount Filters</h5> */}
                                {alreadyAppliedFilters.amountFilters.data.map(
                                  (item) => (
                                    <li
                                      key={item.currency}
                                      style={
                                        item && (item.currency || item.min || item.max)
                                          ? {
                                            padding: "8px",
                                            width: "auto",
                                            background: "white",
                                            padding: "8px",
                                            marginRight: "8px",
                                            borderRadius: "4px",
                                          }
                                          : { display: "none" }
                                      }
                                    >
                                      <label
                                        key={`AAmount-${item.title}`}
                                        className="d-flex align-items-center"
                                        style={{ display: "flex" }}
                                      >
                                        <span
                                          style={{
                                            fontSize: "var(--font-medium)",
                                            fontWeight:
                                              "var(--font-weight-medium)",
                                            color: "var(--primary-color)",
                                            marginRight: "8px",
                                          }}
                                        >
                                          {item.title}{" "}
                                          <span
                                            style={{
                                              fontSize: "var(--font-x-small)",
                                              fontWeight: "600",
                                            }}
                                          >{`(${item.currency && item.min ? item.currency : ""} ${item.min ? item.min : "Onwards"} to ${item.currency && item.max ? item.currency : ""} ${item.max ? item.max : "Onwards"})`}</span>
                                        </span>
                                        <FontAwesomeIcon
                                          icon={faXmark}
                                          color="var(--primary-color)"
                                          style={{
                                            fontSize: "var(--font-x-medium)",
                                            cursor: "pointer",
                                          }}
                                          onClick={() => {
                                            this.removeAmountFilter(item.title);
                                          }}
                                        />
                                      </label>
                                    </li>
                                  )
                                )}

                                {/* </div> */}
                              </>
                            )}

                          {alreadyAppliedFilters.dateFilters &&
                            alreadyAppliedFilters.dateFilters.isVisible &&
                            alreadyAppliedFilters.dateFilters.data && (
                              <>
                                {/* <div style={{display: 'flex', alignItems: 'center', marginBottom: '8px'}}> */}
                                {/* <h5 style={{fontSize: 'var(--font-medium)', fontWeight: 'var(--font-weight-medium)', color: '#495370', margin: '0', minWidth: '160px'}}>Date Filters</h5> */}
                                {/* <ul style={{listStyle: 'none', padding: '0', width: '100%', margin: '0', display: 'flex'}}> */}
                                {alreadyAppliedFilters.dateFilters.data.map(
                                  (item) => (
                                    <li
                                      key={item.text}
                                      style={
                                        item.startDate &&
                                          item.startDate.length > 0
                                          ? {
                                            padding: "8px",
                                            width: "auto",
                                            background: "white",
                                            padding: "8px",
                                            marginRight: "8px",
                                            borderRadius: "4px",
                                          }
                                          : { display: "none" }
                                      }
                                    >
                                      <label
                                        key={`ADate-${item.title}`}
                                        htmlFor={`Status-${item.text}`}
                                        className="d-flex align-items-center"
                                        style={{ display: "flex" }}
                                      >
                                        <span
                                          style={{
                                            fontSize: "var(--font-medium)",
                                            fontWeight:
                                              "var(--font-weight-medium)",
                                            color: "var(--primary-color)",
                                            marginRight: "8px",
                                          }}
                                        >
                                          {item.title}{" "}
                                          <span
                                            style={{
                                              fontSize: "var(--font-x-small)",
                                              fontWeight: "600",
                                            }}
                                          >{`(${item.startDate != null && item.endDate != null ? item.startDate + " to " + item.endDate : item.startDate != null ? item.startDate : item.endDate !=null ? item.endDate :''})`}</span>
                                        </span>
                                        <FontAwesomeIcon
                                          icon={faXmark}
                                          color="var(--primary-color)"
                                          style={{
                                            fontSize: "var(--font-x-medium)",
                                            cursor: "pointer",
                                          }}
                                          onClick={() => {
                                            this.removeDateFilter(item.title);
                                          }}
                                        />
                                      </label>
                                    </li>
                                  )
                                )}
                                {/* </ul> */}
                                {/* </div> */}
                              </>
                            )}
                        </ul>
                      </section>
                    </>
                  )}

                {/* Other Filters */}
                {/* {showProcessedTable && !this.state.validationFailed && */}
                <>
                  <section
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      marginTop: "16px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {/* Status Filters */}
                      <div className="dropdown" style={{ marginRight: "24px" }}>
                        <button
                          onFocus={() => {
                            this.setState({
                              isDateFilter: false,
                              isAmountFilter: false,
                            });
                          }}
                          type="button"
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            color: "var(--secondary-color)",
                            border: "none",
                            outline: "none",
                            background: "white",
                          }}
                        >
                          <FontAwesomeIcon icon={faFilter} />{" "}
                          <span
                            style={{
                              marginLeft: "12px",
                              fontSize: "var(--font-medium)",
                              fontWeight: "var(--font-weight-medium)",
                            }}
                          >
                            Status Filters
                          </span>
                        </button>
                        <div
                          className="dropdown-menu"
                          aria-labelledby="dropdownMenuButton"
                          style={{
                            padding: "4px",
                            height: "auto",
                            minWidth: "216px",
                            borderRadius: "4px",
                            background: "var(--light-color)",
                            border: "none",
                          }}
                        >
                          <ul
                            style={{
                              listStyle: "none",
                              padding: "0",
                              width: "100%",
                              margin: "0",
                            }}
                          >
                            {status &&
                              status.map((item) => (
                                <li
                                  key={item.text}
                                  style={{ padding: "8px", width: "100%" }}
                                >
                                  <label
                                    key={item.text}
                                    htmlFor={`Status-${item.text}`}
                                    className="d-flex align-items-center cursor-pointer"
                                    style={{
                                      width: "100%",
                                      display: "flex",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <span
                                      htmlFor={`Status-${item.text}`}
                                      style={{
                                        fontSize: "var(--font-medium)",
                                        fontWeight: "var(--font-weight-medium)",
                                        color: "var(--primary-color)",
                                      }}
                                    >
                                      {item.text}
                                    </span>
                                    <input
                                      id={`Status-${item.text}`}
                                      checked={item.isChecked}
                                      style={{
                                        borderRadius: "4px",
                                        height: "15px",
                                        width: "15px",
                                        cursor: "pointer",
                                        marginRight: "5px",
                                        backgroundColor: "#495370",
                                      }}
                                      type="checkbox"
                                      name={item.value}
                                      value={item}
                                      onChange={this.handleStatusChange}
                                    />
                                  </label>
                                </li>
                              ))}
                          </ul>
                        </div>
                      </div>

                      {/* Amount Filters */}
                      <div
                        className=""
                        style={{ marginRight: "24px", position: "relative" }}
                      >
                        <button
                          onClick={() => {
                            this.setState({
                              isAmountFilter: !this.state.isAmountFilter,
                              isDateFilter: false,
                            });
                          }}
                          type="button"
                          id="dropdownMenuButtonAmount"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            color: "var(--secondary-color)",
                            border: "none",
                            outline: "none",
                            background: "white",
                          }}
                        >
                          <FontAwesomeIcon icon={faFilterCircleDollar} />{" "}
                          <span
                            style={{
                              marginLeft: "12px",
                              fontSize: "var(--font-medium)",
                              fontWeight: "var(--font-weight-medium)",
                            }}
                          >
                            Amount Filters
                          </span>
                        </button>
                        <div
                          id="dropdownDivButtonAmount"
                          style={
                            !isAmountFilter
                              ? { display: "none" }
                              : {
                                width: "340px",
                                padding: "4px",
                                position: "relative",
                                padding: "4px",
                                height: "auto",
                                minWidth: "310px",
                                borderRadius: "4px",
                                background: "var(--light-color)",
                                border: "none",
                                position: "absolute",
                                transform: "translate3d(-99px, 25px, 0px)",
                                top: "0px",
                                left: "100px",
                                willChange: "transform",
                                zIndex: "60",
                              }
                          }
                        >
                          <ul
                            style={{
                              listStyle: "none",
                              padding: "0",
                              width: "100%",
                              margin: "0",
                            }}
                          >
                            <li
                              className="avoidToggle"
                              key={`Requested Amount`}
                              style={{ margin: "8px" }}
                            >
                              <Grid item xs={4}>
                                <label
                                  htmlFor="requestedAmount"
                                  className="py-1"
                                  style={{
                                    fontWeight: "var(--font-weight-medium)",
                                    fontSize: "var(--font-medium)",
                                    color: "var(--primary-color)",
                                  }}
                                >
                                  Requested Amount
                                </label>
                                <Grid container spacing={1} rowGap={2}>
                                  <Grid item xs={4}>
                                    <select
                                      id="requestedCcySelect"
                                      className="form-control"
                                      onChange={(e) => {
                                        const selectedCurrency = e.target.value !== "Currency" ? e.target.value : null;
                                        this.setState({
                                          requestedCcy: e.target.value !== "Currency" ? e.target.value : null,
                                        });
                                        this.updateDecimalInRule(selectedCurrency, 'Requested');
                                        this.updateFormField('requestedCcy', selectedCurrency);
                                      }}
                                      value={formFields.requestedCcy.value || ''}
                                    >
                                      <option>CCY</option>
                                      {this.state.currencyList && this.state.currencyList.map((currency, index) => (
                                        <option key={`${currency.code}_${index}`} value={currency.code}>
                                          {currency.code}
                                        </option>
                                      ))}
                                    </select>
                                  </Grid>

                                  <Grid item xs={4}>
                                    <input
                                      min={1}
                                      style={{ width: '100px' }}
                                      type={Validator.isPositiveNumber}
                                      placeholder="Min"
                                      className="form-control"
                                      value={formFields.requestedMinAmount.value || ''}
                                      onBlur={(e) => {
                                        const inputValue = e.target.value || '';
                                        this.updateDecimalInRule(this.state.requestedCcy, 'Requested');
                                        let amount = this.autoFixDecimal('requestedMinAmount', inputValue);
                                        this.updateFormField("requestedMinAmount", amount);
                                      }}
                                      onChange={this.handleRequestedMinAmount}
                                    />
                                    {formFields.requestedMinAmount && formFields.requestedMinAmount.errors.map((error, index) => (
                                      <span key={index} className="error-message" style={{ color: 'red' }}>
                                        *{error}
                                      </span>
                                    ))}
                                  </Grid>
                                  <Grid item xs={4}>
                                    <input
                                      min={1}
                                      style={{ width: '100px' }}
                                      type={Validator.isPositiveNumber}
                                      placeholder="Max"
                                      className="form-control"
                                      value={formFields.requestedMaxAmount.value || ''}

                                      onBlur={(e) => {
                                        const inputmaxValue = e.target.value || '';
                                        this.updateDecimalInRule(this.state.requestedCcy, 'Requested');
                                        let amount = this.autoFixDecimal('requestedMaxAmount', inputmaxValue);
                                        this.updateFormField("requestedMaxAmount", amount);

                                      }}

                                      onChange={this.handleRequestedMaxAmount}
                                    />
                                    {formFields.requestedMaxAmount && formFields.requestedMaxAmount.errors.map((error, index) => (
                                      <span key={index} className="error-message" style={{ color: 'red' }}>
                                        *{error}
                                      </span>
                                    ))}
                                  </Grid>
                                </Grid>
                              </Grid>
                            </li>
                            {/* <li
                              className="avoidToggle"
                              key={`Paid Amount`}
                              style={{ margin: "8px" }}
                            >
                              <Grid item xs={4}>
                                <label
                                  htmlFor="paidAmount"
                                  className="py-1 avoidToggle"
                                  style={{
                                    fontWeight: "var(--font-weight-medium)",
                                    fontSize: "var(--font-medium)",
                                    color: "#495370",
                                  }}
                                >
                                  Paid Amount
                                </label>
                                <Grid
                                  className="avoidToggle"
                                  container
                                  spacing={1}
                                  rowGap={2}
                                >
                                  <Grid item xs={4}>
                                    <select
                                      id="paidCcySelect"
                                      className="form-control avoidToggle"
                                      onChange={(e) => {
                                        const selectedCurrency = e.target.value !== "Currency" ? e.target.value : null;
                                        this.setState({
                                          paidCcy: selectedCurrency,
                                        });
                                        this.updateDecimalInRule(selectedCurrency);
                                        this.updateFormField('paidCcy', selectedCurrency);
                                      }}
                                      value={formFields.paidCcy.value || ''}
                                    >
                                      <option className="avoidToggle">CCY</option>
                                      {this.state.currencyList && this.state.currencyList.map((currency, index) => (
                                        <option className="avoidToggle" key={`${currency.code}_${index}`} value={currency.code}>
                                          {currency.code}
                                        </option>
                                      ))}
                                    </select>
                                  </Grid>
                                  <Grid item xs={4}>
                                    <input style={{ width: '100px' }} min={1} type={Validator.isPositiveNumber} placeholder="Min" className="form-control" value={formFields.paidMinAmount.value || ''}
                                      onBlur={(e) => {
                                        const paidMinValue = e.target.value || '';

                                        this.updateDecimalInRule(this.state.paidCcy, 'Requested');
                                        let amount = this.autoFixDecimal('paidMinAmount', paidMinValue);
                                        this.updateFormField("paidMinAmount", amount);
                                      }}
                                      onChange={this.handlePaidMinAmount}
                                    />
                                    {formFields.paidMinAmount && formFields.paidMinAmount.errors.map((error, index) => (
                                      <span key={index} className="error-message" style={{ color: 'red' }}>
                                        *{error}
                                      </span>
                                    ))}
                                  </Grid>
                                  <Grid item xs={4}>
                                    <input style={{ width: '100px' }}  min={1} type={Validator.isPositiveNumber} placeholder="Max" className="form-control"
                                      value={formFields.paidMaxAmount.value || ''}
                                      onBlur={(e) => {
                                        const paidMaxValue = e.target.value || '';

                                        this.updateDecimalInRule(this.state.paidCcy, 'Requested');
                                        let amount = this.autoFixDecimal('paidMaxAmount', paidMaxValue);
                                        this.updateFormField("paidMaxAmount", amount);
                                      }}
                                      onChange={this.handlePaidMaxAmount}
                                    />
                                    {formFields.paidMaxAmount && formFields.paidMaxAmount.errors.map((error, index) => (
                                      <span key={index} className="error-message" style={{ color: 'red' }}  >
                                        *{error}
                                      </span>
                                    ))}
                                  </Grid>
                                </Grid>
                              </Grid>
                            </li> */}
                          </ul>
                        </div>
                      </div>

                      {/* Date Filters */}
                      <div
                        className=""
                        style={{ marginRight: "24px", position: "relative" }}
                      >
                        <button
                          onClick={() => {
                            this.setState({
                              isDateFilter: !this.state.isDateFilter,
                              isAmountFilter: false,
                            });
                          }}
                          type="button"
                          id="dateFilterMenuButton"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            color: "var(--secondary-color)",
                            border: "none",
                            outline: "none",
                            background: "white",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faCalendar}
                            style={{ marginBottom: "3px" }}
                          />{" "}
                          <span
                            style={{
                              marginLeft: "12px",
                              fontSize: "var(--font-medium)",
                              fontWeight: "var(--font-weight-medium)",
                            }}
                          >
                            Date Filters
                          </span>
                        </button>
                        <div
                          className="dropdown-menu-lg-end"
                          style={
                            !isDateFilter
                              ? { display: "none" }
                              : {
                                width: "340px",
                                padding: "4px",
                                position: "relative",
                                padding: "4px",
                                height: "auto",
                                minWidth: "310px",
                                borderRadius: "4px",
                                background: "var(--light-color)",
                                border: "none",
                                position: "absolute",
                                transform: "translate3d(-99px, 25px, 0px)",
                                top: "0px",
                                left: "-25px",
                                willChange: "transform",
                                zIndex: "60",
                              }
                          }
                        >
                          <Grid
                            container
                            columnGap={1}
                            rowGap={1}
                            columns={{ xs: 1, md: 1 }}
                            style={{ position: "relative" }}
                          >
                            <Grid
                              item
                              xs={3.2}
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
                              <Grid container spacing={2}>
                                <Grid
                                  item
                                  xs={6}
                                  style={{ position: "relative" }}
                                >
                                  <FormControl fullWidth>
                                    <MUIDatePicker
                                      disableFuture={true}
                                      name="CreatedStartDate"
                                      placeholder="From"
                                      value={
                                        receiptStartDate
                                          ? dayjs(receiptStartDate)
                                          : null
                                      }
                                      format={DateFormat.date}
                                      maxDate={receiptEndDate ? dayjs(receiptEndDate) : null}
                                      onChange={(e) => {
                                        let value = this.changeDateFormat(e);
                                        this.setState({
                                          receiptStartDate: value,
                                        });
                                      }}
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                  <FormControl fullWidth>
                                    <MUIDatePicker
                                      disableFuture={true}
                                      name="CreatedEndDate"
                                      placeholder="To"
                                      value={
                                        receiptEndDate
                                          ? dayjs(receiptEndDate)
                                          : null
                                      }
                                      format={DateFormat.date}
                                      minDate={receiptStartDate ? dayjs(receiptStartDate) : null} // Set minDate to the selected "From" date
                                      onChange={(e) => {
                                        let value = this.changeDateFormat(e);
                                        this.setState({
                                          receiptEndDate: value,
                                        });
                                      }}
                                    />
                                  </FormControl>
                                </Grid>
                              </Grid>
                            </Grid>

                            {/* <Grid item xs={3.2}>
                              <label
                                className="py-1"
                                style={{
                                  fontWeight: "var(--font-weight-medium)",
                                  fontSize: "var(--font-medium)",
                                  color: "#495370",
                                }}
                              >
                                Payment Date
                              </label>
                              <Grid container spacing={2}>
                                <Grid item xs={6}>
                                  <FormControl fullWidth>
                                    <MUIDatePicker
                                      disableFuture={true}
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
                                        this.setState({
                                          paymentStartDate: value,
                                        });
                                      }}
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                  <FormControl fullWidth>
                                    <MUIDatePicker
                                      disableFuture={true}
                                      name="PaymentEndDate"
                                      placeholder="To"
                                      value={
                                        paymentEndDate
                                          ? dayjs(paymentEndDate)
                                          : null
                                      }
                                      format={DateFormat.date}
                                      minDate={paymentStartDate ? dayjs(paymentStartDate) : null}
                                      onChange={(e) => {
                                        let value = this.changeDateFormat(e);
                                        this.setState({
                                          paymentEndDate: value,
                                        });
                                      }}
                                    />
                                  </FormControl>
                                </Grid>
                              </Grid>
                            </Grid> */}

                            <Grid item xs={3.2}>
                              <label
                                className="py-1"
                                style={{
                                  fontWeight: "var(--font-weight-medium)",
                                  fontSize: "var(--font-medium)",
                                  color: "#495370",
                                }}
                              >
                                Cancellation Date
                              </label>
                              <Grid container spacing={2}>
                                <Grid item xs={6}>
                                  <FormControl fullWidth>
                                    <MUIDatePicker
                                      disableFuture={true}
                                      name="cancellationFromDate"
                                      placeholder="From"
                                      value={
                                        cancellationFromDate
                                          ? dayjs(cancellationFromDate)
                                          : null
                                      }
                                      format={DateFormat.date}
                                      maxDate={cancellationToDate ? dayjs(cancellationToDate) : null}
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
                                      disableFuture={true}
                                      name="cancellationToDate"
                                      placeholder="To"
                                      value={
                                        cancellationToDate
                                          ? dayjs(cancellationToDate)
                                          : null
                                      }
                                      format={DateFormat.date}
                                      minDate={cancellationFromDate ? dayjs(cancellationFromDate) : null}
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
                        </div>
                      </div>

                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {/* Create new payment */}
                      {allowPaymentByScreen && referralPartners.merchantType != OnboardConstants.ReferralMerchant && <>
                        <PermissionGuard userPermission={PrivilegeConstants.CREATE_PAYMENT}>
                        <div
                          style={{
                            fontSize: "var(--font-medium)",
                            fontWeight: "var(--font-weight-medium)",
                            color: "var(--primary-color)",
                            display: "flex",
                            alignContent: "center",
                            marginLeft: "24px",
                          }}
                        >
                          <a
                            className="navItem"
                            onClick={() => {
                              this.navigateToNewPayment();
                            }}
                            style={{
                              display: "block",
                              minWidth: "120px",
                              marginTop: "8px",
                              marginleft: "1rem",
                              color: "var(--secondary-color)",
                              cursor: "pointer",
                            }}
                            id="pills-newTransaction-tab"
                            data-toggle="pill"
                            href="#pills-newTransaction"
                            role="tab"
                            aria-controls="pills-newTransaction"
                            aria-selected="false"
                          >
                            <FontAwesomeIcon
                              icon={faSquarePlus}
                              style={{ width: "16px", aspectRatio: "auto" }}
                            />{" "}
                            <span style={{ marginLeft: "4px" }}>
                              New Payment Request
                            </span>
                          </a>
                        </div>
                        </PermissionGuard>
                      </>}

                      {/* Setting */}
                      {/* <button variant="contained" style={{ background: '#D9D9D9', width: '34px', height: '34px', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', outline: 'none', border: 'none' }}>
                        <FontAwesomeIcon icon={faGear} color="var(--primary-color)"/>
                      </button> */}
                    </div>
                  </section>
                </>
                {/* } */}

                {/* Basic Search Filters */}
                <Grid container mt={1} spacing={1}>
                  {(referralPartners.merchantType == OnboardConstants.ReferralMerchant || (this.state.subMerchantIds && this.state.subMerchantIds.length > 0)) && (
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
                            this.state.selectedMerchant ? 
                            {merchantId: this.state.selectedMerchant, merchantName : this.state.selectedMerchant} : merchantsList[0] : null}
                          onChange={this.getMerchantId}
                          value={
                            merchantsList
                              ? merchantsList.find(
                                (v) => 
                                {
                                  v.merchantName == this.state.selectedMerchant;
                                }
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
                      htmlFor="benePayTransactionId"
                      className="py-1"
                      style={{
                        whiteSpace: "nowrap",
                        fontWeight: "var(--font-weight-normal)",
                        fontSize: "var(--font-x-medium)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        color: 'var(--dark-color)'
                      }}
                    >
                      BenePay Transaction Id
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={!isMarkAsPaidClicked ? searchedBenePayTransactionId : null}
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
                      style={{
                        whiteSpace: "nowrap",
                        fontWeight: "var(--font-weight-normal)",
                        fontSize: "var(--font-x-medium)",
                        overflow: "hidden",
                        color: 'var(--dark-color)',
                        textOverflow: "ellipsis",
                      }}
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
                      style={{
                        whiteSpace: "nowrap",
                        fontWeight: "var(--font-weight-normal)",
                        fontSize: "var(--font-x-medium)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        color: 'var(--dark-color)'
                      }}
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
                      style={{
                        whiteSpace: "nowrap",
                        fontWeight: "var(--font-weight-normal)",
                        fontSize: "var(--font-x-medium)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        color: 'var(--dark-color)'
                      }}
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

                  <Grid item xs={12} md={4} xl={2}>
                    <label
                      htmlFor="Mobile Number"
                      className="py-1"
                      style={{
                        whiteSpace: "nowrap",
                        fontWeight: "var(--font-weight-normal)",
                        fontSize: "var(--font-x-medium)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        color: 'var(--dark-color)'
                      }}
                    >
                      Mobile
                    </label>
                    <MUIPhoneInput
                      type="text"
                      className="form-control"
                      value={mobileNumber}
                      htmlFor="MobileNumber"
                      id="payer-mobile"
                      defaultCountry={"in"}
                      countryCodeEditable={false}
                      disableAreaCodes={true}
                      onBlur={(e) => {
                        this.validateNumber(e.target.value);
                      }}
                    />

                  </Grid>


                  {!(TempStorage.loginUserRole === USER_TYPE.ADMIN_USER) && (
                    <Grid item xs={12} md={4} xl={2}>
                      <label
                        htmlFor="collectionReference"
                        className="py-1"
                        style={{
                          whiteSpace: "nowrap",
                          fontWeight: "var(--font-weight-normal)",
                          fontSize: "var(--font-x-medium)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          color: 'var(--dark-color)'
                        }}
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

                  <Grid item xs={12} md={4} xl={2}>
                    <label
                      htmlFor="transactionCreationModesList"
                      className="py-1"
                      style={{
                        whiteSpace: "nowrap",
                        fontWeight: "var(--font-weight-normal)",
                        fontSize: "var(--font-x-medium)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Transaction Creation Mode
                    </label>
                    <Autocomplete
                      disablePortal
                      id="transactionCreationModesList"
                      name="transactionCreationModesList"
                      options={this.state.transactionCreationModesList}
                      getOptionLabel={(option) => option.description}
                      onChange={(event, newValue) => this.handleselectedTransactionCreationMode(event, "transactionCreationModesList", newValue)}
                      value={this.state.transactionCreationModesList ?
                        this.state.transactionCreationModesList.find(mode => mode.description === this.state.selectedTransactionCreationMode) : null}
                      renderInput={(params) => (
                        <TextField
                          className="form-control transactionCreationModesList"
                          {...params}
                        />
                      )}
                    />
                  </Grid>

                  {!this.state.partialPaymentAllowedForMerchant && TempStorage.loginUserRole != USER_TYPE.ADMIN_USER &&
                    <Grid item xs={12} md={4} xl={2}>
                      <label
                        htmlFor="settlementStatusList"
                        className="py-1"
                        style={{
                          whiteSpace: "nowrap",
                          fontWeight: "var(--font-weight-normal)",
                          fontSize: "var(--font-x-medium)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        Payment Settlement Status
                      </label>
                      <Autocomplete
                        disablePortal
                        id="settlementStatusList"
                        name="settlementStatus"
                        options={this.state.settlementStatusList || []}
                        getOptionLabel={(option) => option.name}
                        onChange={(event, newValue) => this.handleselectedTransactionCreationMode(event, "settlementStatus", newValue)}
                        value={this.state.settlementStatusList ?
                          this.state.settlementStatusList.find(mode => mode.name === this.state.selectedSettlementStatus) : null}
                        renderInput={(params) => (
                          <TextField
                            className="form-control settlementStatusList"
                            {...params}
                          />
                        )}
                      />
                    </Grid>
                  }
                </Grid>

                {/* Apply Btns */}
                <div
                  className="d-flex justify-content-start"
                  style={{ marginTop: "24px" }}
                >
                  <span style={{ marginRight: "60px" }}>
                    <button
                      onClick={() => { this.handleApplyClickPaymentSettlement() }}
                      style={{
                        padding: "8px 24px",
                        marginRight: "8px",
                        color: "var(--light-color)",
                        fontWeight: "var(--font-weight-normal)",
                        fontSize: "var(--font-x-medium)",
                        width: "154px",
                        background: "var(--accent-color)",
                        outline: "none",
                        border: "none",
                        borderRadius: "4px",
                      }}
                    >
                      Search
                    </button>
                    <button
                      onClick={(e) => { this.clearProcessedDetails(e);}}
                      style={{
                        padding: "8px 24px",
                        fontWeight: "var(--font-weight-normal)",
                        fontSize: "var(--font-x-medium)",
                        width: "154px",
                        background: "var(--light-color)",
                        outline: "none",
                        border: "none",
                        borderRadius: "4px",
                        color: 'var(--accent-color)'
                      }}
                    >
                      Clear
                    </button>
                  </span>
                </div>

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
              </div>

              {/* Table Result */}
              {showProcessedTable &&
                !this.state.validationFailed &&
                parentTransactions &&
                parentTransactions.length > 0 ? (
                <>
                  <div style={{ marginTop: "20px" }}>
                    <Box sx={{ width: "100%", marginTop: "2%" }}>
                      {/* {this.state.searchedPaymentResultList && this.state.searchedPaymentResultList.length > 0 && 
                    <>
                      <ul>

                        {this.state.searchedPaymentResultList.map((item) => {
                          return (
                          <>

                          </>
                          )
                        })}
                      </ul>
                    </>} */}

                      {/* Download */}
                      <div
                        style={{ display: "flex", justifyContent: "flex-end", columnGap: '10px' }}
                      >
                        <PermissionGuard userPermission={(PrivilegeConstants.EXPORT_PAYMENT) || (true)}>
                          <button
                            onClick={this.downloadTransactions}
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
                                background: "var(--light-color)",
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
                              <FontAwesomeIcon
                                icon={faDownload}
                                color="var(--secondary-color)"
                              />
                            </button>
                            <span
                              style={{
                                marginLeft: "12px",
                                fontSize: "var(--font-medium)",
                                fontWeight: "var(--font-weight-medium)",
                                color: 'var(--primary-color)'
                              }}
                            >
                              Export
                            </span>
                          </button>
                        </PermissionGuard>

                        <button
                          onClick={() => { this.handleApplyClickPaymentSettlement() }}
                          type="button"
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
                              background: "var(--light-color)",
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
                            <RefreshIcon style={{ color: "var(--secondary-color)" }} />
                          </button>
                          <span
                            style={{
                              marginLeft: "12px",
                              fontSize: "var(--font-medium)",
                              fontWeight: "var(--font-weight-medium)",
                              color: 'var(--primary-color)'
                            }}
                          >
                            Refresh
                          </span>
                        </button>
                      </div>

                      {/**
                       * @author Ragavan
                       * Changed the normal table as a Datagrid - Start
                       */}

                      <div style={{width: '100%', height:'417px'}}>
                        <DataGrid
                          rows={parentTransactions}
                          columns={columns}
                          className="serachedPaymentResultGridPagination"
                          onCellClick={this.handleCellClick}
                          rowHeight={72}
                          getRowId={(row) => row.transactionId} // Use a field that uniquely identifies each row
                          onSortModelChange={this.sortTransaction}
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
                            //     pageSize: this.state.pageSize,
                            //   },
                            // },
                            sorting: {
                              sortModel: [
                                { field: sortingBy, sort: sortingType },
                              ],
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
                              fontSize={16}
                              fontWeight={500}
                              style={{ color: "var(--accent-color)", width: "100%" }}
                            >
                              Your search returned{" "}
                              {totalPaymentsFound ? totalPaymentsFound : 0}{" "}
                              payment requests
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
                              background: "var(--light-color)",
                              height: "auto",
                              padding: "8px 16px",
                              borderRadius: "7px",
                            }}
                          >
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              {(apply2Click || apply1Click) &&
                                !this.state.rejectedFilePagination && (
                                  <ReactPaginate
                                    previousLabel={"<"}
                                    nextLabel={">"}
                                    breakLabel={"..."}
                                    pageCount={this.state.totalPages}
                                    marginPagesDisplayed={1}
                                    pageRangeDisplayed={2}
                                    onPageChange={this.handlePageChange}
                                    containerClassName={
                                      "pagination justify-content-end my-auto"
                                    }
                                    pageClassName={
                                      "page-item bg-transparent border-0"
                                    }
                                    pageLinkClassName={
                                      "page-link rounded-lg mx-1 bg-transparent border-0"
                                    }
                                    previousClassName={
                                      "page-item bg-transparent border-0"
                                    }
                                    previousLinkClassName={
                                      "page-link rounded-lg mr-2 bg-transparent border-0"
                                    }
                                    nextClassName={
                                      "page-item bg-transparent border-0"
                                    }
                                    nextLinkClassName={
                                      "page-link rounded-lg ml-2 bg-transparent border-0"
                                    }
                                    breakClassName={
                                      "page-item rounded-lg mx-1 bg-transparent border-0"
                                    }
                                    breakLinkClassName={
                                      "page-link rounded-lg bg-transparent border-0"
                                    }
                                    activeClassName={
                                      "active bg-primary rounded-lg"
                                    }
                                    forcePage={this.state.initalPage}
                                  />
                                )}
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
                                  fontSize={17}
                                  fontWeight={500}
                                  style={{ display: "inline" }}
                                >
                                  <span
                                    style={{
                                      fontSize: "var(--font-x-small)",
                                      fontWeight: "var(--font-weight-medium)",
                                      color: "var(--accent-color)",
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
                                  onChange={this.handleRowsPerPage}
                                  sx={{ width: 72 }}
                                >
                                  <MenuItem
                                    value={10}
                                    style={{ color: "var(--accent-color)" }}
                                  >
                                    <span style={{ color: "var(--accent-color)" }}>10</span>
                                  </MenuItem>
                                  <MenuItem
                                    value={15}
                                    style={{ color: "var(--accent-color)" }}
                                  >
                                    <span style={{ color: "var(--accent-color)" }}>15</span>
                                  </MenuItem>
                                  <MenuItem
                                    value={20}
                                    style={{ color: "var(--accent-color)" }}
                                  >
                                    <span style={{ color: "var(--accent-color)" }}>20</span>
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
                                  color: "var(--accent-color)",
                                  margin: "3px 5px 0px 0px",
                                }}
                              >
                                Go to Page
                              </h5>
                              <input
                                min={1}
                                max={this.state.totalPages}
                                style={{
                                  width: "56px",
                                  background: "white",
                                  padding: "4px",
                                  border: "1px solid var(--accent-color)",
                                  textAlign: "center",
                                }}
                                type={Validator.isPositiveNumber}
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
                                  this.handlePageChange({
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
                                <span style={{ color: "var(--accent-color)" }}>
                                  <FontAwesomeIcon icon={faAnglesRight} />
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

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
                                      style={{ color: "var(--secondary-color)" }}
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
                                      style={{ color: "var(--secondary-color)" }}
                                    >
                                      Cancel Transaction
                                    </Typography>
                                  </>
                                )}
                              </Grid>
                              <Grid
                                item
                                xs={2}
                                style={{
                                  display: "flex",
                                  justifyContent: "end",
                                }}
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
                                  style={{
                                    color: "var(--dark-color)",
                                    display: "inline",
                                  }}
                                >
                                  BenePay Transaction Id:&nbsp;
                                </Typography>
                                <Typography
                                  gap={2}
                                  variant="body1"
                                  fontSize={17}
                                  style={{
                                    color: "var(--accent-color)",
                                    display: "inline",
                                  }}
                                >
                                  {selectedTransactionId}&ensp;
                                  <IconButton
                                    aria-label="Duplicate"
                                    onClick={() => {
                                      this.handleCopyClick(
                                        selectedTransactionId
                                      );
                                    }}
                                  >
                                    <FileCopyOutlinedIcon
                                      style={{ color: "var(--accent-color)" }}
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
                                  style={{ color: 'var(--dark-color)' }}
                                >
                                  Amount
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography
                                  variant="body1"
                                  fontSize={15}
                                  fontWeight={400}
                                  style={{ color: 'var(--primary-color)' }}
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
                                  style={{ color: 'var(--dark-color)' }}
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
                                  style={{ color: 'var(--dark-color)' }}
                                >
                                  Creation Timestamp
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography
                                  variant="body1"
                                  fontSize={15}
                                  fontWeight={400}
                                  style={{ color: 'var(--primary-color)' }}
                                  >

                                    {`${(selectedCreateTimeStamp)}`}

                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography
                                  variant="body1"
                                  fontSize={15}
                                  fontWeight={400}
                                  style={{ color: 'var(--dark-color)' }}
                                >
                                  Payer
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography
                                  variant="body1"
                                  fontSize={15}
                                  fontWeight={400}
                                  style={{ color: 'var(--primary-color)' }}
                                >
                                  {selectedDebtorName}
                                </Typography>
                                <Typography
                                  variant="body1"
                                  fontSize={15}
                                  fontWeight={400}
                                  style={{ color: 'var(--primary-color)' }}
                                >
                                  {selectedDebtorEmailId}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography
                                  variant="body1"
                                  fontSize={15}
                                  fontWeight={400}
                                  style={{ color: 'var(--dark-color)' }}
                                >
                                  Collection Reference
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography
                                  variant="body1"
                                  fontSize={15}
                                  fontWeight={400}
                                  style={{ color: 'var(--primary-color)' }}
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
                                      style={{ color: 'var(--dark-color)' }}
                                    >
                                      Reason for Cancellation
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Typography
                                      variant="body1"
                                      fontSize={15}
                                      fontWeight={400}
                                      style={{ color: 'var(--primary-color)' }}
                                    >
                                      {cancellationReason}
                                    </Typography>
                                  </Grid>

                                  <Grid item xs={12} mt={4} style={{ color: 'var(--primary-color)' }}>
                                    {/* <Typography>
                                      Note: An email has been sent to{" "}
                                      {selectedDebtorEmailId} with information
                                      about the cancellation
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
                                      style={{ color: 'var(--dark-color)' }}
                                    >
                                      Description
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Typography
                                      variant="body1"
                                      fontSize={15}
                                      fontWeight={400}
                                      style={{ color: 'var(--primary-color)' }}
                                    >
                                      {selectedReasonForCollection}
                                    </Typography>
                                  </Grid>

                                  <Grid item xs={12}>
                                    <Typography
                                      variant="body1"
                                      fontWeight={500}
                                      style={{ color: 'var(--dark-color)' }}
                                    >
                                      Enter Reason for Cancellation<span style={{ color: 'red', marginLeft:'1%' }}>*</span>
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
                                      style={{ color: 'var(--primary-color)' }}
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
                                      style={{ color: 'var(--accent-color)' }}
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
                                      style={{ color: 'var(--accent-color)' }}
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
                                      style={{ color: 'var(--accent-color)' }}
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
                                      style={{ color: 'var(--accent-color)' }}
                                    >
                                      Amount changed
                                    </span>
                                  </Grid>

                                  <Grid item xs={6} mt={2}>
                                    <Button
                                      variant="contained"
                                      style={{
                                        backgroundColor: !_.isEmpty(this.state.cancellationReason) ? "var(--secondary-color)" : '#a7a7a7',
                                        color: 'white',
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
                                      style={{
                                        backgroundColor: "var(--light-color)",
                                        color: 'var(--primary-color)',
                                        width: "70%",
                                      }}
                                      onClick={() =>
                                        this.setState({
                                          showCancellationModal: false,
                                        })
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
                      {transactionDetailsModal &&
                        !this.state.isDeviceMobile && (
                          <ConfirmDialog open={true} setOpen={true}>
                            <Container maxWidth="sm">
                              <Grid container rowSpacing={1}>
                                <Grid item xs={10}>
                                  <>
                                    <Typography
                                      variant="body1"
                                      fontSize={20}
                                      fontWeight={600}
                                      style={{ color: "var(--secondary-color)" }}
                                    >
                                      Transaction Details
                                    </Typography>
                                  </>
                                </Grid>
                                <Grid
                                  item
                                  xs={2}
                                  style={{
                                    display: "flex",
                                    justifyContent: "end",
                                    color: 'var(--dark-color)'
                                  }}
                                >
                                  <IconButton
                                    size="medium"
                                    onClick={() =>
                                      this.setState({
                                        transactionDetailsModal: false,
                                      })
                                    }
                                    style={{ color: 'var(--dark-color)' }}
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
                                    style={{
                                      color: "var(--dark-color)",
                                      display: "inline",
                                    }}
                                  >
                                    BenePay Transaction Id:&nbsp;
                                  </Typography>
                                  <Typography
                                    gap={1}
                                    variant="body1"
                                    fontSize={17}
                                    style={{
                                      color: "var(--accent-color)",
                                      display: "inline",
                                    }}
                                  >
                                    {selectedTransactionId}&ensp;
                                    <IconButton
                                      aria-label="Duplicate"
                                      onClick={() => {
                                        this.handleCopyClick(
                                          selectedTransactionId
                                        );
                                      }}
                                    >
                                      <FileCopyOutlinedIcon
                                        style={{ color: "var(--accent-color)" }}
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
                                    style={{ color: 'var(--dark-color)' }}
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
                                    style={{ color: 'var(--dark-color)' }}
                                  >
                                    Create Timestamp
                                  </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Typography
                                    variant="body1"
                                    fontSize={15}
                                    fontWeight={400}
                                    style={{ color: 'var(--primary-color)' }}
                                  >
                                        {`${(selectedCreateTimeStamp)}`}

                                  </Typography>
                                </Grid>

                                <Grid item xs={6}>
                                  <Typography
                                    variant="body1"
                                    fontSize={15}
                                    fontWeight={400}
                                    style={{ color: 'var(--dark-color)' }}
                                  >
                                    Payer Name
                                  </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Typography
                                    variant="body1"
                                    fontSize={15}
                                    fontWeight={400}
                                    style={{ color: 'var(--primary-color)' }}
                                  >
                                    {selectedDebtorName}
                                  </Typography>
                                </Grid>

                                <Grid item xs={6}>
                                  <Typography
                                    variant="body1"
                                    fontSize={15}
                                    fontWeight={400}
                                    style={{ color: 'var(--dark-color)' }}
                                  >
                                    Payer Email
                                  </Typography>
                                </Grid>

                                <Grid item xs={6}>
                                  <Typography
                                    variant="body1"
                                    fontSize={15}
                                    fontWeight={400}
                                    style={{ color: 'var(--primary-color)' }}
                                  >
                                    {selectedDebtorEmailId}
                                  </Typography>
                                </Grid>
                                {transactionCreationMode && (
                                  <>
                                    <Grid item xs={6}>
                                      <Typography
                                        variant="body1"
                                        fontSize={15}
                                        fontWeight={400}
                                        style={{ color: 'var(--dark-color)' }}
                                      >
                                        Transaction Creation Mode
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <Typography
                                        variant="body1"
                                        fontSize={15}
                                        fontWeight={400}
                                        style={{ color: 'var(--primary-color)' }}
                                      >
                                        {transactionCreationMode}
                                      </Typography>
                                    </Grid>
                                  </>
                                )}
                                <Grid item xs={6}>
                                  <Typography
                                    variant="body1"
                                    fontSize={15}
                                    fontWeight={400}
                                    style={{ color: 'var(--dark-color)' }}
                                  >
                                    Due Date
                                  </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Typography
                                    variant="body1"
                                    fontSize={15}
                                    fontWeight={400}
                                    style={{ color: 'var(--primary-color)' }}
                                  >
                                    {(selectedPaymentDueDate)}
                                  </Typography>
                                </Grid>

                                <Grid item xs={6}>
                                  <Typography
                                    variant="body1"
                                    fontSize={15}
                                    fontWeight={400}
                                    style={{ color: 'var(--dark-color)' }}
                                  >
                                    Collection Reference
                                  </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Typography
                                    variant="body1"
                                    fontSize={15}
                                    fontWeight={400}
                                    style={{ color: 'var(--primary-color)' }}
                                  >
                                    {selectedCollectionRefNumber}
                                  </Typography>
                                </Grid>

                                <Grid item xs={6}>
                                  <Typography
                                    variant="body1"
                                    fontSize={15}
                                    fontWeight={400}
                                    style={{ color: 'var(--dark-color)' }}
                                  >
                                    Description
                                  </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Typography
                                    variant="body1"
                                    fontSize={15}
                                    fontWeight={400}
                                    style={{ color: 'var(--primary-color)' }}
                                  >
                                    {selectedReasonForCollection}
                                  </Typography>
                                </Grid>

                                <Grid item xs={6}>
                                  <Typography
                                    variant="body1"
                                    fontSize={15}
                                    fontWeight={400}
                                    style={{ color: 'var(--dark-color)' }}
                                  >
                                    Charges/Taxes
                                  </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Typography
                                    variant="body1"
                                    fontSize={15}
                                    fontWeight={400}
                                    style={{ color: 'var(--primary-color)' }}
                                  >
                                    {selectedCollectionCurrency +
                                      " " +
                                      (selectedCharges !== null
                                        ? selectedCharges
                                        : 0)}
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
                                        style={{ color: 'var(--dark-color)' }}
                                      >
                                        Payment Id
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <Typography
                                        variant="body1"
                                        fontSize={15}
                                        fontWeight={400}
                                        style={{ color: 'var(--primary-color)' }}
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
                                        style={{ color: 'var(--dark-color)' }}
                                      >
                                        Requested Amount
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <Typography
                                        variant="body1"
                                        fontSize={15}
                                        fontWeight={400}
                                        style={{ color: 'var(--primary-color)' }}
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
                                  selectedStatus == "EXPIRED" ||
                                  selectedStatus == "IN_PROCESS" ||
                                  selectedStatus == "FAILED" ? (
                                  ""
                                ) : (
                                  <>
                                    {!allowManualPay && selectedPaymentConfirmationId &&
                                      <>
                                        <Grid item xs={6} spacing={2} >
                                          <Grid container>
                                            <Grid xs={6}>
                                              <Typography
                                                variant="body1"
                                                fontSize={15}
                                                fontWeight={400}
                                                style={{ color: 'var(--dark-color)' }}
                                              >
                                                Payment Confirmation Id
                                              </Typography>
                                            </Grid>
                                            <Grid xs={6}>
                                              <CustomWidthTooltip style={{ maxWidth: 50 }} title="This information is available via View Payment Details button below">
                                                <Info></Info>
                                              </CustomWidthTooltip>
                                            </Grid>
                                          </Grid>
                                        </Grid>

                                        <Grid item xs={6}>
                                          <Typography
                                            variant="body1"
                                            noWrap
                                            fontSize={15}
                                            fontWeight={400}
                                            style={{ color: 'var(--primary-color)' }}
                                          >
                                            {selectedPaymentConfirmationId}
                                          </Typography>
                                        </Grid>
                                      </>
                                    }

                                    <Grid item xs={6}>
                                      <Grid container>
                                        <Grid xs={6}>
                                          <Typography
                                            variant="body1"
                                            fontSize={15}
                                            fontWeight={400}
                                            style={{ color: 'var(--dark-color)' }}
                                          >
                                            Paid Amount
                                          </Typography>
                                        </Grid>
                                        <Grid xs={6}>
                                          <CustomWidthTooltip title="This information is available via View Payment Details button below">
                                            <Info></Info>
                                          </CustomWidthTooltip>
                                        </Grid>
                                      </Grid>
                                    </Grid>

                                    <Grid item xs={6}>
                                      <Typography
                                        variant="body1"
                                        fontSize={15}
                                        fontWeight={400}
                                        style={{ color: 'var(--primary-color)' }}
                                      >
                                        {selectedCollectionCurrency +
                                          " " +
                                          selectedFinalPaymentAmount}
                                      </Typography>
                                    </Grid>

                                    {this.state.selectedPaymentStlAmount &&
                                    <> 
                                      <Grid item xs={6}>
                                        <Typography
                                          variant="body1"
                                          fontSize={15}
                                          fontWeight={400}
                                          style={{ color: 'var(--dark-color)' }}
                                        >
                                          Payment Settlement Amount
                                        </Typography>
                                      </Grid>

                                      <Grid item xs={6}>
                                        <Typography
                                          variant="body1"
                                          fontSize={15}
                                          fontWeight={400}
                                          style={{ color: 'var(--primary-color)' }}
                                        >
                                            {this.state.selectedPaymentStlAmount}
                                        </Typography>
                                      </Grid>
                                    </>
                                    }

                                    {this.state.selectedPaymentStlDate && 
                                    <>                                  
                                      <Grid item xs={6}>
                                        <Typography
                                          variant="body1"
                                          fontSize={15}
                                          fontWeight={400}
                                          style={{ color: 'var(--dark-color)' }}
                                        >
                                          Payment Settlement Date
                                        </Typography>
                                      </Grid>

                                      <Grid item xs={6}>
                                        <Typography
                                          variant="body1"
                                          fontSize={15}
                                          fontWeight={400}
                                          style={{ color: 'var(--primary-color)' }}
                                        >
                                          {this.state.selectedPaymentStlDate}
                                        </Typography>
                                      </Grid>
                                      </>
                                    }

                                    {this.state.selectedPaymentStlProvider && 
                                    <>
                                      <Grid item xs={6}>
                                        <Typography
                                          variant="body1"
                                          fontSize={15}
                                          fontWeight={400}
                                          style={{ color: 'var(--dark-color)' }}
                                        >
                                          Payment Settlement Provider
                                        </Typography>
                                      </Grid>

                                      <Grid item xs={6}>
                                        <Typography
                                          variant="body1"
                                          fontSize={15}
                                          fontWeight={400}
                                          style={{ color: 'var(--primary-color)' }}
                                        >
                                            {this.state.selectedPaymentStlProvider}
                                        </Typography>
                                      </Grid>
                                    </>
                                    }

                                    {this.state.selectedPaymentStlStatus && 
                                    <>
                                      <Grid item xs={6}>
                                        <Typography
                                          variant="body1"
                                          fontSize={15}
                                          fontWeight={400}
                                          style={{ color: 'var(--dark-color)' }}
                                        >
                                          Payment Settlement Status
                                        </Typography>
                                      </Grid>

                                      <Grid item xs={6}>
                                        <Typography
                                          variant="body1"
                                          fontSize={15}
                                          fontWeight={400}
                                          style={{ color: 'var(--primary-color)' }}
                                        >
                                          {this.getStatusChip(this.state.selectedPaymentStlStatus)}
                                        </Typography>
                                      </Grid>
                                    </>
                                    }
                                  </>
                                )}
                                {selectedStatus == "PARTIALLY_REFUNDED" ||
                                  selectedStatus == "FULLY_REFUNDED" ||
                                  selectedStatus == "REFUNDED" ||
                                  selectedStatus == "CANCELLED" ||
                                  selectedStatus == "EXPIRED" ||
                                  selectedStatus == "IN_PROCESS" ||
                                  selectedStatus == "FAILED" ||
                                  selectedStatus == OnboardConstants.paid ||
                                  allowManualPay || 
                                  referralPartners.merchantType == OnboardConstants.ReferralMerchant 
                                  || this.state.loggedInMerchantID != this.state.selectedDataMerchantId 
                                  || this.state.transactionParams.row.transactionMode == manualPay.transactionModeManual ? ( ""
                                ) : (
                                  <>
                                    <Grid item xs={6}>
                                      <Typography
                                        variant="body1"
                                        fontSize={15}
                                        fontWeight={400}
                                        style={{ color: 'var(--dark-color)' }}
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
                                        style={{ color: "var(--secondary-color)" }}
                                      >
                                        {selectedPaymentLink} &ensp;
                                      </Typography>
                                    </Grid>
                                    <PermissionGuard userPermission={PrivilegeConstants.COPY_PAYMENT_LINK}>
                                      <Grid item xs={1}>
                                        <IconButton
                                          aria-label="Duplicate"
                                          style={{ padding: "0" }}
                                          onClick={() => {
                                            this.handleCopyClick(
                                              selectedPaymentLink
                                            );
                                          }}
                                        >
                                          <FileCopyOutlinedIcon
                                            style={{ color: "var(--accent-color)" }}
                                          />
                                        </IconButton>
                                      </Grid>
                                    </PermissionGuard>
                                  </>
                                )}
                                {selectedStatus == "PARTIALLY_REFUNDED" ||
                                  selectedStatus == "FULLY_REFUNDED" ||
                                  selectedStatus == "REFUNDED" ||
                                  selectedStatus == "CANCELLED" ||
                                  selectedStatus == "EXPIRED" ||
                                  selectedStatus == "IN_PROCESS" ||
                                  selectedStatus == "FAILED" ||
                                  allowManualPay || referralPartners.merchantType == OnboardConstants.ReferralMerchant
                                  || this.state.loggedInMerchantID != this.state.selectedDataMerchantId || selectedStatus == OnboardConstants.paid
                                  ? (
                                    ""
                                  ) : (
                                    <>
                                      {qrString && qrString.trim() !== "" && (
                                        <>
                                          <Grid item xs={6}>
                                            <Typography
                                              variant="body1"
                                              fontSize={15}
                                              fontWeight={400}
                                              style={{ color: 'var(--dark-color)' }}
                                            >
                                              Payment Qr
                                            </Typography>
                                          </Grid>
                                          <Grid item xs={5}>
                                            <QRCode
                                              value={qrString}
                                              id="qr-code-canvas"
                                              size={128}

                                            />

                                            {/* <img
                                              src={qrImageUploadPath}
                                            /> */}
                                          </Grid>
                                          <Grid item xs={1}>
                                            <IconButton
                                              aria-label="Download"
                                              style={{ padding: "0" }}
                                              onClick={this.handleDownloadQrClick}

                                            >
                                              <GetAppIcon style={{ color: "var(--accent-color)" }} />
                                            </IconButton>
                                          </Grid>
                                        </>
                                      )}
                                    </>
                                  )}

                                {selectedStatus == "AWAITING_PAYMENT" ||
                                  selectedStatus == "CANCELLED" ||
                                  selectedStatus == "EXPIRED" ||
                                  selectedStatus == "IN_PROCESS" ||
                                  selectedStatus == "FAILED" ||
                                  selectedAllowPartialPayment == true ? (
                                  ""
                                ) : (
                                  <>
                                    <Grid item xs={6}>
                                      <Grid container>
                                        <Grid xs={6}>
                                          <Typography
                                            variant="body1"
                                            fontSize={15}
                                            fontWeight={400}
                                            style={{ color: 'var(--dark-color)' }}
                                          >
                                            Payment Method
                                          </Typography>
                                        </Grid>
                                        <Grid xs={6}>
                                          <CustomWidthTooltip title="This information is available via View Payment Details button below">
                                            <Info></Info>
                                          </CustomWidthTooltip>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <Typography
                                        variant="body1"
                                        fontSize={15}
                                        fontWeight={400}
                                        style={{ color: 'var(--primary-color)' }}
                                      >
                                        {selectedCardBrand !== null &&
                                          selectedCardBrand !== ""
                                          ? selectedCardBrand +
                                          " " +
                                          (selectedPaymentMode ? selectedPaymentMode : "")
                                          : (selectedPaymentMode ? selectedPaymentMode : "")}
                                      </Typography>
                                    </Grid>

                                    <Grid item xs={6}>
                                      <Typography
                                        variant="body1"
                                        fontSize={15}
                                        fontWeight={400}
                                        style={{ color: 'var(--dark-color)' }}
                                      >
                                        Paid Timestamp
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <Typography
                                        variant="body1"
                                        fontSize={15}
                                        fontWeight={400}
                                        style={{ color: 'var(--primary-color)' }}
                                      >
                                        {`${(selectedPaymentCompletionTimestamp)}`}
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
                                        style={{ color: 'var(--dark-color)' }}
                                      >
                                        Cancelled Timestamp
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <Typography
                                        variant="body1"
                                        fontSize={15}
                                        fontWeight={400}
                                        style={{ color: 'var(--primary-color)' }}
                                      >
                                        {`${(selectedCancelledTimestamp)}`}
                                      </Typography>
                                    </Grid>

                                    <Grid item xs={6}>
                                      <Typography
                                        variant="body1"
                                        fontSize={15}
                                        fontWeight={400}
                                        style={{ color: 'var(--dark-color)' }}
                                      >
                                        Cancellation Notes
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <Typography
                                        variant="body1"
                                        fontSize={15}
                                        fontWeight={400}
                                        style={{ color: 'var(--primary-color)' }}
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
                                        style={{ color: 'var(--dark-color)' }}
                                      >
                                        Expiry Date
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <Typography
                                        variant="body1"
                                        fontSize={15}
                                        fontWeight={400}
                                        style={{ color: 'var(--primary-color)' }}
                                      >
                                        {(
                                          selectedPaymentExpiryDate
                                        )}
                                      </Typography>
                                    </Grid>
                                  </>
                                )}
                                {selectedPaymentCount != null && selectedPaymentCount > 0 && (
                                  <>
                                    <Grid item xs={6}>
                                      <Typography
                                        variant="body1"
                                        fontSize={15}
                                        fontWeight={400}
                                        style={{ color: 'var(--dark-color)' }}
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
                                          selectedPaymentConfirmationId !==
                                            null &&
                                            selectedPaymentConfirmationId !== ""
                                            ? {
                                              textDecoration: "underline",
                                              cursor: "pointer",
                                              color: "var(--secondary-color)",
                                            }
                                            : {}
                                        }
                                        onClick={() => {
                                          selectedPaymentConfirmationId !==
                                            null &&
                                            selectedPaymentConfirmationId !== ""
                                            ? this.getPaymentDetails(
                                              selectedTransactionId
                                            )
                                            : "";
                                        }}
                                      >
                                        {/* {selectedPaymentConfirmationId !==
                                          null &&
                                          selectedPaymentConfirmationId !== ""
                                          ? 1
                                          : 0} */}
                                        {selectedPaymentCount}
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
                                        style={{ color: 'var(--dark-color)' }}
                                      >
                                        Refunds
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <Typography
                                        variant="body1"
                                        fontSize={15}
                                        fontWeight={400}
                                        style={
                                          selectedPaymentConfirmationId !==
                                            null &&
                                            selectedPaymentConfirmationId !== ""
                                            ? {
                                              textDecoration: "underline",
                                              cursor: "pointer",
                                              color: "var(--secondary-color)",
                                            }
                                            : {}
                                        }
                                        onClick={() => {
                                          this.handleRefundDetails(
                                            this.state.transactionParams
                                          );
                                        }}
                                      >
                                        {selectedRefundCount}
                                      </Typography>
                                    </Grid>

                                    <Grid item xs={6}>
                                      <Typography
                                        variant="body1"
                                        fontSize={15}
                                        fontWeight={400}
                                        style={{ color: 'var(--dark-color)' }}
                                      >
                                        Refunded Amount
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <Typography
                                        variant="body1"
                                        fontSize={15}
                                        fontWeight={400}
                                        style={{ color: 'var(--primary-color)' }}
                                      >
                                        {selectedRefundCount
                                          !== 0
                                          ? selectedRefundedAmount
                                          : "-"}

                                      </Typography>
                                    </Grid>

                                    {this.state.selectedRefundStlAmount && 
                                    <>
                                      <Grid item xs={6}>
                                        <Typography
                                          variant="body1"
                                          fontSize={15}
                                          fontWeight={400}
                                          style={{ color: 'var(--dark-color)' }}
                                        >
                                          Refund Settlement Amount
                                        </Typography>
                                      </Grid>

                                      <Grid item xs={6}>
                                        <Typography
                                          variant="body1"
                                          fontSize={15}
                                          fontWeight={400}
                                          style={{ color: 'var(--primary-color)' }}
                                        >
                                          {this.state.selectedRefundStlAmount}
                                        </Typography>
                                      </Grid>
                                    </>
                                    }

                                    {this.state.selectedRefundStlDate && 
                                    <>
                                      <Grid item xs={6}>
                                        <Typography
                                          variant="body1"
                                          fontSize={15}
                                          fontWeight={400}
                                          style={{ color: 'var(--dark-color)' }}
                                        >
                                          Refund Settlement Date
                                        </Typography>
                                      </Grid>

                                      <Grid item xs={6}>
                                        <Typography
                                          variant="body1"
                                          fontSize={15}
                                          fontWeight={400}
                                          style={{ color: 'var(--primary-color)' }}
                                        >
                                          {moment(this.state.selectedRefundStlDate).format(DateFormat.date)}
                                        </Typography>
                                      </Grid>
                                    </>
                                    }

                                    {this.state.selectedRefundStlProvider && 
                                    <>
                                      <Grid item xs={6}>
                                        <Typography
                                          variant="body1"
                                          fontSize={15}
                                          fontWeight={400}
                                          style={{ color: 'var(--dark-color)' }}
                                        >
                                          Refund Settlement Provider
                                        </Typography>
                                      </Grid>

                                      <Grid item xs={6}>
                                        <Typography
                                          variant="body1"
                                          fontSize={15}
                                          fontWeight={400}
                                          style={{ color: 'var(--primary-color)' }}
                                        >
                                          {this.state.selectedRefundStlProvider}
                                        </Typography>
                                      </Grid>
                                    </>
                                    }

                                    {this.state.selectedRefundStlStatus && 
                                    <>
                                      <Grid item xs={6}>
                                        <Typography
                                          variant="body1"
                                          fontSize={15}
                                          fontWeight={400}
                                          style={{ color: 'var(--dark-color)' }}
                                        >
                                          Refund Settlement Status
                                        </Typography>
                                      </Grid>

                                      <Grid item xs={6}>
                                        <Typography
                                          variant="body1"
                                          fontSize={15}
                                          fontWeight={400}
                                          style={{ color: 'var(--primary-color)' }}
                                        >
                                          {this.getStatusChip(this.state.selectedRefundStlStatus)}
                                        </Typography>
                                      </Grid>
                                    </>
                                    }
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
                                        style={{ color: 'var(--dark-color)' }}
                                      >
                                        Failed Attempts
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <Typography
                                        variant="body1"
                                        fontSize={15}
                                        fontWeight={400}
                                        style={{
                                            textDecoration: "underline",
                                            cursor: "pointer",
                                            color: "var(--secondary-color)",
                                         }}
                                        onClick={() => this.handleFailedTransactions(selectedTransactionId)}
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
                                  selectedStatus == "SETTLED" ||
                                  selectedStatus == "CANCELLED" ||
                                  selectedStatus == "FAILED" ? (
                                  ""
                                ) : (
                                  <>
                                  <PermissionGuard userPermission={PrivilegeConstants.GENERATE_INVOICE}>
                                    <Grid item xs={6}>
                                      <Typography
                                        variant="body1"
                                        fontSize={15}
                                        fontWeight={400}
                                        style={{ color: 'var(--dark-color)' }}
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
                                  </PermissionGuard>
                                  </>
                                )}

                                {selectedIsFirc && 
                                  <>
                                    <Grid item xs={6}>
                                      <Typography
                                        variant="body1"
                                        fontSize={15}
                                        fontWeight={400}
                                        style={{ color: 'var(--dark-color)' }}
                                      >
                                        FIRC
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <Chip
                                        sx={{ padding: 1 }}
                                        icon={<PictureAsPdf />}
                                        label="Click here to download FIRC Zip"
                                        clickable
                                        color="primary"
                                        onClick={() =>
                                          this.handleDownloadFircZip(
                                            selectedTransactionId
                                          )
                                        }
                                      />
                                    </Grid>
                                  </>
                                }

                                <Grid
                                  container
                                  rowGap={4}
                                  columns={{ xs: 4, sm: 8, md: 12 }}
                                  mt={5}
                                >
                                  <Grid item xs={4}>
                                    <PermissionGuard userPermission={PrivilegeConstants.VIEW_PAYMENT_DETAILS} fallback={
                                      <Button
                                        variant="contained"
                                        className="paymentDetailsActionButtons"
                                        disabled={true}
                                        style={{ color: 'var(--primary-color)' }}
                                        onClick={() => {
                                          this.getPaymentDetails(
                                            selectedTransactionId
                                          );
                                        }}
                                      >
                                        View Payment Details
                                      </Button>
                                  }>
                                    <Button
                                      variant="contained"
                                      className="paymentDetailsActionButtons"
                                      disabled={
                                        transactionPaymenButtonRules.disableViewPaymentDetails ||
                                        selectedPaymentCount == null || selectedPaymentCount == 0
                                      }
                                      style={{ color: 'var(--primary-color)' }}
                                      onClick={() => {
                                        this.getPaymentDetails(
                                          selectedTransactionId
                                        );
                                      }}
                                    >
                                      View Payment Details
                                    </Button>
                                    </PermissionGuard>
                                  </Grid>
                                  {(!allowManualPay) && (
                                    <Grid item xs={4}>
                                      <PermissionGuard userPermission={PrivilegeConstants.VIEW_FAILED_DETAILS} fallback={
                                        <Button
                                          variant="contained"
                                          className="paymentDetailsActionButtons"
                                          disabled={true}
                                          // onClick={this.handleFailedTransactions}
                                          onClick={() => this.handleFailedTransactions(selectedTransactionId)}
                                        >
                                          View Failed Attempts
                                        </Button>
                                      }>
                                        <Button
                                          variant="contained"
                                          className="paymentDetailsActionButtons"
                                          disabled={
                                            // NOTE : Disable only if the failed attempts are not present
                                            // transactionPaymenButtonRules.disableViewFailedAttempts ||
                                            selectedFailedAttempts == null || selectedFailedAttempts == 0
                                          }
                                          // onClick={this.handleFailedTransactions}
                                          onClick={() => this.handleFailedTransactions(selectedTransactionId)}
                                        >
                                          View Failed Attempts
                                        </Button>
                                      </PermissionGuard>
                                    </Grid>
                                  )}
                                  {(!allowManualPay) && (
                                    <Grid item xs={4}>
                                      <PermissionGuard userPermission={PrivilegeConstants.VIEW_REFUND_DETAILS} fallback={
                                        <Button
                                          variant="contained"
                                          className="paymentDetailsActionButtons"
                                          disabled={true}
                                          onClick={() => {
                                            this.handleRefundDetails(
                                              this.state.transactionParams
                                            );
                                          }}
                                        >
                                          View Refund Details
                                        </Button>
                                      }>
                                        <Button
                                          variant="contained"
                                          className="paymentDetailsActionButtons"
                                          disabled={
                                            transactionPaymenButtonRules.disableViewRefundDetails ||
                                            selectedRefundCount == null || selectedRefundCount == 0
                                          }
                                          onClick={() => {
                                            this.handleRefundDetails(
                                              this.state.transactionParams
                                            );
                                          }}
                                        >
                                          View Refund Details
                                        </Button>
                                      </PermissionGuard>
                                    </Grid>
                                  )}

                                  <Grid item xs={4}>
                                    {/**
                                     * Now I am temporarily disabled
                                     * If add any condition use the condition "disabled={transactionPaymenButtonRules.disableDuplicate}"
                                     */}
                                    <PermissionGuard userPermission={PrivilegeConstants.DUPLICATE_PAYMENT_REQUEST} fallback={
                                        <Button
                                          variant="contained"
                                          className="paymentDetailsActionButtons"
                                          onClick={() => { this.handleDuplicatePayment() }}
                                          disabled={true}
                                        >
                                          Duplicate
                                        </Button>
                                    }>
                                      <Button
                                        variant="contained"
                                        className="paymentDetailsActionButtons"
                                        onClick={() => { this.handleDuplicatePayment() }}
                                        disabled={referralPartners.merchantType == OnboardConstants.ReferralMerchant || this.state.loggedInMerchantID != this.state.selectedDataMerchantId || !this.state.payViaScreen}
                                      >
                                        Duplicate
                                      </Button>
                                    </PermissionGuard>
                                  </Grid>
                                  {(!allowManualPay) && (
                                    <Grid item xs={4}>
                                      <PermissionGuard userPermission={PrivilegeConstants.REFUND_REQUEST} fallback={
                                        <Button
                                          variant="contained"
                                          className="paymentDetailsActionButtons"
                                          disabled={true}
                                          onClick={(e) => {
                                            this.selectedItem = transactionDetails;
                                            this.refundClick(e, transactionDetails);
                                          }}
                                        >
                                          Issue Refund
                                        </Button>
                                      }>
                                        <Button
                                          variant="contained"
                                          className="paymentDetailsActionButtons"
                                          disabled={
                                            transactionDetails.maxRefundAmount == 0 ? true : transactionPaymenButtonRules.disableIssueRefund || referralPartners.merchantType == OnboardConstants.ReferralMerchant || this.state.loggedInMerchantID != this.state.selectedDataMerchantId || this.state.manualPaymentModes.includes(transactionDetails.paymentMode)
                                          }
                                          onClick={(e) => {
                                            this.selectedItem = transactionDetails;
                                            this.refundClick(e, transactionDetails);
                                          }}
                                        >
                                          Issue Refund
                                        </Button>
                                      </PermissionGuard>
                                    </Grid>
                                  )}
                                  <Grid item xs={4}>
                                    <PermissionGuard userPermission={PrivilegeConstants.CANCEL_PAYMENT} fallback={
                                        <Button
                                          variant="contained"
                                          className="paymentDetailsActionButtons"
                                          disabled={
                                            true
                                          }
                                          onClick={(e) => {
                                            this.refundClick(e, transactionDetails);
                                          }}
                                        >
                                          Cancel Transaction
                                        </Button>
                                      }>
                                    <Button
                                      variant="contained"
                                      className="paymentDetailsActionButtons"
                                      disabled={
                                        transactionPaymenButtonRules.disableCancelTransaction || referralPartners.merchantType == OnboardConstants.ReferralMerchant || this.state.loggedInMerchantID != this.state.selectedDataMerchantId
                                      }
                                      onClick={(e) => {
                                        this.refundClick(e, transactionDetails);
                                      }}
                                    >
                                      Cancel Transaction
                                    </Button>
                                    </PermissionGuard>
                                  </Grid>
                                  {allowManualPay && (
                                    <Grid item xs={4}>
                                      <Button
                                        variant="contained"
                                        className="paymentDetailsActionButtons"
                                        disabled={
                                          transactionPaymenButtonRules.disableMarkAdPaid || referralPartners.merchantType == OnboardConstants.ReferralMerchant || this.state.loggedInMerchantID != this.state.selectedDataMerchantId
                                        }
                                        onClick={(e) => {
                                          this.handleManualPay(transactionDetails.transactionId);
                                        }}
                                      >
                                        Mark as paid
                                      </Button>
                                    </Grid>
                                  )}
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
                            onClick={() =>
                              this.setState({ showReminderModal: false })
                            }
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
                            style={{
                              backgroundColor: "var(--secondary-color)",
                              color: 'white',
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
                      {showRefundConfirmationModal &&
                        !this.state.isDeviceMobile && (
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
                                      style={{ color: "var(--secondary-color)" }}
                                    >
                                      {this.state.refundReview ? "Review Refund Details" :"Issue Refund for"}
                                    </Typography>
                                  </>
                                </Grid>
                                <Grid
                                  item
                                  xs={2}
                                  style={{
                                    display: "flex",
                                    justifyContent: "end",
                                  }}
                                >
                                  <IconButton
                                    size="medium"
                                    onClick={this.cancelRefund}
                                    style={{ color: 'var(--dark-color)' }}
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
                                    style={{
                                      color: "var(--dark-color)",
                                      display: "inline",
                                    }}
                                  >
                                    BenePay Transaction Id:&nbsp;
                                  </Typography>
                                  <Typography
                                    gap={2}
                                    variant="body1"
                                    fontSize={17}
                                    style={{
                                      color: "var(--accent-color)",
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
                                        style={{ color: "var(--accent-color)" }}
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

                            {this.state.refundReview ? 
                              <>
                                {/**
                                 * Refund Review screen
                                 */}
                                <Container maxWidth="sm">
                                  <Grid container rowSpacing={3} marginTop={2}>
                                    <Grid item xs={6}>
                                      <Typography variant="body1" fontSize={15} fontWeight={400} style={{ color: 'var(--dark-color)' }}>
                                        Payment Amount
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <Typography fontSize={15} sx={{ display: 'inline', mr: 1 }} style={{ color: 'var(--primary-color)' }}>
                                        {this.state.refundCcy}{" "}{this.selectedItem ? this.selectedItem.paymentAmount : ''}
                                      </Typography>
                                    </Grid>

                                    <Grid item xs={6}>
                                      <Typography variant="body1" fontSize={15} fontWeight={400} style={{ color: 'var(--dark-color)' }}>
                                        Pending Amount
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <Typography fontSize={15} sx={{ display: 'inline', mr: 1 }} style={{ color: 'var(--primary-color)' }}>
                                        {this.state.refundCcy}{" "}{this.selectedItem ? this.selectedItem.maxRefundAmount : ''}
                                      </Typography>
                                    </Grid>

                                    <Grid item xs={6}>
                                      <Typography variant="body1" fontSize={15} fontWeight={400} style={{ color: 'var(--dark-color)' }}>
                                        Refund Type
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <Typography fontSize={15} sx={{ display: 'inline', mr: 1 }} style={{ color: 'var(--primary-color)' }}>
                                        {this.state.selectedOption}
                                      </Typography>
                                    </Grid>

                                    <Grid item xs={6}>
                                      <Typography variant="body1" fontSize={15} fontWeight={400} style={{ color: 'var(--dark-color)' }}>
                                        Refund Amount
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <Typography fontSize={15} sx={{ display: 'inline', mr: 1 }} style={{ color: 'var(--primary-color)' }}>
                                        {this.state.refundCcy ? this.state.refundCcy : ''} {" "} {this.getFixedDecimalAmount(this.state.refundCcy, this.state.refundAmount)}
                                      </Typography>
                                    </Grid>

                                    <Grid item xs={6}>
                                      <Typography variant="body1" fontSize={15} fontWeight={400} style={{ color: 'var(--dark-color)' }}>
                                        Reason For Refund
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <Typography fontSize={15} sx={{ display: 'inline', mr: 1 }} style={{ color: 'var(--primary-color)' }}>
                                        {this.state.refundReason}
                                      </Typography>
                                    </Grid>

                                    <Grid item xs={6} mt={3}>
                                        <Button
                                          variant="contained"
                                          style={{
                                            backgroundColor: "#346799",
                                            width: "70%",
                                          }}
                                          onClick={this.confirmRefund}
                                        >
                                          Confirm
                                        </Button>
                                      </Grid>
                                      <Grid item xs={6} mt={3}>
                                        <Button
                                          variant="contained"
                                          style={{
                                            backgroundColor: "var(--light-color)",
                                            color: 'var(--primary-color)',
                                            width: "70%",
                                          }}
                                          onClick={this.handleRefundReview}
                                          disabled={refundLoading}
                                        >
                                          Back
                                        </Button>
                                      </Grid>
                                  </Grid>
                                </Container>
                              </>
                            :
                              <>
                                <Container maxWidth="sm">
                                  <Grid container rowSpacing={3} marginTop={2}>

                                    <Grid item xs={6}>
                                      <Typography variant="body1" fontSize={15} fontWeight={400} style={{ color: 'var(--dark-color)' }}>
                                        Payment Amount
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <Typography fontSize={15} sx={{ display: 'inline', mr: 1 }} style={{ color: 'var(--primary-color)' }}>
                                        {this.state.refundCcy}{" "}{this.selectedItem.paymentAmount}
                                      </Typography>
                                    </Grid>

                                    <Grid item xs={6}>
                                      <Typography variant="body1" fontSize={15} fontWeight={400} style={{ color: 'var(--dark-color)' }}>
                                        Pending Amount
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <Typography fontSize={15} sx={{ display: 'inline', mr: 1 }} style={{ color: 'var(--primary-color)' }}>
                                        {this.state.refundCcy}{" "}{this.selectedItem.maxRefundAmount}
                                      </Typography>
                                    </Grid>

                                    <Grid item xs={12}>
                                      <Typography style={{ color: 'var(--dark-color)' }}>Select Refund Type</Typography>

                                      <FormControl>
                                        <Select
                                          aria-label="Select an Option"
                                          value={this.state.selectedOption}
                                          onChange={this.handleOnChange}
                                          style={{ height: "35px", width: "250px" }}
                                        >
                                          <MenuItem value="Full Refund" style={{ color: 'var(--primary-color)' }} disabled={this.selectedItem.maxRefundAmount != this.selectedItem.paymentAmount ? true : false}>
                                            Full Refund
                                          </MenuItem>
                                          <MenuItem value="Partial Refund" style={{ color: 'var(--primary-color)' }}>
                                            Partial Refund
                                          </MenuItem>
                                        </Select>
                                      </FormControl>
                                    </Grid>

                                    <Grid item xs={12}>
                                      <Typography style={{ color: 'var(--dark-color)' }}>Refund Amount<span style={{color:"red", paddingLeft:'1%'}}>*</span></Typography>
                                      
                                      <InputGroup>
                                        <InputGroup.Text>
                                          {this.state.refundCcy}
                                        </InputGroup.Text>
                                        <bForm.Control
                                          disabled={
                                            this.state.selectedOption ==
                                            "Full Refund"
                                          }
                                          style={{ maxWidth: "198px", color: 'var(--primary-color)' }}
                                          onChange={this.handleRefundAmountChange}
                                          value={this.state.refundAmount}
                                        />
                                      </InputGroup>
                                      <Typography style={{ color: 'red', marginTop:'1%' }}>{this.state.refundAmountValidationErrMsg}</Typography>
                                    </Grid>

                                    <Grid item xs={12}>
                                      <Typography style={{ color: 'var(--dark-color)' }}>Reason For Refund<span style={{color:"red", paddingLeft:'1%'}}>*</span></Typography>

                                      <textarea
                                        rows="3"
                                        style={{
                                          width: "250px",
                                          fontSize: "var(--font-medium)",
                                          color: 'var(--primary-color)',
                                          padding: '4px'
                                        }}
                                        className="transactionCancellation"
                                        placeholder={"Enter reason for refund"}
                                        onChange={this.handleRefundReason}
                                        value={this.state.refundReason}
                                      ></textarea>
                                    </Grid>

                                    <Grid item xs={6} mt={3}>
                                      <Button
                                        variant="contained"
                                        style={{
                                          backgroundColor: "#346799",
                                          width: "70%",
                                        }}
                                        onClick={this.handleRefundReview}
                                          disabled={!this.state.refundAmount || !this.state.refundReason || refundLoading || this.state.disableRefundConfirmBtn}
                                      >
                                        Confirm
                                      </Button>
                                    </Grid>
                                    <Grid item xs={6} mt={3}>
                                      <Button
                                        variant="contained"
                                        style={{
                                          backgroundColor: "var(--light-color)",
                                          color: 'var(--primary-color)',
                                          width: "70%",
                                        }}
                                        onClick={this.cancelRefund}
                                        disabled={refundLoading}
                                      >
                                        Cancel
                                      </Button>
                                    </Grid>
                                  </Grid>
                                </Container>
                              </>
                            }

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
                                  style={{ color: "var(--secondary-color)" }}
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
                                  style={{ color: 'var(--dark-color)' }}
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
                                  style={{
                                    color: "var(--dark-color)",
                                    display: "inline",
                                  }}
                                >
                                  BenePay Transaction Id:&nbsp;
                                </Typography>
                                <Typography
                                  gap={2}
                                  variant="body1"
                                  fontSize={17}
                                  style={{
                                    color: "var(--accent-color)",
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
                                      style={{ color: "var(--accent-color)" }}
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
                                <Typography fontSize={15} style={{ color: 'var(--dark-color)' }}>Refund Id</Typography>
                              </Grid>
                              <Grid item xs={7}>
                                <Typography fontSize={15} style={{ color: 'var(--primary-color)' }}>
                                  {refundResponse.transactionId}
                                </Typography>
                              </Grid>

                              <Grid item xs={5} style={{ color: 'var(--dark-color)' }}>
                                <Typography>Refund Amount</Typography>
                              </Grid>
                              <Grid item xs={7} style={{ color: 'var(--primary-color)' }}>
                                <Typography>
                                  {refundResponse.pgData.refundCurrency}{" "}
                                  {refundResponse.refundedAmount}
                                </Typography>
                              </Grid>

                              <Grid item xs={5} style={{ color: 'var(--dark-color)' }}>
                                <Typography>Refunded to</Typography>
                              </Grid>
                              <Grid item xs={7} style={{ color: 'var(--primary-color)' }}>
                                <Typography>
                                  {this.selectedItem.debtorName}
                                </Typography>
                                <Typography>
                                  {this.selectedItem.debtorEmailId}
                                </Typography>
                                <Typography>
                                  {this.selectedItem.cardBrand !== null
                                    ? this.selectedItem.cardBrand +
                                    " " +
                                    (this.selectedItem.paymentMode ? this.selectedItem.paymentMode : " ")
                                    : (this.state.item?.refundedToInstrument ? this.state.item.refundedToInstrument : " ")}
                                </Typography>
                              </Grid>

                              <Grid item xs={5} style={{ color: 'var(--dark-color)' }}>
                                <Typography>Refund Type</Typography>
                              </Grid>
                              <Grid item xs={7} style={{ color: 'var(--primary-color)' }}>
                                <Typography>
                                  {refundResponse.refundType === "F"
                                    ? "Full"
                                    : refundResponse.refundType === "P"
                                      ? "Partially"
                                      : ""}
                                </Typography>
                              </Grid>

                              <Grid item xs={5} style={{ color: 'var(--dark-color)' }}>
                                <Typography>Refund Timestamp</Typography>
                              </Grid>
                              <Grid item xs={7} style={{ color: 'var(--primary-color)' }}>
                                <Typography>
                                      {(refundResponse.refundAttemptTimestamp)}
                                </Typography>
                              </Grid>

                              <Grid item xs={5} style={{ color: 'var(--dark-color)' }}>
                                <Typography>Refund Status</Typography>
                              </Grid>
                              <Grid item xs={7}>
                                <Typography>
                                  {this.getStatusChip(refundResponse.status)}
                                </Typography>
                              </Grid>

                              <Grid item xs={5} style={{ color: 'var(--dark-color)' }}>
                                <Typography>Refund Notes</Typography>
                              </Grid>
                              <Grid item xs={7} style={{ color: 'var(--primary-color)' }}>
                                <Typography>
                                  {refundResponse.refundReason}
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
                        <ConfirmDialog
                          title="Warning"
                          open={true}
                          setOpen={true}
                        >
                          <Container maxWidth="sm">
                            <Grid container rowSpacing={3}>
                              <Grid item xs={11}>
                                <Typography
                                  variant="body1"
                                  fontSize={20}
                                  fontWeight={600}
                                  style={{ color: "var(--secondary-color)" }}
                                >
                                  <HighlightOffIcon
                                    color="error"
                                    fontSize="large"
                                  />
                                  &ensp;&ensp;Refund Failed For
                                </Typography>
                              </Grid>
                              <Grid item xs={1}>
                                <IconButton
                                  aria-label="close"
                                  onClick={this.handlePaymentDetailsClose}
                                  style={{ color: 'var(--dark-color)' }}
                                >
                                  <CloseIcon />
                                </IconButton>
                              </Grid>

                              <Grid item xs={5}>
                                <Typography fontSize={15} style={{ color: 'var(--dark-color)' }}>
                                  BenePay Transaction Id
                                </Typography>
                              </Grid>
                              <Grid item xs={7}>
                                <Typography
                                  fontSize={15}
                                  sx={{
                                    color: "var(--accent-color)",
                                    display: "inline",
                                    mr: 1,
                                  }}
                                >
                                  {this.selectedItem.transactionId}
                                </Typography>
                                <IconButton
                                  style={{ padding: "0px" }}
                                  onClick={() =>
                                    this.handleCopyClick(
                                      this.selectedItem.transactionId
                                    )
                                  }
                                >
                                  <FileCopyOutlinedIcon
                                    style={{ color: "var(--accent-color)" }}
                                  />
                                </IconButton>
                              </Grid>

                              <Grid item xs={5}>
                                <Typography fontSize={15} style={{ color: 'var(--dark-color)' }}>
                                  Failure Reason
                                </Typography>
                              </Grid>
                              <Grid item xs={7} style={{ color: 'var(--primary-color)' }}>
                                <Typography
                                  fontSize={15}
                                  sx={{ display: "inline", mr: 1 }}
                                >
                                  {refundResponse.errors != null && refundResponse.errors.length > 0 ? refundResponse.errors[0].errorDescription : ''}
                                </Typography>
                              </Grid>

                              {/* <Grid item xs={6}>
                                <Typography fontSize={15}>Trace Id</Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography fontSize={15}>{refundResponse.traceId}</Typography>
                              </Grid>
                      
                              <Grid item xs={6}>
                                <Typography fontSize={15}>Refund Amount</Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography fontSize={15}>{refundResponse.pgData.refundCurrency}&nbsp;&nbsp;&nbsp;{refundResponse.pgData.refundAmount}</Typography>
                              </Grid>
                      
                              <Grid item xs={6}>
                                <Typography fontSize={15}>Payer Name</Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography fontSize={15}>{this.selectedItem.debtorName}</Typography>
                              </Grid>
                      
                              <Grid item xs={6}>
                                <Typography fontSize={15}>Payer Email</Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography fontSize={15}>{this.selectedItem.debtorEmailId}</Typography>
                              </Grid>
                      
                              <Grid item xs={6}>
                                <Typography fontSize={15}>Payment Method</Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography fontSize={15}>{this.selectedItem.cardBrand !== null ? this.selectedItem.cardBrand + " " + this.selectedItem.paymentMode : this.selectedItem.paymentMode}</Typography>
                              </Grid>
                      
                              <Grid item xs={6}>
                                <Typography fontSize={15}>Refund Type</Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography fontSize={15}>{this.selectedItem.refundType === "F" ? "Full" : this.selectedItem.refundType === "P" ? "Partially" : "Error"}</Typography>
                              </Grid>
                      
                              <Grid item xs={6}>
                                <Typography fontSize={15}>Refund Attempt Timestamp</Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography fontSize={15}>{moment(refundResponse.refundAttemptTimestamp).format(DateFormat.dateTime)}</Typography>
                              </Grid> */}

                              <Grid item xs={12}>
                                <Typography color={"red"}>
                                  We seem to be experiencing some technical
                                  issues at the moment. Please retry after
                                  sometime. if the issue persists, please
                                  contact BenePay.
                                </Typography>
                              </Grid>
                            </Grid>
                          </Container>
                        </ConfirmDialog>
                      )}
                    </TableContainer>
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
              )}
            </div>
          </PermissionGuard>
          <PermissionGuard userPermission={PrivilegeConstants.REFUND_SEARCH}> 
            <div
              className="tab-pane fade"
              id="pills-refunds"
              role="tabpanel"
              aria-labelledby="pills-refunds-tab"
              style={{ width: "100%" }}
            >
              {/* REFUND SEARCHES */}
              { this.state.refundBtnClick && <RefundScreen
                setLoading={this.setLoading}
                currencyList={this.state.currencyList}
                updateDecimalInRule={this.updateDecimalInRule}
                updateFormField={this.updateFormField}
                refundFormFields={this.state.formFields}
                autoFixDecimal={this.autoFixDecimal}
                handleRefundMinAmount={this.handleRefundMinAmount}
                handleRefundMaxAmount={this.handleRefundMaxAmount}
                handlePaymentMinAmount={this.handlePaymentMinAmount}
                handlePaymentMaxAmount={this.handlePaymentMaxAmount}
                prepareField={this.prepareField}
                rule={this.rule}
                refundBtnClick={this.state.refundBtnClick}
              />
              }
            </div>
          </PermissionGuard>
          </div>
        </section>

        {false && (
          <Box mt={1}>
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
                      {/**
                       * Start of @author ragavan
                       * Modification of transaction search screen
                       */}

                      <Grid
                        container
                        className="mt-4"
                        columnGap={3}
                        rowGap={2}
                        columns={{ xs: 4, md: 12 }}
                      >
                        <Grid item xs={3.2}>
                          <label
                            className="py-1"
                            style={{ fontWeight: "var(--font-weight-medium)" }}
                          >
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
                          <label
                            className="py-1"
                            style={{ fontWeight: "var(--font-weight-medium)" }}
                          >
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
                          <label
                            className="py-1"
                            style={{ fontWeight: "var(--font-weight-medium)" }}
                          >
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
                        {TempStorage.loginUserRole === USER_TYPE.ADMIN_USER && (
                          <Grid item xs={12} md={2} xl={2}>
                            <label
                              htmlFor="collectionReference"
                              className="py-1"
                              style={{
                                fontWeight: "var(--font-weight-medium)",
                              }}
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Box>
          </Box>
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
                style={{
                  backgroundColor: "var(--secondary-color)",
                  color: 'white',
                }}
              >
                Confirm
              </ButtonPrimary>
              <ButtonPrimary
                onClick={this.cancelSettlement}
                style={{ marginLeft: "5px", color: 'var(--primary-color)', backgroundColor: 'car(--light-color)' }}
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
                          className={`${this.state.coltype === "receivedDate" &&
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
                          className={`${this.state.coltype === "errorCode" &&
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
                          {(item?.receivedDate)}{" "}
                          <br />{" "}
                          {(item?.receivedDate)}
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

      {/* ----------------------------------------------------------------------------------- */}

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
                    min={1}
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
                            {(item?.receiptTimestamp)}{" "}
                            {(item?.receiptTimestamp)}
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
                    onBlur={() => this.setState({refundAmount: this.getFixedDecimalAmount(this.state.refundCcy, this.state.refundAmount)})}
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
                <h5 className="mb-4" style={{ color: 'var(--secondary-color)' }}>Cancellation Request</h5>

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
                  style={{ fontSize: "var(--font-medium)" }}
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
                  sx={{ color: "var(--secondary-color)", fontWeight: "bold" }}
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
                <Typography fontSize={15} style={{ color: 'var(--dark-color)' }}>BenePay Transaction Id</Typography>
              </Grid>
              <Grid item xs={7}>
                <Typography
                  fontSize={15}
                  sx={{ color: "var(--accent-color)", display: "inline", mr: 1 }}
                >
                  {selectedTransactionId}&ensp;
                </Typography>
                <IconButton
                  style={{ padding: "0px" }}
                  onClick={() =>
                    this.handleCopyClick(selectedTransactionId)
                  }
                >
                  <FileCopyOutlinedIcon style={{ color: "var(--accent-color)" }} />
                </IconButton>
              </Grid>
              {this.state.paymentDetails.map((item, index) => (
                <>
                  <Grid item xs={12} mt={2}>
                    <Typography
                      fontSize={15}
                      sx={{ color: "var(--primary-color)", fontWeight: "bold" }}
                    >
                      Payment {index + 1} of {this.state.paymentDetails.length}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography fontSize={15} style={{ color: 'var(--dark-color)' }}>Payment Id</Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <Typography fontSize={15} noWra style={{ color: 'var(--primary-color)' }} p>
                      {item.paymentId}
                    </Typography>
                  </Grid>

                  {/* <Grid item xs={1}>
                    <IconButton
                      style={{ padding: "0px" }}
                      onClick={() =>
                        this.handleCopyClick(item.requestorTransactionId)
                      }
                    >
                      <FileCopyOutlinedIcon style={{ color: "rgb(106 158 222)" }} />
                    </IconButton>
                  </Grid> */}

                  <Grid item xs={6}>
                    <Typography fontSize={15} style={{ color: 'var(--dark-color)' }}>Payment Amount</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography fontSize={15} style={{ color: 'var(--primary-color)' }}>
                      {item.paymentCurrency +
                        " " +
                        item.paymentAmount}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography fontSize={15} style={{ color: 'var(--dark-color)' }}>Payment Status</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    {this.getStatusChip("SUCCESS")}
                  </Grid>

                  <Grid item xs={6}>
                    <Typography fontSize={15} style={{ color: 'var(--dark-color)' }}>Payment Method</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography fontSize={15} style={{ color: 'var(--primary-color)' }}>
                      {item.cardBrand && item.cardBrand !== null
                        ? item.cardBrand + " " + (item.paymentMode ? item.paymentMode : " ") : (item.paymentMode ? item.paymentMode : " ")
                      }
                    </Typography>
                  </Grid>

                  {!allowManualPay && item.paymentConfirmationId &&
                    <>
                      <Grid item xs={6}>
                        <Typography fontSize={15} style={{ color: 'var(--dark-color)' }}>Payment Confirmation Id</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography fontSize={15} style={{ color: 'var(--primary-color)' }}>
                          {item.paymentConfirmationId}
                        </Typography>
                      </Grid>
                    </>
                  }

                  <Grid item xs={6}>
                    <Typography fontSize={15} style={{ color: 'var(--dark-color)' }}>Payment Timestamp</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography fontSize={15} style={{ color: 'var(--primary-color)' }}>
                       {`${(item.paymentCompletionTimestamp)}`}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography fontSize={15} style={{ color: 'var(--dark-color)' }}>Payer</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography fontSize={15} style={{ color: 'var(--primary-color)' }}>
                      {item.debtorName}
                    </Typography>
                    <Typography fontSize={15} style={{ color: 'var(--primary-color)' }}>
                      {item.debtorEmailId}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography fontSize={15} style={{ color: 'var(--dark-color)' }}>Collection Reference</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography fontSize={15} style={{ color: 'var(--primary-color)' }}>
                      {item.collectionReferenceNumber}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography fontSize={15} style={{ color: 'var(--dark-color)' }}>Description</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography fontSize={15} style={{ color: 'var(--primary-color)' }}>
                      {item.reasonForCollection}
                    </Typography>
                  </Grid>

                  {/* Settlement Data */}
                  {item.paymentSettlementAmount ?
                    <>
                      <Grid item xs={6}>
                        <Typography fontSize={15} style={{ color: 'var(--dark-color)' }}>Settlement Amount</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography fontSize={15} style={{ color: 'var(--primary-color)' }}>
                          {item.paymentSettlementAmount}
                        </Typography>
                      </Grid>
                    </>
                    : <></>}

                  {item.paymentSettlementDate ?
                    <>
                      <Grid item xs={6}>
                        <Typography fontSize={15} style={{ color: 'var(--dark-color)' }}>Settlement Date</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography fontSize={15} style={{ color: 'var(--primary-color)' }}>
                          {item.paymentSettlementDate}
                        </Typography>
                      </Grid>
                    </>
                    : <></>}

                  {item.paymentSettlementProvider ?
                    <>
                      <Grid item xs={6}>
                        <Typography fontSize={15} style={{ color: 'var(--dark-color)' }}>Settlement Provider</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography fontSize={15} style={{ color: 'var(--primary-color)' }}>
                          {item.paymentSettlementProvider}
                        </Typography>
                      </Grid>
                    </>
                    : <></>}

                  {item.paymentSettlementStatus ?
                    <>
                      <Grid item xs={6}>
                        <Typography fontSize={15} style={{ color: 'var(--dark-color)' }}>Settlement Status</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        {this.getStatusChip(item.paymentSettlementStatus)}
                      </Grid>
                    </>
                    : <></>} 
                      
                  {manualPay.paymentModes.includes(item.paymentMode) && !_.isEmpty(item.manualPaymentStlAmountAndCcy) && item.manualPaymentStlAmountAndCcy != null ?
                    <>
                      <Grid item xs={6}>
                        <Typography fontSize={15} style={{ color: 'var(--dark-color)' }}>Settlement Amount</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography fontSize={15} style={{ color: 'var(--primary-color)' }}>
                          {item.manualPaymentStlAmountAndCcy}
                        </Typography>
                      </Grid>
                    </>
                  :<></>
                  }

                  {manualPay.paymentModes.includes(item.paymentMode) && !_.isEmpty(item.manualPaymentStlNotes) && item.manualPaymentStlNotes != null ? 
                  <>
                    <Grid item xs={6}>
                      <Typography fontSize={15} style={{ color: 'var(--dark-color)' }}>Notes</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography fontSize={15} style={{ color: 'var(--primary-color)' }}>
                        {item.manualPaymentStlNotes}
                      </Typography>
                    </Grid>
                  </>
                  :<></>}

                  {item && item.fircFileId && <>
                    <Grid item xs={6}>
                    <Typography fontSize={15} style={{ color: 'var(--dark-color)' }}>FIRC</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Chip
                      sx={{ padding: 1 }}
                      icon={<PictureAsPdf />}
                      label="Click here to download FIRC"
                      clickable
                      color="primary"
                      onClick={() =>
                        this.handleDownloadFirc(
                          item.fircFileId
                        )
                      }
                    />
                  </Grid></>}

                  {/* <Grid item xs={6}>
                    <Typography fontSize={15}>Charges/Taxes</Typography>
                  </Grid> */}
                  {/* <Grid item xs={6}>
                    <Typography fontSize={15}>
                      {item.paymentCurrency +
                        " " +
                        (item.charges != null
                          ? item.charges
                          : "0")}
                    </Typography>
                  </Grid> */}
                </>
              ))}
              {/* {selectedStatus !== "SETTLED" && (
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    className="paymentDetailsActionButtons"
                    disabled={
                      transactionDetails.maxRefundAmount == 0 ? transactionPaymenButtonRules.disableIssueRefund : false
                    }
                    style={
                      transactionPaymenButtonRules.disableIssueRefund
                        ? { backgroundColor: "#E0E0E0" }
                        : {}
                    }
                    onClick={(e) => {
                      this.selectedItem = transactionDetails;
                      this.refundClick(e, transactionDetails);
                    }}
                  >
                    Issue refund
                  </Button>
                </Grid>
              )} */}
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
                    style={{ color: "var(--secondary-color)" }}
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
                  style={{ color: 'var(--dark-color)' }}
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
                  style={{ color: "var(--dark-color)", display: "inline" }}
                >
                  BenePay Transaction Id:&nbsp;
                </Typography>
                <Typography
                  gap={2}
                  variant="body1"
                  fontSize={17}
                  style={{ color: "var(--accent-color)", display: "inline" }}
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
                      style={{ color: "var(--accent-color)" }}
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
                      sx={{ color: "var(--primary-color)", fontWeight: "bold" }}
                    >
                      Refund Details {index + 1} of {this.state.refundDetails.length}
                    </Typography>
                  </Grid>

                  <Grid item xs={4} style={{ color: 'var(--dark-color)' }}>
                    <Typography fontSize={15}>Refund Id</Typography>
                  </Grid>
                  <Grid item xs={8} style={{ color: 'var(--primary-color)' }}>
                    <Typography fontSize={15}>
                      {item.refundTransactionId}&ensp;
                      {/* <IconButton
                        aria-label="Duplicate"
                        onClick={() => {
                          this.handleCopyClick(item.refundTransactionId);
                        }}
                      >
                        <FileCopyOutlinedIcon
                          style={{ color: "rgb(106 158 222)" }}
                        />
                      </IconButton> */}
                    </Typography>
                  </Grid>

                  <Grid item xs={4} style={{ color: 'var(--dark-color)' }}>
                    <Typography fontSize={15} >Refund Amount</Typography>
                  </Grid>
                  <Grid item xs={8} style={{ color: 'var(--primary-color)' }}>
                    <Typography fontSize={15}>
                      {item.refundCcy}{" "}
                      {item.refundedAmount || item.finalPaymentAmount}
                    </Typography>
                  </Grid>

                  <Grid item xs={4} style={{ color: 'var(--dark-color)' }}>
                    <Typography fontSize={15}>Refunded To</Typography>
                  </Grid>
                  <Grid item xs={8} style={{ color: 'var(--primary-color)' }}>
                    <Typography fontSize={15}>{item.payerName}</Typography>
                    <Typography fontSize={15}>{item.payerEmail}</Typography>
                    <Typography fontSize={15}>
                      {item.cardBrand !== null
                        ? item.cardBrand + " " + (item.refundedToInstrument ? item.refundedToInstrument : " ")
                        : (item.refundedToInstrument ? item.refundedToInstrument : " ")}
                    </Typography>
                  </Grid>

                  <Grid item xs={4} style={{ color: 'var(--dark-color)' }}>
                    <Typography fontSize={15}>Refund Type</Typography>
                  </Grid>
                  <Grid item xs={8} style={{ color: 'var(--primary-color)' }}>
                    <Typography fontSize={15}>
                      {item.refundType == "F"
                        ? "Full"
                        : item.refundType == "P"
                          ? "Partial"
                          : "Error"}
                    </Typography>
                  </Grid>

                  <Grid item xs={4} style={{ color: 'var(--dark-color)' }}>
                    <Typography fontSize={15}>Refund Status</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography fontSize={15}>
                      {this.getStatusChip(item.refundStatus)}
                    </Typography>
                  </Grid>

                  <Grid item xs={4} style={{ color: 'var(--dark-color)' }}>
                    <Typography fontSize={15}>Refund Timestamp</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography fontSize={15} style={{ color: 'var(--primary-color)' }}>
                      {`${(item.refundedOn)}`}

                    </Typography>
                  </Grid>

                  <Grid item xs={4} style={{ color: 'var(--dark-color)' }}>
                    <Typography fontSize={15}>Refund Notes</Typography>
                  </Grid>
                  <Grid item xs={8} style={{ color: 'var(--primary-color)' }}>
                    <Typography fontSize={15}>
                      {item.refundReason}
                    </Typography>
                  </Grid>

                  {/* Settlement Data */}
                  {item.refundSettlementAmount ?
                    <>
                      <Grid item xs={4}>
                        <Typography fontSize={15} style={{ color: 'var(--dark-color)' }}>Settlement Amount</Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography fontSize={15} style={{ color: 'var(--primary-color)' }}>
                          {item.refundSettlementAmount}
                        </Typography>
                      </Grid>
                    </>
                    : <></>}

                  {item.refundSettlementDate ?
                    <>
                      <Grid item xs={4}>
                        <Typography fontSize={15} style={{ color: 'var(--dark-color)' }}>Settlement Date</Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography fontSize={15} style={{ color: 'var(--primary-color)' }}>
                          {item.refundSettlementDate}
                        </Typography>
                      </Grid>
                    </>
                    : <></>}

                  {item.refundSettlementProvider ?
                    <>
                      <Grid item xs={4}>
                        <Typography fontSize={15} style={{ color: 'var(--dark-color)' }}>Settlement Provider</Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography fontSize={15} style={{ color: 'var(--primary-color)' }}>
                          {item.refundSettlementProvider}
                        </Typography>
                      </Grid>
                    </>
                    : <></>}

                  {item.refundSettlementStatus ?
                    <>
                      <Grid item xs={4}>
                        <Typography fontSize={15} style={{ color: 'var(--dark-color)' }}>Settlement Status</Typography>
                      </Grid>
                      <Grid item xs={8}>
                        {this.getStatusChip(item.refundSettlementStatus)}
                      </Grid>
                    </>
                    : <></>}

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
                      style={{ color: "var(--secondary-color)" }}
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
                    style={{ color: 'var(--dark-color)' }}
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
                    style={{ color: "var(--dark-color)", display: "inline" }}
                  >
                    BenePay Transaction Id:&nbsp;
                  </Typography>
                  <Typography
                    gap={2}
                    variant="body1"
                    fontSize={17}
                    style={{ color: "var(--accent-color)", display: "inline" }}
                  >
                    {selectedTransactionId}&ensp;
                    <IconButton
                      aria-label="Duplicate"
                      onClick={() => {
                        this.handleCopyClick(selectedTransactionId);
                      }}
                    >
                      <FileCopyOutlinedIcon
                        style={{ color: "var(--accent-color)" }}
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
                            <Typography fontSize={15} style={{ color: 'var(--dark-color)' }}>Bene Id</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography fontSize={15} style={{ color: 'var(--primary-color)' }}>
                              {value.beneId}
                            </Typography>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography fontSize={15} style={{ color: 'var(--dark-color)' }}>Payer Name</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography fontSize={15} style={{ color: 'var(--primary-color)' }}>
                              {value.debtorName}
                            </Typography>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography fontSize={15} style={{ color: 'var(--dark-color)' }}>Payer Email</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography fontSize={15} style={{ color: 'var(--primary-color)' }}>
                              {value.debtorEmailId}
                            </Typography>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography fontSize={15} style={{ color: 'var(--dark-color)' }}>
                              Creation Timestamp
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography fontSize={15} style={{ color: 'var(--primary-color)' }}>
                              {`${(value.creationDate)}`}
                            </Typography>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography fontSize={15} style={{ color: 'var(--dark-color)' }}>Amount</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography fontSize={15} style={{ color: 'var(--primary-color)' }}>
                              {value.currency + " " + value.dueAmount}
                            </Typography>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography fontSize={15} style={{ color: 'var(--dark-color)' }}>
                              Collection Reference
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography fontSize={15} style={{ color: 'var(--primary-color)' }}>
                              {value.collectionReferenceNo}
                            </Typography>
                          </Grid>

                          {value.paymentMethod && <>
                            <Grid item xs={6}>
                              <Typography fontSize={15} style={{ color: 'var(--dark-color)' }}>Payment Mode</Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography fontSize={15} style={{ color: 'var(--primary-color)' }}>
                                {value.paymentMethod}
                              </Typography>
                            </Grid>
                          </>
                          }

                          <Grid item xs={6}>
                            <Typography fontSize={15} style={{ color: 'var(--dark-color)' }}>Status</Typography>
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
                            <Typography fontSize={15} style={{ color: 'var(--dark-color)' }}>Reason</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography fontSize={15} style={{ color: 'var(--primary-color)' }}>
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

      {isMarkAsPaidClicked && !this.state.isDeviceMobile && (
        <ConfirmDialog
          style={{ width: "500px", padding: "20px" }}
          title="Payment Method"
          open={true}
        >
          <Container maxWidth="sm">
            <Grid container spacing={3}>

              <Grid item xs={12}>
                <Typography
                  style={{
                    color: 'var(--dark-color)',
                    marginBottom: '16px',
                    fontWeight: 'bold',
                    fontSize: '20px'
                  }}
                >
                  Paid Via
                </Typography>

                <FormControl component="fieldset">
                  <RadioGroup
                    aria-labelledby="payment-method-radio-buttons-group"
                    name="payment-method-radio-buttons-group"
                    defaultValue={this.state.selectedManualPaymentMode}
                    value={this.state.selectedManualPaymentMode}
                    onChange={this.handleManualPayChange}
                  >
                    <FormControlLabel value="Cash" control={<Radio />} label="Cash" />
                    <FormControlLabel value="Cheque" control={<Radio />} label="Cheque" />
                    <FormControlLabel value="International Bank Account" control={<Radio />} label="International Bank Account" />
                  </RadioGroup>
                </FormControl>

                <Divider dark style={{marginTop:"2%",marginBottom:"5%"}} />

                <Grid container spacing={2}>
                  <Grid item xs={6} rowGap={2} columnGap={2}>
                    <Typography style={{ color: 'var(--dark-color)' }}>Amount<span style={{color:"red", paddingLeft:'1%'}}>*</span></Typography>

                    <InputGroup fullWidth>
                      <InputGroup.Text>
                        {this.state.manualPayAmountCcy}
                      </InputGroup.Text>
                      <bForm.Control
                        disabled={!this.state.allowPartPaymentForManualPay}
                        style={{ maxWidth: "228px", color: 'var(--primary-color)' }}
                        value={this.state.manualPayFormFields.manualPayAmount.value}
                        onChange={(e) => this.handlePartialPayment("manualPayAmount", e.target.value)}
                        onBlur={() => {this.handlePartialPayment("manualPayAmount", this.state.manualPayFormFields.manualPayAmount.value, true,true)}}
                      />
                    </InputGroup>
                    <Typography style={{ color: 'red', marginTop:'1%' }}>{this.state.manualPayFormFields.manualPayAmount.errors}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography style={{ color: 'var(--dark-color)' }}>Settlement Amount<span style={{color:"red", paddingLeft:'1%'}}>*</span></Typography>

                    <InputGroup fullWidth>
                      {/* <InputGroup.Text>
                        {this.state.manualPaySettlementAmtCcy}
                      </InputGroup.Text> */}
                      <Grid item xl={4} lg={4} md={6} sm={6} xs={12} >
                        <FormControl style={{ minWidth: '61%' }}>
                          <Autocomplete
                           style={{ marginRight: '5%' }} 
                            size="small"
                            id="settlementCurrency"
                            disablePortal
                            options={allCurrency.map((option) => option)}
                            getOptionLabel={(option) => `${option}`}
                            value={this.state.manualPayFormFields.settlementCurrency.value}
                            onChange={(e, newValue) => this.handlePartialPayment("settlementCurrency", (newValue ? newValue : null))}
                            renderInput={(params) => (
                              <BootstrapInputOld
                                {...params}
                                InputProps={{
                                  ...params.InputProps,
                                }}
                                rules={this.state.manualPayFormFields.settlementCurrency.rules}
                                value={this.state.manualPayFormFields.settlementCurrency.value}
                                errors={this.state.manualPayFormFields.settlementCurrency.errors}
                              />
                            )}
                          />
                        </FormControl>
                      </Grid>
                      <bForm.Control
                        style={{ maxWidth: "228px", color: 'var(--primary-color)' }}
                        value={this.state.manualPayFormFields.manualPaySettlementAmt.value}
                        onChange={(e) => this.handlePartialPayment('manualPaySettlementAmt', e.target.value)}
                        onBlur={() => {this.handlePartialPayment("manualPaySettlementAmt", this.state.manualPayFormFields.manualPaySettlementAmt.value, true,true)}}
                      />
                    </InputGroup>
                    <Typography style={{ color: 'red', marginTop:'1%' }}>
                      {this.state.manualPayFormFields.manualPaySettlementAmt.errors}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography style={{ color: 'var(--dark-color)' }}>Notes</Typography>

                    <FormControl fullWidth>
                      <BootstrapInputOld
                        maxRows={4}
                        variant="outlined"
                        id="manual-pay-notes"
                        autoComplete="off"
                        value={this.state.manualPayFormFields.manualPayNotes.value}
                        rules={this.state.manualPayFormFields.manualPayNotes.rules}
                        errors={this.state.manualPayFormFields.manualPayNotes.errors}
                        onChange={(e) => this.handlePartialPayment("manualPayNotes", e.target.value)}
                      />
                    </FormControl>
                  </Grid>

                  {this.state.allowPartPaymentForManualPay &&
                    <Grid item xs={12}>
                      <FormControl fullWidth style={{marginTop:'2%'}}>
                        <Alert severity="info">
                            To make a partial payment, you can change the amount.
                        </Alert>
                      </FormControl>
                    </Grid>
                  }
                </Grid>
              </Grid>

              <Grid container justifyContent="center" alignItems="center" spacing={2} mt={2}>
                <Grid item xs={6} display="flex" justifyContent="center">
                  <Button
                    variant="contained"
                    style={{
                      backgroundColor: `${"#346799"}`,
                      color: `${"#fff"}`,
                      width: "80%",
                      fontWeight: 'bold',
                      boxShadow: '0 3px 5px 2px rgba(54, 103, 153, .3)'
                    }}
                    onClick={this.confirmManualPay}
                  >
                    Confirm
                  </Button>
                </Grid>
                <Grid item xs={6} display="flex" justifyContent="center">
                  <Button
                    variant="contained"
                    style={{
                      backgroundColor: "var(--light-color)",
                      color: 'var(--primary-color)',
                      width: "80%",
                      fontWeight: 'bold',
                      boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .3)'
                    }}
                    onClick={this.cancelManualPay}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>

            </Grid>
          </Container>
        </ConfirmDialog>
      )}
    </>
  );
}
