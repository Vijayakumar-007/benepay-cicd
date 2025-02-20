import { adminUrls } from '../../config/urlConfig'
import { HTTP } from '../core/http.service'

export class BenepayUserService {
  
    static uploadSettlementFile = async (req) => {
        // const result = await HTTP.post("https://ki6f28zlli.execute-api.eu-west-2.amazonaws.com/dev/v2/uploadSettlement", {name: "name"} )
        const result = await HTTP.post(adminUrls.uploadSettlementFile, req )
        if (result.status == 200) {
          return result;
        }
        return undefined;
    }

    static getFromProvidedResult = async (req) => {
        const result = await HTTP.post(adminUrls.getFromProvidedResult, req )  
        if (result.status == 200) {
          return result;
        }
        return undefined;
    }

    static getGeneratedByBenepayResult = async (req) => {
      const result = await HTTP.post(adminUrls.getGeneratedByBenepayResult, req )  
      if (result.status == 200) {
        return result;
      }
      return undefined;
    }

    static downloadFromSettlementFile = async (fileId) => {
      const url = `${adminUrls.downloadFromSettlementFile}/${fileId}`
      const result = await HTTP.get(url)
      if (result.status == 200) {
        return result;
      }
      return undefined;
    }

    static downloadGeneratedByBenepayFile = async (fileId) => {
      const url = `${adminUrls.downloadGeneratedByBenepayFile}/${fileId}`
      const result = await HTTP.get(url)
      if (result.status == 200) {
        return result;
      }
      return undefined;
    }

    static getAllMerchants = async() => {
      const url = `${adminUrls.getAllMerchants}`
      const result = await HTTP.get(url)
      if (result.status == 200) {
        return result;
      }
      return undefined;
    }

    static getMerchants = async () => {
        const result = await HTTP.get(adminUrls.getMerchants);
        console.log("results",result)
        if (result.data) {
            return result;
        }
        return undefined;

    }

    static getAllProviders = async (fileId) => {
      const url = `${adminUrls.getAllProviders}`
      const result = await HTTP.get(url)
      if (result.status == 200) {
        return result;
      }
      return undefined;
    }

    static getAllBroadcasts = async () => {
      const result = await HTTP.get(adminUrls.getAllBroadcasts);
      if(result.data){
        return result.data;
      } 
      return undefined;
    }

    static createBroadcast = async (req) => {
      const result = await HTTP.post(adminUrls.createBroadcast, req);
      if(result.data){
        return result.data;
      } 
      return undefined;
    }

    static updateBroadcast = async (messageId, req) => {
      const result = await HTTP.post(adminUrls.updateBroadcast + `${messageId}`, req);
      if(result.data){
        return result.data;
      } 
      return undefined;
    }

    static deleteBroadcast = async (messageId) => {
      const result = await HTTP.post(adminUrls.deleteBroadcast + `${messageId}`);
      if(result.data){
        return result.data;
      } 
      return undefined;
    }
    
    static getPaymentProviderList = async (paymentMethods) => {
      const result = await HTTP.get(`${adminUrls.getPaymentProviderList}/${paymentMethods}`);
      if(result.data){
        return result.data;
      } 
      return undefined;
    }

    static getPaymentMethodList = async (paymentProvider) => {
      const result = await HTTP.get(`${adminUrls.getPaymentMethodList}/${paymentProvider}`);
      if(result.data){
        return result.data;
      } 
      return undefined;
    }

    static getPaymentCcy = async (merchantId) => {
      const result = await HTTP.get(`${adminUrls.getPaymentCcy}/${merchantId}`);
      if(result.data){
        return result.data;
      } 
      return undefined;
    }

    static createMerchantSplit = async (req) => {
      const result = await HTTP.post(adminUrls.createMerchantSplit, req);
      if(result.data){
        return result.data;
      } 
      return undefined;
    }

    static getSplitInfo = async (splitId) => {
      const result = await HTTP.get(`${adminUrls.getSplitInfo}/${splitId}`);
      if(result.data){
        return result.data;
      } 
      return undefined;
    }

    static getMerchantSplitList = async (merchantId) => {
      const result = await HTTP.get(`${adminUrls.getMerchantSplitList}/${merchantId}`);
      if(result.data){
        return result.data;
      } 
      return undefined;
    }

    static deleteMerchantSplit = async (splitId) => {
      const result = await HTTP.get(`${adminUrls.deleteMerchantSplit}/${splitId}`);
      if(result.data){
        return result.data;
      } 
      return undefined;
    }

    static updateMerchantSplit = async (req) => {
      const result = await HTTP.post(adminUrls.updateMerchantSplit, req);
      if(result.data){
        return result.data;
      } 
      return undefined;
    }
    
    static referalPartnerDetails = async (merchantId) => {
      const result = await HTTP.get(`${adminUrls.referalPartnerDetails}/${merchantId}`);
      if(result.data){
        return result.data;
      } 
      return undefined;
    }

    static childMerchantInfo = async (merchantId) => {
      const result = await HTTP.get(`${adminUrls.childMerchantInfo}/${merchantId}`);
      if(result.data){
        return result.data;
      } 
      return undefined;
    }

    static addLookupDetails = async (req) => {
      const result = await HTTP.post(adminUrls.addLookupDetails, req);
      if(result.data){
        return result.data;
      } 
      return undefined;
    }

    static getAllPrivileges = async () => {
      const result = await HTTP.get(`${adminUrls.getAllPrivileges}`);
      if(result.data){
        return result.data;
      } 
      return undefined;
    }

    static getAllRoles = async () => {
      const result = await HTTP.get(`${adminUrls.getAllRoles}`);
      if(result.data){
        return result.data;
      } 
      return undefined;
    }

    static createRole = async (req) => {
      const result = await HTTP.post(adminUrls.createRole, req);
      if(result.data){
        return result.data;
      } 
      return undefined;
    }

    static getPrivilegesById = async (id) => {
      const result = await HTTP.get(`${adminUrls.getPrivilegesById}/${id}`);
      if(result.data){
        return result.data;
      } 
      return undefined;
    }

    static deleteRole = async (id) => {
      const result = await HTTP.post(`${adminUrls.deleteRole}/${id}`);
      if(result.data){
        return result.data;
      } 
      return undefined;
    }
    
    static getTraceDetails = async (req) => {
      const result = await HTTP.post(adminUrls.traceDetails, req);
      if (result.data) {
          return result;
      }
      return undefined;
    }

    static getVirtualAccounts = async (merchantId, providerId, currency) => {
      const result = await HTTP.get(`${adminUrls.getVirtualAccount + "?merchantId=" + merchantId + "&providerId=" + providerId + "&currency=" + currency}`);

      if (result.data) {
          return result.data;
      }

      return undefined;
    }

  static getPaymentRelationDetails = async (req) => {
    const result = await HTTP.post(adminUrls.paymentRelationDetails, req);
    if (result.data) {
      return result;
    }
    return undefined;
  }

static updatePaymentRelationDetails = async (req) => {
  const result = await HTTP.post(adminUrls.updatePaymentRelation, req);
  if(result.data){
    return result.data;
  } 
  return undefined;
}


static savePaymentRelationDetails = async (req) => {
  const result = await HTTP.post(adminUrls.savePaymentRelation, req);
  if(result.data){
    return result.data;
  } 
  return undefined;
}
    

static deletePaymentMethod = async (paymentMethodId) => {
  const result = await HTTP.get(`${adminUrls.deletePaymentMethod}/${paymentMethodId}`);
  if(result.data){
    return result.data;
  } 
  return undefined
  ;
}

static saveOnboardingPaymentMethodsDetails = async (req) => {
  const result = await HTTP.post(adminUrls.saveOnboardPaymentMethods, req);
  if(result.data){
    return result.data;
  } 
  return undefined;
}

static getOnboardingPaymentMethodsDetails = async (merchantId) => {
  const result = await HTTP.get(`${adminUrls.getOnboardPaymentMethods}/${merchantId}`);
  if(result.data){
    return result.data;
  } 
  return undefined
  ;
}

static saveVirtualAccount = async (req) => {
      const result = await HTTP.post(adminUrls.saveVirtualAccount, req);

      if (result.data) {
          return result;
      }

      return undefined;
    }
    
}
