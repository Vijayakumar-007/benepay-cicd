import React, { Component } from 'react';
import './merchant-profile.scss';
import { html } from "./merchant-profile.html";
import { DashboardService } from '../../../service/api/dashboard.service';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import moment from 'moment';
import { DateFormat } from 'enum/common.enum';
import { Auth } from 'aws-amplify';
import { StorageService, StorageKeys } from 'service/core/storage.service';
class MerchantProfile extends Component {
    constructor(props) {
        super(props);

        // Initializing component state
        this.state = {
            value: 0,
            self: '',
            isApiCalled: false,
            mDetails: [],
            spDetails: [],
            nDetails: [],
            cardTypes: [],
            paymentMethods: [],
            finalSPDetails: [],
            finalNtnDetails: [],
            finalPRows: [],
            expanded: '',
            paymentProviders:[],
        };
    }
    getFormattedAddress(addr) {
        let addressComponents = [];
    
        if (addr) {
            if (addr.address1) addressComponents.push(addr.address1);
            if (addr.address2) addressComponents.push(addr.address2);
            if (addr.city) addressComponents.push(addr.city);
            if (addr.postalcode) addressComponents.push(addr.postalcode);
            if (addr.state) addressComponents.push(addr.state);
            if (addr.country) addressComponents.push(addr.country);
            if (addr.phoneCtryCode && addr.phoneNo) {
                addressComponents.push(addr.phoneCtryCode + " " + addr.phoneNo);
            }
        }
    
        return addressComponents.join(', ').trim();
    }
    
    getFormattedSecondaryContact(secContact) {
        let contactComponents = [];
    
        if (secContact) {
            if (secContact.namePrefix != null) contactComponents.push(secContact.namePrefix);
            if (secContact.firstName != null) contactComponents.push(secContact.firstName);
            if (secContact.lastName != null) contactComponents.push(secContact.lastName);
            if (secContact.designation != null) contactComponents.push(secContact.designation);
            if (secContact.email != null) contactComponents.push(secContact.email);
            if (secContact.phoneCtryCode != null && secContact.phoneNo != null) {
                contactComponents.push(secContact.phoneCtryCode + " " + secContact.phoneNo);
            }
        }
    
        return contactComponents.join(', ').trim();
    }
    
    

    getMerchantProfileData = async () => {
        try {
            this.setState({ isApiCalled: true });
            const result = await DashboardService.getMerchantProfileData();

            if (result) {
                var basicDetails = result.merchantBasicDetails[0];
                var serviceAndPreference = result.merchantServiceAndPreference;
                var notifications = result.notifications;
                var paymentMethods = result.cardTypes;

                console.log("Merchant profile API Result :", result);
                if (basicDetails) {
                    const formattedTAddress = this.getFormattedAddress(basicDetails.tradingAddr);
                    const formattedRAddress = this.getFormattedAddress(basicDetails.registeredAddr);
                    const formattedSecAddress = this.getFormattedAddress(basicDetails.secondaryAddress);
                    const formattedSecContact = this.getFormattedSecondaryContact(basicDetails.secondaryContact);
    
                    this.setState({ 
                        mDetails: basicDetails, 
                        tAddress: formattedTAddress,
                        rAddress: formattedRAddress,
                        secAddress: formattedSecAddress,
                        secContact: formattedSecContact
                    });
                }

                if (serviceAndPreference) {
                    this.setState({ spDetails: serviceAndPreference });
                }

                if (notifications) {
                    this.setState({ nDetails: notifications });
                }

                if (paymentMethods) {
                    this.setState({ paymentMethods: paymentMethods });
                }

                if (result.paymentProvider) {
                    this.setState({ paymentProviders: result.paymentProvider });
                }

            } else {
                console.log("No merchant profile details found in the API response.");
            }

            this.preparePreferenceTableRows();
            this.prepareOnboardingTableRows();
            this.prepareMPNotificationTableRows();
            this.setState({ loading: false });

        } catch (error) {
            console.error("Error in getMerchantProfileData:", error);
        }
    };

    handleActionThrough = (v, name) => {
        if (v && v == "1") {
            return <><CheckCircleIcon style={{ color: '#57f542' }} />&ensp;{name}</>;
        }
        else {
            return <><CancelIcon style={{ color: 'red' }} />&ensp;{name}</>;
        }
    }

    preparePreferenceTableRows = () => {
        var col1 = [
            { id: '1', name: "Payment Initiation" },
            { id: '2', name: "Refunds" },
            { id: '3', name: "Cancellation" },
            { id: '4', name: "Generate QR Code" },
            { id: '5', name: "Invoice Subscription" },
            { id: '6', name: "Automatically Generate Invoices" },
            { id: '7', name: "Default Payment Due Date" },
            { id: '8', name: "Payment Expiry After Due Date" }
        ];
        var spDetails = this.state.spDetails;
        var formatedSPData = [];

        try {
            col1.forEach((i) => {
                var foundInDetails = false; // Flag to check if a row is found in spDetails
                if (spDetails && spDetails.length > 0) {
                    spDetails.forEach((j) => {

                        const existingRow = formatedSPData.find(row => row.col1 === i.name);

                        if (!existingRow) {
                            let spRowPreparing = {};
                            if (i.id == "1") {

                                spRowPreparing = {
                                    col1: i.name,
                                    col2: this.handleActionThrough(j.paymentRequestViaApi.toString(), "Pay by Link API"),
                                    col3: this.handleActionThrough(j.paymentRequestViaFile.toString(), "Via File Upload"),
                                    col4: this.handleActionThrough(j.paymentRequestViaScreen.toString(), "Via Screen"),
                                    col5: this.handleActionThrough(j.paymentRequestViaRealtimeApi.toString(), "Online / Real Time API"),
                                    
                                }


                            } if (i.id == "2") {

                                spRowPreparing = {
                                    col1: i.name,
                                    col2: this.handleActionThrough(j.refundViaFile.toString(), "Via File Upload"),
                                    col3: this.handleActionThrough(j.refundViaScreenPreference.toString(), "Via Screen"),

                                }


                            } if (i.id == "3") {

                                spRowPreparing = {
                                    col1: i.name,
                                    col2: this.handleActionThrough(j.cancellationViaApiPreference.toString(), "Via API"),
                                    col3: this.handleActionThrough(j.cancellationViaScreenPreference.toString(), "Via Screen"),

                                }


                            } if (i.id == "4") {

                                spRowPreparing = {
                                    col1: i.name,
                                    col2: this.handleActionThrough(j.generateUpiQrCode.toString(), "UPI QR Code"),
                                    col3: this.handleActionThrough(j.generateQrCode.toString(), "Generic QR Code"),
                                }

                            }if (i.id == "5") {

                                spRowPreparing = {
                                    col1: i.name,
                                    col2: j.invoiceSubscription == "1" ? "Subscribed" : "Unsubscribed",
                                }

                            }

                            if (i.id == "6") {

                                spRowPreparing = {
                                    col1: i.name,
                                    col2: this.handleActionThrough(j.autoInvoiceUnpaid.toString(), "Unpaid"),
                                    col3: this.handleActionThrough(j.autoInvoicePaid.toString(), "Paid"),
                                }

                            }

                            if (i.id == "7") {

                                spRowPreparing = {
                                    col1: i.name,
                                    col2: j.defaultPaymentDueDays + " " + "Calendar days",
                                }

                            }

                            if (i.id == "8") {

                                spRowPreparing = {
                                    col1: i.name,
                                    col2: j.expiryAfterDue + " " + "Calendar days",
                                }
                            }

                            formatedSPData.push(spRowPreparing);
                        }
                    });
                }
                // If the row is not found in spDetails, add it with default values
                if (!foundInDetails) {
                    this.addPreferenceIfNoData(formatedSPData, i);
                }
            });

            this.setState({ finalSPDetails: formatedSPData });
            console.log("finalSPDetails", this.state.finalSPDetails);

        } catch (error) {
            console.error(error);
        }
    }

    addPreferenceIfNoData = (formatedSPData, i) => {
        const existingRow = formatedSPData.find(row => row.col1 === i.name);

        if (!existingRow) {
            const spRowPreparing = {
                col1: i.name,
                col2: "",
                col3: "",
                col4: "",
            }
            formatedSPData.push(spRowPreparing);
        }
    }

    prepareMPNotificationTableRows = () => {
        var ntnDetails = this.state.nDetails;
        var reminderFrequency = this.state.spDetails && this.state.spDetails.length > 0 ? this.state.spDetails[0]['reminderFrequency'] : '';
        var formatedNtnDetails = [];

        //This array was framed based on the lookup details table lookupId=9
        var col1 = [
            { id: '2', name: "Payment Link" },
            { id: '3', name: "Payment Cancellation" },
            { id: '4', name: "Payment Expiry" },
            { id: '5', name: "Refund Notification" },
            { id: '6', name: "Settlement Report" },
            { id: '7', name: "Payment Reminders" },
            { id: '8', name: "Invoices" },
            { id: '9', name: "Payment Confirmation" }
        ];

        col1.forEach((col) => {
            const ntnRowObj = {
                col1: col.name,
                col2: this.formatNMValues("", "", "") || "",
                col3: this.formatNMValues("", "", "") || "",
                col4: this.formatNMValues("", "", "") || "",
                col5: this.formatNPValues("0") || "",
                col6: this.formatNPValues("0") || "",
                col7: this.formatNPValues("0") || "",
                col8: reminderFrequency
            };

            const relevantRow = ntnDetails.find(row => row.notificationType === col.id);
            if (relevantRow) {
                ntnRowObj.col2 = this.formatNMValues(relevantRow.notificationSmsPhone, relevantRow.notificationSmsCtryCode, "");
                ntnRowObj.col3 = this.formatNMValues(relevantRow.notificationWtsapPhone, relevantRow.notificationWtsapCtryCode, "");
                ntnRowObj.col4 = this.formatNMValues("", "", relevantRow.email);
                ntnRowObj.col5 = this.formatNPValues(relevantRow.notifyPayer && relevantRow.notifyPayer.length > 0 ? relevantRow.notifyPayer[0] : "0");
                ntnRowObj.col6 = this.formatNPValues(relevantRow.notifyPayer && relevantRow.notifyPayer.length > 1 ? relevantRow.notifyPayer[1] : "0");
                ntnRowObj.col7 = this.formatNPValues(relevantRow.notifyPayer && relevantRow.notifyPayer.length > 2 ? relevantRow.notifyPayer[2] : "0");
            }

            formatedNtnDetails.push(ntnRowObj);
        });

        this.setState({ finalNtnDetails: formatedNtnDetails });
    }


    formatNMValues = (pNo, pNoCode, email) => {
        if (pNo && pNoCode && pNo !== null && pNoCode !== null) {
            return pNoCode + "-" + pNo;
        } else if (email && email !== null) {
            return email;
        } else {
            return <CancelIcon style={{ color: 'red' }} />;
        }
    }

    formatNPValues = (v) => {
        if (v && v == "1") {
            return <><CheckCircleIcon style={{ color: '#57f542' }} /></>;
        }
        else {
            return <CancelIcon style={{ color: 'red' }} />;
        }
    }

    prepareOnboardingTableRows = () => {
        const { cardTypes, paymentMethods } = this.state;
        const formatedPRows = [];
    
        cardTypes.forEach((cType) => {
            const matchingProviders = paymentMethods.filter(provider => provider.cardType === cType.lookupCode);
    
            if (matchingProviders.length > 0) {
                matchingProviders.forEach((v, index) => {
                    const providersRow = {
                        col1: cType.description,
                        col2: this.handleProviderServiceStatus(v.onboardingStatus),
                        col3: v.dateOnboardingCommenced ? moment(v.dateOnboardingCommenced).format(DateFormat.date) : "",
                        col4: v.dateCompletedForOnboarding ? moment(v.dateCompletedForOnboarding).format(DateFormat.date) : "",
                        col5: v.paymentProviderName || "",
                        col6: v.settlementAccountName || "",
                        col7: v.settlementAccountCcy || "",
                        col8: v.providerId || ""
                    };
                    formatedPRows.push(providersRow);
                });
            } else {
                // If there are no paymentMethods for this card type, set empty values
                const providersRow = {
                    col1: cType.description,
                    col2: "",
                    col3: "",
                    col4: "",
                    col5: "",
                    col6: "",
                    col7: "",
                    col8: ""
                };
                formatedPRows.push(providersRow);
            }
        });
    
        this.setState({ finalPRows: formatedPRows });
    }
    

    handleProviderServiceStatus = (status) => {
        if (status ) {
            return <><CheckCircleIcon style={{ color: '#57f542'}} />&ensp;ACTIVE</>
        }
        // else {
        //     return <><CheckCircleIcon style={{ color: '#57f542'}} />&ensp;ACTIVE</>;
        // }
    }

    addCardListIfNoRecord = (providersRow, existingRows, cType) => {
        const existingRow = existingRows.find(row => row.col1 === cType.description);

        if (!existingRow) {
            providersRow.col1 = cType.description,
                providersRow.col2 = "",
                providersRow.col3 = "",
                providersRow.col4 = "",
                providersRow.col5 = "",
                providersRow.col6 = "",
                providersRow.col7 = ""
        }
    }

    getCardTypes = async () => {
        this.setState({ loading: true });

        const result = await DashboardService.getLookupDetails("cardType");

        if (result && result.lookupDetails.length > 0) {
            this.setState({ cardTypes: result.lookupDetails, loading: false })
        }
        else {
            this.setState({ loading: false });
        }
    }

    componentDidMount = async () => {
        await Auth.currentSession().then(res => {
            let jwt = res["idToken"]["jwtToken"];
            StorageService.set(StorageKeys.clientJwt, jwt);
        });
        
        this.getMerchantProfileData();
        this.getCardTypes();
    }

    //Handle provider accordian onchange
    handleChange = (panel) => (event, isExpanded) => {
        this.setState({expanded: isExpanded ? panel : false});
    };

    render = () => html.apply(this);
}
export default (MerchantProfile);
