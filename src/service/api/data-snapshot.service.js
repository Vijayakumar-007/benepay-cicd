import { adminUrls } from "config/urlConfig";
import { HTTP } from "../core/http.service";

// The DataSnapshotService class provides methods to interact with the data snapshot API.
// It includes methods to retrieve transactions, payments, and refunds data.
export class DataSnapshotService {

    // Retrieves a list of transactions based on pagination and filter criteria.
    // Parameters:
    // - page: The current page number for pagination.
    // - pageSize: The number of items per page.
    // - filters: An object containing filter criteria such as transactionId and merchantId.
    // Returns the data from the API response if successful, otherwise returns undefined.
    static getTransactions = async (page, pageSize, filters) => {
        const result = await HTTP.post(adminUrls.getSnapshotTransactions, {
                "page": page,
                "pageSize": pageSize,
                "transactionId": filters.tid,
                "merchantId": filters.merchantId,
                "receiptStartDate":filters.receiptStartDate,
                "receiptEndDate":filters.receiptEndDate
            });

        if (result && result.data) {
            return result.data;
        }
        return undefined;
    }

    // Retrieves a list of payments based on pagination and filter criteria.
    // Parameters:
    // - page: The current page number for pagination.
    // - pageSize: The number of items per page.
    // - filters: An object containing filter criteria such as transactionId and merchantId.
    // Returns the data from the API response if successful, otherwise returns undefined.
    static getPayments = async (page, pageSize, filters) => {
        const result = await HTTP.post(adminUrls.getSnapshotpayments, {
                "page": page,
                "pageSize": pageSize,
                "transactionId": filters.tid,
                "merchantId": filters.merchantId,
                "receiptStartDate":filters.receiptStartDate,
                "receiptEndDate":filters.receiptEndDate
            });

        if (result && result.data) {
            return result.data;
        }
        return undefined;
    }

    // Retrieves a list of refunds based on pagination and filter criteria.
    // Parameters:
    // - page: The current page number for pagination.
    // - pageSize: The number of items per page.
    // - filters: An object containing filter criteria such as transactionId and merchantId.
    // Returns the data from the API response if successful, otherwise returns undefined.
    static getRefunds = async (page, pageSize, filters) => {
        const result = await HTTP.post(adminUrls.getSnapshotRefunds, {
                "page": page,
                "pageSize": pageSize,
                "transactionId": filters.tid,
                "merchantId": filters.merchantId,
                "receiptStartDate":filters.receiptStartDate,
                "receiptEndDate":filters.receiptEndDate
            });

        if (result && result.data) {
            return result.data;
        }
        return undefined;
    }
    
    static getTraceEntry = async (page, pageSize, filters) => {
        const result = await HTTP.post(adminUrls.getSnapshotTraceEntry, {
            "page": page,
            "pageSize": pageSize,
            "transactionId": filters.tid,
            "merchantId": filters.merchantId,
            "receiptStartDate":filters.receiptStartDate,
            "receiptEndDate": filters.receiptEndDate
        });

        if (result && result.data) {
            return result.data;
        }
        return undefined;
    } 

    static getSettlementsData = async (page, pageSize, filters) => {
        const result = await HTTP.post(adminUrls.getSnapshotSettlements, {
            "page": page,
            "pageSize": pageSize,
            "transactionId": filters.tid,
            "merchantId": filters.merchantId,
            "receiptStartDate":filters.receiptStartDate,
            "receiptEndDate": filters.receiptEndDate
        });

        if (result && result.data) {
            return result.data;
        }
        return undefined;
    }
}