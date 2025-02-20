import React, { Component } from 'react';

import { html } from "./form.html";

import FormValidationService from '../../../../../../service/core/validate.service';
import Utils from '../../../../../../service/core/utils';

class Notification extends Component {

    SAVE_INITIATED = "initiated";
    SAVE_INPROGRESS = "inprogress";
    SAVE_DONE = "done";

    fieldNames = [
        'nmSMS',
        'nmWApp',
        'nmEmail',
        'npSMS',
        'npWApp',
        'npEmail',
        'smsNumber',
        'smsCcyCode',
        'wAppNumber',
        'wAppCcyCode',
        'emailIds'
    ];

    rules = {
        smsNumber: [
            {
                validate: 'required',
                type: 'depend',
                cb: () => {
                    return this.state.formFields.nmSMS.value === true;
                }
            },
            { validate: 'mobile' }
        ],
        wAppNumber: [
            {
                validate: 'required',
                type: 'depend',
                cb: () => {
                    return this.state.formFields.nmWApp.value === true;
                }
            },
            { validate: 'mobile' }
        ],
        emailIds: [
            {
                validate: 'required',
                type: 'depend',
                cb: () => {
                    return this.state.formFields.nmEmail.value === true;
                }
            },
            {
                validate: 'multiEmail',
                type: 'depend',
                cb: () => {
                    return this.state.formFields.nmEmail.value === true;
                }
            }
        ],
    }

    constructor(props) {
        super(props);

        this.state = {
            formKey: props.id,
            title: props.title,
            showMerchant: props.merchant ? true : false,
            formFields: this.prepareField(this.fieldNames, this.rules),
            save: '',
        }
    }

    //Please don't comment or remove any lines in the method
    //!Be careful if you make any change in the componentDidUpdate
    componentDidUpdate = (prevProps) => {
        if (this.props.ntnDatas !== prevProps.ntnDatas) {
            this.updateForms(this.props);
        }

        if (this.props.flagForClearValues) {
            //Give a parameter of tab index
            this.props.resetFlags("clear");
            this.resetForm();
        }
    }

    /**
     * Handle mobile number update while input tabout
     * 
     * @param {*} fieldName 
     * @param {*} value 
     * @param {*} cCode 
     */
    handleMobileTabOut = ( fieldName, value, cCode, formKey ) => {
        var validation = false;
        var formFields = this.state.formFields;

        if(fieldName == "smsNumber" && formFields.nmSMS.value == true){
            validation = true;
        }else if(fieldName == "wAppNumber" && formFields.nmWApp.value == true){
            validation = true;
        }

        if ( cCode != "" && cCode != value.replace("+","") ) {
            this.updateFormField( fieldName, value, true, formKey);
        } else {
            this.updateFormField( fieldName, "", validation, formKey);
        }
    }

    /**
    * update the each fields in the form
    * after the updation trigger the field validation
    * 
    * @param {*} formFields 
    */
    updateFormFields = (formFields, validate = true) => {
        this.setState({ formFields: formFields });

        if (validate) {
            this.validateForm();
        }
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
     * Validate the field based on designed rules
     * 
     * @param {*} fieldName 
     */
    validateField = async (fieldName) => {
        let field = this.state.formFields[fieldName];
        let formValid = true;

        const { errors, valid } = await FormValidationService.validate(field.rules, field.value, this.state.formFields);

        this.state.formFields[fieldName].errors = errors;
        formValid = valid;

        this.setState({ formFields: this.state.formFields });

        return formValid;
    }

    /**
     * Method to refresh the form fields
     */
    resetField = async (fields) => {
        var updatedFormFields = { ...this.state.formFields };

        if (fields && fields.length > 0) {
            fields.forEach((v) => {
                const updatedField = this.prepareField([v], this.rules);
                updatedFormFields = { ...updatedFormFields, ...updatedField };
            });
        }

        await this.setState({ formFields: updatedFormFields });
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

            fields[fieldName] = {
                rules: rules[fieldName] || [],
                value: value,
                errors: []
            };
        });

        return fields;
    }

    /**
    * Method to update the particular field in the form
    * after the updation trigger the field validation
    * 
    * @param {*} fieldName 
    * @param {*} value 
    * @param {*} validate 
    */
    updateFormField = async (fieldName, value, validate = true, formType = "") => {
        let fields = this.state.formFields;
        var formValid = true;

        if (fields.hasOwnProperty(fieldName) != -1) {
            fields[fieldName].value = value;

            this.setState({ formFields: fields });
        }

        if (validate) {
            formValid = await this.validateField(fieldName);
        }

        if (fieldName === "npSMS" || fieldName === "npWApp" || fieldName === "npEmail") {
            var notifyPayer = this.formatAction();
            this.props.prepareAPIResponse(formType, fieldName, notifyPayer, formValid);
        }
        else {
            this.props.prepareAPIResponse(formType, fieldName, value, formValid);
        }

        return formValid;
    }

    /**
     * @author Ragavan
     * Format the payment,refund,cancellation fields
     * Store in XXX format - 1st X API, 2nd X File Upload, 3rd X Screen, Store 1 for Yes and 0 for No, ex: 001 means only Screen upload required
     * @param {*} value 
     * @returns 
     */
    formatAction = () => {
        const formFields = this.state.formFields;

        let formattedValue = '';

        if (formFields.npSMS.value) {
            formattedValue += '1';
        } else {
            formattedValue += '0';
        }

        if (formFields.npWApp.value) {
            formattedValue += '1';
        } else {
            formattedValue += '0';
        }

        if (formFields.npEmail.value) {
            formattedValue += '1';
        } else {
            formattedValue += '0';
        }

        return formattedValue;
    }

    handleCheckBoxClick = (e, field, inputField = "", ccyCode = "", formType = "") => {
        var checked = e.target.checked;
        const formfield = this.state.formFields;

        if (checked) {
            this.updateFormField(field, checked, true, formType);

            if (inputField !== "") {
                this.updateFormField(inputField, formfield[inputField].value, true, formType);
            }
        }
        else if (!checked) {
            this.updateFormField(field, checked, true, formType);

            if (inputField !== "") {
                let field = [ccyCode, inputField]
                this.resetField(field);
            }
        }
    }

    handleNPCheckBoxs = (formFields, value) => {
        if (value) {
            var letters = value.split('');

            if (letters[0] == "1") {
                formFields.npSMS.value = true;
            } else {
                formFields.npSMS.value = false;
            }

            if (letters[1] == "1") {
                formFields.npWApp.value = true
            } else {
                formFields.npWApp.value = false
            }

            if (letters[2] == "1") {
                formFields.npEmail.value = true
            } else {
                formFields.npEmail.value = false
            }
        }
    }

    /**
     * Set the fetched values in the forms
     * 
     * @param {*} props 
     */
    updateForms = (props) => {
        if (props) {
            var formId = props.id;
            var ntnDatas = props.ntnDatas;
            var formFields = this.state.formFields;

            ntnDatas.forEach((v) => {
                if (formId === v.notificationType) {
                    formFields.nmSMS.value = v.notificationSmsPhone ? true : false
                    formFields.nmWApp.value = v.notificationWtsapPhone ? true : false
                    formFields.nmEmail.value = v.email ? true : false

                    formFields.smsNumber.value = Utils.setEmptyWhenNull(v.notificationSmsCtryCode + v.notificationSmsPhone)
                    formFields.smsCcyCode.value = Utils.setEmptyWhenNull(v.notificationSmsCtryCode)
                    formFields.wAppNumber.value = Utils.setEmptyWhenNull(v.notificationWtsapCtryCode + v.notificationWtsapPhone)
                    formFields.wAppCcyCode.value = Utils.setEmptyWhenNull(v.notificationWtsapCtryCode)
                    formFields.emailIds.value = Utils.setEmptyWhenNull(v.email)

                    this.handleNPCheckBoxs(formFields, v.notifyPayer);
                    this.updateFormFields(formFields, true);
                }
            });

            this.props.setNtnExistingValues(ntnDatas);
        }
    }

    /**
   * Method to refresh the form fields
   */
    resetForm = async () => {
        this.setState({
            formFields: this.prepareField(this.fieldNames, this.rules)
        })
    }

    render = () => html.apply(this);
}

export default (Notification);
