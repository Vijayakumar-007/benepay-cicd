import { urls } from '../../config/urlConfig'
import { HTTP } from '../core/http.service'

export class CustomerService {
  
    static uploadFile = async (req) => {
        const result = await HTTP.post(`${urls.uploadFile}`, req)
        if (result.status == 200) {
          return result
        }
        return undefined
      }

      static refundFile = async (formData) => {
        const config = {     
          headers: { 'content-type': 'multipart/form-data' }
      }
        const result = await HTTP.post(`${urls.refundFile}`, formData)
        if (result.status == 200) {
          return result
        }
        return undefined
      }
    
    static getUploadedFilesList = async (fileType, pageNo , pageSize) => {
      const url = `${urls.UploadedFilesList}/${fileType.toUpperCase()}/${pageNo}/${pageSize}`
      const result = await HTTP.get(url)
      if (result.status == 200) {
        return result
      }
      return undefined
    }

    static fetchErrorSummaryList = async (fileId) => {
      const url = `${urls.errorList}/${fileId}`
      const result = await HTTP.get(url)
      if (result.status == 200) {
        return result
      }
      return undefined
    }

    static fetchPaymentFileResponse = async (fileId) => {
      const url = `${urls.paymentFileResponse}/${fileId}`
      const result = await HTTP.get(url)
      if (result.status == 200) {
        return result
      }
      return undefined
    }
    
}