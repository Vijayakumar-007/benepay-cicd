import React from 'react';
import CardTypeAccordion from '../accordion';

export function html() {

    const {
        onboardStatusOptions, 
        currencyList
    } = this.state;
    
    const { cardType, getCardTypeData, paymentProviders } = this.props;
    
    return (
        <div>
            {paymentProviders.map((provider,index) => (
                <CardTypeAccordion 
                    key={index} 
                    provider={provider}
                    onboardStatusOptions={onboardStatusOptions}
                    currencyList={currencyList}
                    cardType={cardType}
                    storeProviderValues={this.storeProviderValues}
                    getCardTypeData={getCardTypeData}/>
            ))}
        </div>
    );
};



