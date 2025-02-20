import React from 'react';
import { useDropdown } from './DropdownContext';

export default MerchantSelectorComponent = (props) => {
    const { selectedValue, setSelectedValue } = useDropdown();

    const handleChange = (event) => {
        const value = event.target.value;
        setSelectedValue(value); // Update the state, which also updates sessionStorage
    };
}