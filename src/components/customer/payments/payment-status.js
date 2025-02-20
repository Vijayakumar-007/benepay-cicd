import React from "react";

import { Box, Grid, Card, CardContent, Typography, Chip, Button, Divider, Link } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { FileCopyOutlined, PictureAsPdf } from "@material-ui/icons";

import { ButtonPrimary, ButtonSecondary } from "../../$widgets/buttons/form-button";
import Utils from "../../../service/core/utils";
import { toast } from "react-toastify";
import { DefaultDateFormat, manualPay } from "config/constants";
import moment from 'moment';


const TransactionId = withStyles((theme) => ({
    root: {
        color: "#346799",
        fontWeight: "bold"
    },
}))(Typography);

const CardHead = withStyles((theme) => ({
    root: {
        fontSize: 18,
        marginBottom: 15
    },
}))(Typography);

const StyledChip = withStyles({
    label: {
        fontSize: '15px',
        color: 'rgb(106 158 222)',
    },
})(Chip);

/**
 * Component for align contents inside the grid in a row
  * 
 * @author Muthukumaran
 * 
 * @param {*} props 
 * @returns Component
 */
function GridContent(props) {

    return (
        <>
            {props.value &&
                <Grid container style={{ marginBottom: 20 }}>

                    <Grid item xs={6}>
                        <Typography>{props.title}</Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <Grid container style={{paddingLeft:props.padding?1:0}}>
                            {props.children ? props.children : <Typography>{props.value}</Typography>}
                        </Grid>
                    </Grid>

                </Grid>
            }
        </>
    )
}

/**
 * Status widget to show the response and status 
 * after transaction created
 * 
 * @author Muthukumaran
 * 
 * @param props 
 * @returns 
 */
export function PaymentStatusWidget(props) {
    let transaction = props.transaction;
    let mailSent = props.mailSent;
    let paymentLink = props.paymentLink;
    let message = props.message;
    let allowManualPay = props.allowManualPay;
    
    return (
        <Box style={{width: '100%'}}>
            <Grid  container spacing={1}>
                <Grid item xs={6} >
                    <Card id="formSubmission">
                        <CardContent style={{ marginLeft: 20, width: '100%'}}>
                            <CardHead gutterBottom>
                                {transaction.status ? <Typography style={{fontSize:30,fontWeight:"bold", color: "var(--secondary-color)"}}>Success!!</Typography>
                                    : <Typography style={{fontSize:30,fontWeight:"bold"}}>Failed!!</Typography>}
                            </CardHead>

                            <Grid container spacing={2}>
                                <Grid item xs={10}>

                                    {(transaction.transactionId && !mailSent) && <Grid container style={{ marginBottom: 25 }}>
                                        <Grid item xs={12}>
                                            <Typography variant="span">As instructed, BenePay hasnt sent any email to {transaction.debtorName} requesting payment.</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="span">Payment link can be copied from below and sent to payer via alternate means.</Typography>
                                        </Grid>
                                    </Grid>}

                                    {(transaction.transactionId && mailSent) && <Grid container style={{ marginBottom: 50 }}>
                                        <Grid item xs={12}>
                                            {/* <Typography variant="span">An email has been sent to {transaction.debtorName} requesting payment with below details.</Typography> */}
                                            <Typography variant="span">The notification has been sent to payer requesting payment with below details.</Typography>
                                        </Grid>
                                    </Grid>}

                                    {(!transaction.transactionId && message) && <Grid container style={{ marginBottom: 50 }}>
                                        <Grid item xs={12}>
                                            <Typography variant="span" color="danger">{message}</Typography>
                                        </Grid>
                                    </Grid>}

                                    <GridContent
                                        title="BenePay Transaction Id"
                                        value={transaction.transactionId}
                                        padding={true}
                                    >
                                        <span style={{display: 'flex', justifyContent: 'space-between'}}>
                                        {/* <Grid item xs={11} style={{ padding: 0 }}>
                                            <TransactionId>{transaction.transactionId}</TransactionId>
                                        </Grid>
                                            <Button style={{ padding: 0 }}>
                                                <FileCopyOutlined 
                                                style={{ color: 'rgb(106 158 222)' }} 
                                                onClick={()=> {
                                                    Utils.copyContent(transaction.transactionId, (e) => {
                                                        toast.success('Copied!');
                                                    });
                                                }}
                                                />
                                            </Button> */}
                                        <div class="MuiGrid-root" onClick={() => {
                                             Utils.copyContent(transaction.transactionId, (e) => {
                                                toast.success('Copied!');
                                            })
                                        }}>
                                            <div style={{margin: '0', boxSizing: 'border-box', flexGrow: 0, flexBasis: '100%', maxWidth: '100%'}} class="MuiGrid-root">
                                                <div role="button" style={{backgroundColor: 'transparent', maxWidth: '112%', }} class="MuiChip-root" tabindex="0">
                                                    <span style={{overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontWeight: '600', color: 'var(--accent-color)', fontSize: '15px', marginRight: '8px', cursor: 'pointer'}}>{transaction.transactionId}</span>
                                                    <FileCopyOutlined style={{ color: 'var(--accent-color)', cursor: 'pointer' }} />
                                                </div>
                                            </div>
                                        </div>

                                        </span>
                                    </GridContent>

                                    {transaction.transactionId && <Grid container style={{ marginBottom: 20, marginLeft: 20 }}>
                                        <Grid item xs={12}>
                                            <Divider variant="middle" />
                                        </Grid>
                                    </Grid>}

                                    <GridContent
                                        title="Requested Amount"
                                        value={transaction.finalDueAmount}
                                        padding={true}>
                                        <Typography style={{marginRight:10, color: 'var(--primary-color)'}}>
                                            {transaction.collectionCurrency && transaction.collectionCurrency}
                                        </Typography>
                                        <Typography style={{color: 'var(--primary-color)'}}>
                                            {transaction.finalDueAmount}
                                        </Typography>
                                    </GridContent>

                                    <GridContent
                                        title="Status"
                                        value="true">
                                        {
                                            transaction.transactionId ?
                                                <Chip label={transaction.status} style={{background:"green", color:"white"}}/>
                                                : <Chip label="Failed" style={{background:"orange", color:"white"}} />
                                        }
                                    </GridContent>

                                    <GridContent
                                        title="Create Timestamp"
                                        value={transaction.createTimestamp}
                                        padding={true}>
                                        <Typography style={{color: 'var(--primary-color)'}}>{Utils.datetimeSystemFormat(transaction.createTimestamp)}</Typography>
                                    </GridContent>

                                    <GridContent
                                        title="Payer"
                                        value={transaction.debtorName}
                                        padding={true}>
                                        <Grid item xs={12} style={{color: 'var(--primary-color)'}}>
                                            <Typography>{transaction.debtorName}</Typography>
                                        </Grid>
                                        {
                                            transaction.debtorEmailId &&
                                            <Grid item xs={12} style={{color: 'var(--primary-color)'}}>
                                                <Typography>{transaction.debtorEmailId}</Typography>
                                            </Grid>
                                        }
                                        {
                                            transaction.debtorMobileNumber &&
                                            <Grid item xs={12} style={{color: 'var(--primary-color)'}}>
                                                <Typography>{transaction.debtorMobileNumber}</Typography>
                                            </Grid>
                                        }
                                        {
                                            transaction.debtorWhatsappNumber &&
                                            <Grid item xs={12} style={{color: 'var(--primary-color)'}}>
                                                <Typography>{transaction.debtorWhatsappNumber}</Typography>
                                            </Grid>
                                        }
                                    </GridContent>

                                    {/* <GridContent
                                        title="Payment Link"
                                        value={paymentLink}>
                                        <Grid item xs={12}>
                                            <StyledChip
                                                label={paymentLink}
                                                style={{maxWidth:"112%"}}
                                                variant="outlined"
                                                deleteIcon={<FileCopyOutlined style={{ color: 'rgb(106 158 222)' }} />}
                                                onDelete={(e) => {
                                                    Utils.copyContent(paymentLink, (e) => {
                                                        toast.success('Copied!');
                                                    })
                                                }}
                                            />
                                        </Grid>
                                    </GridContent> */}

                                    {(allowManualPay = false || transaction.transactionMode != manualPay.transactionModeManual) && ( <div  style={{paddingLeft: '0px', cursor: 'pointer', display: 'flex', width: '100%', flexWrap: 'wrap', boxSizing: 'border-box', marginBottom: '20px' }}  class="MuiGrid-root">
                                        <div  style={{paddingLeft: '0px', cursor: 'pointer', display: 'flex', flexWrap: 'wrap', boxSizing: 'border-box', maxWidth: '50%', flexBasis: '50%' }} class="MuiGrid-root">
                                            <p class="MuiTypography-root MuiTypography-body1" style={{color: 'var(--dark-color)'}}>Payment Link</p>
                                        </div>
                                        <div style={{margin: '0', boxSizing: 'border-box', flexGrow: 0, flexBasis: '50%', maxWidth: '50%'}}  class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6">
                                            <div  style={{paddingLeft: '0px', cursor: 'pointer', display: 'flex', flexWrap: 'wrap', boxSizing: 'border-box' }} class="MuiGrid-root" onClick={() => {
                                                 Utils.copyContent(paymentLink, (e) => {
                                                    toast.success('Copied!');
                                                })
                                            }}>
                                                <div style={{margin: '0', boxSizing: 'border-box', flexGrow: 0, flexBasis: '100%', maxWidth: '100%', cursor: 'pointer'}} class="MuiGrid-root">
                                                    <div role="button" style={{border: '1px solid rgba(0, 0, 0, 0.23)', backgroundColor: 'transparent', width: '112%', }} class="MuiChip-root" tabindex="0">
                                                        <span style={{overflow: 'hidden', whiteSpace: 'nowrap', paddingLeft: '12px', paddingRight: '12px', textOverflow: 'ellipsis', fontWeight: '500', color: 'var(--primary-color)', fontSize: '14px', cursor: 'pointer' }}>{paymentLink}</span>
                                                        <FileCopyOutlined style={{ color: 'rgb(106 158 222)', cursor: 'pointer' }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    )}

                                    <GridContent
                                        title="Collection Reference"
                                        value={transaction.collectionReferenceNo}
                                        padding={true} style={{color: 'var(--primary-color)'}} />

                                    <GridContent
                                        title="Description"
                                        value={transaction.reasonForCollection}
                                        padding={true} style={{color: 'var(--primary-color)'}} />

                                    <GridContent
                                        title="Due Date"
                                        value={transaction.paymentDueDate}
                                        padding={true}>
                                        <Typography style={{color: 'var(--primary-color)'}}>{transaction.paymentDueDate? moment(transaction.paymentDueDate).format(DefaultDateFormat.dateFormat) : ''}</Typography>
                                    </GridContent>

                                    <GridContent
                                        title="Expiry Date"
                                        value={transaction.paymentExpiryDate}
                                        padding={true}>
                                        <Typography style={{ color: 'var(--primary-color)' }}>{transaction.paymentExpiryDate ? moment(transaction.paymentExpiryDate).format(DefaultDateFormat.dateFormat) : ''}</Typography>

                                        {/* <Typography style={{ color: 'var(--primary-color)' }}>{Utils.dateSystemFormat(transaction.paymentExpiryDate)}</Typography> */}
                                    </GridContent>

                                    <GridContent
                                        title="Invoice"
                                        value={transaction.transactionId}>
                                            <Chip
                                                style={{padding:1}}
                                                icon={<PictureAsPdf />}
                                                label="Click here to download Invoice"
                                                clickable
                                                color="primary"
                                                onClick={props.generateInvoice}
                                                />
                                    </GridContent>

                                </Grid>
                            </Grid>

                        </CardContent>
                    </Card>

                </Grid>
            </Grid>

            <Grid container spacing={2} style={{marginTop:"2%"}}>
                <Grid item xs={12}>
                    <ButtonPrimary
                        onClick={props.onMakeAnother}
                        style={{color: 'var(--light-color)', backgroundColor: 'var(--accent-color)'}}
                    >
                        Create Another
                    </ButtonPrimary>
                </Grid>
            </Grid>
        </Box>
    )
}
