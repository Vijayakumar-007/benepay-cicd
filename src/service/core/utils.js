import moment from "moment";
import axios from "axios";
import * as constants from "../../config/constants";
import { config } from "../../config/config";
import { FileType } from '../../enum/common.enum';
import { toast } from 'react-toastify';
import Validator from "./validator";
import el from "date-fns/locale/el";

export default class Utils {

    static getFormattedDate(date) {
        if (!date) {
            return ''
        }
        return moment(date).format('MMM D YYYY, h:mm A');
    }

    static getFormattedDate2(date) {
        if (!date) {
            return ''
        }
        return moment(date).format('DD-MM-YYYY h:mm A');
    }

    static getFormattedDate3(date) {
        if (!date) {
            return ''
        }
        return moment(date).format('DD MMM YYYY');
    }
    static getDefaultDateFormat(date) {
        if (!date) {
            return ''
        }
        return moment(date).format('DD-MM-YYYY');
    }

    /**
     * @author Vijayakumar
     * 
     * To format the date to date and month in 2 digit and separator will be customizable as require while using
     * Example: 01-12-1991 or 01/12/1991
     * 
     * @param {*} date 
     * @param {*} separator 
     * @returns String
     */
    static formatTwoDigitMonth(date, separator = "-") {
        if (!date) {
            return '';
        }

        return moment(date).format(`DD${separator}MM${separator}YYYY`);
    }

    static getFormattedDateCalendar(date) {
        if (!date) {
            return ''
        }
        return moment(date).format('MMM D YYYY');
    }

    static getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    static getVersion() {
        const v = config.version;
        return `${v.majorRevision}.${v.minorRevision}.${v.bugFixes}`
    }

    static getFormattedAddress(residentDetails) {
        return [residentDetails.address1,
        residentDetails.address2,
        residentDetails.cityOrTown,
        residentDetails.countyOrState,
        residentDetails.claimedCountry?.text,
        residentDetails.postCode].filter(Boolean).join(", ")
    }

    /**
     * Method to copying given value to paste anywhere 
     * 
     * @param {*} value 
     * @param {*} success 
     */
    static copyContent = (value, success) => {
        navigator.clipboard.writeText(value)
            .then(success)
            .catch((error) => {
                console.error('Unable to copy:', error);
            });
    };

    /**
     *  Method for format the date string in the system
     * 
     * @param {*} date 
     * @param {*} separator 
     * @returns 
     */
    static dateSystemFormat(date, separator = "/") {
        if (!date) {
            return '';
        }

        return moment(date).format(`DD${separator}MM${separator}YYYY`);
    }

    /**
     * Method for format the date and time string in the system
     * 
     * @param {*} date 
     * @param {*} separator 
     * @returns 
     */
    static datetimeSystemFormat(date, separator = "/") {
        if (!date) {
            return '';
        }

        return moment(date).format(`DD${separator}MM${separator}YYYY HH:mm:ss`);
    }

    /**
     * Method for format the date and time string to date
     * java date format convert here
     * 
     * @param {*} date 
     * @param {*} separator 
     * @returns 
     */
    static javaDateToJsFormat(date, separator = "/") {
        if (!date) {
            return '';
        }

        return moment(date, 'ddd MMM DD HH:mm:ss zzz YYYY').format(`DD${separator}MM${separator}YYYY`);
    }

    /**
      * Method to set null when value is empty 
      * 
      * @param {*} value 
      * @returns null
      */
    // static setNullWhenEmpty = (value) => {
    //     if (value === undefined) {
    //         return null;
    //     }

    //     value = value.trim();

    //     return (value) ? value : null;
    // }
    static setNullWhenEmpty = (value) => {
        if (value === undefined) {
            return null;
        }

        // Check if value is a string before calling trim
        if (typeof value === 'string') {
            value = value.trim();
        }

        return (value !== '') ? value : null;
    }


    /**
     * Method to set empty string when value is null
     * 
     * @param {*} value 
     * @returns string
     */
    static setEmptyWhenNull = (value) => {
        return (!value) ? "" : value;
    }

    /**
     * Method to set empty string when value is null
     * Handling 0 value, the "setEmptyWhenNull" method is ignoring the values,
     * that's why using the separate method
     * @param {*} value 
     * @returns string
     */
    static setEmptyWhenNullValues = (value) => {
        return (value === null || value === undefined || value === "") ? "" : value;
    }

    /**
     * Method to download different file types based on file name
     * @param {string} base64Content - Base64 encoded file content
     * @param {string} fileName - Name of the file with or without extension
     */
    static downloadBase64File = (base64Content, fileName) => {
        const fileType = fileName.split('.').pop(); 
        const byteCharacters = atob(base64Content);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: `application/${fileType}` });

        if ('download' in document.createElement('a')) {
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            link.click();

            window.URL.revokeObjectURL(link.href);
        } else if (window.navigator.msSaveBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileName);
        } else {
            toast.error('Error downloading file.');
        }
    };

    // Helper function to convert empty strings to null
    static setNullIfEmpty(value) {
        return value === '' ? null : value;
    }

    static formatPhoneNumber(phoneNumber, countryCode) {
        // Trim and replace country code if phoneNumber is not null
        console.log("input", countryCode, phoneNumber)
        const formattedPhoneNumber = this.setNullIfEmpty(phoneNumber);
        if (formattedPhoneNumber !== null) {

            console.log("forate", formattedPhoneNumber.replace("+" + countryCode, "").trim())
            return formattedPhoneNumber.replace("+" + countryCode, "").trim();

        }
        return null;
    }

    //Encrypting the data using base64
    static encrypt(data) {
        if (data && data !== '') {
            return btoa(data);
        } else {
            config.info("Invalid encrypt data");
        }
    }

    //Decrypting the data using base64
    static decrypt(data) {
        if (data && data !== '') {
            return atob(data);
        }
        else {
            config.info("Invalid decrypt token");
        }
    }

    static formatMobileNo(phoneNo, countryCode) {
        if (phoneNo && countryCode && phoneNo !== null && countryCode !== null) {
            let ctyCode = countryCode;

            if( Validator.isNotEmpty(phoneNo) ){
                // if code doesn't have + symbol add it before
                if(!ctyCode.includes("+")){
                    ctyCode = "+" + ctyCode;
                }
                
                if (phoneNo.startsWith(ctyCode)) {
                    phoneNo = phoneNo.replace(ctyCode, " ").trim();
                } else {
                    phoneNo = phoneNo;
                }

                return phoneNo.replace(/[()]/g, "").replace(/-/g, "").replace(" ", "-").replace(/\s/g, "");
            }
        }

        return null;
    }


    static formatCountryCode(countryCode) {
        if (countryCode && countryCode !== null) {
            if (countryCode.startsWith("+")) {
                return countryCode;
            } else {
                return "+" + countryCode;
            }
        }
        
        return null;
    }

    static concatenateAddressFields(fields) {
        return fields
            .map(Utils.setEmptyWhenNull)  // Apply the Utils.setEmptyWhenNull to each field
            .filter(field => field)       // Filter out empty or null values
            .join(', ');                  // Join the remaining values with a comma and space
    }

    static isNullOrEmpty(data) {
        if (data === null || data === undefined) {
            return true;
        }
        
        if (typeof data === 'string') {
            return data.trim().length === 0; // Empty or whitespace string
        }
    
        if (Array.isArray(data)) {
            return data.length === 0; // Empty array
        }
    
        if (typeof data === 'number') {
            return isNaN(data); // Check if the number is NaN
        }
    
        if (typeof data === 'object') {
            return Object.keys(data).length === 0; // Empty object
        }
    
        return false; // Not null, empty, or undefined
    }
    

    // Function to replace variables in the template string
    static stringReplace = (template, variables) => {
        return new Function(...Object.keys(variables), `return \`${template}\`;`)(...Object.values(variables));
    };

    static getBase64FromFile = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
