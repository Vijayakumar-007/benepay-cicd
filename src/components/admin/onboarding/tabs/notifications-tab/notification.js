import { Component } from 'react';

import { html } from "./notification.html";
import { DashboardService } from '../../../../../service/api/dashboard.service';
import Utils from '../../../../../service/core/utils';
import { toast } from 'react-toastify';
import { Auth } from 'aws-amplify';
import { StorageService } from 'service/core/storage.service';
import { StorageKeys } from 'service/core/storage.service';

//Constants
import { OnboardConstants, messages } from '../../../../../config/constants';

class Notification extends Component {

    INITIATED = "initiated";
    INPROGRESS = "inprogress";
    DONE = "done";

    constructor(props) {
        super(props);

        this.state = {
            merchantId: props.merchantId,
            getPreValue: '',
            openBDdeletepopup: false,
            deleteND: '',
            ntnForms: this.preparaNtnTypes(),
            reqObj: [],
            validateForms: {},
            ntnDatas: [],
            onchangeIsTrigger: false,
            flagForClearValues: false,
            fetchNtnloading: false,
        }
    }

    componentDidMount =async () => {
        await Auth.currentSession().then(res => {
            let jwt = res["idToken"]["jwtToken"];
            StorageService.set(StorageKeys.clientJwt, jwt);
        });

        if (this.props.getNotificationPreValue) {
            this.setState({ getPreValue: this.INITIATED }, () => {
                //Give a parameter of tab index
                this.props.getPreValueCallback(3);
                this.fetchNotification();
            });
        }
        this.handleStage();
    }

    componentDidUpdate = () => {
        this.handleStage();
    }

    /**
     * Preparing the Notification Type
     * title - Title of the notification card
     * id - key of the each notification form, !Each form have a unique id
     * nm - show or hide the notify merchant fields in the form,
     * @returns 
     */
    preparaNtnTypes = () => {
        var types = [
            {
                title: 'Payment Link Notification',
                id: '2',
                nm: true
            },
            {
                title: 'Payment Cancellation Notification',
                id: '3',
                nm: true
            },
            {
                title: 'Payment Confirmation Notification',
                id: '9',
                nm: true
            },
            {
                title: 'Payment Expiry  Notification',
                id: '4',
                nm: true
            },
            {
                title: 'Payment Refund Notification',
                id: '5',
                nm: true
            },
            {
                title: 'Settlement Report  Notification',
                id: '6',
                nm: true
            },
            {
                title: 'Payment Reminder Notification',
                id: '7',
                nm: true
            },
            {
                title: 'Invoice Notification',
                id: '8',
                nm: true
            },
        ]

        return types;
    }

    //Please don't comment or remove any lines in the method
    //!Be careful if you make any change in the componentDidUpdate
    handleStage = () => {
        if (this.props.saveNtn) {
            //Give a parameter of tab index
            this.props.saveNtnCallback(OnboardConstants.notificationsTabVal);
            this.saveNotification();
        }

        if (this.props.deleteMerchantND) {
            //Give a parameter of tab index
            this.props.nddeleteCallback(OnboardConstants.notificationsTabVal);
            this.setState({ openBDdeletepopup: true });
        }
    }

    /**
     * Method handle to save the notifications
     */
    saveNotification = async () => {
        const formsAreValid = Object.values(this.state.validateForms).every(value => value === true);
        var sendRes = { saveNtn: false };

        try {
            if (formsAreValid && this.state.onchangeIsTrigger) {
                this.setState({ loading: true });

                const { reqObj } = this.state;
                const updatedReqObj = reqObj.map(item => {

                    Object.keys(item).forEach(key => {
                        if (item[key] === "") {
                            item[key] = null;
                        }
                    });

                    if (item.notificationSmsPhone && item.notificationSmsCtryCode) {
                        item.notificationSmsPhone = Utils.formatMobileNo(item.notificationSmsPhone, item.notificationSmsCtryCode);
                        item.notificationSmsCtryCode = Utils.formatCountryCode(item.notificationSmsCtryCode);
                    }

                    if (item.notificationWtsapPhone && item.notificationWtsapCtryCode) {
                        item.notificationWtsapPhone = Utils.formatMobileNo(item.notificationWtsapPhone, item.notificationWtsapCtryCode);
                        item.notificationWtsapCtryCode = Utils.formatCountryCode(item.notificationWtsapCtryCode);
                    }

                    return item;
                });

                var responseObj = {
                    merchantId: this.props.merchantId,
                    notifications: updatedReqObj
                }

                const res = await DashboardService.saveMerchantNotifications(responseObj);

                if (res.statusCode == "200") {
                    //Method handle the delete and clear button show/hide
                    this.props.resetBtnConfigFlag(OnboardConstants.notificationsTabVal);
                    this.setState({ save: this.SAVE_DONE, loading: false });

                    sendRes.saveNtn = true;
                    this.props.notificationSaveResponse(sendRes);
                } else {
                    this.setState({ loading: false });
                    this.props.notificationSaveResponse(sendRes);
                }
            }
            else {
                if (!this.state.onchangeIsTrigger) {
                    sendRes.saveNtn = 'changeTab';
                    this.props.notificationSaveResponse(sendRes);
                }else{
                    if(!formsAreValid && this.state.onchangeIsTrigger){
                        toast.error(messages.commonErrorMsg);
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * method handle to fetch notifications
     */
    fetchNotification = async () => {
        let merchantId = this.props.merchantId;

        if (merchantId) {
            this.setState({ fetchNtnloading: true });

            const res = await DashboardService.fetchNotifications(merchantId);
            
            if (res && res.notifications != null && res.notifications.length > 0 && res.statusCode == "200") {
                //Method handle the delete and clear button show/hide
                this.props.resetBtnConfigFlag(OnboardConstants.notificationsTabVal);

                this.setState({ ntnDatas: res.notifications, fetchNtnloading:false });
            }else{
                this.setState({ fetchNtnloading: false });
            }
        }
    }

    deleteND = async () => {
        this.setState({loading:true});

        if (this.state.merchantId) {
            const res = await DashboardService.deleteNotificationDetails(this.state.merchantId);

            if (res.message) {
                this.setState({ openBDdeletepopup: false, reqObj: [], loading:false }, () => {
                    toast.success(res.message);
                    this.clearNotificationValues();
                });
            }else{
                this.setState({loading:false});
            }
        }
        else {
            this.setState({ openBDdeletepopup: false, loading:false }, () => {
                toast.error("Unable to delete");
            });
        }
    }

    /**
     * @author Ragavan
     * Preparing the API Response
     * 
     * @param {*} formType 
     * @param {*} fieldName 
     * @param {*} value 
     * @param {*} formValid 
     */
    prepareAPIResponse = async (formType, fieldName, value, formValid = true) => {
        if (formType) {
            const requestObj = [...this.state.reqObj];
            const formValidation = { ...this.state.validateForms };

            if (typeof formValid === 'boolean') {
                formValidation[formType] = formValid;
            }

            const formIndex = requestObj.findIndex((v) => v.notificationType === formType);

            if (formIndex !== -1) {
                const updatedForm = {
                    ...requestObj[formIndex],
                    notificationSmsPhone: fieldName === "nmSMS" && value == false ? '' : fieldName === "smsNumber" ? Utils.setNullWhenEmpty(value) : requestObj[formIndex].notificationSmsPhone,
                    notificationSmsCtryCode: fieldName === "nmSMS" && value == false ? '' : fieldName === "smsCcyCode" ? Utils.setNullWhenEmpty(value) : requestObj[formIndex].notificationSmsCtryCode,
                    notificationWtsapPhone: fieldName === "nmWApp" && value == false ? '' : fieldName === "wAppNumber" ? Utils.setNullWhenEmpty(value) : requestObj[formIndex].notificationWtsapPhone,
                    notificationWtsapCtryCode: fieldName === "nmWApp" && value == false ? '' : fieldName === "wAppCcyCode" ? Utils.setNullWhenEmpty(value) : requestObj[formIndex].notificationWtsapCtryCode,
                    email: fieldName === "nmEmail" && value == false ? '' : fieldName === "emailIds" ? Utils.setNullWhenEmpty(value) : requestObj[formIndex].email,
                    notifyPayer: fieldName === "npSMS" || fieldName === "npWApp" || fieldName === "npEmail" ? Utils.setNullWhenEmpty(value) : requestObj[formIndex].notifyPayer,
                };

                requestObj[formIndex] = updatedForm;
            } else {
                const newForm = {
                    notificationType: formType,
                    notificationSmsPhone: fieldName === "smsNumber" ? Utils.setNullWhenEmpty(value) : null,
                    notificationSmsCtryCode: fieldName === "smsCcyCode" ? Utils.setNullWhenEmpty(value) : null,
                    notificationWtsapPhone: fieldName === "wAppNumber" ? Utils.setNullWhenEmpty(value) : null,
                    notificationWtsapCtryCode: fieldName === "wAppCcyCode" ? Utils.setNullWhenEmpty(value) : null,
                    email: fieldName === "emailIds" ? Utils.setNullWhenEmpty(value) : '',
                    notifyPayer: fieldName === "npSMS" || fieldName === "npWApp" || fieldName === "npEmail" ? Utils.setNullWhenEmpty(value) : null,
                };

                requestObj.push(newForm);
            }

            await this.setState({ reqObj: requestObj, validateForms: formValidation, onchangeIsTrigger: true });
        }
    }

    /**
     * Update the fetched values to the reqObj
     * @param {*} existingValues 
     */
    setNtnExistingValues = (existingValues) => {
        var existingValue = [];

        existingValues.forEach((v) => {
            const formValue = {
                notificationType: Utils.setEmptyWhenNull(v.notificationType),
                notificationSmsPhone: Utils.setEmptyWhenNull(v.notificationSmsPhone),
                notificationSmsCtryCode: Utils.setEmptyWhenNull(v.notificationSmsCtryCode),
                notificationWtsapPhone: Utils.setEmptyWhenNull(v.notificationWtsapPhone),
                notificationWtsapCtryCode: Utils.setEmptyWhenNull(v.notificationWtsapCtryCode),
                email: Utils.setEmptyWhenNull(v.email),
                notifyPayer: Utils.setEmptyWhenNull(v.notifyPayer),
            };

            existingValue.push(formValue);
        });

        this.setState({ reqObj: existingValue });
    }

    clearNotificationValues = () => {
        this.setState({ flagForClearValues: true });
    }

    resetFlags = (v) => {
        if (v == "clear") {
            this.setState({ flagForClearValues: false });
        }
    }

    render = () => html.apply(this);
}

export default (Notification);