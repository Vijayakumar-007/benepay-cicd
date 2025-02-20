/**
 * Single payment transaction component HTML 
 * 
 * @autho Muthukumaran
 */
import React from "react";

// import { Box, Grid, Card, CardContent, Autocomplete, Typography, InputLabel, FormControl, MenuItem, Divider } from "@mui/material";
import { FormGroup, FormControlLabel, Checkbox, InputAdornment } from '@material-ui/core';
import { Box, Grid, Card, CardContent, Typography, InputLabel, FormControl, MenuItem, Divider,withStyles,Backdrop } from "@material-ui/core";
// import { withStyles } from "@material-ui/styles";

import "./single-payment.scss";

import { BootstrapInputOld } from "../../$widgets/form-inputs/BootstrapInputOld";
import { ButtonPrimary, ButtonSecondary } from "../../$widgets/buttons/form-button";
import MUIDatePicker from "../../$widgets/form-inputs/MUIDatePicker";
import MUIPhoneInput from "../../$widgets/form-inputs/MUIPhoneInput";
import ConfirmDialog from "../../$widgets/dialog";
import TitleBar from "../../title-bar/title-bar";
import { PaymentStatusWidget } from "./payment-status";
import dayjs from "dayjs";
import Utils from "../../../service/core/utils";
import { messages } from "../../../config/constants";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import { FileCopyOutlined } from "@material-ui/icons";
import { toast } from "react-toastify";
// import { Backdrop } from "@mui/material";
import { CircularProgress } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { BootstrapLabel } from "components/$widgets/form-inputs/BootstrapLabel";
import { AppCheckBox } from "components/$widgets/form-inputs";

//Review screen
import PaymentReview from "components/customer/payments/review/payment-review";

export function screen1() {
  const {
    formFields,
    currencyList,
    payers,
    showForm,
    transaction,
    mailSent,
    paymentLink,
    txnResponse,
    showExpiry,
    loading,
    showExpiryMobile,
    mobileTitle,
    allowPartialPaymentValue,
    allowManualPay,
    isPaymentReviewScreen,
    merchantTransactionMode,
  } = this.state;

  const CardHead = withStyles((theme) => ({
    root: {
      fontSize: 18,
      marginBottom: 15,
      color: "rgb(38, 77, 115)"
    },
  }))(Typography);

  return (
    <div>
      {isPaymentReviewScreen ? 
        <PaymentReview
          backToPaymentForm = {this.backToPaymentForm}
          createPaymentReq = {this.createPaymentReq}
          formFields = {formFields}
          loading = {loading}
          allowPartialPaymentValue = {allowPartialPaymentValue}
          merchantTransactionMode={merchantTransactionMode}
        />
      :
      <>
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
              title={"New Payment Request"}
              fontSize={"150%"}
            />

            {showForm && (
              <Box>
                <Grid container spacing={3}>

                  <Grid item lg={9} md={12} sm={12} xs={12} mt={1}>
                    <Grid container spacing={3}>

                      {/* Payer Card design - start */}
                      <Grid item xs={12}>
                        <Card>
                          <CardContent>
                            <CardHead gutterBottom style={{color:'var(--secondary-color)'}}>
                              Payer
                            </CardHead>

                            <Grid container style={{ margin: 10 }}>
                              <Grid item xs={12}>
                                <Divider />
                              </Grid>
                            </Grid>

                            <Grid container spacing={2}>

                              <Grid item lg={3} md={6} sm={6} xs={12} >
                                <Grid container>
                                  <Grid item xs={12}>
                                    <BootstrapLabel shrink required htmlFor="payer-name"
                                    onClick={()=>{
                                      console.log("formfields:", this.state.formFields)
                                    }}
                                    >Name</BootstrapLabel>
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Autocomplete
                                      size="small"
                                      id="payer-name"
                                      disableClearable={true}
                                      options={payers.map((option) => option.name)}
                                      value={formFields.payerName.value}
                                      onChange={(e, v) => {
                                        var payerIndex = payers.findIndex(function (entry, i) {
                                          if (entry.name == v) {
                                            return true;
                                          }
                                        });

                                        this.getPayerTransaction(payers[payerIndex]);
                                      }}
                                      renderInput={(params) => (
                                        <TextField
                                        // style={{ width: "350px  " }}
                                        fullWidth
                                        variant="outlined"
                                          {...params}
                                          InputProps={{
                                            ...params.InputProps,
                                            disableUnderline: true
                                          }}
                                          rules={formFields.payerName.rules}
                                          value={formFields.payerName.value}
                                          error={formFields.payerName.errors.length > 0 ? true : false}
                                          onChange={(e) => {
                                            var pName = e.target.value;

                                            if (pName.length == 3) {
                                              this.getPayers(pName)
                                            }

                                            this.updateFormField("payerName", pName);
                                          }}
                                        />
                                      )}
                                    />
                                    {!_.isEmpty(formFields.payerName.errors) && <ul className={'error-msg'} style={{ listStyle: "none", padding: 0 }}>
                                        {formFields.payerName.errors.map((e, index) => <li className="error text-danger" key={index}>* {e}</li>)}
                                    </ul>}
                                  </Grid>
                                </Grid>
                              </Grid>
                          
                            <Grid item lg={3} md={6} sm={6} xs={12}>
                              <BootstrapLabel shrink htmlFor="payer-email">Email</BootstrapLabel>
                              <FormControl fullWidth>
                                <BootstrapInputOld
                                  id="payer-email"
                                  rules={formFields.payerEmail.rules}
                                  value={formFields.payerEmail.value}
                                  error={formFields.payerEmail.errors.length > 0 ? true : false}
                                  errors={formFields.payerEmail.errors}
                                  onChange={(e) => {
                                    this.updateFormField("payerEmail", e.target.value);
                                  }}
                                />
                              </FormControl>
                            </Grid>
                                <Grid item lg={3} md={6} sm={6} xs={12}>
                                  <BootstrapLabel shrink htmlFor="payer-mobile">Mobile Number</BootstrapLabel>
                                  <FormControl fullWidth>
                                    <MUIPhoneInput
                                      id="payer-mobile"
                                      defaultCountry={formFields.mobileCountry.value}
                                      rules={formFields.payerMobile.rules}
                                      value={formFields.payerMobile.value}
                                      error={formFields.payerName.errors.length > 0 ? true : false}
                                      errors={formFields.payerMobile.errors}
                                      countryCodeEditable={false}
                                      disableAreaCodes={true}
                                      onChange={async (e, v) => {
                                        this.updateFormField("mobileCountry", v.countryCode, false);
                                        await this.updateFormField("payerMobileDialCode", v.dialCode, false);
                                      }}
                                      onBlur={(e) => {
                                        let value = e.target.value;
                                        let dialCode = formFields.payerMobileDialCode.value;

                                        let mobileNo = dialCode ? value.replace(`+${dialCode}`, "") : "";

                                        if (mobileNo) {
                                          this.updateFormField("payerMobile", value, true);
                                        } else {
                                          this.updateFormField("payerMobile", "", true);
                                        }
                                      }}
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item lg={3} md={6} sm={6} xs={12}>
                                  <BootstrapLabel shrink htmlFor="debtor-whatsapp-number">WhatsApp Number</BootstrapLabel>
                                  <FormControl fullWidth>
                                    <MUIPhoneInput
                                      id="debtor-whatsapp-number"
                                      defaultCountry={formFields.debtorWhatsAppNumberCountry.value}
                                      rules={formFields.debtorWhatsAppNumber.rules}
                                      value={formFields.debtorWhatsAppNumber.value}
                                      errors={formFields.debtorWhatsAppNumber.errors}
                                      countryCodeEditable={false}
                                      disableAreaCodes={true}
                                      onChange={async (e, v) => {
                                        this.updateFormField("debtorWhatsAppNumberCountry", v.countryCode, false);
                                        await this.updateFormField("debtorWhatsAppNumberDialCode", v.dialCode, false);
                                      }}
                                      onBlur={(e) => {
                                        let value = e.target.value;
                                        let dialCode = formFields.debtorWhatsAppNumberDialCode.value;

                                        let mobileNo = dialCode ? value.replace(`+${dialCode}`, "") : "";

                                        if (mobileNo) {
                                          this.updateFormField("debtorWhatsAppNumber", value, true);
                                        } else {
                                          this.updateFormField("debtorWhatsAppNumber", "", true);
                                        }
                                      }}
                                    />
                                  </FormControl>
                                </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                      {/* Payer Card design - end */}

                      {/* Payer Request details design - start */}
                      <Grid item xs={12}>
                        <Card>
                          <CardContent>
                            <CardHead gutterBottom style={{color:'var(--secondary-color)'}}>
                              Payment Request details
                            </CardHead>

                            <Grid container style={{ margin: 10 }}>
                              <Grid item xs={12}>
                                <Divider />
                              </Grid>
                            </Grid>

                            <Grid container spacing={2} mb={5}>                         
                            <Grid item lg={4} md={6} sm={6} xs={12}>
                              <BootstrapLabel shrink required htmlFor="description">Description</BootstrapLabel>
                              <FormControl fullWidth>
                                <BootstrapInputOld
                                  id="description"
                                  autoComplete="off"
                                  rules={formFields.description.rules}
                                  value={formFields.description.value}
                                  error={formFields.description.errors.length > 0 ? true : false}
                                  errors={formFields.description.errors}
                                  onChange={(e) => {
                                    this.updateFormField("description", e.target.value);
                                  }}
                                />
                              </FormControl>
                            </Grid>

                            <Grid item lg={4} md={6} sm={6} xs={12}>
                              <BootstrapLabel shrink htmlFor="collection-reference">Collection Reference</BootstrapLabel>
                              <FormControl fullWidth>
                                <BootstrapInputOld
                                  id="collection-reference"
                                  autoComplete="off"
                                  rules={formFields.collectionRef.rules}
                                  value={formFields.collectionRef.value}
                                  error={formFields.collectionRef.errors.length > 0 ? true : false}
                                  errors={formFields.collectionRef.errors}
                                  onChange={(e) => {
                                    this.updateFormField("collectionRef", e.target.value);
                                  }}
                                />
                              </FormControl>
                            </Grid>

                            <Grid item lg={4} md={6} sm={6} xs={12}>
                              <BootstrapLabel shrink required htmlFor="transaction-id">Requestor Transaction Id</BootstrapLabel>
                              <FormControl fullWidth>
                                <BootstrapInputOld
                                  id="transaction-id"
                                  autoComplete="off"
                                  rules={formFields.transactionId.rules}
                                  value={formFields.transactionId.value}
                                  error={formFields.transactionId.errors.length > 0 ? true : false}
                                  errors={formFields.transactionId.errors}
                                  onChange={(e) => {
                                    this.updateFormField("transactionId", e.target.value, false );
                                  }}
                                  onBlur={(e) => {
                                    this.updateFormField("transactionId", e.target.value, true, true );
                                  }} />
                              </FormControl>
                            </Grid>

                              <Grid item lg={4} md={6} sm={6} xs={12}>
                                <Grid container>
                                  <Grid item xs={12}>
                                    <BootstrapLabel shrink htmlFor="due-date">Due Date</BootstrapLabel>
                                  </Grid>
                                  <Grid item xs={12}>
                                    <FormControl fullWidth>
                                      <MUIDatePicker
                                        id="due-date"
                                        format={"DD/MM/YYYY"}
                                        placeholder="DD/MM/YYYY"
                                        disablePast={true}
                                        // rules={formFields.dueDate.rules}
                                        // error={formFields.payerName.errors.length > 0 ? true : false}
                                        // errors={formFields.dueDate.errors}
                                        value={formFields.dueDate.value ? dayjs(formFields.dueDate.value) : null}
                                        disableEdit={true}
                                        onChange={this.handleDueDate}
                                        sx={{ margin: 0, padding: 0 }}
                                      />
                                    </FormControl>
                                  </Grid>
                                </Grid>
                              </Grid>

                              {/* <Grid item xs={4} display="flex" justifyContent='center' alignItems='end'>
                                <FormGroup>
                                  <FormControlLabel 
                                    control={
                                      <Checkbox 
                                        onClick={(e) => this.updateFormField("allowPartialPayments", e.target.checked)} 
                                        checked={formFields.allowPartialPayments.value}
                                        color="primary"
                                      />
                                    } 
                                    label="Allow Partial Payments" 
                                  />
                                </FormGroup>
                              </Grid> */}
                              
                              <Grid item lg={4} md={6} sm={6} xs={12} display="flex" justifyContent='center' alignItems='end'>
                                {allowPartialPaymentValue === true ? 
                                
                                  <FormGroup style={{marginTop:"1rem"}}>
                                    <AppCheckBox
                                      label="Allow Partial Payments"
                                      onClick={(e) => this.updateFormField("allowPartialPayments", e.target.checked)}
                                      checked={formFields.allowPartialPayments.value}
                                      style={{color:'var(--secondary-color)'}}
                                    />
                                  </FormGroup>
                                : ""}
                              </Grid>

                            </Grid>
                          </CardContent>

                        </Card>

                      </Grid>
                      {/* Payer Request details design - end */}

                    </Grid>
                  </Grid>

                  {/* Amount details card design - start */}
                  <Grid item lg={3} md={12} sm={12} xs={12} mt={1}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Card>
                          <CardContent>
                            <CardHead gutterBottom style={{color:'var(--secondary-color)'}}>
                              Amount details
                            </CardHead>

                            <Grid container style={{ margin: 10 }}>
                              <Grid item xs={12}>
                                <Divider />
                              </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                              <Grid item lg={12} md={12} sm={12} xs={12} style={{margin:0}}>
                                <BootstrapLabel shrink required htmlFor="initial-amount">Amount</BootstrapLabel>
                              </Grid>

                              <Grid item xs={12} mt={0}>
                                <Grid container spacing={4}>
                                  <Grid item xs={3} style={{ paddingTop:0, marginTop: 0, zIndex: '5' }}>
                                    <FormControl fullWidth>
                                        <Autocomplete
                                          size="small"
                                          id="amount-ccy"
                                          disableClearable={true}
                                          options={this.state.currencyList ? this.state.currencyList.map((option) => option.code) : []}
                                          value={formFields.reqCurrency.value != null ? formFields.reqCurrency.value : ''}
                                          style={{width: "50% !important"}}
                                          onChange={(e, v) => {
                                            this.updateDecimalInRule(v);
                                            this.updateFormField("reqCurrency", v);
                                          }}
                                          renderInput={(params) => (
                                            <TextField
                                            // style={{ width: "350px  " }}
                                            fullWidth
                                            variant="outlined"
                                              {...params}
                                              InputProps={{
                                                ...params.InputProps,
                                                disableUnderline: true
                                              }}
                                              // rules={formFields.payerName.rules}
                                              value={formFields.reqCurrency.value}
                                              errors={formFields.reqCurrency.errors}
                                            />
                                          )}
                                        />
                                    </FormControl>
                                  </Grid>

                                  <Grid item xs={9} style={{paddingTop:0, marginTop: 0}}>
                                    <BootstrapInputOld
                                      id="initial-amount"
                                      autoComplete="off"
                                      value={formFields.initialAmount.value}
                                      rules={formFields.initialAmount.rules}
                                      error={formFields.initialAmount.errors.length > 0 ? true : false}
                                      errors={formFields.initialAmount.errors}
                                      onBlur={(e) => {
                                        e.persist();

                                        let amount = this.autoFixDecimal("initialAmount", e.target.value)

                                        this.updateFormField("initialAmount", amount);
                                        
                                        // find the requested amount
                                        this.generateRequestedAmout();
                                      }}
                                      onChange={this.handleInitialAmount} 
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>

                              <Grid item lg={12} md={6} sm={12} xs={12}>
                                <BootstrapLabel shrink htmlFor="charge-amount">Charges</BootstrapLabel>
                                <FormControl fullWidth>
                                  <BootstrapInputOld
                                    id="charge-amount"
                                    autoComplete="off"
                                    value={formFields.chargeAmount.value}
                                    error={formFields.payerName.errors.length > 0 ? true : false}
                                    errors={formFields.chargeAmount.errors}
                                    InputProps={{
                                      startAdornment: <InputAdornment position="start">{formFields.reqCurrency.value}</InputAdornment>,
                                    }}
                                    onBlur={(e) => {
                                      e.persist();

                                      let amount = this.autoFixDecimal("chargeAmount", e.target.value)

                                      this.updateFormField("chargeAmount", amount);

                                      // find the requested amount
                                      this.generateRequestedAmout();
                                    }}
                                    onChange={this.handleChangeAmount}
                                  />
                                </FormControl>
                              </Grid>
                          
                              <Grid item lg={12} md={6} sm={12} xs={12}>
                                <BootstrapLabel shrink htmlFor="amount-ccy">Total Amount</BootstrapLabel>

                                <FormControl fullWidth>
                                  <BootstrapInputOld fullWidth
                                    id="requested-amount"
                                    autoComplete="off"
                                    rules={formFields.reqAmount.rules}
                                    value={formFields.reqAmount.value}
                                    error={formFields.payerName.errors.length > 0 ? true : false}
                                    errors={formFields.reqAmount.errors}
                                    InputProps={{
                                      startAdornment: <InputAdornment position="start">{formFields.reqCurrency.value}</InputAdornment>,
                                    }}
                                    onBlur={(e) => {
                                      e.persist();

                                      let amount = this.autoFixDecimal("reqAmount", e.target.value)

                                      this.updateFormField("reqAmount", amount);
                                    }}
                                    onChange={this.handleRequestedAmount}
                                  />
                                </FormControl>
                              </Grid>

                              <Grid item  lg={12} md={12} sm={12} xs={12}>
                                <BootstrapLabel shrink required={formFields.chargeReason.rules.length > 0} htmlFor="charge-reason">
                                  Reason for charges
                                </BootstrapLabel>
                                <FormControl fullWidth>
                                  <BootstrapInputOld multiline
                                    rows={3}
                                    id="charge-reason"
                                    autoComplete="off"
                                    value={formFields.chargeReason.value}
                                    error={formFields.payerName.errors.length > 0 ? true : false}
                                    errors={formFields.chargeReason.errors}
                                    onChange={(e) => {
                                      this.updateFormField("chargeReason", e.target.value);
                                    }}
                                  />
                                </FormControl>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Grid>
                  {/* Amount details card design - end */}

                </Grid>

                <Grid container spacing={2} mt={2}>
                  <Grid item xs={12}>
                    <ButtonPrimary
                      id="singlePaymentReviewSubmitBtn"
                      onClick={this.handlePaymentReview}
                    >
                      Submit
                    </ButtonPrimary>

                    <ButtonSecondary
                      id="singlePaymentFormClearBtn"
                      style={{ marginLeft: "5px"}}
                      onClick={() => {
                        this.resetForm();
                      }}>
                      Clear
                    </ButtonSecondary>
                  </Grid>
                </Grid>

              </Box>
            )}

            {!showForm && <PaymentStatusWidget
              transaction={transaction}
              mailSent={mailSent}
              paymentLink={paymentLink}
              message={txnResponse}
              allowManualPay={allowManualPay}
              onMakeAnother={(e) => { this.resetForm(); }}
              generateInvoice={(e) => { this.handleGenerateInvoice(transaction.transactionId) }}
            />
            }

            {/* {showExpiry && <ConfirmDialog title="Warning" open={true} setOpen={true}>
              <Typography style={{marginBottom:20}}>
                {messages.spConfirm.replace('{date}', Utils.dateSystemFormat(formFields.expiryDate.value))}
              </Typography>

              <ButtonPrimary onClick={(e) => {
                this.submitForm();
                this.setState({ showExpiry: false });
              }}>
                Confirm
              </ButtonPrimary>

              <ButtonSecondary
                style={{ marginLeft: "5px" }}
                onClick={(e) => {
                  this.setState({ showExpiry: false });
                }}>
                Cancel
              </ButtonSecondary>
            </ConfirmDialog>} */}
          </Box>        
      </>
      }
    </div>

  );
}
