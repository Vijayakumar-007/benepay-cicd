import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faClipboard, faRotateLeft, faCircleXmark, faBell, faMoneyBill1Wave, faUpload } from '@fortawesome/free-solid-svg-icons';
import { TempStorage, USER_TYPE } from "../../../service/core/storage.service";
import { OnboardConstants, PrivilegeConstants, manualPay } from "config/constants";
import PermissionGuard from "components/$widgets/permission/permissionGuard";

const ActionBtn = (props) => {

    // getPaymentActionIcons
    const [params,setParams] = useState(props.params);
    const [status, setStatus] = useState(props.params.row.status);
    const [maxRefundAmount, setMaxRefundAmount] = useState(props.params.row.maxRefundAmount)
    const [isVisible, setIsVisible] = useState(false);
    const [val,setVal] = useState(false);
    const [isMiddle, setIsMiddle] = useState(false);
    const [hideRefundOptionForManualPay, setHideRefundOptionForManualPay] = useState(true);
    const txnMode = props.params.row.transactionMode;
    const { merchantType, loggedInMerchantID,selectedDataMerchantId, allowManualPayment} = props;
    const manualPaymentModes = [
        manualPay.manualPaymentModeCash,
        manualPay.manualPaymentModeCheque,
        manualPay.manualPaymentModeIntBankAccount
    ];
    const [allowMarkAsPaidToAdmin, setAllowMarkAsPaidToAdmin] = useState(false);
    const [disableRefundForManualPayment, setDisableRefundForManualPayment] = useState(false);
    const [showManualPayAdminAndParentMerchant, setShowManualPayAdminAndParentMerchant] = useState(false);

    useEffect(() => {

        setParams(props.params);
        setStatus(props.params.row.status);
        
        let dataElement = document.querySelector(`[data-ihideRefundOptionForManualPayd="${props.params.id}"]`);
        if (dataElement) {
            let data = dataElement.attributes["data-rowindex"];

            let len = document.querySelectorAll(".MuiDataGrid-virtualScrollerRenderZone > div");
            if(len && len.length > 2 && (data.nodeValue === `${len.length - 2}` || data.nodeValue === `${len.length - 1}`)){
                setVal(true);
            }else{
                setVal(false);
            }

            if(len && len.length == 3 && (data.nodeValue == `1`)){
                setIsMiddle(true);
            }else{
                setIsMiddle(false);
            }
        }

        let allowedStatus = ['AWAITING_PAYMENT', 'PARTIALLY_REFUNDED', 'REFUNDED', 'PAID', 'PARTIALLY_PAID']

        let isVisibleValue = allowedStatus.includes(status);

        if(isVisibleValue){
            setIsVisible(true);
        }

        if((status === "PAID" || status === "REFUNDED" ) && !props.allowRefundByScreen){
            setIsVisible(false);
        }

        if ((txnMode == manualPay.transactionModeManual && (status === "PAID"))) {
            setIsVisible(false);
        }

        if (manualPaymentModes.includes(params.row.paymentMode) && params.row.paymentConfirmationId == null
        ) {
            setHideRefundOptionForManualPay(false);
        }

        if(TempStorage.loginUserRole == USER_TYPE.ADMIN_USER &&( status == "AWAITING_PAYMENT" ||  status == 'PARTIALLY_PAID' ) && txnMode == manualPay.initialTransactionMode){
            setIsVisible(true);
            setAllowMarkAsPaidToAdmin(true);
        }

        if(TempStorage.loginUserRole !== USER_TYPE.ADMIN_USER  && TempStorage.userPrivilege[PrivilegeConstants.COPY_BP_TRANSACTION_Id]){
            setIsVisible(true);
        }

        //Show the manulpay option for admin and parent merchant
        if((loggedInMerchantID == params.row.merchantId) || (TempStorage.loginUserRole == USER_TYPE.ADMIN_USER && loggedInMerchantID != params.row.merchantId)){
            setShowManualPayAdminAndParentMerchant(true);
        }

    }, [props]);

    if (merchantType == OnboardConstants.ReferralMerchant) {
        return null;
    }

    return (
        <>  
            {isVisible && <>
                <div className="dropdown" style={{marginRight: '24px', overflow: 'visible'}}>
                    <button type="button" id={ "action-" + params.row.transactionId} className="transactionAction" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{display: 'flex', alignItems: 'center', color: '#1A1A1C', border: 'none', outline: 'none', background: "transparent"}}>
                        <FontAwesomeIcon icon={faEllipsisVertical} style={{fontSize: 'var(--font-medium)'}}/>
                    </button>
                    {/* <div className={isMiddle ? "dropdown-menu dropdown-menu-lg-x-middle-action-btn" : val ? (status == 'AWAITING_PAYMENT' ? "dropdown-menu dropdown-menu-lg-x-end-action-btn-down-aw" : "dropdown-menu dropdown-menu-lg-x-end-action-btn-down-pd") : "dropdown-menu dropdown-menu-lg-x-end-action-btn"} aria-labelledby="dropdownMenuButton" style={{padding: '4px', height: 'auto', minWidth: '245px', borderRadius: '4px', background: 'var(--light-color)', border: 'none', zIndex: '70'}}> */}
                    <div className={isMiddle ? "dropdown-menu dropdown-menu-lg-x-middle-action-btn" : val ? ("dropdown-menu dropdown-menu-lg-x-end-action-btn-down-pd") : "dropdown-menu dropdown-menu-lg-x-end-action-btn"} aria-labelledby="dropdownMenuButton" style={{padding: '4px', height: 'auto', minWidth: '245px', borderRadius: '4px', background: 'var(--light-color)', border: 'none', zIndex: '70'}}>
                      <ul style={{listStyle: 'none', padding: '0', width: '100%', margin: '0', zIndex: '70'}}>
                        {TempStorage.loginUserRole !== USER_TYPE.ADMIN_USER && 
                        <>
                            {loggedInMerchantID == params.row.merchantId && (txnMode == manualPay.transactionModeDigital || txnMode == manualPay.transactionModeBoth) && (status == 'AWAITING_PAYMENT' || status == 'PARTIALLY_PAID') && 
                            <>
                                <PermissionGuard userPermission={PrivilegeConstants.COPY_PAYMENT_LINK}>
                                    <li key={`${params.id}-copy`} style={{padding: '8px', width: '100%'}} onClick={() => { props.handleCopyClick(params.row.paymentURL); }}>
                                        <FontAwesomeIcon icon={faClipboard} style={{color: '#6654C3', marginRight: '18px'}} /> <span style={{fontSize: 'var(--font-small)', fontWeight: '500', color: '#495370'}}>Copy Payment Link</span>
                                    </li>
                                </PermissionGuard>
                            </>}
                        </>}
                        
                        {(
                            allowMarkAsPaidToAdmin
                            || txnMode == manualPay.transactionModeManual 
                            || txnMode == manualPay.transactionModeBoth 
                            || allowManualPayment == true 
                        ) && (status == 'AWAITING_PAYMENT' || status == "PARTIALLY_PAID") && showManualPayAdminAndParentMerchant &&
                        <>
                            <PermissionGuard userPermission={PrivilegeConstants.MARK_AS_PAID}>
                                <li key={`${params.id}-notification`} style={{padding: '8px', width: '100%'}} onClick={() => { props.manualPayClick(params.row) }}>
                                    <FontAwesomeIcon icon={faMoneyBill1Wave} style={{color: '#C3545B', marginRight: '18px'}} /> <span style={{fontSize: 'var(--font-small)', fontWeight: '500', color: '#495370'}}>Mark as Paid</span>
                                </li>
                            </PermissionGuard>
                        </>}

                        {loggedInMerchantID == params.row.merchantId && TempStorage.loginUserRole !== USER_TYPE.ADMIN_USER && props.allowCancellationByScreen && (status == 'AWAITING_PAYMENT') && 
                        <>
                            <PermissionGuard userPermission={PrivilegeConstants.CANCEL_PAYMENT}>
                                <li key={`${params.id}-cancel`} style={{padding: '8px', width: '100%'}} onClick={(e) => { (status == 'AWAITING_PAYMENT') ? props.refundClick(e, params.row) : ''}}>
                                    <FontAwesomeIcon icon={faCircleXmark} style={{color: '#CB4848', marginRight: '18px'}} /> <span style={{fontSize: 'var(--font-small)', fontWeight: '500', color: '#495370'}}>Cancel Payment</span>
                                </li>
                            </PermissionGuard>
                        </>}

                        {loggedInMerchantID == params.row.merchantId && hideRefundOptionForManualPay && props.allowRefundByScreen && !props.params.row.partiallyPaid && (status == 'PAID' || status == 'PARTIALLY_REFUNDED' || (status == "REFUNDED" && parseFloat(maxRefundAmount) != 0)) && 
                        <>
                            <PermissionGuard userPermission={PrivilegeConstants.REFUND_REQUEST}>
                                <li key={`${params.id}-refund`} style={{padding: '8px', width: '100%'}}                         
                                onClick={(e) => {
                                    if (status === 'PAID' || status === 'PARTIALLY_REFUNDED' || status === 'SETTLED' || status == 'REFUNDED') {
                                        props.setSelectedItem(params.row);
                                        props.refundClick(e, params.row);
                                    }
                                }}>
                                    <FontAwesomeIcon icon={faRotateLeft} style={{color: '#6EC56F', marginRight: '18px'}} /> <span style={{fontSize: 'var(--font-small)', fontWeight: '500', color: '#495370'}}>Initiate Refund</span>
                                </li>
                            </PermissionGuard>
                        </>}

                        {loggedInMerchantID == params.row.merchantId && (txnMode == manualPay.transactionModeDigital || txnMode == manualPay.transactionModeBoth) && (status == 'AWAITING_PAYMENT' || status == 'PARTIALLY_PAID') && 
                        <>
                            <PermissionGuard userPermission={PrivilegeConstants.SEND_PAYMENT_REMINDER}>
                                <li key={`${params.id}-notification`} style={{padding: '8px', width: '100%'}} onClick={() => { props.sendPaymentReminderBtn(params); }}>
                                    <FontAwesomeIcon icon={faBell} style={{color: '#C3545B', marginRight: '18px'}} /> <span style={{fontSize: 'var(--font-small)', fontWeight: '500', color: '#495370'}}>Send Payment Reminder</span>
                                </li>
                            </PermissionGuard>
                        </>}

                        <>
                            <PermissionGuard userPermission={PrivilegeConstants.COPY_BP_TRANSACTION_Id}>
                                <li key={`${params.id}-copy`} style={{padding: '8px', width: '100%'}} onClick={() => { props.handleCopyClick(params.row.transactionId); }}>
                                    <FontAwesomeIcon icon={faClipboard} style={{color: '#6654C3', marginRight: '18px'}} /> <span style={{fontSize: 'var(--font-small)', fontWeight: '500', color: '#495370'}}>Copy BenePay Transaction Id</span>
                                </li>
                            </PermissionGuard>
                        </>

                        {TempStorage.loginUserRole === USER_TYPE.ADMIN_USER && props.params.row.isManual && 
                        <>
                                <>
                                    <PermissionGuard userPermission={PrivilegeConstants.FIRC_FILE_UPLOAD}>
                                        <li key={`${params.id}-copy`} style={{ padding: '8px', width: '100%' }} onClick={() => { props.handleFirc(params.row.transactionId);  }}>
                                            <FontAwesomeIcon icon={faUpload} style={{ color: '#6654C3', marginRight: '18px' }} /> <span style={{ fontSize: 'var(--font-small)', fontWeight: '500', color: '#495370' }}>Upload FIRC</span>
                                        </li>
                                    </PermissionGuard>
                                </>
                        </>}

                      </ul>
                    </div>
                </div>
            </>}
        </>
    );

};

export default ActionBtn;