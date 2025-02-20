import { urls, adminUrls } from "../../config/urlConfig";
import { HTTP } from "../core/http.service";

export class DashboardService {

    static getPrivileges = async () => {

        const result = await HTTP.get(urls.getPrivileges);

        if (result && result.data) {
            return result.data;
        }
        return undefined;
    };

    static getMerchantPreferences = async () => {

        const result = await HTTP.get(urls.getMerchantPreferences);

        if (result && result.data) {
            return result.data;
        }
        return undefined;
    };

    static getPaymentSearchResult = async (req) => {
        const result = await HTTP.post(urls.getPaymentSearchList, req);

        if (result && result.data) {
            return result.data;
        }
        return undefined;
    };

    static getRefundList = async (req) => {
        const result = await HTTP.post(urls.getRefundList, req);

        if (result && result.data) {
            return result.data;
        }
        return undefined;
    };


    static initiateRefund = async (req, transactionId) => {
        console.log("transactionId", transactionId)
        const result = await HTTP.post(urls.initiateRefund + `${transactionId}` + `/refund`, req);

        if (result && result.data) {
            return result.data;
        }
        return undefined;
    };


    static getRejectedPaymentSearchResult = async (req) => {
        const result = await HTTP.post(urls.getRejectedPaymentSearchList, req);

        if (result && result.data) {
            return result.data;
        }
        return undefined;
    };

    static getCurrencies = async () => {

        const result = await HTTP.get(urls.getCurrencies);

        if (result && result.data) {
            return result.data;
        }
        return undefined;
    };

    static downloadTransactionsReport = async (searchObj, requestType) => {
        const result = await HTTP.post(requestType === 'report' ? urls.export : urls.downlaodSettlement, searchObj);
        if (result && result.data) {
            return result.data;
        }
        return undefined;
    }

    static getAllFailedTransactions = async (request) => {
        const result = await HTTP.post(urls.searchFailedPayments, request);
        
        if (result && result.data) {
            return result.data;
        }
        return undefined;
    }

    static getUserInfo = async () => {
        const result = await HTTP.get(urls.userInfo);
        if (result && result.data) {
            return result.data;
        }
        return undefined;
    }

    static cancelPayment = async (request) => {
        const result = await HTTP.post(urls.cancelPayment, request);
        if (result && result.data) {
            return result.data;
        }
        return undefined;

    }

    static downloadFailedTransactionsReport = async (searchObj) => {
        const result = await HTTP.post(urls.downloadFailedTransactionsReport, searchObj);
        if (result && result.data) {
            return result.data;
        }
        return undefined;
    }

    static getSettlementReportResult = async (req) => {
        const result = await HTTP.post(urls.getSettlementReportResult, req)
        if (result && result.status == 200) {
            return result;
        }
        return undefined;
    }

    static sendPaymentReminder = async (transactionId) => {
        let url = `${urls.sendPaymentReminder}/${transactionId}`;
        const result = await HTTP.get(url)
        if (result && result.status == 200) {
            return result;
        }
        return undefined;
    }

    static downloadSettlementReport = async (fileId) => {
        const url = `${urls.downloadSettlementReport}/${fileId}`
        const result = await HTTP.get(url)
        if (result && result.status == 200) {
            return result;
        }
        return undefined;
    }

    static getRefundDetails = async (transactionId) => {
        const result = await HTTP.get(urls.getRefundDetails + `${transactionId}`)
        
        return result;
    }

    static getPaymentDetails = async (paymentId) => {
        const result = await HTTP.get(urls.paymentDetails + `${paymentId}`);

        if (result && result.data) {
            return result.data;
        }

        return undefined;
    }

    static getMerchantSummaryList = async () => {
        const result = await HTTP.get(adminUrls.getMerchants);

        if (result && result.data) {
            return result.data;
        }
        return undefined;
    }
  
    static getUserDetails = async () => {
        const result = await HTTP.get(urls.getUserDetails);
        
        if (result.data) {
            return result.data;
            
        }
        return undefined;
    }

    static getMerchantMessages = async () => {
        const result = await HTTP.get(urls.fetchMerchantBroadcast);
        
        if (result.data) {
            return result.data;
        }
        return undefined;
    }

    static getLookupDetails = async (lookupName) => {
        const result = await HTTP.get(adminUrls.getLookupDetails + `${lookupName}`);

        if (result.data) {
            return result.data;
        }
        return undefined;
    }

    static saveMerchantBasicDetails = async (req) => {
        const result = await HTTP.post(adminUrls.saveMerchantBasicDetails, req);

        if (result.data) {
            return result.data;
        }
        return undefined;
    }

    static saveMerchantSettlement = async (req) => {
        const result = await HTTP.post(adminUrls.saveMerchantSettlement, req);

        if (result.data) {
            return result.data;
        }
        return undefined;
    }

    static inactiveMerchantSettlement = async (settlementId) => {
        const result = await HTTP.post(adminUrls.inactiveMerchantSettlement + settlementId);

        if (result.data) {
            return result.data;
        }
        return undefined;
    }

    static getMerchantSettlement = async (mId) => {
        const result = await HTTP.get(adminUrls.getMerchantSettlement + `${mId}`);

        if (result.data) {
            return result.data;
        }
        return undefined;
    }

    static saveMerchantLogo = async (req) => {
        const result = await HTTP.post(adminUrls.saveMerchantLogo, req);

        if (result.data) {
            return result.data;
        }
        return undefined;
    }

    static saveMerchantServicepref = async (req) => {
        const result = await HTTP.post(adminUrls.saveMerchantServicepref, req);

        if (result.data) {
            return result.data;
        }
        return undefined;
    }

    static saveMerchantNotifications = async (req) => {
        const result = await HTTP.post(adminUrls.saveMerchantNotification, req);

        if (result.data) {
            return result.data;
        }
        return undefined;
    }

    static saveMerchantOnboarding = async (req) => {
        const result = await HTTP.post(adminUrls.saveMerchantOnboarding, req);

        if (result.data) {
            return result.data;
        }
        return undefined;
    }

    static fetchMerchantBasicDetails = async (mId) => {
        const result = await HTTP.get(adminUrls.fetchMerchantBasicDetails + `${mId}`);

        if (result.data) {
            return result.data;

        }
        return undefined;
    }

    static fetchMerchantOnboardPrefe = async (mId) => {
        const result = await HTTP.get(adminUrls.fetchOnboardPreferences + `${mId}`);

        if (result.data) {
            return result.data;
        }
        return undefined;
    }

    static fetchNotifications = async (mId) => {
        const result = await HTTP.get(adminUrls.fetchNotifications + `${mId}`);

        if (result.data) {
            return result.data;
        }
        return undefined;
    }

    static fetchMerchantOnboarding = async (req) => {
        const result = await HTTP.post(adminUrls.fetchMerchantOnboarding, req);

        if (result.data) {
            return result.data;
        }
        return undefined;
    }

    static validateMerchantId = async (req) => {
        const result = await HTTP.post(adminUrls.validateMerchantId, req);

        if (result.data) {
            return result.data;
        }
        return undefined;
    }

    static deleteMerchantBasicDetails = async (merchantId) => {

        const result = await HTTP.post(`${adminUrls.deleteBasicDetails}/${merchantId}`);

        if (result.data) {
            return result.data;
        }
        return undefined;
    }

    static deleteOnboardPreference = async (merchantId) => {

        const result = await HTTP.post(`${adminUrls.deleteOnboardPreference}/${merchantId}`)

        if (result.data) {
            return result.data;
        }
        return undefined;
    }

    static deleteNotificationDetails = async (merchantId) => {

        const result = await HTTP.post(`${adminUrls.deleteNotificationDetails}/${merchantId}`)

        if (result.data) {
            return result.data;
        }
        return undefined;
    }

    static deleteOnboardTabDetails = async (merchantId) => {

        const result = await HTTP.post(`${adminUrls.deleteOnboardTabDetails}/${merchantId}`)

        if (result.data) {
            return result.data;
        }
        return undefined;
    }

    static inactivateMerchantProvider = async (req) => {

        const result = await HTTP.post(`${adminUrls.inactivateMerchantProvider}`, req)

        if (result.data) {
            return result.data;
        }
        
        return undefined;
    }

    static updateMerchantBroadcast = async (messageId) => {
        const result = await HTTP.post(urls.updateMerchantBroadcast + `${messageId}`)
        if (result.data) {
            return result.data;
        }
        return undefined;
    }

    static getActivitySummary = async () => {
        const result = await HTTP.get(urls.getActivitySummary);

        if (result && result.data) {
            return result.data.activity;
        }
        return undefined;
    };
    
    static getAgeingSummary = async () => {
        const result = await HTTP.get(urls.getAgingSummary);

        if (result && result.data) {
            return result.data;
        }
        return undefined;
    };

    static getConversionSummary = async () => {
        const result = await HTTP.get(urls.getConversionSummary);

        if (result && result.data) {
            return result.data;
        }
        return undefined;
    };

    static getSettlement30days = async () => {
        const result = await HTTP.get(urls.getSettlement30days);

        if (result && result.data) {
            return result.data;
        }
        return undefined;
    };

    static getSettlement1year = async () => {
        const result = await HTTP.get(urls.getSettlement1year);

        if (result && result.data) {
            return result.data;
        }
        return undefined;
    };

    static getExpirySummary = async () => {
        const result = await HTTP.get(urls.getExpirySummary);

        if (result && result.data) {
            return result.data;
        }
        return undefined;
    };

    static getDemographySummary = async () => {
        const result = await HTTP.get(urls.getDemographySummary);

        if (result && result.data) {
            return result.data.demography;
        }
        return undefined;
    };

    static getMethodSummary = async () => {
        const result = await HTTP.get(urls.getMethodSummary);

        if (result && result.data) {
            return result.data.methods;
        }
        return undefined;
    };
    
    static getMerchantProfileData = async () => {
        const result = await HTTP.get(urls.getMerchantProfileData);

        if (result.data) {
            return result.data;
        }
        return undefined;
    }
    static fetchCurrencyDecimals = async () => {
        const url = `${urls.currencyDecimals}`
        const result = await HTTP.get(url)

        if (result.status == 200) {
            return result;
        }

        return undefined
    }

    static getProviders = async (merchantId) => {
        var url = merchantId ? adminUrls.getPaymentProviders + `/${merchantId}` : adminUrls.getPaymentProviders;
        const result = await HTTP.get( url );

        if (result.data) {
            return result.data;
        }
        return undefined;
    }

    static downloadRefundReport = async (searchObj, requestType) => {
        const result = await HTTP.post(requestType === 'report' ? urls.refundExport : urls.downlaodSettlement, searchObj);
        if (result && result.data) {
            return result.data;
        }
        return undefined;
    }
  
     static downloadTemplate = async (fileType, fileCategory) => {

        const result = await HTTP.post(urls.downloadTemplate + `${fileType}/${fileCategory}`)
        if (result && result.data) {
            return result.data;
        }

        return undefined
     }

    static activateMerchantDetails = async (merchantId) => {

        const result = await HTTP.post(adminUrls.activateMerchantDetails + `${merchantId}`)

        if (result.data) {
            return result.data;
        }
        return undefined;
    }

    static processManualPayment = async (req) => {
        const result = await HTTP.post(urls.updateManualPayment, req);

        if (result && result.data) {
            return result.data;
        }
        return undefined;
    };

    static getManualPayments = async (transactionId) => {
        const result = await HTTP.get(`${urls.manualPaymentDetails}${transactionId}`);
        if (result && result.data) {
            return result.data;
        }
        return undefined;
    };

    static saveFircFiles = async (req) => {
        const result = await HTTP.post(urls.saveFircFiles, req);
        if (result && result.data) {
            return result.data;
        }
        return undefined;
    };

    static getFirc = async (fileId) => {
        const result = await HTTP.get(`${urls.getFirc}${fileId}`);
        if (result && result.data) {
            return result.data;
        }
        return undefined;
    };

    static getFircZip = async (transactionId) => {
        const result = await HTTP.get(`${urls.getFircZip}${transactionId}`);
        if (result && result.data) {
            return result.data;
        }
        return undefined;
    };

    static inactiveTransactionMode = async (req) => {
        const result = await HTTP.post(adminUrls.inactiveTransactionMode, req);
        
        if (result && result.data) {
            return result.data;
        }
        return undefined;
    };

    static getParentCustomerList = async (mId) => {
        const result = await HTTP.get(adminUrls.getParentCustomers+ `${mId}`);
        if (result && result.data) {
            return result.data;
        }
        return undefined;
    }


    // Method to fetch time zones from the backend API
    static fetchTimeZones = async () => {
        try {
            const result = await HTTP.get(urls.getTimeZones);
            // Check if the request was successful and has data
            if (result && result.status === 200 && result.data) {
                return result.data;  
            }
        } catch (error) {
            console.error("Error fetching time zones", error);
        }
        return undefined;
    };

    static getProviderParameters = async (mId, providerId) => {
        const result = await HTTP.get(`${adminUrls.getProviderParameters + "?merchantId=" + mId + "&" + "providerId=" + providerId}`);
        if (result && result.data) {
            return result.data;
        }
        return undefined;
    }

    static updateMerchantParameter = async (req) => {
        const result = await HTTP.post(adminUrls.updateMerchantParameter, req);

        if (result.data) {
            return result.data;
        }
        return undefined;
    }

   static deleteParameter = async (id) => {
        const result = await HTTP.post(adminUrls.deleteParameter + "?beneCollectParameterId=" + id);
      if (result.data) {
            return result.data;
        }
        return undefined;
    }
     
    static deActivateMerchantDetails = async (merchantId) => {

        const result = await HTTP.post(adminUrls.deActivateMerchantDetails + `${merchantId}`)

        if (result.data) {
            return result.data;
        }
        return undefined;
    }
}
