/**
 * ManualPayPaymentReqStatus component
 */
import React, { useRef, useState } from 'react';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

//Components
import { Chip, Button } from '@material-ui/core';
import { Box, Grid, Card, CardContent, Typography, IconButton, Divider, Backdrop } from "@material-ui/core";
import TitleBar from "components/title-bar/title-bar";
import { CircularProgress } from "@material-ui/core";
import moment from 'moment';
import { toast } from "react-toastify";
import QRCode from "qrcode.react";

//Icons
import {
    faCheckCircle, faCircleXmark
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import GetAppIcon from '@material-ui/icons/GetApp';

//Images
import pdfIcon from "assets/images/pdf-icon.png";
import Utils from 'service/core/utils';
import { DefaultDateFormat, manualPay } from 'config/constants';

const ManualPayPaymentReqStatus = (props) => {
    const {
        loading,
        invoiceTypeList,
        transaction,
        paymentLink,
        loginMerchantName,
        bankAccountTypes,
        merchantTransactionMode,
    } = props;

    const [pdfDownloadLoading, setPdfDownloadLoading] = useState(false);

    const downloadPDF = async () => {
        setPdfDownloadLoading(true);

        const firstPageContent = document.getElementById("firstPage");
        // const secondPageContent = document.getElementById("secondPage");

        if (!firstPageContent) return;

        try {
            const scale = 5; // Higher scale for better quality
            const pdf = new jsPDF("p", "mm", "a4"); // A4 size PDF

            // Define PDF width (A4 width in mm)
            const pdfWidth = 210; // A4 width in mm
            const pageHeight = pdf.internal.pageSize.getHeight(); // A4 height in mm

            // Capture first page
            const firstCanvas = await html2canvas(firstPageContent, { scale, useCORS: true });
            const firstImg = firstCanvas.toDataURL("image/png");
            const firstHeight = (firstCanvas.height * pdfWidth) / firstCanvas.width; // Maintain aspect ratio

            pdf.addImage(firstImg, "PNG", 0, 0, pdfWidth, Math.min(firstHeight, pageHeight), "", "FAST");

            // // Add new page
            // pdf.addPage();

            // // Capture second page
            // const secondCanvas = await html2canvas(secondPageContent, { scale, useCORS: true });
            // const secondImg = secondCanvas.toDataURL("image/png");
            // const secondHeight = (secondCanvas.height * pdfWidth) / secondCanvas.width;

            // // Add second page content
            // pdf.addImage(secondImg, "PNG", 0, 0, pdfWidth, Math.min(secondHeight, pageHeight), "", "FAST");

            // Save the PDF
            pdf.save("payment-request.pdf");
            setPdfDownloadLoading(false);
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };

    const handleDownloadQrClick = () => {
        const canvas = document.getElementById('qr-code-canvas');
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = 'Payment-QRCode';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

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

            <Box mt={4}>
                <TitleBar
                    className={"mt-3"}
                    ruleColor="blue"
                    title={"New Payment Request >> Confirmation"}
                    fontSize={"150%"}
                />
            </Box>

            <Box mt={2}>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={12} md={12} lg={7} xl={7}>
                        <Card style={{ width: '100%' }}>
                            <CardContent style={{marginLeft: '10px', marginBottom: '10px', marginRight:'10px'}}>
                                <Grid container style={{ width: '100%' }} id="firstPage">
                                    <Grid item xs={10} style={{ color: 'var(--primary-color)' }}>
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            {transaction.status ?
                                                <>
                                                    <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: "35px", color: "green", paddingRight: '15px' }} />
                                                    <div>
                                                        <Typography variant="body1">Payment request successfully created.</Typography>
                                                        <Typography variant="body1">
                                                            Below details have been sent to the payer over email, OR please send the below details to your payer.
                                                        </Typography>
                                                    </div>
                                                </>
                                                :
                                                <>
                                                    <FontAwesomeIcon icon={faCircleXmark} style={{ fontSize: "35px", color: "red", paddingRight: '15px' }} />
                                                    <div>
                                                        <Typography variant="body1" style={{ fontSize: '21px', fontWeight: '600' }}>Payment Creation Failed !</Typography>
                                                    </div>
                                                </>
                                            }
                                        </div>
                                    </Grid>

                                    <Grid item xs={2} style={{ display: "flex", alignItems: "center", justifyContent: "end" }}>
                                        <img src={pdfIcon} width={40} />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Divider style={{ marginTop: '4%', marginBottom: '4%', padding: '1px', backgroundColor: 'var(--primary-color)' }} />
                                    </Grid>

                                    <Grid item xs={12} style={{ display: "flex", alignItems: "center", fontWeight: "bold" }}>
                                        <Typography fontSize={15} style={{ color: 'var(--dark-color)', paddingRight: "15px", marginLeft:'1%' }}>
                                            BenePay Transaction Id :
                                        </Typography>

                                        <Typography
                                            fontSize={15}
                                            style={{ color: "var(--accent-color)", paddingRight: "15px" }}
                                        >
                                            {transaction.transactionId}
                                        </Typography>

                                        <IconButton
                                            style={{ padding: "0px" }}
                                            onClick={() => {
                                                Utils.copyContent(transaction.transactionId, (e) => {
                                                    toast.success('Copied!');
                                                })
                                            }}
                                        >
                                            <FileCopyOutlinedIcon
                                                style={{ color: "var(--accent-color)" }}
                                            />
                                        </IconButton>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Divider style={{ marginTop: '4%', marginBottom: '4%' }} />
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography style={{marginLeft:'2%'}}>Transaction status</Typography>
                                    </Grid>

                                    <Grid item xs={6} style={{marginBottom:'2%'}}>
                                        {
                                            transaction.status ?
                                                <Typography style={{ fontSize: '15px', fontWeight: 'bold', color: 'green', marginRight:'2%' }}>AWAITING_PAYMENT</Typography>
                                                : <Typography style={{ fontSize: '15px', fontWeight: 'bold', color: 'green' }}>FAILED</Typography>
                                        }
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography style={{marginLeft:'2%'}}>Payer</Typography>
                                    </Grid>

                                    <Grid item xs={6} style={{marginBottom:'2%'}}>
                                        <Typography variant='body1'>{transaction.debtorName}</Typography>
                                        <Typography variant='body1'>{transaction.debtorEmailId}</Typography>
                                        <Typography variant='body1'>{transaction.debtorMobileNumber}</Typography>
                                    </Grid>

                                    {transaction.collectionReferenceNo &&
                                        <>
                                            <Grid item xs={6}>
                                                <Typography style={{marginLeft:'2%'}}>Collection/Invoice Reference</Typography>
                                            </Grid>

                                            <Grid item xs={6} style={{marginBottom:'2%'}}>
                                                <Typography>{transaction.collectionReferenceNo}</Typography>
                                            </Grid>
                                        </>
                                    }

                                    {transaction.invoiceType &&
                                        <>
                                            <Grid item xs={6}>
                                                <Typography style={{marginLeft:'2%'}}>Invoice Type</Typography>
                                            </Grid>

                                            <Grid item xs={6} style={{marginBottom:'2%'}}>
                                                <Typography>{invoiceTypeList.find(item => item.lookupCode === transaction.invoiceType)?.description || ''}</Typography>
                                            </Grid>
                                        </>
                                    }

                                    {transaction.collectionCurrency && transaction.finalDueAmount &&
                                        <>
                                            <Grid item xs={6}>
                                                <Typography style={{marginLeft:'2%'}}>Requested Amount</Typography>
                                            </Grid>

                                            <Grid item xs={6} style={{marginBottom:'2%'}}>
                                                <Typography>{transaction.collectionCurrency + " " + transaction.finalDueAmount}</Typography>
                                            </Grid>
                                        </>
                                    }

                                    {transaction.createTimeStamp &&
                                        <>
                                            <Grid item xs={6}>
                                                <Typography style={{marginLeft:'2%'}}>Create Timestamp</Typography>
                                            </Grid>

                                            <Grid item xs={6} style={{marginBottom:'2%'}}>
                                                <Typography>{transaction.createTimeStamp}</Typography>
                                            </Grid>
                                        </>
                                    }

                                    {transaction.invoiceDate &&
                                        <>
                                            <Grid item xs={6}>
                                                <Typography style={{marginLeft:'2%'}}>Invoice Date</Typography>
                                            </Grid>

                                            <Grid item xs={6} style={{marginBottom:'2%'}}>
                                                <Typography>{transaction.invoiceDate ? moment(transaction.invoiceDate).format(DefaultDateFormat.dateFormatInSlash) : ''}</Typography>
                                            </Grid>
                                        </>
                                    }

                                    {transaction.paymentDueDate &&
                                        <>
                                            <Grid item xs={6}>
                                                <Typography style={{marginLeft:'2%'}}>Due Date</Typography>
                                            </Grid>

                                            <Grid item xs={6} style={{marginBottom:'2%'}}>
                                                <Typography>{transaction.paymentDueDate ? moment(transaction.paymentDueDate).format(DefaultDateFormat.dateFormatInSlash) : ''}</Typography>
                                            </Grid>
                                        </>
                                    }

                                    {transaction.paymentExpiryDate &&
                                        <>
                                            <Grid item xs={6}>
                                                <Typography style={{marginLeft:'2%'}}>Expiry Date</Typography>
                                            </Grid>

                                            <Grid item xs={6} style={{marginBottom:'2%'}}>
                                                <Typography>{transaction.paymentExpiryDate ? moment(transaction.paymentExpiryDate).format(DefaultDateFormat.dateFormatInSlash) : ''}</Typography>
                                            </Grid>
                                        </>
                                    }

                                    {transaction.purposeCode &&
                                        <>
                                            <Grid item xs={6}>
                                                <Typography style={{marginLeft:'2%'}}>Purpose Code</Typography>
                                            </Grid>

                                            <Grid item xs={6} style={{marginBottom:'2%'}}>
                                                <Typography>{transaction.purposeCode}</Typography>
                                            </Grid>
                                        </>
                                    }

                                    {transaction.reasonForCollection &&
                                        <>
                                            <Grid item xs={6}>
                                                <Typography style={{marginLeft:'2%'}}>Invoice Description</Typography>
                                            </Grid>

                                            <Grid item xs={6} style={{marginBottom:'2%'}}>
                                                <Typography>{transaction.reasonForCollection}</Typography>
                                            </Grid>
                                        </>
                                    }

                                    {transaction.status &&
                                        <>
                                            <Grid item xs={12}>
                                                <Box mt={2} 
                                                    style={{ 
                                                        border: '1px solid rgba(0, 0, 0, 0.54)',
                                                        borderTopLeftRadius: '4px',
                                                        borderTopRightRadius: '4px',
                                                    }}
                                                >
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} style={{ padding: '20px' }}>
                                                            <Typography style={{ fontWeight: 'bold' }}>Payment Options</Typography>
                                                        </Grid>

                                                        <Grid item xs={12} style={{ marginTop: '-15px' }}>
                                                            <Divider style={{ backgroundColor: 'rgba(0, 0, 0, 0.54)' }} />
                                                        </Grid>

                                                        <Grid item xs={12} style={{ marginLeft: '15px', marginBottom: '12px' }}>
                                                            <Grid container spacing={1}>
                                                                {merchantTransactionMode != manualPay.transactionModeManual &&
                                                                    <>
                                                                        <Grid item xs={4}>
                                                                            <Typography>Online Payment link</Typography>
                                                                        </Grid>
                                                                        
                                                                        <Grid item xs={8}>
                                                                            <Typography>
                                                                                {paymentLink}
                                                                                <IconButton
                                                                                    style={{ padding: "0px", paddingLeft:'10px' }}
                                                                                    onClick={() => {
                                                                                        Utils.copyContent(paymentLink, (e) => {
                                                                                            toast.success('Copied!');
                                                                                        })
                                                                                    }}
                                                                                >
                                                                                    <FileCopyOutlinedIcon
                                                                                        style={{ color: "var(--accent-color)" }}
                                                                                    />
                                                                                </IconButton>
                                                                            </Typography>
                                                                        </Grid>
                                                                        {
                                                                        ( transaction.qrString && transaction.qrString != null) &&
                                                                        <>
                                                                            <Grid item xs={4}>
                                                                                <Typography>QR Code</Typography>
                                                                            </Grid>

                                                                            <Grid item xs={8} style={{ display: 'flex', alignItems: 'start' }}>
                                                                                <QRCode
                                                                                    value={transaction.qrString}
                                                                                    id="qr-code-canvas"
                                                                                    size={128}
                                                                                    style={{ paddingRight: '10px' }}
                                                                                />
                                                                                <IconButton
                                                                                    aria-label="Download"
                                                                                    style={{ padding: "0" }}
                                                                                    onClick={handleDownloadQrClick}
                                                                                >
                                                                                    <GetAppIcon style={{ color: "var(--accent-color)" }} />
                                                                                </IconButton>
                                                                            </Grid>
                                                                        </>
                                                                        }
                                                                    </>
                                                                }

                                                                <Grid item xs={12}>
                                                                    <Typography style={{ fontWeight: 'bold', marginTop: '10px' }}>Pay via Local Bank Account (ACH/RTP/Fedwire)</Typography>
                                                                </Grid>

                                                                <Grid item xs={12}>
                                                                    <Typography>Beneficiary:{" " + loginMerchantName}</Typography>
                                                                </Grid>

                                                                <Grid item xs={12}>
                                                                    <Typography>Bank:{transaction.bankName ? " " + transaction.bankName : ''}</Typography>
                                                                </Grid>

                                                                <Grid item xs={12}>
                                                                    <Typography>Bank Address: {transaction.bankAddress ? " " + transaction.bankAddress : ''}</Typography>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                            
                                                        {transaction.merchantVirtualAccounts &&
                                                            <Grid item xs={12}>
                                                                <Divider/>
                                                            </Grid>
                                                        }

                                                        {transaction.merchantVirtualAccounts && transaction.merchantVirtualAccounts.map((account, index) => (
                                                            <React.Fragment key={account.virtualAccountId}>
                                                                <Grid item xs={8} sm={8} md={6} lg={6} xl={6}>
                                                                    <div style={{  marginLeft: '15px', marginBottom: '12px' }}>
                                                                        <Typography style={{ fontWeight: 'bold' }}>
                                                                            Pay via {account.virtualAccountName}
                                                                        </Typography>
                                                                        <Typography variant="body1" style={{ marginTop: '10px' }}>
                                                                            Account Number: {account.accountNumber}
                                                                        </Typography>
                                                                        <Typography variant="body1">
                                                                            Routing Number: {account.routingNumber}
                                                                        </Typography>
                                                                        <Typography variant="body1">
                                                                            Account Type: {bankAccountTypes.find(item => item.lookupCode == account.accountTypeId)?.description || ''}
                                                                        </Typography>
                                                                    </div>
                                                                </Grid>
                                                            </React.Fragment>
                                                        ))}
                                                    </Grid>
                                                </Box>
                                            </Grid>
                                        </>
                                    }
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

            <Box mt={2}>
                <Grid container spacing={1}>
                    <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
                        {transaction.status &&
                            <>
                                <Button
                                    style={{ textTransform: 'none', color: 'white', background: 'var(--primary-color)', paddingRight: '20px', width: '13vw', marginRight: '5%' }}
                                    onClick={downloadPDF}
                                >
                                    {pdfDownloadLoading ?
                                    <div style={{display:'flex', justifyContent:'center', alignItems:'center', color:'white'}}>
                                        <CircularProgress size={15} color='white' />&ensp;Loading...
                                    </div>
                                    :
                                    "Save as PDF"
                                    }
                                </Button>
                            </>
                        }

                        <Button
                            style={{ textTransform: 'none', color: 'white', background: 'var(--primary-color)', width: '13vw' }}
                            onClick={props.onMakeAnother}
                        >
                            Create Another
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
};

export default ManualPayPaymentReqStatus;