import React, { createContext, useState, useEffect } from 'react';

// Create Context
export const MerchantSelectionContext = createContext();

export const MerchantSelectionProvider = ({ children }) => {
  const [merchantValue, setMerchantValue] = useState(sessionStorage.getItem('merchantId') || '');

  // Sync MerchantSelection value with sessionStorage
  useEffect(() => {
    if (merchantValue) {
      sessionStorage.setItem('merchantId', merchantValue);

      setMerchantValue(merchantValue);
    }
  }, [merchantValue]);

  return (
    <MerchantSelectionContext.Provider value={{ merchantValue, setMerchantValue }}>
      {children}
    </MerchantSelectionContext.Provider>
  );
};

export const useMerchantSelection = () => React.useContext(MerchantSelectionContext);