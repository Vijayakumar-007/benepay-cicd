import React from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Grid, Typography } from "@material-ui/core";
import DownloadIcon from '@mui/icons-material/Download';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Loader from "components/$widgets/loader";

export function html() {
    var details = null;

    const {
        expanded,
        paymentProviders,
        loading
    } = this.state;

    return (
        <div style={{ width: '100%', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            <Loader loading={loading} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <h1 style={{ color: 'var(--primary-color)', fontSize: '22px', fontFamily: 'sans-serif', margin: '0' }}>Your Profile</h1>
                {/* <Button
                    className="downloadButton"
                    onClick={this.handleDownloadClick}
                    style={{ color: 'black', textDecoration: 'underline', textDecorationThickness: '2px' }}
                >
                    <DownloadIcon style={{ marginRight: '5px', color: 'black' }} /> Download
                </Button> */}
            </div>

            <div style={{ width: '100%', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                <Card style={{ marginBottom: '2rem' }}>
                    <CardContent style={{ padding: 'unset' }} >
                        <Grid container  >
                            <Grid item lg={12} xl={12} md={12} sm={12} xs={12} style={{ backgroundColor: 'var(--primary-color)', height: '53px', color: 'rgb(235, 227, 227)', display: 'flex', alignItems: 'center', width: '100%', paddingLeft: '8px' }}>

                                <Typography style={{ fontSize: '14px', color: 'rgb(235, 227, 227)', fontWeight: 'bold' }}>
                                    Merchant Details
                                </Typography>
                            </Grid>
                            <Grid container mt={4} style={{ paddingLeft: '13px', rowGap: 13 }}>
                                <Grid item lg={3} xl={3} md={6} sm={6} xs={6} style={{ marginTop: '10px' }} >
                                    <Typography>Merchant ID </Typography>


                                </Grid>
                                <Grid item lg={9} xl={9} md={6} sm={6} xs={6} style={{ marginTop: '10px' }}>
                                    <Typography> {this.state.mDetails.merchantId}
                                    </Typography>

                                </Grid>
                                <Grid item lg={3} xl={3} md={6} sm={6} xs={6} >
                                    <Typography>logo </Typography>
                                </Grid>
                                <Grid item lg={9} xl={9} md={6} sm={6} xs={6} >
                                    <img src={this.state.mDetails.merchantLogoUrl}
                                        style={{ height: '50px', width: '50px' }}
                                    />

                                </Grid>
                                <Grid item lg={3} xl={3} md={6} sm={6} xs={6} >
                                    <Typography>Industry </Typography>
                                </Grid>
                                <Grid item lg={9} xl={9} md={6} sm={6} xs={6} >
                                    <Typography> {this.state.mDetails.industryType} </Typography>
                                </Grid>
                                <Grid item lg={3} xl={3} md={6} sm={6} xs={6} >
                                    <Typography>Registration No </Typography>
                                </Grid>
                                <Grid item lg={9} xl={9} md={6} sm={6} xs={6} >
                                    <Typography> {this.state.mDetails.regnNo} </Typography>
                                </Grid>
                                <Grid item lg={3} xl={3} md={6} sm={6} xs={6} >
                                    <Typography>Trading Address </Typography>
                                </Grid>
                                <Grid item lg={9} xl={9} md={6} sm={6} xs={6}  >
                                    <Typography style={{ whiteSpace: 'pre-wrap' }}> 
                                    {this.state.tAddress ? this.state.tAddress : '-'}
                                    </Typography>
                                </Grid>
                                <Grid item lg={3} xl={3} md={6} sm={6} xs={6}>
                                    <Typography>Registered Address </Typography>
                                </Grid>
                                <Grid item lg={9} xl={9} md={6} sm={6} xs={6} style={{ whiteSpace: 'pre-wrap' }}>
                                    <Typography style={{ whiteSpace: 'pre-wrap' }}> 
                                    {this.state.rAddress ? this.state.rAddress : '-'}
                                    </Typography>
                                </Grid>
                                <Grid container spacing={1} style={{ marginTop: '1%' }}>
                                    <Grid item lg={12} xl={12} md={12} sm={12} xs={12}>
                                        <Typography style={{ textDecoration: 'underline' }}>
                                            Primary Contact
                                        </Typography>
                                    </Grid>
                                    <Grid item lg={3} xl={3} md={6} sm={6} xs={6} >
                                        <Typography>Name  </Typography>
                                    </Grid>
                                    <Grid item lg={9} xl={9} md={6} sm={6} xs={6} >
                                        <Typography>{this.state.mDetails.primaryContact && this.state.mDetails.primaryContact.firstName ? this.state.mDetails.primaryContact.firstName : '-'}</Typography>
                                    </Grid>
                                    <Grid item lg={3} xl={3} md={6} sm={6} xs={6} >
                                        <Typography>Work Email Id </Typography>
                                    </Grid>
                                    <Grid item lg={9} xl={9} md={6} sm={6} xs={6} >
                                        <Typography>{this.state.mDetails.primaryContact && this.state.mDetails.primaryContact.emailId ? this.state.mDetails.primaryContact.emailId : '-'}</Typography>
                                    </Grid>
                                    <Grid item lg={3} xl={3} md={6} sm={6} xs={6} >
                                        <Typography>Mobile Number </Typography>
                                    </Grid>
                                    <Grid item lg={9} xl={9} md={6} sm={6} xs={6} >
                                        <Typography> {this.state.mDetails.primaryContact && this.state.mDetails.primaryContact.phoneNo ? this.state.mDetails.primaryContact.phoneNo : '-'}   </Typography>
                                    </Grid>
                                    <Grid item lg={3} xl={3} md={6} sm={6} xs={6} >
                                        <Typography>Designation </Typography>
                                    </Grid>
                                    <Grid item lg={9} xl={9} md={6} sm={6} xs={6} >
                                        <Typography>{this.state.mDetails.primaryContact && this.state.mDetails.primaryContact.designation ? this.state.mDetails.primaryContact.designation : '-'}   </Typography>

                                    </Grid>
                                    <Grid container spacing={1} style={{ marginTop: '1%', marginBottom: '1%' }}>
                                        <Grid item lg={12} xl={12} md={12} sm={12} xs={12}>
                                            <Typography style={{ textDecoration: 'underline' }}>
                                                Secondary  Contact
                                            </Typography>
                                        </Grid>
                                        <Grid item lg={3} xl={3} md={6} sm={6} xs={6} >
                                            <Typography>secondary contact </Typography>
                                        </Grid>
                                        <Grid item lg={9} xl={9} md={6} sm={6} xs={6} >
                                        <Typography style={{ whiteSpace: 'pre-wrap' }} > 
                                                 {this.state.secContact ? this.state.secContact : '-'}
                                            </Typography>
                                           
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </div>

            <div style={{ height: 'auto', width: '100%', overflow: 'auto' }}>
                <div style={{ height: 'auto', width: '100%', overflow: 'auto' }}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650, border:'solid 1px lightyellow' }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell colSpan={4} className="blue-header-for-merchant-profile">Providers</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    paymentProviders && paymentProviders.map((p, i) => {
                                        let foundRecords = false;
                                        return (
                                            <>
                                                <Accordion expanded={expanded === `${'panel' + i}`} onChange={this.handleChange(`${'panel' + i}`)}>
                                                    <AccordionSummary
                                                        expandIcon={<ExpandMoreIcon />}
                                                        aria-controls="panel1bh-content"
                                                        id="panel1bh-header"
                                                    >
                                                        <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                                            {p.paymentProviderName}
                                                        </Typography>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell className="blue-header2">Collection</TableCell>
                                                                    <TableCell className="blue-header2">Service Status</TableCell>
                                                                    <TableCell className="blue-header2">Service Start Date</TableCell>
                                                                    <TableCell className="blue-header2">Service End Date </TableCell>
                                                                    <TableCell className="blue-header2">Settlement Account </TableCell>
                                                                    <TableCell className="blue-header2" style={{ textAlign: 'center' }}>Settlement Ccy </TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {
                                                                    this.state.finalPRows.map((v, i) => {

                                                                        if (p.providerId == v.col8) {
                                                                            // Records found
                                                                            foundRecords = true;
                                                                            return (
                                                                                <>
                                                                                    <TableRow key={i}
                                                                                        style={{ borderBottom: (this.state.finalPRows.length - 1) === i ? 'unset' : 'hidden' }}
                                                                                    >
                                                                                        <TableCell>{v.col1 ? v.col1 : "-"}</TableCell>
                                                                                        <TableCell>{v.col2 ? v.col2 : "-"}</TableCell>
                                                                                        <TableCell>{v.col3 ? v.col3 : "-"}</TableCell>
                                                                                        <TableCell>{v.col4 ? v.col4 : "-"}</TableCell>
                                                                                        <TableCell>{v.col6 ? v.col6 : "-"}</TableCell>
                                                                                        <TableCell style={{ textAlign: 'center' }}>{v.col7 ? v.col7 : "-"}</TableCell>
                                                                                    </TableRow>
                                                                                </>
                                                                            )
                                                                        }
                                                                    })
                                                                }
                                                            </TableBody>
                                                        </Table>
                                                        {
                                                            !foundRecords &&
                                                            <Typography style={{ display: 'flex', justifyContent: 'center', marginTop: '1%' }}>
                                                                No payment methods are active!
                                                            </Typography>
                                                        }
                                                    </AccordionDetails>
                                                </Accordion>
                                            </>
                                        )
                                    })
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>

            <div style={{ height: 'auto', width: '100%', overflow: 'auto', marginTop: '30px' }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650, border: '1px solid #e0e0e0' }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={6} className="blue-header-for-merchant-profile">Preferences</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>

                            {this.state.finalSPDetails.map((row, i) => {
                                const rowColor = i % 2 === 0 ? 'unset' : 'rgb(178 215 255 / 42%)';
                                return (
                                    <>
                                        <TableRow key={i}
                                            style={{ borderBottom: (this.state.finalSPDetails.length - 1) === i ? 'unset' : 'hidden', backgroundColor: rowColor }}
                                        >
                                            <TableCell>{row.col1 ? row.col1 : "-"}</TableCell>
                                            <TableCell>{row.col2 ? row.col2 : "-"}</TableCell>
                                            <TableCell>{row.col3 ? row.col3 : "-"}</TableCell>
                                            <TableCell>{row.col4 ? row.col4 : "-"}</TableCell>
                                            <TableCell>{row.col5 ? row.col5 : "-"}</TableCell>
                                           
                                        </TableRow>
                                    </>
                                );
                            })}

                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            <div style={{ height: 'auto', width: '100%', overflow: 'auto', marginTop: '30px' }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650, border: '1px solid #e0e0e0' }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={4} className="blue-header-for-merchant-profile">Merchant Notification</TableCell>
                                <TableCell colSpan={4} className="blue-header-for-merchant-profile">Payer Notification</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow style={{ borderBottom: 'hidden' }}>
                                <TableCell></TableCell>
                                <TableCell style={{ textAlign: 'center' }} > SMS Notification</TableCell>
                                <TableCell style={{ textAlign: 'center' }} >Whatsapp Notification</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>Email Notification</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>Via SMS </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>Via Whatsapp </TableCell>
                                <TableCell style={{ textAlign: 'center' }}> Via Email </TableCell>
                                <TableCell style={{ textAlign: 'center' }}> Freq </TableCell>
                            </TableRow>
                            {
                                this.state.finalNtnDetails.map((v, i) => {
                                    const rowColor = i % 2 === 0 ? 'unset' : 'rgb(178 215 255 / 42%)';

                                    return (
                                        <TableRow key={i}
                                            style={{ borderBottom: (this.state.finalNtnDetails.length - 1) === i ? 'unset' : 'hidden', backgroundColor: rowColor }}
                                        >
                                            <TableCell>{v.col1 ? v.col1 : "-"}</TableCell>
                                            <TableCell style={{ textAlign: 'center' }}>{v.col2 ? v.col2 : "-"}</TableCell>
                                            <TableCell style={{ textAlign: 'center' }}>{v.col3 ? v.col3 : "-"}</TableCell>
                                            <TableCell style={{ textAlign: 'center' }}>{v.col4 ? v.col4 : "-"}</TableCell>
                                            <TableCell style={{ textAlign: 'center' }}>{v.col5 ? v.col5 : "-"}</TableCell>
                                            <TableCell style={{ textAlign: 'center' }}>{v.col6 ? v.col6 : "-"}</TableCell>
                                            <TableCell style={{ textAlign: 'center' }}>{v.col7 ? v.col7 : "-"}</TableCell>
                                            <TableCell style={{ textAlign: 'center' }}>{i == "4" ? v.col8 + "  Days" : ""}</TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div >
    );
}
