import _ from 'lodash';
import { isValidPhoneNumber } from 'libphonenumber-js';

export default class Validator {
    static isEmail(email) {
        const reg = /^[a-z]+([a-z0-9_.])*@[a-z]+(\.[a-z]+)+$/i;
        return reg.test(email);
    }

    static isPasswordValid(string) {
        const reg = new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})");
        return reg.test(string);
    }

    static isPhoneValid(phone) {
        const reg = /^\d{10}$/;
        return reg.test(phone);
    }

    static isOTPValid(otp) {
        const reg = /^\d{4}$/;
        return reg.test(otp);
    }

    static isTagValid(tag) {
        const reg = /^[A-Za-z0-9_]{2}$/;
        return reg.test(tag);
    }
    static isModificationFlagValid(modificationFlag) {
        const reg = /^[A-Za-z0-9_]{2}$/;
        return reg.test(modificationFlag);
    }
    static isCountryCodeValid(countryCode) {
        const reg = /^[A-Za-z]{2}$/;
        return reg.test(countryCode);
    }

    /**
     * validate non-empty to check for mandatory
     * 
     * @param value 
     * @returns 
     */
    static isNotEmpty(value) {
        if (typeof value != 'number') {
            return !_.isEmpty(value);
        }

        return true;
    }

    /**
     * validate to check  value is non-negative
     * 
     * @param value
     * @returns 
     */
    static isPositiveNumber(value) {
        return (Math.sign(value) !== -1) ? true : false;
    }

    /**
     * Validate decimal number
     * 
     * @param {*} value 
     * @param {*} decimal 
     * @returns 
     */
    static isValidDecimal(value, decimal) {
        let parts = value.toString().split('.');

        if (decimal == 0) {
            return (parts.length == 1);
        }

        var isValidated = /^[-+]?[0-9]+\.[0-9]+$/.test(value);

        if (!isValidated) {
            return false;
        }

        return parts[1].length == decimal;
    }

    /**
     * Validate mobile number
     * 
     * @param {*} value 
     * @param {*} decimal 
     * @returns 
     */
    static async isValidMobileNumber(value) {
        return isValidPhoneNumber(value);
    }

    static isValidLogoType(file) {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/heic', 'image/heif', 'image/png'];
        return file && allowedTypes.includes(file.type);
    }

    static getAllowedLogoTypes() {
        const allowedTypes = ['jpeg', 'jpg', 'heic', 'heif', 'png'];
        return allowedTypes.map(type => `${type}`);
    }

    /**
     * File format validation message concatenation
     * 
     * @param {*} formats 
     * @returns 
     */
    static allowedFileFormats(formats = []) {
        return formats.map(type => `${type}`);
    }
    
    /**
     * File format validation
     * 
     * @param {*} formats 
     * @param {*} file 
     * @returns 
     */
    static validateFileFormats(formats = [], file) {        
        return file && formats.includes(file.type);
    }

    /**
     * Validate user name
     * 
     * @param {*} value
     * @returns 
     */
    static isStartsWithAlphabet(value) {
        const reg = /^([A-z]).*$/;
        return reg.test(value);
    }

    /**
     * Validate user name
     * 
     * @param {*} value
     * @returns 
     */
    static isValidName(value) {
        const reg = /^(?=[A-z])?([A-Za-z\-\d\s]+)$/;
        return reg.test(value);
    }

    /**
     * Validate to repeat special character used
     * 
     * @param {*} value
     * @returns 
     */
    static hasRepeatedSpecialCharacters(value) {
        // Define a regular expression pattern for special characters
        const specialCharPattern = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;
      
        // Iterate through each character in the input
        for (let i = 0; i < value.length - 1; i++) {
          const currentChar = value[i];
          const nextChar = value[i + 1];
      
          // Check if both characters are special characters
          if (specialCharPattern.test(currentChar) && specialCharPattern.test(nextChar)) {
            return true; // Found repeated special characters
          }
        }
      
        return false; // No repeated special characters found
      }
    
    /**
     * validating the values are numbers
     * 
     * @param {*} value 
     * @returns 
     */
    static numbersOnly(value){
        try {
            const numberRegex = /^[0-9]*$/;

            return numberRegex.test(value) ? true : false;
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * validating the value are unique
     * 
     * @param {*} value 
     * @param {*} arrayList 
     * @param {*} indexName 
     * @returns 
     */
    static valueIsUnique(value, arrayList, indexName, id=''){
        try {
            if(value && value != null && arrayList.length > 0 && indexName && indexName != null){
                const matchedIndex = arrayList.findIndex(item => item[indexName] === value && item.settlementId !== id);
                return matchedIndex === -1;
            }
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Amount field validation
     *
     * @param {*} value 
     * @returns 
     */
    static AmountValidation(value){
        try {
            if(value != "" && value != null){
                const regex = /^\d+(\.\d{1,15})?$/;

                return regex.test(value);
            }

            return false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}
