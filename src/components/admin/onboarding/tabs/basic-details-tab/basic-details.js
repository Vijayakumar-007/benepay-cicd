import { Component } from 'react';
import { html } from "./basic-details.html";
import FormValidationService from '../../../../../service/core/validate.service.js';
import { include } from 'underscore';
import { DashboardService } from '../../../../../service/api/dashboard.service';
import Utils from '../../../../../service/core/utils';
import { toast } from 'react-toastify';
import { OnboardConstants, messages } from '../../../../../config/constants';
import { Auth } from 'aws-amplify';
import { StorageService } from 'service/core/storage.service';
import { StorageKeys } from 'service/core/storage.service';
import Validator from 'service/core/validator';
import Button from '@mui/material/Button';

class BasicDetails extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            value: 0,
            loading: false,
            formFields: this.prepareField(this.fieldNames, this.rules),
            selectedTab: 0,
            merchantNamePrefix: [],
            merchantCountry: [],
            selectedDropdownValue: null,
            sameAsTradingAddress: true,
            formData: props.data || {},
            save: '',
            getPreValueState: '',
            deleteBD: '',
            merchantId: props.merchantId,
            prevFormFields: {},
            merchanIdForAfterSave: '',
            merchantTypeOptions: [],
            merchantIndustryList: [],
            fieldsOnchange: false,
            openBDdeletepopup: false,
            parentMerchantList:[],
            referralPartners:[],
            activeStatus:0,
            fetchBDloading:false,
            disableDeleteConfirmBtn:false,
            open:false,
            showAddIndustry:false,
        };
    }

    MERCHANT_TYPE_DEFAULT = "3";

    // form fields declaration
    fieldNames = [
        'merchantType',
        'merchantName',
        'country',
        'merchantShortName',
        'industry',
        'registrationNo',
        'tradingAddressLine1',
        'tradingAddressLine2',
        'townOrCity',
        'postCode',
        'stateOrCounty',
        'countryForTradingAddress',
        'mobileForTradingAddress',
        'mobileCountryCodeForTradingAddress',
        'regAddressLine1',
        'regAddressLine2',
        'townOrCityForRegAddress',
        'postCodeForRegAddress',
        'stateOrCountryForRegAddress',
        'countryForRegAddress',
        'mobileForRegAddress',
        'mobileCountryCodeForRegAddress',
        'prefixForPrimaryContact',
        'firstNameForPrimaryContact',
        'surnameForPrimaryContact',
        'emailForPrimaryContact',
        'designationForPrimaryContact',
        'mobileForPrimaryContact',
        'mobileCountryForPrimaryContact',
        'prefixForSecondaryContact',
        'firstNameForSecondaryContact',
        'surNameForSecondaryContact',
        'emailForSecondaryContact',
        'designationForSecondaryContact',
        'mobileForSecondaryContact',
        'mobileCountryForSecondaryContact',
        'allowPartialPayments',
        'parentCustomer',
        'referralPartner',
        'activeStatus',
    ];

    rules = {
        merchantType: [{ validate: 'required' }],
        merchantShortName: [{ validate: 'required' }, { validate: 'maxLength', maxLength: 15 }],
        merchantName: [{ validate: 'required' }],
        country: [{ validate: 'required' }],
        industry: [{ validate: 'required' }],
        // parentMerchant: [{ validate: 'required' }],
        registrationNo: [{ validate: 'required' }],
        tradingAddressLine1: [{ validate: 'required' }],
        townOrCity: [{ validate: 'required' }],
        postCode: [{ validate: 'required' }, { validate: 'postalCode' }],
        countryForTradingAddress: [{ validate: 'required' }],
        mobileForTradingAddress: [{ validate: 'mobile' }],
        regAddressLine1: [{ validate: 'required', type: 'depend', cb: () => { return this.state.sameAsTradingAddress === false; } }],
        townOrCityForRegAddress: [{ validate: 'required', type: 'depend', cb: () => { return this.state.sameAsTradingAddress === false; } }],
        postCodeForRegAddress: [
                                { validate: 'required', type: 'depend', cb: () =>  { return this.state.sameAsTradingAddress === false; }}, 
                                { validate: 'postalCode', type: 'depend', cb: () => { return this.state.sameAsTradingAddress === false;}}
                            ],
        countryForRegAddress: [{ validate: 'required', type: 'depend', cb: () => { return this.state.sameAsTradingAddress === false; } }],
        mobileForRegAddress: [{ validate: 'mobile', type: 'depend', cb: () => { return this.state.sameAsTradingAddress === false; } }],
        mobileForPrimaryContact: [{ validate: 'mobile' }],
        mobileForSecondaryContact: [{ validate: 'mobile' }],
    }


    componentDidMount = async () => {
        await Auth.currentSession().then(res => {
            let jwt = res["idToken"]["jwtToken"];
            StorageService.set(StorageKeys.clientJwt, jwt);
        });
        
        this.getNamePrefix();
        this.getMerchantCountry();
        this.getMerchantTypes();
        this.getMerchantIndustrys();
        this.getReferralMerchantList();
        await this.getParentMerchantList();
        document.querySelectorAll("input").forEach(n => {n.setAttribute("autoComplete", "none")});
    }


    componentDidUpdate = (prevProps) => {
        this.handleStage();

        if (prevProps.merchantId !== this.props.merchantId) {
            this.setState({ merchantId: this.props.merchantId },
               async () => await this.getParentMerchantList()
            );
        }
    }

    //Please don't comment or remove any lines in the method
    //!Be careful if you make any change in the componentDidUpdate
    handleStage = () => {
        if (this.props.saveBD) {
            //Give a parameter of tab index
            this.props.saveCallback(OnboardConstants.basicDetailsTabVal);
            this.saveMerchantBasicDetails();
        }

        if (this.props.getPreValue) {
            //Give a parameter of tab index
            this.props.getPreValueCallback(OnboardConstants.basicDetailsTabVal);
            this.fetchMerchantBasicDetails();
        }

        if (this.props.deleteMerchantBD) {
            //Give a parameter of tab index
            this.props.deleteCallback(OnboardConstants.basicDetailsTabVal);
            this.setState({ openBDdeletepopup: true });
        }
    }

    handleTabChange = (event, newValue) => {
        this.setState({ selectedTab: newValue });
    };

    handleDropdownChange = (event, newValue) => {
        this.setState({ selectedDropdownValue: newValue });
    };

    handleCountryDropdownChange = (event, newValue) => {
        this.setState({ selectedCountryValue: newValue });
    };

    handleCheckboxChange = () => {
        this.setState((prevState) => ({
            sameAsTradingAddress: !prevState.sameAsTradingAddress, fieldsOnchange: true
        }));
    }

    /**
     * Handle mobile number update while input tabout
     * 
     * @param {*} fieldName 
     * @param {*} value 
     * @param {*} cCode 
     */
    handleMobileTabOut = ( fieldName, value, cCode ) => {
        if (  cCode != "" && cCode != value.replace("+","") ) {
            this.updateFormField( fieldName, value, false);
        } else {
            this.updateFormField( fieldName, "", false);
        }
    }

    /**
     * Method to update the particular field in the form
     * after the updation trigger the field validation
     * 
     * @param {*} fieldName 
     * @param {*} value 
     * @param {*} validate 
     */
    updateFormField = (fieldName, value, validate = true, countryCode = "") => {

        if (!this.state.fieldsOnchange) {
            this.state.fieldsOnchange = true;
        }

        let fields = this.state.formFields;

        if (fields.hasOwnProperty(fieldName) != -1) {

            if(countryCode && fields[countryCode].value){
                fields[fieldName].value = value.replace("+", "") == fields[countryCode].value ? '' : value;
            }
            else{
                fields[fieldName].value = value;
            }
            console.log(fieldName,fields);
            this.setState({ formFields: fields });
        }

        if (validate) {
            this.validateField(fieldName);
        }

        if( fieldName == "merchantType" ){
            this.initMerchantTypeCallback( value );
        }
    }

    initMerchantTypeCallback = ( value ) => {
        if(!value){
            value = this.state.formFields.merchantType.value;
        }

        this.props.getMerchantTypeForTabChange(value);
    }

    /**
     * Validate the field based on designed rules
     * 
     * @param {*} fieldName 
     */
    validateField = async (fieldName) => {
        let field = this.state.formFields[fieldName];

        const { errors, valid } = await FormValidationService.validate(field.rules, field.value, this.state.formFields);

        this.state.formFields[fieldName].errors = errors;

        this.setState({ formFields: this.state.formFields });
    }

    /**
     * Validate the form fields
     * 
     * @returns 
     */
    validateForm = async () => {
        let formValid = true;
        for (let fieldName of this.fieldNames) {
            const field = this.state.formFields[fieldName];

            const { errors, valid } = await FormValidationService.validate(field.rules, field.value, this.state.formFields);

            this.state.formFields[fieldName].errors = errors;

            if (!valid) {
                formValid = false;
            }
        };

        this.setState({ formFields: this.state.formFields });

        return formValid;
    }

    /**
     * Method to assign basic field data 
     * 
     * @param fieldNames 
     * @param rules 
     * @returns 
     */
    prepareField = (fieldNames, rules) => {
        const fields = {};

        fieldNames.forEach(fieldName => {
            let value = '';

            if (fieldName == "merchantType") {
                value = this.MERCHANT_TYPE_DEFAULT;
            }

            if (fieldName == "country") {
                value = null;
            }

            if (fieldName == "industry") {
                value = null;
                
            } 
            
            if (fieldName == "allowPartialPayments") {
                value = false;
            }
            
            if (fieldName == "parentCustomer") {
                value = null;
            }
                
            fields[fieldName] = {
                rules: rules[fieldName] || [],
                value: value,
                errors: []
            };
        });
        this.initMerchantTypeCallback(this.MERCHANT_TYPE_DEFAULT);

        return fields;
    }

    /**
     * @author Ragavan
     * Save the Merchant Basic Details
     * Please don't comment or remove the else part in the method
     * @returns 
     */
    saveMerchantBasicDetails = async () => {
        let formValid = await this.validateForm();
        let mId = this.props.merchantId;
        var sendRes = { basicDetailsFormSave: false, merchanIdForAfterSave: '', message: false };

        if (mId && mId !== null) {
            if (formValid && this.state.fieldsOnchange) {
                this.setState({ loading: true });
                const formFields = this.state.formFields;
                const regAddressSameAsTradingAdd = this.state.sameAsTradingAddress;
                
                var requestObj = {
                    merchantId: Utils.setNullWhenEmpty(mId),
                    merchantType: Utils.setNullWhenEmpty(formFields.merchantType.value),
                    merchantName: Utils.setNullWhenEmpty(formFields.merchantName.value),
                    merchantShortName: Utils.setNullWhenEmpty(formFields.merchantShortName.value),
                    industryType: Utils.setNullWhenEmpty(formFields.industry.value),
                    parentCustomer: Utils.setNullWhenEmpty(formFields.parentCustomer.value),
                    merchantCountry: Utils.setNullWhenEmpty(formFields.country.value),
                    regnNo: Utils.setNullWhenEmpty(formFields.registrationNo.value),
                    sameRegTradingAddr: this.state.sameAsTradingAddress ? 1 : 2,
                    allowPartialPayments: formFields.allowPartialPayments.value ? formFields.allowPartialPayments.value : false,
                    referralPartner:Utils.setNullWhenEmpty(formFields.referralPartner.value),

                    tradingAddr: {
                        address1: Utils.setNullWhenEmpty(formFields.tradingAddressLine1.value),
                        address2: Utils.setNullWhenEmpty(formFields.tradingAddressLine2.value),
                        city: Utils.setNullWhenEmpty(formFields.townOrCity.value),
                        postalcode: Utils.setNullWhenEmpty(formFields.postCode.value),
                        state: Utils.setNullWhenEmpty(formFields.stateOrCounty.value),
                        country: Utils.setNullWhenEmpty(formFields.countryForTradingAddress.value),
                        phoneNo: Utils.formatMobileNo(Utils.setNullWhenEmpty(formFields.mobileForTradingAddress.value), formFields.mobileCountryCodeForTradingAddress.value),
                        phoneCtryCode: (formFields.mobileForTradingAddress.value) ? Utils.formatCountryCode(Utils.setNullWhenEmpty(formFields.mobileCountryCodeForTradingAddress.value)) : ""
                    },

                    registeredAddr: {
                        address1: regAddressSameAsTradingAdd ? Utils.setNullWhenEmpty(formFields.tradingAddressLine1.value) : Utils.setNullWhenEmpty(formFields.regAddressLine1.value),
                        address2: regAddressSameAsTradingAdd ? Utils.setNullWhenEmpty(formFields.tradingAddressLine2.value) : Utils.setNullWhenEmpty(formFields.regAddressLine2.value),
                        city: regAddressSameAsTradingAdd ? Utils.setNullWhenEmpty(formFields.townOrCity.value) : Utils.setNullWhenEmpty(formFields.townOrCityForRegAddress.value),
                        postalcode: regAddressSameAsTradingAdd ? Utils.setNullWhenEmpty(formFields.postCode.value) : Utils.setNullWhenEmpty(formFields.postCodeForRegAddress.value),
                        state: regAddressSameAsTradingAdd ? Utils.setNullWhenEmpty(formFields.stateOrCounty.value) : Utils.setNullWhenEmpty(formFields.stateOrCountryForRegAddress.value),
                        country: regAddressSameAsTradingAdd ? Utils.setNullWhenEmpty(formFields.countryForTradingAddress.value) : Utils.setNullWhenEmpty(formFields.countryForRegAddress.value),
                        phoneNo: regAddressSameAsTradingAdd ? Utils.formatMobileNo(Utils.setNullWhenEmpty(formFields.mobileForTradingAddress.value), formFields.mobileCountryCodeForTradingAddress.value) : Utils.formatMobileNo(Utils.setNullWhenEmpty(formFields.mobileForRegAddress.value), formFields.mobileCountryCodeForRegAddress.value),
                        phoneCtryCode: regAddressSameAsTradingAdd ? Utils.formatCountryCode(Utils.setNullWhenEmpty(formFields.mobileCountryCodeForTradingAddress.value)) : (formFields.mobileForRegAddress.value) ? Utils.formatCountryCode(Utils.setNullWhenEmpty(formFields.mobileCountryCodeForRegAddress.value)):null
                    },

                    primaryContact: {
                        namePrefix: Utils.setNullWhenEmpty(formFields.prefixForPrimaryContact.value),
                        firstName: Utils.setNullWhenEmpty(formFields.firstNameForPrimaryContact.value),
                        lastName: Utils.setNullWhenEmpty(formFields.surnameForPrimaryContact.value),
                        emailId: Utils.setNullWhenEmpty(formFields.emailForPrimaryContact.value),
                        designation: Utils.setNullWhenEmpty(formFields.designationForPrimaryContact.value),
                        phoneNo: Utils.formatMobileNo(Utils.setNullWhenEmpty(formFields.mobileForPrimaryContact.value), formFields.mobileCountryForPrimaryContact.value),
                        phoneCtryCode: Utils.formatCountryCode(Utils.setNullWhenEmpty(formFields.mobileCountryForPrimaryContact.value))
                    },

                    secondaryContact: {
                        namePrefix: Utils.setNullWhenEmpty(formFields.prefixForSecondaryContact.value),
                        firstName: Utils.setNullWhenEmpty(formFields.firstNameForSecondaryContact.value),
                        lastName: Utils.setNullWhenEmpty(formFields.surNameForSecondaryContact.value),
                        emailId: Utils.setNullWhenEmpty(formFields.emailForSecondaryContact.value),
                        designation: Utils.setNullWhenEmpty(formFields.designationForSecondaryContact.value),
                        phoneNo: Utils.formatMobileNo(Utils.setNullWhenEmpty(formFields.mobileForSecondaryContact.value), formFields.mobileCountryForSecondaryContact.value),
                        phoneCtryCode: Utils.formatCountryCode(Utils.setNullWhenEmpty(formFields.mobileCountryForSecondaryContact.value))
                    }
                    
                }
                if (formFields.merchantType.value === OnboardConstants.ReferralMerchant) {
                    if (!requestObj.merchantId.startsWith(OnboardConstants.ReferralMerchantPrefix)) {
                        requestObj.merchantId = `${OnboardConstants.ReferralMerchantPrefix} ${requestObj.merchantId}`;
                    }
                    
                }

                const response = await DashboardService.saveMerchantBasicDetails(requestObj);

                if (response && response.statusCode == "200" && response !== undefined) {

                    //Method handle the delete and clear button show/hide
                    this.props.resetBtnConfigFlag(OnboardConstants.basicDetailsTabVal);

                    this.setState({ save: OnboardConstants.DONE, merchanIdForAfterSave: response.merchantId, loading: false });

                    sendRes.basicDetailsFormSave = true;
                    sendRes.message = true;
                    sendRes.merchanIdForAfterSave = this.state.merchanIdForAfterSave;
                }
                else {
                    this.setState({ loading: false });
                }
            }
            else {
                if ( this.state.formFields.activeStatus.value === OnboardConstants.ActiveStatus && !this.state.fieldsOnchange && !formValid) {
                    sendRes.basicDetailsFormSave = false;
                    sendRes.message = false;
                    
                } else if ( this.state.formFields.activeStatus.value === OnboardConstants.ActiveStatus && !this.state.fieldsOnchange && formValid) {
                    sendRes.basicDetailsFormSave = true;
                    sendRes.message = false;
                } else if (this.state.formFields.activeStatus.value === OnboardConstants.InActiveStatus && !this.state.fieldsOnchange) {
                    sendRes.basicDetailsFormSave = true;
                    sendRes.message = false;
                }
            }
        }
        else {
            this.setState({ save: '' });
        }

        this.props.saveResponse(sendRes);
    }



    /**
     * update the each fields in the form
     * after the updation trigger the field validation
     * 
     * @param {*} formFields 
     */
    updateFormFields = async (formFields) => {
        await this.setState({ formFields: formFields });
    }

    //Frame the trading address forms fields to save
    prepareTradingAddr = (formFields, data) => {
        if (data && data.tradingAddr !== null) {
            formFields.tradingAddressLine1.value = Utils.setEmptyWhenNull(data.tradingAddr.address1);
            formFields.tradingAddressLine2.value = Utils.setEmptyWhenNull(data.tradingAddr.address2);
            formFields.townOrCity.value = Utils.setEmptyWhenNull(data.tradingAddr.city);
            formFields.postCode.value = Utils.setEmptyWhenNull(data.tradingAddr.postalcode);
            formFields.stateOrCounty.value = Utils.setEmptyWhenNull(data.tradingAddr.state);
            formFields.countryForTradingAddress.value = Utils.setEmptyWhenNull(data.tradingAddr.country);
            
            if( Validator.isNotEmpty(data.tradingAddr.phoneNo) ){
                formFields.mobileForTradingAddress.value = Utils.setEmptyWhenNull(data.tradingAddr.phoneCtryCode + data.tradingAddr.phoneNo);
                formFields.mobileCountryCodeForTradingAddress.value = Utils.setEmptyWhenNull(data.tradingAddr.phoneCtryCode);
            }
        }
    };

    //Frame the Register address form fields to save
    prepareRegAddr = (formFields, data) => {
        if (data && data.registeredAddr !== null) {
            formFields.regAddressLine1.value = Utils.setEmptyWhenNull(data.registeredAddr.address1);
            formFields.regAddressLine2.value = Utils.setEmptyWhenNull(data.registeredAddr.address2);
            formFields.townOrCityForRegAddress.value = Utils.setEmptyWhenNull(data.registeredAddr.city);
            formFields.postCodeForRegAddress.value = Utils.setEmptyWhenNull(data.registeredAddr.postalcode);
            formFields.stateOrCountryForRegAddress.value = Utils.setEmptyWhenNull(data.registeredAddr.state);
            formFields.countryForRegAddress.value = Utils.setEmptyWhenNull(data.registeredAddr.country);
            
            if( Validator.isNotEmpty(data.registeredAddr.phoneNo) ){
                formFields.mobileForRegAddress.value = Utils.setEmptyWhenNull(data.registeredAddr.phoneCtryCode + data.registeredAddr.phoneNo);
                formFields.mobileCountryCodeForRegAddress.value = Utils.setEmptyWhenNull(data.registeredAddr.phoneCtryCode);
            }
        }
    };

    //Frame the Primary Contact forms fields to save
    preparePrimaryContact = (formFields, data) => {
        if (data && data.primaryContact !== null) {
            formFields.prefixForPrimaryContact.value = Utils.setEmptyWhenNull(data.primaryContact.namePrefix);
            formFields.firstNameForPrimaryContact.value = Utils.setEmptyWhenNull(data.primaryContact.firstName);
            formFields.surnameForPrimaryContact.value = Utils.setEmptyWhenNull(data.primaryContact.lastName);
            formFields.emailForPrimaryContact.value = Utils.setEmptyWhenNull(data.primaryContact.emailId);
            formFields.designationForPrimaryContact.value = Utils.setEmptyWhenNull(data.primaryContact.designation);

            if( Validator.isNotEmpty(data.primaryContact.phoneNo) ){
                formFields.mobileForPrimaryContact.value = Utils.setEmptyWhenNull(data.primaryContact.phoneCtryCode + data.primaryContact.phoneNo);
                formFields.mobileCountryForPrimaryContact.value = Utils.setEmptyWhenNull(data.primaryContact.phoneCtryCode);
            }
        }
    };

    //Frame the Secondary Contact forms fields to save
    prepareSecondaryContact = (formFields, data) => {
        if (data && data.secondaryContact !== null) {
            formFields.prefixForSecondaryContact.value = Utils.setEmptyWhenNull(data.secondaryContact.namePrefix);
            formFields.firstNameForSecondaryContact.value = Utils.setEmptyWhenNull(data.secondaryContact.firstName);
            formFields.surNameForSecondaryContact.value = Utils.setEmptyWhenNull(data.secondaryContact.lastName);
            formFields.emailForSecondaryContact.value = Utils.setEmptyWhenNull(data.secondaryContact.email);
            formFields.designationForSecondaryContact.value = Utils.setEmptyWhenNull(data.secondaryContact.designation);
            
            if( Validator.isNotEmpty(data.secondaryContact.phoneNo) ){
                formFields.mobileForSecondaryContact.value = Utils.setEmptyWhenNull(data.secondaryContact.phoneCtryCode + data.secondaryContact.phoneNo);
                formFields.mobileCountryForSecondaryContact.value = Utils.setEmptyWhenNull(data.secondaryContact.phoneCtryCode);
            }
        }
    };

    /**
     * Fetch and set values
     * 
     * @returns 
     */
    fetchMerchantBasicDetails = async () => {
        let merchantId = this.props.merchantId;
        const formFields = this.state.formFields;

        if (merchantId) {
            this.setState({ fetchBDloading: true });

            const res = await DashboardService.fetchMerchantBasicDetails(merchantId);

            if (res && res.merchantBasicDetails.length > 0) {

                var data = res.merchantBasicDetails[0];
                
                let sendRes = { merchanIdForAfterSave: data.merchantId };
                this.props.saveResponse(sendRes);

                //Method handle the delete and clear button show/hide
                this.props.resetBtnConfigFlag(OnboardConstants.basicDetailsTabVal);

                this.setState({
                    sameAsTradingAddress: data.sameRegTradingAddr == 1 ? true : false
                });

                formFields.merchantName.value = Utils.setEmptyWhenNull(data.merchantName);
                formFields.merchantType.value = Utils.setEmptyWhenNull(data.merchantType);
                formFields.merchantShortName.value = Utils.setEmptyWhenNull(data.merchantShortName);
                formFields.industry.value = Utils.setEmptyWhenNull(data.industryType);
                formFields.country.value = Utils.setEmptyWhenNull(data.country);
                formFields.registrationNo.value = Utils.setEmptyWhenNull(data.regnNo);
                formFields.parentCustomer.value = Utils.setEmptyWhenNull(data.parentCustomerId);
                formFields.referralPartner.value = Utils.setEmptyWhenNull(data.referralPartnerId);
                formFields.activeStatus.value=(data.activeStatus ? data.activeStatus : this.state.activeStatus )

                this.prepareTradingAddr(formFields, data);
                this.prepareRegAddr(formFields, data);
                this.preparePrimaryContact(formFields, data);
                this.prepareSecondaryContact(formFields, data);

                await this.updateFormFields(formFields);

                this.initMerchantTypeCallback();
            }

            this.setState({ fetchBDloading: false });
        }
    }

    /**
     * Method to refresh the form fields
     */
    resetForm = async (callFetch = false) => {
        this.setState({
            formFields: this.prepareField(this.fieldNames, this.rules),
        }, () => callFetch ? this.fetchMerchantBasicDetails() : {});
    }

    /**
     * Delete trading, register address and primary, secondary contact also
     */
    deleteBD = async () => {
        if (this.state.merchantId) {

            this.setState({disableDeleteConfirmBtn:true});

            const res = await DashboardService.deleteMerchantBasicDetails(this.state.merchantId);

            if (res.statusCode == "200") {
                this.setState({ openBDdeletepopup: false, disableDeleteConfirmBtn:false }, () => {
                    toast.success(messages.successDeleteBasicDetails);
                    this.resetForm(true);
                });
            }else{
                this.setState({disableDeleteConfirmBtn:false});
            }
        }
        else {
            this.setState({ openBDdeletepopup: false }, () => {
                toast.error(messages.errorDeleteBasicDetails);
            });
        }
    }

    /**
     * Fetch name prefix in lookup details
     */
    getNamePrefix = async () => {
        this.setState({loading:true});
        const result = await DashboardService.getLookupDetails("namePrefix");

        if (result && result.lookupDetails && result.lookupDetails.length > 0) {
            this.setState({ merchantNamePrefix: result.lookupDetails, loading:false })
        }else{
            this.setState({loading:false});
        }

    }

    /**
     * Fetch merchant country in lookup details
     */
    getMerchantCountry = async () => {
        this.setState({loading:true});
        const result = await DashboardService.getLookupDetails("country");

        if (result && result.lookupDetails && result.lookupDetails.length > 0) {
            this.setState({ merchantCountry: result.lookupDetails, loading:false })
        }else{
            this.setState({loading:false});
        }
    }

    /**
     * Fetch merchant types in lookup details
     */
    getMerchantTypes = async () => {
        this.setState({loading:true});
        const result = await DashboardService.getLookupDetails("merchantType");

        if (result && result.lookupDetails && result.lookupDetails.length > 0) {
            this.setState({ merchantTypeOptions: result.lookupDetails, loading:false })
        }else{
            this.setState({loading:false});
        }
    }

    /**
     * Fetch merchant industrys in lookup details
     */
    getMerchantIndustrys = async () => {
        this.setState({loading:true});
        const result = await DashboardService.getLookupDetails("merchantIndustry");

        if (result && result.lookupDetails && result.lookupDetails.length > 0) {
            this.setState({ merchantIndustryList: result.lookupDetails, loading:false })
        }else{
            this.setState({loading:false});
        }
    } 

    // method  to store filtered referral merchantIds
    getReferralMerchantList = async () => {
      
        this.setState({ loading: true });
        const result = await DashboardService.getMerchantSummaryList();
       if (result && typeof result === 'object') {
            var referralPartners = [];

            // Iterate over each key (array) in the result object
            Object.keys(result).forEach(key => {
                const merchantArray = result[key]; // Get the array from the current key
                // Iterate over each merchant in the array
                merchantArray.forEach(merchant => {
                    // Check if merchant is an object and has merchantType equal to "4"
                    if (merchant && merchant.merchantType == OnboardConstants.ReferralMerchant) {
                        referralPartners.push(merchant);
                    }
                });
            });
            this.setState({referralPartners, loading: false });
        } else {
            // If result is not an object or is empty, set parentMerchantList to empty array and loading to false
            this.setState({ parentMerchantList: [], loading: false });
        }

    }

// method to show the addIndustry Model 
    handleIndustryChange=(e,newValue)=>{

        if (newValue && newValue.lookupCode === 'add-industry') {
            this.updateFormField("industry", null);
            this.setState({ showAddIndustry: true });
          
        } else {
            this.updateFormField("industry", newValue ? newValue.lookupCode : null);
        }
    }

// method to render addIndustry button as an option in dropdown
    renderOption = (props, option) => {
        if (props.lookupCode === 'add-industry') {
          return (
            <Button style={{paddingLeft: '2px',textTransform: 'capitalize' , backgroundColor: 'transparent'
            }} >
             Add New Industry
            </Button>
          );
        } else {
          return <span >{props.description}</span>;
        }
      };


    getParentMerchantList = async () => {

        let { merchantId } = this.state;
        this.setState({ loadingForParentList: true });

        try {
            // Set merchantId to null if it's empty or null
            if (!merchantId) {
                merchantId = null;
            }
           
            console.log("this.state.merchantId",this.state.merchantId);
            const result = await DashboardService.getParentCustomerList(merchantId);

            if (Array.isArray(result)) {
                const merchantIds = result.filter(merchant => merchant && merchant.merchantId != merchantId);
                this.setState({ parentMerchantList: merchantIds });
            } else {
                this.setState({ parentMerchantList: [] });
            }
        } catch (error) {
            console.error("Error fetching parent merchant list:", error);
            this.setState({ parentMerchantList: [] });
        } finally {
            this.setState({ loadingForParentList: false });
        }
    }
    
    
    
    //Clear Address and contact fields
    clearBDFormValues = () =>{
        this.resetForm(false);
    }

    render = () => html.apply(this);

}

export default BasicDetails;
