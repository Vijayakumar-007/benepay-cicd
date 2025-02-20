import React, { Component } from 'react';

import { html } from "./index.html";
import { DashboardService } from 'service/api/dashboard.service';

//Constants
import { LookupKeys, OnboardConstants } from 'config/constants';
import Validator from 'service/core/validator';

class CardTypeContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            onboardStatusOptions: [],
            currencyList: [],
            providers: [],
            providerValues:[],
            settlementCurrency: null,
        }
    }

    componentDidMount = async () => {
        console.log("this.props.merchantId",this.props.merchantId);
        this.getCurrencyList();
        this.getOnboardingStatusList();
        this.getSettlementCurrency(this.props.merchantId);
    }

    getSettlementCurrency = async (merchantId) => {
        if (merchantId) {
            const res = await DashboardService.fetchMerchantBasicDetails(merchantId);
            
            if(res && res.merchantBasicDetails && res.merchantBasicDetails.length > 0){
                var data = res.merchantBasicDetails[0];

                if (data && data.settlementCcy) {
                    this.setState({settlementCurrency:data.settlementCcy});
                }
            }
        }
    }

    getCurrencyList = async () => {
        this.setState({ loading: true });

        const result = await DashboardService.getLookupDetails(LookupKeys.currency);

        var currencies = [];

        if (result && result.lookupDetails && result.lookupDetails.length > 0) {
            currencies = result.lookupDetails.map((data) => {
                return data.lookupCode;
            });
        }

        this.setState({ currencyList: currencies, loading: false })
    }

    getOnboardingStatusList = async () => {
        this.setState({ loading: true });

        const result = await DashboardService.getLookupDetails(LookupKeys.onboardingStatus);

        if (result && result.lookupDetails && result.lookupDetails.length > 0) {
            this.setState({ onboardStatusOptions: result.lookupDetails, loading: false })
        } else {
            this.setState({ loading: false });
        }
    }

    storeProviderValues = (cardType,provider,fieldName,value) => {
        var providerValues = this.state.providerValues;
        
        if( !Validator.isNotEmpty(cardType) ){
            return;
        }
        
        if( !providerValues[provider] ){
            providerValues[provider] = {};
        }

        providerValues[provider][fieldName] = value;
        providerValues[provider]["cardType"] = cardType;
        providerValues[provider]["providerId"] = provider;

        this.props.storeCardTypeValue(cardType, providerValues);
        
        this.setState({providerValues:providerValues});
    }

    render = () => html.apply(this);
}

export default (CardTypeContainer);
