import { urls } from '../../config/urlConfig'
import { HTTP } from '../core/http.service'

export class PaymentService {

  static uploadFile = async (req) => {
    const result = await HTTP.post(`${urls.uploadFile}`, req)
    if (result.status == 200) {
      return result
    }
    return undefined
  }

  /**
   * 
   * @param {*} fileId 
   * @returns 
   */
  static fetchPaymentFileResponse = async (fileId) => {
    const url = `${urls.paymentFileResponse}/${fileId}`
    const result = await HTTP.get(url)
    if (result.status == 200) {
      return result;
    }
    return undefined
  }

  /**
   * 
   * @param {*} name 
   * @returns 
   */
  static fetchPayers = async (name) => {
    const url = `${urls.searchPayers}?payerName=${name}`
    const result = await HTTP.get(url)

    if (result.status == 200) {
      return result;
    }

    return undefined
  }

  /**
   * 
   * @param {*} name 
   * @param {*} email 
   * @returns 
   */
  static fetchPayerRecentTransaction = async (name, email) => {
    const url = `${urls.payerRecentTransaction}?payerName=${name}&payerEmail=${email}`
    const result = await HTTP.get(url)

    if (result.status == 200) {
      return result;
    }

    return undefined
  }

  /**
   * 
   * @returns 
   */
  static fetchCurrencyDecimals = async () => {
    const url = `${urls.currencyDecimals}`
    const result = await HTTP.get(url)

    if (result.status == 200) {
      return result;
    }

    return undefined
  }

  /**
   * @author Sushmit.Katkale
   * @returns 
   */
  static getAllowdedCurrencyDecimals = async () => {

    const result = await HTTP.get(urls.getAllowdedCurrencyDecimals);

    if (result) {
        return result;
    }
    return undefined;
  };

  /**
   * 
   * @returns 
   */
  static getMerchantDetails = async () => {
    const url = `${urls.merchantDetails}`

    const result = await HTTP.get(url)

    if (result && result.status == 200) {
      return result;
    }

    return undefined
  }

  static submitPayment = async (req) => {
    const result = await HTTP.post(`${urls.createPayment}`, req);

    if (result.status == 200) {
      return result
    }
    
    return undefined
  }

  /**
   * @author Bharath
   * fetches the pdf content
   * @param {*} transactionId 
   * @returns 
   */
  static generateInvoice = async (transactionId) => {
    const result = await HTTP.get(urls.generateInvoice + `${transactionId}`)
    return result.data;
  }

  /**
   * 
   * @param {*} name 
   * @returns 
   */
  static checkRequestorTransaction = async (transactionId) => {
    const url = `${urls.checkRequestorTransaction}/${transactionId}`
    const result = await HTTP.get(url)

    if (result.status == 200) {
      return result;
    }

    return undefined
  }

  /**
   * 
   * @returns 
   */
  static fetchExpiryDate = async (date) => {
    const url = `${urls.getExpiryDate}/${date}`
    const result = await HTTP.get(url)

    if (result.status == 200) {
      return result;
    }

    return undefined
  }


}
