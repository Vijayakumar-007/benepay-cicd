import React, { Component } from 'react';
import { html } from "./index.html";
import Validator from 'service/core/validator';

class Provider extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedProvider: "1",
            formFields: this.prepareField(this.fieldNames, this.rules),
            providerData: {},
        }
    }

    fieldNames = [
        'providerId',
        'priority',
        'providerMerchantId',
        'skinCode',
        'signKey',
        'returnUrl',
    ]

    rules = {};

    componentDidMount() {
    }

    componentDidUpdate(prevProps){
        // when detect providers initiated and set low priority for all providers
        if( this.props.paymentProviders !== prevProps.paymentProviders ){
            this.setLowPriority();
            this.updateFormFieldsForProvider(this.state.selectedProvider);
        }
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

            if( fieldName == "priority"){
                value = 0;
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
    * Method to update the particular field in the form
    * after the updation trigger the field validation
    * 
    * @param {*} fieldName 
    * @param {*} value
    */
    updateFormField = async (fieldName, value) => {

        let fields = this.state.formFields;

        if (fields.hasOwnProperty(fieldName) != -1) {
            fields[fieldName].value = value;

            this.setState({ formFields: fields },() => {
                this.storeProviderData(fieldName, value);
            });
        }
    }

    handleTabChange = (event, provider) => {
        this.resetForm().then( () => {
            this.setState({ selectedProvider: provider }, () => {
                this.updateFormFieldsForProvider(provider);
            });
        });
    }
    
    storeProviderData = (fieldName,value) => {
        const {selectedProvider} = this.state;
        
        var providerData = this.props.getProviderFormData(selectedProvider);

        providerData[fieldName] = value;

        this.props.updateProviderFormData(selectedProvider, providerData);
    }

    setLowPriority = () => {
        const { paymentProviders } = this.props;

        if( Validator.isNotEmpty(paymentProviders) ){
            var providersData = this.props.getAllProviderFormData();

            providersData = Object.keys(paymentProviders).map((provider) => {
                var providerData = providersData[provider] || {};

                providerData["priority"] = 0;

                return providerData;
            });

            this.props.storeProviderFormData(providersData);
            
        }
    }

    updateFormFieldsForProvider = (provider) => {
        const {formFields} = this.state;
     
        var providerData = this.props.getProviderFormData(provider);

        if( Validator.isNotEmpty(providerData) ){
            Object.keys(providerData).forEach((fieldName) => {
                if(formFields[fieldName]){
                    formFields[fieldName].value = providerData[fieldName];
                }
            });

            formFields["providerId"].value = provider;
        
            this.setState({formFields});
        }
    }

    /**
     * To change other providers priority if current provider have high priority
     * 
     * @param {*} priority 
     * @param {*} activeProvider 
     * @returns 
     */
    changeProvidersPriority = (priority, activeProvider) => {

        // check if low priority
        if(priority == 0){
            return;
        }
        
        var providerData = this.props.getAllProviderFormData();
     
        // update low priority if high priority choose
        if( Validator.isNotEmpty(providerData) ){
            Object.values(providerData)
                .filter((provider) => activeProvider != provider)
                .forEach((provider) => (provider.priority = 0));

            this.props.storeProviderFormData(providerData);
        }
    }

    render = () => html.apply(this);
}

export default (Provider);
