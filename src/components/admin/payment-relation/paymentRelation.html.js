/**
 * @author Anurag Pundir
 *
 */

import React, { useEffect, useState } from "react";
import PaymentRelationTable from './paymentRelationTable.html.js';
import "./paymentRelation.scss";
import {Grid} from '@material-ui/core';
import { Autocomplete, TextField, InputAdornment, Button } from "@mui/material";
import Loader from 'components/$widgets/loader';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ProviderPriorities from "./providerPriorities.js";
import { toast } from "react-toastify";

export function html({
  submitPaymentRelation,
  clearProcessedDetails,
  providersList,
  countryList,
  methodsList,
  paymentScopeList,
  brandList,
  disable,
  setBrand,
  setProvider,
  setMethod,
  setCountryCode,
  brand,
  provider,
  method,
  countryCode,
  result,
  columns,
  isLoading,
  SearchPaymentRelation,
  brandSearch,
  methodSearch,
  providerSearch,
  countryCodeSearch,
  setBrandSearch,
  setMethodSearch,
  setProviderSearch,
  setShowAddForm,
  showAddForm,
  handleAddClick,
  setCountryCodeSearch,
  providerPriorities,
  setProviderPriorities,
  paymentScope,
  setPaymentScope,
  paymentScopeSearch,
  setPaymentScopeSearch
}) {

  const [indx, setIndx] = useState(1);
  const [priorityList, setPriorityList] = useState([]);
  const [selectedProviderList, setSelectedProviderList] = useState([]);

  useEffect(() => {
    setSelectionLists();
  },[providersList.length, JSON.stringify(providerPriorities)])

  let setSelectionLists = () => {
    let selectedData = providerPriorities.filter((item) => item.provider != null && item.priority != null);
    let selectedPri = selectedData.map((item) => {return item.priority});
    let selectedPro = selectedData.map((item) => {return item.provider});

    let remainingPri = [];
    let remainigPro = [];

    providersList.map((item, index) => {
      if(!selectedPro.includes(item.paymentProviderName)){
        remainigPro.push(item);
      }
      if(!selectedPri.includes(index + 1)){
        remainingPri.push(index + 1);
      }
    });

    setSelectedProviderList(remainigPro);
    setPriorityList(remainingPri);

  }

  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <Loader loading={isLoading} />
      <Grid container>
        <Grid item xl={10} md={8} lg={8} sm={8}>
          <h1 style={{ color: 'var(--primary-color)', fontSize: '22px', fontFamily: 'sans-serif', marginTop: '15px' }}>Payments Method </h1>
        </Grid>
        <Grid item xl={2} md={4} lg={4} sm={4} style={{textAlign:'right'}}>
            <Button className='downloadButton' variant="outlined" onClick={() => {clearProcessedDetails(); handleAddClick();}} style={{margin:'1%',background: 'var(--secondary-color)', color: "var(--light-color)" }}>
              {showAddForm ? <RemoveIcon /> : <AddIcon />} Create/Edit
            </Button>
        </Grid>
      </Grid>

      <hr className='element-hr-divider' style={{ border: '0.1px solid #2f7fe3', width: '100%', opacity: '30%' }} />

      {showAddForm && (
        <>
          <Grid container spacing={4}>

            {/* Payment Methods */}
            <Grid item xs={12} md={3}>
              <label
                htmlFor="methods"
                className="py-1"
                style={{
                  whiteSpace: "nowrap",
                  fontWeight: "var(--font-weight-normal)",
                  fontSize: "var(--font-x-medium)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Payment Methods
              </label>
              <Autocomplete
                disablePortal
                id="methods"
                options={methodsList.map((item) => item.description)}
                getOptionLabel={(option) => option}
                onChange={(event, newValue) => setMethod(newValue)}
                value={method}
                renderInput={(params) => (
                  <TextField
                    className="form-control methodsSearch"
                    {...params}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {method && (
                            <InputAdornment onClick={() => setMethod(null)}>
                              {/* Add a clear icon here */}
                            </InputAdornment>
                          )}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            {/* Brand */}
            <Grid item xs={12} md={3}>
              <label
                htmlFor="Brand"
                className="py-1"
                style={{
                  whiteSpace: "nowrap",
                  fontWeight: "var(--font-weight-normal)",
                  fontSize: "var(--font-x-medium)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Brand
              </label>
              <Autocomplete
                disablePortal
                id="Brand"
                options={brandList.map((item) => item.description)}
                getOptionLabel={(option) => option}
                onChange={(event, newValue) => setBrand(newValue)}
                value={brand}
                renderInput={(params) => (
                  <TextField
                    className="form-control BankOrBrand"
                    {...params}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {brand && (
                            <InputAdornment onClick={() => setBrand(null)}>
                              {/* Add a clear icon here */}
                            </InputAdornment>
                          )}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            {/* Payment Scopes */}
            <Grid item xs={12} md={3}>
              <label
                htmlFor="paymentScope"
                className="py-1"
                style={{
                  whiteSpace: "nowrap",
                  fontWeight: "var(--font-weight-normal)",
                  fontSize: "var(--font-x-medium)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Payment Scope
              </label>
              <Autocomplete
                disablePortal
                id="paymentScope"
                options={paymentScopeList.map((item) => item.description)}
                getOptionLabel={(option) => option}
                onChange={(event, newValue) => setPaymentScope(newValue)}
                value={paymentScope}
                renderInput={(params) => (
                  <TextField
                    className="form-control methodsSearch"
                    {...params}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {method && (
                            <InputAdornment onClick={() => setPaymentScope(null)}>
                              {/* Add a clear icon here */}
                            </InputAdornment>
                          )}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            {/* Country Codes */}
            {/* <Grid item xs={12} md={3}>
              <label
                htmlFor="countryCode"
                className="py-1"
                style={{
                  whiteSpace: "nowrap",
                  fontWeight: "var(--font-weight-normal)",
                  fontSize: "var(--font-x-medium)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Country Codes
              </label>
              <Autocomplete
                disablePortal
                id="countryCode"
                options={countryList.map((item) => item.description)}
                getOptionLabel={(option) => option}
                onChange={(event, newValue) => setCountryCode(newValue)}
                value={countryCode}
                renderInput={(params) => (
                  <TextField
                    className="form-control countryList"
                    {...params}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {countryCode && (
                            <InputAdornment onClick={() => setCountryCode(null)}>
                            </InputAdornment>
                          )}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid> */}

            {providerPriorities && providerPriorities.length > 0 && <>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 16px',
                width: '100%'
              }}>
                <h1 style={{ color: 'var(--primary-color)', fontSize: '16px', fontFamily: 'sans-serif', marginTop: '8px' }}>Choose Providers and priority</h1>
                <h1 style={{ color: 'var(--primary-color)', fontSize: '16px', fontFamily: 'sans-serif', marginTop: '8px', cursor: 'pointer' }} onClick={() => {
                  let prev = providerPriorities;
                  if(prev.length == providersList.length){
                    toast.error(`Maximum ${providersList.length} providers can be added!`);
                    return;
                  }
                  prev.push({provider: null, priority: null});
                  setProviderPriorities(prev)
                  setIndx(indx + 1);
                }}>+ Add More Provider</h1>
              </div>
            </>}

            {indx && providerPriorities && providerPriorities.length > 0 && <>
              <Grid container spacing={4}>
                <Grid item xs={12} md={3}>
                  <label
                    htmlFor=""
                    className="py-1"
                    style={{
                      whiteSpace: "nowrap",
                      fontWeight: "var(--font-weight-normal)",
                      fontSize: "var(--font-x-medium)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >

                  </label>
                </Grid>
                <Grid item xs={12} md={3}>
                  <label
                    htmlFor=""
                    className="py-1"
                    style={{
                      whiteSpace: "nowrap",
                      fontWeight: "var(--font-weight-normal)",
                      fontSize: "var(--font-x-medium)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    Providers
                  </label>
                </Grid>
                <Grid item xs={12} md={3}>
                  <label
                    htmlFor=""
                    className="py-1"
                    style={{
                      whiteSpace: "nowrap",
                      fontWeight: "var(--font-weight-normal)",
                      fontSize: "var(--font-x-medium)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    Priority
                  </label>
                </Grid>
              </Grid>
              {providerPriorities.map((data, index) => {
                return indx && <>
                  <ProviderPriorities indx={indx} setIndx={setIndx} providerPriorities={providerPriorities} providersList={selectedProviderList} priorityList={priorityList} id={index} setProviderPriorities={setProviderPriorities} provider={data.provider} priority={data.priority}/>
                </>
              })}
            </>}

            {/* Buttons */}
            <div
              className="d-flex justify-content-start align-items-end"
              style={{
                padding: "18px 18px",
                minHeight: "50px",
              }}
            >
              <span style={{ marginRight: "60px" }}>
                <button
                  onClick={submitPaymentRelation}
                  style={{
                    padding: "8px 24px",
                    marginRight: "8px",
                    color: "var(--light-color)",
                    fontWeight: "var(--font-weight-normal)",
                    fontSize: "var(--font-x-medium)",
                    width: "154px",
                    background: "var(--accent-color)",
                    outline: "none",
                    border: "none",
                    borderRadius: "4px",
                    boxSizing: "border-box",
                  }}
                >
                  Submit
                </button>
                <button
                  onClick={() => {clearProcessedDetails(); handleAddClick();}}
                  style={{
                    padding: "8px 24px",
                    fontWeight: "var(--font-weight-normal)",
                    fontSize: "var(--font-x-medium)",
                    width: "154px",
                    background: "var(--light-color)",
                    outline: "none",
                    border: "none",
                    borderRadius: "4px",
                    color: "var(--accent-color)",
                    boxSizing: "border-box",
                  }}
                >
                  Cancel
                </button>
              </span>
            </div>
          </Grid>
        </>
      )}

      {!showAddForm && <>
{/* 
        <Grid item xl={10} md={8} lg={8} sm={8}>
          <h1 style={{ color: 'var(--primary-color)', fontSize: '22px', fontFamily: 'sans-serif', marginTop: '15px' }}>Filters</h1>
        </Grid> */}

        <Grid container spacing={4}>

          {/* <Grid item xs={12} md={3} >
            <label
              htmlFor="countrySearch"
              className="py-1"
              style={{
                whiteSpace: "nowrap",
                fontWeight: "var(--font-weight-normal)",
                fontSize: "var(--font-x-medium)",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Country Codes
            </label>
            <Autocomplete
              disablePortal
              id="countrySearch"
              options={countryList.map((item) => item.description)}
              getOptionLabel={(option) => option}
              onChange={(event, newValue) => setCountryCodeSearch(newValue)}
              value={countryCodeSearch}
              renderInput={(params) => (
                <TextField
                  className="form-control countryList"
                  {...params}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {countryCode && (
                          <InputAdornment onClick={() => setCountryCodeSearch(null)}>
                          </InputAdornment>
                        )}
                        {params.InputProps.endAdornment}
                      </>
                    )
                  }}
                />
              )}
            />

          </Grid> */}

          <Grid item xs={12} md={3} >
            <label
              htmlFor="methodsSearch"
              className="py-1"
              style={{
                whiteSpace: "nowrap",
                fontWeight: "var(--font-weight-normal)",
                fontSize: "var(--font-x-medium)",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Payment Methods
            </label>
            <Autocomplete
              disablePortal
              id="methodsSearch"
              options={methodsList.map((item) => item.description)}
              getOptionLabel={(option) => option}
              onChange={(event, newValue) => setMethodSearch(newValue)}
              value={methodSearch}
              renderInput={(params) => (
                <TextField
                  className="form-control methodsSearch"
                  {...params}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {method && (
                          <InputAdornment onClick={() => setMethodSearch(null)}>
                            {/* <IconButton > */}
                            {/* <ClearIcon  /> */}
                            {/* </IconButton> */}
                          </InputAdornment>
                        )}
                        {params.InputProps.endAdornment}
                      </>
                    )
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={3} >
            <label
              htmlFor="BrandSearch"
              className="py-1"
              style={{
                whiteSpace: "nowrap",
                fontWeight: "var(--font-weight-normal)",
                fontSize: "var(--font-x-medium)",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Brand
            </label>
            <Autocomplete
              disablePortal
              id="BrandSearch"
              options={brandList.map((item) => item.description)}
              getOptionLabel={(option) => option}
              onChange={(event, newValue) => setBrandSearch(newValue)}
              value={brandSearch}
              renderInput={(params) => (
                <TextField
                  className="form-control BankOrBrand"
                  {...params}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {brand && (
                          <InputAdornment onClick={() => setBrandSearch(null)}>
                            {/* <IconButton > */}
                            {/* <ClearIcon  /> */}
                            {/* </IconButton> */}
                          </InputAdornment>
                        )}
                        {params.InputProps.endAdornment}
                      </>
                    )
                  }}
                />
              )}
            />

          </Grid>

          <Grid item xs={12} md={3} >
            <label
              htmlFor="paymentScopeSearch"
              className="py-1"
              style={{
                whiteSpace: "nowrap",
                fontWeight: "var(--font-weight-normal)",
                fontSize: "var(--font-x-medium)",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Payment Scope
            </label>
            <Autocomplete
              disablePortal
              id="paymentScopeSearch"
              options={paymentScopeList.map((item) => item.description)}
              getOptionLabel={(option) => option}
              onChange={(event, newValue) => setPaymentScopeSearch(newValue)}
              value={paymentScopeSearch}
              renderInput={(params) => (
                <TextField
                  className="form-control paymentScopeList"
                  {...params}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {countryCode && (
                          <InputAdornment onClick={() => setPaymentScopeSearch(null)}>
                          </InputAdornment>
                        )}
                        {params.InputProps.endAdornment}
                      </>
                    )
                  }}
                />
              )}
            />

          </Grid>

          <Grid item xs={12} md={3} >
            <label
              htmlFor="providersList"
              className="py-1"
              style={{
                whiteSpace: "nowrap",
                fontWeight: "var(--font-weight-normal)",
                fontSize: "var(--font-x-medium)",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Providers
            </label>
            <Autocomplete
              disablePortal
              id="providersList"
              options={providersList.map((item) => item.paymentProviderName)}
              getOptionLabel={(option) => option}
              onChange={(event, newValue) => setProviderSearch(newValue)}
              value={providerSearch}
              renderInput={(params) => (
                <TextField
                  className="form-control providersList"
                  {...params}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {provider && (
                          <InputAdornment onClick={() => setProviderSearch(null)}>
                            {/* <IconButton > */}
                            {/* <ClearIcon  /> */}
                            {/* </IconButton> */}
                          </InputAdornment>
                        )}
                        {params.InputProps.endAdornment}
                      </>
                    )
                  }}
                />
              )}
            />

          </Grid>

          <div
            className="d-flex justify-content-start align-items-end"
            style={{
              padding: "18px 18px", // Add some padding for better spacing
              minHeight: "50px", // Ensure enough height for the container
            }}
          >
            <span style={{ marginRight: "60px" }}>
              <button
                onClick={SearchPaymentRelation}
                style={{
                  padding: "8px 24px",
                  marginRight: "8px",
                  color: "var(--light-color)",
                  fontWeight: "var(--font-weight-normal)",
                  fontSize: "var(--font-x-medium)",
                  width: "154px",
                  background: "var(--accent-color)",
                  outline: "none",
                  border: "none",
                  borderRadius: "4px",
                  boxSizing: "border-box", // Ensure proper sizing
                }}
              >
                Search
              </button>
              <button
                onClick={clearProcessedDetails}
                style={{
                  padding: "8px 24px",
                  fontWeight: "var(--font-weight-normal)",
                  fontSize: "var(--font-x-medium)",
                  width: "154px",
                  background: "var(--light-color)",
                  outline: "none",
                  border: "none",
                  borderRadius: "4px",
                  color: "var(--accent-color)",
                  boxSizing: "border-box", // Ensure proper sizing
                }}
              >
                Clear
              </button>
            </span>
          </div>
        </Grid>

        {result && result.length > 0 &&
          <PaymentRelationTable result={result} columns={columns} />
        }
      </>}

    </div>

  );
}
