import React, { Component } from "react";
import { html } from "./broadcasts.html"; // Importing HTML template 
import moment from "moment";
import { DashboardService } from "../../../../src/service/api/dashboard.service";
import FormValidationService from "../../../service/core/validate.service";
import { BenepayUserService } from "../../../service/api/benepay-user.service";
import { toast } from "react-toastify";
import { DateFormat } from "../../../enum/common.enum";
import dayjs from "dayjs";
import DeleteIcon from '@mui/icons-material/Delete';
import { Auth } from "aws-amplify";
import { StorageKeys, StorageService, TempStorage } from "../../../service/core/storage.service";
import { DefaultDateFormat } from "config/constants";
/**
 * @author Ragavan
 * 
 * Class created to handle the Broadcast messages
 */
class Broadcasts extends Component {

    // form fields declaration
    fieldNames = [
        'messageSubject',
        'messageBody',
        'selectedMerchant',
        'severity',
        'showUntil',
    ];

    rules = {
        messageSubject: [{ validate: 'required' }],
        messageBody: [{ validate: 'required' }],
        selectedMerchant: [{ validate: 'required' }],
        severity: [{ validate: 'required' }],
        showUntil: [{ validate: 'required' }, { validate: 'date', message: "Invalid Date given" }],
    }

    constructor(props) {
        super(props);

        const options = [
            { label: 'General' },
            { label: 'Warning' },            
            { label: 'Critical' },
        ];

        this.state = {
            formFields: this.prepareField(this.fieldNames, this.rules),
            loading: false,
            untilDate: null,
            titleName: "Broadcasts",
            openCreateNewBroadcastDiv: false,
            hideAddNewBtn: false,
            merchantsList: '',
            selectedMerchants: [],
            merchantIds: null,
            severityOptions: options,
            messageActiveStatus: true,
            msgHistoryColumns: this.messageHistoryColumns(),
            msgHistoryRows: [],
            editEnabled: false,
            messageId: '',
            showDeletionModal: false,
            messageIdToDelete: '',
            openAutocomplete: false
        };
    }

    /**
    * To handle event for the date field when change
    * @param {*} event
    */
    changeDateFormat = (event) => {
        let value = null;

        if (event != null) {
            value = moment(event.toDate()).format(DefaultDateFormat.dateFormatymd);
        }

        return value;
    }

    /**
     * Method handle to open the create broadcast div tag 
     * And also change the heading and hide the add new button
     */
    createNewBroadcast = () => {
        this.setState({
            openCreateNewBroadcastDiv: true,
            hideAddNewBtn: true,
            titleName: "Broadcasts > New",
            messageId: null
        });
        this.resetForm();
    }

    /**
     * Method handle to close the create broadcast div tag 
     * And also change the heading and unhide the add new button
     */
    cancelBroadcastCreation = () => {
        this.setState({
            openCreateNewBroadcastDiv: false,
            hideAddNewBtn: false,
            titleName: "Broadcasts",
            editEnabled: false
        });
    }

    /**
     * Defined the message history table columns
     */
    messageHistoryColumns = () => {
        const cols = [
            {
                field: 'broadcastTimestamp',
                headerName: 'Timestamp',
                headerClassName: 'dataGridHeaderStyle',
                width: 190,
                minWidth: 50,
                // flex: 1,
                valueGetter: (params) => moment(params.value).format(DateFormat.dateTime)
            },
            {
                field: 'initiatedBy',
                headerName: 'Initiated By',
                width: 150,
                minWidth: 50,
                flex: 1,    
                headerClassName: 'dataGridHeaderStyle',
            },
            {
                field: 'merchantId',
                headerName: 'Merchant',
                width: 150,
                minWidth: 50,
                flex: 1,
                headerClassName: 'dataGridHeaderStyle',
            },
            {
                field: 'severity',
                headerName: 'Severity',
                width: 150,
                minWidth: 50,
                flex: 1,
                headerClassName: 'dataGridHeaderStyle',
            },
            {
                field: 'showUntil',
                headerName: 'Show Until',
                width: 150,
                minWidth: 50,
                flex: 1,
                headerClassName: 'dataGridHeaderStyle',
            },
            {
                field: 'messageSubject',
                headerName: 'Subject',
                width: 190,
                minWidth: 90,
                flex: 1,
                headerClassName: 'dataGridHeaderStyle',
            },
            {
                field: 'messageBody',
                headerName: 'Body',
                width: 300,
                minWidth: 150,
                // flex: 1,
                headerClassName: 'dataGridHeaderStyle',
            },
            {
                field: 'action',
                headerName: 'Action',
                width: 50,
                maxWidth: 150,
                flex: 1,
                headerClassName: 'dataGridHeaderStyle',
                renderCell:(params) => {
                    return (
                        <>
                        <DeleteIcon 
                            onClick={(e) => {
                                this.confirmDelete(e, params.row.messageId);
                            }}/>
                        </>
                    )
                }
            }
        ];

        return cols;
    }

    /**
     * Handler for when component ready 
     */
    componentDidMount = async () => {
        await Auth.currentSession().then(res => {
            let jwt = res["idToken"]["jwtToken"]
            StorageService.set(StorageKeys.clientJwt, jwt);
        })
        this.getMerchantList();
        this.getBroadcastList();
    }

    /**
     * Handle Onchange event for the merchant field
     */
    getMerchantIds = async (e, newValue) => {
        let merchantIds = [];
      
        if (newValue.some((item) => item.merchantName === 'All')) {
          merchantIds.push('All');
          newValue = [{ merchantId: 'All', merchantName: 'All' }];
        } else {
          merchantIds = newValue.map((item) => item.merchantId);
        }
      
        const updatedOptions = this.state.merchantsList.map((opt) => {
          if (opt.merchantName === 'All') {
            opt.disabled = false;
          } else {
            opt.disabled = newValue.some((item) => item.merchantName === 'All');
          }
          return opt;
        });
      
        await this.setState({
          merchantsList: updatedOptions,
          merchantIds: merchantIds,
          selectedMerchants: newValue,
        });
      
        this.updateFormField('selectedMerchant', newValue, true);
      };
      
      
    messageStatus = (event) => {
        this.setState({ messageActiveStatus: event.target.checked })
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
     * Method to update the particular field in the form
     * after the updation trigger the field validation
     * 
     * @param {*} fieldName 
     * @param {*} value 
     * @param {*} validate 
     */
    updateFormField = async (fieldName, value, validate = true) => {
        let fields = this.state.formFields;
        
        if (fields.hasOwnProperty(fieldName)) {
            fields[fieldName].value = value;
            this.setState({ formFields: fields });
        }
        
        if (validate) {
            await this.validateField(fieldName);
        }
    };
    

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

            if (fieldName == "selectedMerchant") {
                value = [];
            } else if (fieldName == "severity") {
                value = [];
            }

            fields[fieldName] = {
                rules: rules[fieldName] || [],
                value: value,
                errors: []
            };
        });

        return fields;
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
    * Method to refresh the form fields
    */
    resetForm = async () => {
        this.setState({
            formFields: this.prepareField(this.fieldNames, this.rules),
            showForm: true
        })
    }


    /**
     * Save new broadcasts message
     * @returns 
     */
    saveMessage = async () => {
        let formValid = await this.validateForm();

        if(formValid){
            var requestObj = {
                "merchants": this.state.merchantIds,
                "severity": this.state.formFields.severity.value.label,
                "messageSubject": this.state.formFields.messageSubject.value,
                "messageBody": this.state.formFields.messageBody.value,
                "showUntil": moment(this.state.formFields.showUntil.value).format(DateFormat.date),
                "activeStatus": this.state.messageActiveStatus,
            }

            let response;

            if(!this.state.messageId){
                response = await BenepayUserService.createBroadcast(requestObj);
            } else {
                response = await BenepayUserService.updateBroadcast(this.state.messageId, requestObj);
            }

            if (response.success) {
                toast.success(response.message);
                this.setState({
                    openCreateNewBroadcastDiv: false,
                    hideAddNewBtn: false,
                    merchantIds:[]
                })
            } else {
                toast.error("Error creating broadcast message.");
            }
            this.getBroadcastList();
        }
    }

    getMerchantList = async () => {
        this.setState({ loading: true })
        const response = await DashboardService.getMerchantSummaryList();
        const addOption = { merchantId: 'All', merchantName: 'All' };
        response.merchantSummary = [addOption, ...response.merchantSummary]; //Add a All option in merchants array

        //Add a new index for each record is used to disable and enable the merchants options
        const customizeMerchantList = response.merchantSummary.map(item => {
            return { ...item, disabled: false };
        });
        
        if (Object.keys(response).length !== 0) {
            this.setState({ merchantsList: customizeMerchantList, loading: false });
        }
    }

    getBroadcastList = async () => {
        this.setState({ loading: true })
        const response = await BenepayUserService.getAllBroadcasts();
        
        if (response) {
            this.setState({
                msgHistoryRows: response.broadcastMessagesDetails,
                loading: false
            })
        } 
    }

    handleRowClick = (params) => {
        this.setState({editEnabled : true})
        this.setState({
            openCreateNewBroadcastDiv: true,
            hideAddNewBtn: true,
            titleName: "Broadcasts > New",
            messageId : params.row.messageId
        });

        this.updateFormField("messageSubject", params.row.messageSubject);
        this.updateFormField("messageBody", params.row.messageBody);    
        this.updateFormField("showUntil", dayjs(params.row.showUntil, 'DD/MM/YYYY'));

        const selectedMerchants = this.state.merchantsList.filter(merchant => params.row.merchantId.includes(merchant.merchantName));
        this.getMerchantIds(null, selectedMerchants);
        this.updateFormField("selectedMerchant", selectedMerchants);
        
        let selectedSeverity = this.state.severityOptions.filter(severity => params.row.severity.includes(severity.label));
        this.updateFormField("severity", selectedSeverity[0]);
    }

    confirmDelete = (e, messageId) => {
        e.stopPropagation();
        this.setState({showDeletionModal : true, messageIdToDelete: messageId})
    }

    handleBroadcastDelete = async (messageId) => {
        this.setState({showDeletionModal : false,loading : true})
        const response = await BenepayUserService.deleteBroadcast(messageId);
        if(!response.success){
            toast.error("Error Deleting broadcast");
        } else {
            toast.success(response.message);
        }

        this.setState({showDeletionModal:false, messageIdToDelete: '', loading : false})
        this.getBroadcastList();
    }

    handleInputBlur = () => {
        this.setState({ openAutocomplete: false });
    };
    
    handleInputFocus = () => {
        this.setState({ openAutocomplete: true });
    };

    handleModalClose = () => {
        this.setState({ showDeletionModal: false })
    }


    // Rendering the component using the HTML template
    render = () => html.apply(this);
}

export default Broadcasts;