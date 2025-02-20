import React, { Component } from 'react';

import { html } from "./index.html";
import FormValidationService from 'service/core/validate.service';
import Validator from 'service/core/validator';
import moment from 'moment';
import { DashboardService } from 'service/api/dashboard.service';
import { DefaultDateFormat, messages } from 'config/constants';

export default class PaymentMethod extends Component {
    fieldNames = [
        'onboardingStatus',
        'dateCompletedForOnboarding',
        'merchantIdForProvider',
        'onboardingNotes',
        'fksettlementId',
        'dateOnboardingCommenced',
    ]

    baseRule = [{ validate: 'required', type: 'depend', cb: () => { return this.state.activePMEnabled == true; } }];
    // endDateRule = [
    //     { validate: 'required', type: 'depend', cb: () => { return this.state.activePMEnabled == true; } },
    //     { validate: 'dateLessThan', depends: ['dateOnboardingCommenced']},
    // ];
    startDateRule = [
        { validate: 'required', type: 'depend', cb: () => { return this.state.activePMEnabled == true; } },
        // { validate: 'dateGreaterThan', depends: ['dateCompletedForOnboarding']},
    ];

    rules = {
        onboardingStatus: this.baseRule,
        // dateCompletedForOnboarding: this.endDateRule,
        fksettlementId: this.baseRule,
        dateOnboardingCommenced: this.startDateRule,
        merchantIdForProvider: [],
    }

    constructor(props) {
        super(props);

        this.state = {
            onboardStatusOptions: props.onboardStatusOptions || [],
            currencyList: props.currencyList || [],
            defaultCurrency: props.settlementCurrency || '',
            paymentMethods: props.paymentMethods || [],
            selectedPM: 1,
            activePMEnabled: false,
            showInactivationPopup: false,
            settlementAcList:[],
            merchantId:props.merchantId,
            disabledConfirmBtn:false,
        }

        this.state.formFields = this.prepareField(this.fieldNames, this.rules);
    }

    componentDidUpdate(prevProps, prevState) {

        var { paymentMethodInvalid, providerId } = this.props;
        var { selectedPM } = this.state;

        // check if status data loaded to update the status list
        if (prevProps.onboardStatusOptions !== this.props.onboardStatusOptions) {
            this.setState({ onboardStatusOptions: this.props.onboardStatusOptions });
        }

        // check if currency data loaded to update the currency list
        if (prevProps.currencyList !== this.props.currencyList) {
            this.setState({ currencyList: this.props.currencyList });
        }

        // check if settlementCurrency loaded to update the currency
        if (prevProps.settlementCurrency !== this.props.settlementCurrency) {
            this.setState({ defaultCurrency: this.props.settlementCurrency });
        }

        // check if payment methods loaded to update the payment methods list
        if (prevProps.paymentMethods !== this.props.paymentMethods) {
            this.setState({ paymentMethods: this.props.paymentMethods });
            this.resetForm();
        }

        // check if merchantId loaded to update the merchantId in the state
        if (prevProps.merchantId !== this.props.merchantId) {
            this.setState({ merchantId: this.props.merchantId });
            this.resetForm();
        }

        // check if provider id changed to update the payment method form
        if ( providerId !== prevProps.providerId) {
            this.setupPMViewByData(providerId);
        }

        //Clear the form
        if (this.props.resetFormFields !== prevProps.resetFormFields) {
            this.props.resetClearFormFlag();
            this.resetPaymentMethods();
        }
        
        // check if status data loaded to update the status list
        if (prevProps.paymentMethodInvalid !== this.props.paymentMethodInvalid) {
            if( paymentMethodInvalid == true ){
                this.validateForm().then(() => {
                    this.props.setPaymentMethodFormData(providerId, selectedPM, "formInValid", true);
                });
            } else {
                this.props.setPaymentMethodFormData(providerId, selectedPM, "formInValid", false);
            }
        }
    }

    componentDidMount() {
        this.fetchSettlementList();
    }

    /**
     * Process when on change trigger for payment method
     * 
     * @param {*} event 
     * @param {*} selectedPM 
     */
    handlePMChange = async (event, selectedPM) => {
        const { paymentMethods, defaultCurrency } = this.state;
        const { providerId } = this.props;

        const data = paymentMethods.find(paymentMethod => paymentMethod.lookupCode === selectedPM);

        // Check if selectedProvider exists and extract the checked status
        const activePMEnabled = (data && data.checked) ? data.checked : false;

        await this.setState({ selectedPM, activePMEnabled });

        var pmData = this.updatePMFormFieldValues(providerId, selectedPM);

        if( pmData && pmData.formInValid ) {
            this.validateForm();
        }
        
        // var currency = defaultCurrency;

        // update settlement currency in the global varaible
        // if(pmData && pmData.settlementCurrency ) {
        //     currency = pmData.settlementCurrency;
        // }

        // this.props.setPaymentMethodFormData(providerId, selectedPM, "settlementCurrency", currency );
    }

    /**
     * Handle activate the payment method
     * 
     * @param {*} selectedPM 
     */
    handleActivatePM = (event, selectedPM) => {
        var { paymentMethods, activePMEnabled } = this.state;
        var { providerId } = this.props;
        
        activePMEnabled = event.target.checked;

        if( activePMEnabled ){

            paymentMethods = paymentMethods.map(paymentMethod => ({
                ...paymentMethod,
                checked: (selectedPM == paymentMethod.lookupCode) ? activePMEnabled : (paymentMethod.checked) ? paymentMethod.checked : false
            }));

            this.setState({ activePMEnabled, paymentMethods });
            
            this.validateForm(false).then((valid) => {
                this.props.setPaymentMethodFormData( providerId, selectedPM, "formValid", valid);
            });
        } else{
            this.setState({ showInactivationPopup: true });
        }
    }

    /**
     * Date change handler
     * 
     * @param {*} event 
     * @param {*} fieldName 
     */
    handleDateFields = (event, fieldName) => {
        let value = null;

        if (event != null) {
            value = moment(event.toDate()).format(DefaultDateFormat.dateFormat);
        }

        this.updateFormField(fieldName, value).then(() => {
            this.collectFormData(fieldName, false);
        });
    }

    /**
    * Method to update the particular field in the form
    * after the updation trigger the field validation
    * 
    * @param {*} fieldName 
    * @param {*} value 
    * @param {*} validate 
    */
    updateFormField = async (fieldName, value, validate = true) => {

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
    validateForm = async (showError = true) => {
        let formValid = true;

        for (let fieldName of this.fieldNames) {
            const field = this.state.formFields[fieldName];

            const { errors, valid } = await FormValidationService.validate(field.rules, field.value, this.state.formFields);

            if (showError) {
                this.state.formFields[fieldName].errors = errors;
            }

            if (!valid) {
                formValid = false;
            }
        };

        this.setState({ formFields: this.state.formFields });

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

            if (["providerEnabled", "settlementsDetailsForAllSer"].includes(fieldName)) {
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
     * Method to refresh the form fields
     */
    resetForm = async () => {
        this.setState({
            formFields: this.prepareField(this.fieldNames, this.rules)
        });
    }

    /**
     * store the values together for one short submission
     * 
     * @param {*} fieldName 
     * @param {*} validateField 
     * @param {*} validateForm 
     */
    collectFormData = (fieldName, validateField = true, validateForm = true) => {
        const { providerId } = this.props;
        const { formFields, selectedPM } = this.state;

        var value = formFields[fieldName].value;

        if (validateForm) {
            this.validateForm(false).then((valid) => {
                this.props.setPaymentMethodFormData(providerId, selectedPM, fieldName, value);
                this.props.setPaymentMethodFormData(providerId, selectedPM, "formValid", valid);
            });
        }

        if (validateField) {
            this.validateField(fieldName);
        }
    }

    /**
     * When component initiate render
     * Update the state fields to enable properties based on the payment method data
     * 
     * @param {*} data 
     */
    setupPMViewByData = (providerId) => {
        var { paymentMethods, selectedPM, activePMEnabled } = this.state;

        var providerData = this.props.getAllPaymentMethodFormData(providerId);

        const activeMethods = Object.values(providerData).map(item => item.cardType)

        activePMEnabled = false;

        paymentMethods = paymentMethods.map(method => {

            if (activeMethods.includes(method.lookupCode.toString())) {
                method.checked = true;
            } else {
                method.checked = false;
            }

            if (method.lookupCode == selectedPM && method.checked) {
                activePMEnabled = true;
            }

            return method;
        });

        this.setState({ paymentMethods, activePMEnabled });

        this.updatePMFormFieldValues(providerId, selectedPM);
    }

    /**
     * Reset the form fields of payment methods based on the selected pament method
     * 
     * @param {*} providerId 
     * @param {*} paymentMethod 
     * @returns 
     */
    updatePMFormFieldValues = (providerId, paymentMethod) => {
        this.resetForm();

        var { formFields } = this.state;
        
        var filteredData = this.props.getPaymentMethodFormData(providerId, paymentMethod);

        if (!Validator.isNotEmpty(filteredData)) {
            return;
        }

        for (const fieldName in filteredData) {
            if (!['formValid', 'formInValid', "cardType", "providerId", "paymentProviderName"].includes(fieldName)) {
                if(formFields[fieldName]){
                    formFields[fieldName].value = filteredData[fieldName];
                }
            }
        };

        this.setState({ formFields });

        return filteredData;
    }

    inactivatePM = () => {
        const { providerId } = this.props;
        var { selectedPM, paymentMethods } = this.state;
        this.setState({disabledConfirmBtn: true});

        this.props.inactivateProviderAndMethod( providerId, selectedPM ).then((result) => {
            this.resetForm();
            this.props.updatePaymentMethodFormData(providerId, selectedPM, {});

            paymentMethods = paymentMethods.map(paymentMethod => ({
                ...paymentMethod,
                checked: (selectedPM == paymentMethod.lookupCode) ? false : (paymentMethod.checked) ? paymentMethod.checked : false
            }));
                
            this.setState({ paymentMethods: paymentMethods, activePMEnabled: false, showInactivationPopup: false, disabledConfirmBtn:false });
        });
    }

    //Reset the payment method forms
    resetPaymentMethods = () => {
        this.resetForm();

        const newData = this.state.paymentMethods.map(item => ({
            ...item,
            checked: item.checked !== undefined ? false : undefined
        }));

        this.setState({ paymentMethods: newData, selectedPM: 1 });
    }

    //Fetch merchant settlement account list
    fetchSettlementList = async () => {
        try {
            if(this.state.merchantId){
                const response = await DashboardService.getMerchantSettlement(this.state.merchantId);

                console.log("response", response);
                if (response !== undefined && response != null && response.merchantSettlements != null && response.merchantSettlements.length > 0) {
                    this.setState({ settlementAcList: response.merchantSettlements });
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    render = () => html.apply(this);
}
