import React from 'react';
import ZynoPayLogo from '../../../assets/images/zynopay.png';

export const MerchantName = (props) => {
    const { merchantName, type } = props
    if (type === "text") {
        if (merchantName.toString().toLowerCase().startsWith('zynopay')) {
            return merchantName.split('zynopay')[1].slice(1);
        }
        return merchantName;
    }
    return getMerchantLogo(merchantName)
}


const getMerchantLogo = (merchantName) => {
    if (merchantName.toString().toLowerCase().startsWith('zynopay')) {
        return <img src={ZynoPayLogo} />
    }
    return <p style={{fontSize:'28px'}} className={'ml-5 bene-pay mb-0'}>Benepay</p>
}