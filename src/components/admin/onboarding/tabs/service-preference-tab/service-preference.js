import React, { Component } from 'react';
import { html } from "./service-preference.html";
import { DashboardService } from '../../../../../service/api/dashboard.service';
import FormValidationService from '../../../../../service/core/validate.service';
import moment from 'moment';
import Utils from '../../../../../service/core/utils';
import { toast } from 'react-toastify';
import { Auth, Logger } from 'aws-amplify';
import { StorageService } from 'service/core/storage.service';
import { StorageKeys } from 'service/core/storage.service';

//Constants
import { OnboardConstants, messages, manualPay, LookupKeys,ServiceAndPreferenceConstatnts } from '../../../../../config/constants';

class ServicePreference extends Component {
    fieldNames = [
        'paymentDefaultDueDate',
        'expiryDate',
        'emailId',
        'mobileNoForSMS',
        'SMSMobileNoCountryCode',
        'mobileNoForWhatsApp',
        'WhatAppMobileNoCountryCode',
        'reminderFrequency',
        'defaultCurrency',
        'returnUrl',
        'merchantCallbackUrl',
        'allowPartialPayments',
        'skipBenepayPayerPage',
        'manualPayment',
        'digitalPayment',
        'merchantTimeZone',
        'autoReqTnxId',
        // 'disableReqId',
        'disableChargeOrReason',
        // 'disableTotalAmount',
        'shortTnxId'
    ]

    rules = {
        expiryDate: [{ validate: 'required' }],
        paymentDefaultDueDate: [{ validate: 'required' }],
        reminderFrequency: [{ validate: 'required' }],
        defaultCurrency: [{ validate: 'required' }],
        merchantTimeZone: [{ validate: 'required' }],
        mobileNoForSMS: [{ validate: 'mobile' }],
        mobileNoForWhatsApp: [{ validate: 'mobile' }],
        emailId: [{ validate: 'email' }],
        returnUrl: [
            { 
                validate: 'required',
                type: 'depend',
                cb: () => {
                    return this.state.isRealtimeApiCHecked === true;
                } 
            }
        ],

        digitalPayment: [
            {validate:'oneIsRequired', depends: ['manualPayment']},
        ],
        manualPayment: [
            {validate:'oneIsRequired', depends: ['digitalPayment']},
        ]
    }

    constructor(props) {
        super(props);

        this.state = {
            value: 0,
            loading: false,
            invoicesSubscription: false,
            keyCurrencies: false,
            otherCurrencies: false,
            autoGenerateUnpaidInvoice: false,
            autoGeneratePaidInvoice: false,
            selectedKeyCurrency: [],
            selectedOtherCurrency: [],
            keyCurrenciesList: [],
            withoutKeyCurrenciesList: [],
            allCurrency: [],
            formFields: this.prepareField(this.fieldNames, this.rules),
            save: '',
            merchantId: props.merchantId,
            getPreState: '',
            fieldsOnchange: false,
            deleteSerAndPre: '',
            onlinePaymentSubcription: false,           
            transactionCreationMode:[],     
            selectedRequestInitiationModes: [
                { lookupCode: OnboardConstants.ViaApi, checked: false },
                { lookupCode: OnboardConstants.ViaFileUpload, checked: false },
                { lookupCode: OnboardConstants.ViaScreen, checked: false },
                { lookupCode: OnboardConstants.ViaUPIQRCode, checked: false },
                { lookupCode: OnboardConstants.ViaGenericQRCode, checked: false },
                { lookupCode: OnboardConstants.ViaDRM, checked: false },
                { lookupCode: OnboardConstants.ViaCustomPay, checked: false }
            ],
            selectedRefundModes: [
                { lookupCode: OnboardConstants.RefundViaFileUpload, checked: false },
                { lookupCode: OnboardConstants.RefundViaScreen, checked: false },
               
            ],
            selectedCancellationModes: [
                { lookupCode: OnboardConstants.ViaApi, checked: false },
                { lookupCode: OnboardConstants.CancellationViaScreen, checked: false },
        
            ],
            selectedGenerateQRCode: [
                { lookupCode: OnboardConstants.ViaUPIQRCode, checked: false },
                { lookupCode: OnboardConstants.ViaGenericQRCode, checked: false }
        
            ],
            merchantEncKey: null,
            showEncKey:false,
            isOnlinePaymentEnabled: false,
            paymentProviders:[],
            openTxnModeValidationPopup:false,
            openTxnModeDisablePopup:'', txnMode:'',
            AlertMsg:'', flagForShowAlertMsg:'',
            loaderForTxnModeInactiveProcess:false,
            fetchSPloading:false,
            merchantActiveStatus:props.merchantActiveStatus,
            isApiChecked :false,
            isRealtimeApiCHecked:false,
            merchantTimeZone:[],
            seamlessPayment : false
        }
    }

    componentDidMount = async () => {
        await Auth.currentSession().then(res => {
            let jwt = res["idToken"]["jwtToken"];
            StorageService.set(StorageKeys.clientJwt, jwt);
        });
        
        this.getProviders(this.state.merchantId);
        this.getSupportedCurrency();
        this.getTransactionCreationMode();
        await this.fetchTimeZones()
    }

    componentDidUpdate = (prevState,prevProps) => {
        this.handleStage();

    }

    //Please don't comment or remove any lines in the saveSP, getSPPreValue and delete statements
    //!Be careful if you make any change in the componentDidUpdate
    handleStage = async () => {
        //Call the Save method
        if (this.props.saveSP) {
            //Give a parameter of tab index
            this.props.saveSPCallback(OnboardConstants.spTabVal);
            await this.saveServicePreference();
        }

        //Call the fetch method
        if (this.props.getSPPreValue) {
            //Give a parameter of tab index
            this.props.getSPPreValueCallback(OnboardConstants.spTabVal);
            this.getSupportedCurrency(() => {
                this.fetchSerAndPre();
            });
        }

        //Call delete method 
        if (this.props.delete) {
            //Give a parameter of tab index
            this.props.spDeleteCallback(OnboardConstants.spTabVal);
            this.setState({ openBDdeletepopup: true });
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

    /**
     * Method handle the all check box click events
     * And also handle the currency checkbox click events
     * @param {*} e 
     * @param {*} currency 
     */
    handleCheckBoxEvent = async (e, currency, mode) => {
        
        if(mode != null && mode.lookupCode == "API" && e.target.checked === false){
            this.state.formFields.skipBenepayPayerPage.value = false;
        }
        
        const { name, checked } = e.target;
        const newState = { ...this.state };

        newState[name] = checked;

        if (!newState['fieldsOnchange']) {
            newState['fieldsOnchange'] = true;
        }

        if (name === 'invoicesSubscription' && !checked) {
            newState.autoGenerateUnpaidInvoice = false;
            newState.autoGeneratePaidInvoice = false;
        }

        //Handle particular currency click event
        if (currency) {
            currency.checked = checked;

            let currencyList;
            if (currency.currencyType === "keyCurrency") {
                currencyList = newState.selectedKeyCurrency;
            } else {
                currencyList = newState.selectedOtherCurrency;
            }

            //If the currency is already exists set checked false otherwise push
            if (currencyList || currencyList.length === 0) {
                const index = currencyList.findIndex(item => item.name == currency.name);
                if (index !== -1) {
                    if (!checked) {
                        currencyList[index].checked = false;
                    }
                } else {
                    if (checked) {
                        currencyList.push(currency);
                    }
                }
            }
        }

        //Handle select all currency
        if (name === "keyCurrencies" || name === "otherCurrencies") {
            const listToUpdate = name === "keyCurrencies" ? newState.keyCurrenciesList : newState.withoutKeyCurrenciesList;

            listToUpdate.forEach(item => item.checked = checked);

            if (name === "keyCurrencies") {
                newState.selectedKeyCurrency = listToUpdate;
            } else if (name === "otherCurrencies") {
                newState.selectedOtherCurrency = listToUpdate;
                
            }

        } else {
            if (newState.keyCurrenciesList.every(item => item.checked)) {
                newState.keyCurrencies = true;
            } else if (newState.keyCurrenciesList.some(item => !item.checked)) {
                newState.keyCurrencies = false;
            }

            if (newState.withoutKeyCurrenciesList.every(item => item.checked)) {
                newState.otherCurrencies = true;
            } else if (newState.withoutKeyCurrenciesList.some(item => !item.checked)) {
                newState.otherCurrencies = false;
            }
        }
        switch (name) {
            case 'paymentRequestInitiation':
                this.updateModeArray(newState, 'selectedRequestInitiationModes', mode, checked);
                break;
            case 'refunds':
                this.updateModeArray(newState, 'selectedRefundModes', mode, checked);
                break;
            case 'cancellations':
                this.updateModeArray(newState, 'selectedCancellationModes', mode, checked);
                break;
            case 'generateQRCode':
                this.updateModeArray(newState, 'selectedGenerateQRCode', mode, checked);
                this.appendQRCodeModesToPaymentRequest(newState, mode, checked); // Append to paymentRequestInitiation
                break;    
            default:
                break;
        }
        
        this.setState(newState, () => this.updateIsApiChecked());    
             
    }

    updateModeArray = (newState, arrayName, mode, checked) => {
        if(mode && mode != null){
            const updatedModes = [...(newState[arrayName] || [])];
            const modeIndex = updatedModes.findIndex(item => item.lookupCode === mode.lookupCode);

            if (modeIndex !== -1) {
                if (!checked) {
                    updatedModes.splice(modeIndex, 1);
                    // console.log(`Removed ${mode.lookupCode} from ${arrayName}`);
                } else {
                    updatedModes[modeIndex].checked = checked;
                    // console.log(`Updated ${mode.lookupCode} in ${arrayName}`);
                }
            } else if (checked) {
                updatedModes.push({ ...mode, checked });
                // console.log(`Added ${mode.lookupCode} to ${arrayName}`);
            }

            newState[arrayName] = updatedModes;
        }
    };

    appendQRCodeModesToPaymentRequest = (newState, mode, checked) => {
        if (mode && mode !== null) {
            const updatedRequestInitiationModes = [...(newState['selectedRequestInitiationModes'] || [])];
            const modeIndex = updatedRequestInitiationModes.findIndex(item => item.lookupCode === mode.lookupCode);
    
            if (modeIndex !== -1) {
                updatedRequestInitiationModes[modeIndex].checked = checked;
                // console.log(`Updated ${mode.lookupCode} in selectedRequestInitiationModes`);
            } else {
                updatedRequestInitiationModes.push({ ...mode, checked });
                // console.log(`Added ${mode.lookupCode} to selectedRequestInitiationModes`);
            }
    
            // Ensure unchecked modes are still represented as 0
            updatedRequestInitiationModes.forEach(item => {
                if (!item.checked) {
                    item.checked = 0;  // Represent unchecked as 0
                }
            });
    
            newState['selectedRequestInitiationModes'] = updatedRequestInitiationModes;
        }
    };
    
    /**
     * Handle mobile number update while input tabout
     * 
     * @param {*} fieldName 
     * @param {*} value 
     * @param {*} cCode
     */
    handleMobileTabOut = ( fieldName, value, cCode ) => {
        if (  cCode != "" && cCode != value.replace("+","") ) {
            this.updateFormField( fieldName, value, false);
        } else {
            this.updateFormField( fieldName, "", false);
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
    updateFormField = (fieldName, value, validate = true) => {

        if (!this.state.fieldsOnchange) {
            this.state.fieldsOnchange = true;
        }

        let fields = this.state.formFields;

        if (fields.hasOwnProperty(fieldName) != -1) {
            fields[fieldName].value = value;

            this.setState({ formFields: fields });
        }

        if (validate) {
            this.validateField(fieldName);
        }
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
    validateForm = async () => {
        let formValid = true;

        for (let fieldName of this.fieldNames) {
            const field = this.state.formFields[fieldName];

            const { errors, valid } = await FormValidationService.validate(field.rules, field.value, this.state.formFields);

            this.state.formFields[fieldName].errors = errors;

            if (!valid) {
                formValid = false;
            }
        };

        await this.setState({ formFields: this.state.formFields });

        return formValid;
    }

    /**
     * Method to assign basic field data 
     * 
     * @param fieldNames 
     * @param rules 
     * @returns 
     */
    prepareField = (fieldNames, rules) => {
        const fields = {};

        fieldNames.forEach(fieldName => {
            let value = '';

            if (fieldName == "merchantType") {
                value = null;
            }
            if (fieldName == "allowPartialPayments") {
                value =false;
            }

            if (fieldName == "digitalPayment") {
                value = false;
            }

            if (fieldName == "manualPayment") {
                value = false;
            }

            fields[fieldName] = {
                rules: rules[fieldName] || [],
                value: value,
                errors: []
            };
        });

        return fields;
    }

    /**
     * To handle event for the due date field when change
     * @param {*} event
     */
    handleDateFields = async (event, fieldName) => {
        let value = null;
        // const formField = this.state.formFields;

        if (event != null) {
            value = moment(event.toDate()).format(DefaultDateFormat.dateFormat);
        }

        this.updateFormField(fieldName, value);
    }

    //Get currency name
    getCurrencyName = (currencyArray) => {
        // Initialize an empty array to store names
        const checkedCurrencyNames = [];

        // Loop through the array and store names of checked items
        for (const item of currencyArray) {
            if (item.checked) {
                checkedCurrencyNames.push(item.name);
            }
        }

        return checkedCurrencyNames;
    }

   
   

    CheckBoxHandleForRequests = (preferences) => {
        let newState = {};

        // Check if preferences object is not null or undefined
        if (preferences) {
            // Update request initiation modes
            if (preferences.paymentRequestViaApi || preferences.paymentRequestViaFile || preferences.paymentRequestViaScreen || preferences.paymentRequestViaRealtimeApi) {
                let newRequestInitiationModes = [...this.state.selectedRequestInitiationModes];
                const updatedRequestInitiationModes = [
                    { lookupCode: OnboardConstants.ViaApi, checked: preferences.paymentRequestViaApi === ServiceAndPreferenceConstatnts.PREFERENCE_ENABLED },
                    { lookupCode: OnboardConstants.ViaFileUpload, checked: preferences.paymentRequestViaFile === ServiceAndPreferenceConstatnts.PREFERENCE_ENABLED },
                    { lookupCode: OnboardConstants.ViaScreen, checked: preferences.paymentRequestViaScreen === ServiceAndPreferenceConstatnts.PREFERENCE_ENABLED },
                    { lookupCode: OnboardConstants.ViaDRM, checked: preferences.paymentRequestViaRealtimeApi === ServiceAndPreferenceConstatnts.PREFERENCE_ENABLED },
                    { lookupCode: OnboardConstants.ViaCustomPay, checked: preferences.paymentRequestViaQuickPay === ServiceAndPreferenceConstatnts.PREFERENCE_ENABLED },
                    { lookupCode: OnboardConstants.ViaUPIQRCode, checked: preferences.paymentRequestViaUPIQRCode === ServiceAndPreferenceConstatnts.PREFERENCE_ENABLED },
                    { lookupCode: OnboardConstants.ViaGenericQRCode, checked: preferences.paymentRequestViaGenericQRCode === ServiceAndPreferenceConstatnts.PREFERENCE_ENABLED },
                ];

                newRequestInitiationModes = newRequestInitiationModes.map(mode => {
                    const updatedMode = updatedRequestInitiationModes.find(updated => updated.lookupCode === mode.lookupCode);
                    return updatedMode ? { ...mode, checked: updatedMode.checked } : mode;
                });

                newState.selectedRequestInitiationModes = newRequestInitiationModes;

                // Handle QR code modes
                this.updateQRCodeModes(preferences.generateUpiQrCode, preferences.generateQrCode, newState);
            }

            // Update refund modes
            if (preferences.refundViaFile || preferences.refundViaScreenPreference) {
                let newRefundModes = [...this.state.selectedRefundModes];
                const updatedRefundModes = [
                    { lookupCode: OnboardConstants.RefundViaFileUpload, checked: preferences.refundViaFile === ServiceAndPreferenceConstatnts.PREFERENCE_ENABLED },
                    { lookupCode: OnboardConstants.RefundViaScreen, checked: preferences.refundViaScreenPreference === ServiceAndPreferenceConstatnts.PREFERENCE_ENABLED },
                ];

                newRefundModes = newRefundModes.map(mode => {
                    const updatedMode = updatedRefundModes.find(updated => updated.lookupCode === mode.lookupCode);
                    return updatedMode ? { ...mode, checked: updatedMode.checked } : mode;
                });

                newState.selectedRefundModes = newRefundModes;
            }

            // Update cancellation modes
            if (preferences.cancellationViaApiPreference || preferences.cancellationViaScreenPreference) {
                let newCancellationModes = [...this.state.selectedCancellationModes];
                const updatedCancellationModes = [
                    { lookupCode: OnboardConstants.ViaApi, checked: preferences.cancellationViaApiPreference === ServiceAndPreferenceConstatnts.PREFERENCE_ENABLED },
                    { lookupCode: OnboardConstants.CancellationViaScreen, checked: preferences.cancellationViaScreenPreference === ServiceAndPreferenceConstatnts.PREFERENCE_ENABLED },
                ];

                newCancellationModes = newCancellationModes.map(mode => {
                    const updatedMode = updatedCancellationModes.find(updated => updated.lookupCode === mode.lookupCode);
                    return updatedMode ? { ...mode, checked: updatedMode.checked } : mode;
                });

                newState.selectedCancellationModes = newCancellationModes;
            }

            // Final state update
            this.setState(newState);
        }
    };
    

    updateQRCodeModes = (upiQRCodeValue, genericQRCodeValue, newState) => {
        const qrCodeModes = [
            { lookupCode: OnboardConstants.ViaUPIQRCode, checked: upiQRCodeValue === ServiceAndPreferenceConstatnts.PREFERENCE_ENABLED},
            { lookupCode: OnboardConstants.ViaGenericQRCode, checked: genericQRCodeValue === ServiceAndPreferenceConstatnts.PREFERENCE_ENABLED },
        ];
    
        let newQRCodeModes = [...(newState.selectedGenerateQRCode || [])];
    
        qrCodeModes.forEach(qrMode => {
            const existingModeIndex = newQRCodeModes.findIndex(mode => mode.lookupCode === qrMode.lookupCode);
            if (existingModeIndex !== -1) {
                newQRCodeModes[existingModeIndex] = qrMode;
            } else {
                newQRCodeModes.push(qrMode);
            }
        });
    
        newState.selectedGenerateQRCode = newQRCodeModes;
    
        // console.log("Updated QR Code modes in selectedGenerateQRCode:", newState.selectedGenerateQRCode);
    };

    setValuesToCurrencies = (v) => {

        if (v && v.keyCurrencies !== '' && v.keyCurrencies !== null) {
            
            var curyList = [];
            const currencies = v.keyCurrencies.split(',');

            curyList.push(...currencies);

            const updatedArray = this.state.keyCurrenciesList.map((currency) => ({
                ...currency,
                checked: curyList.includes(currency.name),
            }));

            // Store checked true currencies in separate variables
            const checkedKeyCurrencies = updatedArray
                .filter((currency) => currency.checked)
                .map((currency) => currency);

            this.setState({ keyCurrenciesList: updatedArray, selectedKeyCurrency: checkedKeyCurrencies });

            if (this.state.keyCurrenciesList.every((item) => item.checked == true)) {
                this.state.keyCurrencies = true;
            }
        }

        if (v && v.allowedCurrencies !== '' && v.allowedCurrencies !== null) {
            
            var curyList = [];
            const currencies = v.allowedCurrencies.split(',');

            curyList.push(...currencies);

            const updatedArray = this.state.withoutKeyCurrenciesList.map((currency) => ({
                ...currency,
                checked: curyList.includes(currency.name),
            }));

            // Store checked true currencies in separate variables
            const checkedKeyCurrencies = updatedArray
                .filter((currency) => currency.checked)
                .map((currency) => currency);

            this.setState({ withoutKeyCurrenciesList: updatedArray, selectedOtherCurrency: checkedKeyCurrencies });

            if (this.state.withoutKeyCurrenciesList.every((item) => item.checked == true)) {
                this.state.otherCurrencies = true;
            }
        }
    }

    /**
    * update the each fields in the form
    * after the updation trigger the field validation
    * 
    * @param {*} formFields 
    */
    updateFormFields = async (formFields, validate = true) => {
        await this.setState({ formFields: formFields });
    }

    saveServicePreference = async () => {

        if (this.state.isApiChecked && this.state.formFields.skipBenepayPayerPage.value == true){
            // Replace the returnUrl validation dynamically
            var cbRules = this.rules.returnUrl.map(rule => {
                if (rule.type === 'depend') {
                    return {
                        ...rule,
                        cb: () => {
                            console.log("this.state.isApiChecked",this.state.isApiChecked);
                            
                            return this.state.isApiChecked === true && this.state.formFields.skipBenepayPayerPage.value == true;
                        }
                    };
                }
                return rule;
            });
            
            this.state.formFields["returnUrl"].rules = cbRules;
            await this.setState({ formFields: this.state.formFields });
        }
        let formValid = await this.validateForm();
        var sendRes = { saveSP: false, messages: false };
        let merchantActiveStatus = this.props.merchantActiveStatus

        if (formValid && this.state.fieldsOnchange && this.state.merchantId) {
            this.setState({ loading: true });
            const formFields = this.state.formFields;

            var selectedRequestInitiationModes = this.state.selectedRequestInitiationModes;
            var selectedRefundModes = this.state.selectedRefundModes
            var selectedCancellationModes = this.state.selectedCancellationModes
            var selectedGenerateQRCode = this.state.selectedGenerateQRCode
            
            // Set values based on checked status
            const paymentRequestViaApi = selectedRequestInitiationModes.find(mode => mode.lookupCode === OnboardConstants.ViaApi && mode.checked) ? "1" : "2";
            const paymentRequestViaFile = selectedRequestInitiationModes.find(mode => mode.lookupCode === OnboardConstants.ViaFileUpload && mode.checked) ? "1" : "2";
            const paymentRequestViaRealtimeApi = selectedRequestInitiationModes.find(mode => mode.lookupCode === OnboardConstants.ViaDRM && mode.checked) ? "1" : "2";
            const paymentRequestViaQuickPay = selectedRequestInitiationModes.find(mode => mode.lookupCode === OnboardConstants.ViaCustomPay && mode.checked) ? "1" : "2";
            const paymentRequestViaScreen = selectedRequestInitiationModes.find(mode => mode.lookupCode === OnboardConstants.ViaScreen && mode.checked) ? "1" : "2";

            const refundViaFile = selectedRefundModes.find(mode => mode.lookupCode === OnboardConstants.RefundViaFileUpload && mode.checked) ? "1" : "2";
            const refundViaScreenPreference = selectedRefundModes.find(mode => mode.lookupCode === OnboardConstants.RefundViaScreen && mode.checked) ? "1" : "2";

            const cancellationViaApiPreference = selectedCancellationModes.find(mode => mode.lookupCode === OnboardConstants.CancellationViaApi && mode.checked) ? "1" : "2";
            const cancellationViaScreenPreference = selectedCancellationModes.find(mode => mode.lookupCode === OnboardConstants.CancellationViaScreen && mode.checked) ? "1" : "2";

            const generateQrCode = selectedGenerateQRCode.find(mode => mode.lookupCode === OnboardConstants.ViaGenericQRCode && mode.checked) ? "1" : "2";
            const generateUpiQrCode = selectedGenerateQRCode.find(mode => mode.lookupCode === OnboardConstants.ViaUPIQRCode && mode.checked) ? "1" : "2";

            const {autoReqTnxId,  disableChargeOrReason, shortTnxId} = this.state.formFields;

            console.log("handleCheckBoxEvent", (this.state.formFields.skipBenepayPayerPage.value == true && this.state.isApiChecked == true))

            var requestObj ={
                paymentRequestViaApi: paymentRequestViaApi,
                paymentRequestViaFile: paymentRequestViaFile,
                paymentRequestViaRealtimeApi: paymentRequestViaRealtimeApi,
                paymentRequestViaScreen: paymentRequestViaScreen,
                paymentRequestViaQuickPay: paymentRequestViaQuickPay,
    
                refundViaFile:refundViaFile,
                refundViaScreenPreference: refundViaScreenPreference,

                cancellationViaApiPreference: cancellationViaApiPreference,
                cancellationViaScreenPreference: cancellationViaScreenPreference,

                generateQrCode: generateQrCode,
                generateUpiQrCode: generateUpiQrCode,

                skipPayerUi: this.state.formFields.skipBenepayPayerPage.value ? "1": "2",
                invoiceSubscriptionPreference: Utils.setNullWhenEmpty(this.state.invoicesSubscription ? "1":"2" ),
                paidInvoiceToPayer: Utils.setNullWhenEmpty(this.state.autoGeneratePaidInvoice? "1":"2" ),
                unpaidInvoiceToPayer: Utils.setNullWhenEmpty(this.state.autoGenerateUnpaidInvoice? "1":"2" ),
                returnUrl:  this.state.isApiChecked == true || this.state.isRealtimeApiCHecked == true ? Utils.setNullWhenEmpty(formFields.returnUrl.value) : null,
                merchantCallbackUrl:    Utils.setNullWhenEmpty(formFields.merchantCallbackUrl.value),
                paymentNoOfDueDays: Utils.setNullWhenEmpty(formFields.paymentDefaultDueDate.value),
                paymentNoOfExpiryDays: Utils.setNullWhenEmpty(formFields.expiryDate.value),
                emailId: Utils.setNullWhenEmpty(formFields.emailId.value),
                mobileNoForSMS: Utils.formatMobileNo(formFields.mobileNoForSMS.value, formFields.SMSMobileNoCountryCode.value),
                smsMobileNoCountryCode: formFields.mobileNoForSMS.value ? Utils.formatCountryCode(Utils.setNullWhenEmpty(formFields.SMSMobileNoCountryCode.value)) : null,
                mobileNoForWhatsApp: Utils.formatMobileNo(formFields.mobileNoForWhatsApp.value, formFields.WhatAppMobileNoCountryCode.value),
                whatAppMobileNoCountryCode: formFields.mobileNoForWhatsApp.value ? Utils.formatCountryCode(Utils.setNullWhenEmpty(formFields.WhatAppMobileNoCountryCode.value)) : null,
                keyCurrencies: this.state.keyCurrencies ? this.getCurrencyName(this.state.keyCurrenciesList) : this.state.selectedKeyCurrency.length > 0 ? this.getCurrencyName(this.state.selectedKeyCurrency) : [],
                otherCurrencies: this.state.otherCurrencies ? this.getCurrencyName(this.state.withoutKeyCurrenciesList) : this.state.selectedOtherCurrency.length > 0 ? this.getCurrencyName(this.state.selectedOtherCurrency) : [],
                allowPartialPayments:this.state.formFields.allowPartialPayments.value,
                skipBenepayPayerPage:this.state.formFields.skipBenepayPayerPage.value ? true: false,
                returnUrl:  (this.state.formFields.skipBenepayPayerPage.value == true && this.state.isApiChecked == true) || this.state.isRealtimeApiCHecked == true ? Utils.setNullWhenEmpty(formFields.returnUrl.value) : null,
                merchantCallbackUrl:  Utils.setNullWhenEmpty(formFields.merchantCallbackUrl.value),
                
                autoReqTnxId: Utils.isNullOrEmpty(autoReqTnxId.value) || !autoReqTnxId.value || autoReqTnxId.value == "2" ? "2": "1",
                // disableReqId: Utils.isNullOrEmpty(disableReqId.value) || !disableReqId.value || disableReqId.value == "2" ? "2": "1",
                disableChargeOrReason: Utils.isNullOrEmpty(disableChargeOrReason.value) || !disableChargeOrReason.value || disableChargeOrReason.value == "2" ? "2": "1",
                // disableTotalAmount: Utils.isNullOrEmpty(disableTotalAmount.value) || !disableTotalAmount.value || disableTotalAmount.value == "2" ? "2": "1",
                shortTnxId: Utils.isNullOrEmpty(shortTnxId.value) || !shortTnxId.value || shortTnxId.value == "2" ? "2": "1",

                isOnlinePaymentEnabled: this.state.isRealtimeApiCHecked || this.state.isApiChecked ,
                manualPayment : formFields.manualPayment.value ? true : false,
                digitalPayment : formFields.digitalPayment.value ? true : false,
                merchantTimeZone: Utils.setNullWhenEmpty(formFields.merchantTimeZone.value),
                reminderFrequency: Utils.setNullWhenEmpty(formFields.reminderFrequency.value),
                merchantId : this.state.merchantId,
                allowPartialPayments : this.state.formFields.allowPartialPayments.value,
                defaultCurrencies: Utils.setNullWhenEmpty(formFields.defaultCurrency.value),
                isOnlinePaymentEnabled: (paymentRequestViaApi == "1" || paymentRequestViaRealtimeApi == "1") ? true : false,
                seamlessPayment: this.state.seamlessPayment

            }
            
            const res = await DashboardService.saveMerchantServicepref(requestObj);
            console.log("Save Services and preference :", res);

            if (res && res !== 'undefined' && res.statusCode == "200") {
                //Method handle the delete and clear button show/hide
                this.props.resetBtnConfigFlag(OnboardConstants.spTabVal);

                this.setState({ save: OnboardConstants.DONE, loading: false });

                sendRes.saveSP = true;
                sendRes.messages = true;
            } else {
                this.setState({ loading: false });
            }
        } else {

            if (!this.state.fieldsOnchange && merchantActiveStatus === OnboardConstants.InActiveStatus) {
                sendRes.saveSP = true;
                sendRes.messages = false;
            } 
            
            if (!this.state.fieldsOnchange && merchantActiveStatus === OnboardConstants.ActiveStatus && !formValid) {
                sendRes.saveSP = false;
                sendRes.messages = false;
            }if (!this.state.fieldsOnchange && merchantActiveStatus === OnboardConstants.ActiveStatus && formValid) {
                sendRes.saveSP = true;
                sendRes.messages = false;
            }
            this.setState({ save: '' });
        }

        this.props.sPSaveResponse(sendRes);
    }
    
    formatTransactionModes = (transactionCreationMode,selectedTransactionModes) => {
        let formattedModes = '';
    
        // Iterate through transactionCreationMode
        transactionCreationMode.forEach(mode => {
            // Check if the mode is checked in selectedTransactionModes
            const foundMode = selectedTransactionModes.find(selectedMode => selectedMode.lookupCode === mode.lookupCode && selectedMode.checked == true);
            formattedModes += foundMode ? '1' : '0';
        });
    
        return formattedModes;
    };
    

    /**
     * Method handle fetch the existing record and update the form.
     */
    fetchSerAndPre = () => {
        let merchantId = this.props.merchantId;
        const formFields = this.state.formFields;

        if (merchantId) {
            this.setState({ fetchSPloading: true });

            DashboardService.fetchMerchantOnboardPrefe(merchantId)
                .then(res => {
                    if (res && res.merchantServiceAndPreference.length > 0) {
                        //Method handle the delete and clear button show/hide
                        this.props.resetBtnConfigFlag(OnboardConstants.spTabVal);

                        res.merchantServiceAndPreference.forEach((v, i) => {
                            console.log("vvvv",v);
                            
                            formFields.defaultCurrency.value = Utils.setEmptyWhenNull(v.defaultCurrency);
                            formFields.merchantTimeZone.value = Utils.setEmptyWhenNull(v.merchantTimeZone);
                            formFields.emailId.value = Utils.setEmptyWhenNull(v.email);
                            formFields.paymentDefaultDueDate.value = Utils.setEmptyWhenNullValues(v.defaultPaymentDueDays);
                            formFields.expiryDate.value = Utils.setEmptyWhenNullValues(v.expiryAfterDue);
                            formFields.reminderFrequency.value = Utils.setEmptyWhenNullValues(v.reminderFrequency);
                            formFields.returnUrl.value = Utils.setEmptyWhenNull(v.returnUrl);
                            formFields.merchantCallbackUrl.value = Utils.setEmptyWhenNull(v.merchantCallbackUrl);
                            formFields.merchantTimeZone.value = Utils.setEmptyWhenNull(v.merchantTimeZone);

                            formFields.allowPartialPayments.value=(v.allowPartialPayments);
                            formFields.skipBenepayPayerPage.value=(v.skipBenepayPayerPage);
                            formFields.manualPayment.value=v.manualPayment == manualPay.enabled ? true : false;
                            formFields.digitalPayment.value=v.digitalPayment == manualPay.enabled ? true : false;

                            formFields.autoReqTnxId.value = (v.autoReqTnxId);
                            formFields.disableChargeOrReason.value =(v.disableChargeOrReason);
                            formFields.shortTnxId.value =(v.shortTnxId);
                            // formFields.disableReqId.value =(v.disableReqId);
                            // formFields.disableTotalAmount.value =(v.disableTotalAmount);

                            this.state.invoicesSubscription = v.invoiceSubscription == "1" ? true : false;
                            this.state.autoGeneratePaidInvoice = v.autoInvoicePaid == "1" ? true : false;
                            this.state.autoGenerateUnpaidInvoice = v.autoInvoiceUnpaid == "1" ? true : false;
                            this.setState({ 
                                onlinePaymentSubcription: v.returnUrl != null ? true : false,
                                merchantEncKey : v.merchantEncKey,
                            });

                            if(v.notificationSmsCtryCode && v.notificationSmsPhone){
                                formFields.SMSMobileNoCountryCode.value = Utils.setEmptyWhenNull(v.notificationSmsCtryCode);
                                formFields.mobileNoForSMS.value = Utils.setEmptyWhenNull(v.notificationSmsCtryCode + v.notificationSmsPhone);
                            }

                            if(v.notificationWtsapCtryCode && v.notificationWtsapPhone){
                                formFields.WhatAppMobileNoCountryCode.value = Utils.setEmptyWhenNull(v.notificationWtsapCtryCode);
                                formFields.mobileNoForWhatsApp.value = Utils.setEmptyWhenNull(v.notificationWtsapCtryCode + v.notificationWtsapPhone);
                            }
                          
                            this.state.seamlessPayment = v.seamlessPayment == "1" ? true : false;

                            
                            this.updateFormFields(formFields);
                            this.CheckBoxHandleForRequests(v);
                            this.setValuesToCurrencies(v);
                            
                            //If initiate payment api is true, show the call back url field
                            this.updateIsApiChecked();

                            this.props.onTransactionModeChange(this.state.formFields.manualPayment.value);
                        
                        });

                    }
                    this.setState({ fetchSPloading: false });
                })
                .catch(error => {
                    // Handle error here
                    console.error("Error fetching data:", error);
                    this.setState({ fetchSPloading: false });
                });
        }
    }

    //Delete preference
    deletePreference = async () => {
        if (this.state.merchantId) {

            this.setState({loading:true});

            const res = await DashboardService.deleteOnboardPreference(this.state.merchantId);

            if (res.message) {
                this.setState({ openBDdeletepopup: false, loading:false }, () => {
                    toast.success(res.message);
                    this.clearPreferenceValues();
                });
            }else{
                this.setState({loading:false});
            }
        }
        else {
            this.setState({ openBDdeletepopup: false }, () => {
                toast.error("Unable to delete");
            });
        }
    }

    /**
    * Method to refresh the form fields
    */
    resetForm = async () => {
        this.setState({
            formFields: this.prepareField(this.fieldNames, this.rules)
        })
    }

    /**
     * Reset the all fields
     */
    clearPreferenceValues = () => {

        this.resetForm();
        this.setState({
            selectedKeyCurrency: [],
            selectedOtherCurrency: [],
            paymentRequestInitiationViaAPI: false,
            paymentRequestInitiationViaFileUpload: false,
            paymentRequestInitiationViaScreen: false,
            invoicesSubscription: false,
            keyCurrencies: false,
            otherCurrencies: false,
            autoGenerateUnpaidInvoice: false,
            autoGeneratePaidInvoice: false,
            onlinePaymentSubcription:false,
            manualPaymentSubcription : false,
            allowPartialPayments:false,
            selectedRequestInitiationModes:[],
            selectedRefundModes:[],
            selectedCancellationModes:[],
        }, () => {
            const newState = { ...this.state };

            const anyKeyCuryChecked = newState.keyCurrenciesList.some(item => item.checked);
            newState.keyCurrenciesList = newState.keyCurrenciesList.map((item) => ({
                ...item,
                checked: anyKeyCuryChecked ? false : item.checked,
            }));

            const anyOtherCuryChecked = newState.withoutKeyCurrenciesList.some(item => item.checked);
            newState.withoutKeyCurrenciesList = newState.withoutKeyCurrenciesList.map((item) => ({
                ...item,
                checked: anyOtherCuryChecked ? false : item.checked,
            }));

            this.setState(newState);
        });
    }

    /**
    * Collect the Transaction Mode  list
    */
    getTransactionCreationMode = async () => {
        this.setState({ loading: true });
    
        DashboardService.getLookupDetails(LookupKeys.transactionCreationMode).then((result) => {
            if (result && result.lookupDetails && result.lookupDetails.length > 0) {
                // Filter out OnboardConstants.ViaDRM
                const filteredModes = result.lookupDetails;
                
                // Rearrange the filteredModes array
                const rearrangedPaymentModes = [];

                //This Order is important!
                filteredModes.forEach(mode => {
                    switch (mode.lookupCode) {
                        case OnboardConstants.ViaApi:
                            rearrangedPaymentModes.splice(0, 0, mode);
                            break;
                            
                        case OnboardConstants.ViaFileUpload:
                            rearrangedPaymentModes.splice(1, 0, mode);
                            break;

                        case OnboardConstants.ViaScreen:
                            rearrangedPaymentModes.splice(2, 0, mode);
                            break;

                        case OnboardConstants.ViaUPIQRCode:
                            rearrangedPaymentModes.splice(3, 0, mode);
                            break;

                        case OnboardConstants.ViaGenericQRCode:
                            rearrangedPaymentModes.splice(4, 0, mode);
                            break;
                            
                        default:
                            rearrangedPaymentModes.push(mode);
                            break;
                    }
                });

                // Set the state with the filtered transaction creation modes
                this.setState({ transactionCreationMode: rearrangedPaymentModes, loading: false });
            } else {
                this.setState({ loading: false });
            }
        });
    }
    

    /**
   * Funtion for toggle eye icon in Merchant Encryption input field
   */
    toggleEncKeyVisibility = () => {
        if (this.state.showEncKey == true) {
            this.setState({ showEncKey: false });
        }
        else {
            this.setState({ showEncKey: true });
        }
    };

    /**
     * Method to copy Merchant Enc Key
     * @param {merchantKey} value 
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
    * Collect the list of payment providers data
    */
    getProviders = async (merchantId) => {
        try {
            if (merchantId != null && merchantId != '') {
                this.setState({ loading: true });
                const reqData = { merchantId: merchantId }

                const res = await DashboardService.fetchMerchantOnboarding(reqData);
                
                if(res != undefined && res != null && res.paymentProviders != null){
                    this.setState({paymentProviders: res.paymentProviders, loading: false})
                }   
                else{
                    this.setState({ loading: false });
                }
            } else {
                toast(messages.merchantIdErrMsg, {
                    position: toast.POSITION.BOTTOM_CENTER,
                    className: "toast-message toast-error",
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Method handle the onclick event of transaction modes
     * Validating if the modes are unchecked
     * 
     * @param {*} fieldName 
     * @param {*} value 
     */
    handleTransactionModeOnClick = (fieldName, value, validation) =>{
        const providersList = this.state.paymentProviders;
        var providerPriorityIsOne = '';
        
        try {
            if(fieldName != ''){
                if(value == true){
                    this.updateFormField(fieldName, value, validation);
                }

                if((fieldName == 'digitalPayment' || fieldName == 'manualPayment') && value == false){
                    const txnMode = fieldName == 'digitalPayment' ? manualPay.digitalMode : fieldName == 'manualPayment' ? manualPay.manualMode : '';
                    var flagForShowAlertMsg = "";
                    var AlertMsg = "";
                    let paymentGateways = "";

                    if(providersList.length > 0){

                        switch (txnMode) {
                            case manualPay.digitalMode:
                                providerPriorityIsOne = providersList.find(v => v.priority == 1 && v.transactionMode == 1);
                                paymentGateways = providersList.filter(provider => provider.transactionMode === 1)
                                    .map(provider => provider.paymentProviderName)
                                    .join(', ');

                                (providerPriorityIsOne != undefined && providerPriorityIsOne) ? flagForShowAlertMsg = txnMode : 
                                (paymentGateways == "") ? flagForShowAlertMsg = manualPay.disableMerchantDigitalMode : flagForShowAlertMsg = manualPay.deletedigitalMode

                                break;

                            case manualPay.manualMode:
                                providerPriorityIsOne = providersList.find(v => v.priority == 1 && v.transactionMode == 2);
                                paymentGateways = providersList.filter(provider => provider.transactionMode === 2)
                                    .map(provider => provider.paymentProviderName)
                                    .join(', ');

                                (providerPriorityIsOne != undefined && providerPriorityIsOne) ? flagForShowAlertMsg = txnMode : 
                                (paymentGateways == "") ? flagForShowAlertMsg = manualPay.disableMerchantManualMode : flagForShowAlertMsg = manualPay.deleteManualMode

                                break;
                        
                            default:
                                console.log("Unable to process the transaction mode inactivate");
                                break;
                        }
                        
                        AlertMsg = this.prepareTxnDisableMsg(flagForShowAlertMsg, paymentGateways);

                        if(providerPriorityIsOne != undefined && providerPriorityIsOne){
                            this.setState({openTxnModeValidationPopup:true});
                        }else{
                            this.setState({openTxnModeDisablePopup:true});
                        }
                    }
                    else{
                        this.updateFormField(fieldName, value, validation);
                    }

                    this.setState({AlertMsg, flagForShowAlertMsg, txnMode});
                }
                
                this.props.onTransactionModeChange(this.state.formFields.manualPayment.value);
            }
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Preparing the alert message
     * 
     * @param {*} flagForShowAlertMsg 
     * @param {*} paymentGateways 
     * @returns 
     */
    prepareTxnDisableMsg = (flagForShowAlertMsg, paymentGateways) =>{
        try {
            var msg = "";
            let modeName1 = "";
            let modeName2 = "";

            switch (flagForShowAlertMsg) {
                case manualPay.digitalMode:
                    modeName1 = "Digital";
                    modeName2 = "Manual";
                    msg = Utils.stringReplace(messages.preferenceTxnModePriorityMsg, {modeName1, modeName2, modeName1});
                    break;

                case manualPay.manualMode:
                    modeName1 = "Manual";
                    modeName2 = "Digital";
                    msg = Utils.stringReplace(messages.preferenceTxnModePriorityMsg, {modeName1, modeName2, modeName1});
                    break;

                case manualPay.deleteManualMode:
                    modeName1 = "Manual";
                    modeName2 = "Digital";
                    msg = Utils.stringReplace(messages.preferenceTxnModeDeleteMsg, {modeName1, paymentGateways, modeName2});
                    break;

                case manualPay.deletedigitalMode:
                    modeName1 = "Digital";
                    modeName2 = "Manual";
                    msg = Utils.stringReplace(messages.preferenceTxnModeDeleteMsg, {modeName1, paymentGateways, modeName2});
                    break;
                    
                case manualPay.disableMerchantManualMode:
                    modeName1 = "Manual";
                    modeName2 = "Manually";
                    msg = Utils.stringReplace(messages.preferenceDisableMerchantTxnMode, {modeName1, modeName2});
                    break;

                case manualPay.disableMerchantDigitalMode:
                    modeName1 = "Digital";
                    modeName2 = "Digitally";
                    msg = Utils.stringReplace(messages.preferenceDisableMerchantTxnMode, {modeName1, modeName2});
                    break;
            
                default:
                    msg = messages.defaultErrorMsg;
                    break;
            }

            return msg;

        } catch (error) {
            console.error(error);
        }
    }

    /**
     * deactivating the transactiom modes
     * Delete all the digital/manual payment providers and methods
     * @returns 
     */
    deActivateTxnModeAndProviders = async () =>{
        try {
            this.setState({loaderForTxnModeInactiveProcess:true});

            const reqObj = {merchantId:this.state.merchantId, providerId:this.state.txnMode};

            var response = await DashboardService.inactiveTransactionMode(reqObj);
            
            if( response.statusCode == 200 ){
                this.setState({loaderForTxnModeInactiveProcess:false, openTxnModeDisablePopup:false},
                    await this.getSupportedCurrency(() => {
                        this.fetchSerAndPre();
                    },
                    toast(response.message, {
                        position: toast.POSITION.BOTTOM_CENTER,
                        className: "toast-message toast-success",
                    }))
                );
            }
            else{
                this.setState({loaderForTxnModeInactiveProcess:false});
                toast(response.message, {
                    position: toast.POSITION.BOTTOM_CENTER,
                    className: "toast-message toast-error",
                });
            }
        } catch (error) {
            console.error(error);
            this.setState({loaderForTxnModeInactiveProcess:false});

            toast(messages.serverError, {
                position: toast.POSITION.BOTTOM_CENTER,
                className: "toast-message toast-error",
            });
        }
    }
    updateIsApiChecked = () => {
        const { selectedRequestInitiationModes } = this.state;
        
        this.setState({
            isApiChecked: selectedRequestInitiationModes.some(
                mode => mode.lookupCode === OnboardConstants.ViaApi && mode.checked
            ),
            isRealtimeApiCHecked: selectedRequestInitiationModes.some(
                mode => mode.lookupCode === OnboardConstants.ViaDRM && mode.checked
            )
        });
    };

    fetchTimeZones = async () => {

        this.setState({ loading: true });
        // Call the DashboardService's fetchTimeZones method
        const res = await DashboardService.fetchTimeZones();
        // Check the response and update the state
        if (res && res.length > 0) {
            this.setState({ merchantTimeZone: res });
            this.setState({ loading: false });
            console.log("this.state.merchantTimeZone", this.state.merchantTimeZone);
        } else {
            this.setState({ merchantTimeZone: [] });
            this.setState({ loading: false });

        }
    };
    

    render = () => html.apply(this);
}

export default (ServicePreference);
