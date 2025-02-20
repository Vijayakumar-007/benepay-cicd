import React, { Component } from 'react';
import { html } from "./onboard-tab.html";
import { DashboardService } from 'service/api/dashboard.service';
import { toast } from 'react-toastify';
import { OnboardConstants } from 'config/constants';

class OnboardTab extends Component {

    INITIATED = "initiated";
    INPROGRESS = "inprogress";
    DONE = "done";

    constructor(props) {
        super(props);

        this.state = {
            value: 0,
            selectedTab: 1,
            previousCardType: "0",
            loading: false,
            save: '',
            checkedValues: [],
            callPaymentGatwaySaveMethod: false,
            callPaymentGatwayFetchMethod: false,
            merchantId: null,
            cardTypesList: [],
            fetch: '',
            cardType: 1,
            callFetchMethod: false,
            openActivatepopup: false,
            openBDdeletepopup: false,
            triggeringDelete: false,
            flagForactivateMerchant: '',
            deleteOTD: '',
            showGrid: props.showGrid,
            cardProviders:{},
            paymentProviders:[],
            providerFormData:[]
        }
    }

    componentDidMount = () => {
        if (this.props.merchantId) {
            this.setState({ merchantId: this.props.merchantId });
        }

        this.getCardTypes().then(() => {
            this.fetchOnboardData();
        });
        this.getProviders()
    }

    componentDidUpdate = () => {
        this.handleStage();
    }

    //Please don't comment or remove any lines in the method
    //!Be careful if you make any change in the componentDidUpdate
    handleStage = () => {
        if (this.props.saveOnBoard) {
            //Give a parameter of tab index
            this.props.saveMerchantOnboardingCallback(OnboardConstants.onboardTabVal);
            
            this.frameSubmissionData();
        }

        if (this.props.getValue) {
            //Give a parameter of tab index
            this.props.getPreValueCallback(OnboardConstants.onboardTabVal);

            // This callback is executed after the state is updated
            // this.fetchOnboardData();

        }

        if (this.props.activateMerchant) {
            this.props.activateMerchantCallBack();

            this.setState({ openActivatepopup: true });
        }

        if (this.props.deleteOnboardOTD) {
            //Give a parameter of tab index
            this.props.obdeleteCallback(OnboardConstants.onboardTabVal);

            this.setState({ openBDdeletepopup: true });
        }
    }

    handleTabChange = (event, newValue) => {
        this.setState({ selectedTab: newValue, cardType: newValue });
    };

    //@refactor change the name to resetDeleteAction
    deleteCallback = () => {
        this.setState({ triggeringDelete: false });
    }

    handleCardOnChange = (selectedCardType) => {
        var cardTypes = this.state.cardTypesList;

        cardTypes.forEach((cardType,index) => {
            if( selectedCardType == cardType.lookupCode ){
                cardType.checked = !cardType.checked; 
            }

            cardTypes[index] = cardType;
        });
        
        this.setState({ cardTypesList: cardTypes });
    }

    getProviders = async () => {
        const result = await DashboardService.getProviders();
        
        if( result && result.paymentProviders ){
            this.setState({paymentProviders:result.paymentProviders});
        }
    }

    getCardTypes = async () => {
        this.setState({ loading: true });

        const result = await DashboardService.getLookupDetails("cardType");

        if (result && result.lookupDetails.length > 0) {

            var cardTypes = result.lookupDetails;

            // convert the card type datatype string to integer
            cardTypes.forEach((lookupData, i) => {
                lookupData.lookupCode = parseInt(lookupData.lookupCode);
                cardTypes[i] = lookupData;
            });

            this.setState({ cardTypesList: cardTypes, loading: false })
        } else {
            this.setState({ loading: false });
        }

    }

    resetCardTypes = () => {
        this.setState({ checkedValues: [] });
    }

    activateMerchant = async () => {
        if (this.state.merchantId) {
            const res = await DashboardService.activateMerchantDetails(this.state.merchantId);

            if (res.message) {
                this.setState({ openActivatepopup: false }, () => {
                    toast.success(res.message);
                    setTimeout(() => {
                        this.props.showGrid();
                    }, 1000);

                });
            }
        } else {
            this.setState({ openActivatepopup: false }, () => {
                toast.error("Unable To Activate Merchant");
            });
        }
    }

    deleteOTD = async () => {
        if (this.state.merchantId) {
            const res = await DashboardService.deleteOnboardTabDetails(this.state.merchantId);

            if (res.message) {
                this.setState({ openBDdeletepopup: false }, () => {
                    toast.success(res.message);
                    this.setState({ triggeringDelete: true });
                });
            }
        } else {
            this.setState({ openBDdeletepopup: false }, () => {
                toast.error("Unable to delete");
            });
        }
    }

    storeCardTypeValue = ( cardType, providerValues ) => {
        this.state.cardProviders[cardType] = providerValues;
        
        this.setState({cardProviders:this.state.cardProviders});
    }

    updateProviderFormData = ( provider, providerData ) => {
        const { providerFormData } = this.state;

        providerFormData[provider] = providerData;
        
        this.setState({providerFormData});
    }

    storeProviderFormData = ( providerFormData ) => {
        this.setState({providerFormData});
    }

    getCardTypeData = ( cardType ) => {
        return this.state.cardProviders[cardType] || {};
    }

    getProviderFormData = ( provider ) => {
        return this.state.providerFormData[provider] || {};
    }

    getAllProviderFormData = () => {
        return this.state.providerFormData;
    }

    savePaymentProvidersData = async (data) => {
        this.setState({ loading: true });

        const requestData = {
            merchantId: this.props.merchantId,
            cardTypeProviders: [...data],
            paymentProviders: [...this.state.providerFormData],
        };

        const response = await DashboardService.saveMerchantOnboarding(requestData);

        this.setState({ loading: false });

        if (response && response !== undefined) {
            console.log(response);
        } else {
            
        }
    }
    
    fetchOnboardData = async () => {
        if (this.state.merchantId) {
            this.setState({ loading: true });

            const reqData = { merchantId: this.state.merchantId }

            const res = await DashboardService.fetchMerchantOnboarding(reqData);

            if (res && res.cardTypes && res.cardTypes.length > 0) {
                const { selectedCT, cardProviders } = this.frameCardTypeFormData(res.cardTypes);

                var providersData = [];

                if( res.paymentProviders && res.paymentProviders.length > 0 ){
                    providersData = this.frameProviderFormData(res.paymentProviders);
                }

                var cardTypes = this.state.cardTypesList;

                cardTypes.forEach((cardType,index) => {
                    if( selectedCT.includes(cardType.lookupCode.toString()) ){
                        cardType.checked = true; 
                    } else {
                        cardType.checked = false;
                    }

                    cardTypes[index] = cardType;
                });

                this.setState({ 
                    cardTypesList: cardTypes, 
                    cardProviders: cardProviders, 
                    providerFormData: providersData, 
                    loading: false
                });
            } else {
                this.setState({ loading: false });
            }
        }
    }

    frameSubmissionData = () => {
        try {
            const finalOnboardData = Object.keys(this.state.cardProviders).map(cardType => {
                const cardData = this.state.cardProviders[cardType];

                return Object.keys(cardData).map( providerId => {
                    const providerData = cardData[providerId];

                    const { providerEnabled, formValid, providerExpand, ...filteredData } = providerData;

                    // Check if the form is valid
                    if (!formValid) {
                        throw new Error("Make sure form must be valid before submit");
                    }

                    return { ...filteredData, providerId, cardType  };
                });
            }).flat();
            
            this.savePaymentProvidersData(finalOnboardData);
        } catch (error) {
            if (error.message.includes("form must be valid")) {
                toast.error(`${error.message}`);
            } else {
                console.error("Unable to save the onboard data!");
                console.error(error);
            }
        }
    }

    frameCardTypeFormData = (data) => {
        const framedData = {};
        const cardTypes = [];

        data.forEach((item) => {
            const cardType = item.cardType;
            const providerId = item.providerId;
            
            if (!cardTypes.includes(cardType)) {
                cardTypes.push(cardType);
            }

            if (!framedData[cardType]) {
                framedData[cardType] = {};
            }

            const { providerMerchantId, settlementsDetailsCommon, ...providerData } = item;

            framedData[cardType][providerId] = {
                "providerEnabled": true,
                ...providerData
            };
        });
        
        return { selectedCT: cardTypes, cardProviders:framedData };
    }
    
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

    render = () => html.apply(this);
}

export default (OnboardTab);
