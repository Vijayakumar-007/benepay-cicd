import { Component } from 'react';
import moment from "moment";
import { screen1 } from "./single-payment.html";
import { screen2 } from "./singlePaymentScreen.html";
import { PaymentService } from '../../../service/api/payment.service';
import FormValidationService from '../../../service/core/validate.service';
import { DateFormat, DefaultDateFormat, FileFormats, manualPay, messages, ServiceAndPreferenceConstatnts } from '../../../config/constants';
import Utils from '../../../service/core/utils';
import { toast } from "react-toastify";
import { urls } from '../../../config/urlConfig';
import { ArrowForwardIosTwoTone } from '@material-ui/icons';
import { Backdrop } from "@mui/material";
import Validator from 'service/core/validator';
import { DashboardService } from 'service/api/dashboard.service';
import { formField } from 'aws-amplify';
import { StorageKeys, StorageService } from 'service/core/storage.service';
import { BenepayUserService } from 'service/api/benepay-user.service';

/**
 * Component for process Single process payment transaction
 * 
 * @author Muthukumaran
 */
class SinglePayment extends Component {

    // form fields declaration
    fieldNames = [
        'payerName',
        'payerEmail',
        'payerMobile',
        'description',
        'collectionRef',
        'transactionId',
        'dueDate',
        'expiryDate',
        'reqCurrency',
        'reqAmount',
        'initialAmount',
        'chargeAmount',
        'chargeReason',
        'mobileCountry',
        'allowPartialPayments',
        'payerMobileDialCode',,
        'debtorWhatsAppNumberDialCode',
        'debtorWhatsAppNumberCountry',
        'debtorWhatsAppNumber',
        'invoiceType',
        'invoiceDate',
        'purposeCode',
        'manualPayInvoiceFile',
    ];

    amountFields = ['reqAmount', 'initialAmount', 'chargeAmount'];

    /**
     * Constructor for Single Payment
     * 
     * @param props 
     */
    constructor(props) {
        super(props);

        // declare state for single payment component
        this.state = {
            formFields: this.prepareField(this.fieldNames, this.rules , false),
            currencyList: [],
            payers: [],
            showForm: true,
            transaction: {},
            mailSent: false,
            paymentLink: null,
            txnResponse: null,
            showExpiry: false,
            loading: true,
            showExpiryMobile: false,
            mobileTitle: "Request Money",
            duplicateTransactionStates: props.history.location.duplicateTransactionStates,
            allowManualPay : false,
            // isRequesterIdDisabled:true,
            // isTotalAmountDisabled:true,
            isChargesDisabled:true,
            isPaymentReviewScreen:false,
            isAutoReqTnxId:true,
            invoiceTypeList: [],
            bankAccountTypes: [],
            merchantTransactionMode: StorageService.get(StorageKeys.merchantTxnMode),
            selectedFile:'',
            manualPaymentReqStatus: false,
            loginMerchantName: StorageService.get(StorageKeys.merchantName),
        }

    }


    // define rules for each fields in single payment transaction form
    rules = {
        payerName: [
            {
                validate: 'required'
            },
            // {
            //     validate: 'name',
            //     message: messages.nameContains
            // },
            // {
            //     validate: 'startsWithAlphabet',
            //     message: messages.startsAlphabet
            // },
            // {
            //     validate: 'symbolnorepeat',
            //     message: messages.symbolnorepeat
            // },
        ],
        description: [
            { validate: 'required' },
            { validate: 'maxLength', maxLength: 30 },
        ],
        // collectionRef: [
        //     { validate: 'required' },
        //     {
        //         validate: 'symbolnorepeat',
        //         message: messages.symbolnorepeat
        //     },
        // ],

        // transactionId: [
        //     { validate: 'required' },
        //     {
        //         validate: 'symbolnorepeat',
        //         message: messages.symbolnorepeat
        //     },
        // ],

        dueDate: [{ validate: 'required' }],
        reqCurrency: [{ validate: 'required' }],
        payerMobile: [{ validate: 'mobile' }],
        debtorWhatsAppNumber: [{ validate: 'mobile' }],
        initialAmount: [
            { validate: 'positive' },
            { validate: 'decimal', decimal: 0 }
        ],
        chargeAmount: [
            { validate: 'positive' },
            { validate: 'decimal', decimal: 0 },
        ],
        reqAmount: [
            // { validate: 'required' },
            { validate: 'positive' },
            { validate: 'nonZero' },
            { validate: 'decimal', decimal: 0 },
            {
                validate: 'sumEqual',
                base: "reqAmount",
                depends: ['chargeAmount', 'initialAmount'],
                message: messages.shouldEqual
            }
        ],
        payerEmail: [
            // { validate: 'required' },
            {
                validate: 'email',
                message: messages.spEmailInvalid,
            },
        ],
        initialAmount: [
            { validate: 'required' },
            { validate: 'positive' },
            { validate: 'nonZero' },
            { validate: 'decimal', decimal: 0 },
        ],
        transactionId: [
            { validate: 'required' },
            {
                validate: 'symbolnorepeat',
                message: messages.symbolnorepeat
            },
            {
                validate: 'validateByAPI',
                url: urls.checkRequestorTransaction + '/',
                method: 'GET',
                param: 'self'
            },
        ],
        invoiceType: [
            { validate: 'required' },
        ],
        purposeCode: [
            { validate: 'required' },
        ],
        manualPayInvoiceFile: [
            { validate: 'required' },
        ],
    };

    setInitialData = async() => {

        let transaction = this.state.duplicateTransactionStates;
        if(!transaction){
            return;
        }

        let payerMobileNumber = Utils.setEmptyWhenNull(transaction.debtorMobileNumber);
        let debtorWhatsAppNumber = Utils.setEmptyWhenNull(transaction.debtorWhatsAppNumber);

        this.state.formFields.payerName.value = Utils.setEmptyWhenNull(transaction.debtorName);
        this.state.formFields.payerEmail.value = Utils.setEmptyWhenNull(transaction.debtorEmailId);
        this.state.formFields.payerMobile.value = !_.isEmpty(payerMobileNumber) ? transaction.debtorMobileNumber.replace(/-/g, " ") : payerMobileNumber;
        this.state.formFields.debtorWhatsAppNumber.value = !_.isEmpty(debtorWhatsAppNumber) ? transaction.debtorWhatsAppNumber.replace(/-/g, " ") : debtorWhatsAppNumber;
        this.state.formFields.description.value = Utils.setEmptyWhenNull(transaction.description);
        this.state.formFields.transactionId.value = Utils.setEmptyWhenNull(transaction.requestorTransactionId);
        this.state.formFields.collectionRef.value = Utils.setEmptyWhenNull(transaction.collectionRef);
        this.state.formFields.reqCurrency.value = Utils.setEmptyWhenNull(transaction.collectionCurrency);
        this.state.formFields.reqAmount.value = Utils.setEmptyWhenNull(transaction.finalDueAmount);
        this.state.formFields.initialAmount.value= transaction.initialAmount != null && transaction.initialAmount != "" && transaction.initialAmount != '0' ? transaction.initialAmount : Utils.setEmptyWhenNull(transaction.finalDueAmount);
        this.state.formFields.chargeAmount.value=Utils.setEmptyWhenNull(transaction.chargeAmount);
        this.state.formFields.chargeReason.value=Utils.setEmptyWhenNull(transaction.chargeReason);
        this.state.formFields.purposeCode.value=Utils.setEmptyWhenNull(transaction.purposeCode);
        this.state.formFields.invoiceType.value=Utils.setEmptyWhenNull(transaction.invoiceType);
        this.state.formFields.invoiceDate.value=Utils.setEmptyWhenNull(transaction.invoiceDate);

        if(!this.state.isAutoReqTnxId){
            this.state.formFields.transactionId.value = Utils.setEmptyWhenNull(transaction.requestorTransactionId);
        } else {
            this.state.formFields.transactionId.value = "";
        }

        this.updateFormFields(this.state.formFields);
        
        // set the decimal point for validation rule 
        await this.updateDecimalInRule(transaction.collectionCurrency, false);
        
        // update the decimal points for amount fields
        this.amountFields.forEach((fieldName) => {
            const field = this.state.formFields[fieldName];

            if (field.value) {
                let amount = this.autoFixDecimal(fieldName, field.value);
                this.updateFormField(fieldName, amount);
            }
        });

        this.toggleReasonToMandate(transaction.chargeAmount, this.state.formFields);
    }

    /**
     * Handler for when component ready 
     */
    componentDidMount = async () => {

        setTimeout(async () => {

            await this.getSupportedCurrency();
            await this.getMerchantDetails();
            await this.getMerchantPreferences();
            await this.setInitialData();
            await this.getInvoiceTypes();
            
        }, 1200);

        document.querySelectorAll("input").forEach(n => {n.setAttribute("autoComplete", "none")});
        this.setState({ loading: false });
    }

    /**
     * Method to refresh the form fields
     */
    resetForm = async () => {
        this.setState({
            formFields: this.prepareField(this.fieldNames,  this.rules , true),
            showForm: true,
            manualPaymentReqStatus: false,
            selectedFile: null,
        })

        // collect the merchant dates auto-fill
        await this.getMerchantDetails();
    }

    /**
     * update the each fields in the form
     * after the updation trigger the field validation
     * 
     * @param {*} formFields 
     */
    updateFormFields = (formFields, validate = true) => {
        this.setState({ formFields: formFields });

        if (validate) {
            this.validateForm();
        }
    }

    /**
     * Method to update the particular field in the form
     * after the updation trigger the field validation
     * 
     * @param {*} fieldName 
     * @param {*} value 
     * @param {*} validate 
     */
    updateFormField = async (fieldName, value, validate = true, loading = false) => {
        let fields = this.state.formFields;

        if(loading){
            this.setState({loading:true});
        }

        if (fields.hasOwnProperty(fieldName) != -1) {
            fields[fieldName].value = value;

            await this.setState({ formFields: fields });
        }

        if (validate) {
            await this.validateField(fieldName);
        }

        if(loading){
            this.setState({loading:false});
        }
    }

    /**
     * Method to assign basic field data 
     * 
     * @param fieldNames 
     * @param rules 
     * @returns 
     */
    prepareField = (fieldNames, rules, fromState = false) => {
        const fields = {};

        fieldNames.forEach(fieldName => {
            let value = '';

            if (fieldName == "mobileCountry") {
                value = "in";
            }  else if (fieldName == "debtorWhatsAppNumberCountry") {
                value = "in";
            } else if (fieldName == "dueDate") {
                value = null;
            } else if (fieldName == "allowPartialPayments") {
                value = false;
            } else if (fieldName == "invoiceDate") {
                value = null;
            } else if (fieldName == "manualPayInvoiceFile") {
                value = null;
            }

            
            let fieldRules = rules[fieldName] || [];

            // Modify rules based on dynamic conditions
            if (fromState){
                if (fieldName == "reqAmount" &&  this.state.isChargesDisabled) {
                    fieldRules = fieldRules.filter(rule => rule.validate !== 'required');
                }

                if (fieldName == "transactionId" &&  this.state.isAutoReqTnxId) {
                fieldRules = fieldRules.filter(rule => rule.validate !== 'required' && rule.validate !== 'validateByAPI')  ;
                }

                if (fieldName == "invoiceType" &&  this.state.merchantTransactionMode != manualPay.transactionModeBoth) {
                    fieldRules = fieldRules.filter(rule => rule.validate !== 'required');
                }
    
                if (fieldName == "purposeCode" &&  this.state.merchantTransactionMode != manualPay.transactionModeBoth) {
                    fieldRules = fieldRules.filter(rule => rule.validate !== 'required');
                }
    
                if (fieldName == "manualPayInvoiceFile" &&  this.state.merchantTransactionMode != manualPay.transactionModeBoth) {
                    fieldRules = fieldRules.filter(rule => rule.validate !== 'required');
                }
            }

            fields[fieldName] = {
                rules: fieldRules,
                value: value,
                errors: []
            };

          
        });

        return fields;
    }

    /**
     * Add the decimal rule based on the currency update
     * 
     * @param {*} currency 
     */
    updateDecimalInRule = (currency, validate = true) => {
        try {
            let code = this.state.currencyList.filter((v) => v.code == currency);

            if (code.length > 0) {
                let decimal = code[0].decimal;

                // set the decimal value to test
                this.amountFields.forEach((fieldName) => {
                    const field = this.state.formFields[fieldName];

                    field.rules.forEach((rule, index) => {
                        if (rule.validate == "decimal") {
                            this.state.formFields[fieldName].rules[index].decimal = decimal;
                        }
                    })
                });

                this.setState({ formFields: this.state.formFields });

                // validate the decimal
                if (validate) {
                    this.amountFields.forEach((fieldName) => {
                        const field = this.state.formFields[fieldName];

                        if (field.value) {
                            this.validateField(fieldName);
                        }
                    });
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Set the decimal points for all amount fields
     * 
     * @param {*} fieldName 
     * @param {*} amount 
     * @returns 
     */
    autoFixDecimal = (fieldName, amount) => {
        try {
            let formFields = this.state.formFields;

            let rule = formFields[fieldName].rules.filter((rule) => rule.validate == "decimal");

            // set the amount is zero when amount is empty
            if( !Validator.isNotEmpty(amount) ){
                amount = 0;
            }

            // apply the decimal value for the amount
            if ( Validator.isNotEmpty(amount) && rule.length > 0) {
                amount = parseFloat(amount).toFixed(rule[0].decimal);
            }

            return amount;
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Set the required attribure based on the charge amount field 
     * 
     * @param changeAmt
     * @param formFields
     * @returns 
     */
    toggleReasonToMandate(changeAmt, formFields) {
        if (changeAmt && changeAmt > 0) {
            formFields.chargeReason.rules = [{ validate: 'required' }]
        } else {
            formFields.chargeReason.rules = []
        }

        return formFields;
    }

    /**
     * Validate the field based on designed rules
     * 
     * @param {*} fieldName 
     */
    validateField = async (fieldName) => {
        let field = this.state.formFields[fieldName];

        const { errors, valid } = await FormValidationService.validate(field.rules, field.value, this.state.formFields);

        this.state.formFields[fieldName].errors = errors;

        this.setState({ formFields: this.state.formFields });
    }

    /**
     * Validate the form fields
     * 
     * @returns 
     */
    validateForm = async (submit=false) => {
        let formValid = true;
        
        if( submit ){
            this.setState({loading: true});
        }

        
        for (let fieldName of this.fieldNames) {
            const field = this.state.formFields[fieldName];
           
            if(field != undefined){
                const { errors, valid } = await FormValidationService.validate(field.rules, field.value, this.state.formFields);

                this.state.formFields[fieldName].errors = errors;

                if (!valid) {
                    formValid = false;
                }
            }

        };

        this.setState({ formFields: this.state.formFields });

        if( submit ){
            this.setState({loading: false});
        }

        return formValid;
    }

    /**
    * Validate the form fields
    * 
    * @returns 
    */
    validateFormMobile = async () => {

        let formValid = true;

        for (let fieldName of this.fieldNames) {
            
            if (fieldName === 'collectionRef' || fieldName === 'transactionId') {
                continue;
            }
            const field = this.state.formFields[fieldName];

            const { errors, valid } = await FormValidationService.validate(field.rules, field.value, this.state.formFields);

            this.state.formFields[fieldName].errors = errors;

            if (!valid) {
                formValid = false;
            }
        };

        this.setState({ formFields: this.state.formFields});

        return formValid;
    }

    /**
     * Method to fetch the payer transaction
     * 
     * @returns 
     */
    getPayerTransaction = async (payer) => {
        try {
            this.setState({loading: true});
            const response = await PaymentService.fetchPayerRecentTransaction(payer.name, (payer.email)?payer.email:"");
            this.setState({loading: false});
            if (response && response.data && response.data.payerRecentTransaction.length > 0) {
                const transaction = response.data.payerRecentTransaction[0];

                // convertion for react input component does not accept the null in the value 
                this.state.formFields.payerName.value = Utils.setEmptyWhenNull(transaction.debtorName);
                this.state.formFields.payerEmail.value = Utils.setEmptyWhenNull(transaction.debtorEmailId);
                this.state.formFields.payerMobile.value = Utils.setEmptyWhenNull(transaction.debtorMobileNumber !== null && transaction.debtorMobileNumber != "" ? transaction.debtorMobileNumber.replace(/-/g, " ") : '');
                this.state.formFields.debtorWhatsAppNumber.value = Utils.setEmptyWhenNull(transaction.debtorWhatsAppNumber !== null && transaction.debtorWhatsAppNumber != "" ? transaction.debtorWhatsAppNumber.replace(/-/g, " ") : '');
                this.state.formFields.description.value = Utils.setEmptyWhenNull(transaction.reasonForCollection);
                this.state.formFields.collectionRef.value = Utils.setEmptyWhenNull(transaction.collectionReferenceNumber);
                this.state.formFields.reqAmount.value = Utils.setEmptyWhenNull(transaction.finalDueAmount);
                this.state.formFields.initialAmount.value = transaction.initialDueAmount != null && transaction.initialDueAmount != "" && transaction.initialDueAmount != '0' ? Utils.setEmptyWhenNull(transaction.initialDueAmount) : Utils.setEmptyWhenNull(transaction.finalDueAmount);
                this.state.formFields.chargeAmount.value=Utils.setEmptyWhenNull(transaction.charges);
                this.state.formFields.chargeReason.value=Utils.setEmptyWhenNull(transaction.reasonForCharges);
                this.state.formFields.invoiceDate.value = Utils.setNullIfEmpty(transaction.invoiceDate);
                this.state.formFields.invoiceType.value = Utils.setNullIfEmpty(transaction.invoiceType);
                this.state.formFields.purposeCode.value = Utils.setNullIfEmpty(transaction.purposeCode);

                if(this.state.currencyList.some(obj => obj.code === transaction.collectionCurrency)){
                    this.state.formFields.reqCurrency.value = Utils.setEmptyWhenNull(transaction.collectionCurrency);
                }
                //console.log("IN HERE", transaction.collectionCurrency, this.state.formFields.reqCurrency.value, this.state.currencyList.some(obj => obj.code === transaction.collectionCurrency));
                this.updateFormFields(this.state.formFields);

                // set the decimal point for validation rule 
                await this.updateDecimalInRule(transaction.collectionCurrency, false);

                // update the decimal points for amount fields
                this.amountFields.forEach((fieldName) => {
                    const field = this.state.formFields[fieldName];

                    // if (field.value) {
                    let amount = this.autoFixDecimal(fieldName, field.value);

                    this.updateFormField(fieldName, amount);
                    // }
                });

                if(!this.state.isAutoReqTnxId){
                    this.state.formFields.transactionId.value = Utils.setEmptyWhenNull(transaction.requestorTransactionId);
                } else {
                    this.state.formFields.transactionId.value = "";
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Prepare the submission form values to request object
     * 
     * @param {*} transaction 
     * @param {*} formFields 
     * @returns 
     */
    setSubmissionValues = (transaction, formFields) => {
        transaction.debtorName = formFields.payerName.value;
        transaction.debtorEmailId = formFields.payerEmail.value;
        // before submit remove the extra characters from the mobile number
        transaction.debtorMobileNumber = formFields.payerMobile.value.replace(/[()]/g, "").replace(/-/g, "").replace(" ", "-").replace(/\s/g, "");
        transaction.debtorWhatsAppNumber = formFields.debtorWhatsAppNumber.value.replace(/[()]/g, "").replace(/-/g, "").replace(" ", "-").replace(/\s/g, "");
        transaction.reasonForCollection = formFields.description.value;
        transaction.requestorTransactionId = this.state.isAutoReqTnxId ? '' : formFields.transactionId.value;
        transaction.collectionReferenceNo = formFields.collectionRef.value;
        transaction.finalDueDate = formFields.dueDate.value;
        transaction.paymentExpiryDate = formFields.expiryDate.value;
        transaction.collectionCurrency = formFields.reqCurrency.value;
        transaction.finalDueAmount =  this.state.isChargesDisabled ? formFields.initialAmount.value : formFields.reqAmount.value;
        transaction.initialDueAmount = Utils.setNullWhenEmpty(formFields.initialAmount.value);
        transaction.charges = this.state.isChargesDisabled ?'' :Utils.setNullWhenEmpty(formFields.chargeAmount.value);
        transaction.reasonForCharges = Utils.setNullWhenEmpty(formFields.chargeReason.value);
        transaction.allowPartialPayments = formFields.allowPartialPayments.value;

        if(this.state.merchantTransactionMode == manualPay.transactionModeBoth){
            transaction.manualPayInvoiceFile = formFields.manualPayInvoiceFile.value
            transaction.manualPayInvoiceFileName = this.state.selectedFile.name;
            transaction.manualPayInvoiceDate = formFields.invoiceDate.value;
            transaction.manualPayInvoiceType = formFields.invoiceType.value;
            transaction.manualPayInvoicePurposeCode = formFields.purposeCode.value;
        }else{
            transaction.manualPayInvoiceFile = null;
            transaction.manualPayInvoiceFileName = null;
            transaction.manualPayInvoiceDate = null;
            transaction.manualPayInvoiceType = null;
            transaction.manualPayInvoicePurposeCode = null;
        }

        return transaction;
    }

    /**
     * Handle new form request
     */
    handleMakeAnother = async () => {
        this.setState({
            formFields: this.prepareField(this.fieldNames, this.rules, true),
            showForm: true
        });
        // collect the merchant dates auto-fill
        await this.getMerchantDetails();
    }

    /**
     * Method to fetch the supported currency list
     * 
     * @returns 
     */
    getSupportedCurrency = async () => {
        this.setState({loading: true});
        const response = await PaymentService.getAllowdedCurrencyDecimals();
        this.setState({loading: false});
        if (response && response.data && response.data.currencyList.length > 0) {
            this.setState({ currencyList: response.data.currencyList })
        }
    }

    /**
     * Method to fetch the payer transaction
     */
    getPayers = async (name) => {
        this.setState({loading: true});
        
        const response = await PaymentService.fetchPayers(btoa(name));

        this.setState({loading: false});

        if (response && response.data) {
            const payers = response.data.payers.map((payer) => {
                return { "name": payer.debtorName, "email": payer.debtorEmailId }
            });

            this.setState({ payers: payers });
        }
    }

    /**
     * Method to fetch merchant details and  due and expiry dates
     */
    getMerchantDetails = async (name) => {

        this.setState({loading: true});

        const response = await PaymentService.getMerchantDetails(name);

        this.setState({loading: false});

        if (response && response.data) {

            if (response.data.dueDate && response.data.expiryDate) {
                let formFields = this.state.formFields;

                formFields.dueDate.value = response.data.dueDate;
                formFields.expiryDate.value = response.data.expiryDate;
                formFields.reqCurrency.value = response.data.settlementCcy;

                this.setState({ allowPartialPaymentValue: response.data.allowPartialPayments, formFields: formFields });
                
                setTimeout(() => {
                    // set the decimal point for validation rule 
                    this.updateDecimalInRule(response.data.settlementCcy, false);    
                }, 1000);
            }
        }
    }

    /**
     * Handle the payment review screen
     */
    handlePaymentReview = async() =>{
        let formValid = await this.validateForm(true);

        if (formValid) {
            this.setState({ showExpiry: false, isPaymentReviewScreen: true });
        } else {
            toast.error("Please fill the mandatory fields!")
        }
    }

    /**
     * Method handle the review screen submit button
     */
    createPaymentReq = () =>{        
        this.submitForm();
    }

    /**
     * Method to submit the form values
     */
    submitForm = async () => {
        this.setState({loading: true});
        try {
            const formFields = this.state.formFields;

            let transaction = {};
            let mailDone = false;
            let paymentLink = null;
            let message = null;

            // prepare the transaction request object
            transaction = this.setSubmissionValues(transaction, formFields);

            const response = await PaymentService.submitPayment(transaction);

            var transactionData = transaction;

            if (response && response.data) {
                if (response.data.transaction) {
                    transactionData = response.data.transaction;
                    transactionData.finalDueAmount = transaction.finalDueAmount;
                }

                if(response.data.merchantVirtualAccounts){
                    let mvAccounts = response.data.merchantVirtualAccounts;
                    transactionData.merchantVirtualAccounts = mvAccounts;
                    transactionData.bankName = mvAccounts.length > 0 ? mvAccounts[0].bankName : '';
                    transactionData.bankAddress = mvAccounts.length > 0 ? mvAccounts[0].bankAddress : '';
                }

                if (response.data.mailSent) {
                    mailDone = response.data.mailSent;
                }

                if (response.data.message) {
                    message = response.data.message;
                }

                if (response.data.paymentLink) {
                    paymentLink = response.data.paymentLink;
                }
            }

            if(this.state.merchantTransactionMode == manualPay.transactionModeBoth || this.state.merchantTransactionMode == manualPay.transactionModeManual){
                this.setState({
                    transaction: transactionData,
                    manualPaymentReqStatus: true,
                    mailSent: mailDone,
                    paymentLink: paymentLink,
                    txnResponse: message,
                    mobileTitle: "Request Sent",
                    isPaymentReviewScreen: false,
                });
            }
            else{
                this.setState({
                    transaction: transactionData,
                    showForm: false,
                    mailSent: mailDone,
                    paymentLink: paymentLink,
                    txnResponse: message,
                    mobileTitle: "Request Sent",
                    isPaymentReviewScreen: false,
                });
            }
            
        } catch (error) {
            console.error(error);
        }
        this.setState({loading: false});
    }

    backToPaymentForm = () =>{
        this.setState({isPaymentReviewScreen: false});
    }

    /**
     * To handle event for date fields when change
     * @param {*} event
     */
    handleDueDate = async (event, fieldName) => {
        
        if(fieldName == "dueDate"){  
            let value = null;

            if (event != null) {
                value = moment(event.toDate()).format(DefaultDateFormat.dateFormatymd);
            }

            this.updateFormField("dueDate", value);

            await this.updateExpiryDate(value);
        }

        if(fieldName == "invoiceDate"){  
            let value = null;

            if (event != null) {
                value = moment(event.toDate()).format(DefaultDateFormat.dateFormatymd);
            }

            this.updateFormField("invoiceDate", value);

            await this.updateExpiryDate(value);
        }
    }

    /**
     * Update the expiry date based on the given due date
     */
    updateExpiryDate = async (dueDate) => {
        this.setState({loading:true});
        
        const response = await PaymentService.fetchExpiryDate(btoa(dueDate));
        
        this.setState({loading:false});

        if (response && response.data) {
            if (response.data.expiryDate) {
                let formFields = this.state.formFields;

                formFields.expiryDate.value = response.data.expiryDate;

                this.setState({ formFields: formFields });
            }
        }
    }

    /**
     * To handle event for requested amount field when change
     * @param {*} event 
     */
    handleRequestedAmount = (event) => {
        let amount = event.target.value.replace(/[^0-9.]/g, '');
        
        this.updateFormField("reqAmount", amount);
    }

    /**
     * To handle event for  initial amount field when change
     * @param {*} event
     */
    handleInitialAmount = (event) => {
        let amount = event.target.value.replace(/[^0-9.]/g, '');
        
        this.updateFormField("initialAmount", amount);
    }

    /**
     * To handle event for change amount field when change
     * @param {*} event
     */
    handleChangeAmount = (event) => {
        let amount = event.target.value.replace(/[^0-9.]/g, '');

        // update reason field required or not
        let fields = this.toggleReasonToMandate(amount, this.state.formFields);

        this.setState({ formFields: fields });

        this.updateFormField("chargeAmount", amount);
    }

    /**
     * @author Bharath
     * HandleEvent to generate the invoice
     * @param {*} params 
     */
    handleGenerateInvoice = async (params) => {    
        let response = await PaymentService.generateInvoice(params);
        if (response.pdfContent && response.fileName) {
            Utils.downloadBase64File(response.pdfContent, response.fileName)
        } else {
            toast.error(response.message)
        }
        
    }

    /**
     * Calculate the requested amount 
     * Sum the values of inital amount and charge amount 
     */
    generateRequestedAmout = () => {
        var initialAmt = this.state.formFields.initialAmount.value;
        var chargeAmt = this.state.formFields.chargeAmount.value;
       
        // set the value zero for the empty values
        initialAmt = !Validator.isNotEmpty(initialAmt) ? 0 : initialAmt;
        chargeAmt = !Validator.isNotEmpty(chargeAmt) ? 0 : chargeAmt;

        // sum the amounts including with decimal
        var total =  parseFloat(initialAmt) + parseFloat(chargeAmt);

        // update the requested amount with calulated value
        this.updateFormField('reqAmount', this.autoFixDecimal('reqAmount',total));
    }

    /**
     * Method to get the merchant preferences
     */
    getMerchantPreferences = async () => {
        let result = await DashboardService.getMerchantPreferences();

        if(result){
            this.setState({
                allowManualPay : result.allowManualPay,
                // isRequesterIdDisabled : result.disableReqTransactionId ,
                isChargesDisabled: result.disableChargesAndReason,
                // isTotalAmountDisabled : result.disabelTotalAmount ,
                isAutoReqTnxId:result.autoReqTransactionId == ServiceAndPreferenceConstatnts.PREFERENCE_ENABLED ? true : false,
            })
          
            let newFormFields = this.state.formFields;

            if(result.autoReqTransactionId == ServiceAndPreferenceConstatnts.PREFERENCE_ENABLED){
                newFormFields.transactionId.errors = [];
                newFormFields.transactionId.rules = newFormFields.transactionId.rules.filter(rule =>  rule.validate !== "required" && rule.validate != "validateByAPI" );
            }
            
            if(result.isChargesDisabled){
                newFormFields.reqAmount.errors = [];
                newFormFields.reqAmount.rules = newFormFields.reqAmount.rules.filter(rule => 
                    rule.validate !== "required" && rule.validate !== "nonZero"
                );
            }

            if(result.transactionMode == manualPay.transactionModeDigital){
                newFormFields.invoiceType.errors = [];
                newFormFields.purposeCode.errors = [];
                newFormFields.manualPayInvoiceFile.errors = [];

                newFormFields.invoiceType.rules = newFormFields.invoiceType.rules.filter(rule => rule.validate !== "required");
                newFormFields.purposeCode.rules = newFormFields.purposeCode.rules.filter(rule => rule.validate !== "required");
                newFormFields.manualPayInvoiceFile.rules = newFormFields.manualPayInvoiceFile.rules.filter(rule => rule.validate !== "required");
            }

            this.setState({ formFields : newFormFields })

        }
    }

    /**
     * Handle the manual pay invoice file
     * 
     * @param {*} event 
     */
    handleManualPayInvoiceFile = async (event) => {
        let fields = this.state.formFields;

        // Update the state with the selected file
        const selectedFile = event.target.files[0];

        // Validate the file type using the Validator class
        if (Validator.validateFileFormats(FileFormats.ManualPayInvoiceAllowedFileTypes, selectedFile)) {
            this.setState({ selectedFile });
            let enfile = await Utils.getBase64FromFile(selectedFile);
            enfile = enfile.split(',')[1];

            if(selectedFile.name == "application/pdf"){
                fields.manualPayInvoiceFile.value = enfile;
            }else{
                fields.manualPayInvoiceFile.value = enfile;
            }

        } else {
            // Clear the selected file and show an error toast with allowed file types
            this.setState({ selectedFile: null, manualPayInvoiceFile: null });
            const allowedTypesString = Validator.allowedFileFormats(FileFormats.ManualPayInvoiceFileFormats).join(', ');
            toast.error(`${messages.invalidLogoType}(${allowedTypesString}).`);
        }

        await this.setState({ formFields: fields });
    }

    /**
     * Fetch invoice types from lookup details
     */
    getInvoiceTypes = async () => {
        this.setState({loading:true});
        const result = await DashboardService.getLookupDetails("invoiceType");      
        const bankAccountTypes = await DashboardService.getLookupDetails("bankAccountTypes");      

        if (result && result.lookupDetails && result.lookupDetails.length > 0) {
            this.setState({ invoiceTypeList: result.lookupDetails, loading:false })
        }else{
            this.setState({loading:false});
        }
        
        if (bankAccountTypes && bankAccountTypes.lookupDetails && bankAccountTypes.lookupDetails.length > 0) {
            this.setState({ bankAccountTypes: bankAccountTypes.lookupDetails, loading:false })
        }else{
            this.setState({loading:false});
        }
    }
    
    render = () => {
        if(StorageService.get(StorageKeys.autoReqTrans) == 1 || this.state.merchantTransactionMode == manualPay.transactionModeManual || this.state.merchantTransactionMode == manualPay.transactionModeBoth){
            return screen2.apply(this);
        }
         
        return screen1.apply(this);
    }
}

export default SinglePayment;
