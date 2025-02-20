/**
 * Single payment transaction component HTML 
 * 
 * @autho Muthukumaran
 */
import React from "react";

// import { Box, Grid, Card, CardContent, Autocomplete, Typography, InputLabel, FormControl, MenuItem, Divider } from "@mui/material";
import { FormGroup, FormControlLabel, Checkbox, InputAdornment } from '@material-ui/core';
import { Box, Grid, Card, CardContent, Typography, InputLabel, FormControl, MenuItem, Divider, withStyles, Backdrop } from "@material-ui/core";
// import { withStyles } from "@material-ui/styles";

import "./single-payment.scss";

import { BootstrapInputOld } from "../../$widgets/form-inputs/BootstrapInputOld";
import { ButtonPrimary, ButtonSecondary } from '../../$widgets/buttons/form-button';
import MUIDatePicker from "../../$widgets/form-inputs/MUIDatePicker";
import MUIPhoneInput from "../../$widgets/form-inputs/MUIPhoneInput";
import ConfirmDialog from "../../$widgets/dialog";
import TitleBar from "../../title-bar/title-bar";
import { PaymentStatusWidget } from "./payment-status";
import dayjs from "dayjs";
import Utils from "../../../service/core/utils";
import { manualPay, messages } from "../../../config/constants";
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

//Component
import FancyFileInput from "components/$widgets/form-inputs/fancy-file-input";

//Manual pay success screen
import ManualPayPaymentReqStatus from "components/customer/payments/manualPaySuccessPage";

//Icons
import {
  faFileAlt, faCloudArrowUp
} from "@fortawesome/free-solid-svg-icons";

export function screen2() {
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
    isChargesDisabled,
    // isRequesterIdDisabled,
    isTotalAmountDisabled,
    isPaymentReviewScreen,
    isAutoReqTnxId,
    invoiceTypeList,
    merchantTransactionMode,
    selectedFile,
    manualPaymentReqStatus,
    bankAccountTypes,
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
          backToPaymentForm={this.backToPaymentForm}
          createPaymentReq={this.createPaymentReq}
          formFields={formFields}
          loading={loading}
          allowPartialPaymentValue={this.state.allowPartialPaymentValue}
          isChargesDisabled={isChargesDisabled}
          // isRequesterIdDisabled={isRequesterIdDisabled}
          isTotalAmountDisabled={isTotalAmountDisabled}
          isAutoReqTnxId={isAutoReqTnxId}
          merchantTransactionMode={merchantTransactionMode}
          selectedFile={selectedFile}
          invoiceTypeList={invoiceTypeList}
        />
        : !manualPaymentReqStatus &&
        <>
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
                title={"New Payment Request"}
                fontSize={"150%"}
              />
              {showForm && (
                <Box>
                  <Grid container className="newScreen" spacing={11}>

                    <Grid item xs={12} mt={1}>
                      <Grid style={{ paddingTop: '20px' }} item xs={12}>
                        <BootstrapLabel shrink required htmlFor="payer-name"
                          onClick={() => {
                            console.log("formfields:", this.state.formFields)
                          }}
                        >Name</BootstrapLabel>
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
                            <BootstrapInputOld
                              // style={{ width: "350px  " }}
                              fullWidth
                              variant="standard"
                              // variant="outlined"
                              {...params}
                              InputProps={{
                                ...params.InputProps,
                                disableUnderline: false
                              }}
                              rules={formFields.payerName.rules}
                              value={formFields.payerName.value}
                              errors={formFields.payerName.errors}
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
                      </Grid>

                      <Grid item xs={12} className="A-1">
                        <BootstrapLabel shrink htmlFor="payer-email">Email</BootstrapLabel>
                        <FormControl fullWidth>
                          <BootstrapInputOld
                            // variant="outlined"
                            variant="standard"
                            InputProps={{
                              disableUnderline: false
                            }}
                            id="payer-email"
                            rules={formFields.payerEmail.rules}
                            value={formFields.payerEmail.value}
                            errors={formFields.payerEmail.errors}
                            onChange={(e) => {
                              this.updateFormField("payerEmail", e.target.value);
                            }}
                          />
                        </FormControl>
                      </Grid>

                      <Grid container item column={12} spacing={11} className="A-1" >
                        <Grid item xs={4} >
                          <BootstrapLabel shrink htmlFor="payer-mobile">Mobile</BootstrapLabel>
                          <FormControl fullWidth>
                            <MUIPhoneInput
                              localVariant="standard"
                              localUnderline={false}
                              id="payer-mobile"
                              defaultCountry={formFields.mobileCountry.value}
                              rules={formFields.payerMobile.rules}
                              value={formFields.payerMobile.value}
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
                      </Grid>
                      <Grid container item column={12} spacing={11} className="A-1" >
                        <Grid item xs={4} >
                          <BootstrapLabel shrink htmlFor="payer-mobile">Payer WhatsApp Number</BootstrapLabel>
                          <FormControl fullWidth>
                            <MUIPhoneInput
                              localVariant="standard"
                              localUnderline={false}
                              id="payer-mobile"
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

                      <Grid item xs={12} className="A-1" >
                        <BootstrapLabel shrink required htmlFor="description">Description</BootstrapLabel>
                        <FormControl fullWidth>
                          <BootstrapInputOld
                            // variant="outlined"
                            variant="standard"
                            InputProps={{
                              disableUnderline: false
                            }}
                            id="description"
                            autoComplete="off"
                            rules={formFields.description.rules}
                            value={formFields.description.value}
                            errors={formFields.description.errors}
                            onChange={(e) => {
                              this.updateFormField("description", e.target.value);
                            }}
                          />
                        </FormControl>
                      </Grid>

                      <Grid container spacing={8} column={12} style={{marginTop: '20px'}}>
                        <Grid item xs={4} className="collRef">
                          <BootstrapLabel shrink htmlFor="collection-reference" >Collection Reference</BootstrapLabel>
                          <FormControl fullWidth style={{ paddingTop: '0' }}>
                            <BootstrapInputOld
                              // variant="outlined"
                              variant="standard"
                              InputProps={{
                                disableUnderline: false
                              }}
                              id="collection-reference"
                              autoComplete="off"
                              rules={formFields.collectionRef.rules}
                              value={formFields.collectionRef.value}
                              errors={formFields.collectionRef.errors}
                              onChange={(e) => {
                                this.updateFormField("collectionRef", e.target.value);
                              }}
                              sx={{ margin: 0, padding: 0, borderWidth: '0px' }}
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={3}>
                          <Grid container className="date-field">
                            <BootstrapLabel shrink htmlFor="due-date">Due Date</BootstrapLabel>

                            <FormControl fullWidth>
                              <MUIDatePicker
                                localVariant="standard"
                                localUnderline={false}
                                id="due-date"
                                format={"DD/MM/YYYY"}
                                placeholder="DD/MM/YYYY"
                                disablePast={true}
                                rules={formFields.dueDate.rules}
                                errors={formFields.dueDate.errors}
                                value={formFields.dueDate.value ? dayjs(formFields.dueDate.value) : null}
                                disableEdit={true}
                                onChange={(e) => this.handleDueDate(e, 'dueDate')}
                              />
                            </FormControl>

                          </Grid>
                        </Grid>

                        <Grid item xs={3} style={{display:merchantTransactionMode == manualPay.transactionModeDigital ? 'none' : '' }}>
                          <Grid container className="date-field">
                            <BootstrapLabel shrink htmlFor="due-date">Invoice Date</BootstrapLabel>

                            <FormControl fullWidth>
                              <MUIDatePicker
                                localVariant="standard"
                                localUnderline={false}
                                id="due-date"
                                format={"DD/MM/YYYY"}
                                placeholder="DD/MM/YYYY"
                                disablePast={true}
                                value={formFields.invoiceDate.value ? dayjs(formFields.invoiceDate.value) : null}
                                disableEdit={true}
                                onChange={(e) => this.handleDueDate(e, 'invoiceDate')}
                              />
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid container spacing={8} column={12} style={{marginTop: '20px', display:merchantTransactionMode == manualPay.transactionModeDigital ? 'none' : '' }}>
                        <Grid item xs={4} className="collRef">
                          <BootstrapLabel shrink required={merchantTransactionMode == manualPay.transactionModeBoth} htmlFor="amount-ccy">Invoice Type</BootstrapLabel>
                          <FormControl fullWidth>
                            <Autocomplete
                              size="small"
                              id="amount-ccy"
                              disableClearable={true}
                              options={invoiceTypeList || []}
                              getOptionLabel={(option) => option.description}
                              value={invoiceTypeList.find((v) => v.lookupCode === formFields.invoiceType.value) || null}
                              onChange={(e, v) => {this.updateFormField("invoiceType", v.lookupCode)}}
                              renderInput={(params) => (
                                <BootstrapInputOld
                                  variant="standard"
                                  {...params}
                                  InputProps={{
                                      ...params.InputProps,
                                  }}
                                  rules={formFields.invoiceType.rules}
                                  value={formFields.invoiceType.value}
                                  errors={formFields.invoiceType.errors}
                                />
                              )}
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={3} className="collRef">
                          <BootstrapLabel shrink required={merchantTransactionMode == manualPay.transactionModeBoth} htmlFor="amount-ccy">Purpose Code</BootstrapLabel>
                          <FormControl fullWidth style={{ paddingTop: '0' }}>
                            <BootstrapInputOld
                              // variant="outlined"
                              variant="standard"
                              InputProps={{
                                disableUnderline: false
                              }}
                              id="collection-reference"
                              autoComplete="off"
                              rules={formFields.purposeCode.rules}
                              value={formFields.purposeCode.value}
                              errors={formFields.purposeCode.errors}
                              onChange={(e) => {
                                this.updateFormField("purposeCode", e.target.value);
                              }}
                              sx={{ margin: 0, padding: 0, borderWidth: '0px' }}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>

                      {!isAutoReqTnxId &&
                        <Grid container item xs={12} spacing={11} className="A-1" >
                          <Grid item xs={12}>
                            <BootstrapLabel shrink htmlFor="transaction-id">Requestor Transaction Id</BootstrapLabel>
                            <FormControl fullWidth>
                              <BootstrapInputOld
                                variant="standard"
                                InputProps={{
                                  disableUnderline: false
                                }}
                                id="transaction-id"
                                autoComplete="off"
                                rules={formFields.transactionId.rules}
                                value={formFields.transactionId.value}
                                errors={formFields.transactionId.errors}
                                onChange={(e) => {
                                  this.updateFormField("transactionId", e.target.value, false);
                                }}
                                onBlur={(e) => {
                                  this.updateFormField("transactionId", e.target.value, true, true);
                                }} />
                            </FormControl>
                          </Grid>
                        </Grid>
                      }

                      <Grid item xs={12} className="A-1">

                        <Grid container spacing={11} style={{ paddingBottom: '0px' }}>
                          <Grid item xs={12} >
                            <BootstrapLabel shrink required htmlFor="initial-amount">Amount</BootstrapLabel>
                          </Grid>

                          <Grid item xs={12} spacing={2}>
                            <Grid container item xs={4} spacing={1} style={{ paddingTop: '0px' }}>
                              <Grid item xs={4} >
                                <FormControl fullWidth>
                                  <Autocomplete
                                    size="small"
                                    id="amount-ccy"
                                    disableClearable={true}
                                    options={this.state.currencyList ? this.state.currencyList.map((option) => option.code) : []}
                                    value={formFields.reqCurrency.value != null ? formFields.reqCurrency.value : ''}
                                    // style={{ width: "50% !important" }}
                                    onChange={(e, v) => {
                                      this.updateDecimalInRule(v);
                                      this.updateFormField("reqCurrency", v);
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        sx={{ marginRight: "-10px  " }}
                                        fullWidth
                                        variant="standard"
                                        // variant="outlined"
                                        {...params}
                                        InputProps={{
                                          ...params.InputProps,
                                          disableUnderline: false
                                        }}
                                        // rules={formFields.payerName.rules}
                                        value={formFields.reqCurrency.value}
                                        errors={formFields.reqCurrency.errors}
                                      />
                                    )}
                                  />
                                </FormControl>
                              </Grid>

                              <Grid item xs={8}>
                                <BootstrapInputOld
                                  // variant="outlined"
                                  variant="standard"
                                  InputProps={{
                                    disableUnderline: false
                                  }}
                                  id="initial-amount"
                                  autoComplete="off"
                                  value={formFields.initialAmount.value}
                                  rules={formFields.initialAmount.rules}
                                  errors={formFields.initialAmount.errors}
                                  onBlur={(e) => {
                                    e.persist();

                                    let amount = this.autoFixDecimal("initialAmount", e.target.value)

                                    this.updateFormField("initialAmount", amount);

                                    // find the requested amount
                                    this.generateRequestedAmout();
                                  }}
                                  onChange={this.handleInitialAmount} />
                              </Grid>


                            </Grid>
                          </Grid>

                        </Grid>
                      </Grid>

                      {!isChargesDisabled &&
                        <Grid item xs={12} className="A-1">
                          <BootstrapLabel shrink htmlFor="charge-amount">Charges</BootstrapLabel>
                          <FormControl fullWidth>
                            <BootstrapInputOld
                              variant="standard"
                              // variant="outlined"
                              id="charge-amount"
                              autoComplete="off"
                              value={formFields.chargeAmount.value}
                              errors={formFields.chargeAmount.errors}
                              InputProps={{
                                startAdornment: <InputAdornment position="start">{formFields.reqCurrency.value}</InputAdornment>,
                                disableUnderline: false
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
                      }

                      {!isChargesDisabled &&
                        <Grid item xs={12} className="A-1">
                          <BootstrapLabel shrink htmlFor="amount-ccy">Total Amount</BootstrapLabel>

                          <FormControl fullWidth>
                            <BootstrapInputOld fullWidth
                              variant="standard"
                              // variant="outlined"
                              id="requested-amount"
                              autoComplete="off"
                              rules={formFields.reqAmount.rules}
                              value={formFields.reqAmount.value}
                              errors={formFields.reqAmount.errors}
                              InputProps={{
                                startAdornment: <InputAdornment position="start">{formFields.reqCurrency.value}</InputAdornment>,
                                disableUnderline: false
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
                      }

                      {!isChargesDisabled &&
                        <Grid item xs={12} className="A-1">
                          <BootstrapLabel shrink required={formFields.chargeReason.rules.length > 0} htmlFor="charge-reason">
                            Reason for charges
                          </BootstrapLabel>
                          <FormControl fullWidth>
                            <BootstrapInputOld multiline
                              variant="standard"
                              InputProps={{
                                disableUnderline: false
                              }}
                              // variant="outlined"
                              rows={3}
                              id="charge-reason"
                              autoComplete="off"
                              value={formFields.chargeReason.value}
                              errors={formFields.chargeReason.errors}
                              onChange={(e) => {
                                this.updateFormField("chargeReason", e.target.value);
                              }}
                            />
                          </FormControl>
                        </Grid>
                      }
                    </Grid>

              <Grid item xs={4} display="flex" justifyContent='center' alignItems='start'>
                {allowPartialPaymentValue === true ?

                        <FormGroup style={{ marginTop: "1rem" }}>
                          <AppCheckBox
                            label="Allow Partial Payments"
                            onClick={(e) => this.updateFormField("allowPartialPayments", e.target.checked)}
                            checked={formFields.allowPartialPayments.value}
                            style={{ color: 'var(--secondary-color)' }}
                          />
                        </FormGroup>
                        : ""}
                    </Grid>
                  </Grid>

                  <Grid container spacing={11} style={{ paddingTop: '30px', display:merchantTransactionMode == manualPay.transactionModeDigital ? 'none' : '' }}>
                    <Grid item xs={12}>
                        {this.state.selectedFile && this.state.selectedFile.type != "application/pdf" &&
                          <FancyFileInput onDropFile ={this.handleManualPayInvoiceFile} icon={''}>
                            <img src={URL.createObjectURL(selectedFile)} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', marginBottom: '1rem', height: '20rem', width: '20rem ' }} />
                          </FancyFileInput>
                        }
                        {this.state.selectedFile && this.state.selectedFile.type == "application/pdf" && (
                            <FancyFileInput onDropFile ={this.handleManualPayInvoiceFile} icon={faFileAlt}>
                              <p style={{ fontSize: "var(--font-small)", marginBottom: '4px', color: 'var(--prime-color)' }}>
                                {this.state.selectedFile.name}
                              </p>
                            </FancyFileInput>
                        )}
                        {!this.state.selectedFile && (
                            <>
                              <FancyFileInput onDropFile={this.handleManualPayInvoiceFile} icon={faCloudArrowUp}>
                                <p style={{ fontSize: "var(--font-small)", marginBottom: '4px', color: 'var(--prime-color)' }}>
                                  Click or Drag & Drop your invoice here
                                </p>
                                <p style={{ fontSize: "var(--font-small)", color: 'var(--prime-color)' }}>
                                  *Upload invoice, File should be in pdf, png, jpg, gif and bmp formats.
                                </p>
                              </FancyFileInput>
                              <>
                                {
                                  (!_.isEmpty(formFields.manualPayInvoiceFile.errors)) && <ul className={'error-msg'} style={{ listStyle: "none", padding: 0 }}>
                                  {formFields.manualPayInvoiceFile.errors.map((e, index) => <li className="error text-danger" key={index}>* {e}</li>)}
                                  </ul>
                                }
                              </>
                            </>
                        )}
                    </Grid>
                  </Grid>
                  
                  <Grid container spacing={11} mt={2} style={{ paddingTop: '50px' }}>
                    <Grid item xs={12}>
                      <ButtonPrimary
                        id="singlePaymentReviewSubmitBtn"
                        onClick={this.handlePaymentReview
                          // let formValid = await this.validateForm(true);

                          // if (formValid) {
                          //   isPaymentReviewScreen ? this.submitForm() : this.handlePaymentReview;
                          //   this.setState({ showExpiry: false });
                          // } else {
                          //   toast.error("Please fill the mandatory fields!")
                          // }
                        }
                      >
                        Submit
                      </ButtonPrimary>

                      <ButtonSecondary
                        id="singlePaymentFormClearBtn"
                        style={{ marginLeft: "5px" }}
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
            </Box>
          </div>
        </>
      }

      {manualPaymentReqStatus && <ManualPayPaymentReqStatus
          transaction={transaction}
          formFields={formFields}
          mailSent={mailSent}
          paymentLink={paymentLink}
          message={txnResponse}
          invoiceTypeList={invoiceTypeList}
          bankAccountTypes={bankAccountTypes}
          onMakeAnother={(e) => { this.resetForm(); }}
          loginMerchantName = {this.state.loginMerchantName}
          merchantTransactionMode={merchantTransactionMode}
        />
      }
    </div>
  );
}
