import React, { Component } from "react";
import { DefaultDateFormat, OnboardConstants, Pagination } from "../../../config/constants";
import { html } from "./refundScreen-v1.html";
import { DashboardService } from "../../../service/api/dashboard.service";
import "../home.scss";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { DateFormat } from "../../../enum/common.enum";
import { StorageKeys, StorageService, TempStorage, USER_TYPE } from "../../../service/core/storage.service";
import { Auth } from "aws-amplify";
import { MerchantSelectionContext } from "provider/merchantSelectionProvider";
import Utils from "service/core/utils";

class RefundScreen extends Component {
  static contextType = MerchantSelectionContext;
  
  constructor(props) {
    super(props);
    this.state = {
      checkedStatuses: new Map(),
      selectedStatuses: [],
      teststatuscheck: [],
      // status: ["ALL", "AWAITING_PAYMENT", "PROCESSSING", "REJECTED_BY_PROVIDER", "PAID", "REFUNDED"],
      status: [],
      apply1Click: false,
      apply2Click: false,
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
      merchantsList: [],
      merchantId: "All",
      selectedMerchant: "All",
      mobileViewFilterModal: false,
      sortingType: null,
      sortingBy: null,
      isFirstTimeSearch: true,
      alreadyAppliedFilters: null,
      isAmountFilter: false,
      isDateFilter: false,
      transactionPaymenButtonRules: {
        disableViewPaymentDetails: true,
        disableViewFailedAttempts: true,
        disableViewRefundDetails: true,
        disableDuplicate: true,
        disableIssueRefund: true,
        disableCancelTransaction: true,
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
      columns: this.transactionSummaryColumns(),
      refundSearchModel: {
        allMerchant: false,
        merchantId: null,
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
        merchantId: "All",
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
      expandedOriginalDeatils: false,
      refundSummaryList: null,
      refundColumns: this.refundSummaryColumns(),
      totalCountRefundList: 0,
      totalPagesRefund: Pagination.totalPages,
      appliedRefundListFilters: [],
      refundBMinAmount: "",
      refundBMaxAmount: "",
      paymentBMinAmount: "",
      paymentBMaxAmount: "",
      isFirstTime: true,
      referralPartners: "",
      subMerchantIds:" ",
      merchantTimeZone:" "
    };
  }

  transactionSummaryColumns = () => {
    const cols = [
      {
        field: "debtorName",
        headerName: "Payer",
        width: 220,
        headerClassName: "serachedPaymentResultListHeaderColor",
        cellClassName: "table-cell-classname",
        flex: 1,
        minWidth: 180,
        renderCell: (params) => {
          return (
            <div
              title={params.row.debtorName}
              style={{
                cursor: "pointer",
                fontWeight: "400",
                textDecoration: "none",
                color: "#1A1A1C",
              }}
            >
              <p
                style={{
                  fontSize: "16px",
                  margin: "0",
                  padding: "0",
                  marginBottom: "2px",
                }}
              >
                {params.row.debtorName}
              </p>
              <p
                className="text-ellipsis"
                style={{ fontSize: "14px", margin: "0", padding: "0" }}
              >
                {params.row.debtorEmailId}
              </p>
            </div>
          );
        },
      },
      {
        field: "transactionId",
        headerName: "BenePay Transaction Id",
        width: 280,
        minWidth: 260,
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
        minWidth: 190,
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
        minWidth: 200,
        valueGetter: (params) =>
          moment(params.value).format(DateFormat.dateTime),
      },
      {
        field: "collectionReferenceNumber",
        headerName: "Collection Ref",
        // width: 240,
        headerClassName: "serachedPaymentResultListHeaderColor",
        cellClassName: "table-cell-classname",
        flex: 1,
        minWidth: 155,
      },
      {
        field: "requestorTransactionId",
        headerName: "Requestor Transaction ID",
        // width: 240,
        headerClassName: "serachedPaymentResultListHeaderColor",
        cellClassName: "table-cell-classname",
        flex: 1,
        minWidth: 245,
      },
      {
        field: "collectorsName",
        headerName: "Merchant Name",
        width: 230,
        minWidth: 130,
        headerClassName: "serachedPaymentResultListHeaderColor",
        cellClassName: "table-cell-classname",
        flex: 1,
      },
      {
        field: "refundCount",
        headerName: "Refunds",
        align: "left",
        headerAlign: "left",
        headerClassName: "serachedPaymentResultListHeaderColor",
        cellClassName: "table-cell-classname",
        flex: 1,
        minWidth: 115,
        renderCell: (params) => {
          const refundsCount = params.row.refundCount;

          if (refundsCount > 0) {
            return (
              <a
                title={refundsCount}
                style={{
                  color: "blue",
                  textDecoration: "underline",
                  cursor: "pointer",
                  width: "content-fit",
                }}
                onClick={() => {
                  this.handleRefundDetails(params);
                }}
              >
                {refundsCount}
              </a>
            );
          } else {
            return <p title={refundsCount}>{refundsCount}</p>; // Display the count as is when it's not greater than 0
          }
        },
      },
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
        headerName: "",
        width: 20,
        align: "center",
        headerAlign: "center",
        headerClassName: "serachedPaymentResultListHeaderColor",
        cellClassName: "table-cell-classname-actions",
        flex: 1,
        minWidth: 20,
        disableColumnMenu: true,
        sortable: false,
        border: 0,
        renderCell: (params) => {
          return (
            <ActionBtn
              params={params}
              setSelectedItem={this.setSelectedItem}
              handleCopyClick={this.handleCopyClick}
              refundClick={this.refundClick}
              sendPaymentReminderBtn={this.sendPaymentReminderBtn}
            />
          );
        },
      },
    ];

    if (TempStorage.loginUserRole !== USER_TYPE.ADMIN_USER) {
      const withoutMerchantName = cols.filter(
        (column) => column.field !== "collectorsName"
      );
      return withoutMerchantName;
    }

    return cols;
  };

  // Refund Screen

  handleRefundSearch = async () => {
    this.setState({ initalPage: 0 , pageNoForRedirect:'' });
    this.getRefundSearchResult(1);
    this.setState({
      expandedRefundDeatils: false,
      expandedOriginalDeatils: false,
    });
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

  getRefundSearchResult = async (paramPageNo) => {
    let obj = this.state.refundSearchModel;
    obj["pageNo"] = paramPageNo;
    obj["pageSize"] = this.state.pageSize;
    
    // obj.merchantId="All";
    // if (this.state.merchantId) {
    //   obj.merchantId = this.state.merchantId;
    // }

    this.setState({
      merchantId: StorageService.get(StorageKeys.merchantId) !== 'All' ? StorageService.get(StorageKeys.merchantId) : "All",
      selectedMerchant: StorageService.get(StorageKeys.selectedMerchantId) !== 'All' ? StorageService.get(StorageKeys.selectedMerchantId) : "All"
    });

    const merchantId = StorageService.get(StorageKeys.merchantId);
    const selectedMerchantId = StorageService.get(StorageKeys.selectedMerchantId);

    // obj.allMerchant = true;
    if( (TempStorage.loginUserRole === USER_TYPE.ADMIN_USER ||  this.state.referralPartners.merchantType === OnboardConstants.ReferralMerchant || this.state.subMerchantIds.length > 0) && (selectedMerchantId === "All")){
      obj.merchantId = "All";
      obj.allMerchant = true;
      
    } else if (!selectedMerchantId&& !this.state.referralPartners.merchantType === OnboardConstants.ReferralMerchant && this.state.subMerchantIds.length === 0) {
      obj.merchantId = merchantId;
      obj.allMerchant = false;

    }else if (selectedMerchantId === "All" && !this.state.referralPartners.merchantType === OnboardConstants.ReferralMerchant && this.state.subMerchantIds.length === 0) {
      obj.merchantId = merchantId;
      obj.allMerchant = false;

    } else if (selectedMerchantId && this.state.referralPartners.merchantType === OnboardConstants.ReferralMerchant ||  this.state.subMerchantIds.length > 0 ) {
      // obj.merchantId = this.state.selectedMerchant;
      obj.merchantId = merchantId;
      obj.allMerchant = false;
      
    }  else if (selectedMerchantId && TempStorage.loginUserRole === USER_TYPE.ADMIN_USER && this.state.subMerchantIds.length === 0) {
      // obj.merchantId = this.state.selectedMerchant;
      obj.merchantId = StorageService.get(StorageKeys.merchantId);
      obj.allMerchant = false;

    } else {
      obj.merchantId = null;
      obj.allMerchant = false;
    }
    
    
    this.setState({ refundSearchModel: obj, loading: true });
    this.props.setLoading(true);

    let result = await DashboardService.getRefundList(
      this.state.refundSearchModel
    );

    this.setState({ loading: false });
    this.props.setLoading(false);

    if (result && result.refundDetails) {
      this.setState({ refundSummaryList: result.refundDetails });
    }

    if (result && result.totalCount) {
      this.setState({ totalCountRefundList: result.totalCount });
      let totalPagesRefund = result.totalCount / this.state.pageSize;
      this.setState({
        totalPagesRefund: Math.ceil(totalPagesRefund),
        pageNo: result.pageNo,
      });
    }

    this.prepareRefundListFilters();

    console.log(
      "appliedRefundListFilters",
      this.state.appliedRefundListFilters
    );
    console.log("refundSearchModel", this.state.refundSearchModel);
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
          refObj["refundEndDate"] = null;
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
        this.state.refundSearchModel.paymentStartDate &&
        this.state.refundSearchModel.paymentEndDate
      ) {
        obj["value"] = `${moment(
          this.state.refundSearchModel.paymentStartDate
        ).format(DateFormat.date)} - ${moment(
          this.state.refundSearchModel.paymentEndDate
        ).format(DateFormat.date)}`;
      } else if (this.state.refundSearchModel.paymentStartDate) {
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
          refObj["payerName"] = null;
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
        title: `Payment Amt`,
        value: `${
          this.state.refundSearchModel.paymentCcy
            ? this.state.refundSearchModel.paymentCcy
            : "CCY"
        } ${
          this.state.refundSearchModel.paymentMinAmount
            ? this.state.refundSearchModel.paymentMinAmount
            : "0"
        } - ${
          this.state.refundSearchModel.paymentMaxAmount
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
          this.setState({ refundSearchModel: refObj, paymentBMinAmount: "", paymentBMaxAmount: "" });
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
        title: `Refund Amt`,
        value: `${
          this.state.refundSearchModel.refundCcy
            ? this.state.refundSearchModel.refundCcy
            : "CCY"
        } ${
          this.state.refundSearchModel.refundMinAmount
            ? this.state.refundSearchModel.refundMinAmount
            : "0"
        } - ${
          this.state.refundSearchModel.refundMaxAmount
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
          this.setState({ refundSearchModel: refObj, refundBMinAmount: "", refundBMaxAmount: "" });
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
        field: "originalTransactionId",
        headerName: "Original Transaction Id",
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
        minWidth: 165,
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
        minWidth: 300,
        valueGetter: (params) => {
          const formattedDate = moment(params.value).format(DateFormat.dateTime);
          const timeZone = this.state.merchantTimeZone;
          return `${params.value}`;
        },
      },
      {
        field: "refundedBy",
        headerName: "Refunded By",
        // width: 240,
        headerClassName: "serachedPaymentResultListHeaderColor",
        cellClassName: "table-cell-classname",
        flex: 1,
        minWidth: 140,
      },
      {
        field: "payerName",
        headerName: "Payer Name",
        minWidth: 100,
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
        minWidth: 130,
        headerClassName: "serachedPaymentResultListHeaderColor",
        cellClassName: "table-cell-classname",
        flex: 1,
      },
      {
        field: "refundReason",
        headerName: "Refund Reason",
        minWidth: 200,
        headerClassName: "serachedPaymentResultListHeaderColor",
        cellClassName: "table-cell-classname",
        flex: 1,
      },
    ];

    return cols;
  };

  handlePageChangeRefund = (data) => {
    if (data.selected + 1 > this.state.totalPagesRefund ) {
      data.selected = this.state.totalPagesRefund - 1;
    } else if (data.selected <= 0) {
      data.selected = 0;
    }
    this.setState({ initalPage: data.selected });
    this.setState({ pageNo: data.selected + 1 });
    this.getRefundSearchResult(data.selected + 1);
  };

  sortRefundList = async (model) => {
    let sortingType = null;
    let sortingBy = null;

    if (model.length !== 0) {

      console.log("Model for sorting", model);
      sortingType = model[0].sort;

      switch (model[0].field) {
        case "refundTransactionId":
          sortingBy = "refundId";
          break;

        case "refundRequestorTransactionId":
          sortingBy = "requestorTxnId";
          break;

        case "refundedOn":
          sortingBy = "dateCreated";
          break;

        case "payerName":
          sortingBy = "debtorName";
          break;

        case "refundedToInstrument":
          sortingBy = "refundedTo";
          break;

        case "refundReason":
          sortingBy = "refundReason";
          break;

        case "refundedBy":
          sortingBy = model[0].field;
          break;

        default:
          sortingBy = model[0].field;
          break;
      }

    }
    let obj = this.state.refundSearchModel;
      obj["sortingType"] = sortingType;
      obj["sortingBy"] = sortingBy;
      this.setState({ refundSearchModel: obj });
      this.getRefundSearchResult(1);
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
      merchantId: "All",
      selectedMerchant: "All",
    });

    // if(this.props.refundFormFields){
    //   var fieldNames = ['refundMinAmount', 'refundMaxAmount', 'paymentMinAmount','paymentMaxAmount'];

    //   this.props.prepareField(fieldNames, this.props.rule);
    // }
    this.setState({refundBMinAmount: "", refundBMaxAmount: "", paymentBMinAmount: "", paymentBMaxAmount: ""})
    this.prepareRefundListFilters();
    this.setState({ appliedRefundListFilters: [] })
  };

  componentDidMount = async () => {

    await Auth.currentSession().then(res => {
      let jwt = res["idToken"]["jwtToken"]
      StorageService.set(StorageKeys.clientJwt, jwt);
    });
    await this.getUserInfo();
    
    let loggedInMerchantID = StorageService.get(StorageKeys.loggedInMerchantID);
    if(loggedInMerchantID){
      await this.setState({merchantId: loggedInMerchantID});
    }

    // this.handlePageChangeRefund({ selected: this.state.pageNo - 1 });
    if (TempStorage.loginUserRole === USER_TYPE.ADMIN_USER) {
      const response = await DashboardService.getMerchantSummaryList();
      const addOption = { merchantId: "All", merchantName: "All" };
      response.merchantSummary = [addOption, ...response.merchantSummary]; //Add a All option in merchants array

      if (Object.keys(response).length !== 0) {
        this.setState({ merchantsList: response.merchantSummary });
      }

      this.setState({ merchantId: StorageService.get(StorageKeys.merchantId) });
    }
  }

  componentDidUpdate = async () => {
    if(this.props.refundBtnClick && this.state.isFirstTime){
      this.handlePageChangeRefund({ selected: this.state.pageNo - 1 });
      this.setState({isFirstTime: false});
      this.getMerchantPreferences();
    }

    if (TempStorage.loginUserRole === USER_TYPE.ADMIN_USER) {
      const { merchantId } = this.state;
      const { merchantValue } = this.context;
      
      if (!Utils.isNullOrEmpty(merchantId) && !Utils.isNullOrEmpty(merchantValue) && merchantId != merchantValue) {
        this.setState({ merchantId: merchantValue }, () => {
          this.handleRefundSearch();
        });
      }
    }
  }

  //Remove the particular index in the search object
  removeKeys = (keysToRemove) => {
    const updatedObject = { ...this.state.refundSearchModel };
    keysToRemove.forEach(key => {
      delete updatedObject[key];
    });

    return updatedObject;
  };

  downloadRefundTransactions = async () => {
    this.setState({
      loading: true,
    });
    var reqObj = this.removeKeys(['pageNo', 'pageSize']);

    const response = await DashboardService.downloadRefundReport(
      reqObj,
      "report"
    );
    if (!response) {
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

    this.setState({
      loading: false,
    });
    console.log("searchObjiuytr", this.state.refundSearchModel);
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

  changeDateFormat = (event) => {
    let value = null;

    if (event != null) {
      value = moment(event.toDate()).format(DefaultDateFormat.dateFormatymd);
    }

    return value;
  };

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
        this.setState({ referralPartners: response, merchantsList: response.referralMerchantIds, merchantId: StorageService.get(StorageKeys.merchantId), selectedMerchant: StorageService.get(StorageKeys.selectedMerchantId) ,subMerchantIds:response.subMerchantIds }, () => {
          // Callback function if needed
        });
      }
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };

  getMerchantPreferences = async () => {
    let result = await DashboardService.getMerchantPreferences();
    if(result){
      this.setState({
        merchantTimeZone:result.merchantTimeZone
      })
    }
  }

  render = () => html.apply(this);
}

export default RefundScreen;
