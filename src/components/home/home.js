import React, { Component } from "react";
import { html } from "./home.v2.html";
import { DashboardService } from "../../service/api/dashboard.service";
import { Auth } from "@aws-amplify/auth";

import {
  StorageKeys,
  StorageService,
  TempStorage,
  USER_TYPE,
} from "../../service/core/storage.service";
import { addDays, endOfDay, startOfDay } from "date-fns";
import moment from "moment";
import { toast } from "react-toastify";
import { NaturePeopleOutlined } from "@material-ui/icons";

import { DefaultDateFormat,OnboardConstants, Pagination, manualPay,LookupKeys, PrivilegeConstants,QuickFilters, SettlementConstants} from "../../config/constants";

import { DateFormat } from "../../enum/common.enum";
import { Chip, IconButton, Divider, Tooltip, Typography } from "@mui/material";
import { Cancel, Replay, Notifications } from "@mui/icons-material";
import dayjs from "dayjs";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import { PaymentService } from "../../service/api/payment.service";
import Utils from "../../service/core/utils";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHourglassHalf,
  faCheck,
  faMoneyBillTransfer,
  faXmark,
  faCalendarXmark,
  faHandHoldingDollar,
  faMoneyBillTrendUp,
  faL,
} from "@fortawesome/free-solid-svg-icons";
import StatusIconCreator from "./support-components/statusIconCreator-v1.js";
import ActionBtn from "./support-components/actionBtn-v1.js";
import FormValidationService from "../../service/core/validate.service.js";
import QRCode from 'qrcode.react';
import { Logger } from "aws-amplify";
import Validator from "service/core/validator";
import { messages } from "../../config/constants";
import { BenepayUserService } from "service/api/benepay-user.service";
import { MerchantSelectionContext } from "provider/merchantSelectionProvider";

class Home extends Component {  
  static contextType = MerchantSelectionContext;
  
  constructor(props) {
    super(props);

    this.state = {
      isFirstCall: true,
      privileges: TempStorage.userPrivilege,
      checkedStatuses: new Map(),
      selectedStatuses: [],
      teststatuscheck: [],
      // status: ["ALL", "AWAITING_PAYMENT", "PROCESSSING", "REJECTED_BY_PROVIDER", "PAID", "REFUNDED"],
      status: [],
      apply1Click: false,
      apply2Click: false,
      showFilterApplied: true,
      list1Style: "",
      section1show: false,
      currencyList: [],
      searchedPaymentResultList: [],
      serachedRejectedPaymentResultList: [],
      validationFailed: false,
      amountValidationError: false,
      totalPaymentsFound: 0,
      noResultFound: false,
      noRejectedResultFound: false,
      rejectedTableShow: false,
      showProcessedTable: false,
      showValidationMsg: false,
      showRefundConfirmationModal: false,
      showRefundSuccessModal: false,
      showFailureModal: false,
      refundAmount: 0,
      showModal: false,
      showConfirmationModal: false,
      refundAmount: "",
      refundCcy: "",
      selectedOption: "Partial Refund",
      fullRefundAmt: "",
      fullRefundCcy: "",
      paymentSettlementModel: false,
      settlementDate: "",
      loading: false,
      refundLoading: false,
      parentTransactions: [],
      selectedItem: {},
      lastSelectedItem: {},
      currentIndex: 0,
      isRowVisible: false,
      showCancellationModal: false,
      showCancellationReason: false,
      cancellationReason: "",
      selectedTransactionId: "",
      selectedIsFirc: null,
      isCancellationProcessing: false,
      failedAttemptStartDate: "",
      failedAttemptEndDate: "",
      benepayPaymentRef: "",
      collectionReference: "",
      fromAmount: "",
      toAmount: "",
      failedTransactions: undefined,
      isFailedTransactionsRequested: false,
      payerEmail: "",
      refundCount: 0,
      locale: "ru",
      receiptEndDate: null,
      paymentStartDate: null,
      paymentEndDate: null,
      receiptStartDate: null,
      rejectedReceiptEndDate: null,
      rejectedReceiptStartDate: null,
      requestorTransactionId: "",
      payerName: null,
      collectionRef: "",
      coltype: "",
      order: "desc",
      colvalue: "",
      apiUpdation: "",
      showCopiedMsg: false,
      copiedId: "",
      refundIndex: "",
      pageNo: Pagination.pageNo,
      pageNoForRedirect: null,
      pageSize: Pagination.transactionPageSize,
      totalPages: Pagination.totalPages,
      totalFailedPages: Pagination.totalPages,
      initalPage: 0,
      rejectedFilePagination: false,
      initalPageFailed: 0,
      recentSortColumn: "",
      remainingAmt: 0,
      totalFailedCount: null,
      copyText: "Copy Payment Link",
      showReminderModal: false,
      transactionIdForReminder: null,
      errorDesc: "",
      paymentAttempts: 0,
      paymentDetails: [],
      paymentDetailsOpen: false,
      paymentStatus: "",
      showCancellationSuccessModal: false,
      transactionDetailsModal: false,
      searchedBenePayTransactionId: null,
      searchedRequestorTransactionId: "",
      payerEmail: null,
      cancellationFromDate: null,
      cancellationToDate: null,
      requestedCcy: null,
      requestedMinAmount: null,
      requestedMaxAmount: null,
      paidCcy: null,
      paidMinAmount: null,
      paidMaxAmount: null,
      showAllRecords: true,
      totalFailedCount: null,
      copyText: "Copy Payment Link",
      showReminderModal: false,
      transactionIdForReminder: null,
      errorDesc: "",
      paymentAttempts: 0,
      isDeviceMobile: false,
      failedTransactionsModal: false,
      faildTransactionMatched: false,
      selectedCollectionCurrency: "",
      transactionDetails: "",
      merchantsList: "",
      referralPartners:"",
      subMerchantIds:"",
      refferredMerchants:"",
      merchantId: null,
      selectedMerchant: null,
      mobileViewFilterModal: false,
      sortingType: null,
      sortingBy: null,
      alreadyAppliedFilters: null,
      isAmountFilter: false,
      isDateFilter: false,
      refundReason: "",
      disableRefundConfirmBtn: true,
      transactionPaymenButtonRules: {
        disableViewPaymentDetails: true,
        disableViewFailedAttempts: true,
        disableViewRefundDetails: true,
        disableDuplicate: true,
        disableIssueRefund: true,
        disableCancelTransaction: true,
        disableMarkAdPaid: false
      },
      refundResponse: {
        refundDetails: [],
        refundReason: null,
        payerName: null,
        payerName: null,
        payerEmail: null,
        paymentMethod: null,
        refundType: null,
        traceId: null,
      },
      partialPaymentAllowedForMerchant:false,
      columns: this.transactionSummaryColumns(),
      refundSearchModel: {
        refundStartDate: null,
        refundEndDate: null,
        createStartDate: null,
        createEndDate: null,
        paymentStartDate: null,
        paymentEndDate: null,
        payerName: null,
        collectionRef: null,
        transactionId: null,
        refundTransactionId: null,
        requestorTransactionId: null,
        refundRequestorTransactionId: null,
        refundReason: null,
        refundedTo: "",
        defaultSearch: false,
        pageNo: Pagination.pageNo,
        pageSize: Pagination.pageSize,
        payerEmail: null,
        paymentCcy: null,
        paymentMinAmount: null,
        paymentMaxAmount: null,
        refundCcy: null,
        refundMinAmount: null,
        refundMaxAmount: null,
        sortingType: null,
        sortingBy: null,
      },
      refundedToPossibleValues: [
        "Credit Card",
        "Debit Card",
        "Net Banking",
        "UPI",
        "Bank Account",
      ],
      expandedRefundDeatils: "panel4",
      expandedOriginalDeatils: "panel3",
      refundSummaryList: null,
      refundColumns: this.refundSummaryColumns(),
      totalCountRefundList: 0,
      totalPagesRefund: Pagination.totalPages,
      appliedRefundListFilters: [],
      duplicateTransactionStates: {},
      formFields: this.prepareField(this.fieldNames, this.rule),
      refundBtnClick: false,
      selectedPaymentCount: 0,
      allowPaymentByScreen: true,
      allowRefundByScreen: true,
      allowCancellationByScreen: true,
      merchantTimeZone:"",
      allowManualPayment: false,
      isMarkAsPaidClicked : false,
      selectedManualPaymentMode : "Cash",
      qrString:"",
      qrImageUploadPath:"",
      selectedDataMerchantId:"",
      loggedInMerchantID:"",
      mobileNumber:"",
      refundAmountValidationErrMsg:"",
      manualPaymentModes: [
        manualPay.manualPaymentModeCash,
        manualPay.manualPaymentModeCheque,
        manualPay.manualPaymentModeIntBankAccount
      ],
      transactionCreationModesList:[],
      selectedTransactionCreationMode:null,
      allowPartPaymentForManualPay:false,
      refundReview:false,
      allCurrency: [],
      manualPayFormFields : {},
      selectedSettlementStatus: "All",
      settlementStatusList: SettlementConstants.status,
      payViaScreen:true
    };

    this.state.manualPayFormFields = this.prepareField(this.manualPayFieldNames, this.manualPayRule)
  }

  manualPayFieldNames = [
    'manualPaySettlementAmt',
    'settlementCurrency',
    'manualPayAmount',
    'manualPayAmountCcy',
    'manualPayNotes',
  ]

  manualPayRule = {
    manualPaySettlementAmt: [{ validate: 'required' }, { validate: 'nonZero' }],
    settlementCurrency: [{ validate: 'required' }],
    manualPayAmount: [{ validate: 'required' }, { validate: 'nonZero' }],
  }

  transactionSummaryColumns = () => {
    const cols = [
      {
        field: "debtorName",
        headerName: "Payer",
        // width: 220,
        headerClassName: "serachedPaymentResultListHeaderColor",
        cellClassName: "table-cell-classname",
        flex: 1,
        minWidth: 180,
        renderCell: (params) => {
          return (
            <div
              title={params.row.debtorEmailId ? `${params.row.debtorName} (${params.row.debtorEmailId})` : (params.row.debtorMobileNumber ? `${params.row.debtorName} (${params.row.debtorMobileNumber})` : `${params.row.debtorName}`)}
              style={{
                cursor: "pointer",
                fontWeight: "400",
                textDecoration: "none",
                color: "var(--dark-color)",
              }}
            >
              <p
                style={{
                  fontSize: "var(--font-medium)",
                  margin: "0",
                  padding: "0",
                  marginBottom: "2px",
                }}
              >
                {params.row.debtorName}
              </p>
              <div className="text-ellipsis" style={{maxWidth: '180px'}}>
              <p
                className="text-ellipsis"
                style={{ fontSize: "var(--font-x-small)", margin: "0", padding: "0" }}
              >
                {params.row.debtorEmailId}
              </p>
              </div>
            </div>
          );
        },
      },
      // {
      //   field: "transactionId",
      //   headerName: "BenePay Transaction Id",
      //   width: 280,
      //   minWidth: 260,
      //   headerClassName: "serachedPaymentResultListHeaderColor",
      //   cellClassName: "table-cell-classname",
      //   flex: 1,
      // },
       {
        field: "transactionCreationMode",
        headerName: "Transaction Creation Mode",
        // width: 250,
        minWidth:240,
        headerAlign: "left",
        headerClassName: "serachedPaymentResultListHeaderColor",
        cellClassName: "table-cell-classname",
        flex: 1,
      },
      {
        field: "finalDueAmountWithCurrency",
        headerName: "Requested Amount",
        // width: 190,
        headerAlign: "left",
        headerClassName: "serachedPaymentResultListHeaderColor",
        cellClassName: "table-cell-classname-amount",
        flex: 1,
        minWidth: 160,
      },
      {
        field: "paymentAmountWithCurrency",
        headerName: "Paid Amount",
        // width: 190,
        headerAlign: "left",
        headerClassName: "serachedPaymentResultListHeaderColor",
        cellClassName: "table-cell-classname-amount",
        flex: 1,
        minWidth: 140,
      },
      {
        field: "createTimeStamp",
        headerName: "Create Timestamp",
        width: 240,
        align: "left",
        headerAlign: "left",
        headerClassName: "serachedPaymentResultListHeaderColor",
        cellClassName: "table-cell-classname",
        flex: 1,
        minWidth: 300,
        // valueGetter: (params) =>
        //   moment(params.value).format(DateFormat.dateTime),
        valueGetter: (params) => {
          return `${params.value}`;
        },
      },
      // {
      //   field: "collectionReferenceNumber",
      //   headerName: "Collection Ref",
      //   // width: 240,
      //   headerClassName: "serachedPaymentResultListHeaderColor",
      //   cellClassName: "table-cell-classname",
      //   flex: 1,
      //   minWidth: 145,
      // },
      // {
      //   field: "requestorTransactionId",
      //   headerName: "Requestor Transaction Id",
      //   // width: 240,
      //   headerClassName: "serachedPaymentResultListHeaderColor",
      //   cellClassName: "table-cell-classname",
      //   flex: 1,
      //   minWidth: 210,
      // },
      {
        field: "collectorsName",
        headerName: "Merchant Name",
        width: 230,
        minWidth: 130,
        headerClassName: "serachedPaymentResultListHeaderColor",
        cellClassName: "table-cell-classname",
        flex: 1,
      },
      // {
      //   field: "refundCount",
      //   headerName: "Refunds",
      //   align: "left",
      //   headerAlign: "left",
      //   headerClassName: "serachedPaymentResultListHeaderColor",
      //   cellClassName: "table-cell-classname",
      //   flex: 1,
      //   minWidth: 115,
      //   renderCell: (params) => {
      //     const refundsCount = params.row.refundCount;

      //     if (refundsCount > 0) {
      //       return (
      //         <a
      //           title={refundsCount}
      //           style={{
      //             color: "blue",
      //             textDecoration: "underline",
      //             cursor: "pointer",
      //             width: "content-fit",
      //           }}
      //           onClick={() => {
      //             this.handleRefundDetails(params);
      //           }}
      //         >
      //           {refundsCount}
      //         </a>
      //       );
      //     } else {
      //       return <p title={refundsCount}>{refundsCount}</p>; // Display the count as is when it's not greater than 0
      //     }
      //   },
      // },
      {
        field: "status",
        headerName: "Status",
        width: 220,
        align: "left",
        headerAlign: "left",
        headerClassName: "serachedPaymentResultListHeaderColor",
        cellClassName: "table-cell-classname",
        flex: 1,
        minWidth: 200,
        renderCell: (params) => {
          return <StatusIconCreator status={params.value} />;
        },
      },
      {
        field: "requestSettlementStatus",
        headerName: "Settlement Status",
        width: 220,
        align: "center",
        headerAlign: "center",
        headerClassName: "serachedPaymentResultListHeaderColor",
        cellClassName: "table-cell-classname",
        flex: 1,
        minWidth: 200,
        renderCell: (params) => {
          return <StatusIconCreator status={params.value} />;
        },
      },
      {
        headerName: "Action",
        width: 80,
        align: "left",
        headerAlign: "left",
        headerClassName: "serachedPaymentResultListHeaderColor",
        cellClassName: "table-cell-classname-actions",
        flex: 1,
        minWidth: 80,
        maxWidth: 80,
        disableColumnMenu: true,
        sortable: false,
        border: 0,
        renderCell: (params) => {
          const { referralPartners } = this.state;
          const { loggedInMerchantID } = this.state;
          return (
            <ActionBtn
              params={params}
              setSelectedItem={this.setSelectedItem}
              handleCopyClick={this.handleCopyClick}
              handleFirc={this.handleFirc}
              refundClick={this.refundClick}
              sendPaymentReminderBtn={this.sendPaymentReminderBtn}
              allowRefundByScreen={this.state.allowRefundByScreen}
              allowCancellationByScreen={this.state.allowCancellationByScreen}
              manualPayClick = {this.handleManualPay}
              merchantType={referralPartners.merchantType}
              loggedInMerchantID={loggedInMerchantID}
              selectedDataMerchantId={this.state.selectedDataMerchantId}
              allowManualPayment={this.state.allowManualPayment}
            />
          );
        },
      },
    ];

    if (TempStorage.loginUserRole !== USER_TYPE.ADMIN_USER) {
      const withoutMerchantName = cols.filter(
        (column) => column.field !== "collectorsName"
      );

      if (this.state?.partialPaymentAllowedForMerchant) {
        const withoutSettlementStatus = withoutMerchantName.filter(
          (column) => column.field !== "requestSettlementStatus"
        );

        return withoutSettlementStatus;
      }

      return withoutMerchantName;
    }

    if (TempStorage.loginUserRole == USER_TYPE.ADMIN_USER) {
      const withoutSettlementStatus = cols.filter(
        (column) => column.field !== "requestSettlementStatus"
      );
      return withoutSettlementStatus;
    }

    return cols;
  };

  downloadFailedTransactionsCSV = async () => {
    this.setState({
      loading: true,
    });
    const request = {};
    if (this.state.failedAttemptStartDate) {
      request.attemptStartDate = moment(
        this.state.failedAttemptStartDate
      ).format(DefaultDateFormat.dateFormat);
    }
    if (this.state.failedAttemptEndDate) {
      request.attemptEndDate = moment(this.state.failedAttemptEndDate).format(
        DefaultDateFormat.dateFormat);
    }
    if (this.state.requestedCcy) {
      request.requestedCcy = this.state.requestedCcy;
    }
    if (this.state.requestedMinAmount) {
      request.requestedMinAmount = +this.state.requestedMinAmount;
    }
    if (this.state.requestedMaxAmount) {
      request.requestedMaxAmount = +this.state.requestedMaxAmount;
    }
    if (this.state.payerEmail) {
      request.payerEmail = this.state.payerEmail;
    }
    if (this.state.collectionReference) {
      request.collectionRef = this.state.collectionReference;
    }
    if (this.state.benepayPaymentRef) {
      request.transactionId = this.state.benepayPaymentRef;
    }
     if (this.state.selectedTransactionCreationMode) {
      request.selectedTransactionCreationMode = this.state.selectedTransactionCreationMode;
    }

    const response = await DashboardService.downloadFailedTransactionsReport(
      request
    );
    if (!response) {
      return;
    }
    this.setState({
      loading: false,
    });
    var blob = this.base64toBlob(response.content, "text/csv");
    if (window.navigator.msSaveBlob) {
      window.navigator.msSaveOrOpenBlob(blob, response.fileName + ".csv");
    } else {
      var a = window.document.createElement("a");
      a.href = window.URL.createObjectURL(blob, { type: "text/plain" });
      a.download = response.fileName + ".csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  sendReminder = async () => {
    this.setState({ loading: true });

    if (!this.state.transactionIdForReminder) {
      toast("Something went wrong, please try again later! ", {
        position: toast.POSITION.BOTTOM_CENTER,
        className: "toast-message toast-error",
      });
      this.setState({ loading: false });
      return;
    }

    const response = await DashboardService.sendPaymentReminder(
      this.state.transactionIdForReminder
    );

    this.setState({ loading: false });

    if(response && response.data){
      toast("Reminder notification sent successfully", {
        position: toast.POSITION.BOTTOM_CENTER,
        className: "toast-message toast-success",
      });
    }else{
      toast("You don't have access to perform this action!", {
        position: toast.POSITION.BOTTOM_CENTER,
        className: "toast-message toast-error",
      });
    }
  };

  sortingData = (coltype, apiUpdation) => {
    this.setState({
      coltype: coltype,
      recentSortColumn: coltype,
    });

    // // console.log("this is event : ", coltype, "and the updation will be in ", apiUpdation)
    let data = [];
    if (apiUpdation === "Payment") {
      data = this.state.serachedPaymentResultList;
      // // console.log("data is set to payment")
    } else if (apiUpdation === "Failed") {
      data = this.state.failedTransactions;
      // // console.log("data is set to failed")
    } else {
      data = this.state.serachedRejectedPaymentResultList;
      // // console.log("data is set to rejected")
    }

    const sortedData = data.sort((a, b) => {
      let i = a[coltype];
      let j = b[coltype];

      if (i !== null && j !== null) {
        let c = i.toLowerCase();
        let d = j.toLowerCase();
        return c > d ? -1 : 1;
      }
      if (i === null) {
        return 1;
      }
      if (j === null) {
        return -1;
      }
    });

    if (this.state.order === "ascn" && this.state.colvalue === coltype) {
      sortedData.reverse();
      this.setState({ order: "desc" });
      // // console.log("the data is in desc order")
    } else {
      this.setState({ order: "ascn", colvalue: coltype });
      // // console.log("the data is in ascn order")
    }

    // // console.log("this is sorteed data : ", sortedData)

    if (this.state.apiUpdation === "Payment") {
      this.setState({
        serachedPaymentResultList: sortedData,
      });
    }
    if (this.state.apiUpdation === "Failed") {
      this.setState({
        failedTransactions: sortedData,
      });
    } else {
      this.setState({
        serachedRejectedPaymentResultList: sortedData,
      });
    }
  };

  pageWiseSorting = (value) => {
    if (
      this.state.recentSortColumn !== null &&
      this.state.recentSortColumn.trim() !== ""
    ) {
      if (this.state.order === "ascn") {
        this.setState({ order: "desc" });
      } else {
        this.setState({ order: "ascn" });
      }
      this.sortingData(this.state.recentSortColumn, value);
    }
  };

  setRowVisibility = async (item, index) => {
    if (this.state.selectedItem.transactionId === item.transactionId) {
      item.isRowVisible = !item.isRowVisible;
    } else {
      item.isRowVisible = true;
    }
    this.setState({ selectedItem: item, currentIndex: index });
  };

  onDateChange = (item) => {
    // // console.log('item ', item);
    item[0] = moment(item[0]).format("DD-MMM-YYYY");
    item[1] = moment(item[1]).format("DD-MMM-YYYY");
    this.setState({ selectedDates: item });
  };

  copyRequestedId = (id, index) => {
    navigator.clipboard.writeText(id);
    // // console.log("this is the copied item:", id);
    this.setState(
      { showCopiedMsg: true, refundIndex: index, copiedId: id },
      () => {
        setTimeout(() => {
          this.setState({ showCopiedMsg: false });
        }, 500);
      }
    );
  };

  //  outFunc =()=> {
  //     var tooltip = document.getElementById("myTooltip");
  //     tooltip.innerHTML = "Copy to clipboard";
  //   }

  handleChange = (value) => {
    this.setState({ dateRange: value });
  };

  handleApplyClickPaymentSettlement = async (activeFilterType = null) => {
    var formValid = true;
    this.setState({ initalPage: 0, pageNoForRedirect: null});

    /**
     * Validate, if the amount fields are valid or not
     * if any error are happened don't trigger the search API
     */
    Object.entries(this.state.formFields).forEach(([index, field]) =>{
      if (this.transactionAmountField.includes(index)){
        if(field.errors.length !== 0){
          formValid = false;
          return;
        }
      }
    });

    if(activeFilterType){
      formValid ? this.processedApply(1, false, activeFilterType) :
      toast.error("Resolve the errors before apply filter.", {
        position: "bottom-center",
        autoClose: 5000,
      });
    }else{
      formValid ? this.processedApply(1) :
      toast.error("Resolve the errors before apply filter.", {
        position: "bottom-center",
        autoClose: 5000,
      });
    }

    if (this.state.partialPaymentAllowedForMerchant) {
      const withoutSettlementStatus = this.state.columns.filter(
        (column) => column.field !== "requestSettlementStatus"
      );

      this.setState({columns : withoutSettlementStatus})
    }

  };

  // Helper function to convert empty strings to null
  setNullIfEmpty(value) {
    return value === "" ? null : value;
  }

  handleQuickFilters = async (paramPageNo, activeFilterType) => {
    if(activeFilterType){

      const currentDate = new Date();
      const dateBefore7Days = new Date();
      dateBefore7Days.setDate(currentDate.getDate() - 7);

      // console.log("IN", currentDate, dateBefore7Days);
      
      await this.setState({
        selectedStatuses: [],
        receiptStartDate : activeFilterType == QuickFilters.PAID ? null : moment(dateBefore7Days).format("YYYY-MM-DD"),
        receiptEndDate : activeFilterType == QuickFilters.PAID ? null : moment(currentDate).format("YYYY-MM-DD"),
        paymentStartDate: activeFilterType == QuickFilters.PAID ? moment(dateBefore7Days).format("YYYY-MM-DD") : null,
        paymentEndDate: activeFilterType == QuickFilters.PAID ? moment(currentDate).format("YYYY-MM-DD") : null,
        requestedCcy: null,
        requestedMinAmount: null,
        requestedMaxAmount: null,
        paymentMode: null,
        payerName: null,
        collectionRef: "",
        pageNo: paramPageNo,
        pageSize: this.state.pageSize,
        defaultSearch: false,
        transactionId: "",
        searchedBenePayTransactionId: "",
        requestorTransactionId: "",
        searchedRequestorTransactionId: "",
        payerEmail: "",
        cancellationFromDate: null,
        cancellationToDate: null,
        paidCcy: null,
        paidMinAmount: null,
        paidMaxAmount: null,
        showAllRecords: this.state.showAllRecords,
        merchantId: this.state.selectedMerchant,
        sortingType: null,
        sortingBy: null,
        mobileNumber: null,
        selectedTransactionCreationMode: null
      });

      let selectedStatusesNew = [];
      
      switch (activeFilterType) {
        case QuickFilters.ALL:
          selectedStatusesNew = ["ALL","AWAITING_PAYMENT","PARTIALLY_PAID","PAID","REFUNDED","CANCELLED","EXPIRED","IN_PROCESS","FAILED"];
          await this.setState({selectedStatuses: ["AWAITING_PAYMENT","PARTIALLY_PAID","PAID","REFUNDED","CANCELLED","EXPIRED","IN_PROCESS","FAILED"], sortingType: "DESC", sortingBy: "updateTimeStamp"});
          break;
  
        case QuickFilters.PAID:
          selectedStatusesNew = ["PARTIALLY_PAID", "PAID"];
          await this.setState({selectedStatuses: ["PARTIALLY_PAID", "PAID"]});
          // console.log("selectedStatuses 1", this.state.selectedStatuses);
          
          break;
  
        case QuickFilters.UNPAID:
          selectedStatusesNew = ["AWAITING_PAYMENT"];
          await this.setState({selectedStatuses: ["AWAITING_PAYMENT"]});
          break;
  
        default:
          break;
      }

    }
  }

  processedApply = async (paramPageNo, isFiltersCall = false, activeFilterType = null, requestFromClearBtn = false) => {


    if (paramPageNo) {

      this.setState({ pageNoForRedirect: paramPageNo })
    }
    
    if(activeFilterType){
      await this.handleQuickFilters(paramPageNo, activeFilterType);
    }

    if(isFiltersCall){
      this.setState({
        alreadyAppliedFilters: null,
      });
    }else{
      this.setState({
        noResultFound: false,
        showProcessedTable: false,
        isAmountFilter: false,
        isDateFilter: false,
        loading: true,
        alreadyAppliedFilters: null,
      });
    }

    // Get the current date
    const currentDate = new Date();
    
    // Calculate the date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(currentDate.getDate() - 29);

    // Format the dates as strings
    const currentDateStr = Utils.getDefaultDateFormat(currentDate.toISOString().split("T")[0]);
    const thirtyDaysAgoStr =  Utils.getDefaultDateFormat(thirtyDaysAgo.toISOString().split("T")[0]);

    var searchObj = {
      status: this.state.selectedStatuses,
      receiptStartDate: this.state.receiptStartDate,
      receiptEndDate: this.state.receiptEndDate,
      paymentStartDate: this.state.paymentStartDate,
      paymentEndDate: this.state.paymentEndDate,
      requestedCcy:
        this.state.requestedCcy || this.setNullIfEmpty(this.state.requestedCcy),
      requestedMinAmount: this.state.formFields.requestedMinAmount || this.setNullIfEmpty(this.state.formFields.requestedMinAmount.value),
      requestedMaxAmount: this.state.formFields.requestedMaxAmount || this.setNullIfEmpty(this.state.formFields.requestedMaxAmount.value),
      paymentMode:
        this.state.paymentMode || this.setNullIfEmpty(this.state.paymentMode),
      payerName:
        this.state.payerName || this.setNullIfEmpty(this.state.payerName),
      collectionRef: this.state.collectionRef,
      pageNo: paramPageNo,
      pageSize: this.state.pageSize,
      defaultSearch: false,
      transactionId:
        this.state.searchedBenePayTransactionId ||
        this.setNullIfEmpty(this.state.searchedBenePayTransactionId),
      requestorTransactionId:
        this.state.searchedRequestorTransactionId ||
        this.setNullIfEmpty(this.state.searchedRequestorTransactionId),
      payerEmail:
        this.state.payerEmail || this.setNullIfEmpty(this.state.payerEmail),
      cancellationFromDate: this.state.cancellationFromDate,
      cancellationToDate: this.state.cancellationToDate,
      paidCcy: this.state.paidCcy || this.setNullIfEmpty(this.state.paidCcy),
      paidMinAmount: this.state.formFields.paidMinAmount || this.setNullIfEmpty(this.state.formFields.paidMinAmount.value),
      paidMaxAmount: this.state.formFields.paidMaxAmount || this.setNullIfEmpty(this.state.formFields.paidMaxAmount.value),
      showAllRecords: this.state.showAllRecords,
      merchantId: this.state.selectedMerchant,
      sortingType:
        this.state.sortingType !== null
          ? this.state.sortingType.toUpperCase()
          : null,
      sortingBy: this.state.sortingBy,
      mobileNumber: this.state.mobileNumber || this.setNullIfEmpty(this.state.mobileNumber),
      selectedTransactionCreationMode: this.state.selectedTransactionCreationMode ?this.state.selectedTransactionCreationMode :null,
      settlementStatus: this.state.selectedSettlementStatus && this.state.selectedSettlementStatus  != 'All' ? this.state.selectedSettlementStatus : null,

      // Update selectedTransactionCreationMode dynamically
      selectedTransactionCreationMode: (() => {
        const { selectedTransactionCreationMode, transactionCreationModesList } = this.state;

        if (
          selectedTransactionCreationMode &&
          Array.isArray(transactionCreationModesList) &&
          transactionCreationModesList.length > 0
        ) {
          const matchingMode = transactionCreationModesList.find(
            (item) => item.description === selectedTransactionCreationMode
          );
          return matchingMode ? matchingMode.lookupCode : null;
        }

        return null;
      })(),
    };

    // // console.log("PRINTING SUSH :",this.state.pageNo)
    if (this.state.receiptStartDate) {
      searchObj.receiptStartDate = moment(this.state.receiptStartDate).format(
        DefaultDateFormat.dateFormat);
    }
    if (this.state.receiptEndDate) {
      searchObj.receiptEndDate = moment(this.state.receiptEndDate).format(
        DefaultDateFormat.dateFormat);
    }
    if (this.state.paymentStartDate) {
      searchObj.paymentStartDate = moment(this.state.paymentStartDate).format(
        DefaultDateFormat.dateFormat);
    }
    if (this.state.paymentEndDate) {
      searchObj.paymentEndDate = moment(this.state.paymentEndDate).format(
        DefaultDateFormat.dateFormat
      );
    }
    if (this.state.cancellationFromDate) {
      searchObj.cancellationFromDate = moment(
        this.state.cancellationFromDate
      ).format(DefaultDateFormat.dateFormat);
    }
    if (this.state.cancellationToDate) {
      searchObj.cancellationToDate = moment(
        this.state.cancellationToDate
      ).format(DefaultDateFormat.dateFormat);
    }

    if (this.state.formFields.requestedMinAmount) {
      searchObj.requestedMinAmount = this.state.formFields.requestedMinAmount.value ? (this.state.formFields.requestedMinAmount.value) : null;
    }
    if (this.state.formFields.requestedMaxAmount) {
      searchObj.requestedMaxAmount = this.state.formFields.requestedMaxAmount.value ? (this.state.formFields.requestedMaxAmount.value) : null;
    }
    if (this.state.formFields.paidMinAmount) {
      searchObj.paidMinAmount = this.state.formFields.paidMinAmount.value ? (this.state.formFields.paidMinAmount.value) : null;
    }
    if (this.state.formFields.paidMaxAmount) {
      searchObj.paidMaxAmount = this.state.formFields.paidMaxAmount.value ? (this.state.formFields.paidMaxAmount.value) : null;
    }

    if (this.state.paidMinAmount) {
      searchObj.paidMinAmount = this.state.paidMinAmount ? (this.state.paidMinAmount) : null;
    }
    if (this.state.paidMaxAmount) {
      searchObj.paidMaxAmount = this.state.paidMaxAmount ? (this.state.paidMaxAmount) : null;
    }
    if (!searchObj.status.length) {
      searchObj.status = null;
    }

    var allFieldsBoolean = false;
    if (TempStorage.loginUserRole === USER_TYPE.ADMIN_USER  || this.state.referralPartners.merchantType == OnboardConstants.ReferralMerchant || this.state.subMerchantIds.length >0) {
      const merchantId = StorageService.get(StorageKeys.merchantId);
      const selectedMerchant = StorageService.get(StorageKeys.selectedMerchantId);

      if (
        !this.state.merchantId &&
        !searchObj.transactionId &&
        !searchObj.status &&
        !searchObj.receiptStartDate &&
        !searchObj.receiptEndDate &&
        !searchObj.paymentStartDate &&
        !searchObj.paymentEndDate &&
        !searchObj.requestedCcy &&
        !searchObj.requestedMinAmount &&
        !searchObj.requestedMaxAmount &&
        !searchObj.paidCcy &&
        !searchObj.paidMinAmount &&
        !searchObj.paidMaxAmount &&
        !searchObj.paymentMode &&
        !searchObj.payerName &&
        !searchObj.collectionRef &&
        !searchObj.requestorTransactionId &&
        !searchObj.payerEmail &&
        !searchObj.cancellationFromDate &&
        !searchObj.cancellationToDate &&
        !searchObj.mobileNumber
      ) {
        this.setState({
          merchantId: merchantId,
          selectedMerchant: selectedMerchant,
          receiptStartDate: thirtyDaysAgo,
          receiptEndDate: currentDate,
        });
        // searchObj.receiptStartDate = thirtyDaysAgoStr;
        // searchObj.receiptEndDate = currentDateStr;
        // searchObj.allMerchant = true;
      }

      if (
        searchObj.transactionId ||
        searchObj.status ||
        searchObj.receiptStartDate ||
        searchObj.receiptEndDate ||
        searchObj.paymentStartDate ||
        searchObj.paymentEndDate ||
        searchObj.requestedCcy ||
        searchObj.requestedMinAmount ||
        searchObj.requestedMaxAmount ||
        searchObj.paidCcy ||
        searchObj.paidMinAmount ||
        searchObj.paidMaxAmount ||
        searchObj.paymentMode ||
        searchObj.payerName ||
        searchObj.collectionRef ||
        searchObj.requestorTransactionId ||
        searchObj.payerEmail ||
        searchObj.cancellationFromDate ||
        searchObj.cancellationToDate ||
        searchObj.mobileNumber
      ) {
        if (!this.state.merchantId) {
          this.setState({
            merchantId: StorageService.get(StorageKeys.merchantId),
            selectedMerchant: StorageService.get(StorageKeys.selectedMerchantId)
          });
        }
      }
      
      if(TempStorage.loginUserRole === USER_TYPE.ADMIN_USER){
        await this.updateMerchantId(this.state.merchantId)
      }

      if (StorageService.get(StorageKeys.merchantId) === "All" || this.state.merchantId === "All" ) {
        searchObj.allMerchant = true;
      }

      const merchantIdFromStorage = StorageService.get(StorageKeys.merchantId);
      if (merchantIdFromStorage !== "All" && this.state.merchantId !== "All") {
        const merchantId = merchantIdFromStorage != null ? merchantIdFromStorage : this.state.merchantId;
        searchObj.merchantId = merchantId != null ? merchantId : "All";
      }
    }

    // if (!searchObj.transactionId && !searchObj.status && !searchObj.receiptStartDate && !searchObj.receiptEndDate && !searchObj.paymentStartDate && !searchObj.paymentEndDate && !searchObj.requestedCcy && !searchObj.requestedMinAmount &&
    //     !searchObj.requestedMaxAmount && !searchObj.paidCcy && !searchObj.paidMinAmount && !searchObj.paidMaxAmount && !searchObj.paymentMode && !searchObj.payerName && !searchObj.collectionRef &&
    //     !searchObj.requestorTransactionId && !searchObj.payerEmail && !searchObj.cancellationFromDate && !searchObj.cancellationToDate) {
    //     // allFieldsBoolean = true;

    //     if (TempStorage.loginUserRole !== USER_TYPE.ADMIN_USER) {
    //         searchObj.status = ["PAID", "AWAITING_PAYMENT"]
    //         searchObj.receiptStartDate = thirtyDaysAgoStr
    //         searchObj.receiptEndDate = currentDateStr

    //         this.setState({
    //             status: [
    //                 { text: 'All', value: "ALL", isChecked: false },
    //                 { text: 'Awaiting Payment', value: "AWAITING_PAYMENT", isChecked: true },
    //                 { text: 'Paid', value: "PAID", isChecked: true },
    //                 { text: 'Refunded', value: "REFUNDED", isChecked: false },
    //                 { text: 'Cancelled', value: "CANCELLED", isChecked: false },
    //                 { text: 'Expired', value: "EXPIRED", isChecked: false },
    //                 { text: 'Settled', value: "SETTLED", isChecked: false }
    //             ],
    //             selectedStatuses: searchObj.status,
    //             receiptStartDate: thirtyDaysAgo,
    //             receiptEndDate: currentDate
    //         });
    //     }
    // }

    if (allFieldsBoolean) {
      searchObj = {
        pageNo: paramPageNo,
        pageSize: this.state.pageSize,
        // defaultSearch: true
      };
    }
    // else{
    //     searchObj.defaultSearch = false
    // }

    // if (!searchObj.transactionId && !searchObj.status && !searchObj.receiptStartDate && !searchObj.receiptEndDate && !searchObj.paymentStartDate && !searchObj.paymentEndDate && !searchObj.requestedCcy && !searchObj.requestedMinAmount &&
    //     !searchObj.requestedMaxAmount && !searchObj.paidCcy && !searchObj.paidMinAmount && !searchObj.paidMaxAmount && !searchObj.paymentMode && !searchObj.payerName && !searchObj.collectionRef &&
    //     !searchObj.requestorTransactionId && !searchObj.payerEmail && !searchObj.cancellationFromDate && !searchObj.cancellationToDate) {
    //         searchObj = {
    //             pageNo: paramPageNo,
    //             pageSize: this.state.pageSize,
    //             defaultSearch: true
    //         }
    //     }

    let statusIsVisible = null;
    let amountIsVisible = null;
    let dateIsVisible = null;
    let basicIsVisible = null;
    let response = null;

    if(!isFiltersCall){
      this.setState({loading : true});
      response = await DashboardService.getPaymentSearchResult(searchObj);
      this.setState({loading : false});
      // // console.log("Payment Search Result: ", response);
  
      // For already applied Filters --sushmit
  
      statusIsVisible = this.state.selectedStatuses.length > 0;
      amountIsVisible =
        (searchObj.paidCcy !== null ||
          (searchObj.paidMinAmount !== null ||
          searchObj.paidMaxAmount !== null)) ||
        (searchObj.requestedCcy !== null ||
          (searchObj.requestedMinAmount !== null ||
          searchObj.requestedMaxAmount !== null));
      dateIsVisible =
        (searchObj.receiptStartDate !== null ||
          searchObj.receiptEndDate !== null) ||
        (searchObj.paymentStartDate !== null ||
          searchObj.paymentEndDate !== null) ||
        (searchObj.cancellationFromDate !== null &&
          searchObj.cancellationToDate !== null);
      basicIsVisible =
        (this.state.searchedBenePayTransactionId !== null &&
          this.state.searchedBenePayTransactionId.length > 0) ||
        (this.state.searchedRequestorTransactionId !== null &&
          this.state.searchedRequestorTransactionId.length > 0) ||
        (this.state.payerEmail !== null && this.state.payerEmail.length > 0) ||
        (this.state.payerName !== null && this.state.payerName.length > 0) ||
        (this.state.collectionRef !== null &&
          this.state.collectionRef.length > 0) || 
          (this.state.mobileNumber !== null && this.state.mobileNumber.length > 0);
      
    }else{
      // isFiltersCall = false;
    }
    
    let statusArray = [];
    if(activeFilterType && activeFilterType === QuickFilters.PAID){
      await this.setState({
        selectedStatuses : ["PARTIALLY_PAID", "PAID"],
      });
    }

    this.state.selectedStatuses.forEach((element) => {
      let val = element.toLowerCase();
      if (element === "AWAITING_PAYMENT") {
        statusArray.push({ text: "Awaiting Payment", value: element });
      } else if (element === "PARTIALLY_PAID") {
        statusArray.push({ text: "Partially Paid", value: element });
      }else if (element === "IN_PROCESS") {
        statusArray.push({ text: "In Process", value: element });
      } else { 
        statusArray.push({
          text: val.charAt(0).toUpperCase() + val.slice(1),
          value: element,
        });
      }
    });

    let alreadyAppliedFilters = {
      basicFilters: {
        isVisible: true,
        data: [
          {
            title: "BenePay Transaction Id",
            onClick: () => {
              this.setState({ searchedBenePayTransactionId: "" });
              this.handlePageChange({ selected: this.state.pageNo });
            },
            value: this.state.searchedBenePayTransactionId,
          },
          {
            title: "Requestor Transaction Id",
            onClick: () => {
              this.setState({ searchedRequestorTransactionId: "" });
              this.handlePageChange({ selected: this.state.pageNo });
            },
            value: this.state.searchedRequestorTransactionId,
          },
          {
            title: "Payer Email",
            onClick: () => {
              this.setState({ payerEmail: "" });
              this.handlePageChange({ selected: this.state.pageNo });
            },
            value: this.state.payerEmail,
          },
          {
            title: "Payer Name",
            onClick: () => {
              this.setState({ payerName: "" });
              this.handlePageChange({ selected: this.state.pageNo });
            },
            value: this.state.payerName,
          },
          {
            title: "Mobile Number",
            onClick: () => {
              this.setState({ mobileNumber: "" });
              this.handlePageChange({ selected: this.state.pageNo });
            },
            value: this.state.mobileNumber,
          },
          {
            title: "Collection Reference",
            onClick: () => {
              this.setState({ collectionRef: "" });
              this.handlePageChange({ selected: this.state.pageNo });
            },
            value: this.state.collectionRef,
          },
          {
            title: "Transaction Creation Mode",
            onClick: () => {
              this.setState({ selectedTransactionCreationMode: "" });
              this.handlePageChange({ selected: this.state.pageNo });
            },
            value: this.state.selectedTransactionCreationMode,
          },
        ],
      },
      statusFilters: {
        isVisible:  true,
        data: statusArray,
      },
      amountFilters: {
        isVisible:  true,
        data: [
          {
            title: "Requested Amount",
            currency: searchObj.requestedCcy,
            min: searchObj.requestedMinAmount,
            max: searchObj.requestedMaxAmount,
          },
          {
            title: "Paid Amount",
            currency: searchObj.paidCcy,
            min: searchObj.paidMinAmount,
            max: searchObj.paidMaxAmount,
          },
        ],
      },
      dateFilters: {
        isVisible: true,
        data: [
          {
            title: "Create Date",
            startDate: searchObj.receiptStartDate,
            endDate: searchObj.receiptEndDate,
          },
          {
            title: "Payment Date",
            startDate: searchObj.paymentStartDate,
            endDate: searchObj.paymentEndDate,
          },
          {
            title: "Cancellation Date",
            startDate: searchObj.cancellationFromDate,
            endDate: searchObj.cancellationToDate,
          },
        ],
      },
    };
    
    if(isFiltersCall){
      this.setState({
        alreadyAppliedFilters: alreadyAppliedFilters,
        loading: false,
        showFilterApplied : !requestFromClearBtn
      });
      return;
    }else{
      this.setState({
        alreadyAppliedFilters: alreadyAppliedFilters,
        showFilterApplied : !requestFromClearBtn && (basicIsVisible || statusIsVisible || dateIsVisible || amountIsVisible)
      });
    }


    // For already applied Filters

    if (response == undefined) {
      this.setState({
        loading: false,
      });
      return;
    }

    if ((response && response["Error Code"]) || !response.paymentDetails) {
      toast("Something went wrong, please try again later!", {
        position: toast.POSITION.BOTTOM_CENTER,
        className: "toast-message toast-error",
      });
      this.setState({
        loading: false,
      });
      return;
    }

    if (
      response &&
      response.errorMessage === null &&
      response.paymentDetail &&
      response.paymentDetail.length === 0
    ) {
      this.setState({
        noResultFound: true,
        loading: false,
      });

      return;
    }

    let totalPages = response.totalCount / this.state.pageSize;
    this.setState({
      totalPages: Math.ceil(totalPages),
    });
    //
    response.paymentDetails.map((pd) => {
      pd.isRowVisible = false;
    });

    this.setState({
      searchedPaymentResultList: response.paymentDetails,
      // totalPaymentsFound: response.paymentDetails.filter((pd) => pd.transactionType.toUpperCase() === 'PAYMENT' && pd.transactionStatus !== 'SUCCESS').length,
      totalPaymentsFound: response.totalCount,
      refundCount: response.paymentDetails.filter(
        (pd) => pd.transactionType.toUpperCase() === "REFUND"
      ).length,
      sortingBy: response.sortingBy ? response.sortingBy : null,
      sortingType:
        response.sortingType !== null
          ? response.sortingType.toLowerCase()
          : null,
      loading: false,
    });

    if (response.sortingBy == "collectionReferenceNo") {
      this.setState({
        sortingBy: "collectionReferenceNumber",
      });
    }

    // var paymentDetails = [{
    //     requestorTransactionId: '12345',
    //     paymentCurrency: 'INR',
    //     paymentAmount: 2000
    // }]

    const _response = response.paymentDetails;
    for (let i = 0; i < _response.length; i++) {
      for (let j = 1; j < _response.length; j++) {
        if (
          _response[i].transactionType === "PAYMENT" &&
          _response[i].status !== "AWAITING_PAYMENT" &&
          _response[i].status !== "PAID" &&
          _response[i].status !== "PARTIALLY_PAID" &&
          _response[i].status !== "PARTIALLY_REFUNDED" &&
          _response[i].status !== "FULLY_REFUNDED" &&
          _response[i].status !== "REFUNDED" &&
          _response[i].status !== "SETTLED" &&
          _response[i].transactionId === _response[j].transactionId
        ) {
          _response[i].parentTransactionId = _response[i].transactionId;
        }
      }
    }

    this.setState({
      searchedPaymentResultList: _response,
    });

    await this.setState({
      parentTransactions: [
        ...this.state.searchedPaymentResultList?.filter(
          (sp) => sp.transactionType.toUpperCase() === "PAYMENT"
        ),
      ],
      pageNo: paramPageNo
    });

    this.pageWiseSorting("Payment");

    const newState = {...this.state};

    newState.apply1Click = true;
    newState.apply2Click = false;
    newState.showProcessedTable = true;
    if(this.state.isFirstCall){
      newState.isFirstCall = false;
    }
    
    this.setState(newState);

    if(activeFilterType){
      await this.setState({
        status: [
          { text: 'All', value: 'ALL', isChecked: activeFilterType == QuickFilters.ALL },
          { text: "Awaiting Payment", value: "AWAITING_PAYMENT", isChecked: this.state.selectedStatuses.includes("AWAITING_PAYMENT") },
          { text: "Partially Paid", value: "PARTIALLY_PAID", isChecked: this.state.selectedStatuses.includes("PARTIALLY_PAID") },
          { text: "Paid", value: "PAID", isChecked: this.state.selectedStatuses.includes("PAID") },
          { text: "Refunded", value: "REFUNDED", isChecked: this.state.selectedStatuses.includes("REFUNDED") },
          { text: "Cancelled", value: "CANCELLED", isChecked: this.state.selectedStatuses.includes("CANCELLED") },
          { text: "Expired", value: "EXPIRED", isChecked: this.state.selectedStatuses.includes("EXPIRED") },
          { text: "In Process", value: "IN_PROCESS", isChecked: this.state.selectedStatuses.includes("IN_PROCESS") },
          { text: "Failed", value: "FAILED", isChecked: this.state.selectedStatuses.includes("FAILED") },
        ]
      })
    }
  };

  updateMerchantId = async (merchantID) => {
    const storedMerchantId = StorageService.get(StorageKeys.merchantId);
    await this.setState({ merchantId: storedMerchantId }, () => {
    });
  }

  removeAlreadyPresentBasicStatus = async (val) => {
    switch (val) {
      case "BenePay Transaction Id":
        await this.setState({ searchedBenePayTransactionId: "" });
        break;
      case "Requestor Transaction Id":
        await this.setState({ searchedRequestorTransactionId: "" });
        break;
      case "Payer Email":
        await this.setState({ payerEmail: "" });
        break;
      case "Payer Name":
        await this.setState({ payerName: "" });
        break;
      case "Mobile Number":
        await this.setState({ mobileNumber: "" });
        break;
      case "Collection Reference":
        await this.setState({ collectionRef: "" });
        // console.log("In", val, this.state.collectionRef);
        break;
        case "Transaction Creation Mode":
        await this.setState({ selectedTransactionCreationMode: "" });
        break;
      default:
        break;
    }

    this.handlePageChange({ selected: this.state.pageNo-1 });
  };

  rejectedClear = async () => {
    this.setState({
      rejectedReceiptStartDate: "",
      rejectedReceiptEndDate: "",
    });
  };

  clearFailedTransactionForm = () => {
    this.setState({
      failedAttemptStartDate: "",
      failedAttemptEndDate: "",
      requestedCcy: "",
      instructedAmountCcy: "",
      fromAmount: "",
      toAmount: "",
      payerEmail: "",
      collectionReference: "",
      benepayPaymentRef: "",
      failedTransactions: null,
    });
  };

  failedPaymentNavigationHandler = async () => {
    this.setState({
      showProcessedTable: false,
      rejectedTableShow: false,
      apply1Click: false,
      apply2Click: false,
      rejectedFilePagination: false,
    });
    this.clearFailedTransactionForm();
    this.clearProcessedDetails();
    this.rejectedClear();
  };

  applyFailedTransactionHandleClick = async () => {
    this.setState({ initalPageFailed: 0 });
    this.applyFailedTransactionHandler(1);
  };

  applyFailedTransactionHandler = async (paramPageNo) => {
    this.setState({ loading: true });
    const request = {};
    if (this.state.failedAttemptStartDate) {
      request.attemptStartDate = moment(
        this.state.failedAttemptStartDate
      ).format(DefaultDateFormat.dateFormat);
    }
    if (this.state.failedAttemptEndDate) {
      request.attemptEndDate = moment(this.state.failedAttemptEndDate).format(
        DefaultDateFormat.dateFormat);
    }
    if (this.state.requestedCcy) {
      request.requestedCcy = this.state.requestedCcy;
    }
    if (this.state.fromAmount) {
      request.requestedMinAmount = +this.state.fromAmount;
    }
    if (this.state.toAmount) {
      request.requestedMaxAmount = +this.state.toAmount;
    }
    if (this.state.payerEmail) {
      request.payerEmail = this.state.payerEmail;
    }
    if (this.state.collectionReference) {
      request.collectionRef = this.state.collectionReference;
    }
    if (this.state.benepayPaymentRef) {
      request.transactionId = this.state.benepayPaymentRef;
    }
    if (this.state.pageNo) {
      request.pageNo = paramPageNo;
    }
    if (this.state.pageSize) {
      request.pageSize = this.state.pageSize;
    }
    if (this.state.selectedTransactionCreationMode) {
      request.selectedTransactionCreationMode = this.state.selectedTransactionCreationMode;
    }
    this.getFailedTransactions(request);
  };

  submitCancellationRequest = async () => {
    this.setState({ loading: true });
    const request = {
      transactionId: this.state.selectedTransactionId,
      reason: this.state.cancellationReason,
    };

    const response = await DashboardService.cancelPayment(request);
    this.setState({
      loading: false,
      showCancellationModal: false,
      showCancellationReason: false,
      paymentStatus: response.paymentStatus,
    });
    if (!response) {
      return;
    }

    /**
     * @author Ragavan
     * Use to showing a success message of the cancellation
     */
    if (this.state.paymentStatus === "CANCELLED") {
      this.setState({
        showCancellationModal: true,
        showCancellationSuccessModal: true,
        selectedStatus: "CANCELLED",
        selectedTransactionId: this.state.selectedTransactionId,
        selectedReasonForCharges: this.state.cancellationReason,
      });
    }else{
      response.validationErrors.forEach(data => {
        toast.error(data.errorDescription);
      });
    }

    this.processedApply(this.state.pageNo);
  };

  handleOnChange = (e) => {
    this.setState({ selectedOption: e.target.value });
    if (e.target.value === "Full Refund") {
      this.setState({
        refundAmount: this.state.fullRefundAmt,
        refundCcy: this.state.fullRefundCcy,
      });
    } else {
      this.setState({
        refundAmount: "",
        refundCcy: this.state.fullRefundCcy,
      });
    }
  };

  refundAmountCal = async (item) => {
    // let data = this.state.serachedPaymentResultList;
    // let initialAmount = item.finalDueAmount;
    // let amount = 0;
    // data.forEach(value => {
    //     if ((value.transactionId).includes(item.transactionId) && value.transactionType === "REFUND") {
    //         amount += parseFloat(value.finalDueAmount);
    //     }
    // });
    // amount = Math.round(amount * 100) / 100;
    // let formattedAmount = amount.toFixed(2);

    this.setState({
      remainingAmt: item.maxRefundAmount,
    });
  };

  handleRefundAmountChange = (e) => {
    try {
        var refundAmount = e.target.value.replace(/[^0-9.]/g, '');

        if(refundAmount != ""){
          var isValidAmount = Validator.AmountValidation(refundAmount);
          
          if(isValidAmount){
            this.setState({ refundAmountValidationErrMsg:""});

            if(!_.isEmpty(this.state.refundReason) && this.state.refundReason !== null){
              this.setState({ disableRefundConfirmBtn: false });
            }else{
              this.setState({ disableRefundConfirmBtn: true });
            }
          }else{
            this.setState({ refundAmountValidationErrMsg : "Invalid Amount", disableRefundConfirmBtn:true });
          }
        }
        else{
          this.setState({ disableRefundConfirmBtn: true });
        }

        this.setState({ refundAmount: refundAmount });
    } catch (error) {
      console.error(error);
    }
  };

  handleRefundReason = (e) => {
    this.setState({ refundReason: e.target.value },
      () => {
        if(!_.isEmpty(this.state.refundReason) && this.state.refundReason !== null && this.state.refundAmount !== null && !_.isEmpty(this.state.refundAmount)){
          this.setState({ disableRefundConfirmBtn: false });
        }else{
          this.setState({ disableRefundConfirmBtn: true });
        }
      }
    );
  };

  handleRefundCcyChange = (e) => {
    this.setState({ refundCcy: e.target.value });
  };

  refundClick = async (event, item) => {
    this.refundAmountCal(item);

    // console.log("item", item);
    event.stopPropagation();
    if (
      item.status === "PAID" ||
      item.status === "PARTIALLY_REFUNDED" ||
      item.status === "REFUNDED"
    ) {
      this.setState({
        transactionDetailsModal: false,
        paymentDetailsOpen: false,
        showRefundConfirmationModal: true,
        showModal: true,
        refundAmount: "",
        refundCcy: item.collectionCurrency,
        selectedOption: "Partial Refund",
        fullRefundAmt: item.paymentAmount,
        fullRefundCcy: item.collectionCurrency,
        refundTransactionId: item.transactionId,
        paymentAttempts: item.paymentAttempts,
      });
      return;
    }
    if (item.status.toUpperCase() === "AWAITING_PAYMENT") {
      this.setState({
        transactionDetailsModal: false,
        showCancellationModal: true,
        selectedTransactionId: item.transactionId,
        selectedStatus: item.status,
        selectedFinalDueAmount: item.finalDueAmount,
        selectedReceiptTimestamp: item.receiptTimestamp,
        selectedDebtorName: item.debtorName,
        selectedDebtorEmailId: item.debtorEmailId,
        selectedCollectionRefNumber: item.collectionReferenceNumber,
        selectedReasonForCharges: item.reasonForCharges,
        selectedCollectionCurrency: item.collectionCurrency,
        selectedCreateTimeStamp: item.createTimeStamp,
      });
    }

    if (item.status.toUpperCase() === "") {
    }
  };

  cancelRefund = async () => {
    this.setState({
      refundReason: "",
      selectedOption: "Partial Refund",
      refundAmount: "",
    });
    this.setState({
      showRefundSuccessModal: false,
      showRefundConfirmationModal: false,
      refundReason: "",
      selectedOption: "F",
      refundAmount: "",
      showConfirmationModal: false,
      showModal: false,
    });
  };

  cancelSettlement = async () => {
    this.setState({
      paymentSettlementModel: false,
      settlementDate: "",
    });
    this.props.history.push("/home");
  };

  confirmBack = async () => {
    this.setState({
      showRefundSuccessModal: false,
      showRefundConfirmationModal: false,
      showFailureModal: false,
    });
  };

  confirmRefund = async () => {
    this.setState({ loading: true });
    var refundObj = {
      transactionId: this.state.refundTransactionId,
      refundType: this.state.selectedOption === "Full Refund" ? "F" : "P",
      refundCcy: this.state.refundCcy,
      refundAmt: this.state.refundAmount,
      refundReason: this.state.refundReason,
    };

    if (
      this.state.selectedOption !== "Full Refund" &&
      parseFloat(this.state.refundAmount) > parseFloat(this.state.remainingAmt)
    ) {
      toast("The entered amount should not exceed the remaining amount", {
        position: toast.POSITION.BOTTOM_CENTER,
        className: "toast-message toast-info",
      });
      this.setState({ loading: false });
      return;
    }

    const response = await DashboardService.initiateRefund(
      refundObj,
      this.state.refundTransactionId
    );
    // console.log("refund response ", response);
    this.setState({
      refundReason: "",
      loading: false,
      refundResponse: response,
    });
    if (!response) {
      toast("Something went wrong, Please try again later", {
        position: toast.POSITION.BOTTOM_CENTER,
        className: "toast-message toast-error",
      });
      return;
    }
    if (response.errors || (response.status && response.status != null && response.status === "FAILURE")) {
      const firstElement = response.errors != null ? response.errors[0] :'';
      // // console.log("this is error  ", firstElement);
      if (firstElement) {
        const errorDesc = firstElement.errorDescription;
        // // console.log("this is error desc ", errorDesc);
        this.setState({
          errorDesc: errorDesc,
        });
      }
      this.setState({
        showFailureModal: true,
        showRefundConfirmationModal: false,
        refundReview: false,
      });
      return;
    }
    if (
      response.status &&
      response.status.toString() === "REFUNDED"
    ) {
      this.setState({
        showRefundSuccessModal: true,
        showRefundConfirmationModal: false,
        refundReview: false,
        refundAmount: ''
      });
      this.processedApply(this.state.pageNo);
    }
  };

  paymentSettlement = async () => {
    this.setState({
      paymentSettlementModel: true,
    });
  };

  downloadSettlementFile = async () => {
    var searchObj = {
      settlementDate: this.state.settlementDate,
    };
    this.setState({
      paymentSettlementModel: false,
      loading: true,
    });
    const response = await DashboardService.downloadTransactionsReport(
      searchObj,
      "settlement"
    );
    this.setState({
      loading: false,
    });
    if (!response || response.content) {
      return;
    }
    this.props.history.push("/home");
    if (!response.fileName) {
      toast("Requested File not found", {
        position: toast.POSITION.BOTTOM_CENTER,
        className: "toast-message toast-info",
      });
      return;
    }
    var blob = this.base64toBlob(response.content, "text/csv");
    if (window.navigator.msSaveBlob) {
      window.navigator.msSaveOrOpenBlob(blob, response.fileName + ".csv");
    } else {
      var a = window.document.createElement("a");
      a.href = window.URL.createObjectURL(blob, { type: "text/plain" });
      a.download = response.fileName + ".csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  rejectedApply = async () => {
    this.setState({
      noRejectedResultFound: false,
      showValidationMsg: false,
    });

    var searchObj = {
      receiptStartDate: this.state.rejectedReceiptStartDate,
      receiptEndDate: this.state.rejectedReceiptEndDate,
    };

    if (this.state.rejectedReceiptStartDate) {
      searchObj.receiptStartDate = moment(
        this.state.rejectedReceiptStartDate
      ).format(DefaultDateFormat.dateFormat);
    }
    if (this.state.rejectedReceiptEndDate) {
      searchObj.receiptEndDate = moment(
        this.state.rejectedReceiptEndDate ).format(DefaultDateFormat.dateFormat);
    }

    if (
      !this.state.rejectedReceiptStartDate ||
      !this.state.rejectedReceiptEndDate
    ) {
      this.setState({
        showValidationMsg: true,
        rejectedTableShow: false,
      });
    } else {
      this.setState({
        loading: true,
      });
      const response = await DashboardService.getRejectedPaymentSearchResult(
        searchObj
      );
      this.setState({
        loading: false,
      });
      if (!response || response.beneRejectedPayments.length == 0) {
        this.setState({
          noRejectedResultFound: true,
        });

        return;
      }
      this.setState({
        serachedRejectedPaymentResultList: response.beneRejectedPayments,
      });

      this.setState({
        apply1Click: true,
        apply2Click: true,
        rejectedTableShow: true,
        showValidationMsg: false,
      });
    }
  };

  processedClick = async () => {
    this.setState({
      apply1Click: false,
      apply2Click: false,
      rejectedTableShow: false,
      failedTransactions: undefined,
      rejectedTableShow: false,
      rejectedFilePagination: false,
    });
    this.clearProcessedDetails();
    this.clearFailedTransactionForm();
    this.rejectedClear();
  };

  clearProcessedDetails = async () => {
    let loggedInMerchantID = StorageService.get(StorageKeys.loggedInMerchantID);
    await this.setState({
      // isFirstCall: true,
      receiptStartDate: null,
      receiptEndDate: null,
      paymentStartDate: null,
      paymentEndDate: null,
      cancellationFromDate: null,
      cancellationToDate: null,
      requestedCcy: null,
      requestedMinAmount: "",
      requestedMaxAmount: "",
      paidCcy: null,
      paidMinAmount: "",
      paidMaxAmount: "",
      paymentMode: "",
      payerName: "",
      collectionRef: "",
      searchedBenePayTransactionId: "",
      searchedRequestorTransactionId: "",
      payerEmail: "",
      apply1Click: false,
      apply2Click: false,
      showProcessedTable: false,
      merchantId: loggedInMerchantID ? loggedInMerchantID : this.state.subMerchantIds && this.state.subMerchantIds.length > 0 ? 'All' : null,
      selectedMerchant: loggedInMerchantID ? loggedInMerchantID : this.state.subMerchantIds && this.state.subMerchantIds.length > 0 ? 'All' : null,
      sortingType: null,
      sortingBy: null,
      pageSize: Pagination.transactionPageSize,
      alreadyAppliedFilters: null,
      formFields: this.prepareField(this.fieldNames, this.rule),
      mobileNumber: "",
      selectedTransactionCreationMode:"",
      selectedSettlementStatus:"All"
    });

    // Clear the checkboxes
    const updatedStatus = this.state.status.map((statusItem) => ({
      ...statusItem,
      isChecked: false,
    }));

    // document.getElementById("requestedCcySelect").selectedIndex = 0;
    // document.getElementById("paidCcySelect").selectedIndex = 0;

    await this.setState({ status: updatedStatus });
    await this.setState({ selectedStatuses: [] });
    await this.setState({ initalPage: 0 ,pageNoForRedirect:0});

    // this.setActiveFilter();
    this.processedApply(1, false, null, true);
    // this.updateActiveFilter("","","statusFilters")
  };

  rejectedClick = async () => {
    this.setState({
      apply1Click: false,
      apply2Click: true,
      section1show: true,
      noRejectedResultFound: false,
      showProcessedTable: false,
      noResultFound: false,
      rejectedTableShow: false,
      rejectedFilePagination: true,
      failedTransactions: undefined,
    });
  };

  removeAlreadyPresentStatus = (data) => {
    this.state.selectedStatuses = [];
    this.state.teststatuscheck = [];

    const item = data;

    // // console.log('item ', item , this.state.status, this.state.selectedStatuses);

    let index = -1;
    const isChecked = true;
    for (var j = 0; j < this.state.status.length; j++) {
      if (this.state.status[j].value === item) {
        this.state.status[j].isChecked = isChecked;
      }
      // if (this.state.status[j].name === "ALL" && !isChecked) {
      //     this.state.status[j].isChecked = false;
      // }
    }

    this.setState({ status: this.state.status });

    for (var j = 0; j < this.state.status.length; j++) {
      if (this.state.status[j].isChecked === true) {
        if (this.state.status[j].value !== "ALL") {
          this.state.teststatuscheck.push(this.state.status[j].value);
        }
      }
    }
    this.state.selectedCurrencies = [];

    for (var j = 0; j < this.state.status.length; j++) {
      for (var k = 0; k < this.state.teststatuscheck.length; k++) {
        if (this.state.status[j].value === this.state.teststatuscheck[k]) {
          if (this.state.status[j].value !== "ALL") {
            this.state.selectedStatuses.push(this.state.status[j].value);
          }
        }
      }
    }

    let fruites = this.state.status;

    fruites.forEach((fruite) => {
      if (fruite.value == item && isChecked) {
        fruite.isChecked = false;
      }
    });

    this.setState({ status: fruites });

    for (var j = 0; j < this.state.status.length; j++) {
      for (var k = 0; k < this.state.teststatuscheck.length; k++) {
        if (
          this.state.status[j].value === this.state.teststatuscheck[k].value
        ) {
          if (this.state.status[j].value !== "ALL") {
            this.state.selectedStatuses.push(this.state.status[j].value);
          }
        }
      }
    }

    if (item == "ALL" && isChecked) {
      this.state.selectedStatuses = [];
      for (var j = 0; j < this.state.status.length; j++) {
        if (this.state.status[j].value !== "ALL") {
          this.state.selectedStatuses.push(this.state.status[j].value);
        }
        let fruites = this.state.status;

        fruites.forEach((fruite) => (fruite.isChecked = true));
        this.setState({ status: fruites });
      }
    }
    if (item == "ALL" && !isChecked) {
      this.state.selectedStatuses = [];
      for (var j = 0; j < this.state.status.length; j++) {
        let fruites = this.state.status;

        fruites.forEach((fruite) => (fruite.isChecked = false));
        this.setState({ status: fruites });
      }
    }

    let sStatus = this.state.selectedStatuses;
    let val = this.state.selectedStatuses.indexOf(data.toUpperCase());
    if (val !== -1) {
      sStatus.splice(val, 1);
      this.setState({
        selectedStatuses: sStatus,
      });
    }

    // this.handlePageChange({ selected: this.state.pageNo -1 });
    this.updateActiveFilter("","","statusFilters");

    // // console.log('After', item , this.state.status , this.state.selectedStatuses, sStatus, val ,data);
  };

  handleStatusChange = (e) => {
    e.persist();
    this.state.selectedStatuses = [];
    this.state.teststatuscheck = [];

    const item = e.target.name;

    // // console.log('item ', item);

    let index = -1;
    const isChecked = e.target.checked;
    for (var j = 0; j < this.state.status.length; j++) {
      if (this.state.status[j].value === item) {
        this.state.status[j].isChecked = isChecked;
      }
      // if (this.state.status[j].name === "ALL" && !isChecked) {
      //     this.state.status[j].isChecked = false;
      // }
    }

    this.setState({ status: this.state.status });

    for (var j = 0; j < this.state.status.length; j++) {
      if (this.state.status[j].isChecked === true) {
        if (this.state.status[j].value !== "ALL") {
          this.state.teststatuscheck.push(this.state.status[j].value);
        }
      }
    }
    this.state.selectedCurrencies = [];

    for (var j = 0; j < this.state.status.length; j++) {
      for (var k = 0; k < this.state.teststatuscheck.length; k++) {
        if (this.state.status[j].value === this.state.teststatuscheck[k]) {
          if (this.state.status[j].value !== "ALL") {
            this.state.selectedStatuses.push(this.state.status[j].value);
          }
        }
      }
    }

    let fruites = this.state.status;

    fruites.forEach((fruite) => {
      if (fruite.value == item && isChecked) {
        fruite.isChecked = true;
      }
    });

    this.setState({ status: fruites });

    for (var j = 0; j < this.state.status.length; j++) {
      for (var k = 0; k < this.state.teststatuscheck.length; k++) {
        if (
          this.state.status[j].value === this.state.teststatuscheck[k].value
        ) {
          if (this.state.status[j].value !== "ALL") {
            this.state.selectedStatuses.push(this.state.status[j].value);
          }
        }
      }
    }

    if (item == "ALL" && isChecked) {
      this.state.selectedStatuses = [];
      for (var j = 0; j < this.state.status.length; j++) {
        if (this.state.status[j].value !== "ALL") {
          this.state.selectedStatuses.push(this.state.status[j].value);
        }
        let fruites = this.state.status;

        fruites.forEach((fruite) => (fruite.isChecked = true));
        this.setState({ status: fruites });
      }
    }
    if (item == "ALL" && !isChecked) {
      this.state.selectedStatuses = [];
      for (var j = 0; j < this.state.status.length; j++) {
        let fruites = this.state.status;

        fruites.forEach((fruite) => (fruite.isChecked = false));
        this.setState({ status: fruites });
      }
    }

    this.updateActiveFilter("", "", "statusFilters");

    // const hasFalse = this.state.status.some(element => element.isChecked === false);
    // if(hasFalse){
    //   for (let j = 0; j < this.state.status.length; j++) {
    //     if (this.state.status[j].value.toLowerCase() === "ALL") {
    //       this.state.selectedStatuses.push(this.state.status[j].isChecked = false);
    //     }
    //   }
    // }

  };

  getDecimalCurrency = async () => {
    const response = await DashboardService.fetchCurrencyDecimals();
    console.log("getSupportedCurrency", response);
    if (response && response.data && response.data.currencyList.length > 0) {
          let newObj = [];
      response.data.currencyList.forEach(element => {
        newObj.push({code: element.code, value: element.code, decimal:element.decimal});

      });
      this.setState({ currencyList: newObj })
    }
  }

  downloadTransactions = async () => {

    this.setState({
      loading: true,
    });
    var searchObj = {
      status: this.state.selectedStatuses,
      receiptStartDate: this.state.receiptStartDate,
      receiptEndDate: this.state.receiptEndDate,
      paymentStartDate: this.state.paymentStartDate,
      paymentEndDate: this.state.paymentEndDate,
      requestedCcy:
        this.state.requestedCcy || this.setNullIfEmpty(this.state.requestedCcy),
      requestedMinAmount:
        this.state.requestedMinAmount ||
        this.setNullIfEmpty(this.state.requestedMinAmount),
      requestedMaxAmount:
        this.state.requestedMaxAmount ||
        this.setNullIfEmpty(this.state.requestedMaxAmount),
      paymentMode:
        this.state.paymentMode || this.setNullIfEmpty(this.state.paymentMode),
      payerName:
        this.state.payerName || this.setNullIfEmpty(this.state.payerName),
      collectionRef: this.state.collectionRef,
      pageSize: this.state.pageSize,
      defaultSearch: false,
      transactionId:
        this.state.searchedBenePayTransactionId ||
        this.setNullIfEmpty(this.state.searchedBenePayTransactionId),
      requestorTransactionId:
        this.state.searchedRequestorTransactionId ||
        this.setNullIfEmpty(this.state.searchedRequestorTransactionId),
      payerEmail:
        this.state.payerEmail || this.setNullIfEmpty(this.state.payerEmail),
      cancellationFromDate: this.state.cancellationFromDate,
      cancellationToDate: this.state.cancellationToDate,
      paidCcy: this.state.paidCcy || this.setNullIfEmpty(this.state.paidCcy),
      paidMinAmount:
        this.state.paidMinAmount ||
        this.setNullIfEmpty(this.state.paidMinAmount),
      paidMaxAmount:
        this.state.paidMaxAmount ||
        this.setNullIfEmpty(this.state.paidMaxAmount),
      showAllRecords: false,
      // allMerchant: false
    };
    // @todo following date formats need to integrate from generic method
    if (this.state.receiptStartDate) {
      searchObj.receiptStartDate = moment(this.state.receiptStartDate).format(
        DefaultDateFormat.dateFormat);
    }
    if (this.state.receiptEndDate) {
      searchObj.receiptEndDate = moment(this.state.receiptEndDate).format(
        DefaultDateFormat.dateFormat);
    }
    if (this.state.paymentStartDate) {
      searchObj.paymentStartDate = moment(this.state.paymentStartDate).format(
        DefaultDateFormat.dateFormat);
    }
    if (this.state.paymentEndDate) {
      searchObj.paymentEndDate = moment(this.state.paymentEndDate).format(
        DefaultDateFormat.dateFormat);
    }
    if (this.state.cancellationFromDate) {
      searchObj.cancellationFromDate = moment(
        this.state.cancellationFromDate).format(DefaultDateFormat.dateFormat);
    }
    if (this.state.cancellationToDate) {
      searchObj.cancellationToDate = moment(
        this.state.cancellationToDate
      ).format(DefaultDateFormat.dateFormat);
    }

    if (this.state.requestedMinAmount) {
      searchObj.requestedMinAmount = parseInt(this.state.requestedMinAmount);
    }
    if (this.state.requestedMaxAmount) {
      searchObj.requestedMaxAmount = parseInt(this.state.requestedMaxAmount);
    }
    if (this.state.paidMinAmount) {
      searchObj.paidMinAmount = parseInt(this.state.paidMinAmount);
    }
    if (this.state.paidMaxAmount) {
      searchObj.paidMaxAmount = parseInt(this.state.paidMaxAmount);
    }
    if (!searchObj.status.length) {
      searchObj.status = null;
    }

    var objFields = Object.keys(searchObj);
    var allFieldsBoolean = false;

    if (TempStorage.loginUserRole === USER_TYPE.ADMIN_USER || this.state.referralPartners.merchantType == OnboardConstants.ReferralMerchant || this.state.subMerchantIds.length > 0) {
      if (
        !this.state.merchantId &&
        !searchObj.transactionId &&
        !searchObj.status &&
        !searchObj.receiptStartDate &&
        !searchObj.receiptEndDate &&
        !searchObj.paymentStartDate &&
        !searchObj.paymentEndDate &&
        !searchObj.requestedCcy &&
        !searchObj.requestedMinAmount &&
        !searchObj.requestedMaxAmount &&
        !searchObj.paidCcy &&
        !searchObj.paidMinAmount &&
        !searchObj.paidMaxAmount &&
        !searchObj.paymentMode &&
        !searchObj.payerName &&
        !searchObj.collectionRef &&
        !searchObj.requestorTransactionId &&
        !searchObj.payerEmail &&
        !searchObj.cancellationFromDate &&
        !searchObj.cancellationToDate
      ) {
        this.setState({
          merchantId: "All",
          selectedMerchant: "All",
          receiptStartDate: thirtyDaysAgo,
          receiptEndDate: currentDate,
        });
        searchObj.receiptStartDate = thirtyDaysAgoStr;
        searchObj.receiptEndDate = currentDateStr;
      }

      if (
        searchObj.transactionId ||
        searchObj.status ||
        searchObj.receiptStartDate ||
        searchObj.receiptEndDate ||
        searchObj.paymentStartDate ||
        searchObj.paymentEndDate ||
        searchObj.requestedCcy ||
        searchObj.requestedMinAmount ||
        searchObj.requestedMaxAmount ||
        searchObj.paidCcy ||
        searchObj.paidMinAmount ||
        searchObj.paidMaxAmount ||
        searchObj.paymentMode ||
        searchObj.payerName ||
        searchObj.collectionRef ||
        searchObj.requestorTransactionId ||
        searchObj.payerEmail ||
        searchObj.cancellationFromDate ||
        searchObj.cancellationToDate
      ) {
        if (!this.state.merchantId) {
          this.setState({ merchantId: "All", selectedMerchant: "All" });
        }
      }

      if (this.state.merchantId == "All") {
        searchObj.allMerchant = true;
      }

      if (this.state.merchantId !== "All" && this.state.merchantId !== null) {
        searchObj.merchantId = this.state.merchantId;
      }
    }

    if (
      !searchObj.status &&
      !searchObj.receiptStartDate &&
      !searchObj.receiptEndDate &&
      !searchObj.paymentStartDate &&
      !searchObj.paymentEndDate &&
      !searchObj.requestedCcy &&
      !searchObj.requestedMinAmount &&
      !searchObj.requestedMaxAmount &&
      !searchObj.paidCcy &&
      !searchObj.paidMinAmount &&
      !searchObj.paidMaxAmount &&
      !searchObj.paymentMode &&
      !searchObj.payerName &&
      !searchObj.collectionRef &&
      !searchObj.requestorTransactionId &&
      !searchObj.transactionId &&
      !searchObj.payerEmail &&
      !searchObj.cancellationFromDate &&
      !searchObj.cancellationToDate
    ) {
      allFieldsBoolean = true;
    }

    // if (allFieldsBoolean) {
    //   searchObj = { defaultSearch: false };
    // }

    if (TempStorage.loginUserRole === USER_TYPE.ADMIN_USER || this.state.referralPartners.merchantType == OnboardConstants.ReferralMerchant || this.state.subMerchantIds.length >0) {
      const selectedMerchantId = StorageService.get(StorageKeys.merchantId);
      searchObj.merchantId = selectedMerchantId;
    }

    
    const response = await DashboardService.downloadTransactionsReport(
      searchObj,
      "report"
    );
    this.setState({ loading: false });
    if (!response || !response.content) {
      return;
    }
   
    var blob = this.base64toBlob(response.content, "text/csv");
    if (window.navigator.msSaveBlob) {
      window.navigator.msSaveOrOpenBlob(blob, response.fileName + ".csv");
    } else {
      var a = window.document.createElement("a");
      a.href = window.URL.createObjectURL(blob, { type: "text/plain" });
      a.download = response.fileName + ".csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  base64toBlob = function (base64Data, contentType) {
    contentType = contentType || "";
    var sliceSize = 1024;
    var byteCharacters = atob(base64Data);
    //var byteCharacters = decodeURIComponent(escape(window.atob(base64Data)))
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      var begin = sliceIndex * sliceSize;
      var end = Math.min(begin + sliceSize, bytesLength);

      var bytes = new Array(end - begin);
      for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
  };

  getFailedTransactions = async (request) => {
    const response = await DashboardService.getAllFailedTransactions(request);
    this.setState({ loading: false });
    if (!response) {
      return;
    }
    //
    let totalFailedPages = response.totalCount / this.state.pageSize;
    this.setState({
      totalFailedPages: Math.ceil(totalFailedPages),
    });
    //
    // // console.log("SUSHMIT PRINTING :", response);
    await this.setState({
      failedTransactions: response.list,
      totalFailedCount: response.totalCount,
    });
    this.pageWiseSorting("Failed");
    // this.clearFailedTransactionForm()
    // // console.log('failedTransactions ', this.state.failedTransactions);
  };

  getPaymentDetails = async (paymentId) => {
    this.setState({ loading: true });

    const response = await DashboardService.getPaymentDetails(paymentId);

    // // console.log("response", response)
    if (response !== undefined && Object.keys(response).length !== 0) {
      this.setState({
        paymentDetails: response,
        loading: false,
        transactionDetailsModal: false,
        showCancellationModal: false,
        paymentDetailsOpen: true,
      });
    } else {
      this.setState({ loading: false });
      toast("Unable to get the Payment Details", {
        position: toast.POSITION.BOTTOM_CENTER,
        className: "toast-message toast-error",
      });
    }
  };

  getMerchantPreferences = async () => {
    let result = await DashboardService.getMerchantPreferences();
    if(result){
      this.setState({
        allowPaymentByScreen: result.allowPaymentByScreen,
        allowRefundByScreen: result.allowRefundByScreen,
        allowCancellationByScreen: result.allowCancellationByScreen,
        merchantTimeZone:result.merchantTimeZone,
        manualPaySettlementAmtCcy: result.merchantSettlementCcy,
        manualPaySettlementAmtCcy: result.merchantSettlementCcy,
        allowManualPayment: result.allowManualPay == 1 ? true : false,
      })
    }
  }

  componentDidMount = async () => {
  
    const loggedInMerchantID = StorageService.get(StorageKeys.loggedInMerchantID);
    const partialPaymentAllowedForMerchant = StorageService.get(StorageKeys.partialPaymentAllowedForMerchant);    

    if (loggedInMerchantID != null && loggedInMerchantID !== "") {
      this.setState({ loggedInMerchantID: loggedInMerchantID }
      )
    }

    if (partialPaymentAllowedForMerchant != null && partialPaymentAllowedForMerchant !== "") {
      this.setState({ partialPaymentAllowedForMerchant: partialPaymentAllowedForMerchant == 'true' ? true : false });
    }

    this.setState({ isDeviceMobile: false, loggedInMerchantID: '' });

    if (
      this.props.location.state &&
      this.props.location.state.isSettlementRequested
    ) {
      this.paymentSettlement();
    }
    await Auth.currentSession().then((res) => {
      let jwt = res["idToken"]["jwtToken"];
      StorageService.set(StorageKeys.clientJwt, jwt);
    });

    await this.getUserInfo();
    await this.getMerchantPreferences();

    if (TempStorage.loginUserRole === USER_TYPE.ADMIN_USER) {
      const response = await DashboardService.getMerchantSummaryList();
      const addOption = { merchantId: "All", merchantName: "All" };
      response.merchantSummary = [addOption, ...response.merchantSummary]; //Add a All option in merchants array

      if (Object.keys(response).length !== 0) {
        this.setState({ merchantsList: response.merchantSummary });
      }
      const merchantId = StorageService.get(StorageKeys.merchantId);
      this.setState({ merchantId: merchantId});
      // console.log("this.state.merchantId in line 2338", this.state.merchantId);
      
    }

    if (TempStorage.loginUserRole !== USER_TYPE.ADMIN_USER) {
      this.setState({
        status: [
          { text: "All", value: "ALL", isChecked: false },
          {
            text: "Awaiting Payment",
            value: "AWAITING_PAYMENT",
            isChecked: false,
          },
          { text: "Partially Paid", value: "PARTIALLY_PAID", isChecked: false },
          { text: "Paid", value: "PAID", isChecked: false },
          // { text: 'Partially Refunded', value: "PARTIALLY_REFUNDED", isChecked: false },
          // { text: 'Fully Refunded', value: "FULLY_REFUNDED", isChecked: false },
          { text: "Refunded", value: "REFUNDED", isChecked: false },
          { text: "Cancelled", value: "CANCELLED", isChecked: false },
          { text: "Expired", value: "EXPIRED", isChecked: false },
          { text: "In Process", value: "IN_PROCESS", isChecked: false },
          { text: "Failed", value: "FAILED", isChecked: false }
        ],
      });
    } else {
      this.setState({
        status: [
          { text: "All", value: "ALL", isChecked: false },
          {
            text: "Awaiting Payment",
            value: "AWAITING_PAYMENT",
            isChecked: false,
          },
          { text: "Partially Paid", value: "PARTIALLY_PAID", isChecked: false },
          { text: "Paid", value: "PAID", isChecked: false },
          // { text: 'Partially Refunded', value: "PARTIALLY_REFUNDED", isChecked: false },
          // { text: 'Fully Refunded', value: "FULLY_REFUNDED", isChecked: false },
          { text: "Refunded", value: "REFUNDED", isChecked: false },
          { text: "Cancelled", value: "CANCELLED", isChecked: false },
          { text: "Expired", value: "EXPIRED", isChecked: false },
          // { text: "Settled", value: "SETTLED", isChecked: false },
          { text: "In Process", value: "IN_PROCESS", isChecked: false },
          { text: "Failed", value: "FAILED", isChecked: false }
        ],
      });
    }

    this.getSupportedCurrency();
    this.getDecimalCurrency();

    // Adding default filter with 7days
    const currentDate = new Date();
    const dateBefore7Days = new Date();
    dateBefore7Days.setDate(currentDate.getDate() - 7);
    this.setState({
      receiptStartDate: dateBefore7Days,
      receiptEndDate: currentDate,
      loading: true
    })
    this.handleApplyClickPaymentSettlement();
    
    this.getTransactionCreationMode();
    window.addEventListener("touchstart", (e) => {
      let statusMenu = document.getElementById("statusMenu");
      let creationDateMenu = document.getElementById("creationDateMenu");

      let elementId = e.target.id;

      if (
        !(
          elementId === "statusDropDown" || elementId === "creationDateDropDown"
        )
      ) {
        if (
          !(
            e.target.classList.contains("avoidToggle") ||
            e.target.classList.contains("MuiInputBase-input")
          )
        ) {
          try {
            statusMenu.classList.remove("d-block");
            creationDateMenu.classList.remove("d-block");
          } catch {
            // // console.log("Classlist is null");
          }
        }
      }
    });

    // UI

    // let amountFilter = document.getElementById("dropdownMenuButtonAmount");
    // let amountFilterDiv = document.getElementById("dropdownDivButtonAmount");
    // amountFilter.addEventListener("click", (e) => {
    //     if (!((e.target.classList.contains('avoidToggle')) || (e.target.classList.contains('MuiInputBase-input')))) {
    //         try {
    //             // console.log("IN here");
    //         } catch {
    //             // // console.log("Classlist is null");
    //         }
    //     }
    // })

    // UI

    var mobilePagination = null;
    if (window.innerWidth < 720) {
      this.setState({ initalPage: 0, isDeviceMobile: true });
      mobilePagination = 1;
    }


    if (TempStorage.loginUserRole !== USER_TYPE.ADMIN_USER) {
      this.processedApply(mobilePagination, true);
    }

    // window.addEventListener('resize', () => {
    //     if(window.innerWidth < 600){
    //         this.setState({ initalPage: 0 , isDeviceMobile: true});
    //         this.processedApply(1);
    //     }t
    // })

    if(TempStorage.userPrivilege && !TempStorage.userPrivilege[PrivilegeConstants.TRANSACTION_SEARCH] && TempStorage.userPrivilege[PrivilegeConstants.REFUND_SEARCH] && document.getElementById("pills-refunds-tab")){
      document.getElementById("pills-refunds-tab").click();
      this.setState({ refundBtnClick: true })
    }

    // this.setActiveFilter();
  };

  componentDidUpdate= (props, preState) =>{
    try {
                  
      if(_.isEmpty(this.state.loggedInMerchantID) || preState.loggedInMerchantID != this.state.loggedInMerchantID){
       
        const loggedInMerchantID = StorageService.get(StorageKeys.loggedInMerchantID);

        if (!_.isEmpty(loggedInMerchantID)) {
          this.setState({ loggedInMerchantID: loggedInMerchantID })
        }
        
      }

      let basicFilters = [
        {
          title: "BenePay Transaction Id",
          key: "searchedBenePayTransactionId",
        },
        {
          title: "Requestor Transaction Id",
          key: "searchedRequestorTransactionId",
        },
        {
          title: "Payer Email",
          key: "payerEmail",
        },
        {
          title: "Payer Name",
          key: "payerName",
        },
        {
          title: "Mobile Number",
          key: "mobileNumber",
        },
        {
          title: "Collection Reference",
          key: "collectionRef",
        },
      ];

      basicFilters.forEach(element => {
        if( preState[element.key] != this.state[element.key]){
          this.updateActiveFilter(element.title, this.state[element.key], "basicFilters");
        }
      });

      let amountFilters = [
        {
          title: "Requested Amount",
          currency: "requestedCcy",
          min: "requestedMinAmount",
          max: "requestedMaxAmount",
        }
      ];

      
      
      amountFilters.forEach(element => {
        // console.log("element", element, preState.formFields[element.min].value, this.state.formFields[element.min].value,  preState.formFields[element.max].value, this.state.formFields[element.max].value, preState[element.currency] , this.state[element.currency] );
        // if( preState.formFields[element.min].value != this.state.formFields[element.min].value || preState.formFields[element.max].value != this.state.formFields[element.max].value  || preState[element.currency] != this.state[element.currency]){
        if( this.state.formFields[element.min].value && this.state.formFields[element.max].value  && (preState[element.currency] != this.state[element.currency])){
          this.updateActiveFilter(element.title, {min: this.state.formFields[element.min].value , max: this.state.formFields[element.max].value , currency: this.state[element.currency]}, "amountFilters")
        }
      });

      let dateFilters = [
          {
            title: "Create Date",
            startDate: "receiptStartDate",
            endDate: "receiptEndDate",
          },
          {
            title: "Payment Date",
            startDate: "paymentStartDate",
            endDate: "paymentEndDate",
          },
          {
            title: "Cancellation Date",
            startDate: "cancellationFromDate",
            endDate: "cancellationToDate",
          },
        ];

      dateFilters.forEach(element => {
        if (preState[element.startDate] != this.state[element.startDate] || preState[element.endDate] != this.state[element.endDate]) {
          let startDate = ""
          let endDate = ""
          if (this.state[element.startDate] != null) {
            startDate = moment(this.state[element.startDate]).format(DefaultDateFormat.dateFormat)

          } if (this.state[element.endDate] != null) {
            endDate = moment(this.state[element.endDate]).format(DefaultDateFormat.dateFormat)

          }
          this.updateActiveFilter(element.title, { startDate: startDate, endDate: endDate }, "dateFilters")
        }
      });


      if (TempStorage.loginUserRole === USER_TYPE.ADMIN_USER) {
        const { merchantId } = this.state;
        const { merchantValue } = this.context;
        
        if ( !Utils.isNullOrEmpty(merchantId) && !Utils.isNullOrEmpty(merchantValue) && merchantId != merchantValue ){
          this.setState({ merchantId: merchantValue}, () => {
            this.processedApply(1);
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  updateActiveFilter = (key, value, type) => {
    this.setState({ isFirstCall: false});
    
    let presentFilters = this.state.alreadyAppliedFilters;
    if(presentFilters){
      let presentFilterTypeValue =  presentFilters[type];

      if(type == "statusFilters" && presentFilterTypeValue){
        let statusArray = [];
        this.state.selectedStatuses.forEach((element) => {
          let val = element.toLowerCase();
          if (element === "AWAITING_PAYMENT") {
            statusArray.push({ text: "Awaiting Payment", value: element });
          } else if (element === "PARTIALLY_PAID") {
            statusArray.push({ text: "Partially Paid", value: element });
          }else if (element === "IN_PROCESS") {
            statusArray.push({ text: "In Process", value: element });
          } else { 
            statusArray.push({
              text: val.charAt(0).toUpperCase() + val.slice(1),
              value: element,
            });
          }
        });
        presentFilterTypeValue.data = statusArray;
        this.setState({alreadyAppliedFilters: presentFilters, showFilterApplied : true});
        return;
      }

      if(presentFilterTypeValue && presentFilterTypeValue.data){
        switch (type) {
          case "basicFilters":
            presentFilterTypeValue.data.forEach(element => {
              if(element.title === key){
                element.value = value;
              }
            });
            break;

          case "amountFilters":
            presentFilterTypeValue.data.forEach(element => {
              if(element.title === key){
                element.min = value.min;
                element.max = value.max;
                element.currency = value.currency;
              }
            });
            break;

          case "dateFilters":
            presentFilterTypeValue.data.forEach(element => {
              if(element.title === key){
                element.startDate = value.startDate;
                element.endDate = value.endDate;
              }
            });
            break;

          default:
            break;
        }

      }
      this.setState({alreadyAppliedFilters: presentFilters, showFilterApplied : true});
    }
  }

 

  handlePageChange = (data) => {
    if (data.selected + 1 > this.state.totalPages) {
      if( this.state.totalPages ){
        data.selected = this.state.totalPages - 1;
      } else {
        data.selected = 0;
      }
    } else if (data.selected <= 0) {
      data.selected = 0;
    }
    this.setState({ initalPage: data.selected });
    this.setState({ pageNo: data.selected + 1 });
    this.processedApply(data.selected + 1);
  };

  handlePageChangeFailedTransaction = (data) => {
    this.setState({ initalPageFailed: data.selected });
    this.setState({ pageNo: data.selected + 1 });
    this.applyFailedTransactionHandler(data.selected + 1);
  };

  handlePaymentDetailsClose = () => {
    this.setState({
      paymentDetailsOpen: false,
      refundModel: false,
      showFailureModal: false,
    });
  };

  /**
   * @author Ragavan
   * This Method Handle to copy the param value to the system clipboard
   *
   * @param {*} value
   */
  handleCopyClick = (value) => {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        toast("Copied! ", {
          position: toast.POSITION.BOTTOM_CENTER,
          className: "toast-message toast-success",
        });
      })
      .catch((error) => {
        console.error("Unable to copy:", error);
      });
  };

  /**
   * @author Ragavan
   *
   * Method Cell click event
   *
   * @param {*} params
   * @param {*} event
   */
  handleCellClick = (params, event) => {
    console.log("row click", params.row);
    if (params.field != "") {
      this.handleTransactionDetails(params, event);
      // console.log("IN HERE FOR TEST", params);
    }
  };

  /**
   * @author Ragavan
   *
   * Method to show the transaction info screen
   *
   * @param {*} params
   * @param {*} event
   */
  handleTransactionDetails = (params, event) => {
    const rowData = params.row;

    // // console.log("SUSH", rowData, rowData.debtorMobileNumber, rowData.row);

    this.setState({
      transactionParams: params,
      transactionDetails: rowData,
      transactionDetailsModal: true,
      selectedCollectionRefNumber: rowData.collectionReferenceNumber,
      selectedCollectionCurrency: rowData.collectionCurrency,
      selectedCardBrand: rowData.cardBrand,
      selectedCancelledTimestamp: rowData.cancelledTimestamp,
      selectedCharges: rowData.charges,
      selectedCreateTimeStamp: rowData.createTimeStamp,
      selectedDebtorName: rowData.debtorName,
      selectedDebtorEmailId: rowData.debtorEmailId,
      selectedFinalDueAmount: rowData.finalDueAmount,
      selectedFinalPaymentAmount: rowData.paymentAmount,
      selectedPaymentConfirmationId: rowData.paymentConfirmationId,
      selectedPaymentCurrency: rowData.paymentCurrency,
      selectedPaymentMode: rowData.paymentMode,
      selectedPaymentCompletionTimestamp: rowData.paymentCompletionTimestamp,
      selectedPaymentDueDate: rowData.paymentDueDate,
      selectedPaymentLink: rowData.paymentURL,
      selectedPaymentExpiryDate: rowData.paymentExpiryDate,
      selectedReasonForCharges: rowData.reasonForCharges,
      selectedReasonForCancellation: rowData.reasonForCancellation,
      selectedReasonForCollection: rowData.reasonForCollection,
      selectedReceiptTimestamp: rowData.receiptTimestamp,
      selectedStatus: rowData.status,
      selectedTransactionId: rowData.transactionId,
      selectedIsFirc: rowData.isFirc,
      selectedFailedAttempts: rowData.failedAttempts,
      selectedRefundCount: rowData.refundCount,
      duplicateTransactionStates: {
        initialAmount:rowData.initialDueAmount,
        debtorMobileNumber: rowData.debtorMobileNumber,
        debtorWhatsAppNumber: rowData.debtorWhatsAppNumber,
        debtorName: rowData.debtorName,
        debtorEmailId: rowData.debtorEmailId,
        requestorTransactionId: rowData.requestorTransactionId,
        collectionRef: rowData.collectionReferenceNumber,
        description: rowData.reasonForCollection,
        collectionCurrency: rowData.collectionCurrency,
        finalDueAmount: rowData.finalDueAmount,
        chargeAmount: rowData.charges,
        chargeReason: rowData.reasonForCharges,
        invoiceDate: rowData.invoiceDate,
        invoiceType: rowData.invoiceType,
        purposeCode: rowData.purposeCode,
      },
      selectedRefundedAmount: rowData.refundedAmount,
      selectedPaymentCount: rowData.paymentCount,
      selectedAllowPartialPayment: rowData.allowPartialPayments,
      qrString:rowData.qrString,
      qrImageUploadPath:rowData.qrImageUploadPath,
      transactionCreationMode:rowData.transactionCreationModem,
      selectedDataMerchantId:rowData.merchantId,
      selectedPaymentStlAmount:rowData.paymentSettlementAmount,
      selectedPaymentStlDate:rowData.paymentSettlementDate,
      selectedPaymentStlProvider:rowData.paymentSettlementProvider,
      selectedPaymentStlStatus:rowData.paymentSettlementStatus,
      selectedRefundStlAmount:rowData.refundSettlementAmount,
      selectedRefundStlDate:rowData.refundSettlementDate,
      selectedRefundStlProvider:rowData.refundSettlementProvider,
      selectedRefundStlStatus:rowData.refundSettlementStatus,
    }
  );
    

    if (rowData.status === "AWAITING_PAYMENT") {
      let obj = {
        disableViewPaymentDetails: true,
        disableIssueRefund: true,
        disableCancelTransaction: false,
        disableViewFailedAttempts: false,
        disableDuplicate: false,
        disableViewRefundDetails: true,
      }

      if(!this.state.allowCancellationByScreen){
        obj["disableCancelTransaction"] = true;
      }

      this.setState({
        transactionPaymenButtonRules: obj,
      });
    }

    if (rowData.status === "PAID") {
      let obj = {
        disableViewPaymentDetails: false,
        disableIssueRefund: rowData.transactionMode == manualPay.transactionModeManual ? true : false,
        disableCancelTransaction: true,
        disableViewFailedAttempts: false,
        disableDuplicate: false,
        disableViewRefundDetails: true,
        disableMarkAdPaid: true
      };

      if(rowData.partiallyPaid){
        obj["disableIssueRefund"] = true;
      }

      if(!this.state.allowRefundByScreen){
        obj["disableIssueRefund"] = true;
      }

      this.setState({
        transactionPaymenButtonRules: obj,
      });

    }

    if (rowData.status === "PARTIALLY_PAID") {
      this.setState({
        transactionPaymenButtonRules: {
          disableViewPaymentDetails: false,
          disableIssueRefund: true,
          disableCancelTransaction: true,
          disableViewFailedAttempts: false,
          disableDuplicate: false,
          disableViewRefundDetails: true,
          disableMarkAdPaid: false
        },
      });
    }

    if (rowData.status === "PARTIALLY_REFUNDED") {

      let obj = {
        disableViewPaymentDetails: false,
        disableIssueRefund: false,
        disableCancelTransaction: true,
        disableViewFailedAttempts: false,
        disableDuplicate: false,
        disableViewRefundDetails: false,
        disableMarkAdPaid: false
      };

      if(!this.state.allowRefundByScreen){
        obj["disableIssueRefund"] = true;
      }

      this.setState({
        transactionPaymenButtonRules: obj,
      });

    }

    if (rowData.status === "FULLY_REFUNDED") {

      let obj = {
        disableViewPaymentDetails: false,
        disableIssueRefund: false,
        disableCancelTransaction: true,
        disableViewFailedAttempts: false,
        disableDuplicate: false,
        disableViewRefundDetails: false,
        disableMarkAdPaid: false
      };

      if(!this.state.allowRefundByScreen){
        obj["disableIssueRefund"] = true;
      }

      this.setState({
        transactionPaymenButtonRules: obj,
      });
      
    }

    if (rowData.status === "EXPIRED") {
      this.setState({
        transactionPaymenButtonRules: {
          disableViewPaymentDetails: true,
          disableIssueRefund: true,
          disableCancelTransaction: true,
          disableViewFailedAttempts: false,
          disableDuplicate: false,
          disableViewRefundDetails: true,
          disableMarkAdPaid: false
        },
      });
    }

    if (rowData.status === "CANCELLED") {
      this.setState({
        transactionPaymenButtonRules: {
          disableViewPaymentDetails: true,
          disableIssueRefund: true,
          disableCancelTransaction: true,
          disableViewFailedAttempts: false,
          disableDuplicate: false,
          disableViewRefundDetails: true,
          disableMarkAdPaid: false
        },
      });
    }

    if (rowData.status === "SETTLED") {

      let obj = {
        disableViewPaymentDetails: false,
        disableIssueRefund: false,
        disableCancelTransaction: true,
        disableViewFailedAttempts: false,
        disableDuplicate: false,
        disableViewRefundDetails: true,
        disableMarkAdPaid: false
      };

      if(!this.state.allowRefundByScreen){
        obj["disableIssueRefund"] = true;
      }

      this.setState({
        transactionPaymenButtonRules: obj,
      });
      
    }

    if (rowData.status === "REFUNDED") {

      let obj = {
        disableViewPaymentDetails: false,
        disableIssueRefund: false,
        disableCancelTransaction: true,
        disableViewFailedAttempts: false,
        disableDuplicate: false,
        disableViewRefundDetails: false,
        disableMarkAdPaid: false
      };

      if(!this.state.allowRefundByScreen){
        obj["disableIssueRefund"] = true;
      }

      this.setState({
        transactionPaymenButtonRules: obj,
      });

    }

    if (rowData.status === "FAILED") {
      let obj = {
        disableViewPaymentDetails: true,
        disableIssueRefund: true,
        disableCancelTransaction: true,
        disableViewFailedAttempts: false,
        disableDuplicate: false,
        disableViewRefundDetails: true,
        disableMarkAdPaid: false
      };

      this.setState({
        transactionPaymenButtonRules: obj,
      });

    }
    
  };

  handleDuplicatePayment = () => {
    this.props.history.push({ pathname: "/new-payment", duplicateTransactionStates: this.state.duplicateTransactionStates });
  }

  handleFirc = (transactionId) => {
    this.props.history.push({ pathname: "/firc-upload", transactionId: transactionId });
  }

  /**
   * @author Ragavan
   * Method to render chip component based on the payment status
   */
  getStatusChip = (status) => {
    let chip = true;
    var chipColor = "",
      chipBgColor = "",
      chipLabel = "";
    switch (status) {
      case "PAID":
        chipColor = "black";
        chipBgColor = "#90EE90";
        chipLabel = "Paid";
        break;
      case "PARTIALLY_PAID":
        chipColor = "black";
        chipBgColor = "#90EE90";
        chipLabel = "Partially Paid";
        break;
      case "AWAITING_PAYMENT":
        chipColor = "white";
        chipBgColor = "#4D9AFF";
        chipLabel = "Awaiting Payment";
        break;
      case "FULLY_REFUNDED":
        chipColor = "white";
        chipBgColor = "rgb(200 134 10)";
        chipLabel = "Fully Refunded";
        break;
      case "CANCELLED":
        chipColor = "white";
        chipBgColor = "#F34747";
        chipLabel = "Cancelled";
        break;
      case "PARTIALLY_REFUNDED":
        chipColor = "white";
        chipBgColor = "#edb64f";
        chipLabel = "Partially Refunded";
        break;
      case "EXPIRED":
        chipColor = "white";
        chipBgColor = "#FF7276";
        chipLabel = "Expired";
        break;
      case "SETTLED":
        chipColor = "white";
        chipBgColor = "rgb(8 171 8)";
        chipLabel = "Settled";
        break;
      case "SUCCESS":
        chipColor = "black";
        chipBgColor = "#a7daa2";
        chipLabel = "Success";
        break;
      case "REFUNDED":
        chipColor = "white";
        chipBgColor = "gray";
        chipLabel = "Refunded";
        break;
      case "IN_PROCESS":
          chipColor = "white";
          chipBgColor = "orange";
          chipLabel = "In Process";
          break;
      case "FAILED":
          chipColor = "white";
          chipBgColor = "orange";
          chipLabel = "FAILED";
          break;
      default:
        chip = false;
    }

    return !chip ? (
      "-"
    ) : (
      <Chip
        label={chipLabel}
        title={chipLabel}
        style={{
          backgroundColor: chipBgColor,
          color: chipColor,
          width: "146px",
          height: "30px",
        }}
      />
    );
  };

  /**
   * @author Ragavan
   * Method returns the number of refunds count for the transaction
   * @param {*} transactionId
   * @returns
   */
  getRefundsCount = (transactionId, status = null) => {
    var refundCount = 0;
    if (transactionId && status == null) {
      (this.state.searchedPaymentResultList || []).map((value) => {
        if (
          value.transactionType === "REFUND" &&
          value.parentTransactionId == transactionId
        ) {
          refundCount++;
        }
      });
      return refundCount;
    }

    if (transactionId && status) {
      (this.state.searchedPaymentResultList || []).map((value) => {
        if (
          value.transactionType === "REFUNDED" &&
          value.status === "SUCCESS" &&
          value.parentTransactionId == transactionId
        ) {
          refundCount++;
        }
      });
      return refundCount;
    }
  };

  /**
   * @author Ragavan
   * @param {*} value
   * @returns
   */
  getPaymentActionIcons = (value) => {
    let status = value.row.status;

    return (
      <>
        {TempStorage.loginUserRole !== USER_TYPE.ADMIN_USER ? (
          <>
            <Tooltip
              title={status == "AWAITING_PAYMENT" ? "Copy Payment Link" : ""}
            >
              <IconButton
                aria-label="Duplicate"
                style={{ padding: "inherit" }}
                onClick={() => {
                  this.handleCopyClick(value.row.paymentURL);
                }}
                disabled={status != "AWAITING_PAYMENT"}
              >
                <FileCopyOutlinedIcon
                  style={{
                    color: status == "AWAITING_PAYMENT" ? "#264d73" : "gray",
                  }}
                />
              </IconButton>
            </Tooltip>
            <Divider orientation="vertical" variant="middle" flexItem />
          </>
        ) : (
          ""
        )}

        <Tooltip
          title={status == "AWAITING_PAYMENT" ? "Cancel Transaction" : ""}
        >
          <IconButton
            aria-label="Cancel"
            style={{ padding: "inherit" }}
            onClick={(e) => {
              status == "AWAITING_PAYMENT"
                ? this.refundClick(e, value.row)
                : "";
            }}
            disabled={status != "AWAITING_PAYMENT"}
          >
            <Cancel
              style={{ color: status == "AWAITING_PAYMENT" ? "red" : "gray" }}
            />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" variant="middle" flexItem />

        <Tooltip
          title={
            status == "PAID" ||
              status == "PARTIALLY_REFUNDED" ||
              status == "SETTLED" ||
              status == "REFUNDED"
              ? "Issue Refund"
              : ""
          }
        >
          <IconButton
            aria-label="Refunds"
            style={{ padding: "inherit" }}
            disabled={
              !(
                status == "PAID" ||
                status == "PARTIALLY_REFUNDED" ||
                status == "SETTLED" ||
                status == "REFUNDED"
              )
            }
            onClick={(e) => {
              if (
                status === "PAID" ||
                status === "PARTIALLY_REFUNDED" ||
                status === "SETTLED" ||
                status == "REFUNDED"
              ) {
                this.selectedItem = value.row;
                this.refundClick(e, value.row);
              }
            }}
          >
            <Replay
              style={{
                color:
                  status == "PAID" ||
                    status == "PARTIALLY_REFUNDED" ||
                    status == "SETTLED" ||
                    status == "REFUNDED"
                    ? "#264d73"
                    : "gray",
              }}
            />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" variant="middle" flexItem />

        <Tooltip
          title={status == "AWAITING_PAYMENT" ? "Send Payment Reminder" : ""}
        >
          <IconButton
            aria-label="Reminder"
            style={{ padding: "inherit" }}
            disabled={status != "AWAITING_PAYMENT"}
            onClick={() => {
              this.sendPaymentReminderBtn(value);
            }}
          >
            <Notifications
              style={{
                color: status == "AWAITING_PAYMENT" ? "#264d73" : "gray",
              }}
            />
          </IconButton>
        </Tooltip>
      </>
    );
  };

  setSelectedItem = (value) => {
    this.selectedItem = value;
  };

  sendPaymentReminderBtn = (value) => {
    this.setState({
      showReminderModal: true,
      transactionIdForReminder: value.row.transactionId,
    });
  };

  humanize(str) {
    var i,
      frags = str.split("_");
    for (i = 0; i < frags.length; i++) {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(" ");
  }

  getPaymentRefundTimestamp(date) {
    const tempDate = date.toLocaleString("en-GB", {
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const formatDate = new Intl.DateTimeFormat("en", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const modifiedDate = formatDate.format(new Date(date));
    return modifiedDate;
  }

  handleRefundDetails = async (params) => {
    this.setState({ loading: true });

    const rowData = params.row;

    let res = await DashboardService.getRefundDetails(rowData.transactionId);
    // // console.log("handleRefundDetails", res);
    if (res.data) {
      this.setState({
        refundModel: true,
        transactionDetailsModal: false,
        refundDetails: res.data,
        refundSelected: rowData,
      });
    }
    this.setState({ loading: false });
  };

  handleFailedTransactions = async (id) => {
    this.setState({ loading: true });
    let match = false;
    const request = {transactionId:id};
    const response = await DashboardService.getAllFailedTransactions(request);
  
    if(response && Array.isArray(response.list) && response.list.length > 0){
      await this.setState({
        failedTransactions: response.list,
        failedTransactionsModal: true,
      });
      
      for (let failedTransaction in this.state.failedTransactions) {
        let transaction = this.state.failedTransactions[failedTransaction];
  
        if (transaction.transactionId == this.state.selectedTransactionId) {
          match = true;
        }
      }
    }
    else{
      toast("Something went wrong, Unable to get the failed transaction", {
        position: toast.POSITION.BOTTOM_CENTER,
        className: "toast-message toast-error"});
    }

    await this.setState({
      transactionDetailsModal: false,
      faildTransactionMatched: match,
      loading: false,
    });
  };

  closeFaildTransactionModal = () => {
    this.setState({ failedTransactionsModal: false });
  };

  /**
   * @author Ragavan
   * Method to sort amount with currency
   *
   * @param {*} v1
   * @param {*} v2
   * @returns
   */
  sortCurrencyComparator = (v1, v2) => {
    let value1 = v1.split(" ");
    let value2 = v2.split(" ");

    const currency1 = value1[0];
    const currency2 = value2[0];
    const amount1 = parseFloat(value1[1]);
    const amount2 = parseFloat(value2[1]);

    if (currency1 < currency2) {
      return -1;
    }

    if (currency1 > currency2) {
      return 1;
    }

    return amount1 - amount2;
  };

  /**
   * Redirect to single payment when user trigger
   */
  navigateToNewPayment = () => {
    this.props.history.push("/new-payment");
  };

  /**
   * @author Ragavan
   * Handle merchant list onchange
   * @param {*} e
   * @param {*} v
   */
  getMerchantId = (e, v) => {
    if (v && v.merchantId !== null && v.merchantId !== "") {
      this.setState({
        merchantId: v.merchantId,
        selectedMerchant: v.merchantName,
      });
    }

    if (v == null) {
      this.setState({ selectedMerchant: null, merchantId: null });
    }
  };

  openMobileViewFilter = () => {
    this.setState({ mobileViewFilterModal: true });
  };

  /**
   * @author Ragavan
   * To handle event for the date field when change
   * @param {*} event
   */
  changeDateFormat = (event) => {
    let value = null;

    if (event != null) {
      value = moment(event.toDate()).format(DefaultDateFormat.dateFormatymd);
    }

    return value;
  };

  handleRowsPerPage = async (event) => {
    await this.setState({
      pageSize: event.target.value,
    });

    this.processedApply(1);
  };

  sortTransaction = async (model) => {
    if (model.length !== 0) {
      let sortingType, sortingBy;

      if (model[0].field === "collectionReferenceNumber") {
        sortingType = model[0].sort;
        sortingBy = "collectionReferenceNo";
      } else {
        sortingType = model[0].sort;
        sortingBy = model[0].field;
      }

      await this.setState({
        sortingType,
        sortingBy,
        initalPage: 0,
        pageNo: 0,
      });

      // Reset the flag when sorting criteria change
      await this.setState({ apiCallMade: false });

      this.processedApply(1);
    } else {
      // Make the API call only if it hasn't been made before
      if (!this.state.apiCallMade) {
        await this.setState({
          apiCallMade: true,
          sortingType: null,
          sortingBy: null,
          initalPage: 0,
          pageNo: 0,
        });
        this.processedApply(1);
      }
    }
  };

  /**
   * @author Bharath
   * HandleEvent to generate the invoice
   * @param {*} params
   */
  handleGenerateInvoice = async (params) => {
    await this.setState({ loading: true });
    let response = await PaymentService.generateInvoice(params);
    if (response.pdfContent && response.fileName) {
      Utils.downloadBase64File(response.pdfContent, response.fileName);
    } else {
      toast(response.message, {
        position: toast.POSITION.BOTTOM_CENTER,
        className: "toast-message toast-error",
      });
    }
    await this.setState({ loading: false });
  };

  removeAmountFilter = async (data) => {
    const formFields = this.state.formFields;

    if (data === "Requested Amount") {
      await this.setState({
        requestedCcy: null,
        requestedMinAmount: null,
        requestedMaxAmount: null,
      });

      formFields.requestedCcy.value = "";
      formFields.requestedMinAmount.value = "";
      formFields.requestedMaxAmount.value = "";
      this.updateFormFields(formFields);

    } else if (data === "Paid Amount") {
      await this.setState({
        paidCcy: null,
        paidMinAmount: null,
        paidMaxAmount: null,
      });

      formFields.paidCcy.value = "";
      formFields.paidMinAmount.value = "";
      formFields.paidMaxAmount.value = "";
      this.updateFormFields(formFields);
    }

    this.handlePageChange({ selected: this.state.pageNo -1});
  };

  removeDateFilter = async (data) => {
    if (data === "Create Date") {
      await this.setState({
        receiptStartDate: null,
        receiptEndDate: null,
      });
    } else if (data === "Payment Date") {
      await this.setState({
        paymentStartDate: null,
        paymentEndDate: null,
      });
    } else if (data === "Cancellation Date") {
      await this.setState({
        cancellationToDate: null,
        cancellationFromDate: null,
      });
    }

    this.handlePageChange({ selected: this.state.pageNo -1 });
  };

  setStateValue = (key, value) => {
    this.setState({
      key: value,
    });
  };

  // Refund Screen

  handleRefundSearch = async () => {
    this.setState({ initalPage: 0 });
    this.getRefundSearchResult(1);
    this.setState({
      expandedRefundDeatils: false,
      expandedOriginalDeatils: false,
    });
  };

  getRefundSearchResult = async (paramPageNo) => {
    let obj = this.state.refundSearchModel;
    obj["pageNo"] = paramPageNo;
    this.setState({ refundSearchModel: obj, loading: true });

    let result = await DashboardService.getRefundList(
      this.state.refundSearchModel
    );

    this.setState({ loading: false });

    if (result && result.refundDetails) {
      this.setState({ refundSummaryList: result.refundDetails });
    }

    if (result && result.totalCount) {
      this.setState({ totalCountRefundList: result.totalCount });
      let totalPagesRefund = result.totalCount / this.state.pageSize;
      this.setState({
        totalPagesRefund: Math.ceil(totalPagesRefund),
      });
    }

    this.prepareRefundListFilters();

    // // console.log(
    //   "appliedRefundListFilters",
    //   this.state.appliedRefundListFilters
    // );
    // console.log("refundSearchModel", this.state.refundSearchModel);
  };

  prepareRefundListFilters = () => {
    let appliedFilters = [];

    if (
      this.state.refundSearchModel.refundStartDate ||
      this.state.refundSearchModel.refundEndDate
    ) {
      let obj = {
        title: `Refund Date`,
        value: ``,
        onClick: () => {
          let refObj = this.state.refundSearchModel;
          refObj["refundStartDate"] = null;
          refObj["refundStartDate"] = null;
          this.setState({ refundSearchModel: refObj });
          this.handlePageChangeRefund({ selected: this.state.pageNo - 1 });
        },
      };
      if (
        this.state.refundSearchModel.refundStartDate &&
        this.state.refundSearchModel.refundEndDate
      ) {
        obj["value"] = `${moment(
          this.state.refundSearchModel.refundStartDate
        ).format(DateFormat.date)} - ${moment(
          this.state.refundSearchModel.refundEndDate
        ).format(DateFormat.date)}`;
      } else if (this.state.refundSearchModel.refundStartDate) {
        obj["value"] = `${moment(
          this.state.refundSearchModel.refundStartDate
        ).format(DateFormat.date)} - To`;
      } else {
        obj["value"] = `From - ${moment(
          this.state.refundSearchModel.refundEndDate
        ).format(DateFormat.date)}`;
      }
      appliedFilters.push(obj);
    }

    if (
      this.state.refundSearchModel.createStartDate ||
      this.state.refundSearchModel.createEndDate
    ) {
      let obj = {
        title: `Create Date`,
        value: "",
        onClick: () => {
          let refObj = this.state.refundSearchModel;
          refObj["createStartDate"] = null;
          refObj["createEndDate"] = null;
          this.setState({ refundSearchModel: refObj });
          this.handlePageChangeRefund({ selected: this.state.pageNo - 1 });
        },
      };
      if (
        this.state.refundSearchModel.createStartDate &&
        this.state.refundSearchModel.createEndDate
      ) {
        obj["value"] = `${moment(
          this.state.refundSearchModel.createStartDate
        ).format(DateFormat.date)} - ${moment(
          this.state.refundSearchModel.createEndDate
        ).format(DateFormat.date)}`;
      } else if (this.state.refundSearchModel.createStartDate) {
        obj["value"] = `${moment(
          this.state.refundSearchModel.createStartDate
        ).format(DateFormat.date)} - To`;
      } else {
        obj["value"] = `From - ${moment(
          this.state.refundSearchModel.createEndDate
        ).format(DateFormat.date)}`;
      }
      appliedFilters.push(obj);
    }

    if (
      this.state.refundSearchModel.paymentStartDate ||
      this.state.refundSearchModel.paymentEndDate
    ) {
      let obj = {
        title: `Payment Date`,
        value: "",
        onClick: () => {
          let refObj = this.state.refundSearchModel;
          refObj["paymentStartDate"] = null;
          refObj["paymentEndDate"] = null;
          this.setState({ refundSearchModel: refObj });
          this.handlePageChangeRefund({ selected: this.state.pageNo - 1 });
        },
      };
      if (
        this.state.refundSearchModel.createStartDate &&
        this.state.refundSearchModel.createEndDate
      ) {
        obj["value"] = `${moment(
          this.state.refundSearchModel.paymentStartDate
        ).format(DateFormat.date)} - ${moment(
          this.state.refundSearchModel.paymentEndDate
        ).format(DateFormat.date)}`;
      } else if (this.state.refundSearchModel.createStartDate) {
        obj["value"] = `${moment(
          this.state.refundSearchModel.paymentStartDate
        ).format(DateFormat.date)} - To`;
      } else {
        obj["value"] = `From - ${moment(
          this.state.refundSearchModel.paymentEndDate
        ).format(DateFormat.date)}`;
      }
      appliedFilters.push(obj);
    }

    if (
      this.state.refundSearchModel.payerName &&
      this.state.refundSearchModel.payerName.length > 0
    ) {
      let obj = {
        title: `Payer Name`,
        value: `${this.state.refundSearchModel.payerName}`,
        onClick: () => {
          let refObj = this.state.refundSearchModel;
          refObj["paymentName"] = null;
          this.setState({ refundSearchModel: refObj });
          this.handlePageChangeRefund({ selected: this.state.pageNo - 1 });
        },
      };
      appliedFilters.push(obj);
    }

    if (
      this.state.refundSearchModel.collectionRef &&
      this.state.refundSearchModel.collectionRef.length > 0
    ) {
      let obj = {
        title: `Collection Reference`,
        value: `${this.state.refundSearchModel.collectionRef}`,
        onClick: () => {
          let refObj = this.state.refundSearchModel;
          refObj["collectionRef"] = null;
          this.setState({ refundSearchModel: refObj });
          this.handlePageChangeRefund({ selected: this.state.pageNo - 1 });
        },
      };
      appliedFilters.push(obj);
    }

    if (
      this.state.refundSearchModel.transactionId &&
      this.state.refundSearchModel.transactionId.length > 0
    ) {
      let obj = {
        title: `Benepay Transaction Id`,
        value: `${this.state.refundSearchModel.transactionId}`,
        onClick: () => {
          let refObj = this.state.refundSearchModel;
          refObj["transactionId"] = null;
          this.setState({ refundSearchModel: refObj });
          this.handlePageChangeRefund({ selected: this.state.pageNo - 1 });
        },
      };
      appliedFilters.push(obj);
    }

    if (
      this.state.refundSearchModel.refundTransactionId &&
      this.state.refundSearchModel.refundTransactionId.length > 0
    ) {
      let obj = {
        title: `Benepay Refund Txn Id`,
        value: `${this.state.refundSearchModel.refundTransactionId}`,
        onClick: () => {
          let refObj = this.state.refundSearchModel;
          refObj["refundTransactionId"] = null;
          this.setState({ refundSearchModel: refObj });
          this.handlePageChangeRefund({ selected: this.state.pageNo - 1 });
        },
      };
      appliedFilters.push(obj);
    }

    if (
      this.state.refundSearchModel.requestorTransactionId &&
      this.state.refundSearchModel.requestorTransactionId.length > 0
    ) {
      let obj = {
        title: `Requestor Transaction Id`,
        value: `${this.state.refundSearchModel.requestorTransactionId}`,
        onClick: () => {
          let refObj = this.state.refundSearchModel;
          refObj["requestorTransactionId"] = null;
          this.setState({ refundSearchModel: refObj });
          this.handlePageChangeRefund({ selected: this.state.pageNo - 1 });
        },
      };
      appliedFilters.push(obj);
    }

    if (
      this.state.refundSearchModel.refundRequestorTransactionId &&
      this.state.refundSearchModel.refundRequestorTransactionId.length > 0
    ) {
      let obj = {
        title: `Requestor Refund Id`,
        value: `${this.state.refundSearchModel.refundRequestorTransactionId}`,
        onClick: () => {
          let refObj = this.state.refundSearchModel;
          refObj["refundRequestorTransactionId"] = null;
          this.setState({ refundSearchModel: refObj });
          this.handlePageChangeRefund({ selected: this.state.pageNo - 1 });
        },
      };
      appliedFilters.push(obj);
    }

    if (
      this.state.refundSearchModel.refundReason &&
      this.state.refundSearchModel.refundReason.length > 0
    ) {
      let obj = {
        title: `Refund Reason`,
        value: `${this.state.refundSearchModel.refundReason}`,
        onClick: () => {
          let refObj = this.state.refundSearchModel;
          refObj["refundReason"] = null;
          this.setState({ refundSearchModel: refObj });
          this.handlePageChangeRefund({ selected: this.state.pageNo - 1 });
        },
      };
      appliedFilters.push(obj);
    }

    if (
      this.state.refundSearchModel.refundedTo &&
      this.state.refundSearchModel.refundedTo.length > 0
    ) {
      let obj = {
        title: `Refunded To`,
        value: `${this.state.refundSearchModel.refundedTo}`,
        onClick: () => {
          let refObj = this.state.refundSearchModel;
          refObj["refundedTo"] = null;
          this.setState({ refundSearchModel: refObj });
          this.handlePageChangeRefund({ selected: this.state.pageNo - 1 });
        },
      };
      appliedFilters.push(obj);
    }

    if (
      this.state.refundSearchModel.payerEmail &&
      this.state.refundSearchModel.payerEmail.length > 0
    ) {
      let obj = {
        title: `Payer Email`,
        value: `${this.state.refundSearchModel.payerEmail}`,
        onClick: () => {
          let refObj = this.state.refundSearchModel;
          refObj["payerEmail"] = null;
          this.setState({ refundSearchModel: refObj });
          this.handlePageChangeRefund({ selected: this.state.pageNo - 1 });
        },
      };
      appliedFilters.push(obj);
    }

    if (
      (this.state.refundSearchModel.paymentCcy &&
        this.state.refundSearchModel.paymentCcy.length > 0) ||
      this.state.refundSearchModel.paymentMinAmount ||
      this.state.refundSearchModel.paymentMaxAmount
    ) {
      let obj = {
        title: `Payment Amount`,
        value: `${this.state.refundSearchModel.paymentCcy
          ? this.state.refundSearchModel.paymentCcy
          : "CCY"
          } ${this.state.refundSearchModel.paymentMinAmount
            ? this.state.refundSearchModel.paymentMinAmount
            : "0"
          } - ${this.state.refundSearchModel.paymentMaxAmount
            ? this.state.refundSearchModel.paymentCcy
              ? this.state.refundSearchModel.paymentCcy +
              this.state.refundSearchModel.paymentMaxAmount
              : "CCY" + this.state.refundSearchModel.paymentMaxAmount
            : "Onwards"
          }`,
        onClick: () => {
          let refObj = this.state.refundSearchModel;
          refObj["paymentCcy"] = null;
          refObj["paymentMinAmount"] = null;
          refObj["paymentMaxAmount"] = null;
          this.setState({ refundSearchModel: refObj });
          this.handlePageChangeRefund({ selected: this.state.pageNo - 1 });
        },
      };
      appliedFilters.push(obj);
    }

    if (
      (this.state.refundSearchModel.refundCcy &&
        this.state.refundSearchModel.refundCcy.length > 0) ||
      this.state.refundSearchModel.refundMinAmount ||
      this.state.refundSearchModel.refundMaxAmount
    ) {
      let obj = {
        title: `Refund Amount`,
        value: `${this.state.refundSearchModel.refundCcy
          ? this.state.refundSearchModel.refundCcy
          : "CCY"
          } ${this.state.refundSearchModel.refundMinAmount
            ? this.state.refundSearchModel.refundMinAmount
            : "0"
          } - ${this.state.refundSearchModel.refundMaxAmount
            ? this.state.refundSearchModel.refundCcy
              ? this.state.refundSearchModel.refundCcy +
              this.state.refundSearchModel.refundMaxAmount
              : "CCY" + this.state.refundSearchModel.refundMaxAmount
            : "Onwards"
          }`,
        onClick: () => {
          let refObj = this.state.refundSearchModel;
          refObj["refundCcy"] = null;
          refObj["refundMinAmount"] = null;
          refObj["refundMaxAmount"] = null;
          this.setState({ refundSearchModel: refObj });
          this.handlePageChangeRefund({ selected: this.state.pageNo - 1 });
        },
      };
      appliedFilters.push(obj);
    }

    this.setState({ appliedRefundListFilters: appliedFilters });
  };

  refundSummaryColumns = () => {
    const cols = [
      {
        field: "refundTransactionId",
        headerName: "BenePay Refund Transaction Id",
        width: 280,
        minWidth: 260,
        headerClassName: "serachedPaymentResultListHeaderColor",
        cellClassName: "table-cell-classname",
        flex: 1,
      },
      {
        field: "refundRequestorTransactionId",
        headerName: "Requestor Refund Id",
        headerAlign: "left",
        headerClassName: "serachedPaymentResultListHeaderColor",
        cellClassName: "table-cell-classname-amount",
        flex: 1,
        minWidth: 190,
      },
      {
        field: "refundedOn",
        headerName: "Refunded On",
        width: 240,
        align: "left",
        headerAlign: "left",
        headerClassName: "serachedPaymentResultListHeaderColor",
        cellClassName: "table-cell-classname",
        flex: 1,
        minWidth: 200,
        valueGetter: (params) =>
          moment(params.value).format(DateFormat.dateTime),
      },
      {
        field: "refundedBy",
        headerName: "Refunded By",
        // width: 240,
        headerClassName: "serachedPaymentResultListHeaderColor",
        cellClassName: "table-cell-classname",
        flex: 1,
        minWidth: 155,
      },
      {
        field: "payerName",
        headerName: "Payer Name",
        minWidth: 110,
        headerClassName: "serachedPaymentResultListHeaderColor",
        cellClassName: "table-cell-classname",
        flex: 1,
      },
      {
        field: "refundedToInstrument",
        headerName: "Refunded To Instrument",
        minWidth: 200,
        headerClassName: "serachedPaymentResultListHeaderColor",
        cellClassName: "table-cell-classname",
        flex: 1,
      },
      {
        field: "refundedAmount",
        headerName: "Refunded Amount",
        minWidth: 150,
        headerClassName: "serachedPaymentResultListHeaderColor",
        cellClassName: "table-cell-classname",
        flex: 1,
      },
      {
        field: "refundReason",
        headerName: "Refund Reason",
        minWidth: 150,
        headerClassName: "serachedPaymentResultListHeaderColor",
        cellClassName: "table-cell-classname",
        flex: 1,
      },
    ];

    return cols;
  };

  handlePageChangeRefund = (data) => {
    if (data.selected + 1 > this.state.totalPages) {
      data.selected = this.state.totalPages - 1;
    } else if (data.selected <= 0) {
      data.selected = 0;
    }
    this.setState({ initalPage: data.selected });
    this.setState({ pageNo: data.selected + 1 });
    this.getRefundSearchResult(data.selected + 1);
  };

  sortRefundList = async (model) => {
    if (model.length !== 0) {
      let sortingType, sortingBy;

      // console.log("Model for sorting", model);
      sortingType = model[0].sort;

      switch (model[0].field) {
        case "refundTransactionId":
          sortingBy = "transactionId";
          break;

        case "refundRequestorTransactionId":
          sortingBy = "requestorTransactionId";
          break;

        case "refundedOn":
          sortingBy = "createTimeStamp";
          break;

        case "payerName":
          sortingBy = "debtorName";
          break;
          subMerchantIds
        case "refundedToInstrument":
          sortingBy = "paymentMode";
          break;

        case "refundReason":
          sortingBy = "reasonForCollection";
          break;

        case "refundedBy":
          sortingBy = model[0].field;
          break;

        default:
          sortingBy = model[0].field;
          break;
      }

      let obj = this.state.refundSearchModel;
      obj["sortingType"] = sortingType;
      obj["sortingBy"] = sortingBy;
      this.setState({ refundSearchModel: obj });
      this.getRefundSearchResult(1);
    }
  };

  handleRowsPerPageRefund = async (event) => {
    await this.setState({
      pageSize: event.target.value,
    });

    this.getRefundSearchResult(1);
  };

  downloadRefundTransactions = async () => { };

  clearRefundFilters = () => {
    this.setState({
      refundSearchModel: {
        refundStartDate: null,
        refundEndDate: null,
        createStartDate: null,
        createEndDate: null,
        paymentStartDate: null,
        paymentEndDate: null,
        payerName: null,
        collectionRef: null,
        transactionId: null,
        refundTransactionId: null,
        requestorTransactionId: null,
        refundRequestorTransactionId: null,
        refundReason: null,
        refundedTo: "",
        defaultSearch: false,
        pageNo: 1,
        pageSize: this.state.pageSize,
        payerEmail: null,
        paymentCcy: null,
        paymentMinAmount: null,
        paymentMaxAmount: null,
        refundCcy: null,
        refundMinAmount: null,
        refundMaxAmount: null,
        sortingType: null,
        sortingBy: null,
      },
      refundSummaryList: [],
      expandedRefundDeatils: "panel4",
      expandedOriginalDeatils: "panel3",
    });

    this.prepareRefundListFilters();

    // console.log("Let", this.state.refundSearchModel);
  };

  setLoading = (val) => {
    this.setState({ loading: val });
  }

  fieldNames = [
    'requestedMinAmount',
    'requestedMaxAmount',
    'paidMinAmount',
    'paidMaxAmount',
    'requestedCcy',
    'paidCcy',
    'Requested',

    'refundMinAmount',
    'refundMaxAmount',
    'paymentMinAmount',
    'paymentMaxAmount',
  ];

  amountFields = ['requestedMinAmount', 'requestedMaxAmount', 'paidMinAmount', 'paidMaxAmount', 'refundMinAmount', 'refundMaxAmount', 'paymentMaxAmount'];
  transactionAmountField = ['requestedMinAmount', 'requestedMaxAmount', 'paidMinAmount', 'paidMaxAmount', 'requestedCcy', 'paidCcy'];

  rule = {
    requestedMinAmount: [
      { validate: 'positive' },
      { validate: 'nonZero' },
      { validate: 'decimal', decimal: 0 },
    ],
    requestedMaxAmount: [
      { validate: 'positive' },
      { validate: 'nonZero' },
      { validate: 'decimal', decimal: 0 },
      { validate: 'greaterthan', depends: ['requestedMinAmount'] },
    ],
    paidMinAmount: [
      { validate: 'required' },
      { validate: 'positive' },
      { validate: 'nonZero' },
      { validate: 'decimal', decimal: 0 },
    ],
    paidMaxAmount: [
      { validate: 'required' },
      { validate: 'positive' },
      { validate: 'nonZero' },
      { validate: 'decimal', decimal: 0 },
      { validate: 'greaterthan', depends: ['paidMinAmount'] },

    ],
    refundMinAmount: [
      { validate: 'required' },
      { validate: 'positive' },
      { validate: 'nonZero' },
      { validate: 'decimal', decimal: 0 },
    ],
    refundMaxAmount: [
      { validate: 'required' },
      { validate: 'positive' },
      { validate: 'nonZero' },
      { validate: 'decimal', decimal: 0 },
      { validate: 'greaterthan', depends: ['refundMinAmount'] },

    ],
    paymentMinAmount: [
      { validate: 'required' },
      { validate: 'positive' },
      { validate: 'nonZero' },
      { validate: 'decimal', decimal: 0 },
    ],
    paymentMaxAmount: [
      { validate: 'required' },
      { validate: 'positive' },
      { validate: 'nonZero' },
      { validate: 'decimal', decimal: 0 },
      { validate: 'greaterthan', depends: ['paymentMinAmount'] },
    ],
  };

  updateFormField = async (fieldName, value, validate = true) => {
    let fields = this.state.formFields;

    if (fields.hasOwnProperty(fieldName) != -1) {
      fields[fieldName].value = value;

      await this.setState({ formFields: fields });
    }

    if (validate) {
      this.validateField(fieldName);
    }
  };

  /**
    * update the each fields in the form
    * after the updation trigger the field validation
    * 
    * @param {*} formFields 
    */
  updateFormFields = (formFields) => {
    this.setState({ formFields: formFields });
  }

  prepareField = (fieldNames, rules) => {
    const fields = {};

    (fieldNames || []).forEach(fieldName => {
      let value = '';

      if (fieldName == "mobileCountry") {
        value = "in";
      } else if (fieldName == "dueDate") {
        value = null;
      }

      fields[fieldName] = {
        rules: rules[fieldName] || [],
        value: value,
        errors: []
      };
    });

    return fields;
  }


  autoFixDecimal = (fieldName, amount, forceRule = null) => {
    try {
      let formFields = { ...this.state.formFields };

      let rule = forceRule ? forceRule : formFields[fieldName].rules.find((rule) => rule.validate === "decimal");

      if (amount && rule) {
        amount = parseFloat(amount).toFixed(rule.decimal);
      }

      return amount;
    } catch (error) {
      console.error(error);
      return amount;
    }
  };

  validateField = async (fieldName) => {

    let field = this.state.formFields[fieldName];

    const { errors, valid } = await FormValidationService.validate(field.rules, field.value, this.state.formFields);

    this.state.formFields[fieldName].errors = errors;

    this.setState({ formFields: this.state.formFields });
  }

  getFixedDecimalAmount = (currency, amount) => {
    if(!currency){
      console.error("Currency cannot be nullable");
    }

    try {
      let code = this.state.currencyList.find((v) => v.code === currency);
      
      if (code && code.decimal && amount) {
        amount = parseFloat(amount).toFixed(code.decimal);

      } else {
        console.error("Unable to fetch currency in currency list");
      }
    } catch (error) {
      console.error(error);
    }
    return amount;
  }

  updateDecimalInRule = (currency, fieldType) => {
    try {
      let code = this.state.currencyList.filter((v) => v.code === currency);

      if (code.length > 0) {
        let decimal = code[0].decimal;
        // Determine the amount fields based on the fieldType
        const amountFields = (fieldType === 'Requested')
          ? ['requestedMinAmount', 'requestedMaxAmount']
          : ['paidMinAmount', 'paidMaxAmount', 'refundMinAmount','refundMaxAmount','paymentMinAmount','paymentMaxAmount'];

        const updatedFormFields = this.state.formFields;

        amountFields.forEach((fieldName) => {
          const field = updatedFormFields[fieldName];
          field.rules.forEach((rule, index) => {
            if (rule.validate === 'decimal') {
              field.rules[index] = { ...rule, decimal: decimal };
            }
          });
        });

        this.setState({ formFields: updatedFormFields });

      }
    } catch (error) {
      console.error(error);
    }
  };

  handleRequestedMinAmount = (event) => {
    let minamount = event.target.value.replace(/[^0-9.]/g, '');
    this.updateFormField("requestedMinAmount", minamount);

  }
  handleRequestedMaxAmount = (event) => {
    let maxamount = event.target.value.replace(/[^0-9.]/g, '');
    this.updateFormField("requestedMaxAmount", maxamount);

  }
  handlePaidMinAmount = (event) => {
    let paidMinAm = event.target.value.replace(/[^0-9.]/g, '');
    this.updateFormField("paidMinAmount", paidMinAm);

  }
  handlePaidMaxAmount = (event) => {
    let paidMaxAm = event.target.value.replace(/[^0-9.]/g, '');
    this.updateFormField("paidMaxAmount", paidMaxAm);

  }
  handleRefundMinAmount = (event) => {
    let refundMinAmount = event.target.value.replace(/[^0-9.]/g, '');
    this.updateFormField("refundMinAmount", refundMinAmount);
  }
  handleRefundMaxAmount = (event) => {
    let refundMaxAmount = event.target.value.replace(/[^0-9.]/g, '');
    this.updateFormField("refundMaxAmount", refundMaxAmount);
  }
  handlePaymentMinAmount = (event) => {
    let paymentMinAmount = event.target.value.replace(/[^0-9.]/g, '');
    this.updateFormField("paymentMinAmount", paymentMinAmount);
  }
  handlePaymentMaxAmount = (event) => {
    let paymentMaxAmount = event.target.value.replace(/[^0-9.]/g, '');
    this.updateFormField("paymentMaxAmount", paymentMaxAmount);
  }

  /**
   * Method to handle the mark as paid button click
   * @param {*} transactionId 
   */
  handleManualPay = async (transactionDetail) => {   
    if (!this.state.isMarkAsPaidClicked) {
      let amt = transactionDetail.remainingAmount > 0 ? transactionDetail.remainingAmount : transactionDetail.finalDueAmount;

      this.setState({ 
        isMarkAsPaidClicked: true, 
        searchedBenePayTransactionId : transactionDetail.transactionId, 
        transactionDetailsModal: false,
        manualPayAmountCcy: transactionDetail.collectionCurrency ? transactionDetail.collectionCurrency : '',
        allowPartPaymentForManualPay:transactionDetail.allowPartialPayments, 
        manualPayAmount: amt,
        manualPayFormFields: this.prepareField(this.manualPayFieldNames, this.manualPayRule)
      }, 
        () =>{
          let manualPayStlForm = this.state.manualPayFormFields;
          manualPayStlForm["manualPayAmount"].value = this.state.manualPayAmountCcy ? this.getFixedDecimalAmount(this.state.manualPayAmountCcy, amt) : amt;
          manualPayStlForm["settlementCurrency"].value = this.state.manualPaySettlementAmtCcy;
          
          this.setState({manualPayFormFields : manualPayStlForm});
        });
    }
  }

  /**
   * Method to handle cancel
   */
  cancelManualPay = () => {
    if (this.state.isMarkAsPaidClicked) {
      this.setState({ 
        isMarkAsPaidClicked: false, 
        selectedManualPaymentMode: 'Cash', 
        searchedBenePayTransactionId: null,
        partialAmountValidationErrMsg : "",
        manulaPaySettleAmountValidationErrMsg : "",
        manualPaySettlementAmt : "",
      });
    }
  }

  /**
   * Method to handle confirm manual pay
   */
  confirmManualPay = async () => {
    var formValid = await this.validateForm();

    if(formValid){
      this.setState({ loading: true });

      let formValues = this.state.manualPayFormFields;

      var manualPayObj = {
        transactionId: this.setNullIfEmpty(this.state.searchedBenePayTransactionId),
        paymentMethod: this.setNullIfEmpty(this.state.selectedManualPaymentMode),
        amount: this.setNullIfEmpty(formValues.manualPayAmount.value),
        settlementAmount: this.setNullIfEmpty(formValues.manualPaySettlementAmt.value),
        settlementCcy: this.setNullIfEmpty(formValues.settlementCurrency.value),
        notes: this.setNullIfEmpty(formValues.manualPayNotes.value),
      };

      const response = await DashboardService.processManualPayment(
        manualPayObj
      );

      if (response.isManualPaymentUpdated) {
        this.setState({
          loading: false,
          isMarkAsPaidClicked: false, 
          selectedManualPaymentMode: 'Cash', 
          searchedBenePayTransactionId: null
        });

        toast(response.message, {
          position: toast.POSITION.BOTTOM_CENTER,
          className: "toast-message toast-success",
         
        });
      } else {
        this.setState({
          loading: false
        });

        toast(response.message, {
          position: toast.POSITION.BOTTOM_CENTER,
          className: "toast-message toast-error",
        });
      }

      this.processedApply(this.state.pageNo);
    }else{
      this.setState({ loading: false });
    }
  }

  /**
   * Method that handles the payment method selection for manual pay
   * @param {} e 
   */
  handleManualPayChange = (e) => {
    this.setState({ selectedManualPaymentMode: e.target.value })
  }
  getUserInfo = async () => {
    try {
      const response = await DashboardService.getUserInfo();
      if (!response) {
        return;
      }
      
     // Ensure referralMerchantIds is defined and is an array
     let referralMerchantIds = Array.isArray(response.referralMerchantIds) ? response.referralMerchantIds : [];
    
     // Check if referralMerchantIds is empty and subMerchantIds has values
     if (referralMerchantIds.length === 0 && Array.isArray(response.subMerchantIds) && response.subMerchantIds.length > 0) {
       // Use subMerchantIds instead of referralMerchantIds
       referralMerchantIds = response.subMerchantIds.map(item => ({
         merchantId: item,
         merchantName: item  // You can adjust merchantName as per your data structure
       }));
     }
      
      const addOption = { merchantId: "All", merchantName: "All" };
      response.referralMerchantIds = [
        addOption,
        ...referralMerchantIds.map(item => 
          typeof item === 'string' ? { merchantId: item, merchantName: item } : item
        )
      ];
  
      if (Object.keys(response).length !== 0) {
        this.setState({ referralPartners: response, merchantsList: response.referralMerchantIds, merchantId: StorageService.get(StorageKeys.loggedInMerchantID), selectedMerchant: StorageService.get(StorageKeys.loggedInMerchantID),subMerchantIds:response.subMerchantIds ,payViaScreen:response.payViaScreen}, () => {
        });
      }    
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };

  handleDownloadFirc = async (fileId) => {
    this.setState({loading: true});
    let response = await DashboardService.getFirc(fileId);
    this.setState({loading: false});
    if (!response) {
      return;
    }
    if (response && response['Error Code'] && response['Error Code'].includes('500')) {
      toast.error('File does not exist!');
      return;
    }
    const blob = this.base64toBlob(response.content, 'text/pdf');
    if (window.navigator.msSaveBlob) {
      window.navigator.msSaveOrOpenBlob(blob, response.fileName + '.pdf');
    } else {
      var a = window.document.createElement("a");
      a.href = window.URL.createObjectURL(blob, { type: "text/plain" });
      a.download = response.fileName
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  handleDownloadFircZip = async (transactionId) => {
    this.setState({loading: true});
    let response = await DashboardService.getFircZip(transactionId);
    this.setState({loading: false});
    if (!response) {
      return;
    }
    if (response && response['Error Code'] && response['Error Code'].includes('500')) {
      toast.error('File does not exist!');
      return;
    }
    const blob = this.base64toBlob(response.content, 'text/pdf');
    if (window.navigator.msSaveBlob) {
      window.navigator.msSaveOrOpenBlob(blob, response.fileName);
    } else {
      var a = window.document.createElement("a");
      a.href = window.URL.createObjectURL(blob, { type: "text/plain" });
      a.download = response.fileName
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }
  
  handleDownloadQrClick = () => {
    const canvas = document.getElementById('qr-code-canvas');
    const pngUrl = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = 'Payment-QRCode';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  validateNumber=(val)=>{
    let formattedNum = val.replace(/[()-]/g, " ").replace(" ", "-").replace(/\s/g, "");
    this.setState({ mobileNumber: formattedNum });
  }

  /**
      * Collect the Transaction Mode  list
      */
  getTransactionCreationMode = async () => {
    this.setState({ loading: true });

    DashboardService.getLookupDetails(LookupKeys.transactionCreationMode).then((result) => {
      if (result && result.lookupDetails && result.lookupDetails.length > 0) {
        const filteredModes = result.lookupDetails.filter(mode => mode.lookupCode !== OnboardConstants.ViaUPIQRCode && mode.lookupCode !== OnboardConstants.ViaGenericQRCode);
        // Set the state with the filtered transaction creation modes
        this.setState({ transactionCreationModesList: filteredModes, loading: false });
      } else {
        this.setState({ loading: false });
      }
    });
  }

  handleselectedTransactionCreationMode= async (e, fieldName, val)=>{

    if(fieldName == "transactionCreationModesList"){
      if(val!=null ){
        // Update the state with the selected option's description    
        await this.setState({ selectedTransactionCreationMode: val ? val.description : null});
      }
    }

    if(fieldName == "settlementStatus"){
      this.setState({ selectedSettlementStatus: val ? val.name : null});
    }
  }

  handleRefundReview = () =>{
    if (
      this.state.selectedOption !== "Full Refund" &&
      parseFloat(this.state.refundAmount) > parseFloat(this.state.remainingAmt)
    ) {
      toast("The entered amount should not exceed the remaining amount", {
        position: toast.POSITION.BOTTOM_CENTER,
        className: "toast-message toast-info",
      });
      this.setState({ loading: false });
      return;
    }else{
      this.setState({refundReview : !this.state.refundReview});
    }
  }


    /**
     * Fetch Merchant currencys in the lookup table
     * And split key currency and allowed currency
     * @param {*} callback 
     * @returns 
     */
    getSupportedCurrency = async (callback = {}) => {
      this.setState({ loading: true });
      const response = await DashboardService.getLookupDetails("currency");
      const excludedCurrencyNames = ['INR', 'USD', 'GBP', 'EUR', 'AUD', 'AED', 'CAD'];

      if (!response) {
          this.setState({ loading: false });
          return
      }

      const ccyResponse = [];

      if (response.lookupDetails && response.lookupDetails.length > 0) {
          response.lookupDetails.forEach((v, i) => {
              ccyResponse.push(v.lookupCode);
          })
      }

      const withoutExcludedCurrencies = ccyResponse.filter((currency) => excludedCurrencyNames.includes(currency));
      const withoutKeyCurrencies = ccyResponse.filter((currency) => !excludedCurrencyNames.includes(currency));

      if (ccyResponse !== undefined && ccyResponse.length > 0 && withoutExcludedCurrencies.length > 0) {
          this.state.keyCurrenciesList = withoutExcludedCurrencies.map(currency => ({ name: currency, currencyType: 'keyCurrency', checked: false }));
          this.state.withoutKeyCurrenciesList = withoutKeyCurrencies.map(currency => ({ name: currency, currencyType: 'otherCurrency', checked: false }));
          this.state.allCurrency = ccyResponse;
      }

      if (typeof callback == 'function') {
          callback();
      }

      this.setState({ loading: false });
  }

  //Handle manual payments
  handlePartialPayment = async(fieldName, value,  validate = true, decimalConversions = false) =>{
    if(!this.state.manualPayFormFields[fieldName]){
      return;
    }
    
    try {
      let fields = { ...this.state.manualPayFormFields};

      if (fields.hasOwnProperty(fieldName) != -1) {
        if(fieldName == "manualPayAmount" || fieldName == "manualPaySettlementAmt"){
          value = String(value).replace(/[^0-9.]/g, '');
          if(decimalConversions && fieldName == "manualPayAmount" && this.state.manualPayAmountCcy){
            value = this.getFixedDecimalAmount(this.state.manualPayAmountCcy, value);
          }

          if(decimalConversions && fieldName == "manualPaySettlementAmt" && fields.settlementCurrency && fields.settlementCurrency.value){
            value = this.getFixedDecimalAmount(fields.settlementCurrency.value, value);
          }
        }

        fields[fieldName].value = value;

        await this.setState({ manualPaySettlementAmt: fields });
      }

      if (validate) {
        this.validateStlField(fieldName);
      }
    } catch (error) {
      // console.log("Error in handlePartialPayment", error);
    }
  }

  validateStlField = async (fieldName) => {

    let field = this.state.manualPayFormFields[fieldName];

    const { errors, valid } = await FormValidationService.validate(field.rules, field.value, this.state.manualPayFormFields);

    this.state.manualPayFormFields[fieldName].errors = errors;

    this.setState({ manualPayFormFields: this.state.manualPayFormFields });
  }

  validateForm = async () => {
    let formValid = true;
    
    for (let fieldName of this.manualPayFieldNames) {
      const field = this.state.manualPayFormFields[fieldName];
      
      const { errors, valid } = await FormValidationService.validate(field.rules, field.value, this.state.manualPayFormFields);

      this.state.manualPayFormFields[fieldName].errors = errors;

      if (!valid) {
          formValid = false;
      }
    };

    this.setState({ manualPayFormFields: this.state.manualPayFormFields });

    return formValid;
  }

  render = () => html.apply(this);
}

export default Home;
