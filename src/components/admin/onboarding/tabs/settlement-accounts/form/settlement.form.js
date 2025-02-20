import * as React from 'react';

//Html file
import { html } from 'components/admin/onboarding/tabs/settlement-accounts/form/settlement.form.html';

//Coponents
import { toast } from 'react-toastify';
import Utils from '../../../../../../service/core/utils';

//Constants
import { messages, OnboardConstants } from '../../../../../../config/constants';

//Service
import { DashboardService } from 'service/api/dashboard.service';
import { Auth } from 'aws-amplify';
import { StorageService } from 'service/core/storage.service';
import { StorageKeys } from 'service/core/storage.service';
import FormValidationService from 'service/core/validate.service';
import Validator from 'service/core/validator';

class SettlementForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            countryList: props.countryList,
            currencyList: [],
            bankAccountTypes: [],
            formFields: this.prepareField(this.fieldNames, this.rules),
            merchantId: props.merchantId,
            selectedSettlementDetail: {},
            openConfirmPopup:false,
            disableConfirmBtn:false,
            settlementAcList:props.settlementAcList,
        }
    }

    componentDidUpdate = (prevProps) => {
        try {
            if (prevProps.merchantId !== this.props.merchantId) {
                this.setState({ merchantId: this.props.merchantId });
            }

            if (prevProps.countryList !== this.props.countryList) {
                this.setState({ countryList: this.props.countryList });
            }

            if (prevProps.settlementAcList !== this.props.settlementAcList) {
                this.setState({ settlementAcList: this.props.settlementAcList });
            }
            
            // Check if updateSettlementDetail has changed
            if (this.props.flagForUpdateSettlement) {
                this.props.handleFlags('save');
                this.setState({ selectedSettlementDetail: this.props.updateSettlementDetail },
                    this.updateSettlement(this.props.updateSettlementDetail)
                );
            }

            // Check if updateSettlementDetail has changed
            if (this.props.flagForDeleteSettlement) {
                this.props.handleFlags("delete");
                this.setState({ 
                    selectedSettlementDetail: this.props.updateSettlementDetail,
                    openConfirmPopup:true,
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    componentDidMount = async () => {
        try {
            await Auth.currentSession().then(res => {
                let jwt = res["idToken"]["jwtToken"];
                StorageService.set(StorageKeys.clientJwt, jwt);
            });

            this.fetchCurrencyList();
            this.fetchAccountTypeList();
        } catch (error) {
            console.error(error);
        }
    }

    // form fields declaration
    fieldNames = [
        'country',
        'acCurrency',
        'bankAccountNumber',
        'accountName',
        'accountHolderName',
        'typeofAccount',
        'branchCode',
        'swiftBic',
        'nameOfBank',
        'branchName',
        'defaultAccount',
        'settlementId',
        'address1',
        'address2',
        'postCode',
        'city',
        'state',
    ];

    rules = {
        country: [{ validate: 'required' }],
        acCurrency: [{ validate: 'required' }],
        bankAccountNumber: [
            { validate: 'required' },
            { validate: 'numbersOnly' ,message: messages.accountNumberErrorMsg},
        ],
        accountName: [
            { validate: 'required' },
            // { validate: 'name', message: messages.nameContains },
            // { validate: 'startsWithAlphabet', message: messages.startsAlphabet },
            // { validate: 'symbolnorepeat', message: messages.symbolnorepeat },
        ],
        accountHolderName: [
            { validate: 'required' },
            // { validate: 'name', message: messages.nameContains },
            // { validate: 'startsWithAlphabet', message: messages.startsAlphabet },
            // { validate: 'symbolnorepeat', message: messages.symbolnorepeat },
        ],
        typeofAccount: [
            { validate: 'required' },
        ],
        branchCode: [{ validate: 'required' }],
        nameOfBank: [
            { validate: 'required' },
            // { validate: 'name', message: messages.nameContains },
            // { validate: 'startsWithAlphabet', message: messages.startsAlphabet },
            // { validate: 'symbolnorepeat', message: messages.symbolnorepeat },
        ],
        address1: [
            { validate: 'required' },
            { validate: 'symbolnorepeat', message: messages.symbolnorepeat },
        ],
        city: [
            { validate: 'required' },
            { validate: 'name', message: messages.nameContains },
            { validate: 'startsWithAlphabet', message: messages.startsAlphabet },
            { validate: 'symbolnorepeat', message: messages.symbolnorepeat },
        ],
        postCode: [
            { validate: 'required' },
            { validate: 'postalCode' },
        ],
    }

    /**
    * Fetch currency in lookup details
    */
    fetchCurrencyList = async () => {
        try {
            this.setState({ loading: true });
            const response = await DashboardService.getLookupDetails("currency");

            if (response && response.lookupDetails && response.lookupDetails.length > 0) {
                this.setState({ currencyList: response.lookupDetails, loading: false });
            } else {
                this.setState({ loading: false });
            }
        } catch (error) {
            console.error(error);
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

        this.setState({ formFields: this.state.formFields });

        return formValid;
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

    /**
     * Validate the Account name is unique
     * 
     * @param {*} value 
     */
    accountNameIsUnique = (value, fieldName) =>{
        if(value && this.state.settlementAcList.length > 0){
            const result  = Validator.valueIsUnique(value, this.state.settlementAcList, "accountName", this.state.selectedSettlementDetail.settlementId);

            if(!result){
                this.state.formFields[fieldName].errors = ["Account name is already used"];
                this.updateFormFields(this.state.formFields);
            }
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

            if (fieldName == "defaultAccount") {
                value = false;
            }
            if (fieldName == "settlementId") {
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
            formFields: this.prepareField(this.fieldNames, this.rules),
        });
    }

    //Close the settlement form
    closeStlForm = () => {
        try {
            this.props.closeForm();
            this.resetForm();
        } catch (error) {
            console.error(error);
        }
    }

    //Save and update the settlement account details.
    saveSettlementACDetails = async () => {
        try {
            let formValid = await this.validateForm();
            let mId = this.state.merchantId;

            if (formValid && mId) {
                this.setState({ loading: true });
                const formFields = this.state.formFields;

                var requestObj = {
                    settlementId: formFields.settlementId.value,
                    fkmerchantId: this.state.merchantId,
                    country: formFields.country.value,
                    settlementCurrency: formFields.acCurrency.value,
                    bankAccountNo: formFields.bankAccountNumber.value,
                    branchCode: formFields.branchCode.value,
                    swiftBic: Utils.setNullWhenEmpty(formFields.swiftBic.value),
                    nameOnAccount: formFields.accountHolderName.value,
                    accountType: formFields.typeofAccount.value,
                    bankName: formFields.nameOfBank.value,
                    bankBranch: Utils.setNullWhenEmpty(formFields.branchName.value),
                    address1: formFields.address1.value,
                    address2: Utils.setNullWhenEmpty(formFields.address2.value),
                    postCode: formFields.postCode.value,
                    city: formFields.city.value,
                    state: Utils.setNullWhenEmpty(formFields.state.value),
                    accountName: formFields.accountName.value,
                    primaryAccount: formFields.defaultAccount.value ? 1 : 0,
                };

                const response = await DashboardService.saveMerchantSettlement(requestObj);

                if (response && response.statusCode == 200 && response !== undefined) {
                    this.setState({ loading: false });
                    toast(response.message ? response.message : messages.defaultSuccessMsg, {
                        position: toast.POSITION.BOTTOM_CENTER,
                        className: "toast-message toast-success",
                    });

                    this.props.closeForm();
                    this.resetForm();
                }
                else {
                    this.setState({ loading: false });
                    toast(response.message ? response.message : messages.defaultErrorMsg, {
                        position: toast.POSITION.BOTTOM_CENTER,
                        className: "toast-message toast-error",
                    });
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    //Update the settlement form
    updateSettlement = (value) => {
        try {
            if (Object.keys(value).length > 0) {
                const formFields = this.state.formFields;
    
                formFields.settlementId.value = value.settlementId,
                formFields.country.value = value.country,
                formFields.acCurrency.value = value.settlementCurrency,
                formFields.bankAccountNumber.value =value.bankAccountNo,
                formFields.accountHolderName.value =value.nameOnAccount,
                formFields.typeofAccount.value =value.accountType,
                formFields.branchCode.value =value.branchCode,
                formFields.swiftBic.value =value.swiftBic,
                formFields.nameOfBank.value =value.bankName,
                formFields.branchName.value =value.bankBranch,
                formFields.address1.value =value.address1,
                formFields.address2.value =value.address2,
                formFields.city.value =value.city,
                formFields.state.value =value.state,
                formFields.postCode.value =value.postCode,
                formFields.accountName.value =value.accountName,
                formFields.defaultAccount.value =value.primaryAccount === 1 ? true : false,

                this.setState({ formFields: formFields });
                this.props.openForm();
            }
        } catch (error) {
            console.error(error);
        }
    }

    //Delete merchant settlement details
    deleteMerchantSettlement = async() =>{
        try {
            if(this.state.selectedSettlementDetail && this.state.selectedSettlementDetail.settlementId){
                this.setState({ disableConfirmBtn: true });

                const response = await DashboardService.inactiveMerchantSettlement(this.state.selectedSettlementDetail.settlementId);

                if(response && response != undefined && response != null && response.statusCode == 200){
                    this.props.fetchSettlementAcList();
                    console.log("deleteMerchantSettlement before", this.state.disableConfirmBtn, this.state.openConfirmPopup);
                    this.setState({ disableConfirmBtn: false, openConfirmPopup:false });
                    toast(response.message ? response.message : messages.defaultSuccessMsg, {
                        position: toast.POSITION.BOTTOM_CENTER,
                        className: "toast-message toast-success",
                    });
                }
                else{
                    this.setState({ disableConfirmBtn: false });
                    toast(response.message ? response.message : messages.defaultErrorMsg, {
                        position: toast.POSITION.BOTTOM_CENTER,
                        className: "toast-message toast-error",
                    });
                }
            }
        } catch (error) {
            console.log(error);
        }
        console.log("deleteMerchantSettlement after", this.state.disableConfirmBtn, this.state.openConfirmPopup);
    }

     /**
    * Fetch account types in lookup details
    */
     fetchAccountTypeList = async () => {
        try {
            this.setState({ loading: true });
            const response = await DashboardService.getLookupDetails("bankAccountTypes");
            if (response && response.lookupDetails && response.lookupDetails.length > 0) {
                this.setState({ bankAccountTypes: response.lookupDetails, loading: false });
            } else {
                this.setState({ loading: false });
            }
        } catch (error) {
            console.error(error);
        }
    }

    render = () => html.apply(this);
}

export default SettlementForm;