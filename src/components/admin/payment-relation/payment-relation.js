/**
 * @author Anurag Pundir
 *
 */

import React, { useState, useEffect } from 'react';
import { html } from './paymentRelation.html';
import { BenepayUserService } from '../../../service/api/benepay-user.service';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { MenuItem, Select } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Utils from 'service/core/utils';


const PaymentRelation = () => {

  const [countryList, setCountryList] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [providersList, setProvidersList] = useState([]);
  const [methodsList, setMethodsList] = useState([]);
  const [paymentScopeList, setPaymentScopeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [brand, setBrand] = useState(null);
  const [method, setMethod] = useState(null);
  const [paymentScope, setPaymentScope] = useState(null);
  const [provider, setProvider] = useState(null);
  const [countryCode, setCountryCode] = useState(null);
  const [prority, setPrority] = useState(null);
  const [result, setResult] = useState([]);
  const [disable, setDisable] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  //  search states 
  const [brandSearch, setBrandSearch] = useState(null);
  const [methodSearch, setMethodSearch] = useState(null);
  const [providerSearch, setProviderSearch] = useState(null);
  const [countryCodeSearch, setCountryCodeSearch] = useState(null);
  const [paymentScopeSearch, setPaymentScopeSearch] = useState(null);

  const [rows, setRows] = useState([]);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [showDropdowns, setShowDropdowns] = useState(false);

  const [providerPriorities, setProviderPriorities] = useState([]);

  useEffect(() => {
    console.log("Utils.isNullOrEmpty(method)", Utils.isNullOrEmpty(method))
    if(method != null && method.length > 0 && brand != null && brand.length > 0 && paymentScope != null && paymentScope.length > 0 ){
      setPriorityData();
    }else{
      setProviderPriorities([]);
    }
  },[method, brand, paymentScope]);

  const setPriorityData = () => {
    let data = [];
    result.map((item) => {
      if(item.brand == brand && item.paymentScope == paymentScope && item.paymentMethod == method){
        // data.push(item);
        data.push({provider: item.paymentProvider, priority: item.priority});
      }
    })
    if(data.length == 0){
      setProviderPriorities([{provider: null, priority: null}]);
    }else{
      setProviderPriorities(data);
    }

  }


  const columns = [
    {
      field: 'paymentMethod',
      headerName: 'Payment Method',
      width: 275,
      headerClassName: 'header-bg',
      cellClassName: 'cell-bg',
      renderCell: (params) => {
        const { field, value } = params;

        const handleSelectChange = (event) => {
          if (params.row.id === editingRowId) {
            setEditValues({
              ...editValues,
              [field]: event.target.value,
            });
          } else {
            const updatedRows = rows.map((row) =>
              row.id === params.row.id
                ? { ...row, [field]: event.target.value }
                : row
            );
            setRows(updatedRows);
          }
        };

        return (
          params.row.id === editingRowId || showDropdowns ? (
            <Select
              value={editValues.paymentMethod || value}
              onChange={handleSelectChange}
              style={{ width: '100%' }}
            >
              {methodsList.map((method) => (
                <MenuItem key={method.code} value={method.description}>
                  {method.description}
                </MenuItem>
              ))}
            </Select>
          ) : (
            value
          )
        );
      },
    },
    {
      field: 'brand',
      headerName: 'Brand',
      width: 275,
      headerClassName: 'header-bg',
      cellClassName: 'cell-bg',
      renderCell: (params) => {
        const { field, value } = params;

        const handleSelectChange = (event) => {
          if (params.row.id === editingRowId) {
            setEditValues({
              ...editValues,
              [field]: event.target.value,
            });
          } else {
            const updatedRows = rows.map((row) =>
              row.id === params.row.id
                ? { ...row, [field]: event.target.value }
                : row
            );
            setRows(updatedRows);
          }
        };

        return (
          params.row.id === editingRowId || showDropdowns ? (
            <Select
              value={editValues.brand || value}
              onChange={handleSelectChange}
              style={{ width: '100%' }}
            >
              {brandList.map((brand) => (
                <MenuItem key={brand.code} value={brand.description}>
                  {brand.description}
                </MenuItem>
              ))}
            </Select>
          ) : (
            value
          )
        );
      },
    },
    {
      field: 'paymentScope',
      headerName: 'Payment Scope',
      width: 275,
      headerClassName: 'header-bg',
      cellClassName: 'cell-bg',
      renderCell: (params) => {
        const { field, value } = params;

        const handleSelectChange = (event) => {
          if (params.row.id === editingRowId) {
            setEditValues({
              ...editValues,
              [field]: event.target.value,
            });
          } else {
            const updatedRows = rows.map((row) =>
              row.id === params.row.id
                ? { ...row, [field]: event.target.value }
                : row
            );
            setRows(updatedRows);
          }
        };

        return (
          params.row.id === editingRowId || showDropdowns ? (
            <Select
              value={editValues.countryCode || value}
              onChange={handleSelectChange}
              style={{ width: '100%' }}
            >
              {countryList.map((country) => (
                <MenuItem key={country.code} value={country.description}>
                  {country.description}
                </MenuItem>
              ))}
            </Select>
          ) : (
            value
          )
        );
      },
    },
    {
      field: 'paymentProvider',
      headerName: 'Payment Provider',
      width: 275,
      headerClassName: 'header-bg',
      cellClassName: 'cell-bg',
      renderCell: (params) => {
        const { field, value } = params;

        const handleSelectChange = (event) => {
          if (params.row.id === editingRowId) {
            // Update editValues for the edited row
            setEditValues({
              ...editValues,
              [field]: event.target.value,
            });
          } else {
            // Update the row data directly
            const updatedRows = rows.map((row) =>
              row.id === params.row.id
                ? { ...row, [field]: event.target.value }
                : row
            );
            setRows(updatedRows);
          }
        };

        return (
          params.row.id === editingRowId || showDropdowns ? (
            <Select
              value={editValues.paymentProvider || value}
              onChange={handleSelectChange}
              style={{
                width: '100%', padding: '0px 0px'
              }}
            >
              {providersList.map((provider) => (
                <MenuItem key={provider.paymentProviderId} value={provider.paymentProviderName}>
                  {provider.paymentProviderName}
                </MenuItem>
              ))}
            </Select>
          ) : (
            value
          )
        );
      },
    },
    {
      field: 'priority',
      headerName: 'Priority',
      width: 275,
      headerClassName: 'header-bg',
      cellClassName: 'cell-bg',
      renderCell: (params) => {
        const { field, value } = params;

        const handleSelectChange = (event) => {
          if (params.row.id === editingRowId) {
            // Update editValues for the edited row
            setEditValues({
              ...editValues,
              [field]: event.target.value,
            });
          } else {
            // Update the row data directly
            const updatedRows = rows.map((row) =>
              row.id === params.row.id
                ? { ...row, [field]: event.target.value }
                : row
            );
            setRows(updatedRows);
          }
        };

        return (
          params.row.id === editingRowId || showDropdowns ? (
            <Select
              value={editValues.priority || value}
              onChange={handleSelectChange}
              style={{
                width: '100%', padding: '0px 0px'
              }}
            >
              {providersList.map((provider, index) => (
                <MenuItem key={index + 1} value={index + 1}>
                  {index + 1}
                </MenuItem>
              ))}
            </Select>
          ) : (
            value
          )
        );
      },
    },
    {
      field: 'Action',
      headerName: 'Action',
      width: 275,
      headerClassName: 'header-bg',
      cellClassName: 'cell-bg',
      renderCell: (params) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          {/* {params.row.id === editingRowId ? (
            <IconButton color="primary" onClick={handleSave}>
              <SaveIcon />
            </IconButton>
          ) : (
            <IconButton color="primary" onClick={() => handleEdit(params.row)}>
              <EditIcon />
            </IconButton>
          )} */}
          <IconButton color="primary" onClick={() => handleEditToNextPage(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="secondary" onClick={() => handleDelete(params.row)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];


  const handleEdit = (row) => {
    setEditingRowId(row.id);
    setEditValues(row);
    console.log(editingRowId, row.id, row);

  };

  const handleEditToNextPage = (row) => {
    console.log("row", row.id, row);
    setMethod(row.paymentMethod);
    setBrand(row.brand);
    setPaymentScope(row.paymentScope);
    handleAddClick();
  }

  useEffect(() => {
    console.log('editingRowId updated:', editingRowId);
  }, [editingRowId]);


  const handleSave = async () => {
    setLoading(true);
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === editingRowId
          ? {
            ...row,
            paymentMethod: methodsList.find(
              (method) => method.description === editValues.paymentMethod
            )?.code || editValues.paymentMethod,
            countryCode: countryList.find(
              (country) => country.description === editValues.countryCode
            )?.code || editValues.countryCode,
            brand: brandList.find(
              (brand) => brand.description === editValues.brand
            )?.code || editValues.brand,
            paymentProvider: providersList.find(
              (provider) =>
                provider.paymentProviderName === editValues.paymentProvider
            )?.paymentProviderId || editValues.paymentProvider,
          }
          : row
      )
    );

    console.log("this is the updated data :", editValues, editingRowId, rows);
    setEditingRowId(null);



    const req = {
      paymentMethodId: editValues.paymentMethodId,
      brandValue: brandList.find(item => item.description === editValues.brand)?.code,
      methodValue: methodsList.find(item => item.description === editValues.paymentMethod)?.code,
      providerValue: providersList.find(item => item.paymentProviderName === editValues.paymentProvider)?.paymentProviderId,
      countryCodeValue: countryList.find(item => item.description === editValues.countryCode)?.code,
    }

    const response = await BenepayUserService.updatePaymentRelationDetails(req);
    console.log("this is the submit api response:  ", response);
    SearchPaymentRelation();
    clearProcessedDetails();

    if (response.status == "SUCCESS") {
      toast.success("Payment Method Updated Successfully ");
      console.log("Payment Method Updated Successfully");
    } else {
      toast.error(response.merchantSplitError.errorMsg);
      console.error("Payment Method Updation Failed");
    }
    setLoading(false);

  };



  const handleDelete = async (row) => {
    setLoading(true); // Set loading state to indicate ongoing operation

    try {
      const response = await BenepayUserService.deletePaymentMethod(row.paymentMethodId);

      console.log("this is response of the deletion api :", response);
      if (response.status == "SUCCESS") {
        toast.success("Payment method deleted successfully");
        console.log("Payment method deleted successfully!");

        // Update the state to reflect the removed row
        setRows((prevRows) => prevRows.filter((r) => r.id !== row.id));
      } else {
        toast.error(response.merchantSplitError.errorMsg);
        console.error("Deletion failed:", response.data);
      }
    } catch (error) {
      toast.error("Error during deletion");
      console.error("Error during deletion:", error);

    } finally {

      SearchPaymentRelation();
      clearProcessedDetails();
      setLoading(false); // Reset loading state after the operation completes
    }
  };



  useEffect(() => {
    const req = {
      brandValue: '',
      methodValue: '',
      providerValue: '',
      countryCodeValue: '',
      defaultSearch: true
    }
    prepareResult(req);
  }, []);


  const prepareResult = async (req) => {
    setLoading(true);
  
    try {
      const result = await BenepayUserService.getPaymentRelationDetails(req);
      console.log("this is the result: ", result, result.data);
  
      // Set other lists from the response
      setBrandList(result.data.brandDataList);
      setCountryList(result.data.countryCodeData);
      setProvidersList(result.data.providersData);
      setMethodsList(result.data.methodsData);
      setPaymentScopeList(result.data.paymentScopeList);

      // Check if relationDataList is null or empty
      if (!Array.isArray(result.data.relationDataList) || result.data.relationDataList.length === 0) {
        console.log("relationDataList is either null or empty");
        toast.error("No payment methods found");
        setResult([]); 
      } else {
        const dataWithIds = result.data.relationDataList.map((item, index) => ({
          ...item,
          id: index + 1,
        }));
        setResult(dataWithIds);
      }
    } catch (error) {
      toast.error("Error fetching payment methods details");
      console.error("Error fetching payment relation details: ", error);
      setResult([]); 
    } finally {
      setLoading(false);
    }
  };
  


  const SearchPaymentRelation = async () => {
    setLoading(true);
    const req = {

      brandValue: brandList.find(item => item.description === brandSearch)?.code,
      methodValue: methodsList.find(item => item.description === methodSearch)?.code,
      paymentScopeValue: paymentScopeList.find(item => item.description === paymentScopeSearch)?.code,
      providerValue: providersList.find(item => item.paymentProviderName === providerSearch)?.paymentProviderId,
      countryCodeValue: countryList.find(item => item.description === countryCodeSearch)?.code,
      defaultSearch: !(brandSearch || methodSearch || providerSearch || countryCodeSearch || paymentScopeSearch),
    }
    prepareResult(req);



  }



  const submitPaymentRelation = async () => {
    setLoading(true);
    const req = {
      paymentScopeValue: paymentScopeList.find(item => item.description === paymentScope)?.code,
      brandValue: brandList.find(item => item.description === brand)?.code,
      methodValue: methodsList.find(item => item.description === method)?.code,
      countryCodeValue: countryList.find(item => item.description === countryCode)?.code,
    }

    let ppData = [];
    let prioList = [];
    let isValid = true;
    providerPriorities.map((data) => {
      let providerValue = providersList.find(item => item.paymentProviderName === data.provider)?.paymentProviderId;
      if(prioList.includes(data.priority)){
        isValid = false;
      }else{
        prioList.push(data.priority);
      }
      ppData.push({provider: providerValue, priority: data.priority.toString()})
    })

    if(!isValid){
      toast.error("2 Providers cannot have same priority!");
      setLoading(false);
      return;
    }

    req["providerPriorities"] = ppData;

    const response = await BenepayUserService.savePaymentRelationDetails(req);
    console.log("this is the submit api response:  ", response);
    SearchPaymentRelation();
    clearProcessedDetails();

    if (response.status == "SUCCESS") {
      handleAddClick();
      toast.success("Payment Method Created Successfully ");
      console.log("Payment Method Created Successfully");
    } else {
      toast.error(response.merchantSplitError.errorMsg);
      console.error("Payment Method Creation Failed");
    }
    setLoading(false);
  }

  const clearProcessedDetails = async () => {
    console.log("this is the value fo the disable field :", disable);

    setBrand('');
    setMethod('');
    setProvider('');
    setCountryCode('');
    setPaymentScope('');

    setBrandSearch(''),
    setMethodSearch(''),
    setProviderSearch(''),
    setCountryCodeSearch('')
    setPaymentScopeSearch('');

  }





  useEffect(() => {
    if (!brand) {
      setDisable(false);
      return;
    }

    const selectedBrand = brandList.find(item => item.description === brand);

    setDisable(selectedBrand?.additionalDetails === '0');
  }, [brand, brandList]);



  const handleAddClick = async () => {
    console.log("this is the value fo the showAddForm :", showAddForm, providerPriorities);
    if (showAddForm) {
      setShowAddForm(false);
    } else {
      setShowAddForm(true);
    }
  }



  return html({
    providersList,
    handleAddClick,
    countryList,
    methodsList,
    paymentScopeList,
    setBrand,
    setProvider,
    setMethod,
    setCountryCode,
    brandList,
    brand,
    provider,
    method,
    countryCode,
    result,
    columns,
    disable,
    submitPaymentRelation,
    clearProcessedDetails,
    isLoading: loading,
    SearchPaymentRelation,
    brandSearch,
    methodSearch,
    providerSearch,
    countryCodeSearch,
    setBrandSearch,
    setShowAddForm,
    showAddForm,
    setMethodSearch,
    setProviderSearch,
    setCountryCodeSearch,
    providerPriorities,
    setProviderPriorities,
    paymentScope,
    setPaymentScope,
    paymentScopeSearch,
    setPaymentScopeSearch
  });
}

export default PaymentRelation;
