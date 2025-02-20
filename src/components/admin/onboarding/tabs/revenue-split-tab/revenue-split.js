import React, { Component } from 'react';
import { html } from "./revenue-split.html";
import { DashboardService } from '../../../../../service/api/dashboard.service';
import FormValidationService from '../../../../../service/core/validate.service';
import moment from 'moment';
import Utils from '../../../../../service/core/utils';
import { toast } from 'react-toastify';
import { Auth } from 'aws-amplify';
import { StorageService } from 'service/core/storage.service';
import { StorageKeys } from 'service/core/storage.service';

//Constants
import { OnboardConstants, messages } from '../../../../../config/constants';
import { BenepayUserService } from 'service/api/benepay-user.service';
import ActionMenu from './support-components/actionMenu.js';
import { forEach } from 'lodash';


class RevenueSplit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            merchantId: props.merchantId,
            selectedMerchant: {},
            loading: false,
            paymentMethodsList: [],
            selectedPaymentMethod: null,
            paymentProviderList: [],
            selectedPaymentProvider: null,
            splitTypeList: this.prepareSplitTypeList(),
            selectedSplitType: { name: "Fixed", value: "F" },
            paymentCurrencyList: [],
            selectedPaymentCurrency: null,
            splitName: "",
            test: "",
            rerender: 1,
            chargesList: this.preapareChargesList(),
            merchantSplitList: this.preapareMerchantSplitList(null),
            screenType: "list",
            currentSplit: null,
            entityList: [],
            columns: this.prapareColumsList(),
            splitList: [],
            referalParternerMerchant: null,
            referalPartnerSettlementList: null,
            parentMerchant: null,
            parentSettlementList: null,
            childMerchantListWithSettlement: null,
            referChildMerchantListWithSettlement: null,
            parentProvideId: "",
            tierDetailsList: [{ ccy: null, minAmt: parseFloat("0").toFixed(2), maxAmt: parseFloat("0").toFixed(2), err: "Max Amount should be greater than min amount" }],
        }
    }

    /**
     * preparing table columns details
     */
    prapareColumsList = () => {
        let arr = [
            {
                field: "splitName",
                headerName: "Split Name",
                headerClassName: "tableHeaderStyle",
                cellClassName: "table-cell-classname",
                flex: 1,
                minWidth: 140,
            },
            {
                field: "paymentMethod",
                headerName: "Payment Method",
                headerClassName: "tableHeaderStyle",
                cellClassName: "table-cell-classname",
                flex: 1,
                minWidth: 140,
            },
            {
                field: "fkpaymentProviderId",
                headerName: "Payment Provider",
                minWidth: 140,
                headerClassName: "tableHeaderStyle",
                cellClassName: "table-cell-classname",
                flex: 1,
            },
            {
                field: "splitType",
                headerName: "Split Type",
                headerAlign: "left",
                headerClassName: "tableHeaderStyle",
                cellClassName: "table-cell-classname",
                flex: 1,
                minWidth: 140,
            },
            {
                field: "activeStatus",
                headerName: "Status",
                headerAlign: "left",
                headerClassName: "tableHeaderStyle",
                cellClassName: "table-cell-classname",
                flex: 1,
                minWidth: 140,
                valueGetter: (params) =>
                    params.value == 1 ? "Active" : "InActive"
            },
            {
                headerName: "Action",
                width: 140,
                align: "left",
                headerAlign: "left",
                headerClassName: "tableHeaderStyle",
                cellClassName: "table-cell-classname-actions",
                flex: 1,
                minWidth: 140,
                maxWidth: 140,
                disableColumnMenu: true,
                sortable: false,
                border: 0,
                renderCell: (params) => {
                    return (
                        <ActionMenu
                            params={params}
                            editSplit={this.getSplitInfo}
                            deleteSplit={this.deleteMerchantSplitAPI}
                        />
                    );
                },
            },
        ]
        return arr;
    }

    /**
     * add the tier from ui not api
     */
    addNewTier = () => {
        let prevIdx = this.state.tierDetailsList.length - 1;
        let prevTier = this.state.tierDetailsList[prevIdx];
        if (prevTier.err && prevTier.err.length > 0) {
            toast.error(`For Tier-${prevIdx + 1}, ${prevTier.err}`);
        } else {
            let newArr = this.state.tierDetailsList;
            newArr.push({ ccy: prevTier.ccy, minAmt: prevTier.maxAmt, maxAmt: parseFloat("0").toFixed(this.state.selectedPaymentCurrency && this.state.selectedPaymentCurrency.decimal ? this.state.selectedPaymentCurrency.decimal : 2), err: "Max Amount should be greater than min amount" });
            this.setState({ tierDetailsList: newArr });
        }
    }

    /**
     * delete the tier from ui not api
     */
    deleteTier = (index) => {
        if (index == 0) {
            return;
        }
        let chargesListArra = [];
        this.state.chargesList.forEach(element => {
            element.tierList.splice(index, 1);
            chargesListArra.push(element)
        });
        let merchantSplitArr = [];
        this.state.merchantSplitList.forEach(element => {
            element.tierList.splice(index, 1);
            merchantSplitArr.push(element)
        });
        this.setState({ chargesList: chargesListArra, merchantSplitList: merchantSplitArr })

        if (this.state.tierDetailsList.length - 1 > index) {
            let prevTier = this.state.tierDetailsList[index - 1];
            let nextTier = this.state.tierDetailsList[index + 1];
            nextTier.minAmt = prevTier.maxAmt;
        }
        this.state.tierDetailsList.splice(index, 1);
        this.setState({ rerender: this.state.rerender + 1 })
    }

    /**
     * add the merchant split from ui not api
     */
    addNewMerchantSplit = () => {
        let arr = this.state.merchantSplitList;
        let fl = parseFloat('0');
        let tierArr = new Array(this.state.tierDetailsList.length);
        this.state.tierDetailsList.map((d, i) => { tierArr[i] = "0.00" })
        arr.forEach(element => {
            fl += parseFloat(element.splitValue);
            element.tierList.forEach((data, index) => {
                tierArr[index] = parseFloat(data) + parseFloat(tierArr[index]);
            });
        });
        let num = parseFloat('100') - parseFloat(fl);
        let finalArr = []
        tierArr.forEach((data, i) => {
            let sub = parseFloat('100') - parseFloat(data);
            finalArr.push(parseFloat("0") < parseFloat(sub) ? parseFloat(sub).toFixed(2) : "0.00");
        });
        arr.push({
            settlementAc: null,
            providerName: null,
            type: "M",
            splitValue: parseFloat("0") < parseFloat(num) ? parseFloat(num).toFixed(2) : "0.00",
            tierList: finalArr,
            err: null,
            entity: null
        });

        this.setState({ merchantSplitList: arr });
    }

    /**
     * delete the merchant split from ui not api
     */
    deleteMerchantSplit = (index) => {
        if (index == 0) {
            return;
        }
        let arr = this.state.merchantSplitList;
        arr.splice(index, 1);

        this.setState({ merchantSplitList: arr });
    }

    /**
     * preaparing split type list
     */
    prepareSplitTypeList = () => {
        return [
            { name: "Tiered Percentage", value: "T" },
            { name: "Fixed", value: "F" },
            { name: "Percentage", value: "P" }
        ]
    }

    /**
     * preaparing charges list
     */
    preapareChargesList = () => {
        let benepayCharges = {
            name: "Benepay",
            type: "B",
            entity: null,
            settlementAc: null,
            providerName: null,
            splitValue: '0.00',
            tierList: null,
        }
        let referralCharges = {
            name: "Referral Partner",
            type: "R",
            entity: null,
            settlementAc: null,
            providerName: null,
            splitValue: '0.00',
            tierList: null
        }
        let providerCharges = {
            name: "Payment Provider",
            type: "PG",
            entity: null,
            settlementAc: null,
            providerName: null,
            splitValue: '0.00',
            tierList: null
        }
        return [benepayCharges, referralCharges, providerCharges];
    }

    /**
     * preaparing merchant split list
     */
    preapareMerchantSplitList = (val) => {
        let merchantSplit = {
            settlementAc: null,
            type: "M",
            providerName: val ? val : null,
            splitValue: '100.00',
            tierList: ["0.00"],
            err: null,
            entity: null
        }
        return [merchantSplit];
    }


    /**
     * Fetch payment provider list
     * @param paymentMethod
     */
    getPaymentProviderList = async (paymentMethod) => {
        this.setState({ loading: true });
        const result = await BenepayUserService.getPaymentProviderList(paymentMethod);
        this.setState({ loading: false });
        if (result) {
            this.setState({ paymentProviderList: result.dataList });
        }
    }

    /**
     * Fetch payment methods list
     * @param paymentProvider
     */
    getPaymentMethodList = async (paymentProvider) => {
        this.setState({ loading: true });
        const result = await BenepayUserService.getPaymentMethodList(paymentProvider);
        this.setState({ loading: false });
        if (result) {
            this.setState({ paymentMethodsList: result.dataList });
        }
    }

    /**
     * Fetch payment ccy list
     * @param merchantId
     */
    getPaymentCcy = async (merchantId) => {
        this.setState({ loading: true });
        const result = await BenepayUserService.getPaymentCcy(merchantId);
        this.setState({ loading: false });
        if (result) {
            this.setState({ paymentCurrencyList: result });
        }
    }

    /**
     * Fetch present split list
     * * @param merchantId
     */
    getMerchantSplitList = async (merchantId) => {
        this.setState({ loading: true });
        const result = await BenepayUserService.getMerchantSplitList(merchantId);
        this.setState({ loading: false });
        if (result) {
            this.setState({ splitList: result });
        }
    }

    /**
     * Delete the record with given split id
     * * @param splitId
     */
    deleteMerchantSplitAPI = async (splitId) => {
        this.setState({ loading: true });
        const result = await BenepayUserService.deleteMerchantSplit(splitId);
        this.setState({ loading: false });
        if (result && result.status === "Success") {
            toast.success(`${result.splitName} is deleted successfully.`);
            this.getMerchantSplitList(this.state.merchantId);
        } else if (result && result.MerchantSplitError) {
            toast.error(`${result.MerchantSplitError.errorMsg}`)
        }
    }

    /**
     * get the record with given split id
     * * @param splitId
     */
    getSplitInfo = async (splitId) => {
        this.setState({ loading: true });
        const result = await BenepayUserService.getSplitInfo(splitId);
        this.setState({ loading: false });
        if (result && result.merchantSplitId == splitId) {
            this.setDataToModals(result);
        }
    }

    /**
     * get the info of referal parter and their settlement
     * * @param merchantId
     */
    referalPartnerDetails = async (merchantId) => {
        this.setState({ loading: true });
        const result = await BenepayUserService.referalPartnerDetails(merchantId);
        this.setState({ loading: false });
        if (result && result.merchant) {
            this.setState({
                referalParternerMerchant: result.merchant,
            })
        }
        if (result && result.settlementDetails) {
            this.setState({
                referalPartnerSettlementList: result.settlementDetails
            })
        }
    }


    /**
     * get the info of child merchant and their settlement
     * * @param merchantId
     */
    childMerchantInfo = async (merchantId) => {
        this.setState({ loading: true });
        const result = await BenepayUserService.childMerchantInfo(merchantId);
        this.setState({ loading: false });
        if (result) {
            this.setState({
                merchantSplitList: this.preapareMerchantSplitList(result.parent && result.parent.merchant ? result.parent.merchant.pgMerchantId : null),
                parentMerchant: result.parent ? result.parent.merchant : null,
                parentSettlementList: result.parent ? result.parent.settlementDetails : null,
                childMerchantListWithSettlement: result.child ? result.child : null,
                referChildMerchantListWithSettlement: result.child ? result.child : null,
            })
        }
    }

    /**
     * get the record with given split id
     * * @param splitDetails
     */
    setDataToModals = (splitDetails) => {
        this.setState({
            splitName: splitDetails.splitName,
            selectedPaymentCurrency: { code: splitDetails.paymentCcy, decimal: 2 },
            selectedPaymentMethod: splitDetails.paymentMethod,
            selectedPaymentProvider: splitDetails.paymentProvider,
            selectedSplitType: splitDetails.splitType,
        })
        let charge1List = [];
        let merchantList = [];
        if (splitDetails.splitType.value == "T") {
            let tierValues = [];
            splitDetails.merchantSplitTierSetup.map(e => { tierValues.push({ merchantSplitTierId: e.merchantSplitTierId, ccy: { code: splitDetails.paymentCcy, decimal: 2 }, minAmt: parseFloat(e.tierMinAmt).toFixed(splitDetails.paymentCcy.decimal && splitDetails.splitType.value != "P" ? splitDetails.paymentCcy.decimal : 2), maxAmt: parseFloat(e.tierMaxAmt).toFixed(splitDetails.paymentCcy.decimal && splitDetails.splitType.value != "P" ? splitDetails.paymentCcy.decimal : 2) }) });
            this.setState({ tierDetailsList: tierValues });

            let bCharges = splitDetails.merchantSplitDetails.filter(data => data.entityType.value == "B");
            let rCharges = splitDetails.merchantSplitDetails.filter(data => data.entityType.value == "R");
            let pgCharges = splitDetails.merchantSplitDetails.filter(data => data.entityType.value == "PG");
            let mCharges = splitDetails.merchantSplitDetails.filter(data => data.entityType.value == "M");

            bCharges.sort((a, b) => a.splitTierId - b.splitTierId);
            rCharges.sort((a, b) => a.splitTierId - b.splitTierId);
            pgCharges.sort((a, b) => a.splitTierId - b.splitTierId);
            mCharges.sort((a, b) => ('' + a.merchant.merchantId).localeCompare(b.merchant.merchantId));

            let bTierList = [];
            let bIdList = [];
            bCharges.forEach(element => {
                bTierList.push(parseFloat(element.splitValue).toFixed(splitDetails.paymentCcy.decimal && splitDetails.splitType.value != "P" ? splitDetails.paymentCcy.decimal : 2));
                bIdList.push(element.merchantSplitDetailsId);
            });

            let rTierList = [];
            let rIdList = [];
            rCharges.forEach(element => {
                rTierList.push(parseFloat(element.splitValue).toFixed(splitDetails.paymentCcy.decimal && splitDetails.splitType.value != "P" ? splitDetails.paymentCcy.decimal : 2));
                rIdList.push(element.merchantSplitDetailsId);
            });

            let pgTierList = [];
            let pgIdList = [];
            pgCharges.forEach(element => {
                pgTierList.push(parseFloat(element.splitValue).toFixed(splitDetails.paymentCcy.decimal && splitDetails.splitType.value != "P" ? splitDetails.paymentCcy.decimal : 2));
                pgIdList.push(element.merchantSplitDetailsId);
            });

            charge1List.push({
                settlementAc: bCharges[0].settlementDetails,
                name: bCharges[0].entityType.name,
                type: bCharges[0].entityType.value,
                entity: bCharges[0].merchant,
                settlementList: [bCharges[0].settlementDetails],
                providerName: bCharges[0].merchant.pgMerchantId,
                splitValue: '0.00',
                tierList: bTierList,
                merchantSplitDetailsIdList: bIdList
            });

            charge1List.push({
                settlementAc: rCharges[0].settlementDetails,
                name: rCharges[0].entityType.name,
                type: rCharges[0].entityType.value,
                entity: rCharges[0].merchant,
                settlementList: [rCharges[0].settlementDetails],
                providerName: rCharges[0].merchant.pgMerchantId,
                splitValue: '0.00',
                tierList: rTierList,
                merchantSplitDetailsIdList: rIdList
            });

            charge1List.push({
                settlementAc: pgCharges[0].settlementDetails,
                name: pgCharges[0].entityType.name,
                type: pgCharges[0].entityType.value,
                entity: pgCharges[0].entityType.value == "PG" ? { name: pgCharges[0].providerDetails.paymentProviderName, value: pgCharges[0].providerDetails.paymentProviderId } : pgCharges[0].merchant,
                settlementList: [pgCharges[0].settlementDetails],
                providerName: pgCharges[0].entityType.value == "PG" ? pgCharges[0].providerDetails.paymentProviderName : pgCharges[0].merchant.pgMerchantId,
                splitValue: '0.00',
                tierList: pgTierList,
                merchantSplitDetailsIdList: pgIdList
            });

            let num = tierValues.length;
            let mTierList = [];
            let mIdList = [];
            let dummy = [];
            let dummy2 = [];
            mCharges.forEach((element, index) => {
                dummy.push(parseFloat(element.splitValue).toFixed(splitDetails.paymentCcy.decimal && splitDetails.splitType.value != "P" ? splitDetails.paymentCcy.decimal : 2));
                dummy2.push(element.merchantSplitDetailsId);
                if ((index + 1) % num == 0) {
                    mTierList.push(dummy);
                    mIdList.push(dummy2);
                    dummy2 = [];
                    dummy = [];
                }
            });
            mTierList.forEach((element, index) => {
                // element.sort((a, b) => a.splitTierId - b.splitTierId);
                merchantList.push({
                    settlementAc: mCharges[index * num].settlementDetails,
                    name: mCharges[index * num].entityType.name,
                    type: mCharges[index * num].entityType.value,
                    entity: mCharges[index * num].merchant,
                    settlementList: [mCharges[index * num].settlementDetails],
                    providerName: mCharges[index * num].merchant.pgMerchantId,
                    splitValue: '0.00',
                    tierList: element,
                    merchantSplitDetailsIdList: mIdList[index]
                })

            });

        } else {
            splitDetails.merchantSplitDetails.forEach(element => {
                if (element.entityType.value == "M") {
                    merchantList.push({
                        name: element.entityType.name,
                        type: element.entityType.value,
                        entity: element.merchant,
                        settlementAc: element.settlementDetails,
                        settlementList: [element.settlementDetails],
                        providerName: element.merchant.pgMerchantId,
                        splitValue: parseFloat(element.splitValue).toFixed(splitDetails.paymentCcy.decimal && splitDetails.splitType.value != "P" ? splitDetails.paymentCcy.decimal : 2),
                        tierList: ['0.00'],
                        merchantSplitDetailsId: element.merchantSplitDetailsId
                    })
                } else {
                    let obj = {
                        settlementAc: element.settlementDetails,
                        name: element.entityType.name,
                        type: element.entityType.value,
                        entity: element.entityType.value == "PG" ? { name: element.providerDetails.paymentProviderName, value: element.providerDetails.paymentProviderId } : element.merchant,
                        settlementList: [element.settlementDetails],
                        providerName: element.entityType.value == "PG" ? element.providerDetails.paymentProviderName : element.merchant.pgMerchantId,
                        splitValue: parseFloat(element.splitValue).toFixed(splitDetails.paymentCcy.decimal && splitDetails.splitType.value != "P" ? splitDetails.paymentCcy.decimal : 2),
                        tierList: ['0.00'],
                        merchantSplitDetailsId: element.merchantSplitDetailsId
                    };
                    charge1List.push(obj);
                }
            });
        }
        this.setState({
            chargesList: charge1List,
            merchantSplitList: merchantList,
            currentSplit: splitDetails,
            screenType: 'add'
        })
    }

    /**
     * this function is validating form details
     */
    validateTheFields = () => {
        let errorList = [];
        let allMandatoryMsg = "All the fields with * are mandatory.";
        if (!this.state.selectedPaymentMethod || !this.state.selectedPaymentCurrency || !this.state.selectedPaymentProvider || !this.state.selectedSplitType) {
            errorList.push(allMandatoryMsg);
        }

        this.state.tierDetailsList.forEach(element => {
            if (this.state.selectedSplitType.value == "T" && (!element.minAmt || !element.maxAmt)) {
                if (!errorList.includes(allMandatoryMsg)) {
                    errorList.push(allMandatoryMsg);
                }
            }
            if (this.state.selectedSplitType.value == "T" && parseFloat(element.minAmt) >= parseFloat(element.maxAmt)) {
                errorList.push("Max Amount in tier details should be less than the min amount.")
            }
        });

        let totalTierListArr = new Array(this.state.tierDetailsList.length);
        totalTierListArr.map((e, i) => totalTierListArr[i] = "0.00");

        this.state.chargesList.forEach(element => {
            if (!element.entity || !element.settlementAc) {
                if (!errorList.includes(allMandatoryMsg)) {
                    errorList.push(allMandatoryMsg);
                }
            }

            if (this.state.selectedSplitType.value == "P" && parseFloat(element.splitValue) > parseFloat(100)) {
                errorList.push(`For ${element.name}, % tax amount cannot exceed 100.`)
            }

            if (this.state.selectedSplitType.value == "T" && element.tierList) {
                element.tierList.forEach((tier, i) => {
                    totalTierListArr[i] = parseFloat(totalTierListArr[i]) + parseFloat(tier);
                });
            }
        });

        totalTierListArr.forEach(element => {
            if (parseFloat(element) > parseFloat(100) && this.state.selectedSplitType.value == "T") {
                errorList.push("Addition of same tier split values for charges should not exceed 100.");
            }
        });


        let totalTierListArr2 = [];
        let totalSplitValue = "0.00";
        this.state.tierDetailsList.map((e, i) => totalTierListArr2.push(0));

        this.state.merchantSplitList.forEach(element => {
            if (!element.settlementAc) {
                if (!errorList.includes(allMandatoryMsg)) {
                    errorList.push(allMandatoryMsg);
                }
            }
            if (this.state.selectedSplitType.value == "P" || this.state.selectedSplitType.value == "F") {
                totalSplitValue = parseFloat(totalSplitValue) + parseFloat(element.splitValue);
            }
            if (this.state.selectedSplitType.value == "T" && element.tierList) {
                element.tierList.forEach((tier, i) => {
                    totalTierListArr2[i] = parseFloat(totalTierListArr2[i]) + parseFloat(tier);
                });
            }
        });

        if ((this.state.selectedSplitType.value == "P" || this.state.selectedSplitType.value == "F") && parseFloat(totalSplitValue) > parseFloat(100)) {
            errorList.push(`Addition of % splits for merchant split should not exceed 100.`);
        }

        totalTierListArr2.forEach(element => {
            if (parseFloat(element) != parseFloat(100) && this.state.selectedSplitType.value == "T") {
                if (!errorList.includes("Addition of same tier split values for merchant split should be 100.")) {
                    errorList.push("Addition of same tier split values for merchant split should be 100.");
                }
            }
        });

        return errorList;
    }

    /**
     * this function is preparing payload form ui data
     */
    prepareSubmitObj = () => {

        let merchantSplitTierSetup = [];
        this.state.tierDetailsList.map((e, index) => { merchantSplitTierSetup.push({ merchantSplitTierId: this.state.currentSplit && this.state.currentSplit.merchantSplitTierSetup && this.state.currentSplit.merchantSplitTierSetup[index] ? this.state.currentSplit.merchantSplitTierSetup[index].merchantSplitTierId : e.merchantSplitTierId, tierMinAmt: e.minAmt, tierMaxAmt: e.maxAmt }) });

        let merchantSplitDetails = [];
        if (this.state.selectedSplitType.value != "T") {
            this.state.chargesList.forEach((element, index) => {
                merchantSplitDetails.push({
                    entityType: element.type,
                    settlementId: element.settlementAc.settlementId,
                    splitValue: element.splitValue,
                    merchantId: element.type == "PG" ? element.entity.value : element.entity.merchantId,
                    tierSeqId: 1,
                    merchantSplitDetailsId: element.merchantSplitDetailsId
                })
            });

            this.state.merchantSplitList.forEach((element, index) => {
                merchantSplitDetails.push({
                    entityType: element.type,
                    settlementId: element.settlementAc.settlementId,
                    splitValue: element.splitValue,
                    merchantId: element.entity.merchantId,
                    tierSeqId: index + 1,
                    merchantSplitDetailsId: element.merchantSplitDetailsId
                })
            });
        } else {
            this.state.chargesList.forEach((element, index) => {
                element.tierList.forEach((data, i) => {
                    merchantSplitDetails.push({
                        entityType: element.type,
                        settlementId: element.settlementAc.settlementId,
                        splitValue: data,
                        merchantId: element.type == "PG" ? element.entity.value : element.entity.merchantId,
                        tierSeqId: i + 1,
                        merchantSplitDetailsId: this.state.currentSplit && element.merchantSplitDetailsIdList && element.merchantSplitDetailsIdList[i] ? element.merchantSplitDetailsIdList[i] : null
                    })
                });
            });
            this.state.merchantSplitList.forEach((element, index) => {
                element.tierList.forEach((data, i) => {
                    merchantSplitDetails.push({
                        entityType: element.type,
                        settlementId: element.settlementAc.settlementId,
                        splitValue: data,
                        merchantId: element.entity.merchantId,
                        tierSeqId: i + 1,
                        merchantSplitDetailsId: this.state.currentSplit && element.merchantSplitDetailsIdList && element.merchantSplitDetailsIdList[i] ? element.merchantSplitDetailsIdList[i] : null
                    })
                });
            });
        }

        let obj = {
            splitName: this.state.splitName,
            paymentMethod: this.state.selectedPaymentMethod.value,
            paymentProvider: this.state.selectedPaymentProvider.value,
            splitType: this.state.selectedSplitType.value,
            paymentCcy: this.state.selectedPaymentCurrency.code,
            merchantId: this.state.selectedMerchant.merchantId,
            merchantSplitTierSetup: this.state.selectedSplitType.value == "T" ? merchantSplitTierSetup : null,
            merchantSplitDetails: merchantSplitDetails,
            merchantSplitId: this.state.currentSplit ? this.state.currentSplit.merchantSplitId : null
        }

        if (this.state.currentSplit) {
            let deletedTierSetupList = [];
            let prevCount =  this.state.currentSplit.merchantSplitTierSetup.length;
            let presentCount = merchantSplitTierSetup.length;

            if(presentCount < prevCount){
                let array = this.state.currentSplit.merchantSplitTierSetup.splice(presentCount);

                array.forEach(element => {
                    deletedTierSetupList.push(element.merchantSplitTierId);
                });
            }

            // this.state.currentSplit.merchantSplitTierSetup && this.state.currentSplit.merchantSplitTierSetup.forEach(prev => {
            //     let found = false;
            //     merchantSplitTierSetup.forEach(present => {
            //         if (prev.merchantSplitTierId == present.merchantSplitTierId) {
            //             found = true;
            //         }
            //     });
            //     if (!found) {
            //         deletedTierSetupList.push(prev.merchantSplitTierId);
            //     }
            // });

            let deletedTierDetailsList = [];
            this.state.currentSplit.merchantSplitDetails && this.state.currentSplit.merchantSplitDetails.forEach(prev => {
                let found = false;
                merchantSplitDetails.forEach(present => {
                    if (prev.merchantSplitDetailsId == present.merchantSplitDetailsId) {
                        found = true;
                    }
                });
                if (!found) {
                    deletedTierDetailsList.push(prev.merchantSplitDetailsId);
                }
            });

            obj["deletedTierSetupList"] = deletedTierSetupList;
            obj["deletedTierDetailsList"] = deletedTierDetailsList;

        }

        return obj;
    }

    /**
     * creating a new merchant split
     */
    createMerchantSplit = async () => {
        let errorList = this.validateTheFields();

        if (errorList.length != 0) {
            errorList.forEach(element => {
                toast.error(element);
            });
            return;
        }

        let request = this.prepareSubmitObj();
        this.setState({ loading: true });
        let response = await BenepayUserService.createMerchantSplit(request);
        this.setState({ loading: false });
        if (response && response.status != "Failure") {
            toast.success(`New Split ${response.splitName} Created Successfully!`);
            this.setFormToDefault();
            this.getMerchantSplitList(this.state.merchantId);
            this.setState({ screenType: "list" })
        } else {
            response.merchantSplitError.forEach(element => {
                toast.error(`${element.errorMsg}`)
            });
        }
    }

    /**
     * updating the merchant split
     */
    updateMerchantSplit = async () => {
        let errorList = this.validateTheFields();

        if (errorList.length != 0) {
            errorList.forEach(element => {
                toast.error(element);
            });
            return;
        }

        let request = this.prepareSubmitObj();

        this.setState({ loading: true });
        let response = await BenepayUserService.updateMerchantSplit(request);
        this.setState({ loading: false });
        if (response && response.status != "Failure") {
            toast.success(`New Split ${response.splitName} updated Successfully!`);
            this.setFormToDefault();
            this.getMerchantSplitList(this.state.merchantId);
            this.setState({ screenType: "list" })
        } else {
            response.merchantSplitError.forEach(element => {
                // console.log("Split error", element);
                toast.error(`${element.errorMsg}`)
            });
        }
    }

    componentDidMount = async () => {
        await Auth.currentSession().then(res => {
            let jwt = res["idToken"]["jwtToken"];
            StorageService.set(StorageKeys.clientJwt, jwt);
        });

        if (this.state.merchantId) {
            this.getMerchantSplitList(this.state.merchantId);
            this.getPaymentCcy(this.state.merchantId);
            this.referalPartnerDetails(this.state.merchantId);
            this.childMerchantInfo(this.state.merchantId);
        }

        this.getPaymentMethodList("ALL");
        this.getPaymentProviderList("ALL");
        this.getAllMerchant();
    }

    /**
     * getting all merchants
     */
    getAllMerchant = async () => {
        try {
            // Setting API call flag
            this.setState({ loading: true })

            const result = await BenepayUserService.getMerchants();
            this.setState({ loading: false });
            if (result.data && result.data.merchantSummary) {
                // Updating the entityList state with merchant summary data
                this.setState({ entityList: result.data.merchantSummary })

                result.data.merchantSummary.forEach(element => {
                    if (element.merchantId == this.state.merchantId) {
                        this.setState({ selectedMerchant: element });
                    }
                });
                // this.GetMerchantSummaryIds();
            }

            if (result.data.status !== '200') {
                // Displaying an error toast message if the API response has an error
                toast.error(result.data.message);
                return;
            }

        } catch (error) {
            console.error(error);
        }
    };

    /**
     * setting form data to default
     */
    setFormToDefault = () => {

        this.setState({
            chargesList: this.preapareChargesList(),
            merchantSplitList: this.preapareMerchantSplitList(null),
            currentSplit: null,
            splitName: '',
            selectedPaymentCurrency: null,
            selectedSplitType: { name: "Fixed", value: "F" },
            selectedPaymentMethod: null,
            selectedPaymentProvider: null,
            tierDetailsList: [{ ccy: null, minAmt: "0.00", maxAmt: null, err: "Max Amount should be greater than min amount" }]
        })

    }

    render = () => html.apply(this);
}

export default (RevenueSplit);
