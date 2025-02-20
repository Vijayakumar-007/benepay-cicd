/**
 * @author Anurag Pundir
 *
 */

import React, { useState, useEffect } from 'react';
import { BenepayUserService } from '../../../service/api/benepay-user.service';
import { html } from './traceEntry.html'; 

const TraceDetails = () => {
  const [traceId, setTraceId] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [merchant, setMerchant] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [rowsWithId, setRowsWithId] = useState([]);
  const [defaultSearch, setDefaultSearch] = useState(true);
  const [result, setResult] = useState({});
  const [response, setResponse] = useState([]);
  const [merchantList, setMerchantList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [columns] = useState([
    { field: 'traceId', headerName: 'Trace ID', width: 130, headerClassName: 'header-bg', cellClassName: 'cell-bg', headerClassName: 'header-bg', cellClassName: 'cell-bg' },
    { field: 'transactionId', headerName: 'Transaction Id', width: 130, headerClassName: 'header-bg', cellClassName: 'cell-bg', headerClassName: 'header-bg', cellClassName: 'cell-bg' },
    { field: 'paymentProviderId', headerName: 'Provider Id', width: 130, headerClassName: 'header-bg', cellClassName: 'cell-bg' },
    { field: 'fkpaymentRefundId', headerName: 'Refund Id', width: 130, headerClassName: 'header-bg', cellClassName: 'cell-bg' },
    { field: 'paymentType', headerName: 'Payment Type', width: 130, headerClassName: 'header-bg', cellClassName: 'cell-bg' },
    { field: 'collectionAmount', headerName: 'Amount', width: 130, headerClassName: 'header-bg', cellClassName: 'cell-bg' },
    { field: 'merchantId', headerName: 'Merchant Id', width: 130, headerClassName: 'header-bg', cellClassName: 'cell-bg' },
    { field: 'redirectUrl', headerName: 'Redirect Url', width: 130, headerClassName: 'header-bg', cellClassName: 'cell-bg' },
    { field: 'statusUrl', headerName: 'Status Url', width: 130, headerClassName: 'header-bg', cellClassName: 'cell-bg' },
    { field: 'paymentProviderReasonCode', headerName: 'Provider Reason Code', width: 130, headerClassName: 'header-bg', cellClassName: 'cell-bg' },
    { field: 'status', headerName: 'Status', width: 130, headerClassName: 'header-bg', cellClassName: 'cell-bg' },
    { field: 'message', headerName: 'Message', width: 130, headerClassName: 'header-bg', cellClassName: 'cell-bg' },
    { field: 'httpResponseCode', headerName: 'Response Code', width: 130, headerClassName: 'header-bg', cellClassName: 'cell-bg' },
    { field: 'paymentProviderTimestamp', headerName: 'Provider TimeStamp', width: 130, headerClassName: 'header-bg', cellClassName: 'cell-bg' },
    { field: 'insertedDatetime', headerName: 'Insertion TimeStamp', width: 130, headerClassName: 'header-bg', cellClassName: 'cell-bg' },
    { field: 'updatedDatetime', headerName: 'Updation TimeStamp', width: 130, headerClassName: 'header-bg', cellClassName: 'cell-bg' },
    { field: 'beneStatus', headerName: 'Bene Status', width: 130, headerClassName: 'header-bg', cellClassName: 'cell-bg' },
    { field: 'paymentProviderStatusReasonCode', headerName: 'Provider Status ReasonCode', width: 130, headerClassName: 'header-bg', cellClassName: 'cell-bg' },
    { field: 'paymentProviderPaymentStatus', headerName: 'Provider Payment Status', width: 130, headerClassName: 'header-bg', cellClassName: 'cell-bg' },
    { field: 'paymentProviderPaymentMessage', headerName: 'Provider Payment Message', width: 130, headerClassName: 'header-bg', cellClassName: 'cell-bg' },
    { field: 'paymentProviderStatusResponseTime', headerName: 'Provider Status ResponseTime', width: 130, headerClassName: 'header-bg', cellClassName: 'cell-bg' },
    { field: 'paymentProvider', headerName: 'Provider', width: 130, headerClassName: 'header-bg', cellClassName: 'cell-bg' },
    { field: 'providerResponse', headerName: 'Provider Response', width: 130, headerClassName: 'header-bg', cellClassName: 'cell-bg' }
  ]);

  const prepareResult = async () => {
    
    // if (transactionId == '' && traceId == '' && startDate == '' && endDate == '' ) {
    //   setDefaultSearch(true);
    // } else {
    //   setDefaultSearch(false);
    // }

    let request = {
      defaultSearch: defaultSearch,
      // traceId: traceId,
      // transactionId: transactionId,
      // startDate: startDate,
      // endDate: endDate,
      // email: merchantEmail
    }

    console.log("this is the request : ", request, typeof response);
    try {

      if (Array.isArray(response) && response.length === 0) {
        const results = await BenepayUserService.getTraceDetails(request);
        console.log("this is the result1:", results, results.data);
        setResponse(results.data.details);
        setMerchantList(results.data.merchants);
      }
    } catch (error) {
      console.error("Error fetching trace details:", error);
    }
  }

  useEffect(() => {
    if (response && response.length > 0) {
      console.log("this is the result2:", response);
      const filteredData = filteredSearch(response);
      console.log("this is the filtered data:", filteredData);

      // Add 'Id' to each result with ascending values
      const dataWithIds = filteredData.map((item, index) => ({
        ...item,
        id: index + 1
      }));

      console.log("this is the result after adding the id:", dataWithIds);
      setResult(dataWithIds);
      setLoading(false);
    }
  }, [response, transactionId, traceId, startDate, endDate, paymentStatus,merchant,transactionType]); 
  
  const filteredSearch = (data) => {
    const filteredData = data.filter(item => {

      const criteria = [];

      if (transactionId) {
        criteria.push(item.transactionId === transactionId);
      }
      if (traceId) {
        criteria.push(item.traceId === traceId);
      }
      if (startDate) {
        // Convert insertedDatetime (timestamp) and startDate to 'YYYY-MM-DD' for comparison
        const itemDateString = getLocalDateString(new Date(item.insertedDatetime));
        const startDateString = getLocalDateString(startDate);
        console.log("this is the modified date ", itemDateString, startDateString);
        criteria.push(itemDateString >= startDateString);
      }

      if (endDate) {
        const itemDateString = getLocalDateString(new Date(item.insertedDatetime));
        const endDateString = getLocalDateString(endDate);
        criteria.push(itemDateString <= endDateString);
      }

      if (paymentStatus) {
        criteria.push(item.status.toLowerCase() === paymentStatus.toLowerCase());
      }
      
      if (merchant) {
        criteria.push(item.merchantId === merchant);  // Corrected mapping for 'merchant'
      }
      
      if (transactionType) {
        criteria.push(item.paymentType.toLowerCase() === transactionType.toLowerCase());
      }
      
      // Only return the item if all non-empty criteria match
      return criteria.every(Boolean);
    });

    return filteredData;
  };

  const getLocalDateString = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`; // Format 'YYYY-MM-DD'
  };


  const clearSearchFields = () => {
      setTraceId(''),
      setTransactionId(''),
      setStartDate(''),
      setEndDate(''),
      setMerchant(''),
      setTransactionType(''),
      setPaymentStatus('')
  }

  useEffect(() => {
    prepareResult();
  }, []);



  return html({
    traceId,
    transactionId,
    startDate,
    endDate,
    paymentStatus,
    merchant,
    transactionType,
    merchantList,
    setMerchant,
    setTransactionType,
    setPaymentStatus,
    setTraceId,
    setTransactionId,
    setStartDate,
    setEndDate,
    result,
    columns,
    rowsWithId,
    isLoading: loading,
    // merchantIdSearch,
    // setMerchantIdSearch,
    // prepareResult,
    clearSearchFields,
    // setRowsWithId,
    // rowsWithIdALL,
  });
};

export default TraceDetails;
