import React from "react";

import { Box, Grid, Card, CardContent, Typography, InputLabel, FormControl, MenuItem, Divider,withStyles,Backdrop } from "@material-ui/core";
import { ButtonPrimary, ButtonSecondary } from "components/$widgets/buttons/form-button";
import TitleBar from "components/title-bar/title-bar";
import { CircularProgress } from "@material-ui/core";
import { DefaultDateFormat, manualPay } from "config/constants";
import moment from 'moment';



function Content(props) {

    return (
        <>
            <Grid item xs={6}>
                <Typography style={{fontSize:'large', fontWeight:'400'}}>{props.label}</Typography>
            </Grid>

            <Grid item xs={6} style={{color:'var(--primary-color)'}}>
                {
                    props.value ? 
                        <Typography 
                            component='p' 
                            style={{
                                fontSize:'large',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'normal',
                                wordBreak: 'break-word',
                            }}
                        >
                            {props.value}
                        </Typography> 
                    : <></>
                }
            </Grid>
        </>
    )
}

export function html() {
    const {
        
    } = this.state;

    const {
        formFields,
        loading,
        allowPartialPaymentValue,
        isChargesDisabled,
        // isRequesterIdDisabled,
        // isTotalAmountDisabled,
        isAutoReqTnxId,
        merchantTransactionMode,
        selectedFile,
        invoiceTypeList,
    } = this.props;

    return (
        <div>

            {loading && (
                <div id="semiTransparenDivTest">
                <Backdrop
                    style={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={true}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                </div>
            )}

            <TitleBar
              className={"mt-3"}
              ruleColor="blue"
              title={"Review Payment Details"}
              fontSize={"150%"}
            />

            <Grid container spacing={1}>
                <Grid item xs={12} sm={12} md={12} lg={7} xl={7}>
                    <Card style={{marginTop:"1%", width:'100%'}}>
                        <Grid container spacing={3} style={{padding:'2%'}}>
                            
                            <Content
                                label="Name"
                                value={formFields.payerName.value}
                            />

                            <Content
                                label="Email"
                                value={formFields.payerEmail.value ? formFields.payerEmail.value : '-'}
                            />

                            <Content
                                label="Mobile"
                                value={formFields.payerMobile.value ? formFields.payerMobile.value : '-'}
                            />

                            <Content
                                label="Payer WhatsApp Number"
                                value={formFields.debtorWhatsAppNumber.value ? formFields.debtorWhatsAppNumber.value : '-'}
                            />

                            <Content
                                label="Collection Reference"
                                value={formFields.collectionRef.value ? formFields.collectionRef.value : '-'}
                            />

                            <Content
                                label="Description"
                                value={formFields.description.value ? formFields.description.value : '-'}
                            />

                            {!isAutoReqTnxId &&
                                <Content
                                    label="Requestor Transaction Id"
                                    value={formFields.transactionId.value ? formFields.transactionId.value : '-'}
                                />
                            }

                            <Content
                                label="Due Date"
                                value={formFields.dueDate.value ? moment(formFields.dueDate.value).format(DefaultDateFormat.dateFormat) : ''}

                            />

                            {allowPartialPaymentValue &&
                                <Content
                                    label="Partial Payments"
                                    value={formFields.allowPartialPayments.value ? "Allowed" : "Not Allowed"}
                                />
                            } 

                            <Content
                                label="Amount"
                                value={formFields.reqCurrency.value + " " + formFields.initialAmount.value}
                            />

                            {!isChargesDisabled &&
                                <Content
                                    label="Charges"
                                    value={formFields.reqCurrency.value + " " + formFields.chargeAmount.value}
                                />
                            }

                            {!isChargesDisabled &&
                                <Content
                                    label="Total Amount"
                                    value={formFields.reqCurrency.value + " " + formFields.reqAmount.value}
                                />
                            }

                            {!isChargesDisabled &&
                                <Content
                                    label="Reason for charges"
                                    value={formFields.chargeReason.value ? formFields.chargeReason.value : '-'}
                                />
                            }
                            
                            {merchantTransactionMode != manualPay.transactionModeDigital &&
                                <Content
                                    label="Invoice Date"
                                    value={formFields.invoiceDate.value ? moment(formFields.invoiceDate.value).format(DefaultDateFormat.dateFormat) : '-'}
                                />
                            }

                            {merchantTransactionMode != manualPay.transactionModeDigital &&
                                <Content
                                    label="Invoice Type"
                                    value={formFields.invoiceType.value ? 
                                        invoiceTypeList.find(item => item.lookupCode === formFields.invoiceType.value).description
                                    : '-'}
                                />
                            }

                            {merchantTransactionMode != manualPay.transactionModeDigital &&
                                <Content
                                    label="Purpose Code"
                                    value={formFields.purposeCode.value ? formFields.purposeCode.value : '-'}
                                />
                            }

                            {merchantTransactionMode != manualPay.transactionModeDigital &&
                                <Content
                                    label="Invoice File"
                                    value={selectedFile ? selectedFile.name : '-'}
                                />
                            }

                            <Grid item xs={12} style={{marginTop:"5%"}}>
                                <ButtonPrimary
                                    id="singlePaymentSubmitBtn"
                                    onClick={this.submitPatmentReqForm}
                                >
                                    Confirm
                                </ButtonPrimary>
                                
                                <ButtonSecondary
                                    id="singlePaymentCancelBtn"
                                    style={{ marginLeft: "20px" }}
                                    onClick ={this.hahdleBack}
                                >
                                    Back
                                </ButtonSecondary>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </div>
    )
}