import React, { useState } from 'react';
import { useMerchantSelection } from 'provider/merchantSelectionProvider';
import { Autocomplete, TextField } from '@mui/material';
import Validator from 'service/core/validator';
import { StorageKeys, StorageService } from 'service/core/storage.service';

const MerchantSelectorComponent = (props) => {
  const { merchantValue, setMerchantValue } = useMerchantSelection();

  const merchants = props.merchantsList;

  const handleChange = (event, value) => {
    if (Validator.isNotEmpty(value) && Validator.isNotEmpty(value.merchantId)) {
      StorageService.set(StorageKeys.merchantId, value.merchantId);
      StorageService.set(StorageKeys.selectedMerchantId, value.merchantName);

      setMerchantValue(value.merchantId);
    }

    if (value == null) {
      setMerchantValue(null);
    }
  };

  return (
    <Autocomplete
      disablePortal
      id="merchantList"
      options={merchants || []}
      onChange={handleChange}
      value={
        merchants
          ? merchants.find(v => v.merchantId === merchantValue) ||
          merchants.find(v => v.merchantId === "All") // Default to "All"
          : null
      }
      getOptionLabel={(option) => `${option.merchantName}`}
      key={(option) => `${option.merchantId}`}
      renderInput={(params) => (
        <TextField
          className="form-control merchantSelector"
          {...params}
        />
      )}
    />
  );
};

export default MerchantSelectorComponent;