/**
 * @author Anurag Pundir
 *
 */

import React, { useState, useEffect } from 'react';
import { html } from './payment-method.html';
import { BenepayUserService } from '../../../../../service/api/benepay-user.service';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { MenuItem, Select } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const PaymentMethod = (props) => {
  const [countryList, setCountryList] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [providersList, setProvidersList] = useState([]);
  const [methodsList, setMethodsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState([]);

  const [savedMethods, setSavedMethods] = useState([]);

  const [rows, setRows] = useState([]);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [showDropdowns, setShowDropdowns] = useState(false);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);


  useEffect(() => {
    const req = {
      brandValue: '',
      methodValue: '',
      providerValue: '',
      countryCodeValue: '',
      defaultSearch: true
    }
    prepareResult(req);
    prepareOnboardingPaymentMethods(props.merchantId);
  }, []);

  
  useEffect(() => {
    console.log('editingRowId updated:', editingRowId);
  }, [editingRowId]);


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
    // {
    //   field: 'countryCode',
    //   headerName: 'Country Code',
    //   width: 215,
    //   headerClassName: 'header-bg',
    //   cellClassName: 'cell-bg',
    //   renderCell: (params) => {
    //     const { field, value } = params;

    //     const handleSelectChange = (event) => {
    //       if (params.row.id === editingRowId) {
    //         setEditValues({
    //           ...editValues,
    //           [field]: event.target.value,
    //         });
    //       } else {
    //         const updatedRows = rows.map((row) =>
    //           row.id === params.row.id
    //             ? { ...row, [field]: event.target.value }
    //             : row
    //         );
    //         setRows(updatedRows);
    //       }
    //     };

    //     return (
    //       params.row.id === editingRowId || showDropdowns ? (
    //         <Select
    //           value={editValues.countryCode || value}
    //           onChange={handleSelectChange}
    //           style={{ width: '100%' }}
    //         >
    //           {countryList.map((country) => (
    //             <MenuItem key={country.code} value={country.description}>
    //               {country.description}
    //             </MenuItem>
    //           ))}
    //         </Select>
    //       ) : (
    //         value
    //       )
    //     );
    //   },
    // },
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
              value={editValues.paymentProvider || value}
              onChange={handleSelectChange}
              style={{
                width: '100%', padding: '0px 0px'
              }}
            >
              {providersList.map((provider) => (
                <MenuItem key={provider.priority} value={provider.priority}>
                  {provider.priority}
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
        renderCell: (params) => {
          const { row: { paymentMethodId } } = params;
          const isChecked = selectedPaymentMethods.includes(paymentMethodId);
  
          return (
            <div>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => handleCheckboxChange(paymentMethodId, e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
            </div>
          );
        },
      },
  ];


  const handleCheckboxChange = (paymentMethodId, isChecked) => {
    if (isChecked) {
      setSelectedPaymentMethods((prev) => [...prev, paymentMethodId]);
    } else {
      setSelectedPaymentMethods((prev) =>
        prev.filter((id) => id !== paymentMethodId)
      );
    }

    console.log("this is the selected payment method id : ",selectedPaymentMethods);
  };

  const savePaymentMethods = async () => {

    const req ={
      merchantId : props.merchantId,
      paymentMethodIds : selectedPaymentMethods
    }

    console.log("this is the active merchant :" , props.merchantId , req);
    setLoading(true);
    try {
      const response = await BenepayUserService.saveOnboardingPaymentMethodsDetails(req);

      console.log("Response for oboarding payment method api :", response);
      if (response.status == "SUCCESS") {
        toast.success("Payment method saved successfully");
        console.log("Payment method saved successfully!");

      } else {
        toast.error(response.merchantSplitError.errorMsg);
        console.error("Failed saving Payment Methods:", response.data);
      }
    } catch (error) {
      toast.error("Error during saving Payment Method");
      console.error("Error during Saving Payment Methods:", error);

    } finally {

      setLoading(false); // Reset loading state after the operation completes
    }
    

  };

  const prepareResult = async (req) => {

    setLoading(true);
    const result = await BenepayUserService.getPaymentRelationDetails(req);
    console.log("this is the result:  ", result);
    setBrandList(result.data.brandDataList);
    setCountryList(result.data.countryCodeData);
    setProvidersList(result.data.providersData);
    setMethodsList(result.data.methodsData);
    const dataWithIds = result.data.relationDataList.map((item, index) => ({
      ...item,
      id: index + 1
    }));
    setResult(dataWithIds);
    setLoading(false);

  }

  const prepareOnboardingPaymentMethods = async (merchantId) => {

    setLoading(true);
    const savedMethods = await BenepayUserService.getOnboardingPaymentMethodsDetails(merchantId);
      console.log("this is the savedMethods result:  ", savedMethods);

      const convertedMethods = savedMethods.map(method => parseInt(method, 10));
      setSavedMethods(convertedMethods)
      setSelectedPaymentMethods(convertedMethods);

    setLoading(false);

  }

  return html({
    result,
    columns,
    isLoading :loading,
    setSelectedPaymentMethods,
    savePaymentMethods,
    selectedPaymentMethods,
    selectionModel,
    setSelectionModel
  });
}

export default PaymentMethod;