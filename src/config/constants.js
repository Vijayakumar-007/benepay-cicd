export const messages = {
    userUpdated: 'Your profile has been saved successfully.',
    userPasswordError: 'Current authenticated user is empty or null.',
    fieldRequired: 'This field is required',
    incorrectCurrentPasswordError:'Incorrect current password. Please try again.',
    passwordNotMatchError:'New password and confirm new password do not match.',
    sameCurrentAndOldPasswordError:'Current password and new password cannot be the same.',
    chartacterValidationError:'New password must be at least 5 characters long and contain at least one capital letter, one numeric digit, and one special character.',
    catchError:'Password change failed ',
    successfullPasswordChange:'Password changed successfully.',
    reloginConfirmation:'Please confirm to change password and re-login',
    requiredField:'This is Required.',
    invalidField:'Invalid Field.',
    emailInvalid:'Invalid Email',
    mobileInvalid:'Invalid Mobile Number',
    requiredPositiveNumber:'Required positive numbers',
    nonZero:'Should not be a zero',
    requiredDecimal:'Provide value in {decimal} decimals',
    greatorError:'Cannot be greator value',
    sumNotEqual:'Sum of values are not equal',
    lessAmount:'Should be less than Total Amount',
    shouldEqual: 'Sum of Amount and Charges should be equal to Total Amount',
    spEmailInvalid:'Please enter a valid email address (i.e. yourname@domain.com).',
    spConfirm: 'Your current payment is due to expire on {date}. Would you like to continue?',
    expiryDateNotLessThanDueDate:'Expiration date cannot be before the due date.',
    minAmountLessThanMaxAmount:'Max amount cannot be less than from Min',
    bdSaveSuccess : 'Basic Details Saved Successfully',
    logSaveSuccess : 'Logo Uploaded Successfully',
    logDeleteSuccess : 'Logo Deleted Successfully',
    logDeleteError : 'Unable to Delete the logo',
    spSaveSuccess : 'Preferences saved successfully.',
    ntnSaveSuccess : 'Notification Settings saved successfully.',
    onboardSaveSuccess : 'Onboarding Saved Successfully',
    unableToSave : 'Unable to save',
    merchantIdValidate : 'Merchant ID is not greater than 15 characters.',
    referralMerchantIdValidate : 'Merchant ID is not greater than 13 characters.',
    maxLength: 'Should not have more than {length} characters!',
    invalidLogoType:'Invalid file type. Please select a valid image file format',
    successDeleteBasicDetails:'Merchant Basic Details deleted successfully!',
    errorDeleteBasicDetails:'Unable to delete',
    startsAlphabet:'Value should be starts with alphabet.',
    nameContains:'Use the allowed characters as (-, 0-9, A-z, white space)',
    symbolnorepeat:'Special character should not be repeat continuously.',
    commonErrorMsg:'Please ensure that all required fields are provided.',
    postCode:'Postcode should be between 4 to 10 characters long',
    defaultErrorMsg:'Unable to process...',
    defaultSuccessMsg:'Updated Successfully...',
    onboardingStartDate:'Start date cannot be greater than end date.',
    onboardingEndDate:'End date cannot be less than start date.',
    transactionModeErrorMsg:'Any one of the transaction mode is required',
    merchantIdErrMsg:'Merchant id is required',
    mIDValidationErrMsg:'The value should contain only a-z, A-Z, 0-9, -, _ and single spaces.',
    preferenceTxnModePriorityMsg:"Your primary payment gateway is currently set to '${modeName1}.' Please prioritize the ${modeName2} Payment Gateway to disable the ${modeName1} Payment method.",
    preferenceTxnModeDeleteMsg:"Removing the ${modeName1} Payment option will disable the following gateways: ${paymentGateways}. Existing payment requests also support only for ${modeName2} Payment option. Do you wish to proceed?",
    preferenceDisableMerchantTxnMode:"Removing the ${modeName1} Payment option will prevent you from marking payment requests as Paid ${modeName2}. Do you wish to proceed?",
    serverError:'Internal Server Error',
    accountNumberErrorMsg:' Value should be in numeric.',
    partialAmountValidationErrMsg:'Please enter a valid amount!',
};

export const Countries = [
    // {text: 'Select Country', value: ''},
    {text: 'India', value: 'india'},
    {text: 'United Kingdom', value: 'uk'},
    {text: 'United States', value: 'us'},
    {text: 'Australia', value: 'aus'},
    {text: 'China', value: 'ch'},
    {text: 'Russia', value: 'rus'},
];

export const Currencies = [
    // {text: 'INR', value: 'inr'},
    {text: 'GBP', value: 'gbp'},
    {text: 'EUR', value: 'eur'},
    // {text: 'USD', value: 'usd'}
];

export const States = [
    {text: 'Select State', value: ''},
    {text: 'Uttar Pradesh', value: 'up'},
    {text: 'Madhya Pradesh', value: 'mp'},
];

export const Languages = [
    {text: 'English', value: 'en'},
    {text: 'Spanish', value: 'es'},
]

export const Pagination = {
    pageSize: 10,
    pageNo: 1,
    totalPages : 5,
    numPageShow: 3,
    transactionPageSize:20,
}

//Onboading
export const OnboardConstants = {

    //Onboarding Tab Values
    basicDetailsTabVal:"basicDetails",
    logoTabVal:"logo",
    spTabVal:"servicesAndPreferences",
    notificationsTabVal:"notifications",
    onboardTabVal:"onboarding",
    settlementTabVal:"settlement",
    virtualACTabVal:"virtualAccount",
    revenueTabVal:"revenueSplit",
    paymentMethodTabValue :"PaymentMethod",

    //Onboarding Tab Label
    basicDetailsTabLabel:"Basic Details",
    logoTabLabel:"Logo",
    spTabLabel:"Services & Preferences",
    notificationTabLabel:"Notifications",
    onboardTabLabel:"Onboarding",
    settlementTabLabel:"Settlement A/c",
    virtualACTabLabel:"Virtual A/C",
    revenueTabLabel:"Revenue Split",
    paymentMethodLabel :"Payment Method",

    //Onboarding Stage Names
    INITIATED : "initiated",
    INPROGRESS : "inprogress",
    DONE : "done",

    //Transaction Initiation Modes

    ViaApi:"API",
    ViaFileUpload:"FU",
    ViaDRM:"DRM",
    ViaScreen:"SPR",
    ViaUPIQRCode:"UQC",
    ViaGenericQRCode:"GQC",
    ViaCustomPay:"CPP",

    RefundViaApi:"API",
    RefundViaFileUpload:"FU",
    RefundViaDRM:"DRM",
    RefundViaScreen:"SPR",
    RefundViaUPIQRCode:"UQC",
    RefundViaGenericQRCode:"GQC",
    RefundViaApi:"API",

    CancellationViaFileUpload:"FU",
    CancellationViaDRM:"DRM",
    CancellationViaApiLabel:"Via API",
    CancellationViaApi:"API",
    CancellationViaScreen:"SPR",
    CancellationViaUPIQRCode:"UQC",
    CancellationViaGenericQRCode:"GQC",

    ReferralMerchant:"4",
    ReferralMerchantPrefix:"RP",
    ActiveStatus:1,
    InActiveStatus:0,
    paid:"PAID",

    PARAMETER_DEFAULT_RECORDS : "DEFAULT"
}

export const LookupKeys = {
    currency: "currency",
    onboardingStatus: "onboardingStatus",
    transactionCreationMode: "transactionCreationMode",

}
export const ProviderNotes = {
    nttNotes: "Please ensure that the Provider ID, Skin Code, Signature Key are added for the NTTData payment provider to enable payments. Example: Provider ID - 447041, Skin - 5999, Signature Key - KEY123657234",
    pagLocalNotes: "Please ensure that the Provider ID field is added for the PAYGLOCAL payment provider to enable payments. Example: Provider ID - test_mid1",
    finaroNotes: "Please ensure that the Provider ID, Skin Code fields are added for the FINARO payment provider to enable payments. Example: Provider ID - BENE2978, Skin - 1048, Signature Key - MRV6ZR2Y",
}

export const manualPay = {
    enabled : "1",
    disabled : "2",
    initialTransactionMode : "0",
    transactionModeDigital : 1,
    transactionModeManual : 2,
    transactionModeBoth : 3,
    manualMode : "Manual",
    digitalMode : "Digital",
    deleteManualMode : "DeleteManualMode",
    deletedigitalMode : "DeleteDigitalMode",
    disableMerchantManualMode : "DisableMerchantManualMode",
    disableMerchantDigitalMode : "DisableMerchantDigitalMode",
    manualPaymentModeCash : "Cash",
    manualPaymentModeCheque : "Cheque",
    manualPaymentModeIntBankAccount : "International Bank Account",
    paymentModes:["Cash", "Cheque", "International Bank Account"]
}

export const PrivilegeConstants = {
    CREATE_NEW_BRODCAST: "isCreateNewBroadcast",
    ADD_MERCHANT: "isAddNewMerchant",
    MERCHANT_SUMMARY_LIST: "isMerchantSummaryList",
    MERCHANT_SUMMARY_ACTION_BTN: "isMerchantSummaryActionBtn",
    SETTLEMENT_REPORT_FROM_PROVIDER: "isSettlementReportsFromProvider",
    SETTLEMENT_REPORT_GENERATED_BY_BENEPAY: "isSettlementReportsGeneratedByBenepay",
    UPLOAD_SETTLEMENT_REPORT: "isUploadNewSettlementReport",
    REFUND_FILE_UPLOAD: "isRefundFileUpload",
    PAYMENT_FILE_UPLOAD: "isPaymentFileUpload",
    UPLOAD_REFUND_FILE:"UPLOAD_REFUND_FILE",
    UPLOAD_PAYMENT_FILE: "UPLOAD_PAYMENT_FILE",
    TRANSACTION_SEARCH: "TRANSACTION_SEARCH_REQUEST",
    REFUND_SEARCH: "REFUND_SEARCH_REQUEST",
    DASHBOARD_SCREEN: "isDashboardScreen",
    PROFILE_SCREEN: "isProfileScreen",
    CHANGE_PASSWORD_SCREEN: "isChangePasswordScreen",
    SETTLEMENT_SEARCH_REPORT: "isSettlementSearchReports",
    EXPORT_PAYMENT: "EXPORT_PAYMENT",
    EXPORT_REFUND: "EXPORT_REFUND",
    CREATE_PAYMENT: "CREATE_PAYMENT",
    CANCEL_PAYMENT: "CANCEL_PAYMENT",
    REFUND_REQUEST: "REFUND_REQUEST",
    SEND_PAYMENT_REMINDER: "SEND_PAYMENT_REMINDER",
    COPY_PAYMENT_LINK: "COPY_PAYMENT_LINK",
    MARK_AS_PAID: "MARK_AS_PAID",
    COPY_BP_TRANSACTION_Id: "COPY_BP_TRANSACTION_Id",
    DUPLICATE_PAYMENT_REQUEST: "DUPLICATE_PAYMENT_REQUEST",
    VIEW_PAYMENT_DETAILS: "VIEW_PAYMENT_DETAILS",
    VIEW_REFUND_DETAILS: "VIEW_REFUND_DETAILS",
    VIEW_FAILED_DETAILS: "VIEW_FAILED_DETAILS",
    GENERATE_INVOICE: "GENERATE_INVOICE",
    PAYMENT_LINK_REPORT_UPLOAD: "PAYMENT_LINK_REPORT",
    DOWNLOAD_SAMPLE_UPLOAD_FILE: "DOWNLOAD_SAMPLE_UPLOAD_FILE",
    DOWNLOAD_ERROR_SUMMARY: "DOWNLOAD_ERROR_SUMMARY",
    DOWNLOAD_UPLOADED_REFUND_FILE: "PAYMENT_LINK_REPORT",
    ROLES_SCEEN: "isRolesScreen",
    TRACE_ENTRY_SCREEN: "TRACE_ENTRY_SCREEN",
    SETTINGS_MENU: "SETTINGS_MENU",
    PARAMETERS_CONFIGURATION: "PARAMETERS_CONFIGURATION",
    TRANSACTION_SNAPSHOT: "TRANSACTION_SNAPSHOT",
    FIRC_FILE_UPLOAD: "FIRC_FILE_UPLOAD",
}

export const DefaultDateFormat = {
    dateFormat : "DD-MM-YYYY", 
    dateFormatInSlash : "DD/MM/YYYY", 
    dateFormatddmmmyyyy : "DD-MMM-YYYY",    
    dateFormatymd : "YYYY-MM-DD",    
    dateFormatddmmmyyyywI : "DD MMMM YYYY",    
}

export const ServiceAndPreferenceConstatnts = {
    // Define constants
     PREFERENCE_ENABLED :"1",
     PAYMENT_REQUEST_VIA_API : "paymentRequestViaApi",
     PAYMENT_REQUEST_VIA_FILE : "paymentRequestViaFile",
     PAYMENT_REQUEST_VIA_SCREEN : "paymentRequestViaRealtimeApi",
     PAYMENT_REQUEST_VIA_REALTIME_API : "paymentRequestViaScreen",
     REFUND_VIA_API : "refundViaApiPreference",
     REFUND_VIA_FILE : "refundViaFile",
     REFUND_VIA_SCREEN : "refundViaScreenPreference",
     CANCELLATION_VIA_API : "cancellationViaApiPreference",
     CANCELLATION_VIA_SCREEN : "cancellationViaScreenPreference", // First 'Cancellation via Screen'
     GENERATE_QR_CODE : "generateQrCode",
     GENERATE_UPI_QR_CODE : "generateUpiQrCode",
     ALLOW_PARTIAL_PAYMENTS : "allowPartialPayments",
     SKIP_PAYER_UI : "skipPayerUi",
     INVOICE_SUBSCRIPTION : "invoiceSubscriptionPreference",
     PAID_INVOICE_TO_PAYER : "paidInvoiceToPayer",
     UNPAID_INVOICE_TO_PAYER : "unpaidInvoiceToPayer",
     MERCHANT_RETURN_URL : "merchantReturnUrl",
     MERCHANT_CALLBACK_URL : "merchantCallbackUrlPreference",
     PAYMENT_NO_OF_DUE_DAYS : "paymentNoOfDueDays",
     PAYMENT_NO_OF_EXPIRY_DAYS : "paymentNoOfExpiryDays",
     DEFAULT_EMAIL_ID : "defaultEmailId",
     DEFAULT_SMS_NUMBER : "defaultSmsNumber",
     DEFAULT_WHATSAPP_NUMBER : "defaultWhatsappNumber",
     REMINDER_FREQUENCY : "reminderFrequency",
     DEFAULT_CURRENCIES : "Default Currencies",
     KEY_CURRENCIES : "keyCurrencies",
     OTHER_CURRENCIES : "otherCurrencies",
     MANUAL_PAYMENTS : "manualPayment",
     DIGITAL_PAYMENTS : "digitalPayment",
     MERCHANTID:"merchantId"
    
}

export const QuickFilters = {
    ALL : "ALL",
    PAID: "Paid",
    UNPAID: "Unpaid"
}

export const SettlementConstants={
    status:[
        {id: '0', name :'All'},
        {id: '1', name :'Settled'},
        {id: '2', name :'Not Settled'}
    ]
}

export const FileFormats = {
    Logo : ['jpeg', 'jpg', 'heic', 'heif', 'png'],
    ManualPayInvoiceFileFormats : ['jpeg', 'jpg', 'heic', 'heif', 'png', 'pdf', 'gif', 'bmp'],
    ManualPayInvoiceAllowedFileTypes : ['application/pdf', 'image/jpeg', 'image/jpg', 'image/heic', 'image/heif', 'image/png', 'image/pdf', 'image/gif', 'image/bmp'],
}
