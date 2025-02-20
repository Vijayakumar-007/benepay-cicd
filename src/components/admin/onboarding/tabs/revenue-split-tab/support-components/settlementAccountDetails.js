import { Typography } from "@material-ui/core";


const SettlementAccountDetails = ({ data }) => {

    return <>
        {data.bank && <>
            <Typography
                variant="body1"
                fontSize={12}
                fontWeight={500}
                style={{ color: "#6654C3", fontSize: '15px', marginTop: '4px' }}
            >
                {data.bank}
            </Typography>
        </>}
        {data.ifsc && <>
            <Typography
                variant="body1"
                fontSize={12}
                fontWeight={500}
                style={{ color: "#6654C3", fontSize: '15px' }}
            >
                IFSC - {data.ifsc}
            </Typography>
        </>}
        {data.accNo && <>
            <Typography
                variant="body1"
                fontSize={12}
                fontWeight={500}
                style={{ color: "#6654C3", fontSize: '15px' }}
            >
                A/C No - {data.accNo}
            </Typography>
        </>}
    </>
}

export default SettlementAccountDetails;