import React, { Component } from 'react';
import { html } from "./index.html";
import Validator from 'service/core/validator';
import { ProviderNotes } from 'config/constants';
import { DashboardService } from 'service/api/dashboard.service';
import { toast } from 'react-toastify';

export default class PaymentProvider extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedProvider: "1", // tab key managed with string type
            paymentProviders: props.paymentProviders || [],
            formFields: this.prepareField(this.fieldNames, this.rules),
            providerData: {},
            activeProviderEnabled: false,
            openInactivePopup: false,
            disableInactivePopupConfirmBtn: false,
            isMerchantActive: props.merchantActiveStatus == 1 ? true : false,
            merchantParameterList: props.merchantParameterList || [],
            providerParameter: [],
            parameterValueIsModified: false,
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

    componentDidUpdate(prevProps, prevState) {
        // check if payment providers data loaded to update providers list
        if (this.props.paymentProviders !== prevProps.paymentProviders) {
            this.setState({ paymentProviders: this.props.paymentProviders });
        }

        // check if stored provider data loaded to update the provider form
        if (this.props.providerFormData !== prevProps.providerFormData) {
            this.setupProviderViewByData(this.props.providerFormData);
        }

        // check if provider is activated to initiate the update callback
        if (this.state.activeProviderEnabled !== prevState.activeProviderEnabled) {
            this.props.updateProviderEnabled(this.state.activeProviderEnabled);
            
        }

        //Clear the form
        if (this.props.resetFormFields !== prevProps.resetFormFields) {
            this.props.resetClearFormFlag();
            this.resetProvider();
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

            if (fieldName == "priority") {
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

            this.setState({ formFields: fields }, () => {
                this.storeProviderData(fieldName, value);
            });
        }
    }

    /**
     * Handle process when change the payment provider
     * 
     * @param {*} event 
     * @param {*} selectedProvider 
     */
    handleProviderChange = (event, selectedProvider) => {
        this.resetForm().then(() => {

            const { paymentProviders } = this.state;

            const data = paymentProviders.find(provider => provider.paymentProviderId === selectedProvider);

            // check if selectedProvider exists and extract the checked status
            const activeProviderEnabled = (data && data.checked) ? data.checked : false;

            this.setState({ selectedProvider, activeProviderEnabled }, () => {
                this.updateFormFieldsForProvider(selectedProvider);

                // update the parent when provider change
                this.props.updateActiveProviderId(this.state.selectedProvider);
            });            
        });
    }

    /**
     * Handle process when activate the payment provider
     * 
     * @param {*} providerId 
     */
    handleActivateProvider = (event, providerId) => {
        var { paymentProviders, activeProviderEnabled, openInactivePopup } = this.state;
        var value = event.target.checked;

        if (value) {
            paymentProviders = paymentProviders.map(provider => {
                if (providerId == provider.paymentProviderId) {
                    provider.checked = !provider.checked;
                    activeProviderEnabled = provider.checked;
                }

                return provider;
            });
        }
        else {
            openInactivePopup = true;
        }

        this.setState({ paymentProviders, activeProviderEnabled, openInactivePopup }, () => this.props.updateActiveProviderId(providerId));
    }

    /**
     * Update the field value for payment provider 
     * 
     * @param {*} fieldName 
     * @param {*} value 
     */
    storeProviderData = (fieldName, value) => {
        const { selectedProvider } = this.state;

        var providerData = this.props.getProviderFormData(selectedProvider);

        providerData[fieldName] = value;
        providerData["providerId"] = selectedProvider;

        this.props.updateProviderFormData(selectedProvider, providerData);
    }

    /**
     * Update the form fields from payment provider callback data
     * 
     * @param {*} provider 
     */
    updateFormFieldsForProvider = (provider) => {
        const { formFields } = this.state;

        var providerData = this.props.getProviderFormData(provider);

        if (Validator.isNotEmpty(providerData)) {
            Object.keys(providerData).forEach((fieldName) => {
                if (formFields[fieldName]) {
                    formFields[fieldName].value = providerData[fieldName];
                }
            });

            formFields["providerId"].value = provider;

            this.setState({ formFields });
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
        // if (priority == 0) {
        //     return;
        // }

        var providerData = this.props.getAllProviderFormData();

        // update low priority if high priority choose
        if (Validator.isNotEmpty(providerData)) {
            Object.values(providerData)
                .filter((provider) => activeProvider == provider)
                .forEach((provider) => (provider.priority = priority));

            this.props.setProviderFormData(providerData);
        }
    }

    /**
     * When component initiate render
     * Update the state fields to enable properties based on the provider data
     * 
     * @param {*} providerData 
     */
    setupProviderViewByData = (providerData) => {
        var { paymentProviders } = this.props;
        var { activeProviderEnabled, selectedProvider } = this.state;

        const baseData = Object.values(providerData);

        paymentProviders = paymentProviders.map(provider => {
            var filteredData = baseData.find(data => data.providerId === provider.paymentProviderId);

            if (filteredData && filteredData.providerId === provider.paymentProviderId) {
                provider.checked = true;
            }

            return provider;
        });

        // Check if paymentProviders is not empty to access top provider
        const topProvider = baseData.length > 0 ? baseData[0] : null;

        // enable the properties based on the data
        selectedProvider = topProvider ? topProvider.providerId : false;
        activeProviderEnabled = topProvider ? true : false;

        this.setState({ paymentProviders, activeProviderEnabled, selectedProvider });

        // update the parent when provider change
        this.props.updateActiveProviderId(selectedProvider);

        this.updateFormFieldsForProvider(selectedProvider);
    }

    //Clear provider form and payment method form
    resetProvider = () => {
        this.resetForm();

        const newData = this.state.paymentProviders.map(item => ({
            ...item,
            checked: item.checked !== undefined ? false : undefined
        }));

        this.setState({ paymentProviders: newData, selectedProvider: "1" });
    }

    //Delete the deselected payment providers and methods
    inactivateProvider = () => {
        const { selectedProvider } = this.state;
        this.setState({ disableInactivePopupConfirmBtn: true });

        this.props.inactivateProviderAndMethod(selectedProvider).then((result) => {
            if (result) {
                this.resetForm();
                this.props.resetProvider(selectedProvider);

                this.setState({ openInactivePopup: false, disableInactivePopupConfirmBtn: false });
            } else {
                this.setState({ disableInactivePopupConfirmBtn: false });
            }
        });
    }

    // Function to retrieve the notes based on the payment provider name
    getProviderMessages = (selectedProvider) => {
        switch (selectedProvider) {
            case "1":
                return ProviderNotes.finaroNotes;
            case "2":
                return ProviderNotes.pagLocalNotes;
            case "3":
                return ProviderNotes.nttNotes;
            default:
                return "Currently instruction not provided for this payment provider";
        }
    };

    render = () => html.apply(this);
}