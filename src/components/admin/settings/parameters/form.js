import React, { useEffect, useState } from "react";

//MUI 4 Components
import {
    Grid,
    Divider,
} from "@material-ui/core";

import { Autocomplete } from '@material-ui/lab';

//Components
import { BootstrapInputOld } from "components/$widgets/form-inputs/BootstrapInputOld";
import { BootstrapLabel } from "components/$widgets/form-inputs/BootstrapLabel";
import FormValidationService from "service/core/validate.service";
import { DashboardService } from "service/api/dashboard.service";
import { toast } from "react-toastify";

const fieldNames = [
    'merchantId',
    'providerId',
    'parameterName',
    'parameterValue',
    'additionalDetails',
];

const rules = {
    parameterName: [{ validate: 'required' }],
    parameterValue: [{ validate: 'required' }]
};

const ParametersForm = (props) => {

    const [merchants, setMerchants] = useState([]);
    const [providers, setProviders] = useState([]);
    const [formFields, setFormFields] = useState({});

    useEffect(() => {
        setMerchants(props.merchants || []);
        setProviders(props.providers || []);
        prepareField(fieldNames, rules);

    }, [props.merchants, props.providers]);

    useEffect(() => {
        if (props.parametersFormPopup) {
            resetForm();
        }
    }, [props.parametersFormPopup]);
    
    useEffect(() => {
        if (props.formSubmitFlag) {
            submitParametersForm();
            props.saveParameters();
        }
    }, [props.formSubmitFlag]);

    /**
     * Prepare parameters formparametersFormPopup
     * 
     * @param {*} fieldNames 
     * @param {*} rules 
     */
    const prepareField = (fieldNames, rules) => {
        const fields = {};
        fieldNames.forEach((fieldName) => {
            fields[fieldName] = {
                rules: rules[fieldName] || [],
                value: fieldName == "merchantId" || fieldName == "providerId" ? null : "",
                errors: [],
            };
        });
        setFormFields(fields);
    };

    const resetForm = () => {
        prepareField(fieldNames, rules);
    };

    /**
     * Method to update the particular field in the form
     * after the updation trigger the field validation
     * 
     * @param {*} fieldName 
     * @param {*} value 
     * @param {*} validate 
     */
    const updateFormField = (fieldName, value, validate = true) => {
        setFormFields((prevFields) => {
            if (prevFields[fieldName]) {
                const updatedFields = {
                    ...prevFields,
                    [fieldName]: {
                        ...prevFields[fieldName],
                        value,
                    },
                };

                if (validate) {
                    validateField(fieldName, updatedFields);
                }

                return updatedFields;
            }
            return prevFields; // If field doesn't exist, return the unchanged state
        });
    };

    /**
     * Validate the field based on designed rules
     * 
     * @param {*} fieldName 
    */
    const validateField = async (fieldName, fields) => {
        if (fields[fieldName]) {
            const field = fields[fieldName];
            const { errors, valid } = await FormValidationService.validate(field.rules, field.value, fields);
            setFormFields((prevFields) => ({
                ...prevFields,
                [fieldName]: {
                    ...field,
                    errors,
                },
            }));
            return valid;
        }
        return false;
    };

    /**
    * Validate the form fields
    * 
    * @returns 
    */
    const validateForm = async () => {
        let formValid = true;
        const updatedFields = { ...formFields };

        for (const fieldName of fieldNames) {
            const field = updatedFields[fieldName];
            const { errors, valid } = await FormValidationService.validate(field.rules, field.value, updatedFields);

            updatedFields[fieldName].errors = errors;
            if (!valid) {
                formValid = false;
            }
        }

        setFormFields(updatedFields);
        return formValid;
    };

    /**
    * Submit the parameters form.
    */
    const submitParametersForm = async () => {
        try {
            props.handleSubmitBtnDisable(true);

            const { providerId, merchantId, parameterName, parameterValue, additionalDetails } = formFields;

            // Prepare the form data
            const formValue = [
                {
                    beneCollectParameterId: "",
                    fkpaymentProviderId: providerId.value,
                    fkmerchantId: merchantId.value,
                    parameterName: parameterName.value,
                    parameterValue: parameterValue.value,
                    additionalDetails: additionalDetails.value,
                },
            ];

            // Validate the form
            const formValid = await validateForm();

            if (!formValid) {
                props.handleSubmitBtnDisable(false);
                return;
            }

            // Send the data to the server
            const response = await DashboardService.updateMerchantParameter(formValue);

            if (response?.statusCode === "200") {
                toast.success(response.message || "Parameters updated successfully.");
                props.closeParameterFormPopup();
            } 
            else if(response?.statusCode === "400"){
                toast.error(response.message || "Parameter Name already used.");

                //Update Validation error message
                const updatedFields = {...formFields};
                updatedFields['parameterName'].errors = [response.message];

                props.handleSubmitBtnDisable(false);
            }
            else {
                toast.error(response?.message || "Failed to update parameters. Please try again.");
                props.handleSubmitBtnDisable(false);
            }
        } catch (error) {
            console.error("Error submitting parameters form:", error);
            toast.error("An unexpected error occurred. Please try again later.");
        }
    };

    return (
        <>
            <Divider />

            <Grid container spacing={2} style={{ width: '500px', marginTop: '1%' }}>
                <Grid item lg={9} md={9} sm={12} xs={12}>
                    <BootstrapLabel shrink>Merchant Id</BootstrapLabel>
                    <Autocomplete
                        id="merchantsName"
                        name="merchantId"
                        options={merchants || []}
                        getOptionLabel={(option) => option.merchantName}
                        onChange={(e, newValue) => updateFormField('merchantId', newValue?.merchantId)}
                        value={merchants.find((option) => option.merchantId === formFields.merchantId?.value) || null}
                        renderInput={(params) => (
                            <BootstrapInputOld
                                {...params}
                                InputProps={{
                                    ...params.InputProps,
                                }}
                                value={formFields.merchantId?.value || null}
                            />
                        )}
                    />
                </Grid>

                <Grid item lg={9} md={9} sm={12} xs={12}>
                    <BootstrapLabel shrink>Provider Id</BootstrapLabel>
                    <Autocomplete
                        id="providerId"
                        name="providerId"
                        options={providers || []}
                        getOptionLabel={(option) => option.name}
                        onChange={(e, newValue) => updateFormField('providerId', newValue?.value)}
                        value={providers.find((option) => option.value === formFields.providerId?.value) || null}
                        renderInput={(params) => (
                            <BootstrapInputOld
                                {...params}
                                InputProps={{
                                    ...params.InputProps,
                                }}
                                value={formFields.providerId?.value || null}
                            />
                        )}
                    />
                </Grid>

                <Grid item lg={9} md={9} sm={12} xs={12}>
                    <BootstrapLabel shrink required>Parameter Name</BootstrapLabel>
                    <BootstrapInputOld
                        id="parameterName"
                        rules={formFields.parameterName?.rules}
                        value={formFields.parameterName?.value}
                        errors={formFields.parameterName?.errors}
                        onChange={(e) => {
                            updateFormField("parameterName", e.target.value);
                        }}
                    />
                </Grid>

                <Grid item lg={9} md={9} sm={12} xs={12}>
                    <BootstrapLabel shrink required>Parameter Value</BootstrapLabel>
                    <BootstrapInputOld
                        id="parameterValue"
                        rules={formFields.parameterValue?.rules}
                        value={formFields.parameterValue?.value}
                        errors={formFields.parameterValue?.errors}
                        onChange={(e) => {
                            updateFormField("parameterValue", e.target.value);
                        }}
                    />
                </Grid>

                <Grid item lg={9} md={9} sm={12} xs={12}>
                    <BootstrapLabel shrink>Additional Details</BootstrapLabel>
                    <BootstrapInputOld
                        id="additionalDetails"
                        rules={formFields.additionalDetails?.rules}
                        value={formFields.additionalDetails?.value}
                        errors={formFields.additionalDetails?.errors}
                        onChange={(e) => {
                            updateFormField("additionalDetails", e.target.value);
                        }}
                    />
                </Grid>
            </Grid>
        </>
    );
}

export default ParametersForm;