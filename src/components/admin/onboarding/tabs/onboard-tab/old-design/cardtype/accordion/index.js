import React, { Component } from 'react';

import { html } from "./index.html";
import FormValidationService from 'service/core/validate.service';
import Validator from 'service/core/validator';
import moment from 'moment';
import { DefaultDateFormat } from 'config/constants';

export default class CardTypeAccordion extends Component {
    fieldNames = [
        'onboardingStatus',
        'dateCompletedForOnboarding',
        'merchantIdForProvider',
        'onboardingNotes',
        'settlementCurrency',
        'bankAccountNumber',
        'branchCode',
        'swiftBic',
        'nameOfAccount',
        'typeOfAccount',
        'nameOfBank',
        'nameOfBranch',
        'providerEnabled',
        'providerExpand',
    ]

    baseRule = [{ validate: 'required', type: 'depend', cb: () => { return this.state.formFields.providerEnabled.value == true; } }];

    rules = {
        onboardingStatus: this.baseRule,
        dateCompletedForOnboarding: this.baseRule,
        merchantIdForProvider: this.baseRule,
        settlementCurrency: this.baseRule,
        bankAccountNumber: this.baseRule,
        branchCode: this.baseRule,
        swiftBic: this.baseRule,
        nameOfAccount: this.baseRule,
        typeOfAccount: this.baseRule,
        nameOfBank: this.baseRule,
        nameOfBranch: this.baseRule,
    }

    constructor(props) {
        super(props);
        
        this.state = {
            onboardStatusOptions: props.onboardStatusOptions,
            currencyList: props.currencyList ?? [],
            formFields: this.prepareField(this.fieldNames, this.rules),
            merchantId: ''
        }
    }
      
    componentDidUpdate(prevProps){
        // update the provider when card type changed
        this.updateProviderByCardType( prevProps.cardType );
        
        if( prevProps.onboardStatusOptions !== this.props.onboardStatusOptions ){
            this.setState({onboardStatusOptions:this.props.onboardStatusOptions});
        }

        if( prevProps.currencyList !== this.props.currencyList ){
            this.setState({currencyList:this.props.currencyList});
        }
    }

    componentDidMount(){
        this.updateProviderByCardType( 0 );        
    }

    handleProviderCheckBox = (value) => {
        this.updateFormField( 'providerEnabled', value, false ).then(()=>{
            this.collectProviderFormData('providerEnabled', false, false);
        });
    }

    handleExpandAccordian = (e) => {
        this.updateFormField( 'providerExpand', !this.state.formFields.providerExpand.value, false ).then(()=>{
            this.collectProviderFormData('providerExpand', false, false);
        });
    }

    handleDateFields = (event, fieldName) => {
        let value = null;

        if (event != null) {
            value = moment(event.toDate()).format(DefaultDateFormat.dateFormat);
        }

        this.updateFormField(fieldName, value).then(() => {
            this.collectProviderFormData(fieldName, false);
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
    validateForm = async ( showError = true ) => {
        let formValid = true;

        for (let fieldName of this.fieldNames) {
            const field = this.state.formFields[fieldName];

            const { errors, valid } = await FormValidationService.validate(field.rules, field.value, this.state.formFields);

            if( showError ){
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

            if ( ["providerEnabled","providerExpand","settlementsDetailsForAllSer"].includes(fieldName) ) {
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

    updateProviderByCardType = ( prevCardType ) => {
        const { provider, cardType } = this.props;
        
        if ( cardType === prevCardType ) {
            return;
        }

        this.resetForm(); // reset the provider form

        var providersData = this.props.getCardTypeData(cardType);
        
        if( Validator.isNotEmpty(providersData) ){
        
            var formFields = this.state.formFields;

            if (providersData[provider.paymentProviderId]) {
                const providerData = providersData[provider.paymentProviderId];
                
                Object.keys(providerData).forEach((fieldName) => {
                    if (!['formValid',"cardType","providerId"].includes(fieldName)) {
                        formFields[fieldName].value = providerData[fieldName];
                    }
                });
            
                this.setState({formFields:formFields});
            }
        }
    }

    // store the values together for one short submission
    collectProviderFormData = ( fieldName, validateField = true, validateForm = true ) => {
        const { provider, cardType } = this.props;

        var value = this.state.formFields[fieldName].value;
        
        this.props.storeProviderValues( cardType, provider.paymentProviderId, fieldName, value);

        if( validateForm ){
            this.validateForm(false).then((valid) => {
                this.props.storeProviderValues( cardType, provider.paymentProviderId, "formValid", valid);
            });
        }

        if (validateField) {
            this.validateField(fieldName);
        }
    }

    render = () => html.apply(this);
}
