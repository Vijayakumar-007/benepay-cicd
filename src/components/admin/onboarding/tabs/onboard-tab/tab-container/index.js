import React, { Component } from 'react';
import { html } from "./index.html";
import { DashboardService } from 'service/api/dashboard.service';
import { LookupKeys, OnboardConstants, messages } from 'config/constants';
import { toast } from 'react-toastify';

/**
 * Main widget for onboard tab component 
 */
class OnboardTab extends Component {

    constructor(props) {
        super(props);

        this.state = {
            merchantId: props.merchantId,

            // default dataset
            paymentProviders: [],
            paymentMethods: [],
            onboardStatusOptions: [],
            currencyList: [],
            settlementCurrency: '',

            providerEnabled: false,
            activeProviderId: '',
            providerFormData: {},
            paymentMethodFormData: {},
            openActivatePopup: false,
            openDeletePopup: false,
            loading: false,

            resetFormFields: false,
            openErrorActivatePopop:false,
            errorMessage:'',
            paymentMethodInvalid:false,
            merchantActiveStatus:this.props.merchantActiveStatus,

            merchantParameterList: [],
            flagSaveProviderParameters:false,
        }
    }

    componentDidMount = () => {
        this.getProviders(this.state.merchantId);
        this.getPaymentMethods();
        this.getSettlementCurrency();
        this.getOnboardingStatusList();
        this.getCurrencyList();
    }

    componentDidUpdate = (prevProps, prevState) => {
        // fetch the data from API after payment providers loaded
        if (prevState.paymentProviders !== this.state.paymentProviders) {
            this.fetchOnboardData();
        }

        this.handlePropsEvent();
    }

    //Please don't comment or remove any lines in the method
    //!Be careful if you make any change in the componentDidUpdate
    handlePropsEvent = () => {
        if (this.props.saveOnBoard) {
            //Give a parameter of tab index
            this.props.saveMerchantOnboardingCallback(OnboardConstants.onboardTabVal);

            this.frameSubmissionData();
        }

        if (this.props.activateMerchant) {
            this.props.activateMerchantCallBack();

            this.setState({ openActivatePopup: true });
        }

        if (this.props.deleteOnboardOTD) {
            //Give a parameter of tab index
            this.props.obdeleteCallback(OnboardConstants.onboardTabVal);

            this.setState({ openDeletePopup: true });
        }
    }

    resetFlags = (flagName) =>{
        switch (flagName) {
            case "flagSaveProviderParameters":
                this.setState({flagSaveProviderParameters : false});
                break;
        
            default:
                console.log("Flags are n't matched");
                break;
        }
    }

    /**
     * Collect the list of payment providers data
     */
    getProviders = (merchantId) => {
        try {
            if(merchantId != null && merchantId != ''){
                DashboardService.getProviders(merchantId).then((result) => {
                    if (result && result.paymentProviders) {
                        this.setState({ paymentProviders: result.paymentProviders });
                    }
                }); 
            }else{
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
     * Collect the list of payment methods data
     */
    getPaymentMethods = () => {
        this.setState({ loading: true });

        DashboardService.getLookupDetails("cardType").then((result) => {
            if (result && result.lookupDetails.length > 0) {
                var paymentMethods = result.lookupDetails;

                // convert the code value datatype string to integer
                paymentMethods.forEach((lookupData, index) => {
                    lookupData.lookupCode = parseInt(lookupData.lookupCode);
                    paymentMethods[index] = lookupData;
                });

                this.setState({ paymentMethods: paymentMethods, loading: false })
            } else {
                this.setState({ loading: false });
            }
        });
    }

    /**
     * Collect the selected settlement currency value
     * 
     * @param {*} merchantId 
     */
    getSettlementCurrency = async () => {

        if (this.state.merchantId) {
            DashboardService.fetchMerchantBasicDetails(this.state.merchantId).then((res) => {
                if (res && res.merchantBasicDetails && res.merchantBasicDetails.length > 0) {
                    var data = res.merchantBasicDetails[0];

                    if (data && data.settlementCcy) {
                        this.setState({ settlementCurrency: data.settlementCcy });
                    }
                }
            });
        }
    }

    /**
     * Collect the currency list
     */
    getCurrencyList = async () => {
        this.setState({ loading: true });

        DashboardService.getLookupDetails(LookupKeys.currency).then((result) => {
            var currencies = [];

            if (result && result.lookupDetails && result.lookupDetails.length > 0) {
                currencies = result.lookupDetails.map((data) => {
                    return data.lookupCode;
                });
            }

            this.setState({ currencyList: currencies, loading: false })
        });
    }

    /**
     * Collect the onboarding status list
     */
    getOnboardingStatusList = async () => {
        this.setState({ loading: true });

        DashboardService.getLookupDetails(LookupKeys.onboardingStatus).then((result) => {
            if (result && result.lookupDetails && result.lookupDetails.length > 0) {
                this.setState({ onboardStatusOptions: result.lookupDetails, loading: false })
            } else {
                this.setState({ loading: false });
            }
        });
    }

    /**
     * Collect the stored payment providers and payment methods data using API 
     */
    fetchOnboardData = async () => {
        if (this.state.merchantId) {
            this.setState({ loading: true });

            const reqData = { merchantId: this.state.merchantId }

            const res = await DashboardService.fetchMerchantOnboarding(reqData);

            if(res == undefined){
                this.setState({loading:false});
                return;
            }
            
            if (res && (res.cardTypes && res.cardTypes.length > 0) || (res.paymentProviders && res.paymentProviders.length > 0)) {
                //Method handle the delete and clear button show/hide
                this.props.resetBtnConfigFlag(OnboardConstants.onboardTabVal);

                const paymentMethodFormData = this.framePaymentMethodFormData(res.cardTypes);

                var providersData = [];

                if (res.paymentProviders && res.paymentProviders.length > 0) {
                    providersData = this.frameProviderFormData(res.paymentProviders);
                }

                this.setState({
                    paymentMethodFormData,
                    providerFormData: providersData,
                    loading: false
                });
            } else {
                this.setState({ loading: false });
            }
        }
    }

    /**
     * save overall onboard tab data 
     * including payment provider and payment method
     * 
     * @param {*} data 
     */
    savePaymentProvidersData = async (data) => {

        this.setState({ loading: true });

        const requestData = {
            merchantId: this.props.merchantId,
            cardTypeProviders: [...data],
            paymentProviders: Object.values(this.state.providerFormData),
        };

        const response = await DashboardService.saveMerchantOnboarding(requestData);

        this.setState({ loading: false });

        if (response && response !== undefined) {
            //Method handle the delete and clear button show/hide
            this.props.resetBtnConfigFlag(OnboardConstants.onboardTabVal);

            toast.success(response.message);

            this.setState({flagSaveProviderParameters: true});
        } else {

        }
    }

    /**
     * Delete the tab content
     */
    deleteOnboardData = async () => {
        this.setState({ loading: true });

        if (this.state.merchantId) {
            DashboardService.deleteOnboardTabDetails(this.state.merchantId).then((res) => {
                if (res && res.message) {
                    this.clearProviders();
                    this.setState({ openDeletePopup: false, loading: false }, () => {
                        toast.success(res.message);
                    });
                }
            });

        } else {
            this.setState({ openDeletePopup: false, loading: false }, () => {
                toast.error("Unable to delete");
            });
        }
    }

    /**
     * inactivate the payment provider and payment method
     * 
     * @param {*} providerId 
     * @param {*} paymentMethod 
     * @returns 
     */
    inactivateProviderAndMethod = async ( providerId, paymentMethod = null ) => {
        this.setState({ loading: true });

        var request = {
            merchantId: this.state.merchantId,
            providerId: providerId,
        }

        if(paymentMethod != null){
            request["paymentMethodId"] = paymentMethod;
        }

        var response = await DashboardService.inactivateMerchantProvider(request);

        this.setState({ loading: false });

        if( response.statusCode == 200 ){
            toast.success(response.message);
            return true;
        }
        else{
            toast.error(response.message);
        }

        return false;
    }
    
    /**
     * Populate the form data from stored payment provider received from API
     * 
     * @param {*} data 
     * @returns 
     */
    frameProviderFormData = (data) => {
        const framedData = {};

        data.forEach((item) => {
            if (!framedData[item.providerId]) {
                framedData[item.providerId] = {};
            }

            framedData[item.providerId] = item;
        });

        return framedData;
    }

    /**
     * Populate the form data from stored payment method received from API
     * 
     * @param {*} data 
     * @returns 
     */
    framePaymentMethodFormData = (data) => {
        const framedData = {};

        data.forEach((item) => {
            const paymentMethod = item.cardType;
            const providerId = item.providerId;

            if (!framedData[providerId]) {
                framedData[providerId] = {};
            }

            const { providerMerchantId, settlementsDetailsCommon, ...providerData } = item;

            framedData[providerId][paymentMethod] = {
                ...providerData,
                formValid: true
            };
        });

        return framedData;
    }

    /**
     * Frame final submission data set
     */
    frameSubmissionData = () => {
        try {
            var priorityHighCount = 0;
            var priorityReused = 0;
            var priorityBucket = [];
            Object.values(this.state.providerFormData).forEach((v,i) => {
                if(v.priority == 1 ){
                    priorityHighCount = 1;
                }

                if( priorityBucket.includes(v.priority) ){
                    priorityReused = 1;
                }
                
                priorityBucket.push(v.priority);


            });

            if (priorityHighCount !== 1) {
                throw new Error("Make sure only one payment provider should be high priority. Please make sure the priority.");
            }

            if (priorityReused === 1) {
                throw new Error("Make sure assigning payment provider priority should be unique. Please make sure the same priority assigned to other payment provider.");
            }

            const finalOnboardData = Object.keys(this.state.paymentMethodFormData).map(providerId => {
                const data = this.state.paymentMethodFormData[providerId];

                return Object.keys(data).map(paymentMethod => {
                    const providerData = data[paymentMethod];

                    const { formValid, formInValid,...filteredData } = providerData;

                    // Check if the form is valid
                    if (!formValid) {
                        this.setState({paymentMethodInvalid:true});

                        throw new Error("Make sure form must be valid before submit");
                    }

                    return { ...filteredData, providerId, cardType: paymentMethod };
                });
            }).flat();
            
            this.savePaymentProvidersData(finalOnboardData);
        } catch (error) {
            if (error.message.includes("Make sure")) {
                toast.error(`${error.message}`);
            } else {
                console.error("Unable to save the onboard data!");
                console.error(error);
            }
        }
    }

    /**
     * Get the form data for all provider
     * 
     * @returns 
     */
    getAllProviderFormData = () => {
        return this.state.providerFormData;
    }

    /**
     * Get the form data for provider
     * 
     * @param {*} provider 
     * @returns 
     */
    getProviderFormData = (provider) => {
        return this.state.providerFormData[provider] || {};
    }

    /**
     * Store the all provider form data in state
     * 
     * @param {*} providerFormData 
     */
    setProviderFormData = (providerFormData) => {
        this.setState({ providerFormData: providerFormData });
    }

    /**
     * Callback to set provider activate status from payment provider widget 
     */
    updateProviderEnabled = (enabled) => {
        this.setState({ providerEnabled: enabled });
    }

    /**
     * Callback to set provider activate status from payment provider widget 
     */
    updatePaymentMethodInvalid = (providerId, paymentMethod, valid) => {

        if( providerId == "" ){
            return;    
        }

        var paymentMethodInvalid = this.state.paymentMethodInvalid;

        // paymentMethodInvalid[providerId] = paymentMethodInvalid[providerId] || {};
        // paymentMethodInvalid[providerId][paymentMethod] = valid;

        this.setState({ paymentMethodInvalid: false });
    }

    /**
     * Callback to set active provider id
     */
    updateActiveProviderId = (activeProviderId) => {
        this.setState({ activeProviderId: activeProviderId });
    }

    /**
     * Update the form data for the provider
     * 
     * @param {*} provider 
     * @param {*} providerData 
     */
    updateProviderFormData = (provider, providerData) => {
        const providerFormData = this.state.providerFormData;

        providerFormData[provider] = providerData;

        this.setState({ providerFormData });
    }

    /**
     * Store the payment method data for the provider id
     * 
     * @param {*} providerId 
     * @param {*} paymentMethod 
     * @param {*} formData 
     */
    setPaymentMethodFormData = (providerId, paymentMethod, fieldName, value) => {
        const paymentMethodFormData = this.state.paymentMethodFormData;

        // get provider data
        paymentMethodFormData[providerId] = paymentMethodFormData[providerId] || {};

        // get payment method data
        paymentMethodFormData[providerId][paymentMethod] = paymentMethodFormData[providerId][paymentMethod] || {};

        // assign the value to the incoming field
        paymentMethodFormData[providerId][paymentMethod][fieldName] = value;

        this.setState({ paymentMethodFormData });
    }

    /**
     * update the payment method data for the provider id
     * 
     * @param {*} providerId 
     * @param {*} paymentMethod 
     * @param {*} formData 
     */
    updatePaymentMethodFormData = (providerId, paymentMethod, data) => {
        const paymentMethodFormData = this.state.paymentMethodFormData;

        // get provider data
        paymentMethodFormData[providerId] = paymentMethodFormData[providerId] || {};

        if( paymentMethod != null ) {
            // get payment method data
            paymentMethodFormData[providerId][paymentMethod] = paymentMethodFormData[providerId][paymentMethod] || {};

            // assign the value to the incoming field
            paymentMethodFormData[providerId][paymentMethod] = data;
        } else {
            paymentMethodFormData[providerId] = data;
        }

        this.setState({ paymentMethodFormData });
    }

    /**
     * Collect the payment method data for the provider id
     * 
     * @param {*} providerId 
     * @param {*} paymentMethod 
     * @returns 
     */
    getPaymentMethodFormData = (providerId, paymentMethod) => {
        const paymentMethodData = this.state.paymentMethodFormData;

        // Check if paymentMethodData is defined
        if (paymentMethodData) {

            if (paymentMethodData.hasOwnProperty(providerId)) {
                const providerData = paymentMethodData[providerId];

                if (providerData && providerData.hasOwnProperty(paymentMethod)) {
                    return providerData[paymentMethod];
                }
            }
        }

        return {};
    }

    /**
     * Collect the all the payment methods data of payment provider
     * 
     * @param {*} providerId 
     * @returns 
     */
    getAllPaymentMethodFormData = (providerId) => {
        const paymentMethodData = this.state.paymentMethodFormData;

        // Check if paymentMethodData is defined
        if (paymentMethodData) {
            if (paymentMethodData.hasOwnProperty(providerId)) {
                return paymentMethodData[providerId];
            }
        }

        return {};
    }

    activateMerchant = async () => {
        this.setState({ loading: true, ActMhtconfirmBtnDisable:true });
        if (this.state.merchantId) {
           await this.frameSubmissionData();
            const res = await DashboardService.activateMerchantDetails(this.state.merchantId);
            if (res.statusCode == '200') {
                
                this.setState({ openActivatePopup: false, loading: false, ActMhtconfirmBtnDisable: false }, () => {
                    this.navigateToMerchantSummary();

                    setTimeout(() => {
                        toast.success(res.message);
                    }, 500);
                });
            }else{
                this.setState({ loading: false, ActMhtconfirmBtnDisable:false });
                var splittedMessages = res.message.split('.');
                this.setState({ openErrorActivatePopop: true ,
                    errorMessage: res.message ? splittedMessages : 'Unable To Activate Merchant. Please Check The Provided Data'}, () => {
                   
                });
            }
        } else {
            this.setState({ openActivatePopup: false, ActMhtconfirmBtnDisable:false }, () => {
                toast.error("Unable To Activate Merchant");
            });
        }
    }

    resetProvider = (providerId) => {
        var { paymentProviders, paymentMethods } = this.state;

        this.updateProviderFormData(providerId, {});
        this.updatePaymentMethodFormData(providerId, null, {});

        paymentProviders = this.state.paymentProviders.map(paymentprovider => ({
            ...paymentprovider,
            checked: (providerId == paymentprovider.paymentProviderId) ? false : (paymentprovider.checked) ? paymentprovider.checked : false
        }));

        paymentMethods = this.state.paymentMethods.map(paymentMethod => ({
            ...paymentMethod,
            checked: false
        }));

        this.setState({ paymentProviders, paymentMethods });
    }

    //Clear the provider form fields
    clearProviders = () => {
        console.log("this.state.providerFormData", this.state.providerFormData);
        this.setState({ resetFormFields: true, providerFormData : {}, paymentMethodFormData : {}, });
    }

    //reset the clear form field flag
    resetClearFormFlag = () => {
        this.setState({ resetFormFields: false });
    }

    //Redirect to merchant summary
    navigateToMerchantSummary = () => {
        this.props.history.push("/merchants");
    };
    
    render = () => html.apply(this);
}

export default (OnboardTab);