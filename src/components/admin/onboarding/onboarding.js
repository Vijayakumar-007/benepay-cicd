import * as React from 'react';
import { html } from './onboarding.html';
import { toast } from 'react-toastify';
import FormValidationService from '../../../service/core/validate.service';
import { DashboardService } from '../../../service/api/dashboard.service';
import Utils from '../../../service/core/utils';
import { Auth } from 'aws-amplify';
import { StorageService } from 'service/core/storage.service';
import { StorageKeys } from 'service/core/storage.service';

//Constants
import { OnboardConstants, manualPay, messages } from '../../../config/constants';
import { forEach } from 'lodash';
import { BenepayUserService } from 'service/api/benepay-user.service';

/**
 * @author Ragavan
 * 
 * Class handle the all screens of onboarding
 */

class Onboarding extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            self: '',
            isApiCalled: false,
            formFields: this.prepareField(this.fieldNames, this.rules),
            selectedTab: OnboardConstants.basicDetailsTabVal,
            // selectedTab: OnboardConstants.revenueTabVal,
            editedRowIndex: null,
            saveBasicDetails: false,
            saveMerchantLogo: false,
            saveServicePreference: false,
            saveNotification: false,
            saveOnboard: false,
            deleteMerchantLogo: false,
            getBDPreValue: false,
            getLogo: false,
            getNotificationPreValue: false,
            deleteServiceAndPreference: false,
            deleteNotificationDetails: false,
            getOnboardingPreValue: false,
            activateMerchant: false,
            deleteOnboardDetails: false,
            merchanBDSaveStatus: false,
            finalButtonConfig: {},
            showBDDeleteBtn: false,
            showSPDeleteBtn: false,
            showNotificationDeleteBtn: false,
            showProviderDeleteBtn: false,
            showLogoDeleteBtn: false,
            merchantActiveStatus:0,
            selectedMerchantType:0,
            transactionModeBothSelected: false,
        };
    }

    fieldNames = [
        'merchantId',
    ];

    rules = {
        merchantId: [
            { validate: 'required' },
            { validate: 'numAndAlphabetsOnly' },
            { validate: 'maxLength', maxLength: 15, message : 'Please enter fewer than 16 characters' },
        ],     
    }

    componentDidMount =async () => {
        await Auth.currentSession().then(res => {
            let jwt = res["idToken"]["jwtToken"];
            StorageService.set(StorageKeys.clientJwt, jwt);
        });

        if (this.props.match.params && this.props.match.params.merchantId) {
            var decryptedMerchantId = Utils.decrypt(this.props.match.params.merchantId);

            this.updateFormField("merchantId", decryptedMerchantId, false);
            this.setState({ getBDPreValue: true, merchanBDSaveStatus: true }, () =>{
                this.fetchMerchantDetails();
            });
        }

        this.generateAndSetButtonConfig();
        this.getMerchantInfo();
    }

    /**
     * Fetch the merchat info and show or hide the virtual A/C tab
     * If manual payment is enable show the tab otherwise hide it.
     * 
     * @returns 
     */
    getMerchantInfo = async () =>{
        try {
            const result = await BenepayUserService.getMerchants();

            if (!result) {
              return;
            }

            if (result.data && result.data.merchantSummary){
                let merchantsList = result.data.merchantSummary;
                
                let selectedMerchant = merchantsList.find((data) => data.merchantId == this.state.formFields.merchantId.value);
                console.log("----", selectedMerchant);
                if(selectedMerchant){
                    this.setState({transactionModeBothSelected : selectedMerchant.merchantTxnMode == manualPay.transactionModeManual || selectedMerchant.merchantTxnMode == manualPay.transactionModeBoth ? true : false });
                }
            }
        } catch (error) {
            console.log(error);
            
        }
    }


    fetchMerchantDetails = async () => {
        let merchantId = this.state.formFields.merchantId.value;

        if (merchantId) {
            this.setState({ loading: true });

            const res = await DashboardService.fetchMerchantBasicDetails(merchantId);
            
            if (res && res.merchantBasicDetails.length > 0) {
                this.setState({merchantActiveStatus: res.merchantBasicDetails[0].activeStatus});
            }

            this.setState({ loading: false });
        }
    }

    handleSaveClick = (rowIndex) => {
        this.setState({
            editedRowIndex: null,
        });

        if (this.state.selectedTab == OnboardConstants.onboardTabVal) {
            this.setState({
                saveOnboard: true
            });
        }

        if (this.state.selectedTab == OnboardConstants.virtualACTabVal) {
            this.setState({
                saveVA: true
            });
        }
    };


    /**
     * Method handle to the Next button click event
     * After the save The tab automaticaly changed to the next tab
     * @param {*} event 
     * @param {*} newValue 
     */
    handleTabChange = (event, newValue) => {

        this.setState({ selectedTab: newValue });

        switch (newValue) {
            case OnboardConstants.basicDetailsTabVal:
                this.setState({ getBDPreValue: true });
                // this.handleMerchantTypeChange('0');
                break;

            case OnboardConstants.logoTabVal:
                this.setState({ getLogo: true });
                break;

            case OnboardConstants.spTabVal:
                this.setState({ getServiceAndPrefePreValue: true });
                break;

            case OnboardConstants.notificationsTabVal:
                this.setState({ getNotificationPreValue: true });
                break;
            case OnboardConstants.settlementTabVal:
                // this.setState({ getNotificationPreValue: true });
                this.generateAndSetButtonConfig();
                break;

            case OnboardConstants.onboardTabVal:
                this.setState({ getOnboardingPreValue: true });
                break;

            default:
                console.info("handleTabChange: No matching case found");
                break;
        }
    };

    /**
     * Methode handle to the Back button click event and call the child components
     * When click come in the previous tab
     * And also call the previous tab fetch method
     */
    handleBackClick = () => {
        const previousTabIndex = this.changeTab(this.state.selectedTab, "previous");

        this.setState({
            selectedTab: previousTabIndex,
        });

        switch (previousTabIndex) {
            case OnboardConstants.basicDetailsTabVal:
                this.setState({ getBDPreValue: true });
                break;

            case OnboardConstants.logoTabVal:
                this.setState({ getLogo: true });
                break;

            case OnboardConstants.spTabVal:
                this.setState({ getServiceAndPrefePreValue: true });
                break;

            case OnboardConstants.notificationsTabVal:
                this.setState({ getNotificationPreValue: true });
                break;
                
            case OnboardConstants.settlementTabVal:
                break;

            case OnboardConstants.onboardTabVal:
                this.setState({ getOnboardingPreValue: true });
                break;

            default:
                console.info("handleBackClick: No matching case found");
                break;
        }
    };

    /**
     * Method handle to reset the flags
     * @param {*} v 
     */
    getPreValueCallback = (v) => {
        switch (v) {
            case OnboardConstants.basicDetailsTabVal:
                this.setState({ getBDPreValue: false });
                break;

            case OnboardConstants.logoTabVal:
                this.setState({ getLogo: false });
                break;

            case OnboardConstants.spTabVal:
                this.setState({ getServiceAndPrefePreValue: false });
                break;

            case OnboardConstants.notificationsTabVal:
                this.setState({ getNotificationPreValue: false });
                break;

                case OnboardConstants.onboardTabVal:
                    this.setState({ getOnboardingPreValue: false });
                    break;

            default:
                console.info("getPreValueCallback: No matching case found");
                break;
        }
    }

    /**
     * Method call the clear methos directly in all child components
     */
    handleClearClick = () => {
        const ref = this[`refTo${this.state.selectedTab}`];

        if (ref) {
            if (ref.handleClear) {
                ref.handleClear();
            }
            else if (ref.clearProviders) {
                ref.clearProviders();
            }
            else if (ref.clearNotificationValues) {
                ref.clearNotificationValues();
            }
            else if (ref.clearPreferenceValues) {
                ref.clearPreferenceValues();
            }
            else if (ref.clearBDFormValues) {
                ref.clearBDFormValues();
                this.updateFormField("merchantId", "");
            }
        } else {
            console.error("Ref to" + `${this.state.selectedTab}` + "is not available.");
        }
    };

    /**
     * Triggering delete functions in the child components
     */
    handleDeleteClick = () => {
        switch (this.state.selectedTab) {
            case OnboardConstants.basicDetailsTabVal:
                this.setState({ deleteMerchantBD: true });
                break;

            case OnboardConstants.logoTabVal:
                this.setState({ deleteMerchantLogo: true });
                break;

            case OnboardConstants.spTabVal:
                this.setState({ deleteServiceAndPreference: true });
                break;

            case OnboardConstants.notificationsTabVal:
                this.setState({ deleteMerchantND: true });
                break;

            case OnboardConstants.onboardTabVal:
                this.setState({ deleteOnboardDetails: true });
                break;

            default:
                console.info("HandleDeleteClick : there is no case are matched");
                break;
        }
    };

    /**
     * Method reset the delete method flags
     * @param {*} v 
     */
    deleteCallBack = (v) => {
        switch (v) {
            case OnboardConstants.basicDetailsTabVal:
                this.setState({ deleteMerchantBD: false });
                break;

            case OnboardConstants.logoTabVal:
                this.setState({ deleteMerchantLogo: false });
                break;

            case OnboardConstants.spTabVal:
                this.setState({ deleteServiceAndPreference: false });
                break;

            case OnboardConstants.notificationsTabVal:
                this.setState({ deleteMerchantND: false });
                break;

            case OnboardConstants.onboardTabVal:
                this.setState({ deleteOnboardDetails: false });
                break;

            default:
                console.info("DeleteCallBack there is no case are matched");
                break;
        }
    }

    handleSkipClick = () => {
        const nextTabIndex = this.changeTab(this.state.selectedTab, "next");

        this.setState({
            selectedTab: nextTabIndex,
        }, () => this.handleTabChange(null, nextTabIndex));
    };

    //Method handle the next button click event
    handleNextClick = async () => {
        const { selectedTab } = this.state;

        switch (selectedTab) {
            case OnboardConstants.basicDetailsTabVal:
                let formValid = await this.validateForm();
                const formFields = this.state.formFields;
                this.setState({
                    saveBasicDetails: true,
                    merchantId: formValid ? formFields.merchantId.value : null,
                });
                break;

            case OnboardConstants.logoTabVal:
                this.setState({
                    saveMerchantLogo: true
                }); 
                break;

            case OnboardConstants.spTabVal:
                this.setState({
                    saveServicePreference: true
                });
                break;

            case OnboardConstants.virtualACTabVal:
                let nextTabValue = this.changeTab(selectedTab, 'next');
                this.setState({ selectedTab: nextTabValue });
                break;

            case OnboardConstants.notificationsTabVal:
                this.setState({
                    saveNotification: true
                });
                break;

            case OnboardConstants.settlementTabVal:
                this.handleSaveTabChange();
                break;

            default:
                console.info("handleNextClick: No matching case found");
                break;
        }
    };


    handleActivateClick = async () => {
        this.setState({
            activateMerchant: true,
        });
    }

    activateCallBack = () => {
        this.setState({
            activateMerchant: false,
        });
    }

    /**
     * Method is handle to tab changing functionally
     * @param {Current Tab value} tabValue 
     * @param {next or previous} type 
     * @returns 
     */
    changeTab = (tabValue, type) => {

        var tabVal = [];
        if(parseInt(this.state.selectedMerchantType) == '4'){
            tabVal = [
                OnboardConstants.basicDetailsTabVal,
                OnboardConstants.logoTabVal,
                OnboardConstants.settlementTabVal
            ];
        }else{
            tabVal = [
                OnboardConstants.basicDetailsTabVal,
                OnboardConstants.logoTabVal,
                OnboardConstants.spTabVal,
                OnboardConstants.notificationsTabVal,
                OnboardConstants.settlementTabVal,
                OnboardConstants.virtualACTabVal,
                OnboardConstants.onboardTabVal
            ];
        }

        const currentIndex = tabVal.indexOf(tabValue);

        if (currentIndex !== -1) {
            if (type === 'next' && currentIndex < tabVal.length - 1) {
                return tabVal[currentIndex + 1];
            } else if (type === 'previous' && currentIndex > 0) {
                return tabVal[currentIndex - 1];
            }
        }

        return tabValue;
    };

    generateButtonConfig = () => {
        const nextButton =  { label: 'Next', onClick: this.handleNextClick };
        const backButton = { label: 'Back', onClick: this.handleBackClick };
        const skipButton =  { label: 'Skip', onClick: this.handleSkipClick };
        const clearButton = { label: 'Clear', onClick: this.handleClearClick };
        const deleteButton = { label: 'Delete', onClick: this.handleDeleteClick };

        // Conditionally hide/show clearButton based on the flags
        const basicDetailsDCButtons = this.state.showBDDeleteBtn ? deleteButton : clearButton;
        // const logoDCButtons = this.state.showLogoDeleteBtn ? deleteButton : clearButton;
        const spDCButtons = this.state.showSPDeleteBtn ? deleteButton : clearButton;
        const notificationDCButtons = this.state.showNotificationDeleteBtn ? deleteButton : clearButton;
        const providerDCButtons = this.state.showProviderDeleteBtn ? deleteButton : clearButton;

        //Hide the active merchant button if merchant is active
        const MActiveButton = this.state.merchantActiveStatus !== 1 ? { label: 'Activate Merchant', onClick: this.handleActivateClick } : '';

        //Hide the next button in settlement screen  if selected merchant is referral partner 
        const settleNextButton =  parseInt(this.state.selectedMerchantType) == '4' ? ' ': { label: 'Next', onClick: this.handleNextClick };

        const saveButton = { label: 'Save', onClick: this.handleSaveClick };

        const buttonConfig = {
            "basicDetails": [
                nextButton,
                basicDetailsDCButtons,
            ],
            "logo": [
                backButton,
                clearButton,
                deleteButton,
                skipButton,
                nextButton,
            ],
            "servicesAndPreferences": [
                backButton,
                spDCButtons,
                skipButton,
                nextButton,
            ],
            "notifications": [
                backButton,
                notificationDCButtons,
                skipButton,
                nextButton,
            ],
            "settlement": [
                backButton,
                settleNextButton,
            ],
            "virtualAccount": [
                backButton,
                saveButton,
                nextButton,
            ],
            "onboarding": [
                backButton,
                { label: 'Save', onClick: this.handleSaveClick },
                providerDCButtons,
                MActiveButton,
            ],
        };

        return buttonConfig;
    }

    generateAndSetButtonConfig = () => {
        const finalButtonConfig = this.generateButtonConfig();
        this.setState({ finalButtonConfig });
    }

    /**
     * Method reset the save method flags
     */
    saveCallback = (v) => {
        switch (v) {
            case OnboardConstants.basicDetailsTabVal:
                this.setState({ saveBasicDetails: false });
                break;

            case OnboardConstants.logoTabVal:
                this.setState({ saveMerchantLogo: false });
                break;

            case OnboardConstants.spTabVal:
                this.setState({ saveServicePreference: false });
                break;

            case OnboardConstants.notificationsTabVal:
                this.setState({ saveNotification: false });
                break;

            case OnboardConstants.onboardTabVal:
                this.setState({ saveOnboard: false });
                break;

            case OnboardConstants.virtualACTabVal:
                this.setState({ saveVA: false });
                break;

            default:
                console.info("saveCallback: No matching case found");
                break;
        }
    }

    /**
     * Method is handle the save methods API response
     * And show the messages if the date saved or not
     * @param {*} res 
     */
    saveResponse = (res) => {
        console.log("saveResponse", res);

        if (res.merchanIdForAfterSave && res.merchanIdForAfterSave !== '') {
            this.setState(
                { merchanBDSaveStatus: true },
                () => {
                    this.updateFormField("merchantId", res.merchanIdForAfterSave, false);
                }
            );
        }

        switch (true) {
            case res.basicDetailsFormSave:
                res.message ? this.handleSaveTabChange(messages.bdSaveSuccess) : this.handleSaveTabChange();
                break;

            case res.logoUpload:
                res.message ? this.handleSaveTabChange(messages.logSaveSuccess) : this.handleSaveTabChange();
                break;

            case res.deleteLogo:
                toast.success(res.deleteLogo ? messages.logDeleteSuccess : messages.logDeleteError);
                break;

            case res.saveSP:
                res.messages ? this.handleSaveTabChange(messages.spSaveSuccess) : this.handleSaveTabChange();
                break;

            case res.saveNtn === true:
                this.handleSaveTabChange(messages.ntnSaveSuccess);
                break;

            case res.saveNtn === 'changeTab':
                const nextTabIndex = this.changeTab(this.state.selectedTab, "next");
                this.setState({ selectedTab: nextTabIndex });
                break;

            case res.onBoardingFormSave:
                toast.success(messages.onboardSaveSuccess);
                break;

            default:
                if (!(res.merchanIdForAfterSave && res.merchanIdForAfterSave !== '')) {
                    toast.error(messages.unableToSave);
                }
                break;
        }
    }

    /**
     * Handle to change tab without showing any message
     * @param {*} successMessage 
     * @param {*} triggerTabChange 
     */
    handleSaveTabChange = (successMessage = "") => {
        const nextTabIndex = this.changeTab(this.state.selectedTab, "next");

        this.setState({ selectedTab: nextTabIndex }, () => {
            this.handleTabChange(null, this.state.selectedTab);

            if (successMessage) {
                setTimeout(() => {
                    toast.success(successMessage);
                }, 100);
            }
        });
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

            fields[fieldName] = {
                rules: rules[fieldName] || [],
                value: value,
                errors: []
            };
        });

        return fields;
    }
    
    /**
      * Method to update rules only
      * 
      * @param fieldNames 
      * @param rules 
      * @returns 
      */
    updateFieldRule = (fieldNames, rules) => {
        const prevFormValues = this.state.formFields;
        const fields = {};

        fieldNames.forEach(fieldName => {
            let value =''
            if(fieldName == "merchantId"){
                value =prevFormValues.merchantId.value ? prevFormValues.merchantId.value : '' 
            }
            fields[fieldName] = {
                rules: rules[fieldName] || [],
                value: value ,
                errors: []
            };
        });

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
      * update the each fields in the form
      * after the updation trigger the field validation
      * 
      * @param {*} formFields 
      */
    updateFormFields = async (formFields, validate = true) => {
        await this.setState({ formFields: formFields });
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
     * Method to refresh the form fields
     */
    resetForm = async () => {
        this.setState({
            formFields: this.prepareField(this.fieldNames, this.rules),
        });
    }

    /**
     * Method validate the merchant id is unique
     * @returns 
     */
    validateMerchantIdIsUnique = async () => {
        var mId = this.state.formFields.merchantId.value;

        if (mId !== '' && mId !== null && mId !== undefined) {
            var requestObj = { merchantId: mId }
            const response = await DashboardService.validateMerchantId(requestObj);

            if (!response.merchantIdValid) {
                this.state.formFields.merchantId.errors = [response.message];

                this.updateFormFields(this.state.formFields);
            }
        }
    }

    resetBtnConfigFlag = (flagName) => {
        switch (flagName) {
            case OnboardConstants.basicDetailsTabVal:
                this.setState({ showBDDeleteBtn: true });
                break;

            case OnboardConstants.logoTabVal:
                this.setState({ showLogoDeleteBtn: true });
                break;

            case OnboardConstants.spTabVal:
                this.setState({ showSPDeleteBtn: true });
                break;

            case OnboardConstants.notificationsTabVal:
                this.setState({ showNotificationDeleteBtn: true });
                break;

            case OnboardConstants.onboardTabVal:
                this.setState({ showProviderDeleteBtn: true });
                break;
                console.log("selectedMerchantType", selectedMerchantType);

            default:
                console.info("resetBtnConfigFlag: No matching case found");
                break;
        }

        this.generateAndSetButtonConfig();
    }

    handleMerchantTypeChange = (selectedMerchantType) => {
        if(selectedMerchantType){
            this.setState({ selectedMerchantType });

        }
        if(selectedMerchantType == "4"){
            this.rules={
                merchantId: [
                    { validate: 'required' },
                    { validate: 'numAndAlphabetsOnly' },
                    { validate: 'maxLength', maxLength: 13, message: 'Please enter fewer than 14 characters'}
                ],
            }

            this.setState({formFields: this.updateFieldRule(this.fieldNames, this.rules)});
        }else{
            this.rules={
                merchantId: [
                    { validate: 'required' },
                    { validate: 'numAndAlphabetsOnly' },
                    { validate: 'maxLength', maxLength: 15, message: 'Please enter fewer than 16 characters'}
                ],
            }

            this.setState({formFields: this.updateFieldRule(this.fieldNames, this.rules)});
        }

    }

    handleTransactionModeChange = (transactionModeBothSelected) => {
        this.setState({ transactionModeBothSelected });
    }
    
    render = () => html.apply(this);
}

export default Onboarding;
