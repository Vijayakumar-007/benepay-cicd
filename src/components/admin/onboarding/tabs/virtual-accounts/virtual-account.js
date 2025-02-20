import React from 'react';
import { DashboardService } from 'service/api/dashboard.service';
import { html } from './virtual-account.html';
import { OnboardConstants } from 'config/constants';
import { BenepayUserService } from 'service/api/benepay-user.service';
import FormValidationService from 'service/core/validate.service';
import { toast } from 'react-toastify';
import Utils from 'service/core/utils';

/**
 * VirtualAccount component for managing virtual accounts.
 * 
 * @extends React.Component
 */
class VirtualAccount extends React.Component {

    fieldNames = [
        'provider',
        'currency',
        'accountType',
        'accountName',
        'bankName',
        'bankAddress',
        'virtualAccounts',
    ];

    rules = {
        provider: [{validate: 'required'}],
        currency: [{validate: 'required'}],
        accountType: [{validate: 'required'}],
        accountName: [{validate: 'required'}],
        bankName: [{validate: 'required'}],
        bankAddress: [{validate: 'required'}],
    };

    /**
     * Creates an instance of VirtualAccount.
     * 
     * @param {Object} props - The properties passed to the component.
     */
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            loadingForFormSubmit: false,
            formFields: this.prepareFormFields(this.fieldNames, this.rules),
            providers: [],
            currencies: [],
            accountTypes: [],
            bankDetails: [],
            merchantId: this.props.merchantId,
            onchangedHappened:false
        };
    }

    /**
     * Method to assign basic field data 
     * 
     * @param fieldNames 
     * @param rules 
     * @returns 
     */
    prepareFormFields = (fieldNames, rules) => {
        const fields = {};

        fieldNames.forEach(fieldName => {
            let value = '';
            
            let fieldRules = rules[fieldName] || [];

            fields[fieldName] = {
                rules: fieldRules,
                value: value,
                errors: []
            }; 
        });

        fields['virtualAccounts'] = [];

        return fields;
    }

    /**
     * Method to update the particular field in the form
     * after the updation trigger the field validation
     * 
     * @param {*} fieldName 
     * @param {*} value 
     * @param {*} validate 
     */
    updateFormField = async (fieldName, value, validate = false, loading = false) => {
        let fields = this.state.formFields;
        let vName = fieldName.split('-')[0];
        let vaArrayIndex = fieldName.split('-')[1];

        if (vaArrayIndex) {
            // Clone the array to avoid direct mutation
            let vAccounts = [...fields.virtualAccounts];

            if (vaArrayIndex !== -1) {
                if (vName === "account") {
                    vAccounts[vaArrayIndex] = { ...vAccounts[vaArrayIndex], account: value };
                } else if (vName === "routing") {
                    vAccounts[vaArrayIndex] = { ...vAccounts[vaArrayIndex], routing: value };
                }

                fields.virtualAccounts = vAccounts;

                this.setState({ formFields: fields });
            }
        }
        else{
            if(fieldName == "accounts"){
                return;
            }

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
           
            const { errors, valid } = await FormValidationService.validate(field.rules, field.value, this.state.formFields);

            this.state.formFields[fieldName].errors = errors;

            if (!valid) {
                formValid = false;
            }

        };

        this.setState({ formFields: this.state.formFields });

        if( submit ){
            this.setState({loading: false});
        }

        return formValid;
    }

    /**
     * Lifecycle method called after the component is mounted.
     * Fetches providers and currencies.
     */
    componentDidMount() {
        this.fetchProviders();
        this.fetchCurrencies();
        this.fetchAccountTypes();
        this.fetchVirtualAccountDetails(null, null);
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.saveVA){
            this.props.saveCallback(OnboardConstants.virtualACTabVal);
            this.handleSubmit();
        }
    }

    /**
     * Fetches the list of providers and updates the state.
     */
    fetchProviders = () => {
        this.setState({ loading : true  });

        DashboardService.getProviders(this.props.merchantId).then((response) => {
            const providers = response.paymentProviders
                                .filter((data) => data.transactionMode == 2)
                                .map((data) => data);
            
            this.setState({ providers, loading : false  });
        });
    };

    /**
     * Fetches the list of currencies from the DashboardService and updates the state.
     */
    fetchCurrencies = () => {
        this.setState({ loading : true });

        DashboardService.getLookupDetails('currency').then((response) => { 
            const currencies = response.lookupDetails.map((data) => data.lookupCode);
            this.setState({ currencies, loading : false });
        });
    };

    /**
     * Fetches the list of currencies from the DashboardService and updates the state.
     */
    fetchAccountTypes = () => {
        this.setState({ loading : true });

        DashboardService.getLookupDetails('bankAccountTypes').then((response) => {
            const accountTypes = response.lookupDetails.map((data) => data);
            this.setState({ accountTypes, loading : false });
        });
    };

    /**
     * Fetches the list of providers and updates the state.
     */
    fetchVirtualAccountDetails = (providerId, currency) => {
        this.setState({ loading: true });

        BenepayUserService.getVirtualAccounts(this.state.merchantId, Utils.setNullIfEmpty(providerId), Utils.setNullIfEmpty(currency)).then((response) => {

            // Assuming the response contains the bankDetails with virtualAccounts
            const bankDetails = response ? response.bankDetails || [] : [];
            
            // Update the state with bankDetails
            this.setState({
                bankDetails,
                loading: false
            }, () => {
                // After bankDetails is updated, you can call fillFormDataBasedOnIndex for the first provider (index 0)
                this.fillAccountFields(0); // Set the data for the first provider/currency by default
            });
        }).catch((error) => {
            console.error("Error fetching virtual accounts", error);
            this.setState({ loading: false });
        });
    };

    /**
     * Method to fill form data based on provider index.
     * @param {number} index - The index of the selected provider/currency.
     */
    fillAccountFields = (index) => {
        const bankDetails = this.state.bankDetails || [];
        const selectedBankDetail = bankDetails[index] || {};

        this.updateFormField('provider', selectedBankDetail.provider || '');
        this.updateFormField('currency', selectedBankDetail.currency || '');
        this.updateFormField('accountName', selectedBankDetail.accountname || '');
        this.updateFormField('bankName', selectedBankDetail.bankname || '');
        this.updateFormField('bankAddress', selectedBankDetail.bankaddress || '');
        this.updateFormField('accountType', selectedBankDetail.acctype || '');

        this.setState({ formFields: { ...this.state.formFields, ['virtualAccounts']: selectedBankDetail.virtualAccounts || [] } });
    };

    /**
     * Handles input change for form fields and updates the state.
     * 
     * @param {string} field - The field name to update.
     * @param {string} value - The new value for the field.
     */
    handleInputChange = async (field, value) => {
        await this.updateFormField(field, value, false, true);

        if(field == "provider"){
            if(this.state.onchangedHappened){
                this.fetchVirtualAccountDetails(value, this.state.formFields.currency.value);
                this.setState({onchangedHappened : false});
            }else{
                this.setState({onchangedHappened : true});
                this.fetchVirtualAccountDetails(value, null);
            }
        }

        if(field == "currency"){
            if(this.state.onchangedHappened){
                this.fetchVirtualAccountDetails(this.state.formFields.provider.value, value);
                this.setState({onchangedHappened : false});
            }else{
                this.setState({onchangedHappened : true});
                this.fetchVirtualAccountDetails(null, value);
            }
        }
    };

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
           
            const { errors, valid } = await FormValidationService.validate(field.rules, field.value, this.state.formFields);

            this.state.formFields[fieldName].errors = errors;

            if (!valid) {
                formValid = false;
            }

        };

        this.setState({ formFields: this.state.formFields });

        if( submit ){
            this.setState({loading: false});
        }

        return formValid;
    }

    /**
     * Handles form submission logic.
     */
    handleSubmit = () => {
        this.validateForm(true);
        
        try {
            this.setState({ loadingForFormSubmit: true });
            const formValue = this.state.formFields; 
            const bankDetails = this.state.bankDetails;

            const request ={
                provider : formValue.provider.value,
                currency : formValue.currency.value,
                merchantid : bankDetails && !Utils.isNullOrEmpty(bankDetails[0].merchantid) ? bankDetails[0].merchantid : this.state.merchantId,
                acctype : formValue.accountType.value,
                accountname : formValue.accountName.value,
                bankid : bankDetails && bankDetails[0].bankid != null ? bankDetails[0].bankid : null,
                bankname : formValue.bankName.value,
                bankaddress : formValue.bankAddress.value,
                virtualAccounts : formValue.virtualAccounts,
            };
            
            BenepayUserService.saveVirtualAccount(request).then((response) => {
                
                if(response && response.data && response.data.statusCode== 200){
                    toast.success(response.data.message);
                    this.setState({loadingForFormSubmit: false});
                }else{
                    toast.error(response.data.message);
                    this.setState({loadingForFormSubmit: false});
                }
                                
            }).catch((error) => {
                console.error("Error saving virtual accounts", error);
                this.setState({ loadingForFormSubmit: false });
            });
        } catch (error) {
            console.log(error);
        }
        
    };

    /**
     * Renders the component.
     * 
     * @returns {JSX.Element} The rendered component.
     */
    render = () => html.apply(this);
}

export default VirtualAccount;