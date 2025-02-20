export const StorageKeys = {
    clientJwt: 'clientJwt',
    userEmail: 'userEmail',
    merachantActive: 'mactive',
    loggedInMerchantID:'loggedInMerchantID',
    privilege: "privilege",
    selectedMerchantId:'selectedMerchantId',
    merchantId:'merchantId',
    autoReqTrans:'autoReqTrans',
    merchantTxnMode:'merchantTxnMode',
    merchantName:'merchantName',
    partialPaymentAllowedForMerchant:'partialPaymentAllowedForMerchant',
};

export const USER_TYPE = {
    MERCHANT_USER: "Merchant User",
    ADMIN_USER: "Admin User"
}

export class StorageService {
    static get(key) {
        return sessionStorage.getItem(key);
    }
    static set(key, value) {
        sessionStorage.setItem(key, value);
    }
    static getObj(key) {
        return JSON.parse(sessionStorage.getItem(key));
    }
    static setObj(key, value) {
        sessionStorage.setItem(key, JSON.stringify(value));
    }
    static getBool(key) {
        return JSON.parse(sessionStorage.getItem(key));
    }
    // static setBool(key, value) {
    //     sessionStorage.setItem(key, value);
    // }
    static getPerm(key) {
        let item = localStorage.getItem(key);
        try {
           return JSON.parse(item);
        } catch (e) {
            return item;
        }
    }
    static setPerm(key, value) {
        if (typeof value === 'string') {
            localStorage.setItem(key, value);
        } else {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }
    static delete(key) {
        sessionStorage.removeItem(key);
    }
    static clearAll() {
        sessionStorage.clear();
    }
    static clearAllLocalStorage(){
        localStorage.clear();
    }
    static clearAllTempStorage(){
        TempStorage.loggedInUser = null;
        TempStorage.authToken = null;
        TempStorage.checkout = null;
        TempStorage.claimedCurrency = null;
        TempStorage.claimedCountry  = null;
        TempStorage.beneficiary = null;
        TempStorage.fields = null;
        TempStorage.payments = null;
        TempStorage.tempGrpupId = null;
        TempStorage.isPaymentMultiple = null;
        TempStorage.totalAmount = null;
        TempStorage.device = null;
        TempStorage.loginUserRole = null;
    }
}

export class TempStorage {
    static loggedInUser = {};
    static authToken = '';
    static checkout = {
        paymentSelected: false,
        beneficiaryDetailsEntered: false,
    };
    static claimedCurrency = "";
    static claimedCountry = "";
    static beneficiary = {
        claimedCCY: '',
        claimedCountry: '',
        claimedCountryCD: '',
        claimedCurrencyCD: '',
        residenceAddress: ''
    };
    static fields = [];
    static payments = {};
    static tempGrpupId = null;
    static isPaymentMultiple = false;
    static totalAmount = 0;
    static device = 'xs';
    static loginUserRole = null;
}
