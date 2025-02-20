import { config } from './config'
import { Environment } from '../enum/common.enum'

// const baseUrlProd = 'https://y1izdj44ki.execute-api.ap-south-1.amazonaws.com/test-prod';
// const baseUrlProd = 'https://collect-v2.api.benepay.io';

export const baseUrl = process.env.REACT_APP_BASE_API_URL;

export const urls = {
    // to be added later
    getAllowdedCurrencyDecimals: "/v2/getAllowdedCurrencyDecimals",
    getPaymentSearchList: '/v1/transactionSearchRequest',
    getRejectedPaymentSearchList: '/v1/unprocessedSearchRequest',
    getCurrencies: '/v1/supportedCurrency',
    initiateRefund: '/v1/transaction/',
    export: '/v1/export',
    downlaodSettlement: '/v1/settlement',
    uploadFile: '/v2/uploadpaymentfile',
    UploadedFilesList: '/v2/fileSummaryList',
    userInfo: '/v2/userOrgInfo',
    refundFile: '/v2/refundFile/upload',
    errorList: '/v2/errorSummaryList',
    paymentFileResponse: '/v2/download/paymentfileresponse',
    cancelPayment: '/v2/cancelPayment',
    searchFailedPayments: '/v2/searchRequest/failedAttempts',
    downloadFailedTransactionsReport: '/v2/export/failed',
    getSettlementReportResult: '/v2/settlement/merchant/getReports',
    downloadSettlementReport: 'v2/settlement/merchant/download/file',
    paymentDetails: '/v2/getPayments/',
    sendPaymentReminder: 'v2/sendPaymentReminder',
    searchPayers : '/v2/searchPayers',
    payerRecentTransaction : '/v2/getPayerRecentTransaction',
    createPayment : '/v2/createPayment',
    currencyDecimals : '/v2/getCurrencyDecimals',
    merchantDetails : '/v2/getMerchantDetails',
    checkRequestorTransaction : '/v2/checkRequestorTxnId',
    getExpiryDate: '/v2/calculateExpiryDate',
    getRefundDetails: '/v2/transaction/refundDetails/',
    generateInvoice: '/v2/generateInvoice/',
    fetchMerchantBroadcast: '/v2/fetchMerchantBroadcast',
    updateMerchantBroadcast: '/v2/updateMerchantBroadcast/',
    getActivitySummary :'/v2/activitySummary',
    getAgingSummary : '/v2/aging',
    getConversionSummary : '/v2/conversions',
    getSettlement30days :'/v2/settlement-trend-last-30-days',
    getSettlement1year :'/v2/settlement-trend-last-year',
    getExpirySummary : '/v2/payments-nearing-expiry',
    getDemographySummary:'/v2/payer-demography',
    getMethodSummary : '/v2/payment-methods',
    getMerchantProfileData :"/v2/fetchMerchantProfileDetails",

    getRefundList: "/v1/refundSearchRequest",
    refundExport:"/v1/refundExport",
    downloadTemplate : "/v2/downloadTemplate/",

    getMerchantPreferences: "/v2/getMerchantPreferences",
    updateManualPayment : "/v2/processManualPayment",

    getPrivileges : "/v2/privileges",
    saveFircFiles: "/v2/saveFircFiles",
    getFirc: "/v2/getFirc/",
    getFircZip: "/v2/getFircZip/",
    manualPaymentDetails: "/v2/getManualPayments/",
    getTimeZones:"/v2/getTimeZones",
    getPrivileges : "/v2/privileges"
};

export const adminUrls = {
    uploadSettlementFile: 'v2/settlement/uploadAndProcessFile',
    getFromProvidedResult: 'v2/settlement/getUploadedFilesSummary',
    getGeneratedByBenepayResult: 'v2/settlement/getReports',
    downloadFromSettlementFile: 'v2/settlement/download/file',
    downloadGeneratedByBenepayFile: 'v2/settlement/download/file',
    getAllMerchants: '/v2/settlement/getMerchants',
    getAllProviders: '/v2/settlement/getProvidersList',
    getMerchants: '/v2/merchantSummaryList',
    getParentCustomers: '/v2/parentCustomerList/',

    validateMerchantId: 'v2/onboarding/merchants/validation',

    getLookupDetails:'/v2/lookupDetails/',
    addLookupDetails:'/v2/lookupDetails/save',

    fetchMerchantBasicDetails: 'v2/onboarding/merchantDetails/',
    fetchOnboardPreferences: 'v2/onboarding/preference/list/',
    fetchNotifications: 'v2/onboarding/notification/list/',
    fetchMerchantOnboarding: 'v2/onboarding/paymentProviders/list',

    saveMerchantBasicDetails: '/v2/merchants/onboarding',
    saveMerchantLogo: 'v2/onboarding/merchantLogo/save',
    saveMerchantServicepref: 'v2/onboarding/preference/save',
    saveMerchantNotification: 'v2/onboarding/notification/save',
    saveMerchantOnboarding: 'v2/onboarding/paymentProviders/save',

    saveMerchantSettlement: '/v2/onboarding/updateMerchantSettlement',
    getMerchantSettlement: '/v2/onboarding/merchantSettlements/',
    inactiveMerchantSettlement: '/v2/onboarding/merchantSettlement/delete/',

    deleteBasicDetails:'v2/onboarding/merchantDetails/delete',
    deleteOnboardPreference:'v2/onboarding/preference/delete',
    deleteNotificationDetails:'v2/onboarding/notification/delete',

    activateMerchantDetails:'v2/onboarding/merchant/activate/',
    deActivateMerchantDetails:'/v2/onboarding/merchant/deactivate/',
    
    inactivateMerchantProvider:'/v2/onboarding/merchant/provider/inactivate',
    deleteOnboardTabDetails:'v2/onboarding/paymentProviders/delete',
  
    getAllBroadcasts : '/v2/getBroadcastMessages',
    createBroadcast: '/v2/createBroadcast',
    updateBroadcast : '/v2/updateBroadcast/',
    deleteBroadcast: '/v2/deleteBroadcast/',

    getPaymentProviders: '/v2/onboarding/getPaymentProviders',
    getPaymentProviderList: "/v2/payment-provider",
    getPaymentMethodList: "/v2/payment-method",
    getPaymentCcy: "/v2/payment-ccy",
    createMerchantSplit: "/v2/merchant-split/add",
    getSplitInfo: "/v2/merchant-split",
    updateMerchantSplit: "/v2/merchant-split/update",
    getMerchantSplitList: "/v2/merchant-split-list",
    deleteMerchantSplit: "/v2/merchant-split/delete",
    referalPartnerDetails: "/v2/referal-partner-details",
    childMerchantInfo: "/v2/child-merchant-settlement",
    inactiveTransactionMode: '/v2/onboarding/inactivate/transactionMode',
    getAllPrivileges: "/v2/getPrivileges",
    traceDetails : '/v2/traceDetails',
  
    getAllRoles: "/v2/getRoles",
    createRole: "/v2/createRole",
    getPrivilegesById: "/v2/privileges",
    deleteRole: "/v2/deleteRole",
    getProviderParameters : '/v2/providerParameters/',
    updateMerchantParameter : '/v2/merchantParameter/update',
    deleteParameter : '/v2/merchantParameter/delete',
    getSnapshotTransactions : '/v2/getSnapshot/transactions',
    getSnapshotpayments : '/v2/getSnapshot/payments',
    getSnapshotRefunds : '/v2/getSnapshot/refunds',
    getSnapshotTraceEntry : '/v2/getSnapshot/traceEntry',
    getSnapshotSettlements : '/v2/getSnapshot/settlements',

    getVirtualAccount: '/v2/onboarding/virtualAccount',
    saveVirtualAccount: '/v2/onboarding/virtualAccount/update',
    paymentRelationDetails :'/v2/getRelationData',
    updatePaymentRelation  :'/v2/updatePaymentRelation',
    savePaymentRelation  :'/v2/savePaymentRelation',
    deletePaymentMethod: '/v2/deletePaymentRelation',
    saveOnboardPaymentMethods  :'/v2/onboarding/paymentMethods/save',
    getOnboardPaymentMethods :'/v2/onboarding/paymentMethods/fetch',
}
