import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faHourglassHalf, faCheck, faMoneyBillTransfer, faXmark, faCalendarXmark, faHandHoldingDollar, faMoneyBillTrendUp } from '@fortawesome/free-solid-svg-icons';

const StatusIconCreator = (props) => {

    const [chip,setChip] = useState(null);

    useEffect(() => {

        let chip = {};

        switch (props.status) {
            case 'PAID':
                chip.chipColor = 'black';
                chip.chipBgColor = '#90EE90';
                chip.chipLabel = 'Paid';
                chip.chipIcon = faCheck;
                break
            case 'PARTIALLY_PAID':
                chip.chipColor = 'black';
                chip.chipBgColor = '#90EE90';
                chip.chipLabel = 'Partially Paid';
                chip.chipIcon = faCheck;
                break
            case 'AWAITING_PAYMENT':
                chip.chipColor = 'var(--light-color)';
                chip.chipBgColor = 'var(--secondary-color)';
                chip.chipLabel = 'Awaiting Payment';
                chip.chipIcon = faHourglassHalf;
                break
            case 'FULLY_REFUNDED':
                chip.chipColor = 'white';
                chip.chipBgColor = 'rgb(200 134 10)';
                chip.chipLabel = 'Fully Refunded';
                chip.chipIcon = faMoneyBillTransfer;
                break
            case 'CANCELLED':
                chip.chipColor = 'white';
                chip.chipBgColor = '#F34747';
                chip.chipLabel = 'Cancelled';
                chip.chipIcon = faXmark;
                break
            case 'PARTIALLY_REFUNDED':
                chip.chipColor = 'white';
                chip.chipBgColor = '#edb64f';
                chip.chipLabel = 'Partially Refunded';
                chip.chipIcon = faMoneyBillTrendUp;
                break
            case 'EXPIRED':
                chip.chipColor = 'white';
                chip.chipBgColor = '#FF7276';
                chip.chipLabel = 'Expired';
                chip.chipIcon = faBan;
                break
            case 'SETTLED':
                chip.chipColor = 'white';
                chip.chipBgColor = 'rgb(8 171 8)';
                chip.chipLabel = 'Settled';
                chip.chipIcon = faHandHoldingDollar;
                break
            case 'NOT SETTLED':
                chip.chipColor = 'white';
                chip.chipBgColor = 'rgb(255 153 72)';
                chip.chipLabel = 'Not Settled';
                chip.chipIcon = faHandHoldingDollar;
                break
            case 'SUCCESS':
                chip.chipColor = 'black';
                chip.chipBgColor = '#a7daa2';
                chip.chipLabel = 'Success';
                chip.chipIcon = faCheck;
                break
            case 'REFUNDED':
                chip.chipColor = 'white';
                chip.chipBgColor = 'gray';
                chip.chipLabel = 'Refunded';
                chip.chipIcon = faMoneyBillTransfer;
                break
            case 'IN_PROCESS':
                chip.chipColor = 'white';
                chip.chipBgColor = 'blue';
                chip.chipLabel = 'In Process';
                chip.chipIcon = faMoneyBillTransfer;
                break
            case 'FAILED':
                chip.chipColor = 'white';
                chip.chipBgColor = 'orange';
                chip.chipLabel = 'FAILED';
                chip.chipIcon = faMoneyBillTransfer;
                break
            default:
                break;
        }

        setChip(chip);

    }, [props]);


    return (
        <>  
            {chip && chip.chipIcon ? <> 
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                <div style={{height: "28px", width: '28px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: chip.chipBgColor, borderRadius: '100%', marginRight: '8px'}}>
                    <FontAwesomeIcon icon={chip.chipIcon} style={{width: '16px', aspectRatio: 'auto', color: 'white'}} />
                </div>
                <p style={{fontSize: 'var(--font-x-medium)', color: 'var(--primary-color)', marginTop: '18px'}}>{chip.chipLabel}</p>
            </div>
            </> : 
            <>
                <p>-</p>
            </>
            }
        </>
    );

};

export default StatusIconCreator;